// The readability check: in fully marked text every word must read one way
// only. Persian syllables are CV(C)(C), so the word's consonant/vowel pattern
// must match ^CV(C{0,2}CV)*C{0,2}$, and every consonant that is not the last
// letter of its morpheme needs its own vowel, a sukun, or a vowel after it.

import { analyzeWord, joinPhons } from "./analyze";
import { SUKUN } from "./chars";

const SYLLABLES = /^CV(C{0,2}CV)*C{0,2}$/;

export function checkReadable(word: string): string[] {
  const a = analyzeWord(word);
  const errors = [...a.errors];
  const { letters, phons, roles } = a;

  letters.forEach((l, i) => {
    if (roles[i] !== "cons" && roles[i] !== "glide") return;
    if (l.me) return;
    if (l.marks.has(SUKUN)) return;
    const own = phons.filter((p) => p.li === i);
    if (own.some((p) => p.t === "V")) return;
    const after = phons.findIndex((p) => p.li > i);
    if (after >= 0 && phons[after].t === "V") return;
    errors.push(`«${word}»: ${l.ch} (letter ${i + 1}) needs a vowel mark or a sukun`);
  });

  const pattern = joinPhons(a)
    .filter((s) => s.kind !== "-")
    .map((s) => (s.kind === "y" ? "C" : s.kind))
    .join("");
  if (pattern && !SYLLABLES.test(pattern)) {
    errors.push(`«${word}»: does not split into Persian syllables (${pattern})`);
  }
  return errors;
}
