// The Persian alphabet in traditional order, plus the digits. Checked against
// the old app's table (corrections noted in content/STYLE.md): ص ض ط ظ are not
// "emphatic" in Persian, and ق / غ share one sound in Iranian speech.

import { CONSONANTS, NON_JOINING, TATWEEL, isLetter, isMark } from "./chars";

export interface Letter {
  ch: string;
  /** Name in the course transliteration. */
  name: string;
  /** ASCII URL slug for the letter page (/script/be). */
  slug: string;
  /** Other names in common use, accepted as answers. */
  altNames?: string[];
  /** Accepted answers for "letter → sound"; the first is the one shown. */
  sounds: string[];
  /** How the sound is described to an English speaker. */
  hint: string;
  /** A common word that shows the letter, fully vowel-marked. */
  key: { fa: string; en: string };
  /** Joins the following letter (false for ا د ذ ر ز ژ و). */
  joins: boolean;
  /** One of the four letters Persian added to the Arabic alphabet. */
  persianOnly?: boolean;
  /** Drill group (0-based), following the alphabet lessons. */
  group: number;
}

export const LETTERS: Letter[] = [
  { ch: "ا", name: "alef", slug: "alef", sounds: ["â", "a", "e", "o"], hint: "â, like the a in father said with rounded lips; a vowel carrier at the start of a word", key: { fa: "اَسْب", en: "horse" }, joins: false, group: 0 },
  { ch: "ب", name: "be", slug: "be", sounds: ["b"], hint: "b as in boy", key: { fa: "بابا", en: "dad" }, joins: true, group: 0 },
  { ch: "پ", name: "pe", slug: "pe", sounds: ["p"], hint: "p as in pen", key: { fa: "پِدَر", en: "father" }, joins: true, persianOnly: true, group: 0 },
  { ch: "ت", name: "te", slug: "te", sounds: ["t"], hint: "t as in top", key: { fa: "توپ", en: "ball" }, joins: true, group: 0 },
  { ch: "ث", name: "se", slug: "se", sounds: ["s"], hint: "s, the same sound as س", key: { fa: "ثانیه", en: "second (of time)" }, joins: true, group: 0 },
  { ch: "ج", name: "jim", slug: "jim", sounds: ["j"], hint: "j as in jam", key: { fa: "جَنْگَل", en: "forest" }, joins: true, group: 1 },
  { ch: "چ", name: "che", slug: "che", sounds: ["ch"], hint: "ch as in chair", key: { fa: "چای", en: "tea" }, joins: true, persianOnly: true, group: 1 },
  { ch: "ح", name: "he-ye jimi", slug: "he-jimi", altNames: ["he-ye hotti"], sounds: ["h"], hint: "h, the same sound as ه", key: { fa: "حال", en: "state, how one is" }, joins: true, group: 1 },
  { ch: "خ", name: "khe", slug: "khe", sounds: ["kh"], hint: "kh as in Scottish loch", key: { fa: "خانه", en: "house, home" }, joins: true, group: 1 },
  { ch: "د", name: "dâl", slug: "dal", sounds: ["d"], hint: "d as in door", key: { fa: "دَسْت", en: "hand" }, joins: false, group: 2 },
  { ch: "ذ", name: "zâl", slug: "zal", sounds: ["z"], hint: "z, the same sound as ز", key: { fa: "ذُرَّت", en: "corn" }, joins: false, group: 2 },
  { ch: "ر", name: "re", slug: "re", sounds: ["r"], hint: "a tapped r, like the tt in American butter; rolled when doubled", key: { fa: "روز", en: "day" }, joins: false, group: 2 },
  { ch: "ز", name: "ze", slug: "ze", sounds: ["z"], hint: "z as in zoo", key: { fa: "زَبان", en: "language, tongue" }, joins: false, group: 2 },
  { ch: "ژ", name: "zhe", slug: "zhe", sounds: ["zh"], hint: "zh like the s in measure", key: { fa: "ژاکَت", en: "cardigan (knitted)" }, joins: false, persianOnly: true, group: 2 },
  { ch: "س", name: "sin", slug: "sin", sounds: ["s"], hint: "s as in sun", key: { fa: "سیب", en: "apple" }, joins: true, group: 3 },
  { ch: "ش", name: "shin", slug: "shin", sounds: ["sh"], hint: "sh as in shop", key: { fa: "شَب", en: "night" }, joins: true, group: 3 },
  { ch: "ص", name: "sâd", slug: "sad", sounds: ["s"], hint: "s, the same sound as س", key: { fa: "صُبْح", en: "morning" }, joins: true, group: 3 },
  { ch: "ض", name: "zâd", slug: "zad", sounds: ["z"], hint: "z, the same sound as ز", key: { fa: "ضَعیف", en: "weak" }, joins: true, group: 3 },
  { ch: "ط", name: "tâ", slug: "ta", sounds: ["t"], hint: "t, the same sound as ت", key: { fa: "طَلا", en: "gold" }, joins: true, group: 4 },
  { ch: "ظ", name: "zâ", slug: "za", sounds: ["z"], hint: "z, the same sound as ز", key: { fa: "ظَرْف", en: "dish, container" }, joins: true, group: 4 },
  { ch: "ع", name: "eyn", slug: "eyn", sounds: ["'"], hint: "a catch in the throat, the same sound as ء (hamze); often just a break between vowels or a longer vowel", key: { fa: "عَسَل", en: "honey" }, joins: true, group: 4 },
  { ch: "غ", name: "gheyn", slug: "gheyn", sounds: ["gh", "q"], hint: "a throaty g (softer, like a French r, between vowels), the same sound as ق", key: { fa: "غَذا", en: "food" }, joins: true, group: 4 },
  { ch: "ف", name: "fe", slug: "fe", sounds: ["f"], hint: "f as in fun", key: { fa: "فارْسی", en: "Persian (language)" }, joins: true, group: 5 },
  { ch: "ق", name: "qâf", slug: "qaf", sounds: ["q", "gh"], hint: "a throaty g (softer, like a French r, between vowels), the same sound as غ", key: { fa: "قَنْد", en: "sugar lump" }, joins: true, group: 5 },
  { ch: "ک", name: "kâf", slug: "kaf", sounds: ["k"], hint: "k as in kite", key: { fa: "کِتاب", en: "book" }, joins: true, group: 5 },
  { ch: "گ", name: "gâf", slug: "gaf", sounds: ["g"], hint: "g as in go", key: { fa: "گُل", en: "flower" }, joins: true, persianOnly: true, group: 5 },
  { ch: "ل", name: "lâm", slug: "lam", sounds: ["l"], hint: "l as in love", key: { fa: "لیوان", en: "glass (for drinking)" }, joins: true, group: 6 },
  { ch: "م", name: "mim", slug: "mim", sounds: ["m"], hint: "m as in moon", key: { fa: "ماه", en: "moon, month" }, joins: true, group: 6 },
  { ch: "ن", name: "nun", slug: "nun", sounds: ["n"], hint: "n as in no", key: { fa: "نان", en: "bread" }, joins: true, group: 6 },
  { ch: "و", name: "vâv", slug: "vav", sounds: ["v", "u", "o"], hint: "v, or the vowel u (sometimes o)", key: { fa: "وَقْت", en: "time" }, joins: false, group: 6 },
  { ch: "ه", name: "he-ye do-cheshm", slug: "he", altNames: ["he-ye havvaz"], sounds: ["h", "e"], hint: "h; at the end of a word usually silent, showing a final e (خانه khâne)", key: { fa: "هَوا", en: "air, weather" }, joins: true, group: 7 },
  { ch: "ی", name: "ye", slug: "ye", sounds: ["y", "i"], hint: "y, the vowel i, or the second half of ey", key: { fa: "یَخ", en: "ice" }, joins: true, group: 7 },
];

