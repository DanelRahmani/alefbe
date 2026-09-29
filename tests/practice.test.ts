import { describe, expect, it } from "vitest";
import { LETTERS, letterByChar } from "@/lib/persian/letters";
import { checkQuizTyped, distractors, makeRound, optionLabel, scopeLetters, type QuizType } from "@/lib/quiz";
import { letterOptions, letterSteps, letterTiles, soundTiles, soundsOf, wordPool } from "@/lib/games";
import { WORD_CARDS } from "@/lib/drill";

// A seeded random source, so rounds are reproducible.
function seeded(seed: number) {
  let s = seed;
  return () => {
    s = (s * 1103515245 + 12345) % 2147483648;
    return s / 2147483648;
  };
}

const TYPES: QuizType[] = ["letter-name", "name-letter", "letter-sound", "sound-letter", "form-letter"];

describe("quick quiz", () => {
  it("never offers two options with the same label, or a second right answer", () => {
    for (const type of TYPES)
      for (const l of LETTERS)
        for (let seed = 1; seed < 6; seed++) {
          const d = distractors(type, l, 3, seeded(seed));
          expect(d).toHaveLength(3);
          const labels = [l, ...d].map((x) => optionLabel(type, x));
          expect(new Set(labels).size, `${type} ${l.ch}`).toBe(4);
          if (type === "letter-sound") for (const x of d) expect(x.sounds.some((s) => l.sounds.includes(s))).toBe(false);
        }
  });
  it("prefers look-alike letters as wrong options", () => {
    const d = distractors("letter-name", letterByChar.get("ب")!, 3, seeded(3)).map((l) => l.ch);
    expect(d.some((ch) => "پتثنی".includes(ch))).toBe(true);
  });
  it("builds rounds without repeats, capped by the pool", () => {
    const r = makeRound({ type: "letter-name", style: "choice", scope: "all", count: 10 }, LETTERS, seeded(1));
    expect(r).toHaveLength(10);
    expect(new Set(r.map((q) => q.letter.ch)).size).toBe(10);
    for (const q of r) expect(q.options.map((o) => o.ch)).toContain(q.letter.ch);
    const p = makeRound({ type: "letter-name", style: "choice", scope: "persian", count: 10 }, scopeLetters("persian", []), seeded(1));
    expect(p.map((q) => q.letter.ch).sort().join("")).toBe(["پ", "چ", "ژ", "گ"].sort().join(""));
  });
  it("shows a real joined form in 'which letter?'", () => {
    const r = makeRound({ type: "form-letter", style: "choice", scope: "all", count: 32 }, LETTERS, seeded(2));
    for (const q of r) expect(q.form).not.toBe("isolated");
    const dal = r.find((q) => q.letter.ch === "د")!;
    expect(dal.form).toBe("final");
  });
  it("checks typed answers", () => {
    const h = letterByChar.get("ح")!;
    expect(checkQuizTyped("letter-name", h, "he jimi").ok).toBe(true);
    expect(checkQuizTyped("letter-name", h, "he-ye jimi").ok).toBe(true);
    expect(checkQuizTyped("letter-sound", letterByChar.get("و")!, "u").ok).toBe(true);
    const sad = letterByChar.get("ص")!;
    const v = checkQuizTyped("sound-letter", sad, "س");
    expect(v.ok).toBe(false);
    expect(v.hint).toContain("Same sound");
    expect(checkQuizTyped("sound-letter", sad, "ص").ok).toBe(true);
  });
  it("scopes by group and by unlocked letters", () => {
    expect(scopeLetters("g1", []).map((l) => l.ch).join("")).toBe("جچحخ");
    expect(scopeLetters("unlocked", ["ا", "ب"]).map((l) => l.ch).join("")).toBe("اب");
  });
});

describe("games", () => {
  it("spells a word's sounds with digraphs as one sound", () => {
    expect(soundsOf("خانه")).toEqual(["kh", "â", "n", "e"]);
    expect(soundsOf("شَب")).toEqual(["sh", "a", "b"]);
    expect(soundsOf("بَچّه")).toEqual(["b", "a", "ch", "ch", "e"]);
  });
  it("sound tiles hold the answer plus decoys", () => {
    const { answer, tiles } = soundTiles("باد", ["شَب", "گُل"], 3, seeded(4));
    expect(answer).toEqual(["b", "â", "d"]);
    expect(tiles).toHaveLength(6);
    for (const s of answer) expect(tiles.map((t) => t.s)).toContain(s);
  });
  it("letter tiles hold the unmarked letters plus look-alike decoys", () => {
    const { answer, tiles } = letterTiles("کِتاب", 2, seeded(5));
    expect(answer.join("")).toBe("کتاب");
    expect(tiles).toHaveLength(6);
  });
  it("steps through a word letter by letter, with آ as alef", () => {
    const steps = letterSteps("آب");
    expect(steps.map((s) => s.letter.ch).join("")).toBe("اب");
    expect(steps.map((s) => s.form)).toEqual(["isolated", "isolated"]);
  });
  it("letter options are four distinct letters including the answer", () => {
    for (const l of LETTERS) {
      const o = letterOptions(l, seeded(7));
      expect(new Set(o.map((x) => x.ch)).size).toBe(4);
      expect(o).toContain(l);
    }
  });
  it("word pools keep to open letters, or fall back to all words", () => {
    const open = new Set(["ا", "ب", "پ", "ت", "ث"]);
    const pool = wordPool(WORD_CARDS, open, 1);
    expect(pool.map((w) => w.id)).toEqual(expect.arrayContaining(["آب", "تاب", "بابا"]));
    for (const w of pool) expect([...w.id].every((ch) => "آابپتث".includes(ch))).toBe(true);
    expect(wordPool(WORD_CARDS, new Set(["ا"]), 6)).toHaveLength(WORD_CARDS.length);
  });
});
