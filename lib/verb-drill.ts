// The conjugation trainer at /verbs. Pure: the UI keeps state.
//
// An SRS item is a verb × tense ("raftan:present"). Each review asks one
// random form of it: a person, spoken or written, affirmative or negative.
// Verbs open in groups of five, like the letter trainer's groups: the next
// group opens once every item of the last one reaches box 3.

import { VERBS, verbById } from "@/content/verbs";
import { checkFa, type Verdict } from "./answers";
import {
  PERSONS,
  PERSON_EN,
  STYLES,
  TENSES,
  acceptedAnswers,
  conjugate,
  unmarked,
  type FormSpec,
  type Style,
  type Tense,
  type Verb,
} from "./conjugate";
import { normalizeFa } from "./persian/normalize";
import { emptyDeck, unlockedIds, type DeckState } from "./srs";

/** Which forms a review may ask for. */
export type StyleChoice = "both" | Style;

export interface VerbsData {
  /** One Leitner deck per tense. */
  decks: Partial<Record<Tense, DeckState>>;
  ask: StyleChoice;
}

export const emptyVerbsData = (): VerbsData => ({ decks: {}, ask: "both" });

export const GROUP_SIZE = 5;

export const itemId = (verb: string, tense: Tense) => `${verb}:${tense}`;

export function parseItem(id: string): { verb: Verb; tense: Tense } | null {
  const [v, t] = id.split(":");
  const verb = verbById.get(v);
  const tense = TENSES.find((x) => x.id === t)?.id;
  return verb && tense ? { verb, tense } : null;
}

/** A tense's items in groups of five verbs, in the order of content/verbs.ts. */
export function verbGroups(tense: Tense): string[][] {
  const groups: string[][] = [];
  VERBS.forEach((v, i) => {
    if (i % GROUP_SIZE === 0) groups.push([]);
    groups[groups.length - 1].push(itemId(v.id, tense));
  });
  return groups;
}

export const deckFor = (data: VerbsData, tense: Tense): DeckState => data.decks[tense] ?? emptyDeck();

/** The items a tense's deck can show: its open groups. */
export const verbCandidates = (data: VerbsData, tense: Tense): string[] => unlockedIds(verbGroups(tense), deckFor(data, tense));

export interface VerbQuestion {
  verb: Verb;
  spec: FormSpec;
}

/** Share of questions asked in the negative. */
export const NEGATIVE_SHARE = 0.3;

/** Subject pronouns a typed answer may start with (unmarked, spoken and written). */
const PRONOUN_WORDS = new Set(["من", "تو", "او", "اون", "ما", "شما", "آن‌ها", "آنها", "اونا"]);

/** One random form of an item. `rand` is called three times: person, style, polarity. */
export function askFor(id: string, ask: StyleChoice, rand: () => number): VerbQuestion | null {
  const item = parseItem(id);
  if (!item) return null;
  const person = PERSONS[Math.min(PERSONS.length - 1, Math.floor(rand() * PERSONS.length))];
  const r = rand();
  const style: Style = ask === "both" ? (r < 0.5 ? "spoken" : "written") : ask;
  const negative = rand() < NEGATIVE_SHARE;
  return { verb: item.verb, spec: { tense: item.tense, person, style, negative } };
}

/** "the spoken form for “we”, negative" */
export function describeSpec(s: Omit<FormSpec, "tense">): string {
  return `the ${s.style} form for “${PERSON_EN[s.person]}”${s.negative ? ", negative" : ""}`;
}

/** Every form of a verb in a tense, unmarked, with its spec. */
function formsOf(verb: Verb, tense: Tense): { spec: FormSpec; plain: string }[] {
  const out: { spec: FormSpec; plain: string }[] = [];
  for (const style of STYLES)
    for (const negative of [false, true])
      for (const person of PERSONS) {
        const spec = { tense, person, style, negative };
        out.push({ spec, plain: normalizeFa(unmarked(conjugate(verb, spec, VERBS))) });
      }
  return out;
}

export function checkVerb(q: VerbQuestion, input: string): Verdict {
  const acc = acceptedAnswers(q.verb, q.spec, VERBS);
  const v = checkFa(input, acc.answers);
  if (v.ok) return v;
  if (acc.variants.length && checkFa(input, acc.variants).ok) {
    return { ok: true, note: `Also typed this way; the usual spelling is ${acc.answers[0]}.` };
  }
  if (v.hint) return v;
  // Another form of the same verb: name it, so the slip is clear.
  const words = normalizeFa(input).split(" ");
  if (words.length > 1 && PRONOUN_WORDS.has(words[0])) words.shift();
  const typed = words.join(" ");
  const other = formsOf(q.verb, q.spec.tense).find((f) => f.plain === typed);
  if (other) return { ok: false, hint: `That is ${describeSpec(other.spec)}; this one asks for ${describeSpec(q.spec)}.` };
  return { ok: false };
}


/** The two forms to show after an answer: spoken and written, same person and polarity. */
export function bothStyles(q: VerbQuestion): Record<Style, string> {
  const s = (style: Style) => conjugate(q.verb, { ...q.spec, style }, VERBS);
  return { spoken: s("spoken"), written: s("written") };
}

/** Is `id` a known item? (Imports and old data may hold ids that no longer exist.) */
export const isItem = (id: string) => parseItem(id) !== null;

