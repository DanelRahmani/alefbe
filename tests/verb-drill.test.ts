import { describe, expect, it } from "vitest";
import { VERBS, verbById } from "@/content/verbs";
import { ZWNJ } from "@/lib/persian/chars";
import { answer, emptyDeck, unlockNext } from "@/lib/srs";
import {
  GROUP_SIZE,
  NEGATIVE_SHARE,
  askFor,
  bothStyles,
  checkVerb,
  describeSpec,
  emptyVerbsData,
  isItem,
  itemId,
  parseItem,
  verbCandidates,
  verbGroups,
  type VerbQuestion,
} from "@/lib/verb-drill";

const z = (s: string) => s.replace(/_/g, ZWNJ);
/** A rand() that returns the given numbers in turn. */
const seq = (...xs: number[]) => {
  let i = 0;
  return () => xs[i++ % xs.length];
};
const q = (verb: string, person: VerbQuestion["spec"]["person"], style: "spoken" | "written", negative = false): VerbQuestion => ({
  verb: verbById.get(verb)!,
  spec: { tense: "present", person, style, negative },
});

describe("verb trainer: items and groups", () => {
  it("makes one item per verb and tense, in groups of five", () => {
    const groups = verbGroups("present");
    expect(groups.flat()).toEqual(VERBS.map((v) => `${v.id}:present`));
    expect(groups.every((g) => g.length <= GROUP_SIZE)).toBe(true);
    expect(groups[0]).toEqual(["raftan", "âmadan", "kardan", "shodan", "goftan"].map((v) => itemId(v, "present")));
  });

  it("parses item ids and rejects unknown ones", () => {
    expect(parseItem("raftan:present")?.verb.id).toBe("raftan");
    expect(parseItem("raftan:past")).toBeNull();
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

  it("gives no hint for an unrelated answer", () => {
    expect(checkVerb(q("raftan", "1s", "spoken"), "کتاب")).toEqual({ ok: false });
  });

  it("shows both styles after an answer", () => {
    expect(bothStyles(q("raftan", "1p", "spoken", true))).toEqual({ spoken: z("نِمی_ریم"), written: z("نِمی_رَویم") });
  });
});
