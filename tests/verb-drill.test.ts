import { describe, expect, it } from "vitest";
import { VERBS, verbById } from "@/content/verbs";
import { TENSES, lacks, type Tense } from "@/lib/conjugate";
import { ZWNJ } from "@/lib/persian/chars";
import { answer, emptyDeck, unlockNext } from "@/lib/srs";
import {
  GROUP_SIZE,
  NEGATIVE_SHARE,
  askFor,
  bothStyles,
  checkVerb,
  currentTense,
  describeSpec,
  emptyVerbsData,
  isItem,
  itemId,
  openTense,
  parseItem,
  tenseOpen,
  verbCandidates,
  verbGroups,
  verbTotals,
  verbsOf,
  type VerbQuestion,
} from "@/lib/verb-drill";

const z = (s: string) => s.replace(/_/g, ZWNJ);
/** A rand() that returns the given numbers in turn. */
const seq = (...xs: number[]) => {
  let i = 0;
  return () => xs[i++ % xs.length];
};
const q = (verb: string, person: VerbQuestion["spec"]["person"], style: "spoken" | "written", negative = false, tense: Tense = "present"): VerbQuestion => ({
  verb: verbById.get(verb)!,
  spec: { tense, person, style, negative },
});

describe("verb trainer: items and groups", () => {
  it("makes one item per verb and tense, in groups of five", () => {
    const groups = verbGroups("present");
    // بودن has no present in the engine, so the present groups are the 25 verbs of Phase 5.
    expect(groups.flat()).toEqual(VERBS.filter((v) => v.id !== "budan").map((v) => `${v.id}:present`));
    expect(groups.every((g) => g.length <= GROUP_SIZE)).toBe(true);
    expect(groups[0]).toEqual(["raftan", "âmadan", "kardan", "shodan", "goftan"].map((v) => itemId(v, "present")));
  });

  it("parses item ids and rejects unknown ones", () => {
    expect(parseItem("raftan:present")?.verb.id).toBe("raftan");
    expect(parseItem("raftan:past")?.tense).toBe("past");
    expect(parseItem("raftan:pluperfect")).toBeNull();
    expect(parseItem("budan:present")).toBeNull();
    expect(parseItem("dâshtan:progressive")).toBeNull();
    expect(parseItem("nope:present")).toBeNull();
    expect(isItem("khâstan:present")).toBe(true);
  });

  it("opens the first group, and the next once every item reaches box 3", () => {
    const groups = verbGroups("present");
    const data = emptyVerbsData();
    expect(verbCandidates(data, "present")).toEqual(groups[0]);
    let deck = emptyDeck();
    for (let round = 0; round < 2; round++) for (const id of groups[0]) deck = answer(groups, deck, id, true, 0).state;
    expect(deck.unlocked).toBe(2);
    expect(verbCandidates({ ...data, decks: { present: deck } }, "present")).toEqual([...groups[0], ...groups[1]]);
    expect(unlockNext(groups, emptyDeck()).unlocked).toBe(2);
  });
});

