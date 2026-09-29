// Vowel-mark display modes, derived from fully marked text:
//   all  — as written, except the pish of an o-spelling و (تُو → تو)
//   key  — marks only inside {highlights}; the ezafe kasra stays everywhere
//   none — real-world text: short vowels, sukun, tashdid and dagger alef removed;
//          tanvin and hamze stay because standard spelling writes them
// A mark shown on a bare stroke (ـَ ـّ) is being named, so every mode keeps it.

import type { Token } from "../markup";
import { tokenText } from "../markup";
import { DAMMA, KASRA, TATWEEL, isLetter, isMark } from "./chars";

export type VowelMode = "all" | "key" | "none";
export const VOWEL_MODES: VowelMode[] = ["all", "key", "none"];

const STRIP = /^[َ-ْٰ]$/;

/** For each code unit of `text`: is it a word-final kasra (the ezafe)? */
function ezafeMask(text: string): boolean[] {
  const mask = new Array<boolean>(text.length).fill(false);
  for (let i = 0; i < text.length; i++) {
    if (text[i] !== KASRA) continue;
    let j = i + 1;
    while (j < text.length && isMark(text[j])) j++;
    if (j >= text.length || !isLetter(text[j])) mask[i] = true;
  }
  return mask;
}

/**
 * For each code unit: is it the pish that only tells the engine a bare و
 * spells o (تُو, خُود)? Iranian primers don't write it, so it is never shown.
 */
function oPishMask(text: string): boolean[] {
  const mask = new Array<boolean>(text.length).fill(false);
  for (let i = 0; i < text.length; i++) {
    if (text[i] !== DAMMA) continue;
    let j = i + 1;
    while (j < text.length && isMark(text[j])) j++;
    if (text[j] === "و" && !isMark(text[j + 1] ?? "")) mask[i] = true;
  }
  return mask;
}

/**
 * For each code unit: is it a mark shown on a bare stroke (ـَ ـّ ـْ)? Such a
 * mark is being named, not read, so every mode shows it.
 */
function namedMarkMask(text: string): boolean[] {
  const mask = new Array<boolean>(text.length).fill(false);
  let start = 0;
  for (let i = 0; i <= text.length; i++) {
    const ch = text[i];
    if (i < text.length && (isLetter(ch) || isMark(ch) || ch === TATWEEL)) continue;
    const run = text.slice(start, i);
    if (run.includes(TATWEEL) && ![...run].some(isLetter)) mask.fill(true, start, i);
    start = i + 1;
  }
  return mask;
}

export function variantsOf(tokens: Token[]): Record<VowelMode, Token[]> {
  const whole = tokens.map(tokenText).join("");
  const ezafe = ezafeMask(whole);
  const oPish = oPishMask(whole);
  const named = namedMarkMask(whole);
  const strip = (t: Token, offset: number, keep: (i: number) => boolean): Token => {
    const src = tokenText(t);
    let s = "";
    for (let k = 0; k < src.length; k++) {
      if (STRIP.test(src[k]) && !keep(offset + k)) continue;
      s += src[k];
    }
    return t.kind === "text" ? { ...t, text: s } : { ...t, base: s };
  };
  const all: Token[] = [];
  const key: Token[] = [];
  const none: Token[] = [];
  let offset = 0;
  for (const t of tokens) {
    all.push(strip(t, offset, (i) => !oPish[i]));
    key.push(strip(t, offset, (i) => named[i] || (!oPish[i] && (t.hl || ezafe[i]))));
    none.push(strip(t, offset, (i) => named[i]));
    offset += tokenText(t).length;
  }
  return { all, key, none };
}
