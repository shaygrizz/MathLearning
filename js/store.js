// Progressi salvati sul dispositivo (localStorage), con ripasso a intervalli.
const KEY = 'ml.state.v1';
const DAY = 86400000;
const STEPS = [1, 3, 7];
let s = { done: {}, tests: {}, review: {}, diag: false };
try { s = { ...s, ...JSON.parse(localStorage.getItem(KEY) || '{}') }; } catch {}
const save = () => { try { localStorage.setItem(KEY, JSON.stringify(s)); } catch {} };

export const store = {
  isDone: (id) => !!s.done[id],
  markDone(id) { s.done[id] = true; save(); },
  best: (topic) => s.tests[topic],
  setTest(topic, pct) { if (!(s.tests[topic] >= pct)) { s.tests[topic] = pct; save(); } },
  diagDone: () => s.diag,
  setDiag() { s.diag = true; save(); },
  fail(gen) { s.review[gen] = { lvl: 0, due: Date.now() + DAY * STEPS[0] }; save(); },
  pass(gen) {
    const r = s.review[gen];
    if (!r) return;
    r.lvl += 1;
    if (r.lvl >= STEPS.length) delete s.review[gen];
    else r.due = Date.now() + DAY * STEPS[r.lvl];
    save();
  },
  due: () => Object.keys(s.review).filter((g) => s.review[g].due <= Date.now()),
  pending: () => Object.keys(s.review),
};
