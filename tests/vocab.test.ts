import { describe, expect, it } from "vitest";
import { DICTIONARY } from "@/content/dictionary";
import { ALL_LESSONS } from "@/content/units";
import { buildDictionary, type DictSource } from "@/lib/dictionary";
import { normalizeFa } from "@/lib/persian/normalize";
import { answer, emptyDeck } from "@/lib/srs";
import { buildVocabCards, checkVocab, emptyVocabData, vocabCandidates, vocabDue, vocabStats } from "@/lib/vocab";
import { ZWNJ } from "@/lib/persian/chars";

const lesson = (unit: string, slug: string, number: string) => ({ href: `/learn/${unit}/${slug}`, number, title: slug, unit });
const src = (fa: string, en: string, l: ReturnType<typeof lesson> | undefined, spoken?: string): DictSource => ({ fa, en, spoken, lesson: l });

const A = lesson("one", "a", "1.1");
const B = lesson("one", "b", "1.2");
const ORDER = ["one/a", "one/b"];

const SOURCES: DictSource[] = [
  src("سُرْخ", "red", B),
  src("قِرْمِز", "red", A),
  src("خانه", "house, home", A, "خونه"),
  src("کِتاب", "book", B),
  src("آب", "water", undefined), // a trainer word: no lesson, no card
  src("پَنْجَره", "window", A),
  src("پَنْجِره", "window", B),
  src("می‌شَوَد", "it is possible", B, "می‌شه"),
  src("اِسْم", "name", A),
  src("نام", "name (formal)", B),
];
const CARDS = buildVocabCards(buildDictionary(SOURCES), ORDER);
const card = (id: string) => CARDS.find((c) => c.id === id)!;

describe("vocabulary deck: cards", () => {
  it("makes a card for every word a lesson teaches, in lesson order", () => {
    expect(CARDS.map((c) => c.id)).not.toContain("آب");
    expect(CARDS).toHaveLength(9);
    const firstB = CARDS.findIndex((c) => c.lessons[0] === "one/b");
    expect(CARDS.slice(0, firstB).every((c) => c.lessons[0] === "one/a")).toBe(true);
    expect(CARDS.slice(firstB).every((c) => c.lessons[0] === "one/b")).toBe(true);
    expect(card("خانه")).toMatchObject({ spoken: "خونه", translit: "khâne", spokenTranslit: "khune", lessons: ["one/a"], lesson: { number: "1.1" } });
  });

  it("tells apart words with the same English by how they start", () => {
    expect(card("قِرْمِز").hint).toBe("starts with ق");
    expect(card("سُرْخ").hint).toBe("starts with س");
    expect(card("کِتاب").hint).toBeUndefined();
  });

  it("gives no hint to two entries that are one spelling without marks", () => {
    expect(card("پَنْجَره").hint).toBeUndefined();
    expect(card("پَنْجِره").hint).toBeUndefined();
  });

  it("uses more letters when the first is shared", () => {
    const cards = buildVocabCards(buildDictionary([src("بُزُرْگ", "big", A), src("بُلَنْد", "big", A), src("گُنْده", "big", A)]), ORDER);
    expect(cards.map((c) => c.hint)).toEqual(["starts with بز", "starts with بل", "starts with گ"]);
  });

  it("a word joins when one of its lessons is marked done", () => {
    expect(vocabCandidates(CARDS, {})).toEqual([]);
    expect(vocabCandidates(CARDS, { "one/a": true }).sort()).toEqual(["خانه", "قِرْمِز", "پَنْجَره", "اِسْم"].sort());
    expect(vocabCandidates(CARDS, { "one/a": true, "one/b": true })).toHaveLength(CARDS.length);
  });
});

