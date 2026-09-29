"use client";

import Link from "next/link";
import { useId, useRef, useState } from "react";
import type { QuizQuestion } from "@/content/types";
import { checkAnswer, type Verdict } from "@/lib/answers";
import { useStore } from "@/lib/storage";
import { lessonsStore, noteResult } from "@/lib/stores";
import { Rich, hasFa } from "../Rich";
import { FaText } from "../FaText";

function Question({ q, n, onFirst }: { q: QuizQuestion; n: number; onFirst: (ok: boolean) => void }) {
  const id = useId();
  const [value, setValue] = useState("");
  const [verdict, setVerdict] = useState<Verdict | null>(null);
  const [error, setError] = useState("");
  const [revealed, setRevealed] = useState(false);
  const counted = useRef(false);
  const isFa = q.lang === "fa";

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!value.trim()) {
      setError("Type an answer first.");
      return;
    }
    const v = checkAnswer(q.lang, value, q.answers);
    setVerdict(v);
    // Only the first try counts toward the score and the notebook.
    if (!counted.current) {
      counted.current = true;
      onFirst(v.ok);
    }
  };

  return (
    <li className="quiz-q">
      <form onSubmit={submit} noValidate>
        <label htmlFor={id} className={hasFa(q.prompt) ? "block has-fa" : "block"}>
          <span className="ui mr-2 text-sm text-muted">{n}.</span>
          <Rich text={q.prompt} translit={q.lang !== "translit"} force="all" />
        </label>
        <div className="mt-2 flex gap-2">
          <input
            id={id}
            value={value}
            onChange={(e) => {
              setValue(e.target.value);
              setError("");
              setVerdict(null);
            }}
            dir={isFa ? "rtl" : "ltr"}
            lang={isFa ? "fa" : q.lang === "translit" ? "fa-Latn" : "en"}
            className={isFa ? "quiz-input fa" : "quiz-input"}
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            spellCheck={false}
            aria-invalid={verdict ? !verdict.ok : undefined}
            aria-describedby={`${id}-fb`}
          />
          <button type="submit" className="ui quiz-check">
            Check
          </button>
        </div>
        <div id={`${id}-fb`} role="status" className="ui mt-2 text-sm">
          {error && <p className="text-[var(--err)]">{error}</p>}
          {verdict?.ok && (
            <div className="quiz-fb quiz-ok">
              <p className="font-medium">Correct.</p>
              {verdict.note && <p>{verdict.note}</p>}
              <p className="has-fa font-serif">
                <Rich text={q.explain} />
              </p>
            </div>
          )}
          {verdict && !verdict.ok && (
            <div className="quiz-fb quiz-no">
              <p className="font-medium">Not quite.</p>
              {verdict.hint && <p>{verdict.hint}</p>}
              {revealed ? (
                <p className="has-fa font-serif">
                  Answer:{" "}
                  {isFa ? <FaText text={q.answers[0]} translit="none" /> : <strong>{q.answers[0]}</strong>}
                  {". "}
                  <Rich text={q.explain} />
                </p>
              ) : (
                <button type="button" onClick={() => setRevealed(true)} className="underline underline-offset-4">
                  Show the answer
                </button>
              )}
            </div>
          )}
        </div>
      </form>
    </li>
  );
}

/** A lesson's "Check yourself" quiz. With a lesson key it keeps the score and feeds the mistake notebook. */
export function Quiz({ questions, lessonKey }: { questions: QuizQuestion[]; lessonKey?: string }) {
  const lessons = useStore(lessonsStore);
  // First-try results for this attempt: null until the question is checked.
  const [results, setResults] = useState<(boolean | null)[]>(() => questions.map(() => null));
  // Bumping a question's key remounts it empty, for a retry.
  const [keys, setKeys] = useState<number[]>(() => questions.map(() => 0));
  const [retrying, setRetrying] = useState(false);

  const saved = lessonKey ? lessons.quiz[lessonKey] : undefined;
  const complete = results.every((r) => r !== null);
  const right = results.filter((r) => r === true).length;
  const missed = results.flatMap((r, i) => (r === false ? [i] : []));

  const onFirst = (i: number, ok: boolean) => {
    const next = results.map((r, j) => (j === i ? ok : r));
    setResults(next);
    if (!lessonKey) return;
    noteResult({ kind: "lesson", lesson: lessonKey, q: i }, ok);
    // A full attempt (not a retry of the missed ones) sets the lesson's score.
    if (!retrying && next.every((r) => r !== null)) {
      const score = next.filter((r) => r === true).length;
      lessonsStore.set((s) => ({
        ...s,
        quiz: { ...s.quiz, [lessonKey]: { right: score, total: next.length, best: Math.max(s.quiz[lessonKey]?.best ?? 0, score) } },
      }));
    }
  };

  const retryMissed = () => {
    setKeys((k) => k.map((x, i) => (missed.includes(i) ? x + 1 : x)));
    setResults((r) => r.map((x) => (x === false ? null : x)));
    setRetrying(true);
  };
  const startOver = () => {
    setKeys((k) => k.map((x) => x + 1));
    setResults(questions.map(() => null));
    setRetrying(false);
  };

  return (
    <section aria-labelledby="quiz-title" className="mt-12">
      <h2 id="quiz-title" className="lesson-h2">
        Check yourself
      </h2>
      {saved && !complete && (
        <p className="ui mt-1 text-sm text-muted">
          Last time: {saved.right} of {saved.total} right first time
          {saved.best > saved.right ? ` (best ${saved.best})` : ""}.
        </p>
      )}
      <ol className="mt-4 space-y-6">
        {questions.map((q, i) => (
          <Question key={`${i}:${keys[i]}`} q={q} n={i + 1} onFirst={(ok) => onFirst(i, ok)} />
        ))}
      </ol>
      {complete && (
        <div className="ui quiz-summary" role="status">
          <p className="font-medium">
            {retrying
              ? missed.length
                ? `${missed.length} still to get right.`
                : "All right now."
              : `${right} of ${questions.length} right first time.`}
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {missed.length > 0 && (
              <button type="button" className="drill-btn" onClick={retryMissed}>
                Retry the {missed.length === 1 ? "one" : missed.length} I missed
              </button>
            )}
            <button type="button" className="drill-btn drill-btn-quiet" onClick={startOver}>
              Start over
            </button>
          </div>
          {missed.length > 0 && lessonKey && (
            <p className="mt-2 text-sm text-muted">
              Missed questions also wait in your{" "}
              <Link href="/practice/mistakes" className="underline underline-offset-4">
                mistake notebook
              </Link>
              .
            </p>
          )}
        </div>
      )}
    </section>
  );
}
