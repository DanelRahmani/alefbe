import { emptyPlacementData } from "./store-defaults";
export { emptyPlacementData };
// The placement check: a fixed set of lesson-quiz questions, grouped in bands
// of units, that suggests where a learner who already knows some Persian
// should start. Pure.
//
// The rule: the first band where two questions were missed is where to start
// (its first lesson). The check stops there, as later answers can't change
// that. A single miss in a band is a slip: the band counts as known, but that
// question's lesson stays unfinished when the earlier lessons are marked done.
// With no band failed, the start is the first lesson after the last band.

export interface PlacementRef {
  /** Lesson key, "unit/lesson". */
  lesson: string;
  /** The question's index in that lesson's quiz. */
  q: number;
}

export interface PlacementBand {
  id: string;
  /** Shown above each question: "The core sentence". */
  title: string;
  /** Completes "both questions on …": "the past tenses". */
  topic: string;
  /** Unit slugs, in course order. */
  units: string[];
  questions: PlacementRef[];
}

/** Question id → answered right. */
export type PlacementAnswers = Record<string, boolean>;

/** A lesson in course order, as the check needs it. */
export interface PlacementLesson {
  key: string;
  unit: string;
}

/** Misses in one band that decide the start. */
export const FAIL_AT = 2;

export const refId = (r: PlacementRef) => `${r.lesson}#${r.q}`;

const missesIn = (band: PlacementBand, answers: PlacementAnswers) => band.questions.filter((r) => answers[refId(r)] === false);
const failed = (band: PlacementBand, answers: PlacementAnswers) => missesIn(band, answers).length >= FAIL_AT;

/** Every question, in the order asked. */
export const placementQuestions = (bands: PlacementBand[]): { band: PlacementBand; ref: PlacementRef }[] =>
  bands.flatMap((band) => band.questions.map((ref) => ({ band, ref })));

/** The next question to ask, or null when the check is settled: a band has failed, or all are answered. */
export function nextQuestion(bands: PlacementBand[], answers: PlacementAnswers): { band: PlacementBand; ref: PlacementRef } | null {
  for (const band of bands) {
    if (failed(band, answers)) return null;
    const ref = band.questions.find((r) => answers[refId(r)] === undefined);
    if (ref) return { band, ref };
  }
  return null;
}

export interface Placement {
  /** The lesson to start at; null when the course has nothing after what was checked. */
  start: string | null;
  /** Why: the band missed FAIL_AT times, with those questions. */
  failed?: { band: PlacementBand; missed: PlacementRef[] };
  /** Or the first band with no answers yet (a band added after this result was saved). */
  unchecked?: PlacementBand;
  /** Single misses in the bands passed. */
  slips: PlacementRef[];
  /** Lessons before the start that can be marked finished: all of them except a slip's lesson. */
  earlier: string[];
}

/** Where to start, from the answers so far. */
export function placeFrom(bands: PlacementBand[], answers: PlacementAnswers, lessons: PlacementLesson[]): Placement {
  const slips: PlacementRef[] = [];
  const firstOf = (unit: string) => lessons.find((l) => l.unit === unit)?.key ?? null;
  const finish = (start: string | null, extra: Pick<Placement, "failed" | "unchecked">): Placement => {
    const stop = start ? lessons.findIndex((l) => l.key === start) : lessons.length;
    const skip = new Set(slips.map((r) => r.lesson));
    const earlier = lessons.slice(0, stop < 0 ? 0 : stop).map((l) => l.key).filter((k) => !skip.has(k));
    return { start, slips, earlier, ...extra };
  };

  for (const band of bands) {
    const missed = missesIn(band, answers);
    if (missed.length >= FAIL_AT) return finish(firstOf(band.units[0]), { failed: { band, missed } });
    if (band.questions.some((r) => answers[refId(r)] === undefined)) return finish(firstOf(band.units[0]), { unchecked: band });
    slips.push(...missed);
  }
  // Everything checked is known: start after the last band's units.
  const checked = new Set(bands.flatMap((b) => b.units));
  const last = lessons.reduce((at, l, i) => (checked.has(l.unit) ? i : at), -1);
  return finish(lessons[last + 1]?.key ?? null, {});
}

/** The last result: when it was taken and what was answered. The suggestion is worked out from these. */
export interface PlacementData {
  last?: { at: number; answers: PlacementAnswers };
}

