import { describe, expect, it } from "vitest";
import type { Block } from "@/content/types";
import { CLOZE_CARDS, CLOZE_LEAVE_OUT, CLOZE_LEFT_OUT } from "@/content/cloze";
import { ALL_LESSONS } from "@/content/units";
import { VERBS } from "@/content/verbs";
import { buildClozeCards, checkCloze, clauseKe, clozeAsk, clozeCandidates, clozeDue, clozeStats, emptyClozeData, gapCount, hashLine, pruneDeck, type ClozeLesson } from "@/lib/cloze";
import { parseMarkup } from "@/lib/markup";
import { ZWNJ } from "@/lib/persian/chars";
import { normalizeFa } from "@/lib/persian/normalize";
import { answer, emptyDeck } from "@/lib/srs";

const lesson = (key: string, number: string, blocks: Block[], register: "both" | "spoken" | "written" = "both"): ClozeLesson => ({
  key,
  number,
  href: `/learn/${key}`,
  lesson: { register, blocks },
});

const A = lesson("one/a", "1.1", [
  {
    type: "examples",
    items: [
      { fa: "دیروز {رَفْتَم} بازار.", written: "دیروز به بازار {رَفْتَم}.", en: "I went to the bazaar yesterday." },
      { fa: "هَر روز {می‌رَم} بازار.", written: "هَر روز به بازار {می‌رَوَم}.", en: "I go to the bazaar every day." },
      { fa: "{می‌خَرَم}.", en: "I buy." },
      { fa: "{می‌}رَوَم.", en: "I go." },
      { fa: "{کِتاب رُو} خونْدَم.", en: "I read the book. (typed with رُو)" },
      { fa: "مَن نون نَدارَم.", en: "I have no bread." },
      { fa: "{کِتابِ} مَن", en: "my book (*ketâb-e man*)" },
      { fa: "کیفِ {مَرْیَم}", en: "Maryam's bag" },
      { fa: "بَرادَرَم تو {تِهْرونه}.", written: "بَرادَرَم دَر {تِهْران} اَسْت.", en: "My brother is in Tehran." },
      { fa: "{یه} مَغازه هَسْت.", written: "{مَغازه‌ای} هَسْت.", en: "There's a shop." },
      { fa: "{مَنَم} خوبَم. کَی {اومَدی} {تِهْرون}؟", written: "{مَن هَم} خوبَم. کَی به {تِهْران} {آمَدی}؟", en: "I'm fine too. When did you get to Tehran?" },
      { fa: "آخَرِ هَفْته {می‌خوای} چیکار {کُنی}؟", written: "آخَرِ هَفْته {می‌خواهی} چه کار {کُنی}؟", en: "What do you want to do at the weekend?" },
      { fa: "{کِتابُو} خونْدَم.", en: "I read the book." },
      { fa: "{یه کیلو} بِدین.", en: "Give me a kilo." },
    ],
  },
  {
    type: "callout",
    kind: "mistake",
    text: "x",
    wrong: { fa: "عَلی دیروز {رَفْتَد}.", en: "(meant: Ali went)" },
    right: { fa: "عَلی دیروز {رَفْت}.", en: "Ali went yesterday." },
  },
  { type: "pair", a: { fa: "{یه} رِسْتورانِ {خوبی} می‌شِناسَم.", written: "رِسْتورانِ {خوبی} می‌شِناسَم.", en: "I know a good restaurant." }, b: { fa: "کُجا {زِنْدِگی می‌کُنین}؟", en: "Where do you live?" }, diff: "x" },
]);
const B = lesson("one/b", "1.2", [
  {
    type: "dialogue",
    lines: [
      { who: "Ali", fa: "کُجا {زِنْدِگی می‌کُنی}؟", en: "Where do you live?" },
      { who: "Sara", fa: "دیروز {رَفْتَم} بازار.", written: "دیروز به بازار {رَفْتَم}.", en: "I went to the bazaar yesterday." },
      { who: "Ali", fa: "تُو چِطُوری؟", en: "How are you?" },
      { who: "Sara", fa: "کَی {اومَدی}؟", en: "When did you come?" },
    ],
  },
]);
const C = lesson("one/c", "1.3", [{ type: "examples", items: [{ fa: "هَر روز {می‌رَم} بازار.", written: "هَر روز به بازار {می‌رَوَم}.", en: "I go." }] }], "spoken");

