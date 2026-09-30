// The conjugation engine: every verb form is generated from the verb's stems.
// Pure. It covers the present and the past tenses of Unit 7 (simple past,
// present perfect, past continuous, and the progressive with داشتن),
// affirmative and negative, spoken (Tehrani) and written. The tenses of Unit 8
// (subjunctive, imperative, future) join as more cases of `Tense`.
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

/** Tenses the engine knows, in the order the course teaches them. */
export type Tense = "present" | "past" | "perfect" | "imperfect" | "progressive" | "past-progressive";

export interface TenseInfo {
  id: Tense;
  title: string;
  /** The Persian grammar term, fully marked. */
  titleFa: string;
  /** The lesson that teaches it ("unit/lesson"): the trainer opens the tense once it is done. */
  lesson?: string;
  /** What it says, in English: shown beside the name, as two of the names are easy to mix up. */
  says: string;
  /** A note shown with the tense's tables and answers ("Rich": English with marked Persian). */
  note?: string;
}

export const TENSES: TenseInfo[] = [
  { id: "present", title: "Present", titleFa: "مُضارِعِ اِخْباری", says: "I go, I'm going" },
  { id: "past", title: "Simple past", titleFa: "ماضیِ ساده", lesson: "past/simple-past", says: "I went" },
  {
    id: "perfect",
    title: "Present perfect",
    titleFa: "ماضیِ نَقْلی",
    lesson: "past/present-perfect",
    says: "I have gone",
    note: "In speech the perfect is spelled like the simple past, except for *he/she*: the stress tells them apart. *ráftam* is *I went*; *raftám* is *I have gone*.",
  },
  { id: "imperfect", title: "Past continuous", titleFa: "ماضیِ اِسْتِمْراری", lesson: "past/past-continuous", says: "I was going, I used to go" },
  { id: "progressive", title: "Present progressive", titleFa: "مُضارِعِ مُسْتَمِر", lesson: "past/in-progress", says: "I'm in the middle of going" },
  { id: "past-progressive", title: "Past progressive", titleFa: "ماضیِ مُسْتَمِر", lesson: "past/in-progress", says: "I was in the middle of going" },
];

export const tenseInfo = (id: Tense): TenseInfo => TENSES.find((t) => t.id === id)!;

