// One review queue: what is due now across every deck (the letter and word
// trainer, the verbs, the vocabulary, cloze practice, the spoken ↔ written
// drill), then the mistake notebook. Pure: the page asks each item with its
// own deck's prompt and checker, and schedules the answer in that deck.

import { CONVERT_DIRS, type ConvertData, type ConvertDir } from "./convert";
import { TENSES, type Tense } from "./conjugate";
import { MODES, drillCandidates, type DrillMode } from "./drill";
import { mistakeId, notebookList, type Mistake, type MistakeItem, type Notebook } from "./mistakes";
import type { DeckState } from "./srs";
import { itemId, verbCandidates, type VerbsData } from "./verb-drill";
import type { VocabData } from "./vocab";
import type { ClozeData } from "./cloze";

/** One item of the queue: a due card of a deck, or a notebook item. */
export type ReviewItem =
  | { kind: "drill"; mode: DrillMode; id: string; due: number }
  | { kind: "verb"; tense: Tense; id: string; due: number }
  | { kind: "vocab"; id: string; due: number }
  | { kind: "cloze"; id: string; due: number }
  | { kind: "convert"; dir: ConvertDir; id: string; due: number }
  | { kind: "mistake"; mistake: Mistake };

export type ReviewKind = ReviewItem["kind"];

/** Every store the queue reads. */
export interface ReviewDecks {
  srs: Partial<Record<DrillMode, DeckState>>;
  verbs: VerbsData;
  vocab: VocabData;
  cloze: ClozeData;
  convert: ConvertData;
  notebook: Notebook;
}

/** The ids still in the course, so a card that has left it is not asked. */
export interface ReviewKnown {
  vocab: ReadonlySet<string>;
  cloze: ReadonlySet<string>;
  /** Per direction: a card asked one way only is not in the other set. */
  convert: Record<ConvertDir, ReadonlySet<string>>;
}

/** The longest session. */
export const REVIEW_MAX = 50;
/** Places kept for notebook items when more deck cards are due than fit. */
export const NOTEBOOK_SLOTS = 10;

/** A key shared by a deck card and the notebook items that card would also answer. */
export function deckKey(item: ReviewItem): string | null {
  switch (item.kind) {
    case "drill":
      return `drill:${item.mode}:${item.id}`;
    case "verb":
      return `verb:${item.id}`;
    case "vocab":
      return `vocab:${item.id}`;
    case "cloze":
      return `cloze:${item.id}`;
    case "convert":
      return `convert:${item.dir}:${item.id}`;
    case "mistake":
      return mistakeDeckKey(item.mistake.item);
  }
}

/** The deck card a notebook item belongs to, or null (lesson quizzes, the letter quiz and games have no deck). */
export function mistakeDeckKey(item: MistakeItem): string | null {
  switch (item.kind) {
    case "drill":
      return `drill:${item.mode}:${item.id}`;
    case "verb":
      return `verb:${itemId(item.verb, item.tense)}`;
    case "vocab":
      return `vocab:${item.id}`;
    case "cloze":
      return `cloze:${item.id}`;
    case "convert":
      return `convert:${item.dir}:${item.id}`;
    default:
      return null;
  }
}

/** A key unique within the queue. */
export const reviewKey = (item: ReviewItem): string => (item.kind === "mistake" ? `mistake:${mistakeId(item.mistake.item)}` : deckKey(item)!);

/** The due cards of a deck among `ids`. */
function dueIn(deck: DeckState | undefined, ids: Iterable<string>, now: number): { id: string; due: number }[] {
  if (!deck) return [];
  const out: { id: string; due: number }[] = [];
  for (const id of ids) {
    const c = deck.cards[id];
    if (c && c.due <= now) out.push({ id, due: c.due });
  }
  return out;
}

/** Every deck card due now, earliest first. */
export function dueCards(d: ReviewDecks, known: ReviewKnown, now: number): ReviewItem[] {
  const items: ReviewItem[] = [];
  for (const m of MODES) for (const c of dueIn(d.srs[m.id], drillCandidates(m.id, d.srs), now)) items.push({ kind: "drill", mode: m.id, ...c });
  for (const t of TENSES) for (const c of dueIn(d.verbs.decks[t.id], verbCandidates(d.verbs, t.id), now)) items.push({ kind: "verb", tense: t.id, ...c });
  for (const c of dueIn(d.vocab.deck, known.vocab, now)) items.push({ kind: "vocab", ...c });
  for (const c of dueIn(d.cloze.deck, known.cloze, now)) items.push({ kind: "cloze", ...c });
  for (const dir of CONVERT_DIRS) for (const c of dueIn(d.convert.decks[dir.id], known.convert[dir.id], now)) items.push({ kind: "convert", dir: dir.id, ...c });
  // A stable sort keeps the decks' order among cards due at the same moment.
  return items.sort((a, b) => (a as { due: number }).due - (b as { due: number }).due);
}

/**
 * The session: the deck cards due now, earliest first, then the notebook,
 * most recent miss first. A notebook item whose deck card is already in the
 * queue is left out, as that answer clears it too. At most `max` items; when
 * more deck cards are due than fit, `NOTEBOOK_SLOTS` places stay for the
 * notebook.
 */
export function reviewQueue(d: ReviewDecks, known: ReviewKnown, now: number, max = REVIEW_MAX): ReviewItem[] {
  const cards = dueCards(d, known, now);
  const notebook = notebookList(d.notebook);
  const taken = cards.slice(0, Math.max(max - Math.min(notebook.length, NOTEBOOK_SLOTS), 0));
  const keys = new Set(taken.map((c) => deckKey(c)));
  const mistakes: ReviewItem[] = notebook
    .filter((m) => {
      const k = mistakeDeckKey(m.item);
      return !k || !keys.has(k);
    })
    .map((mistake) => ({ kind: "mistake", mistake }));
  return [...taken, ...mistakes.slice(0, max - taken.length)];
}

/** How many items of each kind, for the start panel. */
export function reviewCounts(items: readonly ReviewItem[]): Record<ReviewKind, number> {
  const counts: Record<ReviewKind, number> = { drill: 0, verb: 0, vocab: 0, cloze: 0, convert: 0, mistake: 0 };
  for (const i of items) counts[i.kind]++;
  return counts;
}
