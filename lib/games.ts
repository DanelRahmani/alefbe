// The practice games (successors of the old app's Phonics and Games views).
// Pure: word pools, tiles and checks; the components keep score and time.

import { analyzeWord, joinPhons } from "./persian/analyze";
import { ZWNJ } from "./persian/chars";
import { LETTERS, formsInWord, letterByChar, type Form, type Letter, type LetterInWord } from "./persian/letters";
import { checkFa, type Verdict } from "./answers";
import { normalizeFa } from "./persian/normalize";
import { SHAPE_FAMILIES, shuffle } from "./quiz";
import { transliterate } from "./translit";

export type GameId = "builder" | "sounds" | "letters" | "flash" | "type";

export interface GameInfo {
  id: GameId;
  title: string;
  fa: string;
  blurb: string;
  /** Rounds in one game. */
  rounds: number;
}

export const GAMES: GameInfo[] = [
  { id: "builder", title: "Word builder", fa: "ساختن", blurb: "Tap the letters in order to spell the word, and watch them join.", rounds: 8 },
  { id: "sounds", title: "Sound it out", fa: "خواندن", blurb: "Read a vowel-marked word and tap its sounds in order.", rounds: 8 },
  { id: "letters", title: "Letter by letter", fa: "حرف به حرف", blurb: "Name each letter of a joined word, one at a time.", rounds: 6 },
  { id: "flash", title: "Flash", fa: "تند", blurb: "A letter flashes; pick its name before it fades from memory.", rounds: 16 },
  { id: "type", title: "Type it", fa: "تایپ", blurb: "Copy words and short sentences on the keyboard, half-spaces included.", rounds: 8 },
];

export const gameInfo = (id: GameId) => GAMES.find((g) => g.id === id)!;

export interface GameWord {
  fa: string;
  en: string;
  translit: string;
}

/** The letter of the alphabet a character belongs to (آ is alef). */
export const baseLetter = (ch: string): Letter | undefined => letterByChar.get(ch === "آ" ? "ا" : ch);

/** Words whose letters are all open, or every word when `open` is null. Needs at least `min` words. */
export function wordPool<T extends { fa: string }>(words: T[], open: Set<string> | null, min = 6): T[] {
  if (!open) return words;
  const ok = words.filter((w) => formsInWord(w.fa).every((l) => baseLetter(l.ch) && open.has(baseLetter(l.ch)!.ch)));
  return ok.length >= min ? ok : words;
}

// ── Word builder: letter tiles ────────────────────────────────────────────

export interface Tile {
  id: number;
  s: string;
}

/** The word's letters (unmarked, آ kept) plus look-alike decoys, shuffled. */
export function letterTiles(fa: string, decoys: number, rand: () => number): { answer: string[]; tiles: Tile[] } {
  const answer = [...normalizeFa(fa)].filter((ch) => ch !== " " && ch !== ZWNJ);
  const pool = new Set<string>();
  for (const ch of answer) {
    const fam = SHAPE_FAMILIES.find((f) => f.includes(ch)) ?? [];
    for (const c of fam) if (!answer.includes(c)) pool.add(c);
  }
  const extra = shuffle([...pool], rand).slice(0, decoys);
  while (extra.length < decoys) {
    const c = LETTERS[Math.floor(rand() * LETTERS.length)].ch;
    if (!answer.includes(c) && !extra.includes(c)) extra.push(c);
  }
  return { answer, tiles: shuffle([...answer, ...extra], rand).map((s, id) => ({ id, s })) };
}

// ── Sound it out: sound tiles ─────────────────────────────────────────────

/** The word's sounds in order, as the transliteration spells them (kh, sh, ch are one sound). */
export function soundsOf(fa: string): string[] {
  return joinPhons(analyzeWord(normalizeMarkup(fa)))
    .filter((s) => s.kind !== "-" && s.s !== "")
    .map((s) => s.s);
}

const normalizeMarkup = (fa: string) => fa.replace(/[{}*]/g, "");

export function soundTiles(fa: string, others: string[], decoys: number, rand: () => number): { answer: string[]; tiles: Tile[] } {
  const answer = soundsOf(fa);
  const pool = [...new Set(others.flatMap(soundsOf))].filter((s) => !answer.includes(s));
  const extra = shuffle(pool, rand).slice(0, decoys);
  return { answer, tiles: shuffle([...answer, ...extra], rand).map((s, id) => ({ id, s })) };
}

// ── Letter by letter ──────────────────────────────────────────────────────

