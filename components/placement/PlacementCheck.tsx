"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import type { QuizQuestion } from "@/content/types";
import { checkAnswer, type Verdict } from "@/lib/answers";
import {
  nextQuestion,
  placeFrom,
  placementQuestions,
  refId,
  type Placement,
  type PlacementAnswers,
  type PlacementBand,
  type PlacementRef,
} from "@/lib/placement";
import { DRILL_GROUPS } from "@/lib/persian/letters";
import { useStore } from "@/lib/storage";
import { openLetterGroups, placementStore, progressStore } from "@/lib/stores";
import { FaText } from "../FaText";
import { Rich, hasFa } from "../Rich";
import { Feedback } from "../practice/Feedback";
import { FaAnswerField } from "../practice/FaAnswerField";

export interface PlacementLessonInfo {
  key: string;
  unit: string;
  number: string;
  title: string;
  href: string;
}

/** Units whose lessons, once all marked finished, open every letter group in the trainer. */
const SCRIPT_UNITS = ["alphabet", "sounds"];

const WORDS = ["no", "one", "two", "three", "four"];
const count = (n: number, one: string, many = `${one}s`) => `${WORDS[n] ?? n} ${n === 1 ? one : many}`;

function Why({ p, lessons }: { p: Placement; lessons: Map<string, PlacementLessonInfo> }) {
  const where = (rs: PlacementRef[]) => rs.map((r) => lessons.get(r.lesson)?.number).join(" and ");
  if (p.failed) {
    const { band, missed } = p.failed;
    const all = missed.length === band.questions.length;
    return (
      <p>
        You missed {all ? (missed.length === 2 ? "both" : "all") : `${missed.length} of the ${band.questions.length}`} questions on {band.topic} (from{" "}
        lesson{missed.length > 1 ? "s" : ""} {where(missed)}), so that unit is the place to start.
      </p>
    );
  }
  if (p.unchecked) return <p>Your last check had no questions on {p.unchecked.topic} yet, so that unit is the place to start, or take the check again.</p>;
  return <p>{p.slips.length ? "You never missed two questions on the same topic." : "You answered every question right."}</p>;
}

