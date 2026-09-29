// Normalisation for typed input (drill and quiz answers). Explicit maps only,
// never NFD: NFD turns ۀ into ە + ٔ and ئ into Arabic ي + ٔ, which the later
// steps would then mangle. Lesson content is not normalised; tests enforce it.

const LETTER_MAP: Record<string, string> = {
  "ي": "ی",
  "ى": "ی",
  "ك": "ک",
  "ڪ": "ک",
  "ە": "ه",
  "ھ": "ه",
  "ہ": "ه",
  "ة": "ه",
};
const ARABIC_INDIC = "٠١٢٣٤٥٦٧٨٩";
const PERSIAN = "۰۱۲۳۴۵۶۷۸۹";
const PRESENTATION = /[ﭐ-﷿ﹰ-﻿]/;
const INVISIBLES = /[‎‏‪-‮⁦-⁩﻿ـ‍]/g;
const MARKS = /[ً-ْٰٔ]/g;

function mapChar(ch: string): string {
  if (LETTER_MAP[ch]) return LETTER_MAP[ch];
  const d = ARABIC_INDIC.indexOf(ch);
  if (d >= 0) return PERSIAN[d];
  return ch;
}

/** Letters, digits and spacing mapped to standard Persian; marks kept. */
export function canonicalFa(input: string): string {
  let s = "";
  for (const ch of input.replace(/ۀ/g, "هٔ")) {
    if (PRESENTATION.test(ch)) {
      for (const c of ch.normalize("NFKC")) s += mapChar(c);
    } else {
      s += mapChar(ch);
    }
  }
  return s
    .replace(/یٔ/g, "ئ") // ی + hamze above → ئ
    .replace(INVISIBLES, "")
    .replace(/[  -​ 　\t\n]/g, " ")
    .replace(/ *‌+ */g, (m) => (m.includes(" ") ? " " : "‌"))
    .replace(/ +/g, " ")
    .trim();
}

const PUNCT = /[.,!?;:«»"'()،؛؟۔]/g;

/** Canonical form with every optional mark and sentence punctuation removed, for comparing answers. */
export function normalizeFa(input: string): string {
  return canonicalFa(canonicalFa(input).replace(MARKS, "").replace(PUNCT, " "));
}
