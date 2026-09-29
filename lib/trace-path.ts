// Smooth tracing paths derived from the glyph itself. The hand-placed
// checkpoints (lib/trace-data.ts) only give stroke order and direction; here
// each one is moved onto the centre line of the rendered letter, consecutive
// points are joined by the cheapest route that stays inside the ink and hugs
// the stroke's centre, and the result is smoothed and evenly resampled.
// A pair of points not joined by ink (a pen lift) starts a new stroke.
// Pure: works on a bitmap mask, so it runs in tests and in the browser alike.

export interface Mask {
  w: number;
  h: number;
  /** 1 = ink, row-major. */
  data: Uint8Array;
}

export interface Pt {
  x: number;
  y: number;
}

/** Chamfer (3-4) distance from each ink pixel to the nearest background pixel, in pixels. */
export function distanceTransform(m: Mask): Float32Array {
  const { w, h, data } = m;
  const INF = 1e9;
  const d = new Float32Array(w * h);
  for (let i = 0; i < w * h; i++) d[i] = data[i] ? INF : 0;
  const at = (x: number, y: number) => (x < 0 || y < 0 || x >= w || y >= h ? 0 : d[y * w + x]);
  for (let y = 0; y < h; y++)
    for (let x = 0; x < w; x++) {
      const i = y * w + x;
      if (!d[i]) continue;
      d[i] = Math.min(d[i], at(x - 1, y) + 3, at(x, y - 1) + 3, at(x - 1, y - 1) + 4, at(x + 1, y - 1) + 4);
    }
  for (let y = h - 1; y >= 0; y--)
    for (let x = w - 1; x >= 0; x--) {
      const i = y * w + x;
      if (!d[i]) continue;
      d[i] = Math.min(d[i], at(x + 1, y) + 3, at(x, y + 1) + 3, at(x + 1, y + 1) + 4, at(x - 1, y + 1) + 4);
    }
  for (let i = 0; i < w * h; i++) d[i] /= 3;
  return d;
}

/** Move a point to the centre line of the stroke under or near it (within `radius` px). */
export function centerOnInk(m: Mask, dt: Float32Array, p: Pt, radius: number): Pt {
  let best: Pt | null = null;
  let bestScore = -Infinity;
  const r = Math.ceil(radius);
  for (let y = Math.max(0, Math.round(p.y) - r); y <= Math.min(m.h - 1, Math.round(p.y) + r); y++)
    for (let x = Math.max(0, Math.round(p.x) - r); x <= Math.min(m.w - 1, Math.round(p.x) + r); x++) {
      const dist = Math.hypot(x - p.x, y - p.y);
      if (dist > radius || !m.data[y * m.w + x]) continue;
      const score = dt[y * m.w + x] - 0.5 * dist;
      if (score > bestScore) {
        bestScore = score;
        best = { x, y };
      }
    }
  return best ?? p;
}

/** Cheapest 8-connected route through ink from a to b, preferring the stroke centre; null if not joined. */
export function inkPath(m: Mask, dt: Float32Array, a: Pt, b: Pt): Pt[] | null {
  const { w, h, data } = m;
  const idx = (p: Pt) => Math.round(p.y) * w + Math.round(p.x);
  const s = idx(a);
  const t = idx(b);
  if (!data[s] || !data[t]) return null;
  const cost = new Float64Array(w * h).fill(Infinity);
  const from = new Int32Array(w * h).fill(-1);
  const heap = new MinHeap();
  cost[s] = 0;
  heap.push(s, 0);
  const steps = [
    [1, 0, 1],
    [-1, 0, 1],
    [0, 1, 1],
    [0, -1, 1],
    [1, 1, Math.SQRT2],
    [1, -1, Math.SQRT2],
    [-1, 1, Math.SQRT2],
    [-1, -1, Math.SQRT2],
  ];
  while (heap.size) {
    const [i, c] = heap.pop();
    if (c > cost[i]) continue;
    if (i === t) break;
    const x = i % w;
    const y = (i - x) / w;
    for (const [dx, dy, len] of steps) {
      const nx = x + dx;
      const ny = y + dy;
      if (nx < 0 || ny < 0 || nx >= w || ny >= h) continue;
      const j = ny * w + nx;
      if (!data[j]) continue;
      const nc = c + len * (1 + 4 / (dt[j] + 0.5));
      if (nc < cost[j]) {
        cost[j] = nc;
        from[j] = i;
        heap.push(j, nc);
      }
    }
  }
  if (!Number.isFinite(cost[t])) return null;
  const path: Pt[] = [];
  for (let i = t; i !== -1; i = from[i]) path.push({ x: i % w, y: Math.floor(i / w) });
  return path.reverse();
}

