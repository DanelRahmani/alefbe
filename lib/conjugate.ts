// The conjugation engine: every verb form is generated from the verb's stems.
// Pure. Phase 5 covers the present tense, affirmative and negative, spoken
// (Tehrani) and written; the other tenses in docs/PLAN.md slot in as more
// cases of `Tense` and more branches in `conjugate`.
//
// Output is fully vowel-marked (content/STYLE.md), so it transliterates and
// passes the readability check like any other Persian string in the course.

import { analyzeWord } from "./persian/analyze";
import { STRIPPABLE, SUKUN, ZWNJ } from "./persian/chars";

export type Person = "1s" | "2s" | "3s" | "1p" | "2p" | "3p";
export const PERSONS: Person[] = ["1s", "2s", "3s", "1p", "2p", "3p"];

/** Spoken Tehrani or written Persian. */
export type Style = "spoken" | "written";
export const STYLES: Style[] = ["spoken", "written"];

/** Tenses the engine knows. The past, perfect, subjunctive and the rest join here. */
export type Tense = "present";

export const TENSES: { id: Tense; title: string; titleFa: string }[] = [{ id: "present", title: "Present", titleFa: "حال" }];

export interface Verb {
  /** Stable id (SRS keys use it): the infinitive in transliteration, "raftan", "kâr-kardan". */
  id: string;
  /** The infinitive, fully marked: رَفْتَن, کار کَرْدَن. */
  inf: string;
  /** "to go" */
  en: string;
  /** English present: base and third person, ["go", "goes"]. */
  enForms: [string, string];
  /** Tells apart verbs that share an English gloss: "a fact" (دانستن), "a person" (شناختن). */
  enHint?: string;
  /** A modal (can): no do-support in English. */
  modal?: boolean;
  /** Past stem: رَفْت. For a compound verb, the light verb's (see `light`). */
  past: string;
  /** Present stem as cited: رَو, دِهْ. */
  present: string;
  /** The present stem before an ending, when it differs from the cited one: دَه (midaham). */
  presentJoin?: string;
  /** Tehrani stems where speech differs from writing: ر (می‌رَم), خوا (می‌خوام). */
  spoken?: { present?: string; past?: string };
  /** داشتن: the present takes no می (دارَم, نَدارَم). */
  noMi?: boolean;
  /** Compound verbs: the non-verbal part (کار) and the light verb's id ("kardan"). */
  part?: string;
  light?: string;
}

export interface FormSpec {
  tense: Tense;
  person: Person;
  style: Style;
  negative: boolean;
}

const FATHA = "َ";

// Personal endings of the present, by the stem's last sound.
const ENDINGS: Record<Style, { cons: string[]; vowel: string[] }> = {
  // می‌رَوَم، می‌گویَم (a ی glide after a vowel)
  written: {
    cons: [FATHA + "م", "ی", FATHA + "د", "یم", "ید", FATHA + "نْد"],
    vowel: ["ی" + FATHA + "م", "یی", "ی" + FATHA + "د", "ییم", "یید", "ی" + FATHA + "نْد"],
  },
  // می‌رَم، می‌ره; after â: می‌خوام، می‌خواد، می‌خواییم (mikhâyim, often typed می‌خوایم)
  spoken: {
    cons: [FATHA + "م", "ی", "ه", "یم", "ین", FATHA + "ن"],
    vowel: ["م", "ی", "د", "ییم", "یین", "ن"],
  },
};

const idx = (p: Person) => PERSONS.indexOf(p);

/** Does the stem end in a vowel (گو gu, آ â, خوا khâ) rather than a consonant (رَو rav)? */
export function endsInVowel(stem: string): boolean {
  const a = analyzeWord(stem);
  return a.roles[a.roles.length - 1] === "vowel";
}

/** Stem + ending: a final sukun gives way to the ending's vowel. */
function attach(stem: string, ending: string): string {
  const s = stem.endsWith(SUKUN) ? stem.slice(0, -1) : stem;
  return s + ending;
}

/** The verb whose stems a form is built from: the light verb of a compound. */
export function stemVerb(v: Verb, all: readonly Verb[]): Verb {
  if (!v.light) return v;
  const base = all.find((x) => x.id === v.light);
  if (!base) throw new Error(`Unknown light verb ${v.light} for ${v.id}`);
  return base;
}

/** The present stem used before an ending, in speech or writing. */
export function presentStem(v: Verb, style: Style): string {
  if (style === "spoken" && v.spoken?.present) return v.spoken.present;
  return v.presentJoin ?? v.present;
}