export interface LetterStep extends LetterInWord {
  letter: Letter;
}

export function letterSteps(fa: string): LetterStep[] {
  return formsInWord(fa).flatMap((l) => {
    const letter = baseLetter(l.ch);
    return letter ? [{ ...l, letter }] : [];
  });
}

/** Four options for a letter: the answer and three look-alikes or others, shuffled. */
export function letterOptions(answer: Letter, rand: () => number): Letter[] {
  const fam = (SHAPE_FAMILIES.find((f) => f.includes(answer.ch)) ?? []).filter((c) => c !== answer.ch);
  const near = shuffle(fam, rand).slice(0, 2).map((c) => letterByChar.get(c)!);
  const rest = shuffle(
    LETTERS.filter((l) => l.ch !== answer.ch && !near.includes(l)),
    rand,
  ).slice(0, 3 - near.length);
  return shuffle([answer, ...near, ...rest], rand);
}

export const FORM_WORD: Record<Form, string> = {
  isolated: "standing alone",
  initial: "joined to the next letter",
  medial: "joined on both sides",
  final: "joined to the letter before",
};

export const toGameWord = (w: { fa: string; en: string }): GameWord => ({ fa: w.fa, en: w.en, translit: transliterate(w.fa) });

/** Percentage, rounded. */
export const percent = (right: number, total: number) => (total ? Math.round((100 * right) / total) : 0);

// ── Type it: copy-typing ──────────────────────────────────────────────────

export interface TypeItem {
  /** As the lesson writes it, fully vowel-marked, markup removed. */
  fa: string;
  en: string;
  translit: string;
}

/** A game of `n` items: half of them with a half-space to type, when there are enough. */
export function typeRound(items: TypeItem[], n: number, rand: () => number): TypeItem[] {
  const withZwnj = shuffle(items.filter((it) => it.fa.includes(ZWNJ)), rand);
  const without = shuffle(items.filter((it) => !it.fa.includes(ZWNJ)), rand);
  const a = withZwnj.slice(0, Math.ceil(n / 2));
  const b = without.slice(0, n - a.length);
  return shuffle([...a, ...b, ...withZwnj.slice(a.length, a.length + n - a.length - b.length)], rand);
}

type Gap = "half-space" | "space";

/** The gaps inside a text, keyed by how many letters come before each. */
function gapsOf(s: string): Map<number, Gap> {
  const gaps = new Map<number, Gap>();
  let letters = 0;
  for (const ch of s) {
    if (ch === ZWNJ) gaps.set(letters, "half-space");
    else if (ch === " ") gaps.set(letters, "space");
    else letters++;
  }
  return gaps;
}

const GAP_TYPED: Record<Gap | "none", string> = { "half-space": "a half-space", space: "a space", none: "nothing" };

/**
 * When the letters are right and only the spacing differs, say where: "Half-space
 * between می and خرم (you typed a space)." Both texts normalised; null when the
 * letters differ.
 */
export function spacingIssues(typed: string, target: string): string[] | null {
  const bare = (x: string) => x.replace(/[‌ ]/g, "");
  if (bare(typed) !== bare(target)) return null;
  const letters = bare(target);
  const want = gapsOf(target);
  const got = gapsOf(typed);
  const cuts = [...new Set([...want.keys(), ...got.keys()])].sort((x, y) => x - y);
  const issues: string[] = [];
  for (const k of cuts) {
    const w = want.get(k);
    const g = got.get(k);
    if (w === g) continue;
    const prev = Math.max(0, ...[...want.keys()].filter((c) => c < k));
    const next = Math.min(letters.length, ...[...want.keys()].filter((c) => c > k));
    const between = `between ${letters.slice(prev, k)} and ${letters.slice(k, next)}`;
    if (w) issues.push(`${w === "half-space" ? "Half-space" : "Space"} ${between} (you typed ${GAP_TYPED[g ?? "none"]}).`);
    else issues.push(`No gap ${between} (you typed ${GAP_TYPED[g!]}).`);
  }
  return issues;
}

/** Copy-typing: the letters, spaces and half-spaces as shown; vowel marks and punctuation optional. */
export function checkCopy(input: string, target: string): Verdict {
  const typed = normalizeFa(input);
  const want = normalizeFa(target);
  if (typed === want) return { ok: true };
  const spacing = spacingIssues(typed, want);
  if (spacing) return { ok: false, hint: spacing.join(" ") };
  const v = checkFa(input, [target]);
  if (v.ok) return { ok: false, hint: "That spelling is also seen, but copy the one shown." };
  return v;
}
