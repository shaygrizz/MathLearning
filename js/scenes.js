// Figure interattive: ogni scena restituisce una funzione per liberare le risorse.
import * as THREE from '../vendor/three/three.bundle.min.js';
import { Graph } from './graph.js';
import { L, t, u } from './i18n.js';
import { md, num, sq, sgn, poly, pt } from './mathfmt.js';

const R = String.raw;
// coefficiente davanti a una lettera: 1 -> '', -1 -> '-'
const cf = (a) => (a === 1 ? '' : a === -1 ? '-' : num(a));
const lineEq = (m, q) => 'y=' + (m === 0 ? num(q) : `${cf(m)}x` + (q === 0 ? '' : `${q < 0 ? '-' : '+'}${num(Math.abs(q))}`));

// pannello generico: grafico + lettura + cursori
function panel(root, { range = 8, sliders = [], toggles = [], draw }) {
  root.innerHTML = '<div class="scene"><div class="g"></div><div class="readout"></div><div class="controls"></div></div>';
  const gEl = root.querySelector('.g'), out = root.querySelector('.readout'), ctl = root.querySelector('.controls');
  const v = {};
  let g;
  const refresh = () => g && g.update();
  for (const tg of toggles) {
    v[tg.id] = tg.val ?? 0;
    const box = document.createElement('div');
    box.className = 'seg';
    tg.options.forEach((o, i) => {
      const b = document.createElement('button');
      b.type = 'button';
      b.innerHTML = md(t(o));
      b.setAttribute('aria-pressed', String(i === v[tg.id]));
      b.onclick = () => { v[tg.id] = i; [...box.children].forEach((c, j) => c.setAttribute('aria-pressed', String(j === i))); refresh(); };
      box.appendChild(b);
    });
    ctl.appendChild(box);
  }
  for (const s of sliders) {
    v[s.id] = s.val;
    const row = document.createElement('label');
    row.className = 'ctl';
    const name = document.createElement('span');
    name.className = 'name';
    const inp = Object.assign(document.createElement('input'), { type: 'range', min: s.min, max: s.max, step: s.step ?? 1, value: s.val });
    const show = () => { name.innerHTML = md(`$${s.tex} = ${num(v[s.id])}${s.unit ?? ''}$`); };
    inp.addEventListener('input', () => { v[s.id] = parseFloat(inp.value); show(); refresh(); });
    show();
    row.append(name, inp);
    ctl.appendChild(row);
  }
  g = new Graph(gEl, { R: range });
  g.onDraw = () => { out.innerHTML = md(t(draw(g, v))); };
  g.update();
  return () => g.dispose();
}