const { cards, leftOut } = buildClozeCards([A, B, C], { verbs: VERBS, leaveOut: { [`one/a#${hashLine("{یه کیلو} بِدین.")}`]: "test" } });
const one = (fa: string) => {
  const found = cards.filter((c) => c.fa === fa);
  expect(found).toHaveLength(1);
  return found[0];
};
const ok = (fa: string, input: string) => checkCloze(one(fa), input).ok;

describe("cloze: cards", () => {
  it("blanks the highlight and keeps the rest of the line as the lesson writes it", () => {
    const c = one("دیروز {رَفْتَم} بازار.");
    expect(c.parts).toEqual([{ text: "دیروز " }, { gap: 0 }, { text: " بازار." }]);
    expect(c.answer).toBe("رَفْتَم");
    expect(c.gaps[0].written).toBeUndefined(); // the same word in both registers
    // Spoken رَفْتَم is the simple past or the perfect, and this lesson teaches neither: no hint.
    expect(c.gaps[0].tense).toBeUndefined();
    expect(one("هَر روز {می‌رَم} بازار.").gaps[0].tense).toBe("present");
    expect(c.id).toBe(`one/a#${hashLine(c.fa)}`);
  });

  it("makes one card of a line taught twice, which joins with either lesson", () => {
    expect(one("دیروز {رَفْتَم} بازار.").lessons).toEqual(["one/a", "one/b"]);
    expect(one("هَر روز {می‌رَم} بازار.").lessons).toEqual(["one/a", "one/c"]);
  });

  it("joins several highlights into one answer, in order", () => {
    const c = one("{یه} رِسْتورانِ {خوبی} می‌شِناسَم.");
    expect(gapCount(c)).toBe(2);
    expect(c.answer).toBe("یه خوبی");
  });

  it("leaves out callouts, whole-sentence and part-word blanks, answers the English gives, names, and cards left out by hand", () => {
    expect(cards.some((c) => c.fa.includes("عَلی"))).toBe(false);
    expect(leftOut.map((l) => [l.fa, l.reason])).toEqual([
      ["{می‌خَرَم}.", "whole sentence"],
      ["{می‌}رَوَم.", "part of a word"],
      ["{کِتاب رُو} خونْدَم.", "answer in the English"],
      ["{کِتابِ} مَن", "answer in the English"],
      ["کیفِ {مَرْیَم}", "a name the English gives"],
      ["{یه کیلو} بِدین.", "left out by hand"],
    ]);
    expect(cards.some((c) => c.fa === "مَن نون نَدارَم.")).toBe(false); // no highlight, no card
  });

  it("shows the line before a dialogue line", () => {
    expect(one("کَی {اومَدی}؟").before).toEqual({ fa: "تُو چِطُوری؟", en: "How are you?" });
    expect(one("کُجا {زِنْدِگی می‌کُنی}؟").before).toBeUndefined();
  });

  it("ignores a written twin the lesson does not show", () => {
    const { cards: onlyC } = buildClozeCards([C]);
    expect(onlyC[0].written).toBeUndefined();
    expect(onlyC[0].gaps[0].written).toBeUndefined();
  });

  it("lets cards that look the same accept each other's answers", () => {
    expect(one("کُجا {زِنْدِگی می‌کُنین}؟").twins).toEqual(["زِنْدِگی می‌کُنی"]);
    expect(ok("کُجا {زِنْدِگی می‌کُنی}؟", "زندگی می‌کنین")).toBe(true);
  });
});

