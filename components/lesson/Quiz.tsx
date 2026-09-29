"use client";

import { useId, useState } from "react";
import type { QuizQuestion } from "@/content/types";
import { checkAnswer, type Verdict } from "@/lib/answers";
import { Rich, hasFa } from "../Rich";
import { FaText } from "../FaText";

function Question({ q, n }: { q: QuizQuestion; n: number }) {
  const id = useId();
  const [value, setValue] = useState("");
  const [verdict, setVerdict] = useState<Verdict | null>(null);
  const [error, setError] = useState("");
  const [revealed, setRevealed] = useState(false);
  const isFa = q.lang === "fa";

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!value.trim()) {
      setError("Type an answer first.");
      return;
    }
    setVerdict(checkAnswer(q.lang, value, q.answers));
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

export function Quiz({ questions }: { questions: QuizQuestion[] }) {
  return (
    <section aria-labelledby="quiz-title" className="mt-12">
      <h2 id="quiz-title" className="lesson-h2">
        Check yourself
      </h2>
      <ol className="mt-4 space-y-6">
        {questions.map((q, i) => (
          <Question key={i} q={q} n={i + 1} />
        ))}
      </ol>
    </section>
  );
}
