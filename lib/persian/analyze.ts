// One parser, two users: the transliteration and the readability check both
// consume `analyzeWord`. The rules are numbered as in content/STYLE.md.

import {
  CONSONANTS,
  DAGGER_ALEF,
  DAMMA,
  FATHA,
  FATHATAN,
  HAMZA_ABOVE,
  KASRA,
  SHADDA,
  SHORT_VOWELS,
  SUKUN,
  ZWNJ,
  isLetter,
  isMark,
} from "./chars";

export interface PLetter {
  ch: string;
  marks: Set<string>;
  /** First letter of a morpheme (word start or after a half-space). */
  ms: boolean;
  /** Last letter of a morpheme (word end or before a half-space). */
  me: boolean;
  morph: number;
}

export interface Phon {
  t: "C" | "V";
  /** Transliteration; "" for the silent glottal onset of a vowel-initial morpheme. */
  s: string;
  /** Index of the letter that produced it. */
  li: number;
}

export type Role = "cons" | "glide" | "diph" | "vowel" | "silent";

export interface Analysis {
  word: string;
  letters: PLetter[];
  phons: Phon[];
  roles: Role[];
  /** "-e" / "-ye" when the word carries the ezafe. */
  ezafe: string;
  errors: string[];
}

const hex = (ch: string) => "U+" + ch.codePointAt(0)!.toString(16).toUpperCase().padStart(4, "0");

export function parseWord(word: string): { letters: PLetter[]; errors: string[] } {
  const letters: PLetter[] = [];
  const errors: string[] = [];
  let morph = 0;
  let atStart = true;
  for (const ch of word) {
    if (ch === ZWNJ) {
      if (atStart) errors.push(`«${word}»: half-space with no letter before it`);
      else letters[letters.length - 1].me = true;
      atStart = true;
      morph++;
      continue;
    }
    if (isMark(ch)) {
      const last = letters[letters.length - 1];
      if (!last || atStart) {
        errors.push(`«${word}»: mark ${hex(ch)} with no letter to sit on`);
      } else if (last.marks.has(ch)) {
        errors.push(`«${word}»: doubled mark ${hex(ch)} on ${last.ch}`);
      } else {
        last.marks.add(ch);
      }
      continue;
    }
    if (isLetter(ch)) {
      letters.push({ ch, marks: new Set(), ms: atStart, me: false, morph });
      atStart = false;
      continue;
    }
    errors.push(`«${word}»: unexpected character ${hex(ch)}`);
  }
  if (letters.length && atStart) errors.push(`«${word}»: ends with a half-space`);
  if (letters.length) letters[letters.length - 1].me = true;
  return { letters, errors };
}

const VOWEL_MARKS = [FATHA, KASRA, DAMMA];

