// Formule (KaTeX) e piccoli aiuti per scrivere equazioni con i segni giusti.
import { getLang } from './i18n.js';

export function tex(src, display = false) {
  try { return window.katex.renderToString(src, { throwOnError: false, displayMode: display }); }
  catch { return src; }
}
// Testo con $...$ e $$...$$ -> HTML
export function md(str) {
  return String(str)
    .replace(/\$\$([\s\S]+?)\$\$/g, (_, m) => tex(m, true))
    .replace(/\$([^$]+?)\$/g, (_, m) => tex(m));
}

export const gcd = (a, b) => { a = Math.abs(a); b = Math.abs(b); while (b) [a, b] = [b, a % b]; return a || 1; };
export const sgn = (n) => (n < 0 ? `-${-n}` : `+${n}`);
// (x-a)^2 con il segno corretto; a = 0 -> x^2
export const sq = (v, a) => (a === 0 ? `${v}^2` : `(${v}${sgn(-a)})^2`);
// frazione ridotta in LaTeX
export function frac(n, d) {
  if (d < 0) { n = -n; d = -d; }
  const g = gcd(n, d); n /= g; d /= g;
  if (d === 1) return `${n}`;
  return `${n < 0 ? '-' : ''}\\frac{${Math.abs(n)}}{${d}}`;
}
// polinomio da coppie [coefficiente, 'x^2']
export function poly(terms) {
  let s = '';
  for (const [c, v] of terms) {
    if (c === 0) continue;
    const a = Math.abs(c);
    s += (c < 0 ? '-' : s ? '+' : '') + (a === 1 && v ? '' : a) + v;
  }
  return s || '0';
}
// numero per le letture delle figure (virgola decimale in italiano)
export function num(x, dec = 2) {
  if (!isFinite(x)) return '?';
  let r = +x.toFixed(dec);
  if (Object.is(r, -0)) r = 0;
  const str = String(r);
  return getLang() === 'it' ? str.replace('.', '{,}') : str;
}
export const pt = (x, y) => `(${x};\\,${y})`;

// Legge la risposta dello studente: -3, 2,5, 3/4 ...
export function parseAnswer(raw) {
  let v = String(raw).trim().replace(/[−–—]/g, '-').replace(/,/g, '.').replace(/\s+/g, '');
  if (!v) return NaN;
  const m = v.match(/^([+-]?\d*\.?\d+)\/([+-]?\d*\.?\d+)$/);
  if (m) { const d = parseFloat(m[2]); return d === 0 ? NaN : parseFloat(m[1]) / d; }
  if (!/^[+-]?\d*\.?\d+$/.test(v)) return NaN;
  return parseFloat(v);
}
export const close = (a, b) => Math.abs(a - b) <= 0.011;
