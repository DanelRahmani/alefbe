import { describe, expect, it } from "vitest";
import { PASS_SCORE, controlStrokes, coverAt, glyphLayout, onPath, snapToPath, starsFor } from "@/lib/trace";

describe("controlStrokes", () => {
  it("scales a letter's hand-placed control points to pixels, stroke by stroke", () => {
    const alef = controlStrokes(0, "isolated", 360);
    expect(alef).toHaveLength(1);
    expect(alef[0]).toHaveLength(3);
    expect(alef[0][0].x).toBeCloseTo(0.498 * 360);
    expect(alef[0].every((p) => !p.dot)).toBe(true);
  });
  it("keeps dots as their own control groups", () => {
    const pe = controlStrokes(2, "isolated", 100);
    expect(pe.flat().filter((p) => p.dot)).toHaveLength(3);
  });
  it("falls back to the isolated set when a form has no data of its own", () => {
    expect(controlStrokes(9, "initial", 100)).toEqual(controlStrokes(9, "isolated", 100));
  });
});

describe("coverAt", () => {
  const samples = [
    { x: 0, y: 0 },
    { x: 10, y: 0 },
    { x: 20, y: 0 },
  ];
  it("marks every sample within reach of the pen", () => {
    expect(coverAt(samples, [false, false, false], { x: 1, y: 1 }, 12)).toEqual([true, true, false]);
  });
  it("returns null when nothing new is covered", () => {
    expect(coverAt(samples, [true, true, false], { x: 1, y: 1 }, 12)).toBeNull();
  });
});

describe("snapToPath and onPath", () => {
  const samples = [
    { x: 0, y: 0 },
    { x: 10, y: 0 },
  ];
  it("pulls the pen toward the path when it is close", () => {
    const s = snapToPath(samples, { x: 10, y: 6 }, 10, 0.5);
    expect(s.y).toBeLessThan(6);
    expect(s.y).toBeGreaterThan(0);
  });
  it("leaves the pen alone when it is far or the strength is 0", () => {
    expect(snapToPath(samples, { x: 10, y: 50 }, 10, 0.5)).toEqual({ x: 10, y: 50 });
    expect(snapToPath(samples, { x: 10, y: 6 }, 10, 0)).toEqual({ x: 10, y: 6 });
  });
  it("says whether a pen point is within reach of a path sample", () => {
    expect(onPath(samples, { x: 9, y: 3 }, 5)).toBe(true);
    expect(onPath(samples, { x: 5, y: 30 }, 5)).toBe(false);
  });
});

describe("scoring", () => {
  it("passes at 70 and gives stars at 70, 85 and 95", () => {
    expect(PASS_SCORE).toBe(70);
    expect([50, 70, 85, 95, 100].map(starsFor)).toEqual([0, 1, 2, 3, 3]);
  });
});

describe("glyphLayout", () => {
  it("reproduces the old app's placement at 360 px", () => {
    expect(glyphLayout(360)).toEqual({ fontPx: 360 * 0.62, x: 180, y: 180 + 360 * 0.06 - 23 });
  });
});
