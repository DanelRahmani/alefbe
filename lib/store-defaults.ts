// The stores' empty states and defaults, apart from the modules that work with
// them. lib/stores.ts runs on every page (the header's display settings use
// it); importing these from lib/verb-drill, lib/cloze or lib/trace would bring
// the verb tables, the card logic and the stroke data into every page's
// JavaScript. Those modules re-export what is theirs from here.

import type { ClozeData } from "./cloze";
import type { ConvertData } from "./convert";
import type { PlacementData } from "./placement";
import type { QuizSetup } from "./quiz";
import { emptyDeck } from "./srs";
import type { DailyGoal } from "./today";
import type { VerbsData } from "./verb-drill";
import type { VocabData } from "./vocab";

export const emptyVerbsData = (): VerbsData => ({ decks: {}, ask: "both" });
export const emptyVocabData = (): VocabData => ({ deck: emptyDeck(), sound: false });
export const emptyClozeData = (): ClozeData => ({ deck: emptyDeck() });
export const emptyConvertData = (): ConvertData => ({ decks: { "to-written": emptyDeck(), "to-spoken": emptyDeck() }, dir: "to-written" });
export const emptyPlacementData = (): PlacementData => ({});
export const DEFAULT_QUIZ: QuizSetup = { type: "letter-name", style: "choice", scope: "all", count: 10 };
export const DEFAULT_GOAL: DailyGoal = 10;

/** Version 1 kept one best score per form; those were guided traces. */
export function migrateTraceV1(old: unknown): Record<string, number> {
  const out: Record<string, number> = {};
  if (!old || typeof old !== "object") return out;
  for (const [k, v] of Object.entries(old as Record<string, unknown>)) {
    if (typeof v !== "number") continue;
    out[k.split(":").length === 2 ? `${k}:guided` : k] = v;
  }
  return out;
}
