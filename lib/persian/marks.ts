// Vowel-mark display modes, derived from fully marked text:
//   all  — as written, except the pish of an o-spelling و (تُو → تو)
//   key  — marks only inside {highlights}; the ezafe kasra stays everywhere
//   none — real-world text: short vowels, sukun, tashdid and dagger alef removed;
//          tanvin and hamze stay because standard spelling writes them

import type { Token } from "../markup";
import { tokenText } from "../markup";
import { DAMMA, KASRA, isLetter, isMark } from "./chars";

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

export function variantsOf(tokens: Token[]): Record<VowelMode, Token[]> {
  const whole = tokens.map(tokenText).join("");
  const ezafe = ezafeMask(whole);
  const oPish = oPishMask(whole);
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
    key.push(strip(t, offset, (i) => !oPish[i] && (t.hl || ezafe[i])));
    none.push(strip(t, offset, () => false));
    offset += tokenText(t).length;
  }
  return { all, key, none };
}
