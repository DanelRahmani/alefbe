import { describe, expect, it } from "vitest";
import { parseMarkup, plainOf, splitScript, tokenText, translitOf } from "@/lib/markup";
import { variantsOf } from "@/lib/persian/marks";

describe("parseMarkup", () => {
  it("returns plain text as one token", () => {
    expect(parseMarkup("سَلام")).toEqual([{ kind: "text", text: "سَلام", hl: false, bold: false, it: false }]);
  });
  it("marks highlighted, bold and italic spans", () => {
    const t = parseMarkup("a {b} **c** *d*");
    expect(t.map((x) => [x.kind === "text" ? x.text : "", x.hl, x.bold, x.it])).toEqual([
      ["a ", false, false, false],
      ["b", true, false, false],
      [" ", false, false, false],
      ["c", false, true, false],
      [" ", false, false, false],
      ["d", false, false, true],
    ]);
  });
  it("parses a transliteration override", () => {
    const t = parseMarkup("[رادیو|râdiyo] را");
    expect(t[0]).toEqual({ kind: "override", base: "رادیو", translit: "râdiyo", hl: false, bold: false, it: false });
  });
  it("throws on unbalanced markers", () => {
    expect(() => parseMarkup("{a")).toThrow();
    expect(() => parseMarkup("a}")).toThrow();
    expect(() => parseMarkup("**a")).toThrow();
    expect(() => parseMarkup("*a")).toThrow();
    expect(() => parseMarkup("[a|b")).toThrow();
    expect(() => parseMarkup("[ab]")).toThrow();
  });
  it("plainOf drops the markup", () => {
    expect(plainOf(parseMarkup("{کِتابِ} **مَن** [رادیو|râdiyo]"))).toBe("کِتابِ مَن رادیو");
  });
});

describe("translitOf", () => {
  it("transliterates tokens and uses overrides", () => {
    expect(translitOf(parseMarkup("{کِتابِ} مَن"))).toBe("ketâb-e man");
    expect(translitOf(parseMarkup("[رادیو|râdiyo] را رُوشَن کُن"))).toBe("râdiyo râ roshan kon");
  });
});

describe("splitScript", () => {
  it("separates Persian runs from English prose", () => {
    expect(splitScript("The word کِتاب means book.")).toEqual([
      { fa: false, s: "The word " },
      { fa: true, s: "کِتاب" },
      { fa: false, s: " means book." },
    ]);
  });
  it("keeps spaces and half-spaces inside a Persian run", () => {
    expect(splitScript("say کِتابِ مَن now")).toEqual([
      { fa: false, s: "say " },
      { fa: true, s: "کِتابِ مَن" },
      { fa: false, s: " now" },
    ]);
  });
});

describe("variantsOf: vowel-mark modes", () => {
  const strip = (mode: "all" | "key" | "none", s: string) =>
    variantsOf(parseMarkup(s))[mode].map(tokenText).join("");

  it("all keeps every mark", () => {
    expect(strip("all", "کِتابِ {مَن}")).toBe("کِتابِ مَن");
  });
  it("none strips short vowels, sukun and tashdid but keeps tanvin and hamze", () => {
    expect(strip("none", "دوسْتِ بَچّه")).toBe("دوست بچه");
    expect(strip("none", "مَثَلاً خانهٔ مَسْئَله")).toBe("مثلاً خانهٔ مسئله");
  });
  it("key keeps marks inside highlights and the ezafe everywhere", () => {
    expect(strip("key", "کِتابِ {مَن} را")).toBe("کتابِ مَن را");
    expect(strip("key", "صَنْدَلیِ سَبْز")).toBe("صندلیِ سبز");
  });
  it("key strips an ezafe-looking kasra only when it is not word-final", () => {
    expect(strip("key", "بِگو")).toBe("بگو");
  });
});
