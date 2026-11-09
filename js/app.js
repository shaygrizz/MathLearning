// Navigazione (hash), pagine e sessioni di esercizi.
import { getLang, setLang, t, u } from './i18n.js';
import { store } from './store.js';
import { md, parseAnswer, close } from './mathfmt.js';
import { TOPICS, INTRO } from './content.js';
import { make, ALL_PRACTICE, DIAG } from './problems.js';
import { mountScene } from './scenes.js';
import { Graph } from './graph.js';

const app = document.getElementById('app');
let cleanup = [];
const onLeave = (f) => cleanup.push(f);
const shuffle = (a) => { for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
const topicOf = (id) => TOPICS.find((x) => x.id === id);
const stageId = (tp, i) => `${tp.id}.${i}`;

// ---------- esercizio singolo ----------
// mode 'practice': suggerimenti e più tentativi; 'test': un tentativo, niente aiuti.
function renderProblem(root, p, mode, done) {
  let tries = 0, hintIdx = 0, helped = false, finished = false, graph = null;
  root.innerHTML = `
    <div class="q">${md(t(p.q))}</div>
    ${p.graph ? '<div class="scene" style="margin-top:.7rem"><div class="g"></div></div>' : ''}
    <div class="answer"></div>
    <div class="fb" aria-live="polite"></div>
    <div class="actions"></div>`;
  const ans = root.querySelector('.answer'), fb = root.querySelector('.fb'), act = root.querySelector('.actions');
  if (p.graph) {
    graph = new Graph(root.querySelector('.g'), { R: p.range || 8 });
    graph.onDraw = p.graph;
    graph.update();
    onLeave(() => graph?.dispose());
  }
  const end = (ok) => {
    if (finished) return;
    finished = true;
    const clean = ok && tries === 0 && !helped;
    fb.className = 'fb ' + (ok ? 'ok' : 'bad');
    fb.innerHTML = `<b>${ok ? u('right') : u('wrong')}</b><div class="sol"><b>${u('solution')}.</b> ${md(t(p.sol))}</div>`;
    act.innerHTML = '';
    const nx = Object.assign(document.createElement('button'), { className: 'btn wide', textContent: u('nextQ') });
    nx.onclick = () => { graph?.dispose(); graph = null; done({ ok, clean }); };
    act.appendChild(nx);
    nx.focus({ preventScroll: true });
    fb.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
  };
  const retry = () => {
    tries++;
    if (mode === 'test' || tries >= 2) return true; // rivela la soluzione
    fb.className = 'fb bad';
    fb.textContent = u('wrongRetry');
    return false;
  };
  const helpers = () => {
    if (mode === 'test') return;
    if (p.hints?.length) {
      const hb = Object.assign(document.createElement('button'), { className: 'btn ghost', textContent: u('hint') });
      hb.onclick = () => {
        helped = true;
        fb.className = 'fb hint';
        fb.innerHTML = md(t(p.hints[hintIdx]));
        hintIdx = Math.min(hintIdx + 1, p.hints.length - 1);
      };
      act.appendChild(hb);
    }
    const sb = Object.assign(document.createElement('button'), { className: 'btn ghost', textContent: u('showSol') });
    sb.onclick = () => { helped = true; lock(); end(false); };
    act.appendChild(sb);
  };
  let lock = () => {};

  if (p.choices) {
    const box = document.createElement('div');
    box.className = 'choices';
    p.choices.forEach((c, i) => {
      const b = Object.assign(document.createElement('button'), { className: 'choice', innerHTML: md(t(c)) });
      b.onclick = () => {
        if (finished) return;
        if (i === p.correct) { b.classList.add('right'); lock(); end(true); }
        else {
          b.classList.add('wrong'); b.disabled = true;
          if (retry()) { box.children[p.correct].classList.add('right'); lock(); end(false); }
        }
      };
      box.appendChild(b);
    });
    lock = () => [...box.children].forEach((b) => (b.disabled = true));
    ans.appendChild(box);
    helpers();
  } else {
    const box = document.createElement('div');
    box.className = 'fields';
    const inputs = p.fields.map((f) => {
      const lab = document.createElement('label');
      lab.innerHTML = `<span>${md(`$${f.label}=$`)}</span>`;
      const inp = Object.assign(document.createElement('input'), { type: 'text', inputMode: 'text', autocomplete: 'off', autocapitalize: 'off', spellcheck: false });
      inp.setAttribute('enterkeyhint', 'done');
      lab.appendChild(inp);
      box.appendChild(lab);
      return inp;
    });
    ans.appendChild(box);
    ans.appendChild(Object.assign(document.createElement('div'), { className: 'tip', textContent: u('inputTip') }));
    lock = () => inputs.forEach((i) => (i.disabled = true));
    const check = () => {
      if (finished) return;
      const vals = inputs.map((i) => parseAnswer(i.value));
      if (vals.some(Number.isNaN)) { fb.className = 'fb hint'; fb.textContent = u('fill'); return; }
      let marks;
      if (p.unordered) {
        const want = p.fields.map((f) => f.ans), used = want.map(() => false);
        marks = vals.map((v) => { const k = want.findIndex((w, j) => !used[j] && close(v, w)); if (k < 0) return false; used[k] = true; return true; });
      } else marks = vals.map((v, i) => close(v, p.fields[i].ans));
      inputs.forEach((inp, i) => { inp.classList.toggle('right', marks[i]); inp.classList.toggle('wrong', !marks[i]); });
      if (marks.every(Boolean)) { lock(); end(true); }
      else if (retry()) { lock(); end(false); }
    };
    inputs.forEach((inp, i) => inp.addEventListener('keydown', (e) => {
      if (e.key !== 'Enter') return;
      e.preventDefault();
      if (inputs[i + 1]) inputs[i + 1].focus(); else check();
    }));
    const cb = Object.assign(document.createElement('button'), { className: 'btn', textContent: u('check') });
    cb.onclick = check;
    act.appendChild(cb);
    helpers();
  }
}

// ---------- sessione di più esercizi ----------
function session(root, { gens, mode = 'practice', onEnd }) {
  let i = 0, score = 0;
  const step = () => {
    if (i >= gens.length) return onEnd({ score, total: gens.length });
    const p = make(gens[i]);
    root.innerHTML = `<div class="count">${u('q')} ${i + 1} ${u('of')} ${gens.length}</div><div class="prob"></div>`;
    renderProblem(root.querySelector('.prob'), p, mode, ({ ok, clean }) => {
      if (ok) score++;
      if (clean) store.pass(p.id); else store.fail(p.id);
      i++;
      step();
      window.scrollTo({ top: 0 });
    });
  };
  step();
}

function resultCard(root, { score, total }, extra = '', buttons = '') {
  const pct = Math.round((score / total) * 100);
  root.innerHTML = `<div class="center"><div class="tag">${u('result')}</div><div class="score">${score}/${total}</div>
    <p>${extra}</p>${score < total ? `<p class="lead">${u('toReview')}</p>` : ''}</div><div class="actions">${buttons}</div>`;
  return pct;
}

// ---------- pagine ----------
function home() {
  const due = store.due().length;
  const tiles = TOPICS.map((tp) => {
    const n = tp.stages.filter((_, i) => store.isDone(stageId(tp, i))).length;
    const best = store.best(tp.id);
    return `<a class="card tile" href="#/t/${tp.id}"><div class="row"><h2>${t(tp.title)}</h2>${best != null ? `<span class="badge">${best}%</span>` : ''}</div>
      <p>${t(tp.lead)}</p><div class="bar"><i style="width:${(n / tp.stages.length) * 100}%"></i></div></a>`;
  }).join('');
  app.innerHTML = `
    <h1>${u('homeTitle')}</h1><p class="lead">${u('homeLead')}</p>
    <div class="tiles">
      <a class="card tile" href="#/diag"><div class="row"><h2>${u('diag')}</h2>${store.diagDone() ? `<span class="badge">${u('diagDone')}</span>` : ''}</div><p>${u('diagLead')}</p></a>
      <a class="card tile" href="#/intro"><h2>${u('intro')}</h2><p>${u('introLead')}</p></a>
      ${tiles}
      <div class="two">
        <a class="card tile" href="#/mix"><h2>${u('mix')}</h2><p>${u('mixLead')}</p></a>
        <a class="card tile" href="#/review"><div class="row"><h2>${u('review')}</h2>${due ? `<span class="badge">${due}</span>` : ''}</div><p>${u('reviewLead')}</p></a>
      </div>
    </div>
    <footer class="note">${u('footer')}</footer>`;
}

function intro() {
  app.innerHTML = `<a class="crumb" href="#/">${u('home')}</a><h1>${u('intro')}</h1>
    <div class="card"><div id="sc"></div></div><div class="card theory">${t(INTRO.text)}</div>
    <a class="btn wide" href="#/t/circ">${t(TOPICS[0].title)} →</a>`;
  onLeave(mountScene('cone', app.querySelector('#sc')));
}

function topic(id) {
  const tp = topicOf(id);
  if (!tp) return home();
  const best = store.best(tp.id);
  app.innerHTML = `<a class="crumb" href="#/">${u('home')}</a><h1>${t(tp.title)}</h1><p class="lead">${t(tp.lead)}</p>
    <h3>${u('stages')}</h3>
    <ol class="stage-list">${tp.stages.map((s, i) => `<li class="${store.isDone(stageId(tp, i)) ? 'done' : ''}"><a href="#/t/${tp.id}/s/${i}"><span class="n">${store.isDone(stageId(tp, i)) ? '✓' : i + 1}</span><span>${md(t(s.title))}</span></a></li>`).join('')}</ol>
    <div class="card" style="margin-top:1rem"><div class="tile"><div class="row"><h2>${u('test')}</h2>${best != null ? `<span class="badge">${u('best')}: ${best}%</span>` : ''}</div><p>${u('testLead')}</p></div>
    <div class="actions"><a class="btn" href="#/t/${tp.id}/test">${u('test')} →</a></div></div>`;
}

function stage(id, idx) {
  const tp = topicOf(id), st = tp?.stages[idx];
  if (!st) return home();
  let step = 0, predicted = null;
  const names = ['sPredict', 'sExplore', 'sLearn', 'sPractice'];
  app.innerHTML = `<a class="crumb" href="#/t/${tp.id}">← ${t(tp.title)}</a><h2>${md(t(st.title))}</h2><ol class="steps"></ol><div class="card" id="body"></div>`;
  const body = app.querySelector('#body'), bar = app.querySelector('.steps');
  let sceneOff = null;
  const go = (n) => {
    sceneOff?.(); sceneOff = null;
    step = n;
    bar.innerHTML = names.map((k, i) => `<li class="${i === step ? 'on' : i < step ? 'past' : ''}">${u(k)}</li>`).join('');
    views[step]();
    window.scrollTo({ top: 0 });
  };
  const nextBtn = (label, n) => { const b = Object.assign(document.createElement('button'), { className: 'btn wide', textContent: label }); b.onclick = () => go(n); return b; };
  const views = [
    () => {
      body.innerHTML = `<div class="tag">${u('predictHead')}</div><div class="q">${md(t(st.predict.q))}</div><div class="choices"></div><div class="fb"></div><div class="actions"></div>`;
      const box = body.querySelector('.choices');
      st.predict.choices.forEach((c, i) => {
        const b = Object.assign(document.createElement('button'), { className: 'choice', innerHTML: md(t(c)) });
        b.onclick = () => {
          predicted = i;
          [...box.children].forEach((x, j) => x.classList.toggle('sel', j === i));
          body.querySelector('.fb').className = 'fb hint';
          body.querySelector('.fb').textContent = u('predictSaved');
          const a = body.querySelector('.actions');
          a.innerHTML = '';
          a.appendChild(nextBtn(u('sExplore') + ' →', 1));
        };
        box.appendChild(b);
      });
    },
    () => {
      body.innerHTML = `<div id="sc"></div><h3 style="margin-top:1rem">${u('tryIt')}</h3><ul class="missions">${st.missions.map((m) => `<li>${md(t(m))}</li>`).join('')}</ul><div class="actions"></div>`;
      sceneOff = mountScene(st.scene, body.querySelector('#sc'));
      body.querySelector('.actions').appendChild(nextBtn(u('next') + ' →', 2));
    },
    () => {
      const pr = predicted == null ? '' : `<div class="pred ${predicted === st.predict.correct ? 'ok' : 'bad'}"><b>${predicted === st.predict.correct ? u('predOk') : u('predBad')}</b> ${md(t(st.predict.why))}</div>`;
      body.innerHTML = `${pr}<div class="theory">${md(t(st.theory))}<div class="box ex"><h3>${u('example')}</h3>${md(t(st.example))}</div></div><div class="actions"></div>`;
      body.querySelector('.actions').appendChild(nextBtn(u('toPractice') + ' →', 3));
    },
    () => {
      session(body, {
        gens: st.practice,
        onEnd: (res) => {
          store.markDone(stageId(tp, idx));
          const more = idx + 1 < tp.stages.length;
          resultCard(body, res, u('stageDone'),
            (more ? `<a class="btn" href="#/t/${tp.id}/s/${idx + 1}">${u('nextStage')} →</a>` : `<a class="btn" href="#/t/${tp.id}/test">${u('test')} →</a>`) +
            `<a class="btn ghost" href="#/t/${tp.id}">${u('toTopic')}</a>`);
        },
      });
    },
  ];
  onLeave(() => sceneOff?.());
  go(0);
}

function test(id) {
  const tp = topicOf(id);
  if (!tp) return home();
  app.innerHTML = `<a class="crumb" href="#/t/${tp.id}">← ${t(tp.title)}</a><h2>${u('test')}: ${t(tp.title)}</h2><div class="card" id="body"></div>`;
  const body = app.querySelector('#body');
  session(body, {
    gens: shuffle([...tp.test]), mode: 'test',
    onEnd: (res) => {
      const pct = Math.round((res.score / res.total) * 100);
      store.setTest(tp.id, pct);
      resultCard(body, res, `${pct}% — ${pct >= 70 ? u('passed') : u('failed')}`,
        `<a class="btn" href="#/t/${tp.id}">${u('toTopic')}</a><button class="btn ghost" id="again">${u('again')}</button>`);
      body.querySelector('#again').onclick = () => route();
    },
  });
}

function quiz(titleKey, gens, after) {
  app.innerHTML = `<a class="crumb" href="#/">${u('home')}</a><h2>${u(titleKey)}</h2><div class="card" id="body"></div>`;
  const body = app.querySelector('#body');
  session(body, {
    gens,
    onEnd: (res) => {
      after?.();
      resultCard(body, res, '', `<a class="btn" href="#/">${u('home').replace('← ', '')}</a><button class="btn ghost" id="again">${u('again')}</button>`);
      body.querySelector('#again').onclick = () => route();
    },
  });
}

function review(force) {
  const due = store.due(), pending = store.pending();
  const list = force ? pending : due;
  if (list.length) return quiz('review', shuffle([...list]).slice(0, 8));
  app.innerHTML = `<a class="crumb" href="#/">${u('home')}</a><h2>${u('review')}</h2><div class="card"><p>${u('reviewNone')}</p><p class="lead">${u('reviewLead')}</p>
    ${pending.length ? `<p>${u('reviewPending')}: ${pending.length}</p><div class="actions"><a class="btn ghost" href="#/review/all">${u('reviewEarly')}</a></div>` : ''}</div>`;
}

// ---------- router ----------
function route() {
  cleanup.forEach((f) => { try { f(); } catch {} });
  cleanup = [];
  const parts = location.hash.replace(/^#\/?/, '').split('/').filter(Boolean);
  document.querySelectorAll('.lang button').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.lang === getLang())));
  document.getElementById('brand-text').textContent = u('brand');
  if (parts[0] === 't' && parts[2] === 's') stage(parts[1], +parts[3]);
  else if (parts[0] === 't' && parts[2] === 'test') test(parts[1]);
  else if (parts[0] === 't') topic(parts[1]);
  else if (parts[0] === 'intro') intro();
  else if (parts[0] === 'diag') quiz('diag', DIAG, () => store.setDiag());
  else if (parts[0] === 'mix') quiz('mix', shuffle([...ALL_PRACTICE]).slice(0, 8));
  else if (parts[0] === 'review') review(parts[1] === 'all');
  else home();
  window.scrollTo({ top: 0 });
}

document.querySelectorAll('.lang button').forEach((b) => (b.onclick = () => { setLang(b.dataset.lang); route(); }));
setLang(getLang());
window.addEventListener('hashchange', route);
route();
