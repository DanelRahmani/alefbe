import { describe, expect, it } from "vitest";
import { calendar, dayKey, emptyActivity, quizTotals, record, streak, totals } from "@/lib/activity";
import { legacyTheme, mergeLegacyActivity, mergeLegacyTrace, parseLegacyExport, parseLegacyStore } from "@/lib/legacy";
import { bestForForm, letterMastery, migrateTraceV1 } from "@/lib/trace";

const at = (y: number, m: number, d: number, h = 12) => new Date(y, m - 1, d, h);

describe("activity", () => {
  it("keys days by local date", () => {
    expect(dayKey(at(2026, 9, 29, 0))).toBe("2026-09-29");
    expect(dayKey(at(2026, 9, 29, 23))).toBe("2026-09-29");
  });
  it("records counts per day, traces per letter and form, quiz per letter", () => {
    let a = emptyActivity();
    a = record(a, { kind: "trace", letter: "ب", form: "initial" }, at(2026, 9, 29));
    a = record(a, { kind: "quiz", letter: "ب", ok: true }, at(2026, 9, 29));
    a = record(a, { kind: "quiz", letter: "ب", ok: false }, at(2026, 9, 29));
    expect(a.days["2026-09-29"]).toEqual({ trace: 1, quiz: 2 });
    expect(a.traced).toEqual({ ب: 1 });
    expect(a.forms).toEqual({ initial: 1 });
    expect(a.quiz).toEqual({ ب: [1, 2] });
    expect(totals(a).quiz).toBe(2);
    expect(quizTotals(a)).toEqual([1, 2]);
  });
  it("counts the streak back from today, or from yesterday before today's practice", () => {
    let a = emptyActivity();
    for (const d of [25, 27, 28]) a = record(a, { kind: "drill" }, at(2026, 9, d));
    expect(streak(a, at(2026, 9, 29))).toBe(2);
    expect(streak(a, at(2026, 9, 28))).toBe(2);
    a = record(a, { kind: "drill" }, at(2026, 9, 29));
    expect(streak(a, at(2026, 9, 29))).toBe(3);
    expect(streak(a, at(2026, 10, 2))).toBe(0);
  });
  it("lays out a calendar of whole weeks, Monday first", () => {
    const a = record(emptyActivity(), { kind: "lesson" }, at(2026, 9, 29));
    const weeks = calendar(a, at(2026, 9, 29), 8);
    expect(weeks).toHaveLength(8);
    expect(weeks[7][0].key).toBe("2026-09-28"); // Monday
    expect(weeks[7][1]).toMatchObject({ key: "2026-09-29", total: 1, future: false });
    expect(weeks[7][6].future).toBe(true);
  });
});

describe("the old app's data", () => {
  const v1 = JSON.stringify({
    l: [0, 1, 2],
    q: { tot: 20, cor: 15 },
    p: { "1": { comp: [2, 1, 0] }, "31": { comp: [0, 0, 3] } },
    st: { sessions: { "1": 4 }, forms: { "0": 3, "2": 1 }, days: ["2026-01-02", "2026-01-03"] },
  });

  it("reads localStorage alefbe_v1 and the v2 export alike", () => {
    const a = parseLegacyStore(v1)!;
    const b = parseLegacyExport({ version: 2, learned: [0, 1, 2], quiz: { tot: 20, cor: 15 }, prog: JSON.parse(v1).p, stats: JSON.parse(v1).st })!;
    expect(a).toEqual(b);
    expect(parseLegacyStore("not json")).toBeNull();
    expect(parseLegacyExport({ learned: [] })).toBeNull();
  });
  it("carries quiz totals, traces, forms and days into activity", () => {
    const a = mergeLegacyActivity(emptyActivity(), parseLegacyStore(v1)!);
    expect(quizTotals(a)).toEqual([15, 20]);
    expect(a.traced).toEqual({ ب: 4 });
    expect(a.forms).toEqual({ isolated: 3, medial: 1 });
    expect(Object.keys(a.days)).toEqual(["2026-01-02", "2026-01-03"]);
    // Merging twice changes nothing.
    expect(mergeLegacyActivity(a, parseLegacyStore(v1)!)).toEqual(a);
  });
  it("turns passed levels into passes of the isolated form", () => {
    const t = mergeLegacyTrace({}, parseLegacyStore(v1)!);
    expect(t).toEqual({ "ب:isolated:guided": 70, "ب:isolated:outline": 70, "ی:isolated:freehand": 70 });
    expect(letterMastery(t, "ب")).toBe("outline");
    expect(letterMastery(t, "ی")).toBe("freehand");
    expect(letterMastery(t, "پ")).toBeNull();
  });
  it("reads the old theme", () => {
    expect(legacyTheme("light")).toBe("light");
    expect(legacyTheme(null)).toBeNull();
    expect(legacyTheme("blue")).toBeNull();
  });
});

describe("trace store v2", () => {
  it("moves per-form scores to the guided level", () => {
    expect(migrateTraceV1({ "ب:isolated": 92, "ب:final:outline": 80 })).toEqual({ "ب:isolated:guided": 92, "ب:final:outline": 80 });
  });
  it("reports a form's hardest passed level, else its best try", () => {
    expect(bestForForm({ "ب:initial:guided": 90, "ب:initial:outline": 72 }, "ب", "initial")).toEqual({ score: 72, level: "outline" });
    expect(bestForForm({ "ب:initial:guided": 50, "ب:initial:outline": 60 }, "ب", "initial")).toEqual({ score: 60, level: "outline" });
    expect(bestForForm({}, "ب", "initial")).toBeNull();
  });
});
