// The Persian alphabet in traditional order, plus the digits. Checked against
// the old app's table (corrections noted in content/STYLE.md): ص ض ط ظ are not
// "emphatic" in Persian, and ق / غ share one sound in Iranian speech.

export interface Letter {
  ch: string;
  /** Name in the course transliteration. */
  name: string;
  /** Other names in common use, accepted as answers. */
  altNames?: string[];
  /** Accepted answers for "letter → sound"; the first is the one shown. */
  sounds: string[];
  /** How the sound is described to an English speaker. */
  hint: string;
  /** Joins the following letter (false for ا د ذ ر ز ژ و). */
  joins: boolean;
  /** One of the four letters Persian added to the Arabic alphabet. */
  persianOnly?: boolean;
  /** Drill group (0-based), following the alphabet lessons. */
  group: number;
}

export const LETTERS: Letter[] = [
  { ch: "ا", name: "alef", sounds: ["â", "a", "e", "o"], hint: "â, like the a in father said with rounded lips; a vowel carrier at the start of a word", joins: false, group: 0 },
  { ch: "ب", name: "be", sounds: ["b"], hint: "b as in boy", joins: true, group: 0 },
  { ch: "پ", name: "pe", sounds: ["p"], hint: "p as in pen", joins: true, persianOnly: true, group: 0 },
  { ch: "ت", name: "te", sounds: ["t"], hint: "t as in top", joins: true, group: 0 },
  { ch: "ث", name: "se", sounds: ["s"], hint: "s, the same sound as س", joins: true, group: 0 },
  { ch: "ج", name: "jim", sounds: ["j"], hint: "j as in jam", joins: true, group: 1 },
  { ch: "چ", name: "che", sounds: ["ch"], hint: "ch as in chair", joins: true, persianOnly: true, group: 1 },
  { ch: "ح", name: "he-ye jimi", altNames: ["he-ye hotti"], sounds: ["h"], hint: "h, the same sound as ه", joins: true, group: 1 },
  { ch: "خ", name: "khe", sounds: ["kh"], hint: "kh as in Scottish loch", joins: true, group: 1 },
  { ch: "د", name: "dâl", sounds: ["d"], hint: "d as in door", joins: false, group: 2 },
  { ch: "ذ", name: "zâl", sounds: ["z"], hint: "z, the same sound as ز", joins: false, group: 2 },
  { ch: "ر", name: "re", sounds: ["r"], hint: "a tapped r, like the tt in American butter; rolled when doubled", joins: false, group: 2 },
  { ch: "ز", name: "ze", sounds: ["z"], hint: "z as in zoo", joins: false, group: 2 },
  { ch: "ژ", name: "zhe", sounds: ["zh"], hint: "zh like the s in measure", joins: false, persianOnly: true, group: 2 },
  { ch: "س", name: "sin", sounds: ["s"], hint: "s as in sun", joins: true, group: 3 },
  { ch: "ش", name: "shin", sounds: ["sh"], hint: "sh as in shop", joins: true, group: 3 },
  { ch: "ص", name: "sâd", sounds: ["s"], hint: "s, the same sound as س", joins: true, group: 3 },
  { ch: "ض", name: "zâd", sounds: ["z"], hint: "z, the same sound as ز", joins: true, group: 3 },
  { ch: "ط", name: "tâ", sounds: ["t"], hint: "t, the same sound as ت", joins: true, group: 4 },
  { ch: "ظ", name: "zâ", sounds: ["z"], hint: "z, the same sound as ز", joins: true, group: 4 },
  { ch: "ع", name: "eyn", sounds: ["'"], hint: "a catch in the throat, the same sound as ء (hamze); often just a break between vowels or a longer vowel", joins: true, group: 4 },
  { ch: "غ", name: "gheyn", sounds: ["gh", "q"], hint: "a throaty g (softer, like a French r, between vowels), the same sound as ق", joins: true, group: 4 },
  { ch: "ف", name: "fe", sounds: ["f"], hint: "f as in fun", joins: true, group: 5 },
  { ch: "ق", name: "qâf", sounds: ["q", "gh"], hint: "a throaty g (softer, like a French r, between vowels), the same sound as غ", joins: true, group: 5 },
  { ch: "ک", name: "kâf", sounds: ["k"], hint: "k as in kite", joins: true, group: 5 },
  { ch: "گ", name: "gâf", sounds: ["g"], hint: "g as in go", joins: true, persianOnly: true, group: 5 },
  { ch: "ل", name: "lâm", sounds: ["l"], hint: "l as in love", joins: true, group: 6 },
  { ch: "م", name: "mim", sounds: ["m"], hint: "m as in moon", joins: true, group: 6 },
  { ch: "ن", name: "nun", sounds: ["n"], hint: "n as in no", joins: true, group: 6 },
  { ch: "و", name: "vâv", sounds: ["v", "u", "o"], hint: "v, or the vowel u (sometimes o)", joins: false, group: 6 },
  { ch: "ه", name: "he-ye do-cheshm", altNames: ["he-ye havvaz"], sounds: ["h", "e"], hint: "h; at the end of a word usually silent, showing a final e (خانه khâne)", joins: true, group: 7 },
  { ch: "ی", name: "ye", sounds: ["y", "i"], hint: "y, the vowel i, or the second half of ey", joins: true, group: 7 },
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

/** The joining forms, drawn with a tatweel (ـ) for the connecting stroke. */
export function formOf(l: Letter, form: Form): string {
  switch (form) {
    case "isolated":
      return l.ch;
    case "initial":
      return l.joins ? `${l.ch}ـ` : l.ch;
    case "medial":
      return l.joins ? `ـ${l.ch}ـ` : `ـ${l.ch}`;
    case "final":
      return `ـ${l.ch}`;
  }
}

export const letterByChar = new Map(LETTERS.map((l) => [l.ch, l]));

/** Letters (and digits) of each drill group, in order. */
export const DRILL_GROUPS: string[][] = Array.from({ length: LETTER_GROUP_COUNT }, (_, g) =>
  g === 8 ? DIGITS.map((d) => d.ch) : LETTERS.filter((l) => l.group === g).map((l) => l.ch),
);
