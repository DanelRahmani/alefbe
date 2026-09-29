// The old Alefbe app's data, read from its localStorage key `alefbe_v1`
// ({l, q, p, st}) or its export file ({version: 2, learned, quiz, prog, stats}),
// and folded into the new stores. Pure; letters are indexed in alphabet order.

import type { ActivityData } from "./activity";
import { FORMS, LETTERS } from "./persian/letters";
import { PASS_SCORE, type TraceLevel } from "./trace";

export interface LegacyData {
  learned: number[];
  quiz?: { tot: number; cor: number };
  /** Passed traces per letter index, per level [guided, outline, freehand]. */
  prog?: Record<string, { comp?: number[] }>;
  stats?: { sessions?: Record<string, number>; forms?: Record<string, number>; days?: string[] };
}

const LEVELS: TraceLevel[] = ["guided", "outline", "freehand"];

const obj = (x: unknown): Record<string, unknown> | undefined =>
  x && typeof x === "object" && !Array.isArray(x) ? (x as Record<string, unknown>) : undefined;
const count = (x: unknown) => (typeof x === "number" && Number.isFinite(x) && x > 0 ? Math.floor(x) : 0);
const letterAt = (id: string | number) => LETTERS[Number(id)]?.ch;

function clean(learned: unknown, quiz: unknown, prog: unknown, stats: unknown): LegacyData {
  const q = obj(quiz);
  const st = obj(stats);
  return {
    learned: Array.isArray(learned) ? learned.filter((n): n is number => Number.isInteger(n) && n >= 0 && n < 32) : [],
    quiz: q ? { tot: count(q.tot), cor: Math.min(count(q.cor), count(q.tot)) } : undefined,
    prog: obj(prog) as LegacyData["prog"],
    stats: st
      ? {
          sessions: obj(st.sessions) as Record<string, number> | undefined,
          forms: obj(st.forms) as Record<string, number> | undefined,
          days: Array.isArray(st.days) ? st.days.filter((d): d is string => typeof d === "string" && /^\d{4}-\d\d-\d\d$/.test(d)) : undefined,
        }
      : undefined,
  };
}

/** The old app's own storage key. */
export function parseLegacyStore(raw: string | null): LegacyData | null {
  if (!raw) return null;
  try {
    const d = obj(JSON.parse(raw));
    return d ? clean(d.l, d.q, d.p, d.st) : null;
  } catch {
    return null;
  }
}

/** The old app's export file, already parsed. */
export function parseLegacyExport(d: Record<string, unknown>): LegacyData | null {
  if (typeof d.version !== "number" || !Array.isArray(d.learned)) return null;
  return clean(d.learned, d.quiz, d.prog, d.stats);
}

/** Add the old quiz totals, traces and active days to the activity record. */
export function mergeLegacyActivity(a: ActivityData, d: LegacyData): ActivityData {
  const next: ActivityData = { ...a, days: { ...a.days }, traced: { ...a.traced }, forms: { ...a.forms } };
  if (d.quiz?.tot) {
    const [r, t] = a.legacyQuiz ?? [0, 0];
    next.legacyQuiz = [Math.max(r, d.quiz.cor), Math.max(t, d.quiz.tot)];
  }
  for (const [id, n] of Object.entries(d.stats?.sessions ?? {})) {
    const ch = letterAt(id);
    if (ch && count(n)) next.traced[ch] = Math.max(next.traced[ch] ?? 0, count(n));
  }
  for (const [i, n] of Object.entries(d.stats?.forms ?? {})) {
    const f = FORMS[Number(i)];
    if (f && count(n)) next.forms[f] = Math.max(next.forms[f] ?? 0, count(n));
  }
  for (const day of d.stats?.days ?? []) if (!next.days[day]) next.days[day] = { trace: 1 };
  return next;
}

/**
 * The old app counted passes per letter and level, not per form; each level
 * it passed counts as a pass of the isolated form at that level.
 */
export function mergeLegacyTrace(best: Record<string, number>, d: LegacyData): Record<string, number> {
  const next = { ...best };
  for (const [id, p] of Object.entries(d.prog ?? {})) {
    const ch = letterAt(id);
    if (!ch) continue;
    LEVELS.forEach((lv, i) => {
      if (!count(p?.comp?.[i])) return;
      const key = `${ch}:isolated:${lv}`;
      next[key] = Math.max(next[key] ?? 0, PASS_SCORE);
    });
  }
  return next;
}

/** The old app's theme ("light" / "dark"), if it was set. */
export function legacyTheme(raw: string | null): "light" | "dark" | null {
  return raw === "light" || raw === "dark" ? raw : null;
}
