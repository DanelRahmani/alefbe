import { describe, expect, it } from "vitest";
import {
  DAY,
  MINUTE,
  advanceUnlock,
  answer,
  deckStats,
  emptyDeck,
  nextCard,
  practiceCard,
  schedule,
  unlockNext,
  unlockedIds,
  type DeckState,
} from "@/lib/srs";

const NOW = 1_000_000_000_000;
const GROUPS = [
  ["a", "b"],
  ["c", "d"],
  ["e"],
];

const withCards = (cards: DeckState["cards"], unlocked = 1): DeckState => ({ cards, unlocked });

describe("schedule", () => {
  it("moves a new card from box 1 to box 2, due in 10 minutes", () => {
    expect(schedule(undefined, true, NOW)).toEqual({ box: 2, due: NOW + 10 * MINUTE, reps: 1, lapses: 0 });
  });
  it("uses the intervals 1 day, 3 days, 7 days for boxes 3–5", () => {
    expect(schedule({ box: 2, due: 0, reps: 1, lapses: 0 }, true, NOW).due).toBe(NOW + DAY);
    expect(schedule({ box: 3, due: 0, reps: 2, lapses: 0 }, true, NOW).due).toBe(NOW + 3 * DAY);
    expect(schedule({ box: 4, due: 0, reps: 3, lapses: 0 }, true, NOW).due).toBe(NOW + 7 * DAY);
  });
  it("caps at box 5", () => {
    expect(schedule({ box: 5, due: 0, reps: 9, lapses: 0 }, true, NOW)).toMatchObject({ box: 5, due: NOW + 7 * DAY });
  });
  it("sends a miss back to box 1, due now", () => {
    expect(schedule({ box: 4, due: 0, reps: 3, lapses: 0 }, false, NOW)).toEqual({ box: 1, due: NOW, reps: 4, lapses: 1 });
  });
});

describe("unlocking groups", () => {
  it("starts with the first group", () => {
    expect(unlockedIds(GROUPS, emptyDeck())).toEqual(["a", "b"]);
  });
  it("unlocks the next group once every card in the current one reaches box 3", () => {
    const s = withCards({ a: { box: 3, due: 0, reps: 2, lapses: 0 }, b: { box: 2, due: 0, reps: 1, lapses: 0 } });
    expect(advanceUnlock(GROUPS, s).newlyUnlocked).toEqual([]);
    s.cards.b = { box: 3, due: 0, reps: 2, lapses: 0 };
    const r = advanceUnlock(GROUPS, s);
    expect(r.newlyUnlocked).toEqual([1]);
    expect(unlockedIds(GROUPS, r.state)).toEqual(["a", "b", "c", "d"]);
  });
  it("never re-locks a group after a lapse", () => {
    const s = withCards({ a: { box: 1, due: 0, reps: 5, lapses: 2 } }, 2);
    expect(advanceUnlock(GROUPS, s).state.unlocked).toBe(2);
  });
  it("the escape hatch unlocks one more group, up to the last", () => {
    let s = emptyDeck();
    s = unlockNext(GROUPS, s);
    s = unlockNext(GROUPS, s);
    s = unlockNext(GROUPS, s);
    expect(s.unlocked).toBe(3);
  });
  it("answer schedules the card and reports new unlocks", () => {
    const s = withCards({ a: { box: 3, due: 0, reps: 2, lapses: 0 }, b: { box: 2, due: 0, reps: 1, lapses: 0 } });
    const r = answer(GROUPS, s, "b", true, NOW);
    expect(r.state.cards.b.box).toBe(3);
    expect(r.newlyUnlocked).toEqual([1]);
  });
});

describe("nextCard", () => {
  it("serves due cards first, earliest due first", () => {
    const s = withCards({ a: { box: 2, due: NOW - 5, reps: 1, lapses: 0 }, b: { box: 2, due: NOW - 50, reps: 1, lapses: 0 } });
    expect(nextCard(["a", "b"], s, NOW)).toBe("b");
  });
  it("then introduces new cards in order", () => {
    const s = withCards({ a: { box: 2, due: NOW + DAY, reps: 1, lapses: 0 } });
    expect(nextCard(["a", "b", "c"], s, NOW)).toBe("b");
  });
  it("avoids repeating the card just answered when something else is available", () => {
    const s = withCards({ a: { box: 1, due: NOW, reps: 1, lapses: 1 } });
    expect(nextCard(["a", "b"], s, NOW, "a")).toBe("b");
    expect(nextCard(["a"], s, NOW, "a")).toBe("a");
  });
  it("returns null when everything is scheduled for later", () => {
    const s = withCards({ a: { box: 3, due: NOW + DAY, reps: 2, lapses: 0 } });
    expect(nextCard(["a"], s, NOW)).toBeNull();
  });
});

describe("practiceCard", () => {
  it("picks any card but not the last one", () => {
    expect(practiceCard(["a", "b"], "a", 0)).toBe("b");
    expect(practiceCard(["a", "b", "c"], "c", 0.99)).toBe("b");
    expect(practiceCard([], undefined, 0.5)).toBeNull();
  });
});

describe("deckStats", () => {
  it("counts due, new, seen and mastered cards and the next due time", () => {
    const s = withCards({
      a: { box: 2, due: NOW - 1, reps: 1, lapses: 0 },
      b: { box: 4, due: NOW + DAY, reps: 3, lapses: 0 },
    });
    expect(deckStats(["a", "b", "c"], s, NOW)).toEqual({ due: 1, fresh: 1, seen: 2, mastered: 1, nextDue: NOW + DAY });
  });
});