export interface Verb {
  /** Stable id (SRS keys use it): the infinitive in transliteration, "raftan", "kâr-kardan". */
  id: string;
  /** The infinitive, fully marked: رَفْتَن, کار کَرْدَن. */
  inf: string;
  /** "to go" */
  en: string;
  /** English forms: base, third person, past, past participle, -ing: go, goes, went, gone, going. */
  enForms: [string, string, string, string, string];
  /** Tells apart verbs that share an English gloss: "a fact" (دانستن), "a person" (شناختن). */
  enHint?: string;
  /** The simple past of a state is an event: "found out" for دانستن. [past, base after "didn't"]. */
  enEvent?: [string, string];
  /** The -ing form that reads naturally in the progressive, where the plain one does not: "watching" for دیدن. */
  enNow?: string;
  /** A modal (can): no do-support in English. */
  modal?: boolean;
  /** Past stem: رَفْت. For a compound verb, the light verb's (see `light`). */
  past: string;
  /** Present stem as cited: رَو, دِهْ. */
  present: string;
  /** The present stem before an ending, when it differs from the cited one: دَه (midaham). */
  presentJoin?: string;
  /** Tehrani stems where speech differs from writing: ر (می‌رَم), خوا (می‌خوام). */
  spoken?: { present?: string; past?: string; pastPrefixed?: string };
  /**
   * داشتن: no می in the present (دارَم, نَدارَم) or in the past (داشْتَم). A compound takes it
   * from its light verb, which is right for دوسْت داشْتَن; a prefixed verb such as بَرْداشْتَن
   * (بَرْمی‌دارَم) would need its own entry without it.
   */
  noMi?: boolean;
  /** بودن: its present is the short endings and هست (Unit 4), and it takes no می. */
  copula?: boolean;
  /** A state, not an action (have, want, know, can): no progressive with داشتن. */
  stative?: boolean;
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

/** The verb the progressive is built with. */
const HAVE = "dâshtan";

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

// Personal endings of the past: he/she has none (رَفْت).
const PAST_ENDINGS: Record<Style, string[]> = {
  written: [FATHA + "م", "ی", "", "یم", "ید", FATHA + "نْد"],
  spoken: [FATHA + "م", "ی", "", "یم", "ین", FATHA + "ن"],
};

// The present perfect. Written: the participle رَفْته plus the short "to be":
// رَفْته‌اَم … رَفْته اَسْت. Spoken: the endings swallow the participle's -e
// (raftám, raftí, rafté …), so only he/she differs in letters from the simple
// past; the rest differ by stress alone.
const PERFECT_ENDINGS: Record<Style | "careful", string[]> = {
  written: [ZWNJ + "اَم", ZWNJ + "ای", " اَسْت", ZWNJ + "ایم", ZWNJ + "اید", ZWNJ + "اَنْد"],
  spoken: [FATHA + "م", "ی", "ه", "یم", "ین", FATHA + "ن"],
  // رفته‌م، رفته‌ی، رفته، رفته‌یم، رفته‌ین، رفته‌ن: a spelling some writers use for the spoken perfect.
  careful: [ZWNJ + "م", ZWNJ + "ی", "", ZWNJ + "یم", ZWNJ + "ین", ZWNJ + "ن"],
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

/**
 * The past stem, in speech or writing: آمَد, spoken اومَد. After a prefix (نـ, می) speech may
 * shorten it further: گُذاشْتَم but نَذاشْتَم, می‌ذاشْتَم.
 */
export function pastStem(v: Verb, style: Style, prefixed = false): string {
  if (style !== "spoken") return v.past;
  return (prefixed && v.spoken?.pastPrefixed) || v.spoken?.past || v.past;
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

/** نـ on a past form: نَرَفْتَم. Before a vowel a ی bridges the two: نَیامَدَم، نَیومَدَم. */
function negate(form: string): string {
  if (form.startsWith("آ")) return "نَیا" + form.slice(1);
  if (form.startsWith("او")) return "نَیو" + form.slice(2);
  return "نَ" + form;
}

function past(v: Verb, person: Person, style: Style, negative: boolean, prefixed = negative): string {
  const form = pastStem(v, style, prefixed) + PAST_ENDINGS[style][idx(person)];
  return negative ? negate(form) : form;
}

function perfect(v: Verb, person: Person, style: Style, negative: boolean): string {
  const stem = pastStem(v, style, negative);
  const form = style === "written" ? stem + "ه" + PERFECT_ENDINGS.written[idx(person)] : stem + PERFECT_ENDINGS.spoken[idx(person)];
  return negative ? negate(form) : form;
}

function imperfect(v: Verb, person: Person, style: Style, negative: boolean): string {
  const form = past(v, person, style, false, true);
  const mi = negative ? "نِمی" : "می";
  // As in the present, speech runs می into a vowel, and the alef goes: میاوُرْدَم، میومَدَم.
  if (style === "spoken" && form.startsWith("آ")) return mi + "ا" + form.slice(1);
  if (style === "spoken" && form.startsWith("او")) return mi + form.slice(1);
  return mi + ZWNJ + form;
}

/**
 * Why a verb has no such form, or null when it has one. The text is "Rich":
 * English with marked Persian.
 */
export function lacks(v: Verb, tense: Tense, negative: boolean, all: readonly Verb[]): string | null {
  switch (tense) {
    case "present":
      return v.copula ? "*To be* has its own present: the short endings and هَسْت (lesson 4.2)." : null;
    case "imperfect":
      return v.copula || stemVerb(v, all).noMi
        ? "In everyday Persian this verb takes no می, so its simple past also covers *used to* and *was …ing*."
        : null;
    case "progressive":
    case "past-progressive":
      if (v.copula || v.stative) return "This verb names a state, not an action, so it is not normally used in the progressive: the plain tense is used.";
      if (negative) return "The progressive has no negative: the plain present or past continuous is used instead.";
      return null;
    default:
      return null;
  }
}

/** One form, fully vowel-marked: conjugate(رفتن, present 1p spoken) → می‌ریم. Throws for a form the verb lacks. */
export function conjugate(v: Verb, spec: FormSpec, all: readonly Verb[]): string {
  if (lacks(v, spec.tense, spec.negative, all)) throw new Error(`${v.id} has no ${spec.tense}${spec.negative ? " negative" : ""}`);
  const base = stemVerb(v, all);
  const { person, style, negative } = spec;
  const withPart = (form: string) => (v.part ? `${v.part} ${form}` : form);
  switch (spec.tense) {
    case "present":
      return withPart(present(base, person, style, negative));
    case "past":
      return withPart(past(base, person, style, negative));
    case "perfect":
      return withPart(perfect(base, person, style, negative));
    case "imperfect":
      return withPart(imperfect(base, person, style, negative));
    // داشتن in front, conjugated too; the non-verbal part stays next to its verb: دارَم کار می‌کُنَم.
    case "progressive":
    case "past-progressive": {
      const have = all.find((x) => x.id === HAVE);
      if (!have) throw new Error("The progressive needs داشتن in the verb list");
      const was = spec.tense === "past-progressive";
      const aux = was ? past(have, person, style, false) : present(have, person, style, false);
      const main = was ? imperfect(base, person, style, false) : present(base, person, style, false);
      return `${aux} ${withPart(main)}`;
    }
  }
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

/** "we don't go", "he/she has gone", "I was going / used to go": the form's English. */
export function englishOf(v: Verb, spec: FormSpec): string {
  const { person, negative } = spec;
  const [base, third, pastForm, participle] = v.enForms;
  const ing = v.enNow ?? v.enForms[4];
  const he = person === "3s";
  const am = person === "1s" ? "am" : he ? "is" : "are";
  const was = person === "1s" || he ? "was" : "were";
  const have = he ? "has" : "have";
  const not = (aux: string) => (!negative ? aux : aux === "am" ? "am not" : `${aux}n't`);
  let text: string;
  switch (spec.tense) {
    case "present":
      if (v.copula) text = not(am);
      else if (v.modal) text = negative ? `${base}'t` : base;
      else if (negative) text = `${he ? "doesn't" : "don't"} ${base}`;
      else text = he ? third : base;
      break;
    case "past":
      // A state in the simple past is an event: دونِسْتَم, I found out.
      if (v.copula) text = not(was);
      else if (v.enEvent) text = negative ? `didn't ${v.enEvent[1]}` : v.enEvent[0];
      else if (v.modal) text = not(pastForm);
      else if (negative) text = `didn't ${base}`;
      // "I put", "I read": the same as the English present, so the tense is named.
      else text = pastForm === base ? `${pastForm} (past)` : pastForm;
      break;
    case "perfect":
      text = `${not(have)} ${participle}`;
      break;
    case "imperfect":
      // For a state this is the plain English past: می‌دونِسْتَم, I knew.
      if (v.stative) text = v.modal ? not(pastForm) : negative ? `didn't ${base}` : pastForm;
      else text = `${not(was)} ${v.enForms[4]} / ${negative ? "didn't use to" : "used to"} ${base}`;
      break;
    case "progressive":
      text = `${not(am)} ${ing} (right now)`;
      break;
    case "past-progressive":
      text = `${not(was)} ${ing} (right then)`;
      break;
  }
  return `${PERSON_EN[person]} ${text}${v.enHint ? ` (${v.enHint})` : ""}`;
}

/** Marks off: the form as it is normally typed. */
export const unmarked = (fa: string) => fa.replace(STRIPPABLE, "");

export interface Accepted {
  /** Exact answers (unmarked), with or without the pronoun. */
  answers: string[];
  /** Spellings also seen, accepted with a note naming the usual one. */
  variants: string[];
}

const usesMi = (t: Tense) => t !== "past" && t !== "perfect";
const usesPresentStem = (t: Tense) => t === "present" || t === "progressive";

export function acceptedAnswers(v: Verb, spec: FormSpec, all: readonly Verb[]): Accepted {
  const form = unmarked(conjugate(v, spec, all));
  const pronoun = unmarked(PRONOUNS[spec.person][spec.style]);
  const answers = [form, `${pronoun} ${form}`];
  const variants: string[] = [];
  const base = stemVerb(v, all);

  // Spelling variants apply to the verb words, never to a compound's first part.
  const words = form.split(" ");
  const partWords = v.part ? unmarked(v.part).split(" ").length : 0;
  const progressive = spec.tense === "progressive" || spec.tense === "past-progressive";
  const isVerbWord = (i: number) => (progressive ? i === 0 || i > partWords : i >= partWords);
  const respell = (fn: (w: string) => string) => words.map((w, i) => (isVerbWord(i) ? fn(w) : w)).join(" ");

  if (spec.style === "spoken") {
    if (usesMi(spec.tense)) {
      // میام is also typed می‌آم: the prefix apart and the madde kept.
      variants.push(respell((w) => w.replace(/^(ن?می)ا/, `$1${ZWNJ}آ`)));
      // میومدم is also typed apart, with its alef: می‌اومدم.
      if (pastStem(base, "spoken").startsWith("او")) variants.push(respell((w) => w.replace(/^(ن?می)و/, `$1${ZWNJ}او`)));
    }
    // می‌خواییم / میایین are often typed with one ی: می‌خوایم، میاین.
    if (usesPresentStem(spec.tense) && (spec.person === "1p" || spec.person === "2p") && endsInVowel(presentStem(base, "spoken")))
      variants.push(respell((w) => w.replace(/یی(م|ن)$/, "ی$1")));
    // The written -id for the spoken -in is common in speech too: می‌رید.
    if (spec.person === "2p") variants.push(respell((w) => w.replace(/ین$/, "ید")));
    if (spec.tense === "perfect") {
      // The spoken perfect is said raftám, rafté; chat often keeps the written spelling رفته‌ام,
      // also on a spoken stem: اومده‌ام.
      variants.push(unmarked(conjugate(v, { ...spec, style: "written" }, all)));
      const stem = pastStem(base, "spoken", spec.negative);
      const part = v.part ? `${v.part} ` : "";
      const spell = (endings: string[]) => {
        const f = stem + "ه" + endings[idx(spec.person)];
        return unmarked(part + (spec.negative ? negate(f) : f));
      };
      variants.push(spell(PERFECT_ENDINGS.written));
      // Careful colloquial spelling keeps the participle and adds the short ending: رفته‌م، رفته‌ن.
      variants.push(spell(PERFECT_ENDINGS.careful));
    }
    // گذاشتن: the full stem after a prefix (نگذاشتم), and the short one without (ذاشتم), are both heard.
    if (!v.light && v.spoken?.pastPrefixed && spec.tense !== "present" && spec.tense !== "progressive") {
      const usedShort = spec.negative || spec.tense === "imperfect" || spec.tense === "past-progressive";
      const other: Verb = { ...v, spoken: { ...v.spoken, past: usedShort ? v.past : v.spoken.pastPrefixed, pastPrefixed: undefined } };
      const others = all.map((x) => (x.id === v.id ? other : x));
      variants.push(unmarked(conjugate(other, spec, others)));
    }
  } else if (spec.tense === "perfect" && spec.person === "3s") {
    // Writing often drops اَسْت: رفته.
    variants.push(form.replace(/ است$/, ""));
  }
  return { answers, variants: [...new Set(variants)].filter((x) => x !== form) };
}

/** Every form the engine makes, for the content tests' half-space check. */
export function allForms(all: readonly Verb[]): string[] {
  const out: string[] = [];
  for (const v of all)
    for (const tense of TENSES)
      for (const style of STYLES)
        for (const negative of [false, true]) if (!lacks(v, tense.id, negative, all)) out.push(...table(v, tense.id, style, negative, all));
  return out;
}
