import { describe, expect, it } from "vitest";
import { TENSES } from "@/lib/conjugate";
import { MODES, drillCandidates, type DrillMode } from "@/lib/drill";
import { drillCandidatesFrom, verbCandidatesFrom, verbTotalsFrom } from "@/lib/due";
import { dueData } from "@/lib/due-data";
import { emptyDeck, type DeckState } from "@/lib/srs";
import { emptyVerbsData, verbCandidates, verbTotals, type VerbsData } from "@/lib/verb-drill";

// The home page and the practice hub count with lib/due.ts and /data/due.json;
// the trainers with their own modules. They must agree.
const data = JSON.parse(JSON.stringify(dueData())); // as the browser gets it

const deck = (unlocked: number): DeckState => ({ ...emptyDeck(), unlocked });

describe("due counts from the prebuilt data", () => {
  it("open the same drill cards as the letter trainer", () => {
    for (const unlocked of [0, 1, 3, 8]) {
      const decks: Partial<Record<DrillMode, DeckState>> = { sound: deck(unlocked), letter: deck(Math.max(1, unlocked - 1)) };
      for (const m of MODES) expect(drillCandidatesFrom(data, m.id, decks)).toEqual(drillCandidates(m.id, decks));
    }
  });
  it("open the same verb items as the verb trainer, tense by tense", () => {
    const verbs: VerbsData = { ...emptyVerbsData(), decks: { present: deck(3), past: deck(2) } };
    for (const t of TENSES) expect(verbCandidatesFrom(data, verbs, t.id)).toEqual(verbCandidates(verbs, t.id));
  });
  it("give the same verb totals for open and closed tenses", () => {
    const verbs: VerbsData = { ...emptyVerbsData(), decks: { present: deck(2) }, opened: ["future"] };
    const done = { "past/simple-past": true };
    const now = Date.UTC(2026, 9, 3);
    expect(verbTotalsFrom(data, verbs, done, now)).toEqual(verbTotals(verbs, done, now));
  });
});
