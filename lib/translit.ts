// Transliteration (the â-scheme) generated from fully vowel-marked Persian.
// The rules live in lib/persian/analyze.ts and are documented in content/STYLE.md.

import { analyzeWord, joinPhons } from "./persian/analyze";
import { PERSIAN_DIGITS, PUNCT_TRANSLIT, ZWNJ, isLetter, isMark } from "./persian/chars";

export interface TranslitResult {
  text: string;
  errors: string[];
}

export function translitWord(word: string): TranslitResult {
  const a = analyzeWord(word);
  const text = joinPhons(a)
    .map((s) => s.s)
    .join("") + a.ezafe;
  return { text, errors: a.errors };
}

const isWordChar = (ch: string) => isLetter(ch) || isMark(ch) || ch === ZWNJ;

/** Split plain Persian text into words and the characters between them. */
export function tokenizeFa(text: string): { word: boolean; s: string }[] {
  const out: { word: boolean; s: string }[] = [];
  for (const ch of text) {
    const word = isWordChar(ch);
    const last = out[out.length - 1];
    if (last && last.word === word) last.s += ch;
    else out.push({ word, s: ch });
  }
  return out;
}

export function transliterateWithErrors(text: string): TranslitResult {
  const errors: string[] = [];
  let out = "";
  for (const tok of tokenizeFa(text)) {
    if (tok.word) {
      const r = translitWord(tok.s);
      errors.push(...r.errors);
      out += r.text;
    } else {
      for (const ch of tok.s) {
        const d = PERSIAN_DIGITS.indexOf(ch);
        out += d >= 0 ? String(d) : (PUNCT_TRANSLIT[ch] ?? ch);
      }
    }
  }
  return { text: out, errors };
}

export function transliterate(text: string): string {
  return transliterateWithErrors(text).text;
}
