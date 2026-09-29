import { describe, expect, it } from "vitest";
import { buildDictionary, compareFa, foldLatin, matches } from "@/lib/dictionary";
import { DICTIONARY } from "@/content/dictionary";

const L = { href: "/learn/a/b", number: "1.1", title: "T", unit: "a" };

describe("dictionary", () => {
  it("merges the same word from a lesson and the trainer", () => {
    const d = buildDictionary([
      { fa: "{کِتاب}", en: "book", lesson: L, topic: "learning" },
      { fa: "کِتاب", en: "book", trainer: true },
    ]);
    expect(d).toHaveLength(1);
    expect(d[0]).toMatchObject({ fa: "کِتاب", en: "book", trainer: true, topic: "learning", translit: "ketâb" });
    expect(d[0].lessons).toEqual([L]);
  });
  it("keeps words that differ only in their vowel marks apart", () => {
    const d = buildDictionary([
      { fa: "گُل", en: "flower" },
      { fa: "گِل", en: "mud" },
    ]);
    expect(d).toHaveLength(2);
  });
  it("sorts in Persian alphabet order, آ with ا", () => {
    const words = ["بابا", "آب", "پِدَر", "اَسْب", "یَخ"];
    expect([...words].sort(compareFa)).toEqual(["آب", "اَسْب", "بابا", "پِدَر", "یَخ"]);
  });
  it("searches Persian with or without marks, transliteration without accents, and English", () => {
    const [e] = buildDictionary([{ fa: "خانه", en: "house, home" }]);
    expect(matches(e, "خانه")).toBe(true);
    expect(matches(e, "خان")).toBe(true);
    expect(matches(e, "khane")).toBe(true);
    expect(matches(e, "xâne")).toBe(true);
    expect(matches(e, "home")).toBe(true);
    expect(matches(e, "kitab")).toBe(false);
    const [ab] = buildDictionary([{ fa: "آب", en: "water" }]);
    expect(matches(ab, "ab")).toBe(true);
    expect(matches(ab, "اب")).toBe(true);
  });
  it("folds transliteration leniently", () => {
    expect(foldLatin("Qahve")).toBe(foldLatin("ghahve"));
    expect(foldLatin("sâ'at")).toBe("saat");
  });
  it("holds the old app's words and the lesson vocabulary, each with a topic", () => {
    expect(DICTIONARY.length).toBeGreaterThan(110);
    for (const e of DICTIONARY) expect(e.translit).toMatch(/^[a-zâ' -]+$/);
    expect(DICTIONARY.filter((e) => !e.topic).map((e) => e.fa)).toEqual([]);
  });
});

describe("dictionary ranking", () => {
  it("puts transliteration prefix matches before English ones", async () => {
    const { rank } = await import("@/lib/dictionary");
    const [ab, miz] = buildDictionary([
      { fa: "آب", en: "water" },
      { fa: "میز", en: "table, desk" },
    ]);
    expect(rank(ab, "ab")).toBeLessThan(rank(miz, "ab"));
    expect(rank(miz, "table")).toBe(1);
  });
});