class MinHeap {
  private k: number[] = [];
  private v: number[] = [];
  get size() {
    return this.k.length;
  }
  push(key: number, val: number) {
    this.k.push(key);
    this.v.push(val);
    let i = this.k.length - 1;
    while (i > 0) {
      const p = (i - 1) >> 1;
      if (this.v[p] <= this.v[i]) break;
      this.swap(i, p);
      i = p;
    }
  }
  pop(): [number, number] {
    const top: [number, number] = [this.k[0], this.v[0]];
    const lk = this.k.pop()!;
    const lv = this.v.pop()!;
    if (this.k.length) {
      this.k[0] = lk;
      this.v[0] = lv;
      let i = 0;
      for (;;) {
        const l = 2 * i + 1;
        const r = l + 1;
        let m = i;
        if (l < this.k.length && this.v[l] < this.v[m]) m = l;
        if (r < this.k.length && this.v[r] < this.v[m]) m = r;
        if (m === i) break;
        this.swap(i, m);
        i = m;
      }
    }
    return top;
  }
  private swap(a: number, b: number) {
    [this.k[a], this.k[b]] = [this.k[b], this.k[a]];
    [this.v[a], this.v[b]] = [this.v[b], this.v[a]];
  }
}

const len = (a: Pt, b: Pt) => Math.hypot(a.x - b.x, a.y - b.y);

/** Moving average over ±radius points; the ends stay put. */
export function smooth(points: Pt[], radius: number): Pt[] {
  if (points.length < 3) return points;
  return points.map((p, i) => {
    if (i === 0 || i === points.length - 1) return p;
    const r = Math.min(radius, i, points.length - 1 - i);
    let x = 0;
    let y = 0;
    for (let k = i - r; k <= i + r; k++) {
      x += points[k].x;
      y += points[k].y;
    }
    return { x: x / (2 * r + 1), y: y / (2 * r + 1) };
  });
}

/** Points every `spacing` along the polyline, plus its last point. */
export function resample(points: Pt[], spacing: number): Pt[] {
  if (points.length < 2) return points;
  const out: Pt[] = [points[0]];
  let carry = 0;
  for (let i = 1; i < points.length; i++) {
    const a = points[i - 1];
    const b = points[i];
    const seg = len(a, b);
    let t = spacing - carry;
    while (t <= seg) {
      out.push({ x: a.x + ((b.x - a.x) * t) / seg, y: a.y + ((b.y - a.y) * t) / seg });
      t += spacing;
    }
    carry = seg - (t - spacing);
  }
  const last = points[points.length - 1];
  if (len(out[out.length - 1], last) > spacing * 0.25) out.push(last);
  return out;
}

/**
 * A control point sitting between two lower neighbours is a peak (a tooth of
 * س ش ص, the top of a loop): climb the ink straight up from it to the tip, so
 * imprecise hand-placed points still reach the top of their stroke.
 */
function climbPeak(m: Mask, p: Pt, maxClimb: number): Pt {
  const x0 = Math.round(p.x);
  let y = Math.round(p.y);
  let x = x0;
  const inkAt = (xx: number, yy: number) => xx >= 0 && yy >= 0 && xx < m.w && yy < m.h && m.data[yy * m.w + xx] === 1;
  if (!inkAt(x, y)) return p;
  let climbed = 0;
  while (climbed < maxClimb) {
    const up = [x, x - 1, x + 1, x - 2, x + 2].find((xx) => inkAt(xx, y - 1));
    if (up === undefined) break;
    x = up;
    y--;
    climbed++;
  }
  return climbed ? { x, y: y + 2 } : p;
}

