// The conjugation trainer at /verbs. Pure: the UI keeps state.
//
// An SRS item is a verb × tense ("raftan:present"). Each review asks one
// random form of it: a person, spoken or written, affirmative or negative.
// Each tense has its own deck. Verbs open in groups of five, like the letter
// trainer's groups: the next group opens once every item of the last one
// reaches box 3. A tense opens when its lesson is marked done, or when the
// learner opens it anyway.

import { VERBS, verbById } from "@/content/verbs";
import { checkFa, type Verdict } from "./answers";
import {
  PERSONS,
  PERSON_EN,
  STYLES,
  TENSES,
  acceptedAnswers,
  conjugate,
  lacks,
  tenseInfo,
  unmarked,
  type FormSpec,
  type Style,
  type Tense,
  type Verb,
} from "./conjugate";
import { normalizeFa } from "./persian/normalize";
import { deckStats, emptyDeck, unlockedIds, type DeckState } from "./srs";

/** Which forms a review may ask for. */
export type StyleChoice = "both" | Style;

export interface VerbsData {
  /** One Leitner deck per tense. */
  decks: Partial<Record<Tense, DeckState>>;
  ask: StyleChoice;
  /** The tense last practised. */
  tense?: Tense;
  /** Tenses opened before their lesson was done. */
  opened?: Tense[];
}

export const emptyVerbsData = (): VerbsData => ({ decks: {}, ask: "both" });

export const GROUP_SIZE = 5;

export const itemId = (verb: string, tense: Tense) => `${verb}:${tense}`;

export function parseItem(id: string): { verb: Verb; tense: Tense } | null {
  const [v, t] = id.split(":");
  const verb = verbById.get(v);
  const tense = TENSES.find((x) => x.id === t)?.id;
  return verb && tense && !lacks(verb, tense, false, VERBS) ? { verb, tense } : null;
}

/** The verbs that have a tense, in the order of content/verbs.ts. */
export const verbsOf = (tense: Tense): Verb[] => VERBS.filter((v) => !lacks(v, tense, false, VERBS));

/** A tense's items in groups of five verbs. */
export function verbGroups(tense: Tense): string[][] {
  const groups: string[][] = [];
  verbsOf(tense).forEach((v, i) => {
    if (i % GROUP_SIZE === 0) groups.push([]);
    groups[groups.length - 1].push(itemId(v.id, tense));
  });
  return groups;
}

export const deckFor = (data: VerbsData, tense: Tense): DeckState => data.decks[tense] ?? emptyDeck();

/** The items a tense's deck can show: its open groups. */
export const verbCandidates = (data: VerbsData, tense: Tense): string[] => unlockedIds(verbGroups(tense), deckFor(data, tense));

/** The tense the trainer shows: the one last practised, the present at first. */
export const currentTense = (data: VerbsData): Tense => TENSES.find((t) => t.id === data.tense)?.id ?? "present";

/**
 * Is a tense open? The present always is. The others open when their lesson
 * is marked done (`done` holds finished lesson keys), or when opened anyway.
 */
export function tenseOpen(data: VerbsData, done: Record<string, unknown>, tense: Tense): boolean {
  const lesson = tenseInfo(tense).lesson;
  return !lesson || !!done[lesson] || !!data.opened?.includes(tense);
}

export const openTense = (data: VerbsData, tense: Tense): VerbsData =>
  data.opened?.includes(tense) ? data : { ...data, opened: [...(data.opened ?? []), tense] };

export interface VerbTotals {
  /** Open tenses. */
  open: number;
  due: number;
  fresh: number;
}

/** Counts across the open tenses, for the practice hub. */
export function verbTotals(data: VerbsData, done: Record<string, unknown>, now: number): VerbTotals {
  const totals = { open: 0, due: 0, fresh: 0 };
  for (const t of TENSES) {
    if (!tenseOpen(data, done, t.id)) continue;
    const s = deckStats(verbCandidates(data, t.id), deckFor(data, t.id), now);
    totals.open++;
    totals.due += s.due;
    totals.fresh += s.fresh;
  }
  return totals;
}

