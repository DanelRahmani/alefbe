import { describe, expect, it } from "vitest";
import { PLACEMENT } from "@/content/placement";
import { LESSON_QUIZZES } from "@/content/lesson-quizzes";
import { ALL_LESSONS, UNITS } from "@/content/units";
import { nextQuestion, placeFrom, placementQuestions, refId, type PlacementBand, type PlacementLesson } from "@/lib/placement";

// A small course: unit a (a/1, a/2), b (b/1, b/2), c (c/1), d (d/1, not checked).
const LESSONS: PlacementLesson[] = [
  { key: "intro/1", unit: "intro" },
  { key: "a/1", unit: "a" },
  { key: "a/2", unit: "a" },
  { key: "b/1", unit: "b" },
  { key: "b/2", unit: "b" },
  { key: "c/1", unit: "c" },
  { key: "d/1", unit: "d" },
];
const BANDS: PlacementBand[] = [
  { id: "a", title: "A", topic: "a", units: ["a"], questions: [{ lesson: "a/1", q: 0 }, { lesson: "a/2", q: 0 }] },
  { id: "b", title: "B", topic: "b", units: ["b"], questions: [{ lesson: "b/1", q: 0 }, { lesson: "b/2", q: 1 }] },
  { id: "c", title: "C", topic: "c", units: ["c"], questions: [{ lesson: "c/1", q: 0 }, { lesson: "c/1", q: 1 }] },
];
const ids = placementQuestions(BANDS).map((x) => refId(x.ref));
const answer = (...oks: boolean[]) => Object.fromEntries(oks.map((ok, i) => [ids[i], ok]));

describe("the placement rule", () => {
  it("asks the bands in order", () => {
    expect(nextQuestion(BANDS, {})?.ref).toEqual({ lesson: "a/1", q: 0 });
    expect(nextQuestion(BANDS, answer(true))?.ref).toEqual({ lesson: "a/2", q: 0 });
    expect(nextQuestion(BANDS, answer(false))?.ref).toEqual({ lesson: "a/2", q: 0 });
    expect(nextQuestion(BANDS, answer(true, false))?.band.id).toBe("b");
  });

  it("stops at the first band with two misses, and starts there", () => {
    const a = answer(true, true, false, false);
    expect(nextQuestion(BANDS, a)).toBeNull();
    const p = placeFrom(BANDS, a, LESSONS);
    expect(p.start).toBe("b/1");
    expect(p.failed?.band.id).toBe("b");
    expect(p.failed?.missed.map(refId)).toEqual(["b/1#0", "b/2#1"]);
    expect(p.earlier).toEqual(["intro/1", "a/1", "a/2"]);
  });

  it("starts at the very first band when it fails", () => {
    const p = placeFrom(BANDS, answer(false, false), LESSONS);
    expect(p.start).toBe("a/1");
    expect(p.earlier).toEqual(["intro/1"]);
  });

  it("passes a band with one miss, and leaves that lesson unfinished", () => {
    const p = placeFrom(BANDS, answer(true, false, true, true, false, false), LESSONS);
    expect(p.start).toBe("c/1");
    expect(p.slips.map(refId)).toEqual(["a/2#0"]);
    expect(p.earlier).toEqual(["intro/1", "a/1", "b/1", "b/2"]);
  });

  it("with no band failed, starts after the last band", () => {
    const all = answer(true, true, true, false, true, true);
    expect(nextQuestion(BANDS, all)).toBeNull();
    const p = placeFrom(BANDS, all, LESSONS);
    expect(p.start).toBe("d/1");
    expect(p.failed).toBeUndefined();
    expect(p.slips.map(refId)).toEqual(["b/2#1"]);
    expect(p.earlier).toEqual(["intro/1", "a/1", "a/2", "b/1", "c/1"]);
  });

  it("has no start when nothing follows the last band", () => {
    const p = placeFrom(BANDS, answer(true, true, true, true, true, true), LESSONS.slice(0, -1));
    expect(p.start).toBeNull();
    expect(p.earlier).toEqual(["intro/1", "a/1", "a/2", "b/1", "b/2", "c/1"]);
  });

  it("stops at a band with no answers yet (one added since the result was saved)", () => {
    const p = placeFrom(BANDS, answer(true, true, true, true), LESSONS);
    expect(p.start).toBe("c/1");
    expect(p.unchecked?.id).toBe("c");
  });
});

describe("the placement questions", () => {
  const order = UNITS.map((u) => u.slug);

  it("each names an existing lesson-quiz question, inside its band's units", () => {
    for (const band of PLACEMENT) {
      for (const r of band.questions) {
        const quiz = LESSON_QUIZZES[r.lesson];
        expect(quiz?.questions[r.q], refId(r)).toBeDefined();
        expect(band.units, refId(r)).toContain(r.lesson.split("/")[0]);
      }
    }
  });

  it("has 12 to 15 questions before Units 10–11, two or more per band, none twice", () => {
    const all = placementQuestions(PLACEMENT).map((x) => refId(x.ref));
    expect(new Set(all).size).toBe(all.length);
    expect(PLACEMENT.every((b) => b.questions.length >= 2)).toBe(true);
    const core = placementQuestions(PLACEMENT.filter((b) => order.indexOf(b.units[0]) < order.indexOf("longer-sentences")));
    expect(core.length).toBeGreaterThanOrEqual(12);
    expect(core.length).toBeLessThanOrEqual(15);
  });

  it("covers Units 1 onward in course order, each unit once, with lessons", () => {
    const units = PLACEMENT.flatMap((b) => b.units);
    expect(new Set(units).size).toBe(units.length);
    const idx = units.map((u) => order.indexOf(u));
    expect(idx.every((i) => i >= 1)).toBe(true);
    expect(idx).toEqual([...idx].sort((a, b) => a - b));
    expect(idx).toEqual(idx.map((_, i) => idx[0] + i));
    for (const u of units) expect(ALL_LESSONS.some((l) => l.unit.slug === u), u).toBe(true);
  });
});
