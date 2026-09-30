// The mistake notebook: what the learner got wrong anywhere in the app, kept
// until it is answered right twice in a row. Pure.

import type { DrillMode } from "./drill";
import type { QuizType } from "./quiz";
import type { Person, Style, Tense } from "./conjugate";

export type MistakeItem =
  /** A lesson-quiz question, by lesson key ("unit/lesson") and its index in the quiz. */
  | { kind: "lesson"; lesson: string; q: number }
  /** A quick-quiz question about a letter. */
  | { kind: "letter"; type: Exclude<QuizType, "flashcards">; ch: string }
  /** A trainer card. */
  | { kind: "drill"; mode: DrillMode; id: string }
  /** A word from a game: read it (script → sound) or spell it (sound → script). */
  | { kind: "word"; dir: "read" | "spell"; fa: string; translit: string; en: string }
  /** A conjugation-trainer question: one form of a verb. */
  | { kind: "verb"; verb: string; tense: Tense; person: Person; style: Style; negative: boolean }
  /** A vocabulary card, carried whole so the notebook can ask it without the card list. */
  | { kind: "vocab"; id: string; fa: string; spoken?: string; en: string; hint?: string };

export interface Mistake {
  item: MistakeItem;
  /** When it was last missed (ms). */
  at: number;
  misses: number;
  /** Right answers in a row since the last miss. */
  streak: number;
}

export type Notebook = Record<string, Mistake>;

/** Right answers in a row that take an item out of the notebook. */
export const CLEAR_AFTER = 2;
/** The notebook keeps this many of the most recent misses. */
export const NOTEBOOK_MAX = 150;

export function mistakeId(item: MistakeItem): string {
  switch (item.kind) {
    case "lesson":
      return `lesson:${item.lesson}:${item.q}`;
    case "letter":
      return `letter:${item.type}:${item.ch}`;
    case "drill":
      return `drill:${item.mode}:${item.id}`;
    case "word":
      return `word:${item.dir}:${item.fa}`;
    case "verb":
      return `verb:${item.verb}:${item.tense}:${item.person}:${item.style}:${item.negative ? "neg" : "aff"}`;
    case "vocab":
      return `vocab:${item.id}`;
  }
}

/**
 * Record an answer given anywhere. A miss puts the item in the notebook (or
 * resets its run); a right answer counts toward clearing it. Returns the same
 * object when nothing changed.
 */
export function noteAnswer(nb: Notebook, item: MistakeItem, ok: boolean, now: number): Notebook {
  const id = mistakeId(item);
  const cur = nb[id];
  if (ok) {
    if (!cur) return nb;
    const next = { ...nb };
    if (cur.streak + 1 >= CLEAR_AFTER) delete next[id];
    else next[id] = { ...cur, streak: cur.streak + 1 };
    return next;
  }
  const next: Notebook = { ...nb, [id]: { item, at: now, misses: (cur?.misses ?? 0) + 1, streak: 0 } };
  const ids = Object.keys(next);
  if (ids.length > NOTEBOOK_MAX) {
    const oldest = ids.sort((a, b) => next[a].at - next[b].at).slice(0, ids.length - NOTEBOOK_MAX);
    for (const o of oldest) delete next[o];
  }
  return next;
}

/** The notebook, most recent miss first. */
export const notebookList = (nb: Notebook): Mistake[] => Object.values(nb).sort((a, b) => b.at - a.at);

/** Is this item still in the notebook, and how far along is it? */
export const standing = (nb: Notebook, item: MistakeItem): Mistake | undefined => nb[mistakeId(item)];
