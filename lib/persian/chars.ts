// Unicode building blocks for Persian text. Content is written in these
// code points only; see content/STYLE.md for the conventions.

export const FATHA = "َ"; // zabar ـَ
export const KASRA = "ِ"; // zir ـِ
export const DAMMA = "ُ"; // pish ـُ
export const SUKUN = "ْ"; // sokun ـْ
export const SHADDA = "ّ"; // tashdid ـّ
export const FATHATAN = "ً"; // tanvin ـً
export const DAGGER_ALEF = "ٰ"; // ـٰ (حتیٰ)
export const HAMZA_ABOVE = "ٔ"; // ـٔ (ezafe on silent he: خانهٔ)

export const ZWNJ = "‌"; // half-space
export const ZWJ = "‍";
export const TATWEEL = "ـ";

export const MARKS = new Set([FATHA, KASRA, DAMMA, SUKUN, SHADDA, FATHATAN, DAGGER_ALEF, HAMZA_ABOVE]);
export const SHORT_VOWELS: Record<string, string> = { [FATHA]: "a", [KASRA]: "e", [DAMMA]: "o" };

/** Marks removed in "none" mode: zabar, zir, pish, sukun, tashdid, dagger alef. */
export const STRIPPABLE = /[َ-ْٰ]/g;

export const LETTERS = "اآبپتثجچحخدذرزژسشصضطظعغفقکگلمنوهیءأؤئ";
const LETTER_SET = new Set(LETTERS);

/** Letters that never join the following letter. */
export const NON_JOINING = new Set("اآدذرزژوأؤء");

export const PERSIAN_DIGITS = "۰۱۲۳۴۵۶۷۸۹";

export const PUNCT_TRANSLIT: Record<string, string> = {
  "،": ",",
  "؛": ";",
  "؟": "?",
  "«": '"',
  "»": '"',
  "٫": ".", // momayyez, the decimal point
  "٬": ",", // thousands separator
  "٪": "%",
};

/** Consonant letters and their transliteration (و ی ه ا آ ع and hamze are handled by rules). */
export const CONSONANTS: Record<string, string> = {
  ب: "b",
  پ: "p",
  ت: "t",
  ث: "s",
  ج: "j",
  چ: "ch",
  ح: "h",
  خ: "kh",
  د: "d",
  ذ: "z",
  ر: "r",
  ز: "z",
  ژ: "zh",
  س: "s",
  ش: "sh",
  ص: "s",
  ض: "z",
  ط: "t",
  ظ: "z",
  غ: "gh",
  ف: "f",
  ق: "q",
  ک: "k",
  گ: "g",
  ل: "l",
  م: "m",
  ن: "n",
};

export const isLetter = (ch: string) => LETTER_SET.has(ch);
export const isMark = (ch: string) => MARKS.has(ch);
export const isPersianDigit = (ch: string) => PERSIAN_DIGITS.includes(ch);

/** "6.1" → "۶٫۱" (Persian digits and decimal separator). */
export const faNumber = (n: string) => n.replace(/\d/g, (d) => PERSIAN_DIGITS[+d]).replace(".", "٫");

/** Any character from the Arabic-script blocks (letters, marks, digits, punctuation). */
export const ARABIC_SCRIPT = /[؀-ۿݐ-ݿﭐ-﷿ﹰ-﻿]/;
