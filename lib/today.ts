// The home page's Today card: reviews due, the daily goal, a word of the day
// and the date in the Iranian calendar. Pure (Intl aside).

import { PERSIAN_MONTHS } from "@/content/calendar";
import { dayKey, dayTotal, type ActivityData } from "./activity";
import { MODES, drillCandidates, type DrillMode } from "./drill";
import { deckStats, type DeckState } from "./srs";
import { transliterate } from "./translit";

/** Activities a day (trainer answers, traces, quiz answers, game rounds, lessons). */
export const GOALS = [5, 10, 20] as const;
export type DailyGoal = (typeof GOALS)[number];
export const DEFAULT_GOAL: DailyGoal = 10;

export interface ReviewsDue {
  total: number;
  byMode: Record<DrillMode, number>;
  /** The deck with the most cards due, or null when nothing is. */
  top: DrillMode | null;
}

/** Cards due now across every trainer deck (new cards don't count). */
export function reviewsDue(decks: Partial<Record<DrillMode, DeckState>>, now: number): ReviewsDue {
  const byMode = {} as Record<DrillMode, number>;
  let total = 0;
  let top: DrillMode | null = null;
  for (const m of MODES) {
    const deck = decks[m.id];
    const due = deck ? deckStats(drillCandidates(m.id, decks), deck, now).due : 0;
    byMode[m.id] = due;
    total += due;
    if (due > 0 && (top === null || due > byMode[top])) top = m.id;
  }
  return { total, byMode, top };
}

export interface GoalProgress {
  done: number;
  goal: number;
  met: boolean;
  /** 0–1, for the ring. */
  fraction: number;
}

export function goalProgress(a: ActivityData, now: Date, goal: number): GoalProgress {
  const done = dayTotal(a.days[dayKey(now)]);
  return { done, goal, met: done >= goal, fraction: goal > 0 ? Math.min(1, done / goal) : 1 };
}

const gcd = (a: number, b: number): number => (b ? gcd(b, a % b) : a);

/** Days since 1970-01-01 for the local calendar date. */
const dayNumber = (d: Date) => Math.floor(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()) / 86_400_000);

/**
 * One item per calendar day: the same all day, and no repeat until every
 * item has had its day. A large stride keeps neighbouring days far apart in
 * the list (so not a run of words in alphabet order).
 */
export function pickForDay<T>(list: readonly T[], now: Date): T | undefined {
  const n = list.length;
  if (!n) return undefined;
  let stride = Math.max(1, Math.round(n * 0.618));
  while (gcd(stride, n) !== 1) stride++;
  const i = (((dayNumber(now) * stride) % n) + n) % n;
  return list[i];
}

export interface IranianDate {
  day: number;
  /** 1–12, Farvardin first. */
  month: number;
  year: number;
  /** The month, fully vowel-marked. */
  monthFa: string;
  /** Its transliteration, capitalised as a name: "Mehr", "Âbân". */
  monthName: string;
  /** The whole date as Intl writes it in Persian, unmarked: "چهارشنبه ۸ مهر ۱۴۰۵". */
  fa: string;
  /** "8 Mehr 1405". */
  en: string;
}

const capitalise = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

/** Today in the Iranian calendar, or null where the browser lacks it. */
export function iranianDate(now: Date): IranianDate | null {
  try {
    const numeric = new Intl.DateTimeFormat("en-u-ca-persian-nu-latn", { day: "numeric", month: "numeric", year: "numeric" });
    if (numeric.resolvedOptions().calendar !== "persian") return null;
    const parts = numeric.formatToParts(now);
    const num = (type: string) => Number(parts.find((p) => p.type === type)?.value);
    const day = num("day");
    const month = num("month");
    const year = num("year");
    if (!day || !month || !year || month > 12) return null;

    // The Persian words and digits come from Intl; the order is fixed here, as
    // some engines put a Latin comma after the weekday.
    const faParts = new Intl.DateTimeFormat("fa-IR-u-ca-persian", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    }).formatToParts(now);
    const fa = (type: string) => faParts.find((p) => p.type === type)?.value ?? "";

    const monthFa = PERSIAN_MONTHS[month - 1];
    const monthName = capitalise(transliterate(monthFa));
    return {
      day,
      month,
      year,
      monthFa,
      monthName,
      fa: [fa("weekday"), fa("day"), fa("month"), fa("year")].filter(Boolean).join(" "),
      en: `${day} ${monthName} ${year}`,
    };
  } catch {
    return null;
  }
}