export function analyzeWord(word: string): Analysis {
  const { letters, errors } = parseWord(word);
  const phons: Phon[] = [];
  const roles: Role[] = letters.map(() => "silent");
  const n = letters.length;
  const empty: Analysis = { word, letters, phons, roles, ezafe: "", errors };
  if (!n) return empty;

  // Working copies of each letter's marks; consumed marks are deleted, so
  // whatever is left at the end was not used by any rule (an error).
  const M = letters.map((l) => new Set(l.marks));
  const last = n - 1;

  // Rule 0: standalone و (and).
  if (n === 1 && letters[0].ch === "و") {
    const m = M[0];
    if (m.size === 1 && m.has(FATHA)) {
      phons.push({ t: "C", s: "v", li: 0 }, { t: "V", s: "a", li: 0 });
      roles[0] = "cons";
    } else if (m.size === 1 && m.has(DAMMA)) {
      phons.push({ t: "C", s: "", li: 0 }, { t: "V", s: "o", li: 0 });
      roles[0] = "vowel";
    } else {
      errors.push(`«${word}»: write "and" as وَ (va) or وُ (o)`);
    }
    return { ...empty, phons, roles };
  }

  // Ezafe: a word-final kasra, or ـهٔ.
  let ezafe: "" | "kasra" | "hamza" = "";
  if (M[last].has(KASRA)) {
    ezafe = "kasra";
    M[last].delete(KASRA);
  } else if (letters[last].ch === "ه" && M[last].has(HAMZA_ABOVE)) {
    ezafe = "hamza";
    M[last].delete(HAMZA_ABOVE);
  }

  const vowelOf = (i: number): string | null => {
    if (i < 0) return null;
    const vs = VOWEL_MARKS.filter((m) => M[i].has(m) || letters[i].marks.has(m));
    return vs.length ? vs[0] : null;
  };
  const push = (t: Phon["t"], s: string, li: number) => phons.push({ t, s, li });
  const lastPhon = () => phons[phons.length - 1];

  /** A consonant with whatever its marks say: tashdid, a short vowel, sukun, tanvin. */
  const consonant = (i: number, s: string, role: Role = "cons") => {
    const m = M[i];
    roles[i] = role;
    push("C", s, i);
    if (m.delete(SHADDA)) push("C", s, i);
    const vs = VOWEL_MARKS.filter((v) => m.has(v));
    if (vs.length > 1) errors.push(`«${word}»: two vowel marks on ${letters[i].ch}`);
    if (vs.length) {
      push("V", SHORT_VOWELS[vs[0]], i);
      vs.forEach((v) => m.delete(v));
    }
    if (m.has(SUKUN)) {
      if (vs.length) errors.push(`«${word}»: sukun and a vowel mark on ${letters[i].ch}`);
      m.delete(SUKUN);
    }
    if (m.delete(FATHATAN)) {
      push("V", "a", i);
      push("C", "n", i);
    }
  };

  for (let i = 0; i < n; i++) {
    const L = letters[i];
    const ch = L.ch;
    const m = M[i];
    const prev = L.ms ? undefined : letters[i - 1];
    const next = i + 1 < n && !letters[i + 1].ms ? letters[i + 1] : undefined;
    const bare = () => m.size === 0;

    if (ch === "ا") {
      if (L.ms) {
        // Rule 2: a vowel-initial morpheme.
        const v = VOWEL_MARKS.find((x) => m.has(x));
        if (v) {
          push("C", "", i);
          push("V", SHORT_VOWELS[v], i);
          m.delete(v);
          roles[i] = "vowel";
        } else if (next && (next.ch === "ی" || next.ch === "و") && M[i + 1].size === 0) {
          push("C", "", i);
          push("V", next.ch === "ی" ? "i" : "u", i);
          roles[i] = "vowel";
          roles[i + 1] = "silent";
          i++;
        } else {
          errors.push(`«${word}»: an alef that starts a morpheme needs zabar, zir or pish (or ای / او)`);
        }
      } else if (m.delete(FATHATAN)) {
        // Rule 3: tanvin written on the alef (مثلاً).
        push("V", "a", i);
        push("C", "n", i);
        roles[i] = "vowel";
      } else if (prev && letters[i - 1].marks.has(FATHATAN)) {
        roles[i] = "silent"; // tanvin written on the consonant; the alef is silent
      } else {
        if (prev && M[i - 1] !== undefined && letters[i - 1].marks.has(FATHA) && roles[i - 1] === "cons") {
          errors.push(`«${word}»: no zabar before a long â (Arabic-style marking)`);
        }
        push("V", "â", i);
        roles[i] = "vowel";
      }
      continue;
    }

    if (ch === "آ") {
      // Rules 2 and 6.
      push("C", L.ms ? "" : "'", i);
      push("V", "â", i);
      roles[i] = "vowel";
      continue;
    }

    if (ch === "و" || ch === "ی") {
      const isVav = ch === "و";
      const cons = isVav ? "v" : "y";
      // Rule 0: ی with a dagger alef reads â (حتیٰ); it absorbs a zabar before it.
      if (!isVav && m.delete(DAGGER_ALEF)) {
        const lp = lastPhon();
        if (lp && lp.t === "V" && lp.s === "a" && lp.li === i - 1) phons.pop();
        push("V", "â", i);
        roles[i] = "vowel";
        continue;
      }
      // Rule 1: the silent و of خوا / خوی.
      if (
        isVav &&
        prev?.ch === "خ" &&
        !VOWEL_MARKS.some((v) => letters[i - 1].marks.has(v)) &&
        !letters[i - 1].marks.has(SUKUN) &&
        bare() &&
        next &&
        (next.ch === "ا" || next.ch === "ی")
      ) {
        roles[i] = "silent";
        continue;
      }
      // Rule 4a/4b: carries a vowel mark or tashdid, or starts a morpheme.
      if (VOWEL_MARKS.some((v) => m.has(v)) || m.has(SHADDA) || m.has(FATHATAN) || L.ms) {
        consonant(i, cons);
        continue;
      }
      const pv = prev ? vowelOf(i - 1) : null;
      // Rule 4c: pish + و spells o (تُو, خُود).
      if (isVav && bare() && pv === DAMMA) {
        roles[i] = "silent";
        continue;
      }
      // Rule 4d: after zabar, a diphthong unless a vowel letter follows.
      if (pv === FATHA && (bare() || (m.size === 1 && m.has(SUKUN)))) {
        if (next && "اوی".includes(next.ch)) {
          consonant(i, cons);
        } else {
          const lp = lastPhon();
          if (lp && lp.t === "V" && lp.s === "a") lp.s = isVav ? "o" : "e";
          m.delete(SUKUN);
          push("C", isVav ? "w" : "y", i);
          roles[i] = "diph";
        }
        continue;
      }
      if (!isVav && pv === KASRA && bare() && next && !"اوی".includes(next.ch)) {
        errors.push(`«${word}»: no zir before a long i (Arabic-style marking)`);
      }
      // Rule 4f′: after a long i and before a consonant, a bare و is the vowel u (میومَدَم
      // miyumadam). As a consonant it would need a vowel mark or a sukun there.
      const lp = lastPhon();
      if (
        isVav &&
        bare() &&
        lp?.t === "V" &&
        lp.s === "i" &&
        lp.li === i - 1 &&
        next &&
        !"اآوی".includes(next.ch) &&
        !(next.ch === "ه" && letters[i + 1].me)
      ) {
        push("V", "u", i);
        roles[i] = "vowel";
        continue;
      }
      // Rule 4e/4f: after sukun or after any vowel it is a consonant.
      if (m.has(SUKUN) || (prev && letters[i - 1].marks.has(SUKUN)) || lastPhon()?.t === "V") {
        consonant(i, cons, "glide");
        continue;
      }
      // Rule 4g: after a bare consonant it is the long vowel.
      push("V", isVav ? "u" : "i", i);
      roles[i] = "vowel";
      continue;
    }

    if (ch === "ه") {
      if (!L.me || L.ms) {
        consonant(i, "h");
        continue;
      }
      // Rule 7: final he.
      const afterLongVowel =
        prev && (prev.ch === "ا" || prev.ch === "آ" || (prev.ch === "و" && roles[i - 1] === "vowel"));
      // A zir on a final he after a consonant with sukun is the ezafe on a consonant h (وَجْهِ vajh-e).
      const hEzafe = ezafe === "kasra" && i === last && !!prev && letters[i - 1].marks.has(SUKUN);
      if (m.has(SUKUN) || afterLongVowel || hEzafe) {
        if (ezafe === "hamza") errors.push(`«${word}»: ـهٔ is only for a silent final he`);
        consonant(i, "h");
        continue;
      }
      if (ezafe === "kasra" && i === last) {
        errors.push(`«${word}»: the ezafe after a silent he is written ـهٔ, not a zir`);
      }
      if (VOWEL_MARKS.some((v) => m.has(v))) errors.push(`«${word}»: vowel mark on a silent he`);
      if (!(prev && vowelOf(i - 1))) push("V", "e", i);
      roles[i] = "silent";
      continue;
    }

    if (ch === "ع" || ch === "ء" || ch === "أ" || ch === "ؤ" || ch === "ئ") {
      // Rule 9: glottal stop; no apostrophe at the very start of a word.
      consonant(i, i === 0 ? "" : "'");
      continue;
    }

    const c = CONSONANTS[ch];
    if (c) consonant(i, c);
    else errors.push(`«${word}»: no rule for ${ch}`);
  }

  // Rule 8: the ezafe.
  let ezafeText = "";
  if (ezafe === "hamza") {
    ezafeText = "-ye";
  } else if (ezafe === "kasra") {
    const L = letters[last];
    const lp = lastPhon();
    if (L.ch === "ا" || L.ch === "آ" || (L.ch === "و" && roles[last] !== "cons")) {
      errors.push(`«${word}»: after a long vowel the ezafe is written with ی (ـایِ, ـویِ)`);
    } else if (L.ch === "ی" && lp?.t === "C" && lp.li === last) {
      phons.pop(); // the glide ی carries the ezafe: dâneshju-ye
      ezafeText = "-ye";
    } else if (lp?.t === "V") {
      ezafeText = "-ye"; // the vowel ی: sandali-ye
    } else {
      ezafeText = "-e";
    }
  }

  letters.forEach((l, i) => {
    for (const mark of M[i]) errors.push(`«${word}»: mark ${hex(mark)} on ${l.ch} is not used`);
  });

  return { word, letters, phons, roles, ezafe: ezafeText, errors };
}

const HYPHEN_BEFORE_H = new Set(["s", "z", "k", "g"]);

export interface Segment {
  kind: "C" | "V" | "y" | "-";
  s: string;
}

/** Phonemes plus the joins between them (rule 5 y, rule 11/12 hyphens). */
export function joinPhons(a: Analysis): Segment[] {
  const out: Segment[] = [];
  const { phons, letters } = a;
  for (let k = 0; k < phons.length; k++) {
    const p = phons[k];
    const q = phons[k - 1];
    if (q) {
      const boundary = letters[p.li].morph !== letters[q.li].morph;
      if (q.t === "V" && q.s === "i" && p.t === "V") out.push({ kind: "y", s: "y" });
      else if (boundary && q.t === "V" && p.t === "C" && p.s === "") out.push({ kind: "-", s: "-" });
      else if (q.t === "C" && HYPHEN_BEFORE_H.has(q.s) && p.t === "C" && p.s === "h")
        out.push({ kind: "-", s: "-" });
    }
    out.push({ kind: p.t, s: p.s });
  }
  return out;
}
