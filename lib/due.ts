// Counting what is due, without the trainers' code. The counts on the home
// page and the practice hub need only a few facts that are fixed at build
// time: each drill mode's kind, the words each set of letters opens, and each
// tense's verb groups. Those come as DueData (built by `dueData()` in
// lib/today.ts, served as /data/due.json); everything here is plain counting,
// so these pages don't load the verb tables, the conjugation engine or the
// card logic. lib/today.ts and lib/verb-drill.ts count through these same
// functions, so the two can't drift apart.

import type { Tense } from "./conjugate";
import type { ClozeData } from "./cloze";
import type { ConvertData } from "./convert";
import type { DrillMode } from "./drill";
import { DRILL_GROUPS } from "./persian/letters";
import { deckStats, emptyDeck, unlockedIds, type DeckState } from "./srs";
import type { VerbsData } from "./verb-drill";
import type { VocabData } from "./vocab";

export interface DueData {
  /** The letter trainer's modes, in order: letter decks open group by group; word decks follow letter → sound. */
  modes: { id: DrillMode; kind: "letters" | "words" }[];
  /** Each drill word and the letters it needs (unmarked), in order. */
  words: { id: string; letters: string[] }[];
  /** The tenses in order, each with its lesson (opening it) and its verb groups. */
  tenses: { id: Tense; lesson?: string; groups: string[][] }[];
}

export type ReviewDeck = DrillMode | "verbs" | "vocab" | "cloze" | "convert";

export interface ReviewsDue {
  total: number;
  byMode: Record<DrillMode, number>;
  /** Conjugation-trainer items due, across tenses. */
  verbs: number;
  /** Vocabulary cards due. */
  vocab: number;
  /** Cloze cards due. */
  cloze: number;
  /** Spoken ↔ written cards due, both directions. */
  convert: number;
  /** The deck with the most due, if any. */
  top: ReviewDeck | null;
}

export interface VocabDeck {
  data: VocabData;
  known: ReadonlySet<string> | null;
}

/** The decks kept apart from the letter trainer and the verbs. */
export interface MoreDecks {
  cloze?: ClozeData;
  convert?: ConvertData;
}

/** The cards a drill mode can show: its deck's open letter groups, or the words made of letters open in letter → sound. */
export function drillCandidatesFrom(data: DueData, mode: DrillMode, decks: Partial<Record<DrillMode, DeckState>>): string[] {
  if (data.modes.find((m) => m.id === mode)?.kind === "letters") return unlockedIds(DRILL_GROUPS, decks[mode] ?? emptyDeck());
  const letters = new Set(unlockedIds(DRILL_GROUPS, decks.sound ?? emptyDeck()));
  return data.words.filter((w) => w.letters.every((ch) => letters.has(ch))).map((w) => w.id);
}

const deckForTense = (verbs: VerbsData, tense: Tense): DeckState => verbs.decks[tense] ?? emptyDeck();

/** The items a tense's deck can show: its open groups. */
export const verbCandidatesFrom = (data: DueData, verbs: VerbsData, tense: Tense): string[] =>
  unlockedIds(data.tenses.find((t) => t.id === tense)?.groups ?? [], deckForTense(verbs, tense));

/** Is a tense open? The present always is; another when its lesson is done, or when opened anyway. */
export function tenseOpenFrom(data: DueData, verbs: VerbsData, done: Record<string, unknown>, tense: Tense): boolean {
  const lesson = data.tenses.find((t) => t.id === tense)?.lesson;
  return !lesson || !!done[lesson] || !!verbs.opened?.includes(tense);
}

export interface VerbTotals {
  /** Open tenses. */
  open: number;
  due: number;
  fresh: number;
}

/** Due and new items across the open tenses. */
export function verbTotalsFrom(data: DueData, verbs: VerbsData, done: Record<string, unknown>, now: number): VerbTotals {
  const totals = { open: 0, due: 0, fresh: 0 };
  for (const t of data.tenses) {
    if (!tenseOpenFrom(data, verbs, done, t.id)) continue;
    const s = deckStats(verbCandidatesFrom(data, verbs, t.id), deckForTense(verbs, t.id), now);
    totals.open++;
    totals.due += s.due;
    totals.fresh += s.fresh;
  }
  return totals;
}

/** Vocabulary cards due, counting only words still in the course (`known`, when given). */
export function vocabDue(data: VocabData, known: ReadonlySet<string> | null, now: number): number {
  let due = 0;
  for (const [id, c] of Object.entries(data.deck.cards)) if (c.due <= now && (!known || known.has(id))) due++;
  return due;
}

export function clozeDue(data: ClozeData, now: number): number {
  let due = 0;
  for (const c of Object.values(data.deck.cards)) if (c.due <= now) due++;
  return due;
}

/** Spoken ↔ written cards due, in both directions. */
export function convertDue(data: ConvertData, now: number): number {
  let due = 0;
  for (const dir of ["to-written", "to-spoken"] as const) for (const c of Object.values(data.decks[dir]?.cards ?? {})) if (c.due <= now) due++;
  return due;
}

/** Cards due now across every trainer deck (new cards don't count). */
export function reviewsDueFrom(
  data: DueData,
  decks: Partial<Record<DrillMode, DeckState>>,
  now: number,
  verbs: VerbsData = { decks: {}, ask: "both" },
  vocab?: VocabDeck,
  more: MoreDecks = {},
): ReviewsDue {
  const byMode = {} as Record<DrillMode, number>;
  let total = 0;
  let top: ReviewDeck | null = null;
  let topDue = 0;
  for (const m of data.modes) {
    const deck = decks[m.id];
    const due = deck ? deckStats(drillCandidatesFrom(data, m.id, decks), deck, now).due : 0;
    byMode[m.id] = due;
    total += due;
    if (due > topDue) [top, topDue] = [m.id, due];
  }
  let verbsDue = 0;
  for (const t of data.tenses) {
    const deck = verbs.decks[t.id];
    if (deck) verbsDue += deckStats(verbCandidatesFrom(data, verbs, t.id), deck, now).due;
  }
  total += verbsDue;
  if (verbsDue > topDue) [top, topDue] = ["verbs", verbsDue];
  const vocabDueNow = vocab ? vocabDue(vocab.data, vocab.known, now) : 0;
  total += vocabDueNow;
  if (vocabDueNow > topDue) [top, topDue] = ["vocab", vocabDueNow];
  const clozeDueNow = more.cloze ? clozeDue(more.cloze, now) : 0;
  total += clozeDueNow;
  if (clozeDueNow > topDue) [top, topDue] = ["cloze", clozeDueNow];
  const convertDueNow = more.convert ? convertDue(more.convert, now) : 0;
  total += convertDueNow;
  if (convertDueNow > topDue) top = "convert";
  return { total, byMode, verbs: verbsDue, vocab: vocabDueNow, cloze: clozeDueNow, convert: convertDueNow, top };
}