describe("cloze: the written words", () => {
  it("are accepted in their place, with a note", () => {
    const v = checkCloze(one("هَر روز {می‌رَم} بازار."), "می‌روم");
    expect(v.ok).toBe(true);
    expect(v.note).toMatch(/written words/);
  });
  it("line up with the spoken gaps by likeness, gap by gap", () => {
    const c = one("{مَنَم} خوبَم. کَی {اومَدی} {تِهْرون}؟");
    expect(c.gaps.map((g) => g.written)).toEqual(["مَن هَم", "آمَدی", "تِهْران"]);
    expect(checkCloze(c, "من هم آمدی تهران").ok).toBe(true);
    expect(checkCloze(c, "منم اومدی تهران").ok).toBe(true); // one gap written
    expect(checkCloze(c, "من هم تهران آمدی").ok).toBe(false);
  });
  it("are dropped where they would not fit the gap", () => {
    // The written line has no word for the gap where the spoken one has یه: مَغازه‌ای repeats the shown مَغازه.
    expect(one("{یه} مَغازه هَسْت.").gaps[0].written).toBeUndefined();
    // The written line says "is" outside its highlight; the spoken gap holds it.
    expect(one("بَرادَرَم تو {تِهْرونه}.").gaps[0].written).toBeUndefined();
    // A different number of highlights: no stand-in.
    expect(one("{یه} رِسْتورانِ {خوبی} می‌شِناسَم.").gaps.every((g) => !g.written)).toBe(true);
  });
});

describe("cloze: other right answers", () => {
  it("takes the other “you” where nothing fixes it, in every gap at once", () => {
    const c = one("آخَرِ هَفْته {می‌خوای} چیکار {کُنی}؟");
    expect(checkCloze(c, "می‌خوای کنی").ok).toBe(true);
    const v = checkCloze(c, "می‌خواین کنین");
    expect(v.ok).toBe(true);
    expect(v.note).toMatch(/which “you”/);
    expect(checkCloze(c, "می‌خواین کنی").ok).toBe(false);
    // بـ on a compound that usually drops it: the engine's own variant.
    expect(checkCloze(c, "می‌خوای بکنی").ok).toBe(true);
  });
  it("keeps the person the line before fixes", () => {
    expect(ok("کَی {اومَدی}؟", "اومدین")).toBe(false);
    expect(ok("کَی {اومَدی}؟", "اومدی")).toBe(true);
  });
  it("reads a form two tenses share as the earlier tense outside its lesson", () => {
    // Spoken اومَدی is the simple past or the perfect; in lesson 1.2 it is the past: no perfect spellings.
    expect(ok("کَی {اومَدی}؟", "اومده‌ای")).toBe(false);
  });
  it("takes را spelled three ways", () => {
    expect(ok("{کِتابُو} خونْدَم.", "کتاب رو")).toBe(true);
    expect(ok("{کِتابُو} خونْدَم.", "کتاب را")).toBe(true);
  });
});

