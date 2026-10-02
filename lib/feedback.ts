// How a verdict is shown: its tone, and its hint without a repeated "Nearly".

import type { Verdict } from "./answers";

export type Tone = "right" | "near" | "wrong";

export const toneOf = (v: Pick<Verdict, "ok" | "near">): Tone => (v.ok ? "right" : v.near ? "near" : "wrong");

export const VERDICT_WORD: Record<Tone, string> = { right: "Correct.", near: "Nearly.", wrong: "Not quite." };

/** A near miss's hint starts "Nearly: …"; the verdict line already says so. */
export const hintText = (hint: string, tone: Tone) =>
  tone === "near" && hint.startsWith("Nearly: ") ? hint.charAt(8).toUpperCase() + hint.slice(9) : hint;
