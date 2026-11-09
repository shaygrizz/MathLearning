// Piano cartesiano 2D disegnato con three.js (camera ortografica).
// Si ridisegna solo quando serve: niente ciclo di animazione, batteria salva.
import * as THREE from '../vendor/three/three.bundle.min.js';

export class Graph {
  constructor(el, { R = 8 } = {}) {
    this.el = el;
    this.R = R;
    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    el.appendChild(this.renderer.domElement);
    this.ticks = el.appendChild(Object.assign(document.createElement('div'), { className: 'graph-ticks' }));
    this.labels = el.appendChild(Object.assign(document.createElement('div'), { className: 'graph-labels' }));
    this.scene = new THREE.Scene();
    this.cam = new THREE.OrthographicCamera(-R, R, R, -R, -10, 10);
    this.grid = new THREE.Group();
    this.dyn = new THREE.Group();
    this.scene.add(this.grid, this.dyn);
    this.onDraw = null;
    this.size = 0;
    this.ro = new ResizeObserver(() => this.resize());
    this.ro.observe(el);
    this.mq = window.matchMedia('(prefers-color-scheme: dark)');
    this.onTheme = () => { this.size = 0; this.resize(); };
    this.mq.addEventListener?.('change', this.onTheme);
    this.resize();
  }
  col(name) {
    const v = getComputedStyle(this.el).getPropertyValue('--' + name).trim() || '#888888';
    return new THREE.Color(v);
  }
  resize() {
    const w = Math.round(this.el.clientWidth) || 320;
    if (w === this.size) return;
    this.size = w;
    this.px = (2 * this.R) / w; // unità del piano per pixel
    this.renderer.setSize(w, w, false);
    this.buildGrid();
    this.update();
  }
  static empty(group) {
    for (const o of [...group.children]) {
      group.remove(o);
      o.geometry?.dispose();
      o.material?.dispose();
    }
  }
  buildGrid() {
    const R = this.R;
    Graph.empty(this.grid);
    this.ticks.innerHTML = '';
    const pos = [];
    for (let i = -Math.floor(R); i <= Math.floor(R); i++) pos.push(i, -R, 0, i, R, 0, -R, i, 0, R, i, 0);
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
    this.grid.add(new THREE.LineSegments(g, new THREE.LineBasicMaterial({ color: this.col('grid') })));
    const ink = this.col('ink');
    this.ribbon([[-R, 0], [R, 0]], ink, 1.6, 0.2, this.grid);
    this.ribbon([[0, -R], [0, R]], ink, 1.6, 0.2, this.grid);
    const step = R <= 6 ? 1 : R <= 12 ? 2 : 5;
    for (let i = -Math.floor(R / step) * step; i <= R; i += step) {
      if (i === 0 || Math.abs(i) > R - 0.4) continue;
      this.text(i, 0, String(i).replace('-', '−'), 0, 4, this.ticks, 'center');
      this.text(0, i, String(i).replace('-', '−'), -5, 0, this.ticks, 'right');
    }
    this.text(R, 0, 'x', -12, -16, this.labels2());
    this.text(0, R, 'y', 8, 4, this.labels2());
  }
  labels2() { return this.ticks; }
  toPx(x, y) { return [(x + this.R) / this.px, (this.R - y) / this.px]; }
  text(x, y, str, dx = 6, dy = -16, parent = this.labels, align = 'left') {
    if (Math.abs(x) > this.R || Math.abs(y) > this.R) return;
    const [px, py] = this.toPx(x, y);
    const s = document.createElement('span');
    s.textContent = str;
    s.style.top = `${py + dy}px`;
    if (align === 'right') s.style.right = `${this.size - px - dx}px`;
    else if (align === 'center') { s.style.left = `${px + dx}px`; s.style.transform = 'translateX(-50%)'; }
    else s.style.left = `${px + dx}px`;
    parent.appendChild(s);
  }
  label(x, y, str, dx, dy) { this.text(x, y, str, dx, dy); }