describe("cloze: who “you” is, and the tense hint", () => {
  const D = lesson("two/a", "2.1", [
    { type: "examples", items: [{ fa: "{بیا} اینْجا.", en: "Come here." }, { fa: "کُجایی؟ چیکار {می‌کُنی}؟", en: "Where are you? What are you doing?" }] },
    {
      type: "dialogue",
      lines: [
        { who: "A", fa: "چی {می‌خوای}؟", en: "What do you want?" },
        { who: "B", fa: "هیچی.", en: "Nothing." },
        { who: "A", fa: "کَی {میای}؟", en: "When are you coming?" },
      ],
    },
    { type: "examples", items: [{ fa: "{دارَم} بیرون {می‌رَم}.", en: "I'm going out." }, { fa: "نون {داریم}. چَنْد تا {می‌خوای}؟", en: "We have bread. How many do you want?" }] },
  ]);
  const { cards: d } = buildClozeCards([D], { verbs: VERBS });
  const card = (fa: string) => d.find((c) => c.fa === fa)!;
  it("takes the other “you” for a command, though its English has no “you”", () => {
    expect(checkCloze(card("{بیا} اینْجا."), "بیاین").ok).toBe(true);
  });
  it("keeps the person a “you are” on the card fixes", () => {
    expect(checkCloze(card("کُجایی؟ چیکار {می‌کُنی}؟"), "می‌کنین").ok).toBe(false);
  });
  it("keeps the person any line of the dialogue fixes", () => {
    // Two lines up: چی می‌خوای؟ fixes تُو.
    expect(checkCloze(card("کَی {میای}؟"), "میاین").ok).toBe(false);
  });
  it("names the progressive once, across two gaps, only with the same person", () => {
    expect(card("{دارَم} بیرون {می‌رَم}.").gaps.map((g) => g.tense)).toEqual(["present progressive", undefined]);
    expect(card("نون {داریم}. چَنْد تا {می‌خوای}؟").gaps.map((g) => g.tense)).toEqual(["present", "present"]);
  });
});

describe("cloze: checking", () => {
  it("takes the answer without marks or punctuation", () => {
    expect(checkCloze(one("دیروز {رَفْتَم} بازار."), "رفتم")).toEqual({ ok: true });
  });
  it("names a half-space slip", () => {
    const v = checkCloze(one("هَر روز {می‌رَم} بازار."), "می رم");
    expect(v.ok).toBe(false);
    expect(v.hint).toMatch(/half-space/);
  });
  it("asks for every gap", () => {
    const c = one("{یه} رِسْتورانِ {خوبی} می‌شِناسَم.");
    expect(checkCloze(c, "یه خوبی").ok).toBe(true);
    expect(checkCloze(c, "خوبی")).toEqual({ ok: false, hint: "This line has 2 gaps: type the missing words of each, in order, with a space between." });
    expect(checkCloze(c, "خوبی یه")).toEqual({ ok: false });
  });
  it("asks for numbers in words", () => {
    expect(checkCloze(one("دیروز {رَفْتَم} بازار."), "۲").hint).toMatch(/number in words/);
  });
  it("notes a missing ـهٔ", () => {
    const { cards: e } = buildClozeCards([lesson("x/y", "1.1", [{ type: "examples", items: [{ fa: "{خونهٔ} ما نَزْدیکه.", en: "Our house is close by." }] }])]);
    expect(checkCloze(e[0], "خونه").note).toMatch(/ezafe/);
  });
});

describe("cloze: the deck", () => {
  it("joins cards when a lesson is done", () => {
    expect(clozeCandidates(cards, {})).toEqual([]);
    expect(clozeCandidates(cards, { "one/b": true })).toEqual(
      [one("دیروز {رَفْتَم} بازار."), one("کُجا {زِنْدِگی می‌کُنی}؟"), one("کَی {اومَدی}؟")].map((c) => c.id).sort((a, b) => cards.findIndex((c) => c.id === a) - cards.findIndex((c) => c.id === b)),
    );
  });
  it("counts due cards from the deck alone, and prunes cards that left the course", () => {
    const id = cards[0].id;
    const deck = answer([], answer([], emptyDeck(), id, false, 0).state, "gone#x", false, 0).state;
    expect(clozeDue({ deck }, 1)).toBe(2);
    const pruned = pruneDeck(deck, new Set(cards.map((c) => c.id)));
    expect(Object.keys(pruned.cards)).toEqual([id]);
    expect(pruneDeck(pruned, new Set(cards.map((c) => c.id)))).toBe(pruned);
    expect(clozeStats(cards, { deck: pruned }, { "one/a": true }, 1)).toMatchObject({ due: 1 });
    expect(emptyClozeData().deck).toEqual(emptyDeck());
  });
  it("gives the notebook the card without its lesson list", () => {
    const ask = clozeAsk(cards[0]);
    expect("lessons" in ask).toBe(false);
    expect(ask.gaps).toEqual(cards[0].gaps);
  });
});

