import { describe, expect, it } from "vitest";
import {
  buildStrokes,
  centerOnInk,
  distanceTransform,
  inkPath,
  resample,
  smooth,
  traceScore,
  type Mask,
} from "@/lib/trace-path";

/** A W×H mask with the given filled rectangles [x0, y0, x1, y1] (inclusive). */
function mask(w: number, h: number, rects: [number, number, number, number][]): Mask {
  const data = new Uint8Array(w * h);
  for (const [x0, y0, x1, y1] of rects) for (let y = y0; y <= y1; y++) for (let x = x0; x <= x1; x++) data[y * w + x] = 1;
  return { w, h, data };
}

describe("distanceTransform", () => {
  it("is largest in the middle of a stroke and 0 outside the ink", () => {
    const m = mask(40, 20, [[5, 5, 34, 14]]);
    const dt = distanceTransform(m);
    expect(dt[10 * 40 + 20]).toBeGreaterThan(dt[5 * 40 + 20]);
    expect(dt[0]).toBe(0);
  });
});

describe("centerOnInk", () => {
  it("moves a point near the edge of a bar onto its centre line", () => {
    const m = mask(60, 30, [[5, 10, 54, 19]]);
    const p = centerOnInk(m, distanceTransform(m), { x: 30, y: 11 }, 8);
    expect(Math.abs(p.y - 14.5)).toBeLessThanOrEqual(1);
    expect(Math.abs(p.x - 30)).toBeLessThanOrEqual(2);
  });
  it("leaves a point alone when there is no ink nearby", () => {
    const m = mask(60, 30, [[5, 10, 20, 19]]);
    expect(centerOnInk(m, distanceTransform(m), { x: 50, y: 2 }, 5)).toEqual({ x: 50, y: 2 });
  });
});

describe("inkPath", () => {
  it("follows an L-shaped stroke instead of cutting the corner", () => {
    const m = mask(50, 50, [
      [5, 5, 12, 44],
      [5, 37, 44, 44],
    ]);
    const path = inkPath(m, distanceTransform(m), { x: 8, y: 6 }, { x: 43, y: 40 })!;
    expect(path).not.toBeNull();
    expect(path.every((p) => m.data[Math.round(p.y) * 50 + Math.round(p.x)] === 1)).toBe(true);
    expect(path.some((p) => p.x < 14 && p.y > 36)).toBe(true); // goes through the corner
  });
  it("returns null when the two points are not joined by ink", () => {
    const m = mask(50, 20, [
      [2, 5, 15, 14],
      [30, 5, 45, 14],
    ]);
    expect(inkPath(m, distanceTransform(m), { x: 5, y: 9 }, { x: 40, y: 9 })).toBeNull();
  });
});

describe("smooth and resample", () => {
  it("keeps the ends and spaces points evenly", () => {
    const zigzag = Array.from({ length: 21 }, (_, i) => ({ x: i * 5, y: i % 2 ? 2 : 0 }));
    const s = resample(smooth(zigzag, 3), 10);
    expect(s[0]).toEqual({ x: 0, y: 0 });
    expect(s[s.length - 1].x).toBeCloseTo(100, 0);
    const gaps = s.slice(1).map((p, i) => Math.hypot(p.x - s[i].x, p.y - s[i].y));
    expect(Math.max(...gaps.slice(0, -1)) - Math.min(...gaps.slice(0, -1))).toBeLessThan(1.5);
  });
});

describe("buildStrokes", () => {
  it("starts a new stroke where two control points are not joined by ink", () => {
    const m = mask(80, 40, [
      [2, 20, 40, 27],
      [55, 2, 75, 8],
    ]);
    const r = buildStrokes(m, [[{ x: 3, y: 23, dot: false }, { x: 39, y: 23, dot: false }, { x: 58, y: 5, dot: false }, { x: 74, y: 5, dot: false }]], 4);
    expect(r.strokes).toHaveLength(2);
    expect(r.dots).toHaveLength(0);
  });
  it("climbs every tooth of a سـ-like shape instead of running along the base", () => {
    const m = mask(60, 50, [
      [0, 30, 59, 44],
      [10, 18, 13, 29],
      [25, 18, 28, 29],
      [40, 18, 43, 29],
    ]);
    const control = [
      [
        { x: 41, y: 19, dot: false },
        { x: 34, y: 33, dot: false },
        { x: 26, y: 19, dot: false },
        { x: 19, y: 33, dot: false },
        { x: 11, y: 19, dot: false },
        { x: 3, y: 37, dot: false },
      ],
    ];
    const r = buildStrokes(m, control, 2);
    expect(r.strokes).toHaveLength(1);
    for (const toothX of [11.5, 26.5, 41.5]) {
      const reach = Math.min(...r.strokes[0].filter((p) => Math.abs(p.x - toothX) < 3).map((p) => p.y));
      expect(reach).toBeLessThan(24);
    }
  });
  it("extends a stroke along the ink to its tips", () => {
    const m = mask(60, 30, [[2, 10, 57, 17]]);
    const r = buildStrokes(m, [[{ x: 40, y: 13, dot: false }, { x: 15, y: 13, dot: false }]], 2);
    const xs = r.strokes[0].map((p) => p.x);
    expect(Math.max(...xs)).toBeGreaterThan(52);
    expect(Math.min(...xs)).toBeLessThan(7);
  });
  it("lifts a tooth-top control point that sits too low up to the tooth", () => {
    const m = mask(60, 50, [
      [0, 30, 59, 44],
      [25, 12, 28, 29],
    ]);
    const control = [
      [
        { x: 45, y: 36, dot: false },
        { x: 26, y: 25, dot: false },
        { x: 8, y: 36, dot: false },
      ],
    ];
    const r = buildStrokes(m, control, 2);
    const reach = Math.min(...r.strokes[0].filter((p) => Math.abs(p.x - 26.5) < 3).map((p) => p.y));
    expect(reach).toBeLessThan(17);
  });
  it("keeps touching dots as separate targets", () => {
    const m = mask(60, 40, [
      [2, 30, 57, 36],
      [20, 8, 27, 15],
      [28, 8, 35, 15],
    ]);
    const r = buildStrokes(
      m,
      [[{ x: 3, y: 33, dot: false }, { x: 56, y: 33, dot: false }], [{ x: 22, y: 12, dot: true }], [{ x: 33, y: 12, dot: true }]],
      4,
    );
    expect(r.dots).toHaveLength(2);
    expect(Math.hypot(r.dots[0].x - r.dots[1].x, r.dots[0].y - r.dots[1].y)).toBeGreaterThan(5);
  });
  it("keeps dots apart, centred on their blob", () => {
    const m = mask(40, 40, [
      [2, 30, 37, 36],
      [18, 10, 23, 15],
    ]);
    const r = buildStrokes(m, [[{ x: 3, y: 33, dot: false }, { x: 36, y: 33, dot: false }], [{ x: 17, y: 11, dot: true }]], 4);
    expect(r.dots).toHaveLength(1);
    expect(Math.abs(r.dots[0].x - 20.5)).toBeLessThanOrEqual(1.5);
    expect(Math.abs(r.dots[0].y - 12.5)).toBeLessThanOrEqual(1.5);
  });
});

describe("traceScore", () => {
  it("rewards covering the path while staying on it", () => {
    expect(traceScore(1, 1)).toBe(100);
    expect(traceScore(0.9, 1)).toBe(90);
  });
  it("marks down scribbling everywhere even if it covers the path", () => {
    expect(traceScore(1, 0.3)).toBeLessThan(70);
  });
});
