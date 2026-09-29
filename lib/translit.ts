// Transliteration (the â-scheme) generated from fully vowel-marked Persian.
// The rules live in lib/persian/analyze.ts and are documented in content/STYLE.md.

import { analyzeWord, joinPhons } from "./persian/analyze";
import { PERSIAN_DIGITS, PUNCT_TRANSLIT, TATWEEL, ZWJ, ZWNJ, isLetter, isMark } from "./persian/chars";

export interface TranslitResult {
  text: string;
  errors: string[];
}

export type WordKind = "word" | "affix" | "letter";

/**
 * Affixes start with a tatweel (ـها). A bare single letter is a letter
 * mentioned by name, and so is a joining form that ends in a tatweel
 * (initial بـ, medial ـبـ); a final form (ـب) reads like an affix.
 */
export function wordKind(word: string): WordKind {
  const bare = word.split(TATWEEL).join("").split(ZWJ).join("");
  if ([...bare].length === 1 && isLetter(bare) && (word === bare || word.endsWith(TATWEEL))) return "letter";
  if (word.startsWith(TATWEEL)) return "affix";
  return "word";
}

export function translitWord(word: string): TranslitResult {
  const a = analyzeWord(word);
  const text = joinPhons(a)
    .map((s) => s.s)
    .join("") + a.ezafe;
  return { text, errors: a.errors };
}

/** A suffix is read as if it followed a bare consonant: ـها → -hâ, ـی → -i. */
function translitAffix(affix: string): TranslitResult {
  const r = translitWord("ب" + affix.slice(1));
  return { text: "-" + r.text.replace(/^b-?/, ""), errors: r.errors };
}

const isWordChar = (ch: string) => isLetter(ch) || isMark(ch) || ch === ZWNJ || ch === TATWEEL;

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
      const kind = wordKind(tok.s);
      if (kind === "letter") continue;
      const r = kind === "affix" ? translitAffix(tok.s) : translitWord(tok.s);
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
