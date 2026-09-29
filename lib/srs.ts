// Leitner spaced repetition, pure functions. Boxes 1–5 with intervals
// 0 · 10 min · 1 day · 3 days · 7 days; a miss sends a card back to box 1.
// Groups unlock in order once every card of the current group reaches box 3,
// and never lock again.

export const MINUTE = 60_000;
export const DAY = 86_400_000;
export const MAX_BOX = 5;
export const UNLOCK_BOX = 3;
const INTERVALS: Record<number, number> = { 1: 0, 2: 10 * MINUTE, 3: DAY, 4: 3 * DAY, 5: 7 * DAY };

export interface CardState {
  box: number;
  due: number;
  reps: number;
  lapses: number;
}

export interface DeckState {
  cards: Record<string, CardState>;
  /** How many groups are open (at least 1). */
  unlocked: number;
}

export const emptyDeck = (): DeckState => ({ cards: {}, unlocked: 1 });

export function schedule(card: CardState | undefined, correct: boolean, now: number): CardState {
  const prev = card ?? { box: 1, due: now, reps: 0, lapses: 0 };
  const box = correct ? Math.min(MAX_BOX, prev.box + 1) : 1;
  return { box, due: now + INTERVALS[box], reps: prev.reps + 1, lapses: prev.lapses + (correct ? 0 : 1) };
}

const mastered = (id: string, s: DeckState) => (s.cards[id]?.box ?? 0) >= UNLOCK_BOX;

export function unlockedIds(groups: string[][], s: DeckState): string[] {
  return groups.slice(0, Math.max(1, s.unlocked)).flat();
}

/** Open the next group(s) while the last open group is fully learnt. */
export function advanceUnlock(groups: string[][], s: DeckState): { state: DeckState; newlyUnlocked: number[] } {
  let unlocked = Math.max(1, s.unlocked);
  const newlyUnlocked: number[] = [];
  while (unlocked < groups.length && groups[unlocked - 1].every((id) => mastered(id, s))) {
    newlyUnlocked.push(unlocked);
    unlocked++;
  }
  return { state: unlocked === s.unlocked ? s : { ...s, unlocked }, newlyUnlocked };
}

/** "I know these": open one more group without drilling. */
export function unlockNext(groups: string[][], s: DeckState): DeckState {
  return { ...s, unlocked: Math.min(groups.length, Math.max(1, s.unlocked) + 1) };
}

export function answer(
  groups: string[][],
  s: DeckState,
  id: string,
  correct: boolean,
  now: number,
): { state: DeckState; newlyUnlocked: number[] } {
  const next = { ...s, cards: { ...s.cards, [id]: schedule(s.cards[id], correct, now) } };
  return advanceUnlock(groups, next);
}

/** Due cards first (earliest first), then new cards in order; null when caught up. */
export function nextCard(candidates: string[], s: DeckState, now: number, lastId?: string): string | null {
  const due = candidates
    .filter((id) => s.cards[id] && s.cards[id].due <= now)
    .sort((a, b) => s.cards[a].due - s.cards[b].due);
  const fresh = candidates.filter((id) => !s.cards[id]);
  return due.find((id) => id !== lastId) ?? fresh[0] ?? due[0] ?? null;
}

/** "Practise anyway": any unlocked card, never the same one twice running. */
export function practiceCard(candidates: string[], lastId: string | undefined, rand: number): string | null {
  const pool = candidates.length > 1 ? candidates.filter((id) => id !== lastId) : candidates;
  if (!pool.length) return null;
  return pool[Math.min(pool.length - 1, Math.floor(rand * pool.length))];
}

export interface DeckStats {
  due: number;
  fresh: number;
  seen: number;
  mastered: number;
  nextDue: number | null;
}

export function deckStats(candidates: string[], s: DeckState, now: number): DeckStats {
  let due = 0;
  let fresh = 0;
  let seen = 0;
  let masteredCount = 0;
  let nextDue: number | null = null;
  for (const id of candidates) {
    const c = s.cards[id];
    if (!c) {
      fresh++;
      continue;
    }
    seen++;
    if (c.box >= UNLOCK_BOX) masteredCount++;
    if (c.due <= now) due++;
    else if (nextDue === null || c.due < nextDue) nextDue = c.due;
  }
  return { due, fresh, seen, mastered: masteredCount, nextDue };
}
