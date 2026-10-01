import { describe, expect, it } from "vitest";
import type { Block } from "@/content/types";
import { CONVERT_CARDS, CONVERT_LEAVE_OUT, CONVERT_LEFT_OUT } from "@/content/convert";
import { ALL_LESSONS } from "@/content/units";
import { VERBS } from "@/content/verbs";
import {
  buildConvertCards,
  checkConvert,
  convertAsk,
  convertCandidates,
  convertDue,
  convertStats,
  emptyConvertData,
  sides,
  type ConvertLesson,
} from "@/lib/convert";
import { hashLine } from "@/lib/cloze";
import { parseMarkup, plainOf } from "@/lib/markup";
import { normalizeFa } from "@/lib/persian/normalize";
import { answer, emptyDeck } from "@/lib/srs";

const lesson = (key: string, number: string, blocks: Block[], register: "both" | "spoken" | "written" = "both"): ConvertLesson => ({
  key,
  number,
  href: `/learn/${key}`,
  lesson: { register, blocks },
});

const A = lesson("one/a", "1.1", [
  {
    type: "examples",
    items: [
      { fa: "هَر روز {می‌رَم} بازار.", written: "هَر روز به بازار {می‌رَوَم}.", en: "I go to the bazaar every day." },
      { fa: "دیروز {رَفْتَم}.", written: "دیروز {رَفْتَم}.", en: "I went yesterday." },
      { fa: "کِتاب رُو خونْدَم.", written: "کِتاب را خوانْدَم.", en: "I read the book." },
      { fa: "میای؟", written: "می‌آیی؟", en: "Are you coming?" },
      { fa: "نون {نَداریم}.", en: "We have no bread." },
    ],
  },
  { type: "callout", kind: "mistake", text: "x", wrong: { fa: "مَن می‌خَرَم نون.", written: "مَن می‌خَرَم نان.", en: "(wrong)" } },
  {
    type: "dialogue",
    lines: [
      { who: "A", fa: "سَلام، خوبی؟", written: "سَلام، خوب هَسْتی؟", en: "Hi, how are you?" },
      { who: "B", fa: "هَر روز {می‌رَم} بازار.", written: "هَر روز به بازار {می‌رَوَم}.", en: "I go to the bazaar every day." },
    ],
  },
]);
const B = lesson("one/b", "1.2", [
  { type: "examples", items: [{ fa: "هَر روز {می‌رَم} بازار.", written: "هَر روز به بازار {می‌رَوَم}.", en: "I go to the bazaar every day." }] },
  { type: "examples", items: [{ fa: "هَر روز {می‌رَم} بازار.", written: "هَر روز {می‌رَوَم} بازار.", en: "Every day I go to the bazaar." }] },
]);
const S = lesson("one/s", "1.3", [{ type: "examples", items: [{ fa: "نون می‌خَرَم.", written: "نان می‌خَرَم.", en: "I buy bread." }] }], "spoken");

const { cards } = buildConvertCards([A, B, S], { verbs: VERBS });
const plain = (s: string) => plainOf(parseMarkup(s));
const one = (fa: string, written?: string) => {
  const found = cards.filter((c) => c.fa === fa && (!written || c.written === written));
  expect(found).toHaveLength(1);
  return found[0];
};
const BAZAAR = "هَر روز {می‌رَم} بازار.";

describe("spoken ↔ written: cards", () => {
  it("takes the lines whose written form differs, from examples, pairs and dialogues, and no callout", () => {
    expect(cards.map((c) => plain(c.fa))).toEqual(["هَر روز می‌رَم بازار.", "کِتاب رُو خونْدَم.", "میای؟", "سَلام، خوبی؟", "هَر روز می‌رَم بازار."]);
    expect(cards.some((c) => c.fa.includes("نون {نَداریم}"))).toBe(false); // no written line
    expect(cards.some((c) => c.fa.includes("دیروز"))).toBe(false); // the same once marks are off
    expect(cards.some((c) => c.fa.includes("می‌خَرَم نون"))).toBe(false); // a callout's wrong example
  });
  it("makes one card of a pair of lines taught twice, which joins with either lesson, and skips lessons in one register", () => {
    const c = one(BAZAAR, "هَر روز به بازار {می‌رَوَم}.");
    expect(c.lessons).toEqual(["one/a", "one/b"]);
    expect(c.id).toBe(`one/a#${hashLine(`${plain(c.fa)}\n${plain(c.written)}`)}`);
    expect(cards.some((x) => x.lessons.includes("one/s"))).toBe(false);
  });
  it("lets two cards that show the same line take each other's target", () => {
    expect(one(BAZAAR, "هَر روز به بازار {می‌رَوَم}.").twinsWritten).toEqual(["هَر روز می‌رَوَم بازار."]);
  });
});