export interface VerbQuestion {
  verb: Verb;
  spec: FormSpec;
}

/** Share of spoken present-perfect questions that ask he/she. */
export const SPOKEN_PERFECT_HE_SHARE = 0.5;

/** Share of questions asked in the negative. */
export const NEGATIVE_SHARE = 0.3;

/** Subject pronouns a typed answer may start with (unmarked, spoken and written). */
const PRONOUN_WORDS = new Set(["من", "تو", "او", "اون", "ما", "شما", "آن‌ها", "آنها", "اونا"]);

/** One random form of an item. `rand` is called three times: person, style, polarity. */
export function askFor(id: string, ask: StyleChoice, rand: () => number): VerbQuestion | null {
  const item = parseItem(id);
  if (!item) return null;
  const p = rand();
  const r = rand();
  const style: Style = ask === "both" ? (r < 0.5 ? "spoken" : "written") : ask;
  // The spoken perfect is spelled like the simple past except for he/she, so half its questions ask he/she.
  const others = PERSONS.filter((x) => x !== "3s");
  const person =
    item.tense === "perfect" && style === "spoken"
      ? p < SPOKEN_PERFECT_HE_SHARE
        ? "3s"
        : others[Math.min(others.length - 1, Math.floor(((p - SPOKEN_PERFECT_HE_SHARE) / (1 - SPOKEN_PERFECT_HE_SHARE)) * others.length))]
      : PERSONS[Math.min(PERSONS.length - 1, Math.floor(p * PERSONS.length))];
  // The progressive has no negative: it is always asked in the affirmative.
  const negative = rand() < NEGATIVE_SHARE && !lacks(item.verb, item.tense, true, VERBS);
  return { verb: item.verb, spec: { tense: item.tense, person, style, negative } };
}

/** "the spoken form for “we”, negative"; with `tense`, "the simple past (the spoken form for “we”)". */
export function describeSpec(s: Omit<FormSpec, "tense">, tense?: Tense): string {
  const form = `the ${s.style} form for “${PERSON_EN[s.person]}”${s.negative ? ", negative" : ""}`;
  return tense ? `the ${tenseInfo(tense).title.toLowerCase()} (${form})` : form;
}

/** Every form of a verb in a tense, unmarked, with its spec. */
function formsOf(verb: Verb, tense: Tense): { spec: FormSpec; plain: string }[] {
  const out: { spec: FormSpec; plain: string }[] = [];
  for (const style of STYLES)
    for (const negative of [false, true]) {
      if (lacks(verb, tense, negative, VERBS)) continue;
      for (const person of PERSONS) {
        const spec = { tense, person, style, negative };
        out.push({ spec, plain: normalizeFa(unmarked(conjugate(verb, spec, VERBS))) });
      }
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
  // Another form of the same verb: name it, so the slip is clear. The asked
  // tense is searched first, as some forms are spelled alike across tenses.
  const words = normalizeFa(input).split(" ");
  if (words.length > 1 && PRONOUN_WORDS.has(words[0])) words.shift();
  const typed = words.join(" ");
  const same = formsOf(q.verb, q.spec.tense).find((f) => f.plain === typed);
  if (same) return { ok: false, hint: `That is ${describeSpec(same.spec)}; this one asks for ${describeSpec(q.spec)}.` };
  for (const t of TENSES) {
    if (t.id === q.spec.tense || lacks(q.verb, t.id, false, VERBS)) continue;
    const other = formsOf(q.verb, t.id).find((f) => f.plain === typed);
    if (other) return { ok: false, hint: `That is ${describeSpec(other.spec, t.id)}; this one asks for ${describeSpec(q.spec, q.spec.tense)}.` };
  }
  return { ok: false };
}

/** The two forms to show after an answer: spoken and written, same person and polarity. */
export function bothStyles(q: VerbQuestion): Record<Style, string> {
  const s = (style: Style) => conjugate(q.verb, { ...q.spec, style }, VERBS);
  return { spoken: s("spoken"), written: s("written") };
}

/** Is `id` a known item? (Imports and old data may hold ids that no longer exist.) */
export const isItem = (id: string) => parseItem(id) !== null;
