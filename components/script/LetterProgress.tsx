"use client";

import Link from "next/link";
import { FORM_LABELS, formsOf, letterByChar } from "@/lib/persian/letters";
import { bestForForm, starsFor, TRACE_LEVELS } from "@/lib/trace";
import { letterStatus, STATUS_LABEL } from "@/lib/letter-status";
import { useStore } from "@/lib/storage";
import { activityStore, deckOf, srsStore, traceStore } from "@/lib/stores";

/** The learner's standing with one letter: trainer, tracing and quiz. */
export function LetterProgress({ ch, slug }: { ch: string; slug: string }) {
  const srs = useStore(srsStore);
  const trace = useStore(traceStore);
  const activity = useStore(activityStore);
  const l = letterByChar.get(ch)!;
  const sound = deckOf(srs, "sound");
  const write = deckOf(srs, "letter");
  const quiz = activity.quiz[ch];
  const level = (id: string) => TRACE_LEVELS.find((t) => t.id === id)!.label.toLowerCase();

  return (
    <div className="ui letter-progress">
      <dl className="panel stat-list">
        <div className="stat">
          <dt>Letter → sound</dt>
          <dd className="text-base">{STATUS_LABEL[letterStatus(sound, ch)]}</dd>
        </div>
        <div className="stat">
          <dt>Sound → letter</dt>
          <dd className="text-base">{STATUS_LABEL[letterStatus(write, ch)]}</dd>
        </div>
        <div className="stat">
          <dt>Quiz</dt>
          <dd className="text-base">{quiz ? `${quiz[0]} of ${quiz[1]} right` : "not quizzed yet"}</dd>
        </div>
        <div className="stat">
          <dt>Traced</dt>
          <dd className="text-base">{activity.traced[ch] ? `${activity.traced[ch]} time${activity.traced[ch] === 1 ? "" : "s"}` : "not yet"}</dd>
        </div>
      </dl>
      <ul className="trace-forms">
        {formsOf(l).map((f) => {
          const b = bestForForm(trace, ch, f);
          return (
            <li key={f}>
              <span>{FORM_LABELS[f]}</span>
              <span className="text-muted">
                {b ? `${b.score}% ${"★".repeat(starsFor(b.score))} (${level(b.level)})` : "not traced"}
              </span>
              <Link href={`/practice/trace?letter=${slug}&form=${f}`} className="underline underline-offset-4">
                Trace
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
