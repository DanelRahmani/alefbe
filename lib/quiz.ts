// The quick letter quiz: short rounds, multiple choice or typed, outside the
// spaced-repetition schedule. Pure; the caller passes the random source.

import { checkTranslit, type Verdict } from "./answers";
import { DRILL_GROUPS, LETTERS, SAME_SOUND, formsOf, letterByChar, type Form, type Letter } from "./persian/letters";
import { normalizeFa } from "./persian/normalize";
import { DEFAULT_QUIZ } from "./store-defaults";
export { DEFAULT_QUIZ };

export type QuizType = "letter-name" | "name-letter" | "letter-sound" | "sound-letter" | "form-letter" | "flashcards";
export type QuizStyle = "choice" | "typed";

export interface QuizSetup {
  type: QuizType;
  style: QuizStyle;
  /** "all", "persian", "unlocked", or a drill group "g0"…"g7". */
  scope: string;
  count: number;
}

export const QUIZ_COUNTS = [10, 16, 32];

export interface QuizTypeInfo {
  id: QuizType;
  title: string;
  blurb: string;
  /** What a typed answer is written in. */
  typed: "translit" | "fa" | null;
}

export const QUIZ_TYPES: QuizTypeInfo[] = [
  { id: "letter-name", title: "Letter → name", blurb: "See a letter, give its name.", typed: "translit" },
  { id: "name-letter", title: "Name → letter", blurb: "See a name, find the letter.", typed: "fa" },
  { id: "letter-sound", title: "Letter → sound", blurb: "See a letter, give its sound.", typed: "translit" },
  { id: "sound-letter", title: "Sound → letter", blurb: "See a sound and name, find the letter.", typed: "fa" },
  { id: "form-letter", title: "Which letter?", blurb: "See a joined form (ـغـ), find the letter.", typed: "fa" },
  { id: "flashcards", title: "Flashcards", blurb: "Turn the card over and say if you knew it.", typed: null },
];

export const quizTypeInfo = (id: QuizType) => QUIZ_TYPES.find((t) => t.id === id)!;

/** Letters that look alike apart from dots or a stroke: the most useful wrong options. */
export const SHAPE_FAMILIES: string[][] = [
  ["ب", "پ", "ت", "ث", "ن", "ی"],
  ["ج", "چ", "ح", "خ"],
  ["د", "ذ"],
  ["ر", "ز", "ژ", "و"],
  ["س", "ش"],
  ["ص", "ض"],
  ["ط", "ظ"],
  ["ع", "غ"],
  ["ف", "ق"],
  ["ک", "گ"],
];

export function scopeLetters(scope: string, unlocked: string[]): Letter[] {
  if (scope === "persian") return LETTERS.filter((l) => l.persianOnly);
  if (scope === "unlocked") return LETTERS.filter((l) => unlocked.includes(l.ch));
  const g = /^g(\d)$/.exec(scope);
  if (g) return (DRILL_GROUPS[Number(g[1])] ?? []).map((ch) => letterByChar.get(ch)!).filter(Boolean);
  return LETTERS;
}

export function shuffle<T>(xs: T[], rand: () => number): T[] {
  const a = [...xs];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/** How an option is labelled; two options never share a label. */
export function optionLabel(type: QuizType, l: Letter): string {
  switch (type) {
    case "letter-name":
      return l.name;
    case "letter-sound":
      return l.sounds.join(" / ");
    default:
      return l.ch;
  }
}

/** Could `other` be mistaken for a right answer to `answer`? */
function clashes(type: QuizType, answer: Letter, other: Letter): boolean {
  if (other.ch === answer.ch) return true;
  if (type === "letter-sound") return other.sounds.some((s) => answer.sounds.includes(s));
  return false;
}

/** Up to `n` wrong options: look-alikes and same-sound letters first, then any. */
export function distractors(type: QuizType, answer: Letter, n: number, rand: () => number): Letter[] {
  const near = new Set([
    ...(SHAPE_FAMILIES.find((f) => f.includes(answer.ch)) ?? []),
    ...(type === "letter-sound" ? [] : (SAME_SOUND.find((f) => f.includes(answer.ch)) ?? [])),
  ]);
  const ok = (l: Letter) => !clashes(type, answer, l);
  const first = shuffle(LETTERS.filter((l) => near.has(l.ch) && ok(l)), rand).slice(0, Math.ceil(n / 2) + 1);
  const rest = shuffle(LETTERS.filter((l) => !near.has(l.ch) && ok(l)), rand);
  const out: Letter[] = [];
  for (const l of [...first, ...rest]) {
    if (out.length >= n) break;
    if (out.some((o) => optionLabel(type, o) === optionLabel(type, l))) continue;
    out.push(l);
  }
  return out;
}

export interface QuizItem {
  letter: Letter;
  /** The form shown: isolated, except in "which letter?". */
  form: Form;
  /** Four letters including the answer, shuffled (multiple choice only). */
  options: Letter[];
}

export function makeRound(setup: QuizSetup, pool: Letter[], rand: () => number): QuizItem[] {
  const letters = shuffle(pool, rand).slice(0, Math.min(setup.count, pool.length));
  return letters.map((letter) => {
    const forms: Form[] = setup.type === "form-letter" ? formsOf(letter).filter((f) => f !== "isolated") : ["isolated"];
    const form = forms[Math.floor(rand() * forms.length)] ?? "isolated";
    const options = setup.style === "choice" && setup.type !== "flashcards" ? shuffle([letter, ...distractors(setup.type, letter, 3, rand)], rand) : [];
    return { letter, form, options };
  });
}

/** Check a typed answer. */
export function checkQuizTyped(type: QuizType, l: Letter, input: string): Verdict {
  const info = quizTypeInfo(type);
  if (info.typed === "fa") {
    const typed = normalizeFa(input);
    if (typed === l.ch) return { ok: true };
    const fam = SAME_SOUND.find((f) => f.includes(l.ch));
    if (fam?.includes(typed)) return { ok: false, hint: `Same sound, other letter: ${l.ch} (${l.name}) not ${typed}.` };
    return { ok: false };
  }
  const names = namesOf(l);
  const exact = checkTranslit(input, type === "letter-sound" ? [...l.sounds, ...names] : names);
  if (exact.ok) return exact;
  // A name typed with a plain a for â (dal for dâl) is right, with a reminder.
  const plain = (s: string) => s.replace(/â/g, "a");
  if (checkTranslit(plain(input), names.map(plain)).ok) return { ok: true, note: `The name is ${l.name}, with a long â.` };
  return exact;
}

/**
 * A letter's names as typed answers: "he-ye jimi" may also be typed "he jimi",
 * and both ح and ه are simply "he" when the alphabet is recited.
 */
export const namesOf = (l: Letter): string[] =>
  [l.name, ...(l.altNames ?? [])].flatMap((n) =>
    n.startsWith("he-ye ") ? [n, n.replace("-ye ", " "), "he"] : n.includes("-ye ") ? [n, n.replace("-ye ", " ")] : [n],
  );

export interface QuizResult {
  right: number;
  total: number;
  missed: string[];
}
