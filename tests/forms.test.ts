import { describe, expect, it } from "vitest";
import { VERBS } from "@/content/verbs";
import { formIndex, gapTenses, hasCommand, hasYouVerb, phraseAlts, readAs, segments } from "@/lib/forms";

const index = formIndex(VERBS);

describe("verb forms in lesson text", () => {
  it("finds forms, longest first, and a compound by its verb words alone", () => {
    expect(segments("دارم کار می‌کنم", index).map((s) => s.words)).toEqual(["دارم کار می‌کنم"]);
    const tail = index.get("می‌کنم")!.find((h) => h.verb.id === "kâr-kardan");
    expect(tail?.tail).toBe(1);
    expect(segments("نون می‌خرم", index).map((s) => [s.words, !!s.hits])).toEqual([
      ["نون", false],
      ["می‌خرم", true],
    ]);
  });

  it("gives the trainer's other spellings, and the other “you” only when asked", () => {
    const alts = phraseAlts("میای", index, VERBS, false);
    expect(alts.map((a) => a.text)).toContain("می‌آی");
    expect(alts.every((a) => a.why === "spelling")).toBe(true);
    const you = phraseAlts("می‌خوای بخوری", index, VERBS, true).filter((a) => a.why === "you");
    expect(you.map((a) => a.text)).toContain("می‌خواین بخورین");
  });

  it("never mixes a spoken stem with a written است", () => {
    expect(phraseAlts("اومده", index, VERBS, false, "past/present-perfect").map((a) => a.text)).not.toContain("اومده است");
  });

  it("reads a form two tenses share by its lesson, or as the tense taught first", () => {
    const hits = index.get("رفتم")!;
    expect(new Set(readAs(hits).map((h) => h.spec.tense))).toEqual(new Set(["past"]));
    expect(new Set(readAs(hits, "past/present-perfect").map((h) => h.spec.tense))).toEqual(new Set(["perfect"]));
  });

  it("names tenses per gap, and no tense where a form stays ambiguous", () => {
    expect(gapTenses(["رفتم"], index)).toEqual([null]);
    expect(gapTenses(["رفتم"], index, "past/simple-past")).toEqual([["past"]]);
    expect(gapTenses(["می‌خوام", "برم"], index)).toEqual([["present"], ["subjunctive"]]);
    expect(gapTenses(["داشتم", "می‌کردم"], index)).toEqual([["past-progressive"], null]);
  });

  it("spots 2nd-person verbs and commands", () => {
    expect(hasYouVerb("کجا می‌ری", index)).toBe(true);
    expect(hasYouVerb("کجا می‌رم", index)).toBe(false);
    expect(hasCommand("بیا", index)).toBe(true);
  });
});