describe("spoken ↔ written: checking", () => {
  const bazaar = () => one(BAZAAR, "هَر روز به بازار {می‌رَوَم}.");
  it("takes the target without marks or punctuation", () => {
    expect(checkConvert(bazaar(), "to-written", "هر روز به بازار می‌روم")).toEqual({ ok: true });
    expect(checkConvert(bazaar(), "to-spoken", "هر روز می‌رم بازار!")).toEqual({ ok: true });
  });
  it("calls a half-space slip a near miss, naming the word", () => {
    const v = checkConvert(bazaar(), "to-written", "هر روز به بازار می روم");
    expect(v.ok).toBe(false);
    expect(v.hint).toMatch(/half-space.*می‌رَوَم/);
  });
  it("names the first word that differs, or one missing or extra", () => {
    expect(checkConvert(bazaar(), "to-written", "هر روز به بازار می‌رم").hint).toBe("You typed می‌رم; the written form has می‌رَوَم.");
    expect(checkConvert(bazaar(), "to-written", "هر روز بازار می‌روم").hint).toBe("A word is missing: the written form has به before بازار.");
    expect(checkConvert(bazaar(), "to-written", "هر روز به به بازار می‌روم").hint).toBe("به is not in the written form.");
    expect(checkConvert(bazaar(), "to-written", "هر روز به بازار").hint).toBe("Not finished: the written form goes on with می‌رَوَم.");
  });
  it("tells a word out of place from a wrong word", () => {
    expect(checkConvert(bazaar(), "to-written", "هر روز به می‌روم بازار").hint).toBe("The words are right, but not their order: here the written form has بازار.");
    // (هر روز می‌روم بازار is the twin card's written line, so it is right.)
    expect(checkConvert(bazaar(), "to-written", "هر روز می‌روم به خانه").hint).toBe("می‌روم comes later in the written form; here it has به.");
  });
  it("says so when the line is typed back as shown", () => {
    expect(checkConvert(bazaar(), "to-written", "هر روز می‌رم بازار").hint).toMatch(/as shown/);
  });
  it("takes the engine's other spellings of a verb, with a note", () => {
    const v = checkConvert(one("میای؟"), "to-spoken", "می‌آی");
    expect(v.ok).toBe(true);
    expect(v.note).toMatch(/Also typed this way/);
  });
  it("takes the spoken object marker joined, toward speech", () => {
    expect(checkConvert(one("کِتاب رُو خونْدَم."), "to-spoken", "کتابو خوندم").ok).toBe(true);
  });
  it("shows the right side for each direction", () => {
    expect(sides(bazaar(), "to-written")).toMatchObject({ shown: BAZAAR, to: "written", from: "spoken" });
    expect(sides(bazaar(), "to-spoken")).toMatchObject({ target: "هَر روز می‌رَم بازار.", to: "spoken" });
  });
});

