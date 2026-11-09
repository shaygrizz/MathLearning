// Generatori di esercizi: numeri casuali, quindi esercizi sempre nuovi.
// Ogni generatore restituisce { q, fields | choices+correct, hints, sol, graph? }.
import { L } from './i18n.js';
import { sq, sgn, frac, poly, pt } from './mathfmt.js';

const R = String.raw;
const ri = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
const pick = (a) => a[ri(0, a.length - 1)];
const nz = (a, b) => { let v; do v = ri(a, b); while (v === 0); return v; };
const shuffle = (a) => { for (let i = a.length - 1; i > 0; i--) { const j = ri(0, i); [a[i], a[j]] = [a[j], a[i]]; } return a; };
const key = (c) => (typeof c === 'string' ? c : c.it);
// scelta multipla: mescola e toglie i doppioni
function mc(correct, wrong) {
  const seen = new Set([key(correct)]);
  const opts = [correct];
  for (const w of wrong) if (!seen.has(key(w))) { seen.add(key(w)); opts.push(w); }
  shuffle(opts);
  return { choices: opts, correct: opts.indexOf(correct) };
}
const circEq = (a, b, r2) => `${sq('x', a)}+${sq('y', b)}=${r2}`;
const TRIPLES = [[3, 4, 5], [4, 3, 5], [6, 8, 10], [8, 6, 10], [5, 12, 13], [12, 5, 13]];
const hypEq = (A, B, rhs = '1') => R`\frac{x^2}{${A}}-\frac{y^2}{${B}}=${rhs}`;
const parEq = (a, b, c) => 'y=' + poly([[a, 'x^2'], [b, 'x'], [c, '']]);