/**
 * Extend a stroke's end along the ink to where the stroke really stops: find
 * the farthest ink ahead of the end (within a cone and `reach`) and follow the
 * ink to it.
 */
function extendEnd(m: Mask, dt: Float32Array, path: Pt[], reach: number): Pt[] {
  if (path.length < 3) return [];
  const e = path[path.length - 1];
  const back = path[Math.max(0, path.length - 7)];
  const dl = len(e, back);
  if (!dl) return [];
  const dx = (e.x - back.x) / dl;
  const dy = (e.y - back.y) / dl;
  let best: Pt | null = null;
  let bestAhead = 2;
  const r = Math.ceil(reach);
  for (let y = Math.max(0, Math.round(e.y) - r); y <= Math.min(m.h - 1, Math.round(e.y) + r); y++)
    for (let x = Math.max(0, Math.round(e.x) - r); x <= Math.min(m.w - 1, Math.round(e.x) + r); x++) {
      if (!m.data[y * m.w + x]) continue;
      const vx = x - e.x;
      const vy = y - e.y;
      const d = Math.hypot(vx, vy);
      if (d > reach) continue;
      const ahead = vx * dx + vy * dy;
      if (ahead < 0.75 * d || ahead <= bestAhead) continue;
      bestAhead = ahead;
      best = { x, y };
    }
  if (!best) return [];
  const ext = inkPath(m, dt, e, best);
  if (!ext) return [];
  const extLen = ext.slice(1).reduce((s, p, i) => s + len(ext[i], p), 0);
  return extLen <= len(e, best) * 1.6 + 4 ? ext.slice(1) : [];
}

export interface ControlPoint extends Pt {
  dot: boolean;
}

export interface TracePaths {
  strokes: Pt[][];
  dots: Pt[];
}

/** Turn hand-placed control strokes into smooth, evenly sampled strokes on the glyph. */
export function buildStrokes(m: Mask, control: ControlPoint[][], spacing: number): TracePaths {
  const dt = distanceTransform(m);
  const side = Math.min(m.w, m.h);
  const radius = Math.max(4, side * 0.05);
  const dotRadius = Math.max(4, side * 0.035);
  const peakRise = Math.max(4, side * 0.02);
  const reach = Math.max(24, side * 0.12);
  const strokes: Pt[][] = [];
  const dots: Pt[] = [];
  const smoothR = Math.max(2, Math.round(side * 0.012));

  for (const group of control) {
    const body = group.filter((cp) => !cp.dot);
    for (const cp of group) if (cp.dot) dots.push(centerOnInk(m, dt, cp, dotRadius));

    const lifted = body.map((cp, i) => {
      const a = body[i - 1];
      const b = body[i + 1];
      const peak = a && b && a.y > cp.y + peakRise && b.y > cp.y + peakRise;
      return peak ? climbPeak(m, centerOnInk(m, dt, cp, radius * 0.5), Math.max(16, side * 0.12)) : cp;
    });

    let current: Pt[] = [];
    const flush = () => {
      if (current.length > 1) {
        const tail = extendEnd(m, dt, current, reach);
        const head = extendEnd(m, dt, [...current].reverse(), reach).reverse();
        strokes.push(resample(smooth([...head, ...current, ...tail], smoothR), spacing));
      }
      current = [];
    };
    let prev: Pt | null = null;
    lifted.forEach((cp, i) => {
      // A lifted peak is already on its tooth: centre it only a little.
      const c = centerOnInk(m, dt, cp, radius * (cp === body[i] ? 1 : 0.4));
      if (!prev) {
        current = [c];
      } else {
        const path = inkPath(m, dt, prev, c);
        const straight = len(prev, c);
        const pathLen = path ? path.slice(1).reduce((s, p, i) => s + len(path[i], p), 0) : Infinity;
        if (!path || pathLen > straight * 2.5 + radius * 2) {
          flush();
          current = [c];
        } else {
          current.push(...path.slice(1));
        }
      }
      prev = c;
    });
    flush();
  }
  return { strokes, dots };
}

/** Coverage of the path × how much of the pen stayed on it (scribbling everywhere doesn't pass). */
export function traceScore(coverage: number, accuracy: number): number {
  return Math.round(100 * coverage * (0.4 + 0.6 * accuracy));
}