const scenes = {
  // --- circonferenza ---
  'circ-std': (root) => panel(root, {
    range: 8,
    sliders: [
      { id: 'a', tex: 'a', min: -4, max: 4, val: 1 },
      { id: 'b', tex: 'b', min: -4, max: 4, val: 1 },
      { id: 'r', tex: 'r', min: 1, max: 5, val: 3 },
      { id: 'th', tex: R`\theta`, unit: '°', min: 0, max: 360, step: 5, val: 40 },
    ],
    draw(g, { a, b, r, th }) {
      const px = a + r * Math.cos((th * Math.PI) / 180), py = b + r * Math.sin((th * Math.PI) / 180);
      g.circle(a, b, r);
      g.seg([a, b], [px, py], 'c3', 2.2);
      g.point(a, b, 'c2'); g.label(a, b, 'C', -16, 6);
      g.point(px, py, 'c3'); g.label(px, py, 'P', 8, -18);
      const d = Math.hypot(px - a, py - b);
      return L(
        `$$${sq('x', a)}+${sq('y', b)}=${r * r}$$Centro $C${pt(a, b)}$, raggio $r=${r}$. Distanza $CP=${num(d)}$: resta uguale a $r$ ovunque sia $P$.`,
        `$$${sq('x', a)}+${sq('y', b)}=${r * r}$$Центр $C${pt(a, b)}$, радиус $r=${r}$. Расстояние $CP=${num(d)}$ равно $r$ при любом положении $P$.`);
    },
  }),
  'circ-gen': (root) => panel(root, {
    range: 8,
    sliders: [
      { id: 'a', tex: 'a', min: -8, max: 8, step: 2, val: -4 },
      { id: 'b', tex: 'b', min: -8, max: 8, step: 2, val: 2 },
      { id: 'c', tex: 'c', min: -12, max: 12, val: -4 },
    ],
    draw(g, { a, b, c }) {
      const al = -a / 2, be = -b / 2, r2 = al * al + be * be - c;
      const eq = `$$${poly([[1, 'x^2'], [1, 'y^2'], [a, 'x'], [b, 'y'], [c, '']])}=0$$`;
      const calc = `$\\alpha^2+\\beta^2-c=${al * al}+${be * be}${sgn(-c)}=${r2}$`;
      if (r2 > 0) {
        g.circle(al, be, Math.sqrt(r2));
        g.point(al, be, 'c2'); g.label(al, be, 'C');
        return L(`${eq}Centro $C${pt(al, be)}$. ${calc}, quindi $r=\\sqrt{${r2}}\\approx${num(Math.sqrt(r2))}$.`,
                 `${eq}Центр $C${pt(al, be)}$. ${calc}, значит $r=\\sqrt{${r2}}\\approx${num(Math.sqrt(r2))}$.`);
      }
      if (r2 === 0) {
        g.point(al, be, 'c2');
        return L(`${eq}${calc}: il raggio è zero, resta <b class="k">un solo punto</b>.`, `${eq}${calc}: радиус равен нулю, остаётся <b class="k">одна точка</b>.`);
      }
      return L(`${eq}${calc} è negativo: <b class="k">nessuna circonferenza</b> reale.`, `${eq}${calc} отрицательно: <b class="k">окружности нет</b>.`);
    },
  }),
  'circ-line': (root) => panel(root, {
    range: 7,
    sliders: [
      { id: 'm', tex: 'm', min: -2, max: 2, step: 0.5, val: 0 },
      { id: 'q', tex: 'q', min: -6, max: 6, step: 0.5, val: 1.5 },
    ],
    draw(g, { m, q }) {
      const r = 3, den = 1 + m * m, d = Math.abs(q) / Math.sqrt(den);
      g.circle(0, 0, r);
      g.line(m, q, 'c2', false, 2.6);
      const hx = (-m * q) / den, hy = q / den; // piede della perpendicolare da O
      g.seg([0, 0], [hx, hy], 'c3', 2, true);
      g.point(0, 0, 'c3'); g.label(0, 0, 'C', 6, 4);
      const disc = r * r * den - q * q;
      let kind;
      if (Math.abs(d - r) < 1e-9) { kind = L('tangente: 1 punto in comune', 'касательная: 1 общая точка'); g.point(hx, hy, 'c2'); }
      else if (d < r) {
        kind = L('secante: 2 punti in comune', 'секущая: 2 общие точки');
        for (const s of [1, -1]) { const x = (-m * q + s * Math.sqrt(disc)) / den; g.point(x, m * x + q, 'c2'); }
      } else kind = L('esterna: nessun punto in comune', 'внешняя: общих точек нет');
      const cmp = Math.abs(d - r) < 1e-9 ? '=' : d < r ? '<' : '>';
      return L(`Circonferenza $x^2+y^2=9$, retta $${lineEq(m, q)}$<br>Distanza dal centro $d=${num(d)}$, raggio $r=3$: $d${cmp}r$ → <b class="k">${kind.it}</b>.`,
               `Окружность $x^2+y^2=9$, прямая $${lineEq(m, q)}$<br>Расстояние от центра $d=${num(d)}$, радиус $r=3$: $d${cmp}r$ → <b class="k">${kind.ru}</b>.`);
    },
  }),

  // --- parabola ---
  'par-focus': (root) => panel(root, {
    range: 6,
    sliders: [
      { id: 'a', tex: 'a', min: -2, max: 2, step: 0.25, val: 0.5 },
      { id: 'x', tex: 'x_P', min: -4, max: 4, step: 0.25, val: 2 },
    ],
    draw(g, { a, x }) {
      if (a === 0) { g.fn(() => 0); return L('Con $a=0$ resta $y=0$: una retta, non una parabola.', 'При $a=0$ остаётся $y=0$: прямая, а не парабола.'); }
      const f = 1 / (4 * a), y = a * x * x;
      g.fn((s) => a * s * s);
      g.hline(-f, 'c3', true);
      g.seg([x, y], [0, f], 'c2', 2.2);
      g.seg([x, y], [x, -f], 'c3', 2.2);
      g.point(0, f, 'c2'); g.label(0, f, 'F');
      g.point(x, -f, 'c3'); g.label(x, -f, 'H', 6, 4);
      g.point(x, y, 'c1'); g.label(x, y, 'P');
      const d1 = Math.hypot(x, y - f), d2 = Math.abs(y + f);
      return L(`$y=${cf(a)}x^2$: fuoco $F${pt(0, num(f))}$, direttrice $y=${num(-f)}$.<br>$PF=${num(d1)}$ e $PH=${num(d2)}$: <b class="k">sempre uguali</b>.`,
               `$y=${cf(a)}x^2$: фокус $F${pt(0, num(f))}$, директриса $y=${num(-f)}$.<br>$PF=${num(d1)}$ и $PH=${num(d2)}$: <b class="k">всегда равны</b>.`);
    },
  }),
  'par-abc': (root) => panel(root, {
    range: 8,
    sliders: [
      { id: 'a', tex: 'a', min: -2, max: 2, step: 0.5, val: 1 },
      { id: 'b', tex: 'b', min: -6, max: 6, val: -2 },
      { id: 'c', tex: 'c', min: -6, max: 6, val: -1 },
    ],
    draw(g, { a, b, c }) {
      const eq = `$y=${cf(a)}x^2${b === 0 ? '' : (b < 0 ? '-' : '+') + cf(Math.abs(b)) + 'x'}${c === 0 ? '' : sgn(c)}$`;
      if (a === 0) { g.line(b, c, 'c1', false, 2.8); return L(`${eq}: con $a=0$ è una retta.`, `${eq}: при $a=0$ это прямая.`); }
      const xv = -b / (2 * a), yv = c - (b * b) / (4 * a);
      g.fn((x) => a * x * x + b * x + c);
      g.vline(xv, 'c3', true);
      g.point(0, c, 'c3'); g.label(0, c, 'c');
      g.point(xv, yv, 'c2'); g.label(xv, yv, 'V', 8, a > 0 ? 6 : -18);
      return L(`${eq}<br>Vertice $V${pt(num(xv), num(yv))}$, asse $x=${num(xv)}$, concavità verso ${a > 0 ? "l'alto" : 'il basso'}. Taglia l'asse $y$ in $${c}$.`,
               `${eq}<br>Вершина $V${pt(num(xv), num(yv))}$, ось $x=${num(xv)}$, ветви ${a > 0 ? 'вверх' : 'вниз'}. Пересекает ось $y$ в точке $${c}$.`);
    },
  }),
  'par-delta': (root) => panel(root, {
    range: 7,
    sliders: [{ id: 'c', tex: 'c', min: -3, max: 6, step: 0.5, val: 1 }],
    draw(g, { c }) {
      const D = 4 - 4 * c;
      g.fn((x) => x * x - 2 * x + c);
      g.point(1, c - 1, 'c3'); g.label(1, c - 1, 'V', 8, 6);
      let msg;
      if (D > 0) {
        const s = Math.sqrt(D) / 2;
        g.point(1 - s, 0, 'c2'); g.point(1 + s, 0, 'c2');
        msg = L(`$\\Delta>0$: <b class="k">due zeri</b>, $x_1=${num(1 - s)}$ e $x_2=${num(1 + s)}$.`, `$\\Delta>0$: <b class="k">два нуля</b>, $x_1=${num(1 - s)}$ и $x_2=${num(1 + s)}$.`);
      } else if (D === 0) {
        g.point(1, 0, 'c2');
        msg = L(`$\\Delta=0$: <b class="k">uno zero</b>, la parabola è tangente all'asse $x$.`, `$\\Delta=0$: <b class="k">один нуль</b>, парабола касается оси $x$.`);
      } else msg = L(`$\\Delta<0$: <b class="k">nessuno zero</b>, la parabola non tocca l'asse $x$.`, `$\\Delta<0$: <b class="k">нулей нет</b>, парабола не касается оси $x$.`);
      const eq = `$y=x^2-2x${c < 0 ? '-' : '+'}${num(Math.abs(c))}$, $\\Delta=b^2-4ac=4-4\\cdot(${num(c)})=${num(D)}$.<br>`;
      return L(eq + msg.it, eq + msg.ru);
    },
  }),

  // --- iperbole ---
  'hyp-std': (root) => panel(root, {
    range: 10,
    sliders: [
      { id: 'a', tex: 'a', min: 1, max: 5, val: 3 },
      { id: 'b', tex: 'b', min: 1, max: 5, val: 2 },
      { id: 's', tex: 'P', min: -1.6, max: 1.6, step: 0.1, val: 0.8 },
    ],
    draw(g, { a, b, s }) {
      const c = Math.sqrt(a * a + b * b), px = a * Math.cosh(s), py = b * Math.sinh(s);
      g.line(b / a, 0, 'c3', true); g.line(-b / a, 0, 'c3', true);
      g.path([[a, b], [-a, b], [-a, -b], [a, -b], [a, b]], 'c3', 1.4, 0.6);
      g.hyperbola(a, b);
      g.seg([px, py], [-c, 0], 'c2', 2); g.seg([px, py], [c, 0], 'c2', 2);
      g.point(a, 0, 'c1'); g.point(-a, 0, 'c1');
      g.point(-c, 0, 'c2'); g.label(-c, 0, 'F₁', -8, 6);
      g.point(c, 0, 'c2'); g.label(c, 0, 'F₂', -4, 6);
      g.point(px, py, 'c3'); g.label(px, py, 'P');
      const d1 = Math.hypot(px + c, py), d2 = Math.hypot(px - c, py);
      const eq = `$$\\frac{x^2}{${a * a}}-\\frac{y^2}{${b * b}}=1$$`;
      return L(`${eq}$c=\\sqrt{${a * a}+${b * b}}\\approx${num(c)}$. $PF_1-PF_2=${num(d1)}-${num(d2)}=${num(d1 - d2)}$: <b class="k">sempre $2a=${2 * a}$</b>.`,
               `${eq}$c=\\sqrt{${a * a}+${b * b}}\\approx${num(c)}$. $PF_1-PF_2=${num(d1)}-${num(d2)}=${num(d1 - d2)}$: <b class="k">всегда $2a=${2 * a}$</b>.`);
    },
  }),
  'hyp-orient': (root) => panel(root, {
    range: 10,
    toggles: [{ id: 'v', val: 0, options: [L('Fuochi su $x$', 'Фокусы на $x$'), L('Fuochi su $y$', 'Фокусы на $y$')] }],
    sliders: [
      { id: 'a', tex: 'a', min: 1, max: 5, val: 2 },
      { id: 'b', tex: 'b', min: 1, max: 5, val: 3 },
    ],
    draw(g, { a, b, v }) {
      const c = Math.sqrt(a * a + b * b);
      g.line(b / a, 0, 'c3', true); g.line(-b / a, 0, 'c3', true);
      g.hyperbola(a, b, !!v);
      const e = v ? c / b : c / a;
      if (v) { g.point(0, c, 'c2'); g.point(0, -c, 'c2'); g.point(0, b, 'c1'); g.point(0, -b, 'c1'); g.label(0, c, 'F'); }
      else { g.point(c, 0, 'c2'); g.point(-c, 0, 'c2'); g.point(a, 0, 'c1'); g.point(-a, 0, 'c1'); g.label(c, 0, 'F'); }
      const eq = `$$\\frac{x^2}{${a * a}}-\\frac{y^2}{${b * b}}=${v ? '-1' : '1'}$$`;
      const ver = v ? `(0;\\,\\pm${b})` : `(\\pm${a};\\,0)`, foc = v ? `(0;\\,\\pm${num(c)})` : `(\\pm${num(c)};\\,0)`;
      const ef = v ? R`\frac{c}{b}` : R`\frac{c}{a}`;
      return L(`${eq}Vertici $${ver}$, fuochi $${foc}$, asintoti $y=\\pm\\frac{${b}}{${a}}x$. Eccentricità $e=${ef}\\approx${num(e)}$.`,
               `${eq}Вершины $${ver}$, фокусы $${foc}$, асимптоты $y=\\pm\\frac{${b}}{${a}}x$. Эксцентриситет $e=${ef}\\approx${num(e)}$.`);
    },
  }),
  'hyp-xy': (root) => panel(root, {
    range: 8,
    sliders: [
      { id: 'k', tex: 'k', min: -8, max: 8, val: 4 },
      { id: 'x', tex: 'x_P', min: 0.5, max: 6, step: 0.25, val: 2 },
    ],
    draw(g, { k, x }) {
      if (k === 0) { return L('Con $k=0$ restano solo i due assi: $xy=0$.', 'При $k=0$ остаются только две оси: $xy=0$.'); }
      const y = k / x;
      g.xy(k);
      g.path([[0, 0], [x, 0], [x, y], [0, y], [0, 0]], 'c3', 2, 0.6);
      g.point(x, y, 'c2'); g.label(x, y, 'P');
      const quad = k > 0 ? L('I e III quadrante', 'I и III четверти') : L('II e IV quadrante', 'II и IV четверти');
      return L(`$xy=${k}$, rami nel ${quad.it}. $P${pt(num(x), num(y))}$: il rettangolo ha area $|x\\cdot y|=${Math.abs(k)}$, <b class="k">sempre $|k|$</b>. Gli asintoti sono gli assi.`,
               `$xy=${k}$, ветви: ${quad.ru}. $P${pt(num(x), num(y))}$: площадь прямоугольника $|x\\cdot y|=${Math.abs(k)}$, <b class="k">всегда $|k|$</b>. Асимптоты — оси координат.`);
    },
  }),
  cone: coneScene,
};