export interface Digit {
  ch: string;
  value: number;
  name: string;
  /** Colloquial forms accepted as answers (چهار is often said châr). */
  altNames?: string[];
  group: number;
}

const DIGIT_NAMES = ["sefr", "yek", "do", "se", "chahâr", "panj", "shesh", "haft", "hasht", "noh"];
const DIGIT_ALT: Record<number, string[]> = { 4: ["châr"] };
export const DIGITS: Digit[] = "۰۱۲۳۴۵۶۷۸۹"
  .split("")
  .map((ch, value) => ({ ch, value, name: DIGIT_NAMES[value], altNames: DIGIT_ALT[value], group: 8 }));

export const LETTER_GROUP_COUNT = 9;

export type Form = "isolated" | "initial" | "medial" | "final";
export const FORMS: Form[] = ["isolated", "initial", "medial", "final"];
export const FORM_LABELS: Record<Form, string> = { isolated: "Isolated", initial: "Initial", medial: "Medial", final: "Final" };

/** Any letter's joining form, drawn with a tatweel (ـ) for the connecting stroke. */
export function formGlyph(ch: string, form: Form): string {
  const joins = !NON_JOINING.has(ch);
  switch (form) {
    case "isolated":
      return ch;
    case "initial":
      return joins ? `${ch}${TATWEEL}` : ch;
    case "medial":
      return joins ? `${TATWEEL}${ch}${TATWEEL}` : `${TATWEEL}${ch}`;
    case "final":
      return `${TATWEEL}${ch}`;
  }
}

