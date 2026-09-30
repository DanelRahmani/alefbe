// The "Marks and signs" reference on /script, corrected from the old app's
// Reference view: Persian reads zir as e and pish as o, tanvin is only the
// -an ending of some Arabic loanwords, and ٪ is a sign, not a mark.

import type { Fa, Rich } from "./types";
import { ZWNJ } from "@/lib/persian/chars";

export interface MarkRow {
  /** Course name (transliteration) and Persian name. */
  name: string;
  fa: Fa;
  /** The mark shown on a carrier letter. */
  sign: string;
  /** What it does. */
  does: Rich;
  example: Fa;
  en: string;
  /** The lesson that teaches it, "unit/lesson". */
  lesson?: string;
}

export const MARKS: MarkRow[] = [
  { name: "zabar", fa: "زَبَر", sign: "بَ", does: "the short vowel *a*", example: "دَر", en: "door", lesson: "sounds/short-vowels" },
  { name: "zir", fa: "زیر", sign: "بِ", does: "the short vowel *e*", example: "دِل", en: "heart", lesson: "sounds/short-vowels" },
  { name: "pish", fa: "پیش", sign: "بُ", does: "the short vowel *o*", example: "گُل", en: "flower", lesson: "sounds/short-vowels" },
  { name: "sokun", fa: "سُکون", sign: "بْ", does: "no vowel after this consonant", example: "دَسْت", en: "hand", lesson: "sounds/tashdid-sukun-tanvin" },
  { name: "tashdid", fa: "تَشْدید", sign: "بّ", does: "the consonant is said twice (held longer)", example: "بَچّه", en: "child", lesson: "sounds/tashdid-sukun-tanvin" },
  { name: "tanvin", fa: "تَنْوین", sign: "اً", does: "*-an* at the end of some Arabic loanwords, written on an alef", example: "لُطْفاً", en: "please", lesson: "sounds/tashdid-sukun-tanvin" },
  { name: "madde", fa: "مَدّه", sign: "آ", does: "long *â* at the start of a word or syllable", example: "آب", en: "water", lesson: "sounds/vowel-carriers" },
  { name: "hamze", fa: "هَمْزه", sign: "ء أ ؤ ئ", does: "a catch in the throat, like the break in *uh-oh*", example: "رَئیس", en: "boss, head", lesson: "sounds/hamze-and-eyn" },
  { name: "ezafe hamze", fa: "هَمْزهٔ اِضافه", sign: "هٔ", does: "the ezafe *-ye* after a silent ه", example: "خانهٔ مَن", en: "my house", lesson: "nouns/ezafe-after-vowels" },
];

export interface SignRow {
  sign: string;
  name: string;
  does: Rich;
}

export const SIGNS: SignRow[] = [
  { sign: ZWNJ, name: "nim-fâsele (half-space)", does: "an invisible break inside a word: the letters stop joining but no space opens (می‌رَوَم)" },
  { sign: "ـ", name: "keshide (tatweel)", does: "a stretching stroke with no sound; this course uses it to show joining forms (بـ ـبـ ـب)" },
  { sign: "،", name: "virgul", does: "comma" },
  { sign: "؛", name: "noqte-virgul", does: "semicolon" },
  { sign: "؟", name: "alâmat-e so'âl", does: "question mark, mirrored" },
  { sign: "« »", name: "giyume", does: "quotation marks" },
  { sign: "٫", name: "momayyez", does: "decimal point: ۲٫۵ is 2.5" },
  { sign: "٪", name: "darsad", does: "per cent" },
];
