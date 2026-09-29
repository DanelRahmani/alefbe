// Practice activity: what the learner did on which (local) day, for the
// streak, the calendar and the stats on the Progress page. Pure.

import type { Form } from "./persian/letters";

export type ActivityKind = "drill" | "trace" | "quiz" | "game" | "lesson";

export const ACTIVITY_LABELS: Record<ActivityKind, string> = {
  drill: "Trainer answers",
  trace: "Letters traced",
  quiz: "Quiz answers",
  game: "Game rounds",
  lesson: "Lessons finished",
};

export interface ActivityData {
  /** Counts per local date (YYYY-MM-DD). */
  days: Record<string, Partial<Record<ActivityKind, number>>>;
  /** Passed traces per letter. */
  traced: Record<string, number>;
  /** Passed traces per form. */
  forms: Partial<Record<Form, number>>;
  /** Quick-quiz answers: [right, total] per letter. */
  quiz: Record<string, [number, number]>;
  /** The old app's quiz totals [right, total], not split by letter. */
  legacyQuiz?: [number, number];
  /** The old app's data has been looked at once. */
  legacy?: boolean;
}

export const emptyActivity = (): ActivityData => ({ days: {}, traced: {}, forms: {}, quiz: {} });

/** The local calendar date of a moment, as YYYY-MM-DD. */
export function dayKey(d: Date): string {
  const p = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
}

const addDays = (d: Date, n: number) => new Date(d.getFullYear(), d.getMonth(), d.getDate() + n);

export interface ActivityEvent {
  kind: ActivityKind;
  /** The letter practised, for traces and quiz answers. */
  letter?: string;
  form?: Form;
  /** Quiz answers: right or wrong. */
  ok?: boolean;
  count?: number;
}

export function record(a: ActivityData, e: ActivityEvent, now: Date): ActivityData {
  const key = dayKey(now);
  const n = e.count ?? 1;
  const day = { ...a.days[key], [e.kind]: (a.days[key]?.[e.kind] ?? 0) + n };
  const next: ActivityData = { ...a, days: { ...a.days, [key]: day } };
  if (e.kind === "trace" && e.letter) {
    next.traced = { ...a.traced, [e.letter]: (a.traced[e.letter] ?? 0) + n };
    if (e.form) next.forms = { ...a.forms, [e.form]: (a.forms[e.form] ?? 0) + n };
  }
  if (e.kind === "quiz" && e.letter) {
    const [r, t] = a.quiz[e.letter] ?? [0, 0];
    next.quiz = { ...a.quiz, [e.letter]: [r + (e.ok ? 1 : 0), t + 1] };
  }
  return next;
}

export const dayTotal = (d: Partial<Record<ActivityKind, number>> | undefined) =>
  Object.values(d ?? {}).reduce((n, x) => n + (x ?? 0), 0);

/** Consecutive active days ending today, or yesterday if nothing is done yet today. */
export function streak(a: ActivityData, now: Date): number {
  const active = (d: Date) => dayTotal(a.days[dayKey(d)]) > 0;
  let d = active(now) ? now : addDays(now, -1);
  let n = 0;
  while (active(d)) {
    n++;
    d = addDays(d, -1);
  }
  return n;
}

export interface CalendarDay {
  key: string;
  total: number;
  future: boolean;
}

/** The last `weeks` weeks as columns of seven days (Monday first), ending with this week. */
export function calendar(a: ActivityData, now: Date, weeks: number): CalendarDay[][] {
  const monday = addDays(now, -((now.getDay() + 6) % 7));
  const start = addDays(monday, -7 * (weeks - 1));
  const today = dayKey(now);
  return Array.from({ length: weeks }, (_, w) =>
    Array.from({ length: 7 }, (_, i) => {
      const d = addDays(start, w * 7 + i);
      const key = dayKey(d);
      return { key, total: dayTotal(a.days[key]), future: key > today };
    }),
  );
}

export function totals(a: ActivityData): Record<ActivityKind, number> {
  const out: Record<ActivityKind, number> = { drill: 0, trace: 0, quiz: 0, game: 0, lesson: 0 };
  for (const d of Object.values(a.days)) for (const [k, v] of Object.entries(d)) out[k as ActivityKind] += v ?? 0;
  return out;
}

export function quizTotals(a: ActivityData): [number, number] {
  return Object.values(a.quiz).reduce<[number, number]>(([r, t], [r2, t2]) => [r + r2, t + t2], a.legacyQuiz ?? [0, 0]);
}