function present(v: Verb, person: Person, style: Style, negative: boolean): string {
  const stem = presentStem(v, style);
  const set = ENDINGS[style];
  const ending = (endsInVowel(stem) ? set.vowel : set.cons)[idx(person)];
  if (v.noMi) return (negative ? "نَ" : "") + attach(stem, ending);
  const mi = negative ? "نِمی" : "می";
  // Speech runs می into a stem starting with آ, and the madde goes: میام، میارَم.
  if (style === "spoken" && stem.startsWith("آ")) return mi + "ا" + attach(stem.slice(1), ending);
  return mi + ZWNJ + attach(stem, ending);
}

/** One form, fully vowel-marked: conjugate(رفتن, present 1p spoken) → می‌ریم. */
export function conjugate(v: Verb, spec: FormSpec, all: readonly Verb[]): string {
  const base = stemVerb(v, all);
  let form: string;
  switch (spec.tense) {
    case "present":
      form = present(base, spec.person, spec.style, spec.negative);
      break;
  }
  return v.part ? `${v.part} ${form}` : form;
}

/** All six persons of one tense. */
export function table(v: Verb, tense: Tense, style: Style, negative: boolean, all: readonly Verb[]): string[] {
  return PERSONS.map((person) => conjugate(v, { tense, person, style, negative }, all));
}

/** The subject pronouns, fully marked. */
export const PRONOUNS: Record<Person, Record<Style, string>> = {
  "1s": { spoken: "مَن", written: "مَن" },
  "2s": { spoken: "تُو", written: "تُو" },
  "3s": { spoken: "اون", written: "او" },
  "1p": { spoken: "ما", written: "ما" },
  "2p": { spoken: "شُما", written: "شُما" },
  "3p": { spoken: "اونا", written: "آن‌ها" },
};

export const PERSON_EN: Record<Person, string> = {
  "1s": "I",
  "2s": "you",
  "3s": "he/she",
  "1p": "we",
  "2p": "you (plural or polite)",
  "3p": "they",
};

/** "we don't go", "he/she can", in the English present. */
export function englishOf(v: Verb, spec: FormSpec): string {
  const subject = PERSON_EN[spec.person];
  const [base, third] = v.enForms;
  const he = spec.person === "3s";
  const hint = v.enHint ? ` (${v.enHint})` : "";
  if (v.modal) return `${subject} ${spec.negative ? `${base}'t` : base}${hint}`;
  if (spec.negative) return `${subject} ${he ? "doesn't" : "don't"} ${base}${hint}`;
  return `${subject} ${he ? third : base}${hint}`;
}

/** Marks off: the form as it is normally typed. */
export const unmarked = (fa: string) => fa.replace(STRIPPABLE, "");

export interface Accepted {
  /** Exact answers (unmarked), with or without the pronoun. */
  answers: string[];
  /** Spellings also seen, accepted with a note naming the usual one. */
  variants: string[];
}

export function acceptedAnswers(v: Verb, spec: FormSpec, all: readonly Verb[]): Accepted {
  const form = unmarked(conjugate(v, spec, all));
  const pronoun = unmarked(PRONOUNS[spec.person][spec.style]);
  const answers = [form, `${pronoun} ${form}`];
  const variants: string[] = [];
  if (spec.style === "spoken") {
    const base = stemVerb(v, all);
    const stem = presentStem(base, spec.style);
    // میام is also typed می‌آم: the prefix apart and the madde kept.
    if (!base.noMi && stem.startsWith("آ")) variants.push(form.replace(/(^| )(ن?می)ا/, `$1$2${ZWNJ}آ`));
    // می‌خواییم / میایین are often typed with one ی: می‌خوایم، میاین.
    if ((spec.person === "1p" || spec.person === "2p") && endsInVowel(stem)) variants.push(form.replace(/یی(م|ن)$/, "ی$1"));
    // The written -id for the spoken -in is common in speech too: می‌رید.
    if (spec.person === "2p") variants.push(form.replace(/ین$/, "ید"));
  }
  return { answers, variants: variants.filter((x) => x !== form) };
}

/** Every form the engine makes, for the content tests' half-space check. */
export function allForms(all: readonly Verb[]): string[] {
  const out: string[] = [];
  for (const v of all)
    for (const tense of TENSES)
      for (const style of STYLES)
        for (const negative of [false, true]) out.push(...table(v, tense.id, style, negative, all));
  return out;
}
