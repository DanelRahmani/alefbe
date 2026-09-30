import { describe, expect, it } from "vitest";
import { DRILL_GROUPS, LETTERS } from "@/lib/persian/letters";
import { DEFAULT_SHEET, sheetLetters, sheetTitle } from "@/lib/sheets";

describe("sheetLetters", () => {
  it("gives each letter of a group its forms and key word", () => {
    const letters = sheetLetters(DEFAULT_SHEET);
    expect(letters.map((l) => l.ch)).toEqual(DRILL_GROUPS[0]);
    const be = letters.find((l) => l.ch === "ب")!;
    expect(be.rows.map((r) => r.glyph)).toEqual(["ب", "بـ", "ـبـ", "ـب", LETTERS.find((l) => l.ch === "ب")!.key.fa]);
    expect(be.rows.at(-1)).toMatchObject({ kind: "word" });
  });
  it("gives a non-joining letter only the forms it has", () => {
    const alef = sheetLetters({ ...DEFAULT_SHEET, words: false }).find((l) => l.ch === "ا")!;
    expect(alef.rows.map((r) => r.label)).toEqual(["isolated", "final"]);
  });
  it("can print the isolated letters only, without words", () => {
    const rows = sheetLetters({ groups: [1], forms: "isolated", words: false }).flatMap((l) => l.rows);
    expect(rows.every((r) => r.label === "isolated")).toBe(true);
  });
  it("prints the digits one row each", () => {
    const digits = sheetLetters({ groups: [8], forms: "all", words: true });
    expect(digits).toHaveLength(10);
    expect(digits[3]).toMatchObject({ ch: "۳", sound: "3", rows: [{ glyph: "۳", label: "digit" }] });
  });
  it("keeps alphabet order and ignores repeats and unknown groups", () => {
    const letters = sheetLetters({ groups: [2, 0, 2, 42], forms: "isolated", words: false });
    expect(letters.map((l) => l.ch)).toEqual([...DRILL_GROUPS[0], ...DRILL_GROUPS[2]]);
  });
});

describe("sheetTitle", () => {
  it("names one group by its first and last letter", () => {
    expect(sheetTitle(DEFAULT_SHEET)).toBe(`${DRILL_GROUPS[0][0]} – ${DRILL_GROUPS[0].at(-1)}`);
    expect(sheetTitle({ ...DEFAULT_SHEET, groups: [0, 1] })).toBe(`${DRILL_GROUPS[0].length + DRILL_GROUPS[1].length} letters`);
    expect(sheetTitle({ ...DEFAULT_SHEET, groups: [] })).toBe("No letters chosen");
  });
});