describe("verb trainer: tenses", () => {
  it("groups only the verbs that have the tense, بودن first in the past", () => {
    expect(verbGroups("past")[0]).toEqual(["budan", "raftan", "âmadan", "kardan", "shodan"].map((v) => itemId(v, "past")));
    expect(verbGroups("past").flat()).toHaveLength(VERBS.length);
    expect(verbsOf("imperfect").map((v) => v.id)).not.toContain("dâshtan");
    expect(verbsOf("progressive")).toHaveLength(20);
    for (const t of TENSES) for (const id of verbGroups(t.id).flat()) expect(isItem(id), id).toBe(true);
  });

  it("opens the present at once, and another tense with its lesson or on request", () => {
    const data = emptyVerbsData();
    expect(tenseOpen(data, {}, "present")).toBe(true);
    expect(tenseOpen(data, {}, "past")).toBe(false);
    expect(tenseOpen(data, { "past/simple-past": true }, "past")).toBe(true);
    expect(tenseOpen(data, { "past/simple-past": true }, "perfect")).toBe(false);
    const opened = openTense(data, "perfect");
    expect(tenseOpen(opened, {}, "perfect")).toBe(true);
    expect(openTense(opened, "perfect")).toBe(opened);
    // Both progressives hang on the one lesson.
    expect(tenseOpen(data, { "past/in-progress": true }, "progressive")).toBe(true);
    expect(tenseOpen(data, { "past/in-progress": true }, "past-progressive")).toBe(true);
  });

  it("every tense but the present names the lesson that opens it", () => {
    expect(TENSES.filter((t) => !t.lesson).map((t) => t.id)).toEqual(["present"]);
  });

  it("remembers the tense last practised, and falls back to the present", () => {
    expect(currentTense(emptyVerbsData())).toBe("present");
    expect(currentTense({ ...emptyVerbsData(), tense: "perfect" })).toBe("perfect");
    expect(currentTense({ ...emptyVerbsData(), tense: "gone" as Tense })).toBe("present");
  });

  it("totals the open tenses only", () => {
    const due = (ids: string[]) => ({ unlocked: 1, cards: Object.fromEntries(ids.map((id) => [id, { box: 2, due: 5, reps: 1, lapses: 0 }])) });
    const data = { ...emptyVerbsData(), decks: { present: due(verbGroups("present")[0].slice(0, 2)), past: due(verbGroups("past")[0].slice(0, 3)) } };
    expect(verbTotals(data, {}, 10)).toEqual({ open: 1, due: 2, fresh: 3 });
    expect(verbTotals(data, { "past/simple-past": true }, 10)).toEqual({ open: 2, due: 5, fresh: 5 });
  });
});

describe("verb trainer: asking", () => {
  it("picks person, style and polarity from rand", () => {
    expect(askFor("raftan:present", "both", seq(0, 0.2, 0.9))!.spec).toEqual({ tense: "present", person: "1s", style: "spoken", negative: false });
    expect(askFor("raftan:present", "both", seq(0.99, 0.7, 0.1))!.spec).toEqual({ tense: "present", person: "3p", style: "written", negative: true });
  });
  it("keeps to the chosen style", () => {
    expect(askFor("raftan:present", "written", seq(0.5, 0.1, 0.5))!.spec.style).toBe("written");
    expect(askFor("raftan:present", "spoken", seq(0.5, 0.9, 0.5))!.spec.style).toBe("spoken");
  });
  it("asks the negative about a third of the time", () => {
    expect(NEGATIVE_SHARE).toBeGreaterThan(0.2);
    expect(NEGATIVE_SHARE).toBeLessThan(0.5);
  });
  it("never asks the progressive in the negative", () => {
    expect(askFor("raftan:progressive", "both", seq(0, 0.2, 0.1))!.spec).toEqual({ tense: "progressive", person: "1s", style: "spoken", negative: false });
    expect(askFor("raftan:past", "both", seq(0, 0.2, 0.1))!.spec.negative).toBe(true);
    for (const t of TENSES)
      for (const id of verbGroups(t.id).flat())
        for (const r of [0.1, 0.9]) {
          const asked = askFor(id, "both", seq(0.5, 0.5, r))!;
          expect(lacks(asked.verb, asked.spec.tense, asked.spec.negative, VERBS), id).toBeNull();
        }
  });
  it("asks he/she half the time in the spoken perfect, the one person spelled unlike the simple past", () => {
    const person = (p: number, style: number) => askFor("raftan:perfect", "both", seq(p, style, 0.9))!.spec.person;
    expect([0, 0.3, 0.49].map((p) => person(p, 0.2))).toEqual(["3s", "3s", "3s"]);
    expect([0.55, 0.65, 0.75, 0.85, 0.95].map((p) => person(p, 0.2))).toEqual(["1s", "2s", "1p", "2p", "3p"]);
    // Written, and every other tense: the six persons evenly.
    expect([0, 0.2, 0.4, 0.5, 0.7, 0.9].map((p) => person(p, 0.7))).toEqual(["1s", "2s", "3s", "1p", "2p", "3p"]);
    expect(askFor("raftan:past", "spoken", seq(0.1, 0.2, 0.9))!.spec.person).toBe("1s");
  });
  it("asks a command of تو or شما only, and the future in writing only", () => {
    const persons = [0, 0.3, 0.49, 0.5, 0.8, 0.99].map((p) => askFor("raftan:imperative", "both", seq(p, 0.2, 0.9))!.spec.person);
    expect(persons).toEqual(["2s", "2s", "2s", "2p", "2p", "2p"]);
    expect(askFor("raftan:future", "both", seq(0.1, 0.2, 0.9))!.spec.style).toBe("written");
    expect(askFor("raftan:future", "spoken", seq(0.1, 0.2, 0.9))!.spec.style).toBe("written");
    expect(askFor("raftan:subjunctive", "spoken", seq(0.1, 0.9, 0.9))!.spec.style).toBe("spoken");
    expect(parseItem("khâstan:imperative")).toBeNull();
    expect(verbsOf("imperative")).toHaveLength(24);
    expect(verbsOf("future")).toHaveLength(VERBS.length);
  });
  it("returns null for an unknown item", () => {
    expect(askFor("nope:present", "both", Math.random)).toBeNull();
  });
});

