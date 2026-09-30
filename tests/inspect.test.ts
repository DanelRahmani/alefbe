import { describe, expect, it } from "vitest";
import { parseMarkup } from "@/lib/markup";
import { FATHA, SHADDA, ZWJ, ZWNJ } from "@/lib/persian/chars";
import { canonMarks, findWord, letterParts, nthWord, withoutEzafe, wordIndexAt, wordsOfTokens } from "@/lib/inspect";

describe("wordsOfTokens", () => {
  it("splits a run into words with their readings", () => {
    expect(wordsOfTokens(parseMarkup("اینْ کِتابِ مَن اَسْت."))).toEqual([
      { fa: "اینْ", translit: "in" },
      { fa: "کِتابِ", translit: "ketâb-e" },
      { fa: "مَن", translit: "man" },
      { fa: "اَسْت", translit: "ast" },
    ]);
  });
  it("keeps a half-space compound as one word and reads a split highlight together", () => {
    const w = wordsOfTokens(parseMarkup(`می${ZWNJ}{رَوَم}`));
    expect(w).toEqual([{ fa: `می${ZWNJ}رَوَم`, translit: "miravam" }]);
  });
  it("uses a transliteration override for its word only", () => {
    expect(wordsOfTokens(parseMarkup("[کی|ki / key] مَن")).map((w) => w.translit)).toEqual(["ki / key", "man"]);
  });
});

describe("wordIndexAt", () => {
  const text = "این کتاب من است.";
  it("finds the word under an offset", () => {
    expect(wordIndexAt(text, 0)).toBe(0);
    expect(wordIndexAt(text, 5)).toBe(1);
    expect(wordIndexAt(text, 9)).toBe(2);
    expect(wordIndexAt(text, 13)).toBe(3);
  });
  it("counts a tap at a word's edge as that word", () => {
    expect(wordIndexAt(text, 3)).toBe(0);
    expect(wordIndexAt(text, 4)).toBe(1);
  });
  it("ignores the joiners a split highlight adds", () => {
    const shown = `می${ZWNJ}${ZWJ}رَوَم مَن`;
    expect(wordIndexAt(shown, 5)).toBe(0);
    expect(wordIndexAt(shown, shown.length - 1)).toBe(1);
  });
  it("gives null between words", () => {
    expect(wordIndexAt("یک  دو", 3)).toBeNull();
  });
});

describe("nthWord", () => {
  it("takes the same word from the marked variant", () => {
    expect(nthWord("اینْ کِتابِ مَن اَسْت.", 1)).toBe("کِتابِ");
    expect(nthWord(`می${ZWNJ}${ZWJ}رَوَم`, 0)).toBe(`می${ZWNJ}رَوَم`);
    expect(nthWord("مَن", 3)).toBeNull();
  });
});

describe("findWord", () => {
  const dict = [
    { fa: "کِتاب", en: "book" },
    { fa: "مَرد", en: "man" },
    { fa: "خانه", spoken: "خونه", en: "house, home" },
  ];
  it("matches the marked spelling, written or spoken", () => {
    expect(findWord(dict, "کِتاب")?.en).toBe("book");
    expect(findWord(dict, "خونه")?.en).toBe("house, home");
  });
  it("drops an ezafe to find the headword", () => {
    expect(withoutEzafe("کِتابِ")).toBe("کِتاب");
    expect(withoutEzafe("خانهٔ")).toBe("خانه");
    expect(findWord(dict, "کِتابِ")?.en).toBe("book");
    expect(findWord(dict, "خانهٔ")?.en).toBe("house, home");
  });
  it("never matches a word with other vowels", () => {
    expect(findWord(dict, "مُرد")).toBeUndefined();
  });
  it("ignores the order of stacked marks", () => {
    const shaddaFirst = `بَچ${SHADDA}${FATHA}ه`;
    const fathaFirst = `بَچ${FATHA}${SHADDA}ه`;
    expect(shaddaFirst).not.toBe(fathaFirst);
    expect(canonMarks(shaddaFirst)).toBe(canonMarks(fathaFirst));
    expect(findWord([{ fa: shaddaFirst, en: "x" }], fathaFirst)?.en).toBe("x");
  });
});

describe("letterParts", () => {
  it("breaks a word into letters with their forms and pages", () => {
    const parts = letterParts("کِتاب");
    expect(parts.map((p) => [p.ch, p.form, p.name])).toEqual([
      ["ک", "initial", "kâf"],
      ["ت", "medial", "te"],
      ["ا", "final", "alef"],
      ["ب", "isolated", "be"],
    ]);
    expect(parts[0].glyph).toBe("کـ");
    expect(parts[1].href).toBe("/script/te");
  });
  it("names alef madde and the hamze seats", () => {
    expect(letterParts("آب")[0]).toMatchObject({ name: "alef madde", href: "/script/alef" });
    const seat = letterParts("مَسْئَله").find((p) => p.ch === "ئ");
    expect(seat).toMatchObject({ name: "hamze on ye", href: undefined });
  });
});