function Result({
  bands,
  answers,
  at,
  lessons,
  onAgain,
}: {
  bands: PlacementBand[];
  answers: PlacementAnswers;
  at: number;
  lessons: PlacementLessonInfo[];
  onAgain: () => void;
}) {
  const progress = useStore(progressStore);
  const [asking, setAsking] = useState(false);
  const byKey = new Map(lessons.map((l) => [l.key, l]));
  const p = placeFrom(bands, answers, lessons);
  const start = p.start ? byKey.get(p.start) : undefined;
  const toMark = p.earlier.filter((k) => !progress[k]);
  const earlierSet = new Set(p.earlier);
  const opensLetters = lessons.filter((l) => SCRIPT_UNITS.includes(l.unit)).every((l) => earlierSet.has(l.key));
  const lastBand = bands[bands.length - 1];
  const lastUnit = lastBand ? lessons.filter((l) => lastBand.units.includes(l.unit)).at(-1)?.number.split(".")[0] : undefined;

  const mark = () => {
    progressStore.set((prev) => ({ ...prev, ...Object.fromEntries(p.earlier.map((k) => [k, true as const])) }));
    if (opensLetters) openLetterGroups(DRILL_GROUPS.length);
    setAsking(false);
  };

  return (
    <div className="ui panel trainer-card placement-result">
      <p className="eyebrow">
        Your result · {new Date(at).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}
      </p>
      {start ? (
        <h2 className="placement-start has-fa">
          Start at lesson {start.number}: <Rich text={start.title} translit={false} />
        </h2>
      ) : (
        <h2 className="placement-start">You know what Units 1–{lastUnit} teach</h2>
      )}
      <div className="mt-2 text-muted">
        <Why p={p} lessons={byKey} />
        {!start && <p className="mt-1">The units after them are still being written. Until then, keep it fresh with the review queue.</p>}
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        {start ? (
          <Link href={start.href} className="btn">
            Go to lesson {start.number} <span aria-hidden="true">→</span>
          </Link>
        ) : (
          <Link href="/practice/review" className="btn">
            Review everything due <span aria-hidden="true">→</span>
          </Link>
        )}
        <button type="button" className="btn btn-quiet" onClick={onAgain}>
          Take the check again
        </button>
      </div>

      {p.slips.length > 0 && (
        <div className="mt-5">
          <p className="font-medium">Worth a look: you missed one question from {p.slips.length === 1 ? "this lesson" : "each of these lessons"}</p>
          <ul className="mt-1 placement-slips">
            {p.slips.map((r) => {
              const l = byKey.get(r.lesson);
              return l ? (
                <li key={refId(r)} className="has-fa">
                  <Link href={l.href} className="underline underline-offset-4">
                    {l.number} <Rich text={l.title} translit={false} />
                  </Link>
                </li>
              ) : null;
            })}
          </ul>
        </div>
      )}

      {p.earlier.length > 0 && (
        <div className="mt-5">
          {toMark.length === 0 ? (
            <p role="status" className="mt-4 feedback feedback-right">
              Every lesson before {start ? `lesson ${start.number}` : "this point"}
              {p.slips.length ? ", apart from the ones worth a look," : ""} is marked finished.
            </p>
          ) : asking ? (
            <div className="panel panel-accent confirm-box" role="alertdialog" aria-labelledby="placement-mark-q" aria-describedby="placement-mark-what">
              <p id="placement-mark-q" className="font-medium">
                Mark {count(toMark.length, "earlier lesson")} finished?
              </p>
              <p id="placement-mark-what" className="mt-1 text-sm text-muted">
                Their words join the vocabulary deck, their example lines join cloze and spoken ↔ written practice, and the verb
                tenses they teach open in the verb trainer{opensLetters ? "; every letter group opens in the letter trainer" : ""}.
                You can still open any lesson, and undo each one with “Mark as not finished”.
              </p>
              <div className="mt-3 flex gap-2">
                <button type="button" className="btn" onClick={mark}>
                  Mark them finished
                </button>
                <button type="button" className="btn btn-quiet" onClick={() => setAsking(false)}>
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <>
              <p className="text-sm text-muted">
                {p.slips.length ? "The lessons worth a look stay unfinished. " : ""}Marking the earlier lessons finished opens their
                cards in the practice decks.
              </p>
              <button type="button" className="btn btn-quiet mt-2" onClick={() => setAsking(true)}>
                Mark {count(toMark.length, "earlier lesson")} finished
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}

/** One typed answer in transliteration or English (Persian uses FaAnswerField). */
function LatinField({
  q,
  value,
  onChange,
  onSubmit,
  onNext,
  answered,
  ok,
  inputRef,
}: {
  q: QuizQuestion;
  value: string;
  onChange: (v: string) => void;
  onSubmit: () => void;
  onNext: () => void;
  answered: boolean;
  ok?: boolean;
  inputRef: React.RefObject<HTMLInputElement | null>;
}) {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (answered) onNext();
        else onSubmit();
      }}
      noValidate
      className="mt-4"
    >
      <label htmlFor="placement-input" className="sr-only">
        Your answer
      </label>
      <div className="flex gap-2">
        <input
          id="placement-input"
          ref={inputRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          readOnly={answered}
          dir="ltr"
          lang={q.lang === "translit" ? "fa-Latn" : "en"}
          className="quiz-input"
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck={false}
          aria-invalid={answered ? !ok : undefined}
          aria-describedby="placement-feedback"
        />
        {!answered ? (
          <button key="check" type="submit" className="ui btn">
            Check
          </button>
        ) : (
          <button key="next" type="button" className="ui btn" onClick={onNext} autoFocus>
            Next
          </button>
        )}
      </div>
    </form>
  );
}

export interface PlacementQuestionInfo {
  q: QuizQuestion;
  lesson: string;
}

/** The placement check: a question at a time, then where to start. */
export function PlacementCheck({
  bands,
  questions,
  lessons,
}: {
  bands: PlacementBand[];
  /** By question id (lib/placement.ts refId). */
  questions: Record<string, PlacementQuestionInfo>;
  lessons: PlacementLessonInfo[];
}) {
  const data = useStore(placementStore);
  // null: follow the store (the last result, or the intro).
  const [mode, setMode] = useState<"asking" | "done" | null>(null);
  const [answers, setAnswers] = useState<PlacementAnswers>({});
  const [input, setInput] = useState("");
  const [verdict, setVerdict] = useState<(Verdict & { skipped?: boolean }) | null>(null);
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement | null>(null);
  // When this check settled (the store keeps it too).
  const [settledAt, setSettledAt] = useState(0);

  const total = placementQuestions(bands).length;
  // The question on screen: the one just answered keeps its place until Next.
  const [current, setCurrent] = useState<{ band: PlacementBand; ref: PlacementRef } | null>(null);
  const asked = Object.keys(answers).length;

  const begin = () => {
    setAnswers({});
    setInput("");
    setVerdict(null);
    setError("");
    setCurrent(nextQuestion(bands, {}));
    setMode("asking");
  };

  const answer = (ok: boolean, v: Verdict & { skipped?: boolean }) => {
    if (!current) return;
    const next = { ...answers, [refId(current.ref)]: ok };
    setAnswers(next);
    setVerdict(v);
    // Settled: save the result now, so leaving on this screen keeps it.
    if (!nextQuestion(bands, next)) {
      const at = Date.now();
      setSettledAt(at);
      placementStore.set({ last: { at, answers: next } });
    }
  };

  const submit = () => {
    if (!current || verdict) return;
    if (!input.trim()) {
      setError("Type an answer first, or choose “I don’t know”.");
      return;
    }
    const q = questions[refId(current.ref)].q;
    const v = checkAnswer(q.lang, input, q.answers);
    answer(v.ok, v);
  };

  const next = () => {
    const n = nextQuestion(bands, answers);
    setInput("");
    setVerdict(null);
    setError("");
    if (n) {
      setCurrent(n);
      inputRef.current?.focus();
    } else setMode("done");
  };

  const view = mode ?? (data.last ? "done" : null);

  if (view === "done") {
    // Saved when the check settled; the local answers only if storage is unavailable.
    const last = data.last ?? { at: settledAt, answers };
    return <Result bands={bands} answers={last.answers} at={last.at} lessons={lessons} onAgain={begin} />;
  }

  if (view !== "asking" || !current) {
    return (
      <div className="ui panel trainer-card">
        <p className="font-medium">Up to {total} questions, taken from the lesson quizzes: two for each unit.</p>
        <p className="mt-1 text-muted">
          Most answers are typed in Persian script (there is an on-screen keyboard). The check stops as soon as it knows where you
          should start. Nothing is scheduled, and a missed question doesn’t go to your mistake notebook.
        </p>
        <p className="mt-2 text-muted">
          New to the Persian script? You don’t need the check:{" "}
          <Link href="/" className="underline underline-offset-4">
            start at the beginning of the path
          </Link>
          .
        </p>
        <button type="button" className="btn mt-4" onClick={begin}>
          Start the check
        </button>
      </div>
    );
  }

  const info = questions[refId(current.ref)];
  const q = info.q;
  const lesson = lessons.find((l) => l.key === info.lesson);
  const fieldProps = {
    value: input,
    onChange: (v: string) => {
      setInput(v);
      setError("");
    },
    onSubmit: submit,
    onNext: next,
    answered: !!verdict,
    ok: verdict?.ok,
    inputRef,
  };

  return (
    <div className="drill">
      <div className="ui drill-status">
        <span aria-live="polite">
          Question {asked + (verdict ? 0 : 1)} of up to {total} · {current.band.title}
        </span>
      </div>
      <div className="panel trainer-card">
        <div className={hasFa(q.prompt) ? "drill-prompt has-fa text-lg" : "drill-prompt text-lg"}>
          <Rich text={q.prompt} translit={q.lang !== "translit"} force="all" />
        </div>
        {q.lang === "fa" ? (
          <FaAnswerField id="placement-input" describedBy="placement-feedback" {...fieldProps} />
        ) : (
          <LatinField q={q} {...fieldProps} />
        )}
        {!verdict && (
          <button
            type="button"
            className="ui mt-3 text-sm underline underline-offset-4"
            onClick={() => {
              answer(false, { ok: false, skipped: true });
              // This button goes away: keep the focus in the field, where Enter goes on.
              requestAnimationFrame(() => inputRef.current?.focus());
            }}
          >
            I don’t know
          </button>
        )}
        <div id="placement-feedback" role="status" className="ui mt-3">
          {error && <p className="text-sm text-[var(--err)]">{error}</p>}
          {verdict && (
            <Feedback
              verdict={verdict}
              title={verdict.skipped ? "Here is the answer." : undefined}
              after={
                <>
                  <p className="has-fa font-serif">
                    <Rich text={q.explain} />
                  </p>
                  {lesson && <p className="text-sm text-muted">From lesson {lesson.number}.</p>}
                </>
              }
            >
              {!verdict.ok && (q.lang === "fa" ? <FaText text={q.answers[0]} translit="none" /> : <strong>{q.answers[0]}</strong>)}
            </Feedback>
          )}
          {verdict && !nextQuestion(bands, answers) && <p className="mt-2 text-sm">That’s the last one: Next shows where to start.</p>}
        </div>
      </div>
    </div>
  );
}
