// The conjugation engine: every verb form is generated from the verb's stems.
// Pure. It covers the present, the past tenses of Unit 7 (simple past,
// present perfect, past continuous, and the progressive with داشتن) and the
// forms of Unit 8 (subjunctive, imperative, and the written future),
// affirmative and negative, spoken (Tehrani) and written.
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
export type Tense =
  | "present"
  | "past"
  | "perfect"
  | "imperfect"
  | "progressive"
  | "past-progressive"
  | "subjunctive"
  | "imperative"
  | "future";

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
  /** The persons it has, when not all six: a command is only for تو and شما. */
  persons?: Person[];
  /** The styles it has, when not both: the future with خواستن belongs to writing. */
  styles?: Style[];
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
  {
    id: "subjunctive",
    title: "Present subjunctive",
    titleFa: "مُضارِعِ اِلْتِزامی",
    lesson: "want-can-must/subjunctive",
    says: "that I go (after want, can, must, maybe); let's go",
    note: "Before a stem with *o*, Tehran speech usually says *bo-*: *bokonam*, *bokhoram*. The spelling does not change.",
  },
  {
    id: "imperative",
    title: "Imperative",
    titleFa: "اَمْر",
    lesson: "want-can-must/commands",
    says: "go!",
    persons: ["2s", "2p"],
    // 2, 3: how the commands are read.
    note: "بُرُو is always *boro*. Before a stem with *o*, Tehran speech usually says *bo-*: *bokon*, *bokhor*; the spelling does not change. Written بِشَو and بِدِهْ are *beshow* and *bedeh* in careful reading; speech says *besho* and *bede*.",
  },
  {
    id: "future",
    title: "Future",
    titleFa: "آیَنْده",
    lesson: "want-can-must/future",
    says: "I will go",
    styles: ["written"],
    note: "This future belongs to writing and formal speech. Everyday speech uses the present: فَرْدا می‌رَم, *I'll go tomorrow*. *I'm going to go* is می‌خوام بِرَم.",
  },
];

export const tenseInfo = (id: Tense): TenseInfo => TENSES.find((t) => t.id === id)!;

/** The persons a tense has: all six, but only تو and شما for a command. */
export const personsOf = (tense: Tense): Person[] => tenseInfo(tense).persons ?? PERSONS;

/** The styles a tense has: both, but only written for the future. */
export const stylesOf = (tense: Tense): Style[] => tenseInfo(tense).styles ?? STYLES;

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
   * The command to one person, where it is not simply بِـ + the stem: [do, don't].
   * بُرُو / نَرُو for رفتن; in speech بِگو for the one-letter stem گ.
   */
  command?: Partial<Record<Style, [string, string]>>;
  /** No command is drilled, and why ("Rich"): can has none; want has one that is rare. */
  noCommand?: string;
  /** No negative command: nobody orders "don't know", and نَفَهْم is an insult, not a verb form to teach. */
  noNegCommand?: boolean;
  /** What the command means, where the base form misleads: "get to know" for شناختن. */
  enCommand?: string;
  /** A compound with کردن usually drops بِـ in the subjunctive and the command: کار کُنَم, کار کُن. */
  bare?: boolean;
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
 * بِـ on a present stem: بِرَوَم. Before آ it is بی and the madde goes: بیایَم.
 * Not covered, as no verb in the list needs it yet: a stem that starts with
 * اَ / اُ / ای also takes a ی (اُفْتادَن: بیفتم, نیفتم; ایسْتادَن: بایستم), and
 * دَویدَن will want its own `command` (bodo), as رفتن has.
 */
const withBe = (form: string) => (form.startsWith("آ") ? "بیا" + form.slice(1) : "بِ" + form);

/** To be, from the verb list: داشتن borrows its باش in the subjunctive. */
function copulaOf(all: readonly Verb[]): Verb {
  const be = all.find((x) => x.copula);
  if (!be) throw new Error("The subjunctive of داشتن needs بودن in the verb list");
  return be;
}

/**
 * The subjunctive: بِـ + present stem + ending (بِرَوَم, spoken بِرَم); the negative
 * puts نَـ in its place (نَرَوَم). بودن is باشَم with no prefix, and داشتن is
 * داشْته باشَم. `bare` drops the بِـ of a compound with کردن.
 */
function subjunctive(v: Verb, person: Person, style: Style, negative: boolean, all: readonly Verb[], bare = false): string {
  // Right for داشتن and دوسْت داشْتَن; نِگَهْ داشْتَن and بَرْداشْتَن (نِگَهْ دارَم, بَرْدارَم) would need entries without noMi.
  if (v.noMi) return (negative ? "نَ" : "") + v.past + "ه " + subjunctive(copulaOf(all), person, style, false, all);
  const stem = presentStem(v, style);
  const set = ENDINGS[style];
  const form = attach(stem, (endsInVowel(stem) ? set.vowel : set.cons)[idx(person)]);
  if (negative) return negate(form);
  return v.copula || bare ? form : withBe(form);
}

/** The command to تو: the stem with بِـ and no ending (بِکُن), or the verb's own form (بُرُو). To شما: the subjunctive. */
function imperative(v: Verb, person: Person, style: Style, negative: boolean, all: readonly Verb[], bare = false): string {
  if (person !== "2s") return subjunctive(v, person, style, negative, all, bare);
  if (v.noMi) return (negative ? "نَ" : "") + v.past + "ه " + imperative(copulaOf(all), person, style, false, all);
  const own = v.command?.[style];
  if (own) return own[negative ? 1 : 0];
  // Writing cites the stem whole (دِهْ, شَو); speech uses its own stem where it has one (خون, ذار).
  const stem = (style === "spoken" && v.spoken?.present) || v.present;
  if (negative) return negate(stem);
  return v.copula || bare ? stem : withBe(stem);
}

/** The written future: خواستن's present without می, then the past stem: خواهَم رَفْت. */
function future(v: Verb, person: Person, negative: boolean): string {
  return (negative ? "نَ" : "") + "خواه" + ENDINGS.written.cons[idx(person)] + " " + v.past;
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
    case "imperative":
      if (v.noCommand) return v.noCommand;
      if (negative && v.noNegCommand) return "This verb is not said as a negative command.";
      return null;
    default:
      return null;
  }
}

