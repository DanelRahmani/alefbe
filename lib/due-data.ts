// The facts lib/due.ts counts with, built from the trainers' own modules, and
// the full-strength reviewsDue for code that already has them loaded (tests,
// the review queue). Served to the browser as /data/due.json.

import { TENSES } from "./conjugate";
import { MODES, WORD_CARDS, type DrillMode } from "./drill";
import { reviewsDueFrom, type DueData, type MoreDecks, type ReviewsDue, type VocabDeck } from "./due";
import type { DeckState } from "./srs";
import { emptyVerbsData, verbGroups, type VerbsData } from "./verb-drill";

let cached: DueData | null = null;

export function dueData(): DueData {
  return (cached ??= {
    modes: MODES.map((m) => ({ id: m.id, kind: m.kind })),
    words: WORD_CARDS.map((w) => ({ id: w.id, letters: w.letters })),
    tenses: TENSES.map((t) => ({ id: t.id, ...(t.lesson ? { lesson: t.lesson } : {}), groups: verbGroups(t.id) })),
  });
}

/** Cards due now across every trainer deck (new cards don't count). */
export function reviewsDue(
  decks: Partial<Record<DrillMode, DeckState>>,
  now: number,
  verbs: VerbsData = emptyVerbsData(),
  vocab?: VocabDeck,
  more: MoreDecks = {},
): ReviewsDue {
  return reviewsDueFrom(dueData(), decks, now, verbs, vocab, more);
}