// --- cono 3D tagliato da un piano ---
function coneScene(root) {
  root.innerHTML = `<div class="scene"><div class="g"></div><p class="hint3d">${u('drag3d')}</p><div class="readout"></div><div class="controls"></div></div>`;
  const gEl = root.querySelector('.g'), out = root.querySelector('.readout'), ctl = root.querySelector('.controls');
  const css = (n) => new THREE.Color(getComputedStyle(gEl).getPropertyValue('--' + n).trim() || '#888');
  const H = 4;
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  gEl.appendChild(renderer.domElement);
  const scene = new THREE.Scene();
  const cam = new THREE.PerspectiveCamera(38, 1, 0.1, 100);
  cam.position.set(11, 5, 14);
  const controls = new THREE.OrbitControls(cam, renderer.domElement);
  controls.enablePan = false;
  controls.enableZoom = false;
  scene.add(new THREE.AmbientLight(0xffffff, 1.6));
  const sun = new THREE.DirectionalLight(0xffffff, 1.6);
  sun.position.set(5, 8, 6);
  scene.add(sun);

  const coneMat = new THREE.MeshLambertMaterial({ color: css('c1'), transparent: true, opacity: 0.28, side: THREE.DoubleSide, depthWrite: false });
  const lower = new THREE.Mesh(new THREE.ConeGeometry(H, H, 64, 1, true), coneMat);
  lower.position.y = -H / 2;
  const upper = new THREE.Mesh(new THREE.ConeGeometry(H, H, 64, 1, true), coneMat);
  upper.rotation.x = Math.PI;
  upper.position.y = H / 2;
  scene.add(lower, upper);
  // bordi e generatrici, per leggere meglio la forma
  const rim = [];
  for (let i = 0; i < 96; i++) {
    const a = (i / 96) * 2 * Math.PI, b = ((i + 1) / 96) * 2 * Math.PI;
    for (const y of [H, -H]) rim.push(H * Math.cos(a), y, H * Math.sin(a), H * Math.cos(b), y, H * Math.sin(b));
  }
  for (let i = 0; i < 8; i++) { const a = (i / 8) * Math.PI; rim.push(H * Math.cos(a), H, H * Math.sin(a), -H * Math.cos(a), -H, -H * Math.sin(a)); }
  const rimG = new THREE.BufferGeometry();
  rimG.setAttribute('position', new THREE.Float32BufferAttribute(rim, 3));
  scene.add(new THREE.LineSegments(rimG, new THREE.LineBasicMaterial({ color: css('ink'), transparent: true, opacity: 0.45 })));

  const cut = new THREE.Group();
  scene.add(cut);
  const v = { th: 20, h: 1.5 };
  const render = () => renderer.render(scene, cam);

  function rebuild() {
    for (const o of [...cut.children]) { cut.remove(o); o.geometry.dispose(); o.material.dispose(); }
    const m = Math.tan((v.th * Math.PI) / 180), h = v.h;
    // piano y = h + m x
    let lo = -H - 0.6, hi = H + 0.6;
    if (m > 1e-9) { lo = Math.max(lo, (-H - 0.4 - h) / m); hi = Math.min(hi, (H + 0.4 - h) / m); }
    const z = H + 0.6;
    const pg = new THREE.BufferGeometry();
    pg.setAttribute('position', new THREE.Float32BufferAttribute([lo, h + m * lo, -z, hi, h + m * hi, -z, hi, h + m * hi, z, lo, h + m * lo, z], 3));
    pg.setIndex([0, 1, 2, 0, 2, 3]);
    cut.add(new THREE.Mesh(pg, new THREE.MeshBasicMaterial({ color: css('c3'), transparent: true, opacity: 0.22, side: THREE.DoubleSide, depthWrite: false })));
    // sezione: in coordinate polari attorno all'asse, y = h / (1 − m cos φ)
    const N = 480;
    const runs = [];
    let run = [];
    for (let i = 0; i < N; i++) {
      const ph = (i / N) * 2 * Math.PI, den = 1 - m * Math.cos(ph);
      const y = Math.abs(den) < 1e-6 ? Infinity : h / den;
      if (Math.abs(y) > H) { if (run.length) runs.push(run); run = []; continue; }
      run.push(new THREE.Vector3(y * Math.cos(ph), y, y * Math.sin(ph)));
    }
    const closed = run.length === N; // mai interrotta: curva chiusa
    if (run.length) {
      // il tratto finale prosegue in quello iniziale (attraverso φ = 0)
      if (!closed && runs.length && Math.abs(runs[0][0].y - h / (1 - m)) < 1e-9) runs[0] = run.concat(runs[0]);
      else runs.push(run);
    }
    for (const r of runs) {
      if (r.length < 4) continue;
      const curve = new THREE.CatmullRomCurve3(r, closed);
      cut.add(new THREE.Mesh(new THREE.TubeGeometry(curve, r.length * 2, 0.06, 8, closed), new THREE.MeshBasicMaterial({ color: css('c2') })));
    }
    let name, why;
    if (v.th === 0) { name = L('Circonferenza', 'Окружность'); why = L("Il piano è perpendicolare all'asse del cono.", 'Плоскость перпендикулярна оси конуса.'); }
    else if (v.th < 45) { name = L('Ellisse', 'Эллипс'); why = L('Il piano è meno inclinato del lato del cono: taglia una sola falda, curva chiusa.', 'Плоскость наклонена меньше, чем образующая: она режет одну полость, кривая замкнута.'); }
    else if (v.th === 45) { name = L('Parabola', 'Парабола'); why = L('Il piano è parallelo a un lato del cono: taglia una sola falda, ma la curva non si chiude più.', 'Плоскость параллельна образующей: режет одну полость, но кривая уже не замыкается.'); }
    else { name = L('Iperbole', 'Гипербола'); why = L('Il piano è più inclinato del lato del cono: taglia tutte e due le falde, due rami.', 'Плоскость наклонена сильнее образующей: режет обе полости, две ветви.'); }
    out.innerHTML = `<b class="k">${t(name)}</b>. ${t(why)}`;
    render();
  }

  for (const s of [
    { id: 'th', name: L('Inclinazione', 'Наклон'), unit: '°', min: 0, max: 80, step: 5 },
    { id: 'h', name: L('Altezza', 'Высота'), unit: '', min: 0.5, max: 2.5, step: 0.25 },
  ]) {
    const row = document.createElement('label');
    row.className = 'ctl';
    const name = document.createElement('span');
    name.className = 'name';
    const inp = Object.assign(document.createElement('input'), { type: 'range', min: s.min, max: s.max, step: s.step, value: v[s.id] });
    const show = () => { name.innerHTML = `<small>${t(s.name)}</small><br>` + md(`$${num(v[s.id])}${s.unit}$`); };
    inp.addEventListener('input', () => { v[s.id] = parseFloat(inp.value); show(); rebuild(); });
    show();
    row.append(name, inp);
    ctl.appendChild(row);
  }

  let size = 0;
  const resize = () => {
    const w = Math.round(gEl.clientWidth) || 320;
    if (w === size) return;
    size = w;
    renderer.setSize(w, w, false);
    render();
  };
  const ro = new ResizeObserver(resize);
  ro.observe(gEl);
  controls.addEventListener('change', render);
  resize();
  rebuild();
  return () => {
    ro.disconnect();
    controls.dispose();
    scene.traverse((o) => { o.geometry?.dispose(); o.material?.dispose?.(); });
    renderer.dispose();
    renderer.forceContextLoss?.();
  };
}

export function mountScene(id, root) {
  const f = scenes[id];
  return f ? f(root) : () => {};
}
