import { describe, expect, it } from "vitest";
import { DRILL_GROUPS, LETTERS, formOf, letterByChar } from "@/lib/persian/letters";
import { WORD_CARDS, checkDrill, legacyUnlockedGroups, wordsFor } from "@/lib/drill";

describe("letters", () => {
  it("has the 32 letters in alphabet order", () => {
    expect(LETTERS.map((l) => l.ch).join("")).toBe("ابپتثجچحخدذرزژسشصضطظعغفقکگلمنوهی");
  });
  it("drill groups cover every letter once, then the digits", () => {
    expect(DRILL_GROUPS.slice(0, 8).flat().join("")).toBe(LETTERS.map((l) => l.ch).join(""));
    expect(DRILL_GROUPS[8].join("")).toBe("۰۱۲۳۴۵۶۷۸۹");
  });
  it("gives non-joining letters no initial or medial joining stroke after them", () => {
    const dal = letterByChar.get("د")!;
    expect([formOf(dal, "isolated"), formOf(dal, "initial"), formOf(dal, "medial"), formOf(dal, "final")]).toEqual([
      "د",
      "د",
      "ـد",
      "ـد",
    ]);
    const be = letterByChar.get("ب")!;
    expect(formOf(be, "medial")).toBe("ـبـ");
  });
  it("names are unique", () => {
    expect(new Set(LETTERS.map((l) => l.name)).size).toBe(32);
  });
});

describe("checkDrill: letter → sound", () => {
  it("accepts the sound or the letter's name", () => {
    expect(checkDrill("sound", "ب", "b").ok).toBe(true);
    expect(checkDrill("sound", "ب", "be").ok).toBe(true);
    expect(checkDrill("sound", "ب", "p").ok).toBe(false);
  });
  it("accepts every value of a many-valued letter", () => {
    for (const a of ["v", "u", "o"]) expect(checkDrill("sound", "و", a).ok).toBe(true);
  });
  it("accepts the value or the name of a digit", () => {
    expect(checkDrill("sound", "۳", "3").ok).toBe(true);
    expect(checkDrill("sound", "۳", "se").ok).toBe(true);
  });
  it("accepts other common names (he-ye hotti, colloquial châr)", () => {
    expect(checkDrill("sound", "ح", "he-ye hotti").ok).toBe(true);
    expect(checkDrill("sound", "ه", "he-ye havvaz").ok).toBe(true);
    expect(checkDrill("sound", "۴", "châr").ok).toBe(true);
  });
});

describe("checkDrill: sound → letter", () => {
  it("accepts the letter, including from an Arabic keyboard", () => {
    expect(checkDrill("letter", "ی", "ی").ok).toBe(true);
    expect(checkDrill("letter", "ی", "ي").ok).toBe(true);
    expect(checkDrill("letter", "ک", "ك").ok).toBe(true);
  });
  it("names a same-sound slip", () => {
    const r = checkDrill("letter", "ص", "س");
    expect(r.ok).toBe(false);
    expect(r.hint).toMatch(/same sound/i);
  });
  it("asks for the Persian digit when a Western one is typed", () => {
    const r = checkDrill("letter", "۳", "3");
    expect(r.ok).toBe(false);
    expect(r.hint).toMatch(/۳/);
  });
});

describe("checkDrill: words", () => {
  it("reads a word by its transliteration", () => {
    expect(checkDrill("read", "کتاب", "ketâb").ok).toBe(true);
    expect(checkDrill("read", "کتاب", "ketaab").ok).toBe(true);
  });
  it("spells a word in Persian script with hints", () => {
    expect(checkDrill("spell", "صبح", "صبح").ok).toBe(true);
    expect(checkDrill("spell", "صبح", "سبح").hint).toMatch(/ص/);
  });
});

describe("word unlocking", () => {
  it("every drill word has a unique id and transliteration", () => {
    expect(new Set(WORD_CARDS.map((w) => w.id)).size).toBe(WORD_CARDS.length);
    for (const w of WORD_CARDS) expect(w.translit).toMatch(/^[a-zâ'-]+$/);
  });
  it("only offers words whose letters are all unlocked", () => {
    const first = new Set(DRILL_GROUPS[0]);
    const words = wordsFor(first).map((w) => w.id);
    expect(words).toContain("آب");
    expect(words).toContain("بابا");
    expect(words).not.toContain("کتاب");
  });
});

describe("legacy progress", () => {
  it("opens the groups whose letters were all marked learned in the old app", () => {
    expect(legacyUnlockedGroups(JSON.stringify({ l: [0, 1, 2, 3, 4, 5] }))).toBe(2);
    expect(legacyUnlockedGroups(JSON.stringify({ l: [0, 1, 2, 3, 4, 5, 6, 7, 8] }))).toBe(3);
  });
  it("ignores missing or broken data", () => {
    expect(legacyUnlockedGroups(null)).toBeNull();
    expect(legacyUnlockedGroups("{oops")).toBeNull();
    expect(legacyUnlockedGroups(JSON.stringify({ l: [3] }))).toBeNull();
  });
});