describe("spoken ↔ written: review rules", () => {
  const R = lesson("two/a", "2.1", [
    {
      type: "examples",
      items: [
        { fa: "اَلُو، کُجایی؟", written: "اَلُو، کُجا هَسْتی؟", en: "Hello, where are you?" },
        { fa: "نون رُو کُجا گُذاشْتی؟", written: "نان را کُجا گُذاشْتی؟", en: "Where did you put the bread?" },
        { fa: "فَرْدا می‌رَم تِهْرون.", written: "فَرْدا به تِهْران خواهَم رَفْت.", en: "I'll go to Tehran tomorrow." },
        { fa: "کِلید تو کیفه.", written: "کِلید تویِ کیف اَسْت.", en: "The key is in the bag." },
        { fa: "آره، مِرْسی!", written: "بَله، مُتَشَکِّرَم!", en: "Yes, thanks!" },
        { fa: "شیرازی‌اَم.", written: "اَز شیراز هَسْتَم.", en: "I'm from Shiraz." },
        { fa: "روزا خوبَن.", written: "روزها خوبَنْد.", en: "The days are good." },
        { fa: "خونه‌ها گِرونَن.", written: "خانه‌ها گِران هَسْتَنْد.", en: "Houses are expensive." },
      ],
    },
  ]);
  const { cards: r, leftOut } = buildConvertCards([R], {
    verbs: VERBS,
    leaveOut: {
      [`two/a#${hashLine("روزا خوبَن.\nروزها خوبَنْد.")}`]: { dir: "to-spoken", why: "test" },
      [`two/a#${hashLine("خونه‌ها گِرونَن.\nخانه‌ها گِران هَسْتَنْد.")}`]: { dir: "to-spoken", why: "test" },
    },
  });
  const c = (fa: string) => r.find((x) => x.fa === fa)!;
  it("never reads every ـُو as را", () => {
    expect(c("اَلُو، کُجایی؟").alsoSpoken ?? []).toEqual([]);
  });
  it("takes written forms only toward writing", () => {
    expect(checkConvert(c("نون رُو کُجا گُذاشْتی؟"), "to-written", "نان را کجا ذاشتی").ok).toBe(false);
  });
  it("takes the written present for a written future, with a note", () => {
    const v = checkConvert(c("فَرْدا می‌رَم تِهْرون."), "to-written", "فردا به تهران می‌روم");
    expect(v.ok).toBe(true);
    expect(v.note).toMatch(/future/);
  });
  it("takes دَر for تویِ in writing, بَله for آره in speech", () => {
    expect(checkConvert(c("کِلید تو کیفه."), "to-written", "کلید در کیف است").ok).toBe(true);
    expect(checkConvert(c("آره، مِرْسی!"), "to-spoken", "بله مرسی").ok).toBe(true);
  });
  it("takes speech in the written order, with or without به", () => {
    expect(checkConvert(c("فَرْدا می‌رَم تِهْرون."), "to-spoken", "فردا تهرون می‌رم").ok).toBe(false); // خواهم رفت has no spoken partner
    const { cards: o } = buildConvertCards(
      [lesson("x/y", "1.1", [{ type: "examples", items: [{ fa: "دیروز رَفْتَم بازار.", written: "دیروز به بازار رَفْتَم.", en: "I went to the bazaar." }] }])],
      { verbs: VERBS },
    );
    // The written line is good speech as it stands: the card is not asked toward speech.
    expect(o[0].only).toBe("to-written");
    const { cards: h } = buildConvertCards(
      [lesson("x/y", "1.1", [{ type: "examples", items: [{ fa: "دیروز رَفْتَم خونه.", written: "دیروز به خانه رَفْتَم.", en: "I went home yesterday." }] }])],
      { verbs: VERBS },
    );
    expect(checkConvert(h[0], "to-spoken", "دیروز به خونه رفتم").ok).toBe(true);
    expect(checkConvert(h[0], "to-spoken", "دیروز خونه رفتم").ok).toBe(true);
  });
  it("leaves out toward writing a full هستم after a consonant, and leaves out a direction by hand", () => {
    expect(c("شیرازی‌اَم.").only).toBe("to-spoken");
    // Left out toward speech by hand and toward writing by the rule: no card.
    expect(c("خونه‌ها گِرونَن.")).toBeUndefined();
    expect(r.find((x) => x.fa === "روزا خوبَن.")?.only).toBe("to-written");
    expect(leftOut.find((l) => l.fa === "روزا خوبَن.")?.dir).toBe("to-spoken");
  });
  it("ignores a half-space after a letter that never joins", () => {
    expect(checkConvert(c("روزا خوبَن."), "to-written", "روز‌ها خوبند").ok).toBe(true);
  });
});

describe("spoken ↔ written: the decks", () => {
  it("joins cards when a lesson is done, and counts each direction apart", () => {
    expect(convertCandidates(cards, {}, "to-written")).toEqual([]);
    expect(convertCandidates(cards, { "one/b": true }, "to-written")).toHaveLength(2);
    const id = cards[0].id;
    const data = { ...emptyConvertData(), decks: { "to-written": answer([], emptyDeck(), id, false, 0).state, "to-spoken": emptyDeck() } };
    expect(convertStats(cards, data, "to-written", { "one/a": true }, 1).due).toBe(1);
    expect(convertStats(cards, data, "to-spoken", { "one/a": true }, 1).due).toBe(0);
    expect(convertDue(data, 1)).toBe(1);
    expect(emptyConvertData().dir).toBe("to-written");
  });
  it("gives the notebook the card without its lesson list", () => {
    expect("lessons" in convertAsk(cards[0])).toBe(false);
  });
});

describe("spoken ↔ written: the course's cards", () => {
  it("have unique ids", () => {
    expect(CONVERT_CARDS.length).toBeGreaterThan(300);
    expect(new Set(CONVERT_CARDS.map((c) => c.id)).size).toBe(CONVERT_CARDS.length);
  });
  it("each take their own target, both ways, and differ once marks are off", () => {
    for (const c of CONVERT_CARDS) {
      expect(normalizeFa(plain(c.fa)), c.id).not.toBe(normalizeFa(plain(c.written)));
      expect(checkConvert(c, "to-written", plain(c.written)).ok, c.id).toBe(true);
      expect(checkConvert(c, "to-spoken", plain(c.fa)).ok, c.id).toBe(true);
      expect(checkConvert(c, "to-written", plain(c.fa)).ok, c.id).toBe(false);
    }
  });
  it("come from lessons that exist, and leave out by hand only cards that exist", () => {
    const keys = ALL_LESSONS.map((r) => r.key);
    for (const c of CONVERT_CARDS) for (const k of c.lessons) expect(keys).toContain(k);
    const ids = new Set(CONVERT_LEFT_OUT.map((l) => l.id));
    for (const id of Object.keys(CONVERT_LEAVE_OUT)) expect(ids, id).toContain(id);
  });
});
