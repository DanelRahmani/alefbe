// A letter's standing in the letter → sound deck of the trainer. Pure.

import { DRILL_GROUPS } from "./persian/letters";
import { MAX_BOX, UNLOCK_BOX, unlockedIds, type DeckState } from "./srs";

export type LetterStatus = "new" | "open" | "learned" | "solid";

export const STATUS_LABEL: Record<LetterStatus, string> = {
  new: "not open yet",
  open: "open",
  learned: "learned (box 3 or higher)",
  solid: "solid (box 5)",
};

export function letterStatus(deck: DeckState, ch: string): LetterStatus {
  const box = deck.cards[ch]?.box ?? 0;
  if (box >= MAX_BOX) return "solid";
  if (box >= UNLOCK_BOX) return "learned";
  return unlockedIds(DRILL_GROUPS, deck).includes(ch) ? "open" : "new";
}