describe("cloze: the course's cards", () => {
  it("have unique ids", () => {
    expect(CLOZE_CARDS.length).toBeGreaterThan(300);
    expect(new Set(CLOZE_CARDS.map((c) => c.id)).size).toBe(CLOZE_CARDS.length);
  });
  it("ask for the lesson's own highlighted words", () => {
    for (const c of CLOZE_CARDS) {
      const hl = parseMarkup(c.fa).filter((t) => t.hl).map((t) => (t.kind === "text" ? t.text : t.base)).join(" ");
      expect(normalizeFa(c.gaps.map((g) => g.fa).join(" ")), c.id).toBe(normalizeFa(hl));
      expect(checkCloze(c, c.answer).ok, c.id).toBe(true);
    }
  });
  it("never blank part of a word", () => {
    for (const c of CLOZE_CARDS)
      for (const p of c.parts) if ("text" in p) expect(p.text.startsWith(ZWNJ) || p.text.endsWith(ZWNJ), c.id).toBe(false);
  });
  it("come from lessons that exist, first lesson first", () => {
    const keys = ALL_LESSONS.map((r) => r.key);
    for (const c of CLOZE_CARDS) {
      expect(c.id.startsWith(c.lessons[0] + "#")).toBe(true);
      for (const k of c.lessons) expect(keys).toContain(k);
    }
  });
  it("leave out by hand only cards that exist", () => {
    const byHand = CLOZE_LEFT_OUT.filter((l) => l.reason === "left out by hand");
    expect(byHand).toHaveLength(Object.keys(CLOZE_LEAVE_OUT).length);
  });
});

describe("cloze: the Unit 10 rules", () => {
  const U = lesson("ten/a", "10.1", [
    {
      type: "examples",
      items: [
        { fa: "{کِتابی که} دیروز خَریدَم خیلی خوبه.", en: "The book I bought yesterday is very good." },
        { fa: "عَلی {گُفْت که} دیر میاد.", en: "Ali said he'd be late." },
        { fa: "{وَقْتی} رِسیدَم، زَنْگ زَدَم.", en: "When I arrived, I called." },
        { fa: "دیروز {دیدَمِش}.", en: "I saw him yesterday." },
      ],
    },
  ]);
  const { cards } = buildClozeCards([U], { verbs: VERBS });
  const also = (i: number) => (cards[i].gaps[0].also ?? []).map((a) => a.fa);

  it("takes اون before a noun with ـی + که that starts the line", () => {
    expect(also(0)).toContain("اون کتابی که");
  });
  it("takes که left out after a verb of saying", () => {
    expect(also(1)).toContain("گفت");
    expect(checkCloze(cards[1], "گفت").ok).toBe(true);
  });
  it("takes وقتی که for وقتی", () => {
    expect(also(2)).toContain("وقتی که");
  });
  it("takes the separate pronoun for a verb with ـِش", () => {
    expect(also(3)).toEqual(expect.arrayContaining(["اونو دیدم", "اون رو دیدم"]));
  });
  it("knows which که opens what was said", () => {
    const w = (s: string) => normalizeFa(s).split(" ");
    expect(clauseKe(w("علی گفت که"), 2)).toBe(true);
    expect(clauseKe(w("می‌دونم که"), 1)).toBe(true);
    expect(clauseKe(w("فکر می‌کنم که"), 2)).toBe(true);
    expect(clauseKe(w("امیدوارم که"), 1)).toBe(true);
    // که for "when" after a verb, and که after ـی, are not.
    expect(clauseKe(w("داشتم می‌رفتم بیرون که"), 3)).toBe(false);
    expect(clauseKe(w("کتابی که"), 1)).toBe(false);
  });
});