describe("vocabulary deck: checking", () => {
  it("accepts the written and the spoken form, and says which was typed", () => {
    expect(checkVocab(card("خانه"), CARDS, "خانه")).toEqual({ ok: true, note: "That is the written form." });
    expect(checkVocab(card("خانه"), CARDS, "خونه")).toEqual({ ok: true, note: "That is the spoken form." });
    expect(checkVocab(card("کِتاب"), CARDS, "کِتاب")).toEqual({ ok: true });
    expect(checkVocab(card("می‌شَوَد"), CARDS, `می${ZWNJ}شه`).ok).toBe(true);
  });

  it("passes on the usual hints for a near miss", () => {
    expect(checkVocab(card("می‌شَوَد"), CARDS, "میشود").hint).toContain("half-space");
    expect(checkVocab(card("قِرْمِز"), CARDS, "غرمز").hint).toContain("Same sound");
  });

  it("does not count the other word for the same English as a miss", () => {
    const v = checkVocab(card("قِرْمِز"), CARDS, "سرخ");
    expect(v).toEqual({ ok: false, again: true, hint: "That also means “red”. This card wants another word: it starts with ق." });
    expect(checkVocab(card("قِرْمِز"), CARDS, "کتاب")).toEqual({ ok: false });
  });

  it("nor a word whose English differs only by a note in brackets", () => {
    expect(card("اِسْم").hint).toBeUndefined();
    expect(checkVocab(card("اِسْم"), CARDS, "نام")).toEqual({ ok: false, again: true, hint: "That is “name (formal)”. This card asks for “name”." });
    expect(checkVocab(card("نام"), CARDS, "اسم")).toEqual({ ok: false, again: true, hint: "That is “name”. This card asks for “name (formal)”." });
  });

  it("takes either marking of a word with two entries", () => {
    expect(checkVocab(card("پَنْجَره"), CARDS, "پنجره")).toEqual({ ok: true });
    expect(checkVocab(card("پَنْجِره"), CARDS, "پنجره")).toEqual({ ok: true });
  });
});

describe("vocabulary deck: counts", () => {
  it("counts new and due cards among the words met", () => {
    const done = { "one/a": true };
    const data = emptyVocabData();
    expect(vocabStats(CARDS, data, done, 0)).toMatchObject({ fresh: 4, due: 0 });
    const deck = answer([], emptyDeck(), "خانه", false, 5).state;
    expect(vocabStats(CARDS, { ...data, deck }, done, 10)).toMatchObject({ fresh: 3, due: 1 });
  });

  it("counts due cards for the Today card from the deck alone, skipping words that left the course", () => {
    let deck = emptyDeck();
    for (const id of ["خانه", "قِرْمِز", "gone"]) deck = answer([], deck, id, false, 5).state;
    const data = { ...emptyVocabData(), deck };
    expect(vocabDue(data, null, 10)).toBe(3);
    expect(vocabDue(data, new Set(CARDS.map((c) => c.id)), 10)).toBe(2);
    expect(vocabDue(data, null, 1)).toBe(0);
  });
});

describe("vocabulary deck: the course's own words", () => {
  const cards = buildVocabCards(
    DICTIONARY,
    ALL_LESSONS.map((r) => r.key),
  );

  it("has a card for every lesson word, each pointing at real lessons", () => {
    const keys = new Set(ALL_LESSONS.map((r) => r.key));
    expect(cards.length).toBe(DICTIONARY.filter((e) => e.lessons.length).length);
    expect(cards.length).toBeGreaterThan(300);
    expect(cards.flatMap((c) => c.lessons).filter((k) => !keys.has(k))).toEqual([]);
  });

  it("every card can be answered with its own spelling, and no two cards are indistinguishable", () => {
    const clash: string[] = [];
    for (const c of cards) {
      expect(checkVocab(c, cards, c.fa).ok, c.id).toBe(true);
      if (c.spoken) expect(checkVocab(c, cards, c.spoken).ok, c.id).toBe(true);
    }
    // Same English and no hint: allowed only when the unmarked spellings are the same word.
    const byGloss = new Map<string, typeof cards>();
    for (const c of cards) byGloss.set(c.en.toLowerCase(), [...(byGloss.get(c.en.toLowerCase()) ?? []), c]);
    for (const group of byGloss.values())
      for (const c of group)
        if (group.length > 1 && !c.hint && !group.some((o) => o !== c && normalizeFa(o.fa) === normalizeFa(c.fa))) clash.push(`${c.id}: ${c.en}`);
    expect(clash).toEqual([]);
  });
});
