// Feedback on a typed answer, the same in every trainer: the verdict, then the
// right form (large: it is the thing to learn), then the hint or note, then
// what the learner typed (smaller and quieter), then anything else (the
// lesson link, the notebook's count). A near miss has its own colour and word.

import type { ReactNode } from "react";
import type { Verdict } from "@/lib/answers";
import { hintText, toneOf, VERDICT_WORD } from "@/lib/feedback";
import { Rich } from "../Rich";

export function Feedback({
  verdict,
  title,
  typed,
  typedFa = true,
  children,
  after,
}: {
  verdict: Pick<Verdict, "ok" | "near" | "note" | "hint">;
  /** In place of "Correct." / "Nearly." / "Not quite.". */
  title?: string;
  /** What the learner typed, shown under a wrong or near answer. */
  typed?: string;
  typedFa?: boolean;
  /** The right form. */
  children?: ReactNode;
  after?: ReactNode;
}) {
  const tone = toneOf(verdict);
  return (
    <div className={`feedback feedback-${tone}`}>
      <p className="feedback-verdict">{title ?? VERDICT_WORD[tone]}</p>
      {children && <div className="feedback-answer has-fa">{children}</div>}
      {verdict.note && (
        <p className="has-fa">
          <Rich text={verdict.note} translit={false} />
        </p>
      )}
      {verdict.hint && (
        <p className="has-fa">
          <Rich text={hintText(verdict.hint, tone)} translit={false} />
        </p>
      )}
      {!verdict.ok && typed && (
        <p className="feedback-typed">
          You typed: {typedFa ? <bdi className="fa" lang="fa" dir="rtl">{typed}</bdi> : typed}
        </p>
      )}
      {after}
    </div>
  );
}