export const GENS = {
  // ---------- prerequisiti ----------
  'pre.dist'() {
    const [dx, dy, d] = pick([[3, 4, 5], [6, 8, 10], [5, 12, 13], [8, 6, 10]]);
    const x = ri(-4, 3), y = ri(-4, 3), x2 = x + dx * pick([1, -1]), y2 = y + dy * pick([1, -1]);
    return {
      q: L(`Calcola la distanza tra $A${pt(x, y)}$ e $B${pt(x2, y2)}$.`, `Найди расстояние между $A${pt(x, y)}$ и $B${pt(x2, y2)}$.`),
      fields: [{ label: 'AB', ans: d }],
      hints: [L(R`$AB=\sqrt{(x_B-x_A)^2+(y_B-y_A)^2}$`, R`$AB=\sqrt{(x_B-x_A)^2+(y_B-y_A)^2}$`)],
      sol: L(`$AB=\\sqrt{${dx}^2+${dy}^2}=\\sqrt{${d * d}}=${d}$. La formula della distanza è il teorema di Pitagora: serve per la circonferenza.`,
             `$AB=\\sqrt{${dx}^2+${dy}^2}=\\sqrt{${d * d}}=${d}$. Формула расстояния — это теорема Пифагора; она нужна для окружности.`),
    };
  },
  'pre.square'() {
    const h = nz(-6, 6);
    return {
      q: L(`Completa il quadrato: $x^2${sgn(2 * h)}x=(x${sgn(h)})^2-\\,?$`, `Выдели полный квадрат: $x^2${sgn(2 * h)}x=(x${sgn(h)})^2-\\,?$`),
      fields: [{ label: '?', ans: h * h }],
      hints: [L(`Sviluppa $(x${sgn(h)})^2$ e guarda quale numero avanza.`, `Раскрой $(x${sgn(h)})^2$ и посмотри, какое число лишнее.`)],
      sol: L(`$(x${sgn(h)})^2=x^2${sgn(2 * h)}x+${h * h}$, quindi bisogna togliere $${h * h}$. È il passaggio chiave per trovare centro e vertice.`,
             `$(x${sgn(h)})^2=x^2${sgn(2 * h)}x+${h * h}$, поэтому нужно вычесть $${h * h}$. Это ключевой шаг для поиска центра и вершины.`),
    };
  },
  'pre.quad'() {
    let x1 = ri(-6, 6), x2 = ri(-6, 6);
    if (x1 === x2) x2 += 1;
    return {
      q: L(`Risolvi $${poly([[1, 'x^2'], [-(x1 + x2), 'x'], [x1 * x2, '']])}=0$.`, `Реши $${poly([[1, 'x^2'], [-(x1 + x2), 'x'], [x1 * x2, '']])}=0$.`),
      fields: [{ label: 'x_1', ans: x1 }, { label: 'x_2', ans: x2 }], unordered: true,
      hints: [L(R`$x=\dfrac{-b\pm\sqrt{b^2-4ac}}{2a}$`, R`$x=\dfrac{-b\pm\sqrt{b^2-4ac}}{2a}$`),
              L(`Cerca due numeri con somma $${x1 + x2}$ e prodotto $${x1 * x2}$.`, `Найди два числа с суммой $${x1 + x2}$ и произведением $${x1 * x2}$.`)],
      sol: L(`Somma $${x1 + x2}$ e prodotto $${x1 * x2}$: le soluzioni sono $${Math.min(x1, x2)}$ e $${Math.max(x1, x2)}$.`,
             `Сумма $${x1 + x2}$, произведение $${x1 * x2}$: корни $${Math.min(x1, x2)}$ и $${Math.max(x1, x2)}$.`),
    };
  },
  'pre.slope'() {
    const m = nz(-3, 3), x = ri(-3, 2), y = ri(-4, 4), dx = pick([1, 2, 3]);
    return {
      q: L(`Qual è il coefficiente angolare della retta per $A${pt(x, y)}$ e $B${pt(x + dx, y + m * dx)}$?`,
           `Чему равен угловой коэффициент прямой через $A${pt(x, y)}$ и $B${pt(x + dx, y + m * dx)}$?`),
      fields: [{ label: 'm', ans: m }],
      hints: [L(R`$m=\dfrac{y_B-y_A}{x_B-x_A}$`, R`$m=\dfrac{y_B-y_A}{x_B-x_A}$`)],
      sol: L(`$m=\\dfrac{${m * dx}}{${dx}}=${m}$. Serve per gli asintoti dell'iperbole.`, `$m=\\dfrac{${m * dx}}{${dx}}=${m}$. Пригодится для асимптот гиперболы.`),
    };
  },
  'pre.mid'() {
    const x = ri(-5, 5), y = ri(-5, 5), dx = 2 * nz(-3, 3), dy = 2 * nz(-3, 3);
    return {
      q: L(`Trova il punto medio di $A${pt(x, y)}$ e $B${pt(x + dx, y + dy)}$.`, `Найди середину отрезка $A${pt(x, y)}$, $B${pt(x + dx, y + dy)}$.`),
      fields: [{ label: 'x_M', ans: x + dx / 2 }, { label: 'y_M', ans: y + dy / 2 }],
      hints: [L('Fai la media delle ascisse e la media delle ordinate.', 'Возьми среднее абсцисс и среднее ординат.')],
      sol: L(`$M${pt(x + dx / 2, y + dy / 2)}$: media delle coordinate. Il centro di una circonferenza è il punto medio di ogni diametro.`,
             `$M${pt(x + dx / 2, y + dy / 2)}$: среднее координат. Центр окружности — середина любого диаметра.`),
    };
  },

  // ---------- circonferenza ----------
  'circ.read'() {
    const a = ri(-6, 6), b = ri(-6, 6), r = ri(1, 9);
    return {
      q: L(`Trova centro e raggio: $$${circEq(a, b, r * r)}$$`, `Найди центр и радиус: $$${circEq(a, b, r * r)}$$`),
      fields: [{ label: 'x_C', ans: a }, { label: 'y_C', ans: b }, { label: 'r', ans: r }],
      hints: [L('Il centro è il punto che annulla le due parentesi: attenzione ai segni.', 'Центр — точка, которая обнуляет обе скобки: следи за знаками.'),
              L(`A destra c'è $r^2$, non $r$: $r=\\sqrt{${r * r}}$.`, `Справа стоит $r^2$, а не $r$: $r=\\sqrt{${r * r}}$.`)],
      sol: L(`Confronta con $(x-a)^2+(y-b)^2=r^2$: $C${pt(a, b)}$, $r=\\sqrt{${r * r}}=${r}$.`, `Сравни с $(x-a)^2+(y-b)^2=r^2$: $C${pt(a, b)}$, $r=\\sqrt{${r * r}}=${r}$.`),
    };
  },
  'circ.write'() {
    const a = nz(-6, 6), b = nz(-6, 6), r = ri(2, 7);
    const good = `$${circEq(a, b, r * r)}$`;
    return {
      q: L(`Quale equazione ha centro $C${pt(a, b)}$ e raggio $${r}$?`, `Какое уравнение задаёт окружность с центром $C${pt(a, b)}$ и радиусом $${r}$?`),
      ...mc(good, [`$${circEq(-a, -b, r * r)}$`, `$${circEq(a, b, r)}$`, `$${circEq(-a, b, r * r)}$`, `$${circEq(-a, -b, r)}$`].slice(0, 3)),
      hints: [L('Nelle parentesi le coordinate del centro compaiono con il segno cambiato.', 'В скобках координаты центра стоят с противоположным знаком.')],
      sol: L(`$(x-a)^2+(y-b)^2=r^2$ con $a=${a}$, $b=${b}$, $r^2=${r * r}$: ${good}.`, `$(x-a)^2+(y-b)^2=r^2$ при $a=${a}$, $b=${b}$, $r^2=${r * r}$: ${good}.`),
    };
  },
  'circ.general'() {
    const a = ri(-5, 5), b = ri(-5, 5), r = ri(1, 6);
    const A = -2 * a, B = -2 * b, C = a * a + b * b - r * r;
    const eq = poly([[1, 'x^2'], [1, 'y^2'], [A, 'x'], [B, 'y'], [C, '']]) + '=0';
    return {
      q: L(`Trova centro e raggio: $$${eq}$$`, `Найди центр и радиус: $$${eq}$$`),
      fields: [{ label: 'x_C', ans: a }, { label: 'y_C', ans: b }, { label: 'r', ans: r }],
      hints: [L(R`Centro: $\left(-\dfrac{a}{2};\,-\dfrac{b}{2}\right)$, dove $a$ e $b$ sono i coefficienti di $x$ e $y$.`, R`Центр: $\left(-\dfrac{a}{2};\,-\dfrac{b}{2}\right)$, где $a$ и $b$ — коэффициенты при $x$ и $y$.`),
              L(R`$r=\sqrt{\alpha^2+\beta^2-c}$, con $(\alpha;\beta)$ centro e $c$ termine noto.`, R`$r=\sqrt{\alpha^2+\beta^2-c}$, где $(\alpha;\beta)$ — центр, $c$ — свободный член.`)],
      sol: L(`Centro $\\left(-\\frac{${A}}{2};\\,-\\frac{${B}}{2}\\right)=${pt(a, b)}$. $r=\\sqrt{${a * a}+${b * b}${sgn(-C)}}=\\sqrt{${r * r}}=${r}$.`,
             `Центр $\\left(-\\frac{${A}}{2};\\,-\\frac{${B}}{2}\\right)=${pt(a, b)}$. $r=\\sqrt{${a * a}+${b * b}${sgn(-C)}}=\\sqrt{${r * r}}=${r}$.`),
    };
  },
  'circ.point'() {
    const a = ri(-3, 3), b = ri(-3, 3);
    const [dx, dy, d] = pick([[3, 4, 5], [4, 3, 5], [0, 5, 5], [5, 0, 5]]);
    const kind = ri(0, 2); // 0 dentro, 1 sopra, 2 fuori
    const r = d + [ri(1, 2), 0, -ri(1, 2)][kind];
    const px = a + dx * pick([1, -1]), py = b + dy * pick([1, -1]);
    const names = [L('interno alla circonferenza', 'внутри окружности'), L('sulla circonferenza', 'на окружности'), L('esterno alla circonferenza', 'вне окружности')];
    const cmp = ['<', '=', '>'][kind];
    return {
      q: L(`Dov'è il punto $P${pt(px, py)}$ rispetto a $${circEq(a, b, r * r)}$?`, `Где находится точка $P${pt(px, py)}$ относительно $${circEq(a, b, r * r)}$?`),
      choices: names, correct: kind,
      hints: [L('Sostituisci le coordinate di $P$ a sinistra e confronta con il numero a destra.', 'Подставь координаты $P$ в левую часть и сравни с числом справа.')],
      sol: L(`Sostituendo: $${dx * dx}+${dy * dy}=${d * d}$, e $${d * d}${cmp}${r * r}$: $P$ è ${names[kind].it}.`, `Подставляем: $${dx * dx}+${dy * dy}=${d * d}$, и $${d * d}${cmp}${r * r}$: $P$ лежит ${names[kind].ru}.`),
    };
  },
  'circ.through'() {
    const a = ri(-4, 4), b = ri(-4, 4), dx = nz(-5, 5), dy = nz(-5, 5), r2 = dx * dx + dy * dy;
    return {
      q: L(`Una circonferenza ha centro $C${pt(a, b)}$ e passa per $P${pt(a + dx, b + dy)}$. Quanto vale $r^2$?`,
           `Окружность с центром $C${pt(a, b)}$ проходит через $P${pt(a + dx, b + dy)}$. Чему равно $r^2$?`),
      fields: [{ label: 'r^2', ans: r2 }],
      hints: [L('Il raggio è la distanza $CP$.', 'Радиус — это расстояние $CP$.')],
      sol: L(`$r^2=CP^2=(${dx})^2+(${dy})^2=${r2}$. Equazione: $${circEq(a, b, r2)}$.`, `$r^2=CP^2=(${dx})^2+(${dy})^2=${r2}$. Уравнение: $${circEq(a, b, r2)}$.`),
    };
  },
  'circ.line'() {
    const a = ri(-3, 3), b = ri(-3, 3), k = ri(0, 2); // 0 secante, 1 tangente, 2 esterna
    const d = k === 2 ? ri(2, 5) : ri(1, 5), r = d + [1, 0, -1][k];
    const c = 5 * d * pick([1, -1]) - 3 * a - 4 * b;
    const line = poly([[3, 'x'], [4, 'y'], [c, '']]) + '=0';
    const names = [L('secante (2 punti)', 'секущая (2 точки)'), L('tangente (1 punto)', 'касательная (1 точка)'), L('esterna (0 punti)', 'внешняя (0 точек)')];
    const cmp = ['<', '=', '>'][k];
    return {
      q: L(`Com'è la retta $${line}$ rispetto alla circonferenza $${circEq(a, b, r * r)}$?`, `Как расположена прямая $${line}$ относительно окружности $${circEq(a, b, r * r)}$?`),
      choices: names, correct: k,
      hints: [L(R`Calcola la distanza del centro dalla retta: $d=\dfrac{|ax_0+by_0+c|}{\sqrt{a^2+b^2}}$.`, R`Найди расстояние от центра до прямой: $d=\dfrac{|ax_0+by_0+c|}{\sqrt{a^2+b^2}}$.`),
              L('Poi confronta $d$ con il raggio.', 'Затем сравни $d$ с радиусом.')],
      sol: L(`$d=\\dfrac{|3\\cdot(${a})+4\\cdot(${b})${sgn(c)}|}{5}=${d}$, $r=${r}$. $d${cmp}r$: ${names[k].it}.`, `$d=\\dfrac{|3\\cdot(${a})+4\\cdot(${b})${sgn(c)}|}{5}=${d}$, $r=${r}$. $d${cmp}r$: ${names[k].ru}.`),
    };
  },
  'circ.graph'() {
    const a = nz(-3, 3), b = nz(-3, 3), r = ri(2, 4);
    const good = `$${circEq(a, b, r * r)}$`;
    return {
      q: L('Quale equazione corrisponde al grafico?', 'Какое уравнение соответствует графику?'),
      range: 8, graph: (g) => { g.circle(a, b, r); g.point(a, b, 'c2'); },
      ...mc(good, [`$${circEq(-a, -b, r * r)}$`, `$${circEq(a, b, r)}$`, `$${circEq(b, a, r * r)}$`, `$${circEq(-a, b, r * r)}$`].slice(0, 3)),
      hints: [L('Leggi il centro sul grafico, poi conta il raggio in quadretti.', 'Найди центр на графике, затем посчитай радиус по клеткам.')],
      sol: L(`Centro $${pt(a, b)}$ e raggio $${r}$: ${good}.`, `Центр $${pt(a, b)}$, радиус $${r}$: ${good}.`),
    };
  },

  // ---------- parabola ----------
  'par.vertex'() {
    const a = pick([1, -1, 2, -2]), xv = nz(-4, 4), yv = ri(-5, 5), b = -2 * a * xv, c = a * xv * xv + yv;
    return {
      q: L(`Trova il vertice: $$${parEq(a, b, c)}$$`, `Найди вершину: $$${parEq(a, b, c)}$$`),
      fields: [{ label: 'x_V', ans: xv }, { label: 'y_V', ans: yv }],
      hints: [L(R`$x_V=-\dfrac{b}{2a}$`, R`$x_V=-\dfrac{b}{2a}$`), L("Per $y_V$ sostituisci $x_V$ nell'equazione.", 'Чтобы найти $y_V$, подставь $x_V$ в уравнение.')],
      sol: L(`$x_V=-\\dfrac{${b}}{2\\cdot(${a})}=${xv}$; $y_V=${a}\\cdot(${xv})^2${sgn(b)}\\cdot(${xv})${sgn(c)}=${yv}$.`, `$x_V=-\\dfrac{${b}}{2\\cdot(${a})}=${xv}$; $y_V=${a}\\cdot(${xv})^2${sgn(b)}\\cdot(${xv})${sgn(c)}=${yv}$.`),
    };
  },
  'par.focus'() {
    const p = pick([1, 2, 3, -1, -2, -3]);
    const eq = `y=${p < 0 ? '-' : ''}\\frac{1}{${4 * Math.abs(p)}}x^2`;
    return {
      q: L(`Trova il fuoco $F(0;\\,y_F)$ e la direttrice $y=d$ di $$${eq}$$`, `Найди фокус $F(0;\\,y_F)$ и директрису $y=d$ параболы $$${eq}$$`),
      fields: [{ label: 'y_F', ans: p }, { label: 'd', ans: -p }],
      hints: [L(R`Per $y=ax^2$: $y_F=\dfrac{1}{4a}$.`, R`Для $y=ax^2$: $y_F=\dfrac{1}{4a}$.`),
              L('La direttrice sta dalla parte opposta, alla stessa distanza dal vertice.', 'Директриса лежит по другую сторону от вершины на том же расстоянии.')],
      sol: L(`$a=${frac(1, 4 * p)}$, quindi $\\dfrac{1}{4a}=${p}$: $F${pt(0, p)}$, direttrice $y=${-p}$.`, `$a=${frac(1, 4 * p)}$, значит $\\dfrac{1}{4a}=${p}$: $F${pt(0, p)}$, директриса $y=${-p}$.`),
    };
  },
  'par.focus2'() {
    const p = pick([1, 2, -1, -2]), xv = nz(-4, 4), yv = ri(-3, 3);
    const eq = `y=${p < 0 ? '-' : ''}\\frac{1}{${4 * Math.abs(p)}}${sq('x', xv)}${yv === 0 ? '' : sgn(yv)}`;
    return {
      q: L(`Trova il fuoco e la direttrice $y=d$ di $$${eq}$$`, `Найди фокус и директрису $y=d$ параболы $$${eq}$$`),
      fields: [{ label: 'x_F', ans: xv }, { label: 'y_F', ans: yv + p }, { label: 'd', ans: yv - p }],
      hints: [L(`Il vertice è $V${pt(xv, yv)}$: il fuoco sta sull'asse $x=${xv}$.`, `Вершина $V${pt(xv, yv)}$: фокус лежит на оси $x=${xv}$.`),
              L(R`Dal vertice, sali di $\dfrac{1}{4a}$ per il fuoco e scendi della stessa quantità per la direttrice.`, R`От вершины поднимись на $\dfrac{1}{4a}$ к фокусу и опустись на столько же к директрисе.`)],
      sol: L(`$V${pt(xv, yv)}$ e $\\dfrac{1}{4a}=${p}$: $F${pt(xv, yv + p)}$, direttrice $y=${yv - p}$.`, `$V${pt(xv, yv)}$ и $\\dfrac{1}{4a}=${p}$: $F${pt(xv, yv + p)}$, директриса $y=${yv - p}$.`),
    };
  },
  'par.zeros'() {
    const a = pick([1, 1, -1, 2]);
    let x1 = ri(-5, 5), x2 = ri(-5, 5);
    if (x1 === x2) x2 += 2;
    const eq = parEq(a, -a * (x1 + x2), a * x1 * x2);
    const lo = Math.min(x1, x2), hi = Math.max(x1, x2);
    return {
      q: L(`In quali punti la parabola taglia l'asse $x$? $$${eq}$$`, `В каких точках парабола пересекает ось $x$? $$${eq}$$`),
      fields: [{ label: 'x_1', ans: x1 }, { label: 'x_2', ans: x2 }], unordered: true,
      hints: [L("Sull'asse $x$ vale $y=0$: risolvi l'equazione di secondo grado.", 'На оси $x$ выполняется $y=0$: реши квадратное уравнение.'),
              ...(a !== 1 ? [L(`Prima dividi tutto per $${a}$.`, `Сначала раздели всё на $${a}$.`)] : [])],
      sol: L(`$y=0$ → $${poly([[1, 'x^2'], [-(x1 + x2), 'x'], [x1 * x2, '']])}=0$ → $x=${lo}$ e $x=${hi}$. Forma fattorizzata: $y=${a === 1 ? '' : a === -1 ? '-' : a}(x${sgn(-x1)})(x${sgn(-x2)})$.`,
             `$y=0$ → $${poly([[1, 'x^2'], [-(x1 + x2), 'x'], [x1 * x2, '']])}=0$ → $x=${lo}$ и $x=${hi}$. Разложение: $y=${a === 1 ? '' : a === -1 ? '-' : a}(x${sgn(-x1)})(x${sgn(-x2)})$.`),
    };
  },
  'par.delta'() {
    const a = pick([1, -1, 2]), xv = ri(-3, 3), n = ri(0, 2);
    const yv = n === 1 ? 0 : (n === 0 ? 1 : -1) * Math.sign(a) * ri(1, 4);
    const b = -2 * a * xv, c = a * xv * xv + yv, D = b * b - 4 * a * c;
    const names = [L('nessuno', 'ни одной'), L('uno (tangente)', 'одна (касание)'), L('due', 'две')];
    return {
      q: L(`Quanti punti ha in comune con l'asse $x$ la parabola $${parEq(a, b, c)}$?`, `Сколько общих точек с осью $x$ у параболы $${parEq(a, b, c)}$?`),
      choices: names, correct: n,
      hints: [L(R`Calcola $\Delta=b^2-4ac$ e guarda il segno.`, R`Вычисли $\Delta=b^2-4ac$ и посмотри на знак.`)],
      sol: L(`$\\Delta=(${b})^2-4\\cdot(${a})\\cdot(${c})=${D}$, quindi ${D > 0 ? '$\\Delta>0$: due punti' : D === 0 ? '$\\Delta=0$: un punto' : '$\\Delta<0$: nessun punto'}.`,
             `$\\Delta=(${b})^2-4\\cdot(${a})\\cdot(${c})=${D}$, значит ${D > 0 ? '$\\Delta>0$: две точки' : D === 0 ? '$\\Delta=0$: одна точка' : '$\\Delta<0$: точек нет'}.`),
    };
  },
  'par.fromvertex'() {
    const a = pick([1, -1, 2, -2, 3]), d = pick([1, 2, -1, -2]), xv = ri(-3, 3), yv = ri(-3, 3);
    return {
      q: L(`La parabola $y=a(x-x_V)^2+y_V$ ha vertice $V${pt(xv, yv)}$ e passa per $P${pt(xv + d, yv + a * d * d)}$. Quanto vale $a$?`,
           `Парабола $y=a(x-x_V)^2+y_V$ имеет вершину $V${pt(xv, yv)}$ и проходит через $P${pt(xv + d, yv + a * d * d)}$. Чему равно $a$?`),
      fields: [{ label: 'a', ans: a }],
      hints: [L("Sostituisci il vertice nell'equazione, poi le coordinate di $P$.", 'Подставь вершину в уравнение, затем координаты $P$.')],
      sol: L(`$${yv + a * d * d}=a\\cdot(${d})^2${sgn(yv)}$ → $${d * d}a=${a * d * d}$ → $a=${a}$.`, `$${yv + a * d * d}=a\\cdot(${d})^2${sgn(yv)}$ → $${d * d}a=${a * d * d}$ → $a=${a}$.`),
    };
  },
  'par.graph'() {
    const a = pick([1, -1]), xv = nz(-3, 3), yv = nz(-3, 3);
    const e = (A, X, Y) => `$y=${A < 0 ? '-' : ''}${sq('x', X)}${sgn(Y)}$`;
    const good = e(a, xv, yv);
    return {
      q: L('Quale equazione corrisponde al grafico?', 'Какое уравнение соответствует графику?'),
      range: 8, graph: (g) => { g.fn((x) => a * (x - xv) ** 2 + yv); g.point(xv, yv, 'c2'); },
      ...mc(good, [e(-a, xv, yv), e(a, -xv, yv), e(a, xv, -yv)]),
      hints: [L('Guarda la concavità (segno di $a$) e leggi le coordinate del vertice.', 'Посмотри, куда направлены ветви (знак $a$), и прочитай координаты вершины.')],
      sol: L(`Vertice $${pt(xv, yv)}$, concavità verso ${a > 0 ? "l'alto ($a>0$)" : 'il basso ($a<0$)'}: ${good}.`, `Вершина $${pt(xv, yv)}$, ветви ${a > 0 ? 'вверх ($a>0$)' : 'вниз ($a<0$)'}: ${good}.`),
    };
  },

  // ---------- iperbole ----------
  'hyp.abc'() {
    const [a, b, c] = pick(TRIPLES);
    return {
      q: L(`Per l'iperbole $$${hypEq(a * a, b * b)}$$ trova $a$, $b$ e la semidistanza focale $c$.`, `Для гиперболы $$${hypEq(a * a, b * b)}$$ найди $a$, $b$ и фокусное полурасстояние $c$.`),
      fields: [{ label: 'a', ans: a }, { label: 'b', ans: b }, { label: 'c', ans: c }],
      hints: [L('I denominatori sono $a^2$ e $b^2$.', 'В знаменателях стоят $a^2$ и $b^2$.'),
              L("Nell'iperbole $c^2=a^2+b^2$ (con il più, non con il meno).", 'Для гиперболы $c^2=a^2+b^2$ (с плюсом, не с минусом).')],
      sol: L(`$a=\\sqrt{${a * a}}=${a}$, $b=\\sqrt{${b * b}}=${b}$, $c=\\sqrt{${a * a}+${b * b}}=${c}$. Vertici $(\\pm${a};0)$, fuochi $(\\pm${c};0)$.`,
             `$a=\\sqrt{${a * a}}=${a}$, $b=\\sqrt{${b * b}}=${b}$, $c=\\sqrt{${a * a}+${b * b}}=${c}$. Вершины $(\\pm${a};0)$, фокусы $(\\pm${c};0)$.`),
    };
  },
  'hyp.asym'() {
    let a = ri(1, 6), b = ri(1, 6);
    if (a === b) b = a === 6 ? 5 : a + 1;
    return {
      q: L(`Gli asintoti di $${hypEq(a * a, b * b)}$ sono $y=\\pm m\\,x$. Quanto vale $m$ (positivo)?`, `Асимптоты гиперболы $${hypEq(a * a, b * b)}$ имеют вид $y=\\pm m\\,x$. Чему равно $m$ (положительное)?`),
      fields: [{ label: 'm', ans: b / a }],
      hints: [L(R`$m=\dfrac{b}{a}$`, R`$m=\dfrac{b}{a}$`)],
      sol: L(`$a=${a}$, $b=${b}$: $m=\\dfrac{b}{a}=${frac(b, a)}$.`, `$a=${a}$, $b=${b}$: $m=\\dfrac{b}{a}=${frac(b, a)}$.`),
    };
  },
  'hyp.ecc'() {
    const [a, b, c] = pick(TRIPLES);
    return {
      q: L(`Calcola l'eccentricità di $${hypEq(a * a, b * b)}$.`, `Найди эксцентриситет гиперболы $${hypEq(a * a, b * b)}$.`),
      fields: [{ label: 'e', ans: c / a }],
      hints: [L(R`$e=\dfrac{c}{a}$, con $c=\sqrt{a^2+b^2}$.`, R`$e=\dfrac{c}{a}$, где $c=\sqrt{a^2+b^2}$.`)],
      sol: L(`$c=\\sqrt{${a * a}+${b * b}}=${c}$, quindi $e=\\dfrac{${c}}{${a}}=${frac(c, a)}$ (maggiore di 1, come sempre).`, `$c=\\sqrt{${a * a}+${b * b}}=${c}$, значит $e=\\dfrac{${c}}{${a}}=${frac(c, a)}$ (больше 1, как всегда).`),
    };
  },
  'hyp.orient'() {
    const A = pick([4, 9, 16, 25]), B = pick([4, 9, 16, 36]), form = ri(0, 2);
    const eq = [hypEq(A, B), hypEq(A, B, '-1'), R`\frac{y^2}{${B}}-\frac{x^2}{${A}}=1`][form];
    const onY = form > 0;
    return {
      q: L(`Su quale asse si trovano i fuochi? $$${eq}$$`, `На какой оси лежат фокусы? $$${eq}$$`),
      choices: [L('asse $x$', 'ось $x$'), L('asse $y$', 'ось $y$')], correct: onY ? 1 : 0,
      hints: [L('Poni $x=0$ e poi $y=0$: quale asse viene davvero tagliato dalla curva?', 'Подставь $x=0$, потом $y=0$: какую ось кривая действительно пересекает?')],
      sol: onY
        ? L(`Con $y=0$ si ottiene $x^2<0$, impossibile; con $x=0$ si ha $y=\\pm${Math.sqrt(B)}$. La curva taglia l'asse $y$: vertici e fuochi sono lì.`, `При $y=0$ получается $x^2<0$ — невозможно; при $x=0$ имеем $y=\\pm${Math.sqrt(B)}$. Кривая пересекает ось $y$: вершины и фокусы там.`)
        : L(`Con $y=0$ si ha $x=\\pm${Math.sqrt(A)}$; con $x=0$ si ottiene $y^2<0$, impossibile. Vertici e fuochi sono sull'asse $x$.`, `При $y=0$ имеем $x=\\pm${Math.sqrt(A)}$; при $x=0$ получается $y^2<0$ — невозможно. Вершины и фокусы на оси $x$.`),
    };
  },
  'hyp.yfoci'() {
    const [a, b, c] = pick(TRIPLES);
    return {
      q: L(`L'iperbole $$${hypEq(a * a, b * b, '-1')}$$ ha vertici $(0;\\pm y_V)$ e fuochi $(0;\\pm y_F)$. Trova $y_V$ e $y_F$ (positivi).`,
           `Гипербола $$${hypEq(a * a, b * b, '-1')}$$ имеет вершины $(0;\\pm y_V)$ и фокусы $(0;\\pm y_F)$. Найди $y_V$ и $y_F$ (положительные).`),
      fields: [{ label: 'y_V', ans: b }, { label: 'y_F', ans: c }],
      hints: [L('Poni $x=0$ per trovare i vertici.', 'Подставь $x=0$, чтобы найти вершины.'), L('Anche qui $c^2=a^2+b^2$.', 'Здесь тоже $c^2=a^2+b^2$.')],
      sol: L(`$x=0$ → $y^2=${b * b}$ → $y_V=${b}$. $c=\\sqrt{${a * a}+${b * b}}=${c}$ → $y_F=${c}$.`, `$x=0$ → $y^2=${b * b}$ → $y_V=${b}$. $c=\\sqrt{${a * a}+${b * b}}=${c}$ → $y_F=${c}$.`),
    };
  },
  'hyp.write'() {
    const [a, b, c] = pick(TRIPLES);
    const good = `$${hypEq(a * a, b * b)}$`;
    return {
      q: L(`Quale iperbole ha vertici $(\\pm${a};0)$ e fuochi $(\\pm${c};0)$?`, `Какая гипербола имеет вершины $(\\pm${a};0)$ и фокусы $(\\pm${c};0)$?`),
      ...mc(good, [`$${hypEq(b * b, a * a)}$`, `$${hypEq(a * a, c * c)}$`, R`$\frac{x^2}{${a * a}}+\frac{y^2}{${b * b}}=1$`]),
      hints: [L('$b^2=c^2-a^2$', '$b^2=c^2-a^2$')],
      sol: L(`$a^2=${a * a}$, $b^2=${c * c}-${a * a}=${b * b}$: ${good}.`, `$a^2=${a * a}$, $b^2=${c * c}-${a * a}=${b * b}$: ${good}.`),
    };
  },
  'hyp.xyk'() {
    const p = nz(-6, 6), q = nz(-6, 6);
    return {
      q: L(`L'iperbole equilatera $xy=k$ passa per $P${pt(p, q)}$. Quanto vale $k$?`, `Равносторонняя гипербола $xy=k$ проходит через $P${pt(p, q)}$. Чему равно $k$?`),
      fields: [{ label: 'k', ans: p * q }],
      hints: [L("Sostituisci le coordinate di $P$ nell'equazione.", 'Подставь координаты $P$ в уравнение.')],
      sol: L(`$k=(${p})\\cdot(${q})=${p * q}$. I rami stanno nel ${p * q > 0 ? 'I e III' : 'II e IV'} quadrante.`, `$k=(${p})\\cdot(${q})=${p * q}$. Ветви лежат в ${p * q > 0 ? 'I и III' : 'II и IV'} четвертях.`),
    };
  },
  'hyp.xyy'() {
    const x = nz(-6, 6), y = nz(-6, 6), k = x * y;
    return {
      q: L(`Un punto dell'iperbole $xy=${k}$ ha ascissa $x=${x}$. Qual è la sua ordinata?`, `Точка гиперболы $xy=${k}$ имеет абсциссу $x=${x}$. Какова её ордината?`),
      fields: [{ label: 'y', ans: y }],
      hints: [L(R`$y=\dfrac{k}{x}$`, R`$y=\dfrac{k}{x}$`)],
      sol: L(`$y=\\dfrac{${k}}{${x}}=${y}$.`, `$y=\\dfrac{${k}}{${x}}=${y}$.`),
    };
  },
  'hyp.graph'() {
    const type = ri(0, 2);
    let a = ri(1, 4), b = ri(1, 4);
    if (a === b) b = a === 4 ? 2 : a + 1;
    const k = pick([2, 4, 6, -2, -4, -6]);
    const E = [`$${hypEq(a * a, b * b)}$`, `$${hypEq(a * a, b * b, '-1')}$`, `$xy=${k}$`];
    const wrong = type === 2
      ? [`$xy=${-k}$`, `$${hypEq(Math.abs(k), Math.abs(k))}$`, `$y=${k}x$`]
      : [E[1 - type], `$${hypEq(b * b, a * a, type ? '-1' : '1')}$`, `$xy=${a * b}$`];
    return {
      q: L('Quale equazione corrisponde al grafico?', 'Какое уравнение соответствует графику?'),
      range: 8,
      graph: (g) => {
        if (type === 2) return g.xy(k);
        g.line(b / a, 0, 'c3', true); g.line(-b / a, 0, 'c3', true);
        g.hyperbola(a, b, type === 1);
      },
      ...mc(E[type], wrong),
      hints: [type === 2
        ? L('Gli asintoti sono gli assi: è della forma $xy=k$. In quali quadranti stanno i rami?', 'Асимптоты — оси координат: вид $xy=k$. В каких четвертях ветви?')
        : L('Quale asse viene tagliato? Leggi i vertici e la pendenza degli asintoti.', 'Какую ось пересекает кривая? Прочитай вершины и наклон асимптот.')],
      sol: type === 2
        ? L(`Asintoti sugli assi e rami nel ${k > 0 ? 'I e III' : 'II e IV'} quadrante: ${E[2]}.`, `Асимптоты — оси, ветви в ${k > 0 ? 'I и III' : 'II и IV'} четвертях: ${E[2]}.`)
        : type === 1
          ? L(`La curva taglia l'asse $y$ in $\\pm${b}$ e gli asintoti hanno pendenza $\\pm${frac(b, a)}$: ${E[1]}.`, `Кривая пересекает ось $y$ в $\\pm${b}$, наклон асимптот $\\pm${frac(b, a)}$: ${E[1]}.`)
          : L(`La curva taglia l'asse $x$ in $\\pm${a}$ e gli asintoti hanno pendenza $\\pm${frac(b, a)}$: ${E[0]}.`, `Кривая пересекает ось $x$ в $\\pm${a}$, наклон асимптот $\\pm${frac(b, a)}$: ${E[0]}.`),
    };
  },

  // ---------- misto ----------
  'mix.recognize'() {
    const A = pick([4, 9, 16]), B = pick([1, 25, 36]), n = nz(-4, 4), m = nz(-5, 5), type = ri(0, 4);
    const eq = [
      poly([[1, 'x^2'], [1, 'y^2'], [2 * n, 'x'], [-2 * m, 'y'], [-ri(1, 9), '']]) + '=0',
      parEq(pick([2, -1, 3]), n, m),
      pick([hypEq(A, B), `xy=${m}`, poly([[1, 'x^2'], [-1, 'y^2']]) + `=${A}`]),
      R`\frac{x^2}{${A}}+\frac{y^2}{${B}}=1`,
      'y=' + poly([[n, 'x'], [m, '']]),
    ][type];
    const names = [L('circonferenza', 'окружность'), L('parabola', 'парабола'), L('iperbole', 'гипербола'), L('ellisse', 'эллипс'), L('retta', 'прямая')];
    const why = [
      L('$x^2$ e $y^2$ hanno lo stesso coefficiente e non c’è il termine $xy$.', 'У $x^2$ и $y^2$ одинаковые коэффициенты, и нет слагаемого $xy$.'),
      L('Una sola variabile è al quadrato.', 'В квадрате только одна переменная.'),
      L('I due quadrati hanno segni opposti (oppure è della forma $xy=k$).', 'Квадраты входят с разными знаками (или вид $xy=k$).'),
      L('I due quadrati hanno lo stesso segno ma coefficienti diversi.', 'Квадраты одного знака, но с разными коэффициентами.'),
      L('Non ci sono quadrati: è di primo grado.', 'Квадратов нет: уравнение первой степени.'),
    ][type];
    return {
      q: L(`Che curva è? $$${eq}$$`, `Что это за кривая? $$${eq}$$`),
      choices: names, correct: type,
      hints: [L('Guarda quali variabili sono al quadrato e con che segno.', 'Посмотри, какие переменные в квадрате и с каким знаком.')],
      sol: L(`${why.it} È una ${names[type].it}.`, `${why.ru} Это ${names[type].ru}.`),
    };
  },
};

export const ALL_PRACTICE = Object.keys(GENS).filter((k) => !k.startsWith('pre.'));
export const DIAG = ['pre.dist', 'pre.square', 'pre.quad', 'pre.slope', 'pre.mid'];
export function make(id) {
  const p = GENS[id]();
  p.id = id;
  return p;
}
