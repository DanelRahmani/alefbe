import { describe, expect, it } from "vitest";
import { emptyClozeData } from "@/lib/cloze";
import { emptyConvertData } from "@/lib/convert";
import { DRILL_GROUPS } from "@/lib/drill";
import { noteAnswer, type MistakeItem, type Notebook } from "@/lib/mistakes";
import { NOTEBOOK_SLOTS, dueCards, mistakeDeckKey, reviewCounts, reviewKey, reviewQueue, type ReviewDecks, type ReviewKnown } from "@/lib/review";
import { DAY, emptyDeck, schedule, type DeckState } from "@/lib/srs";
import { emptyVerbsData, itemId, verbGroups } from "@/lib/verb-drill";
import { emptyVocabData } from "@/lib/vocab";

const NOW = new Date(2026, 9, 1, 12).getTime();

function deckWith(dues: Record<string, number>, unlocked = 1): DeckState {
  const cards = Object.fromEntries(Object.entries(dues).map(([id, due]) => [id, { ...schedule(undefined, true, 0), due }]));
  return { ...emptyDeck(), unlocked, cards };
}

const empty = (): ReviewDecks => ({
  srs: {},
  verbs: emptyVerbsData(),
  vocab: emptyVocabData(),
  cloze: emptyClozeData(),
  convert: emptyConvertData(),
  notebook: {},
});

const known: ReviewKnown = {
  vocab: new Set(["کِتاب", "خانه"]),
  cloze: new Set(["past/simple-past#a", "past/simple-past#b"]),
  convert: { "to-written": new Set(["a#1", "b#2"]), "to-spoken": new Set(["a#1"]) },
};

const [l1, l2, l3] = DRILL_GROUPS[0];
const verb0 = verbGroups("present")[0][0];

function notebookOf(items: MistakeItem[]): Notebook {
  // Later items are missed later, so they come first in the notebook.
  return items.reduce<Notebook>((nb, item, i) => noteAnswer(nb, item, false, NOW - 1000 + i), {});
}

describe("dueCards", () => {
  it("takes the due cards of every deck, earliest first", () => {
    const d = empty();
    d.srs = { sound: deckWith({ [l1]: NOW - 5, [l2]: NOW + DAY }) };
    d.verbs = { ...d.verbs, decks: { present: deckWith({ [verb0]: NOW - 9 }) } };
    d.vocab = { ...d.vocab, deck: deckWith({ کِتاب: NOW - 1 }) };
    d.cloze = { deck: deckWith({ "past/simple-past#a": NOW - 7 }) };
    d.convert = { ...d.convert, decks: { "to-written": deckWith({ "a#1": NOW - 3 }), "to-spoken": deckWith({ "a#1": NOW }) } };
    expect(dueCards(d, known, NOW).map(reviewKey)).toEqual([
      `verb:${verb0}`,
      "cloze:past/simple-past#a",
      `drill:sound:${l1}`,
      "convert:to-written:a#1",
      "vocab:کِتاب",
      "convert:to-spoken:a#1",
    ]);
  });
  it("skips cards outside the open groups and cards that left the course", () => {
    const d = empty();
    d.srs = { letter: deckWith({ [DRILL_GROUPS[1][0]]: NOW - 1 }) };
    d.verbs = { ...d.verbs, decks: { present: deckWith({ [verbGroups("present")[1][0]]: NOW - 1 }) } };
    d.vocab = { ...d.vocab, deck: deckWith({ gone: NOW - 1 }) };
    d.cloze = { deck: deckWith({ "gone#x": NOW - 1 }) };
    // b#2 is asked toward writing only.
    d.convert = { ...d.convert, decks: { "to-written": emptyDeck(), "to-spoken": deckWith({ "b#2": NOW - 1 }) } };
    expect(dueCards(d, known, NOW)).toEqual([]);
  });
  it("asks the words of the word decks once their letters are open", () => {
    const d = empty();
    d.srs = { sound: deckWith({}, 8), read: deckWith({ x: NOW - 1 }) };
    expect(dueCards(d, known, NOW)).toEqual([]);
  });
});

describe("reviewQueue", () => {
  it("puts the notebook after the deck cards, most recent miss first", () => {
    const d = empty();
    d.srs = { sound: deckWith({ [l1]: NOW - 1 }) };
    d.notebook = notebookOf([
      { kind: "lesson", lesson: "start-here/hello", q: 0 },
      { kind: "word", dir: "read", fa: "سَلام", translit: "salâm", en: "hello" },
    ]);
    const q = reviewQueue(d, known, NOW);
    expect(q.map((i) => i.kind)).toEqual(["drill", "mistake", "mistake"]);
    expect(q[1].kind === "mistake" && q[1].mistake.item.kind).toBe("word");
  });
  it("leaves out a notebook item whose deck card is already asked", () => {
    const d = empty();
    d.srs = { sound: deckWith({ [l1]: NOW - 1 }) };
    d.verbs = { ...d.verbs, decks: { present: deckWith({ [verb0]: NOW - 1 }) } };
    const [verbId] = verb0.split(":");
    d.notebook = notebookOf([
      { kind: "drill", mode: "sound", id: l1 },
      { kind: "drill", mode: "sound", id: l2 },
      { kind: "verb", verb: verbId, tense: "present", person: "1s", style: "spoken", negative: false },
    ]);
    const q = reviewQueue(d, known, NOW);
    expect(q.map(reviewKey)).toEqual([`drill:sound:${l1}`, `verb:${verb0}`, `mistake:drill:sound:${l2}`]);
  });
  it("keeps places for the notebook when more cards are due than fit", () => {
    const d = empty();
    d.srs = { sound: deckWith(Object.fromEntries(DRILL_GROUPS[0].map((id, i) => [id, NOW - 100 + i]))) };
    d.notebook = notebookOf(
      Array.from({ length: NOTEBOOK_SLOTS + 3 }, (_, i): MistakeItem => ({ kind: "lesson", lesson: "start-here/hello", q: i })),
    );
    const max = NOTEBOOK_SLOTS + 2;
    const q = reviewQueue(d, known, NOW, max);
    expect(q).toHaveLength(max);
    expect(reviewCounts(q)).toMatchObject({ drill: 2, mistake: NOTEBOOK_SLOTS });
    expect(reviewKey(q[0])).toBe(`drill:sound:${l1}`);
    // With few notebook items, the deck cards take the rest.
    d.notebook = notebookOf([{ kind: "lesson", lesson: "start-here/hello", q: 0 }]);
    expect(reviewCounts(reviewQueue(d, known, NOW, 3))).toMatchObject({ drill: 2, mistake: 1 });
  });
  it("is empty when nothing is due and the notebook is empty", () => {
    const d = empty();
    d.srs = { sound: deckWith({ [l3]: NOW + DAY }) };
    expect(reviewQueue(d, known, NOW)).toEqual([]);
  });
});

describe("mistakeDeckKey", () => {
  it("links notebook items to their deck cards, and the rest to none", () => {
    expect(mistakeDeckKey({ kind: "verb", verb: "raftan", tense: "past", person: "2p", style: "written", negative: true })).toBe(
      `verb:${itemId("raftan", "past")}`,
    );
    expect(mistakeDeckKey({ kind: "letter", type: "letter-name", ch: "ب" })).toBeNull();
    expect(mistakeDeckKey({ kind: "lesson", lesson: "a/b", q: 1 })).toBeNull();
  });
});
