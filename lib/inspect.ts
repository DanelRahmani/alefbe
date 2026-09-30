// The word inspector: which word of a Persian run was tapped, its reading,
// its dictionary entry and its letters. Pure; components/WordInspector.tsx
// does the DOM work (caret position, the marked vm-all variant).

import { sliceTokens, tokenText, translitWithErrors, type Token } from "./markup";
import { HAMZA_ABOVE, KASRA, ZWJ, isMark } from "./persian/chars";
import { formGlyph, formsInWord, letterByChar, type Form } from "./persian/letters";
import { tokenizeFa } from "./translit";

/** The words of a token run with their transliteration (overrides respected), in order. */
export function wordsOfTokens(tokens: Token[]): { fa: string; translit: string }[] {
  const plain = tokens.map(tokenText).join("");
  const out: { fa: string; translit: string }[] = [];
  let pos = 0;
  for (const part of tokenizeFa(plain)) {
    const start = pos;
    pos += part.s.length;
    if (!part.word) continue;
    out.push({ fa: part.s, translit: translitWithErrors(sliceTokens(tokens, start, pos)).text });
  }
  return out;
}

/**
 * The index of the word at `offset` in a run's displayed text, or null when
 * the offset falls between words. Highlights that split a word add ZWJs to the
 * display; they don't count.
 */
export function wordIndexAt(text: string, offset: number): number | null {
  let pos = 0;
  let index = 0;
  const clean = text.split(ZWJ).join("");
  const at = offset - text.slice(0, offset).split(ZWJ).length + 1;
  for (const part of tokenizeFa(clean)) {
    const end = pos + part.s.length;
    if (part.word) {
      // A tap on the edge of a word (offset === end) still counts as that word.
      if (at >= pos && at <= end) return index;
      index++;
    } else if (at > pos && at < end) {
      return null;
    }
    pos = end;
  }
  return null;
}

/** The nth word of a run's text (vowel-marked when taken from the vm-all variant). */
export function nthWord(text: string, n: number): string | null {
  const words = tokenizeFa(text.split(ZWJ).join("")).filter((p) => p.word);
  return words[n]?.s ?? null;
}

/** Marks sorted within each letter, so شَّ and شَّ compare equal whatever order they were typed in. */
export function canonMarks(s: string): string {
  let out = "";
  let marks: string[] = [];
  for (const ch of s) {
    if (isMark(ch)) marks.push(ch);
    else {
      out += marks.sort().join("") + ch;
      marks = [];
    }
  }
  return out + marks.sort().join("");
}

/** The word without an ezafe: a final zir (کِتابِ) or the hamze on a silent he (خانهٔ). */
export function withoutEzafe(word: string): string | null {
  if (word.endsWith(KASRA)) return word.slice(0, -1);
  if (word.endsWith(HAMZA_ABOVE) && word.at(-2) === "ه") return word.slice(0, -1);
  return null;
}

export interface Findable {
  fa?: string;
  spoken?: string;
}

/**
 * The dictionary entry for a tapped word: the exact marked spelling, written
 * or spoken, or the same without an ezafe. Matching ignores the order of
 * marks but never the marks themselves (مَرد is not مُرد).
 */
export function findWord<T extends Findable>(items: T[], word: string): T | undefined {
  const tries = [word, withoutEzafe(word)].filter((w): w is string => !!w).map(canonMarks);
  for (const w of tries) {
    const hit = items.find((it) => (it.fa && canonMarks(it.fa) === w) || (it.spoken && canonMarks(it.spoken) === w));
    if (hit) return hit;
  }
  return undefined;
}

/** Names for the hamze seats, which have no letter page of their own. */
const SEAT_NAMES: Record<string, string> = {
  "ء": "hamze",
  "أ": "hamze on alef",
  "ؤ": "hamze on vâv",
  "ئ": "hamze on ye",
};

export interface LetterPart {
  ch: string;
  form: Form;
  /** The form as drawn on its own (with a joining stroke). */
  glyph: string;
  name: string;
  /** The letter's page, when it has one. */
  href?: string;
}

/** A word letter by letter, in writing order, with the form each letter takes. */
export function letterParts(word: string): LetterPart[] {
  return formsInWord(word).map(({ ch, form }) => {
    const letter = letterByChar.get(ch === "آ" ? "ا" : ch);
    const name = ch === "آ" ? "alef madde" : (letter?.name ?? SEAT_NAMES[ch] ?? ch);
    return { ch, form, glyph: formGlyph(ch, form), name, href: letter ? `/script/${letter.slug}` : undefined };
  });
}