describe("verb trainer: checking", () => {
  it("accepts the form, with or without the pronoun, marks optional", () => {
    expect(checkVerb(q("raftan", "1p", "spoken"), z("می_ریم")).ok).toBe(true);
    expect(checkVerb(q("raftan", "1p", "spoken"), z("ما می_ریم")).ok).toBe(true);
    expect(checkVerb(q("raftan", "3p", "written", true), z("نِمی_رَوَنْد")).ok).toBe(true);
    expect(checkVerb(q("kâr-kardan", "1s", "written"), z("کار می_کنم")).ok).toBe(true);
  });

  it("accepts common chat spellings with a note", () => {
    const v = checkVerb(q("âmadan", "1s", "spoken"), z("می_آم"));
    expect(v.ok).toBe(true);
    expect(v.note).toContain("میام");
    expect(checkVerb(q("khâstan", "1p", "spoken"), z("می_خوایم")).ok).toBe(true);
  });

  it("hints at a missing half-space", () => {
    const v = checkVerb(q("raftan", "1s", "spoken"), "میرم");
    expect(v.ok).toBe(false);
    expect(v.hint).toContain("half-space");
  });

  it("names the form typed when it is another form of the verb", () => {
    const written = checkVerb(q("raftan", "1s", "spoken"), z("می_روم"));
    expect(written.ok).toBe(false);
    expect(written.hint).toBe(`That is ${describeSpec({ person: "1s", style: "written", negative: false })}; this one asks for ${describeSpec({ person: "1s", style: "spoken", negative: false })}.`);
    const affirmative = checkVerb(q("dâshtan", "1s", "spoken", true), "دارم");
    expect(affirmative.hint).toContain("“I”");
    expect(affirmative.hint).toContain("asks for the spoken form for “I”, negative");
    const person = checkVerb(q("goftan", "2s", "spoken"), z("اونا می_گن"));
    expect(person.hint).toContain("“they”");
  });

  it("checks the past tenses, several words included", () => {
    expect(checkVerb(q("âmadan", "1s", "spoken", true, "past"), "نیومدم").ok).toBe(true);
    expect(checkVerb(q("âmadan", "1s", "written", true, "past"), "نیامدم").ok).toBe(true);
    expect(checkVerb(q("raftan", "3s", "written", false, "perfect"), "رفته است").ok).toBe(true);
    expect(checkVerb(q("raftan", "1p", "written", false, "perfect"), z("رفته_ایم")).ok).toBe(true);
    expect(checkVerb(q("raftan", "1p", "written", false, "perfect"), "رفته ایم").hint).toContain("half-space");
    expect(checkVerb(q("kâr-kardan", "1s", "spoken", false, "past-progressive"), z("داشتم کار می_کردم")).ok).toBe(true);
    expect(checkVerb(q("raftan", "2s", "spoken", false, "progressive"), z("تو داری می_ری")).ok).toBe(true);
  });

  it("accepts the written spelling for the spoken perfect, with a note", () => {
    const v = checkVerb(q("raftan", "1s", "spoken", false, "perfect"), z("رفته_ام"));
    expect(v.ok).toBe(true);
    expect(v.note).toContain("رفتم");
    expect(checkVerb(q("raftan", "1s", "spoken", false, "perfect"), z("رفته_م")).ok).toBe(true);
    expect(checkVerb(q("gozâshtan", "3s", "spoken", true, "past"), "نگذاشت").note).toContain("نذاشت");
    expect(checkVerb(q("raftan", "1s", "spoken", false, "perfect"), "رفتم")).toEqual({ ok: true });
  });

  it("names a form of another tense", () => {
    const v = checkVerb(q("raftan", "1s", "written", false, "imperfect"), "رفتم");
    expect(v.ok).toBe(false);
    expect(v.hint).toBe("That is the simple past (the spoken form for “I”); this one asks for the past continuous (the written form for “I”).");
    // The asked tense wins where two tenses are spelled alike: spoken رفتم is both the past and the perfect.
    const same = checkVerb(q("raftan", "1s", "written", false, "perfect"), "رفتم");
    expect(same.hint).toBe(`That is ${describeSpec({ person: "1s", style: "spoken", negative: false })}; this one asks for ${describeSpec({ person: "1s", style: "written", negative: false })}.`);
    expect(checkVerb(q("raftan", "1s", "spoken", false, "past"), z("می_رم")).hint).toContain("the present (");
  });

  it("checks Unit 8's forms", () => {
    expect(checkVerb(q("raftan", "2s", "spoken", false, "imperative"), "برو")).toEqual({ ok: true });
    expect(checkVerb(q("raftan", "2s", "spoken", true, "imperative"), "نرو").ok).toBe(true);
    expect(checkVerb(q("âmadan", "1s", "spoken", false, "subjunctive"), "بیام").ok).toBe(true);
    expect(checkVerb(q("kâr-kardan", "1s", "written", false, "subjunctive"), "کار بکنم").note).toContain("کار کنم");
    expect(checkVerb(q("raftan", "1s", "written", false, "future"), "خواهم رفت").ok).toBe(true);
    expect(checkVerb(q("dâshtan", "3s", "written", false, "subjunctive"), "داشته باشد").ok).toBe(true);
    // The present where the subjunctive was asked: the slip is named.
    expect(checkVerb(q("raftan", "1s", "spoken", false, "subjunctive"), z("می_رم")).hint).toBe(
      "That is the present (the spoken form for “I”); this one asks for the present subjunctive (the spoken form for “I”).",
    );
    // A leading که is fine; a ز for the ذ of گذاشتن is named.
    expect(checkVerb(q("raftan", "1s", "spoken", false, "subjunctive"), "که برم").ok).toBe(true);
    expect(checkVerb(q("gozâshtan", "1s", "spoken", false, "subjunctive"), "بزارم").hint).toBe("Same sound, other letter: ذ not ز.");
    // No "don't know!" is ever asked.
    for (const r of [0.1, 0.9]) expect(askFor("dânestan:imperative", "both", seq(0.2, 0.2, r))!.spec.negative).toBe(false);
    expect(bothStyles(q("raftan", "1s", "written", false, "future"))).toEqual({ written: "خواهَم رَفْت" });
  });

  it("gives no hint for an unrelated answer", () => {
    expect(checkVerb(q("raftan", "1s", "spoken"), "کتاب")).toEqual({ ok: false });
  });

  it("shows both styles after an answer", () => {
    expect(bothStyles(q("raftan", "1p", "spoken", true))).toEqual({ spoken: z("نِمی_ریم"), written: z("نِمی_رَویم") });
  });
});