  // nastro: una linea con spessore in pixel
  ribbon(pts, color, wpx = 2.6, z = 1, group = this.dyn) {
    const n = pts.length;
    if (n < 2) return;
    const w = (wpx * this.px) / 2;
    const pos = new Float32Array(n * 6);
    const idx = [];
    for (let i = 0; i < n; i++) {
      const a = pts[Math.max(i - 1, 0)], b = pts[Math.min(i + 1, n - 1)], p = pts[i];
      const tx = b[0] - a[0], ty = b[1] - a[1];
      const l = Math.hypot(tx, ty) || 1;
      const nx = (-ty / l) * w, ny = (tx / l) * w;
      pos.set([p[0] + nx, p[1] + ny, z, p[0] - nx, p[1] - ny, z], i * 6);
      if (i < n - 1) idx.push(2 * i, 2 * i + 1, 2 * i + 2, 2 * i + 1, 2 * i + 3, 2 * i + 2);
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    g.setIndex(idx);
    group.add(new THREE.Mesh(g, new THREE.MeshBasicMaterial({ color, side: THREE.DoubleSide })));
  }
  c(color) { return typeof color === 'string' ? this.col(color) : color; }
  // spezza la curva dove esce dal piano o non è definita
  path(pts, color = 'c1', wpx = 2.8, z = 1) {
    const lim = this.R * 3;
    let run = [];
    const flush = () => { this.ribbon(run, this.c(color), wpx, z); run = []; };
    for (const p of pts) {
      if (!p || !isFinite(p[0]) || !isFinite(p[1]) || Math.abs(p[1]) > lim || Math.abs(p[0]) > lim) flush();
      else run.push(p);
    }
    flush();
  }
  fn(f, color = 'c1', from = -this.R, to = this.R, steps = 240) {
    const pts = [];
    for (let i = 0; i <= steps; i++) { const x = from + ((to - from) * i) / steps; pts.push([x, f(x)]); }
    this.path(pts, color);
  }
  param(fx, fy, t0, t1, color = 'c1', steps = 240, wpx) {
    const pts = [];
    for (let i = 0; i <= steps; i++) { const s = t0 + ((t1 - t0) * i) / steps; pts.push([fx(s), fy(s)]); }
    this.path(pts, color, wpx);
  }
  circle(a, b, r, color = 'c1') {
    this.param((s) => a + r * Math.cos(s), (s) => b + r * Math.sin(s), 0, Math.PI * 2, color, 160);
  }
  seg(p, q, color = 'c3', wpx = 2, dashed = false) {
    if (!dashed) return this.ribbon([p, q], this.c(color), wpx, 0.8);
    const len = Math.hypot(q[0] - p[0], q[1] - p[1]);
    const d = 7 * this.px, n = Math.max(1, Math.floor(len / (2 * d)));
    for (let i = 0; i < n; i++) {
      const a = (i * 2 * d) / len, b = Math.min(1, (i * 2 * d + d) / len);
      this.ribbon(
        [[p[0] + (q[0] - p[0]) * a, p[1] + (q[1] - p[1]) * a], [p[0] + (q[0] - p[0]) * b, p[1] + (q[1] - p[1]) * b]],
        this.c(color), wpx, 0.8);
    }
  }
  // retta y = m x + q (o verticale x = k)
  line(m, q, color = 'c3', dashed = false, wpx = 2.2) {
    const R = this.R * 1.5;
    this.seg([-R, -m * R + q], [R, m * R + q], color, wpx, dashed);
  }
  vline(k, color = 'c3', dashed = true) { this.seg([k, -this.R], [k, this.R], color, 2, dashed); }
  hline(k, color = 'c3', dashed = true) { this.seg([-this.R, k], [this.R, k], color, 2, dashed); }
  point(x, y, color = 'c2', rpx = 5.5) {
    if (!isFinite(x) || !isFinite(y)) return;
    const m = new THREE.Mesh(new THREE.CircleGeometry(rpx * this.px, 24), new THREE.MeshBasicMaterial({ color: this.c(color) }));
    m.position.set(x, y, 2);
    this.dyn.add(m);
  }
  // iperbole x²/a² − y²/b² = ±1 (vert: fuochi sull'asse y)
  hyperbola(a, b, vert = false, color = 'c1') {
    const T = 3.2;
    for (const s of [1, -1]) {
      if (vert) this.param((u) => a * Math.sinh(u), (u) => s * b * Math.cosh(u), -T, T, color);
      else this.param((u) => s * a * Math.cosh(u), (u) => b * Math.sinh(u), -T, T, color);
    }
  }
  xy(k, color = 'c1') {
    const R = this.R;
    this.fn((x) => k / x, color, 0.02, R, 300);
    this.fn((x) => k / x, color, -R, -0.02, 300);
  }
  update() {
    Graph.empty(this.dyn);
    this.labels.innerHTML = '';
    this.onDraw?.(this);
    this.renderer.render(this.scene, this.cam);
  }
  dispose() {
    this.ro.disconnect();
    this.mq.removeEventListener?.('change', this.onTheme);
    Graph.empty(this.dyn);
    Graph.empty(this.grid);
    this.renderer.dispose();
    this.renderer.forceContextLoss?.();
    this.el.innerHTML = '';
  }
}