/** The joining forms of an alphabet letter. */
export const formOf = (l: Letter, form: Form): string => formGlyph(l.ch, form);

/** The forms a letter really has: a non-joiner only has isolated and final. */
export const formsOf = (l: Letter): Form[] => (l.joins ? FORMS : ["isolated", "final"]);

export const letterByChar = new Map(LETTERS.map((l) => [l.ch, l]));
export const letterBySlug = new Map(LETTERS.map((l) => [l.slug, l]));

/** Letters (and digits) of each drill group, in order. */
export const DRILL_GROUPS: string[][] = Array.from({ length: LETTER_GROUP_COUNT }, (_, g) =>
  g === 8 ? DIGITS.map((d) => d.ch) : LETTERS.filter((l) => l.group === g).map((l) => l.ch),
);

/** Letters that spell the same sound in Iranian Persian. */
export const SAME_SOUND: string[][] = [
  ["ت", "ط"],
  ["س", "ص", "ث"],
  ["ز", "ذ", "ض", "ظ"],
  ["ح", "ه"],
  ["غ", "ق"],
];
export const sameSoundAs = (ch: string): string[] => SAME_SOUND.find((f) => f.includes(ch))?.filter((c) => c !== ch) ?? [];

export interface LetterInWord {
  ch: string;
  /** The vowel marks written on it. */
  marks: string;
  form: Form;
  /** Index of the letter in the word string. */
  at: number;
}

/**
 * Each letter of a word with the joining form it takes there. A letter joins
 * the one after it unless it is a non-joiner or the next character isn't a
 * letter (space, half-space, punctuation).
 */
export function formsInWord(word: string): LetterInWord[] {
  const out: LetterInWord[] = [];
  let joinedFromRight = false;
  for (let i = 0; i < word.length; i++) {
    const ch = word[i];
    if (isMark(ch)) {
      if (out.length) out[out.length - 1].marks += ch;
      continue;
    }
    if (!isLetter(ch)) {
      joinedFromRight = false;
      continue;
    }
    let j = i + 1;
    while (j < word.length && isMark(word[j])) j++;
    const joinsLeft = j < word.length && isLetter(word[j]) && !NON_JOINING.has(ch);
    const form: Form = joinedFromRight ? (joinsLeft ? "medial" : "final") : joinsLeft ? "initial" : "isolated";
    out.push({ ch, marks: "", form, at: i });
    joinedFromRight = joinsLeft;
  }
  return out;
}

/** The word with one letter (and its marks) wrapped in a {highlight}. */
export function highlightLetter(word: string, l: LetterInWord): string {
  const end = l.at + 1 + l.marks.length;
  return `${word.slice(0, l.at)}{${word.slice(l.at, end)}}${word.slice(end)}`;
}

export type SyllableVowel = "a" | "e" | "o" | "â" | "i" | "u";

export const SYLLABLE_VOWELS: { v: SyllableVowel; label: string; how: string }[] = [
  { v: "a", label: "a", how: "zabar" },
  { v: "e", label: "e", how: "zir" },
  { v: "o", label: "o", how: "pish" },
  { v: "â", label: "â", how: "ا" },
  { v: "i", label: "i", how: "ی" },
  { v: "u", label: "u", how: "و" },
];

/** A consonant with one vowel, fully marked: بَ بِ بُ با بی بو (after alef: اَ اِ اُ آ ای او). */
export function syllable(c: string, v: SyllableVowel): string {
  if (c === "ا") return { a: "اَ", e: "اِ", o: "اُ", â: "آ", i: "ای", u: "او" }[v];
  return { a: c + "َ", e: c + "ِ", o: c + "ُ", â: c + "ا", i: c + "ی", u: c + "و" }[v];
}

const SYLLABLE_ONSET: Record<string, string> = { ...CONSONANTS, و: "v", ی: "y", ه: "h", ا: "", ع: "" };

/** How a grid syllable sounds (a lone بِ would otherwise read as an ezafe). */
export const syllableSound = (c: string, v: SyllableVowel) => (SYLLABLE_ONSET[c] ?? "") + v;
