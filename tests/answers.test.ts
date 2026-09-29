import { describe, expect, it } from "vitest";
import { checkEn, checkFa, checkTranslit, normalizeFa } from "@/lib/answers";

describe("normalizeFa", () => {
  it("maps Arabic letter variants to Persian", () => {
    expect(normalizeFa("كتاب")).toBe("کتاب");
    expect(normalizeFa("علي")).toBe("علی");
    expect(normalizeFa("موسى")).toBe("موسی");
    expect(normalizeFa("٣")).toBe("۳");
  });
  it("strips vowel marks, tatweel, bidi controls and extra spaces", () => {
    expect(normalizeFa("  کِتـابِ‏  مَن ")).toBe("کتاب من");
  });
  it("decomposes ۀ into he + hamze and then drops the optional hamze", () => {
    expect(normalizeFa("خانۀ")).toBe("خانه");
  });
});

describe("checkFa", () => {
  it("accepts an exact match, marks optional", () => {
    expect(checkFa("کتاب", ["کِتاب"])).toEqual({ ok: true });
  });
  it("accepts Arabic keyboard letters silently", () => {
    expect(checkFa("كتاب", ["کِتاب"])).toEqual({ ok: true });
  });
  it("flags a space or nothing where a half-space belongs", () => {
    const space = checkFa("می روم", ["می‌رَوَم"]);
    expect(space.ok).toBe(false);
    expect(space.hint).toMatch(/half-space/);
    expect(checkFa("میروم", ["می‌رَوَم"]).hint).toMatch(/half-space/);
  });
  it("names a same-sound letter swap", () => {
    const r = checkFa("سبح", ["صُبْح"]);
    expect(r.ok).toBe(false);
    expect(r.hint).toMatch(/ص/);
    expect(r.hint).toMatch(/س/);
  });
  it("accepts a common variant spelling with a note", () => {
    const r = checkFa("بلیط", ["بِلیت"]);
    expect(r.ok).toBe(true);
    expect(r.note).toMatch(/بلیت/);
  });
  it("accepts ـه‌ی for the ezafe after silent he with a note", () => {
    const r = checkFa("خانه‌ی من", ["خانهٔ مَن"]);
    expect(r.ok).toBe(true);
    expect(r.note).toBeTruthy();
  });
  it("points out a missing madde (آ written as ا)", () => {
    const r = checkFa("اب", ["آب"]);
    expect(r.ok).toBe(false);
    expect(r.hint).toMatch(/آ/);
  });
  it("ignores sentence punctuation", () => {
    expect(checkFa("مریم را دیدم.", ["مَرْیَم را دیدَم"])).toEqual({ ok: true });
    expect(checkFa("«چای می‌خوری؟»", ["چای می‌خُوری"])).toEqual({ ok: true });
  });
  it("rejects a different word", () => {
    expect(checkFa("کتب", ["کِتاب"]).ok).toBe(false);
  });
});

describe("checkTranslit", () => {
  it("accepts â typed several ways", () => {
    for (const a of ["ketâb", "ketaab", "ketāb", "ketáb", "keta^b"]) expect(checkTranslit(a, ["ketâb"]).ok).toBe(true);
  });
  it("does not accept plain a for â", () => {
    expect(checkTranslit("ketab", ["ketâb"]).ok).toBe(false);
  });
  it("makes ezafe hyphens optional", () => {
    expect(checkTranslit("ketâbe man", ["ketâb-e man"]).ok).toBe(true);
  });
  it("accepts curly apostrophes and ow/o", () => {
    expect(checkTranslit("ma’ni", ["ma'ni"]).ok).toBe(true);
    expect(checkTranslit("noruz", ["nowruz"]).ok).toBe(true);
  });
  it("accepts x for kh with a note", () => {
    const r = checkTranslit("xâne", ["khâne"]);
    expect(r.ok).toBe(true);
    expect(r.note).toBeTruthy();
  });
  it("accepts a missing apostrophe for eyn with a hint", () => {
    const r = checkTranslit("mani", ["ma'ni"]);
    expect(r.ok).toBe(true);
    expect(r.note).toMatch(/'/);
  });
});

describe("checkEn", () => {
  it("ignores case, punctuation and spacing", () => {
    expect(checkEn("  The Book. ", ["the book"]).ok).toBe(true);
    expect(checkEn("a book", ["the book"]).ok).toBe(false);
  });
});