/** Does the verb have this form? The tense may lack the person or the style; the verb may lack the tense. */
export function hasForm(v: Verb, spec: FormSpec, all: readonly Verb[]): boolean {
  return personsOf(spec.tense).includes(spec.person) && stylesOf(spec.tense).includes(spec.style) && !lacks(v, spec.tense, spec.negative, all);
}

/** One form, fully vowel-marked: conjugate(رفتن, present 1p spoken) → می‌ریم. Throws for a form the verb lacks. */
export function conjugate(v: Verb, spec: FormSpec, all: readonly Verb[]): string {
  if (!hasForm(v, spec, all)) throw new Error(`${v.id} has no ${spec.tense} ${spec.style} ${spec.person}${spec.negative ? " negative" : ""}`);
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
    case "subjunctive":
      return withPart(subjunctive(base, person, style, negative, all, v.bare));
    case "imperative":
      return withPart(imperative(base, person, style, negative, all, v.bare));
    case "future":
      return withPart(future(base, person, negative));
  }
}

/** The persons of one tense, in order: all six, or تو and شما for a command. */
export function table(v: Verb, tense: Tense, style: Style, negative: boolean, all: readonly Verb[]): string[] {
  return personsOf(tense).map((person) => conjugate(v, { tense, person, style, negative }, all));
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
  // The infinitive after another word: "be able to" for can.
  const inf = v.modal ? "be able to" : base;
  const hint = v.enHint ? ` (${v.enHint})` : "";
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
    // "that I go", as after want, can and must.
    case "subjunctive": {
      const who = PERSON_EN[person];
      if (!negative) return `that ${who} ${inf}${hint}${person === "1p" ? ` / let's ${inf}` : ""}`;
      if (v.copula) return `that ${who} ${not(am)}${hint}`;
      if (v.modal) return `that ${who} ${not(am)} able to${hint}`;
      return `that ${who} ${he ? "doesn't" : "don't"} ${base}${hint}`;
    }
    // A command has no subject; the prompt's pronoun says who it is to.
    case "imperative":
      return `${negative ? "don't " : ""}${v.enCommand ?? inf}${hint}!`;
    case "future":
      text = `${negative ? "won't" : "will"} ${inf}`;
      break;
  }
  return `${PERSON_EN[person]} ${text}${hint}`;
}

/** Marks off: the form as it is normally typed. */
export const unmarked = (fa: string) => fa.replace(STRIPPABLE, "");

export interface Accepted {
  /** Exact answers (unmarked), with or without the pronoun. */
  answers: string[];
  /** Spellings also seen, accepted with a note naming the usual one. */
  variants: string[];
}

const usesMi = (t: Tense) => t === "present" || t === "imperfect" || t === "progressive" || t === "past-progressive";
const usesPastStem = (t: Tense) => t === "past" || t === "perfect" || t === "imperfect" || t === "past-progressive";
const usesPresentStem = (t: Tense) => t === "present" || t === "progressive" || t === "subjunctive" || t === "imperative";

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
    if (!v.light && v.spoken?.pastPrefixed && usesPastStem(spec.tense)) {
      const usedShort = spec.negative || spec.tense === "imperfect" || spec.tense === "past-progressive";
      const other: Verb = { ...v, spoken: { ...v.spoken, past: usedShort ? v.past : v.spoken.pastPrefixed, pastPrefixed: undefined } };
      const others = all.map((x) => (x.id === v.id ? other : x));
      variants.push(unmarked(conjugate(other, spec, others)));
    }
  } else if (spec.tense === "perfect" && spec.person === "3s") {
    // Writing often drops اَسْت: رفته.
    variants.push(form.replace(/ است$/, ""));
  }
  // کار کُنَم and کار بِکُنَم are both said: the form with بِـ is accepted for a compound that drops it.
  if (v.bare && !spec.negative && (spec.tense === "subjunctive" || spec.tense === "imperative")) {
    const withPrefix = acceptedAnswers({ ...v, bare: false }, spec, all);
    variants.push(withPrefix.answers[0], ...withPrefix.variants);
  }
  return { answers, variants: [...new Set(variants)].filter((x) => x !== form) };
}

/** Every form the engine makes, for the content tests' half-space check. */
export function allForms(all: readonly Verb[]): string[] {
  const out: string[] = [];
  for (const v of all)
    for (const tense of TENSES)
      for (const style of STYLES)
        for (const negative of [false, true])
          if (stylesOf(tense.id).includes(style) && !lacks(v, tense.id, negative, all)) out.push(...table(v, tense.id, style, negative, all));
  return out;
}
