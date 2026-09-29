import { describe, expect, it } from "vitest";
import { LETTERS, formsInWord, highlightLetter, letterBySlug, sameSoundAs } from "@/lib/persian/letters";
import { checkReadable } from "@/lib/persian/syllables";
import { transliterate, wordKind } from "@/lib/translit";

const formsOf = (w: string) => formsInWord(w).map((l) => `${l.ch}:${l.form.slice(0, 3)}`).join(" ");

describe("formsInWord", () => {
  it("gives each letter its joining form", () => {
    expect(formsOf("باد")).toBe("ب:ini ا:fin د:iso");
    expect(formsOf("نان")).toBe("ن:ini ا:fin ن:iso");
    expect(formsOf("کِتاب")).toBe("ک:ini ت:med ا:fin ب:iso");
    expect(formsOf("دَسْت")).toBe("د:iso س:ini ت:fin");
  });
  it("keeps marks with their letter and ignores them for joining", () => {
    const [k] = formsInWord("کِتاب");
    expect(k.marks).toBe("ِ");
  });
  it("breaks joining at a half-space or space", () => {
    expect(formsOf("می‌رَوَم")).toBe("م:ini ی:fin ر:iso و:iso م:iso");
    expect(formsOf("نان نان")).toBe("ن:ini ا:fin ن:iso ن:ini ا:fin ن:iso");
  });
  it("highlights one letter with its marks", () => {
    const w = "کِتاب";
    expect(highlightLetter(w, formsInWord(w)[0])).toBe("{کِ}تاب");
    expect(highlightLetter(w, formsInWord(w)[3])).toBe("کِتا{ب}");
  });
});

describe("letter data", () => {
  it("slugs are unique ASCII and resolve", () => {
    expect(new Set(LETTERS.map((l) => l.slug)).size).toBe(32);
    for (const l of LETTERS) {
      expect(l.slug).toMatch(/^[a-z-]+$/);
      expect(letterBySlug.get(l.slug)).toBe(l);
    }
  });
  it("every key word is readable, transliterates cleanly and contains its letter", () => {
    for (const l of LETTERS) {
      expect(checkReadable(l.key.fa), l.key.fa).toEqual([]);
      expect(transliterate(l.key.fa)).toMatch(/^[a-zâ']+$/);
      expect(l.key.fa.includes(l.ch), l.ch).toBe(true);
    }
  });
  it("same-sound letters list the others", () => {
    expect(sameSoundAs("س")).toEqual(["ص", "ث"]);
    expect(sameSoundAs("ب")).toEqual([]);
  });
});

describe("letter forms in text", () => {
  it("treats initial and medial forms as letters, final forms as affixes", () => {
    expect(wordKind("بـ")).toBe("letter");
    expect(wordKind("ـبـ")).toBe("letter");
    expect(wordKind("ب")).toBe("letter");
    expect(wordKind("ـب")).toBe("affix");
    expect(wordKind("ـها")).toBe("affix");
    expect(transliterate("بـ و ـبـ")).toBe("  ");
  });
});
