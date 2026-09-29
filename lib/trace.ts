// Letter tracing, pure. The hand-placed control points (lib/trace-data.ts)
// give stroke order and direction; lib/trace-path.ts turns them into smooth
// centre-line paths on the rendered glyph. Here: coverage, snapping, scoring.

import type { Form } from "./persian/letters";
import { WAYPOINTS } from "./trace-data";
import type { ControlPoint, Pt } from "./trace-path";

export type TraceLevel = "guided" | "outline" | "freehand";
export const TRACE_LEVELS: { id: TraceLevel; label: string; hint: string }[] = [
  { id: "guided", label: "Guided", hint: "Faint letter, the path with arrows, and a gentle pull toward it." },
  { id: "outline", label: "Outline", hint: "A fainter letter and the path, with a lighter pull." },
  { id: "freehand", label: "Freehand", hint: "No guide: write the letter from memory." },
];

/** Pass mark, and the stars: 70 / 85 / 95. */
export const PASS_SCORE = 70;
export const starsFor = (score: number) => (score >= 95 ? 3 : score >= 85 ? 2 : score >= PASS_SCORE ? 1 : 0);

/** A letter form's control strokes in pixels on a canvas of `size`. */
export function controlStrokes(letterIndex: number, form: Form, size: number): ControlPoint[][] {
  const strokes = WAYPOINTS[form][letterIndex] ?? WAYPOINTS.isolated[letterIndex]!;
  return strokes.map((stroke) => stroke.map(([x, y, dot]) => ({ x: x * size, y: y * size, dot: dot === 1 })));
}

const dist = (a: Pt, b: Pt) => Math.hypot(a.x - b.x, a.y - b.y);

/** New coverage after the pen passes `p`, or null when nothing new was covered. */
export function coverAt(samples: Pt[], covered: boolean[], p: Pt, radius: number): boolean[] | null {
  let next: boolean[] | null = null;
  samples.forEach((s, i) => {
    if (covered[i] || dist(s, p) > radius) return;
    next ??= [...covered];
    next[i] = true;
  });
  return next;
}

/** Pull the pen toward the nearest point of the path (0 strength = no pull). */
export function snapToPath(samples: Pt[], p: Pt, radius: number, strength: number): Pt {
  if (strength <= 0 || !samples.length) return p;
  let best = samples[0];
  let bestD = Infinity;
  for (const s of samples) {
    const d = dist(s, p);
    if (d < bestD) {
      bestD = d;
      best = s;
    }
  }
  if (bestD > radius) return p;
  const t = strength * (1 - bestD / radius);
  return { x: p.x + (best.x - p.x) * t, y: p.y + (best.y - p.y) * t };
}

/** Is the pen on the letter: within `radius` of a path sample (samples are denser than the radius)? */
export const onPath = (samples: Pt[], p: Pt, radius: number) => samples.some((s) => dist(s, p) <= radius);

/** Where to draw the guide glyph so it lines up with the hand-placed control points. */
export function glyphLayout(size: number) {
  return { fontPx: size * 0.62, x: size / 2, y: size / 2 + size * 0.06 - (23 * size) / 360 };
}
