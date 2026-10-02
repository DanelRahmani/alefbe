"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import type { Verdict } from "@/lib/answers";
import { checkCloze, type ClozeAsk } from "@/lib/cloze";
import { checkConvert, type ConvertAsk, type ConvertDir } from "@/lib/convert";
import { checkDrill, modeInfo } from "@/lib/drill";
import { CLEAR_AFTER, mistakeId, type MistakeItem } from "@/lib/mistakes";
import { FORMS, type Form } from "@/lib/persian/letters";
import { reviewCounts, reviewKey, reviewQueue, type ReviewItem, type ReviewKnown } from "@/lib/review";
import { useStore } from "@/lib/storage";
import { clozeStore, convertStore, logActivity, mistakesStore, noteResult, srsStore, verbsStore, vocabStore } from "@/lib/stores";
import { askFor, checkVerb } from "@/lib/verb-drill";
import { checkVocab, type VocabAsk, type VocabVerdict } from "@/lib/vocab";
import { ClozePrompt, ClozeSolution, recordClozeAnswer } from "../cloze/ClozeTrainer";
import { ConvertPrompt, ConvertSolution, recordConvertAnswer } from "../convert/ConvertTrainer";
import { DrillPrompt, DrillSolution, recordDrillAnswer } from "../drill/Drill";
import { useMinuteClock } from "../drill/useDrillClock";
import { cardOf, type LessonQuiz } from "../MistakeNotebook";
import { FaAnswerField } from "../practice/FaAnswerField";
import { VerbPrompt, VerbSolution, recordVerbAnswer } from "../verbs/VerbTrainer";
import { Feedback } from "../practice/Feedback";
import { VocabPrompt, VocabSolution, recordVocabAnswer } from "../vocab/VocabTrainer";

/** A vocabulary card as the queue asks it. */
export type ReviewVocab = VocabAsk & { translit: string };

/** One queue item, ready to ask with its own deck's prompt and checker. */
interface Question {
  key: string;
  prompt: React.ReactNode;
  lang: "fa" | "translit" | "en";
  check: (input: string) => VocabVerdict;
  solution: React.ReactNode;
  from: { label: string; href: string };
  /** Record the answer where its deck keeps it; returns a banner when a group opened. */
  record: (ok: boolean) => string | null;
  /** A notebook item: shown how far it is from clearing. */
  notebook?: MistakeItem;
}

const randomForm = (): Form => FORMS[Math.floor(Math.random() * FORMS.length)];

/** A deck answer: counted for the daily goal, noted in the notebook, scheduled in the deck. */
const deckAnswer = (item: MistakeItem, schedule: (ok: boolean) => string | null | void) => (ok: boolean) => {
  logActivity({ kind: "drill" });
  noteResult(item, ok);
  return schedule(ok) ?? null;
};

const COUNT_LABELS: [keyof ReturnType<typeof reviewCounts>, string, string][] = [
  ["drill", "letter or word", "letters and words"],
  ["verb", "verb", "verbs"],
  ["vocab", "vocabulary card", "vocabulary cards"],
  ["cloze", "cloze line", "cloze lines"],
  ["convert", "spoken ↔ written line", "spoken ↔ written lines"],
  ["mistake", "notebook item", "notebook items"],
];

export function ReviewQueue({
  lessons,
  vocab,
  cloze,
  convert,
}: {
  lessons: Record<string, LessonQuiz>;
  vocab: ReviewVocab[];
  cloze: ClozeAsk[];
  convert: (ConvertAsk & { only?: ConvertDir })[];
}) {
  const now = useMinuteClock();
  const srs = useStore(srsStore);
  const verbs = useStore(verbsStore);
  const vocabData = useStore(vocabStore);
  const clozeData = useStore(clozeStore);
  const convertData = useStore(convertStore);
  const notebook = useStore(mistakesStore);

  const known = useMemo<ReviewKnown>(
    () => ({
      vocab: new Set(vocab.map((c) => c.id)),
      cloze: new Set(cloze.map((c) => c.id)),
      convert: {
        "to-written": new Set(convert.filter((c) => c.only !== "to-spoken").map((c) => c.id)),
        "to-spoken": new Set(convert.filter((c) => c.only !== "to-written").map((c) => c.id)),
      },
    }),
    [vocab, cloze, convert],
  );
  const byId = useMemo(
    () => ({
      vocab: new Map(vocab.map((c) => [c.id, c])),
      cloze: new Map(cloze.map((c) => [c.id, c])),
      convert: new Map(convert.map((c) => [c.id, c])),
    }),
    [vocab, cloze, convert],
  );

  const [questions, setQuestions] = useState<Question[] | null>(null);
  const decks = { srs: srs.decks, verbs, vocab: vocabData, cloze: clozeData, convert: convertData, notebook };
  const queue = now ? reviewQueue(decks, known, now) : [];

  /** Turn a queue item into a question; null if its card has gone. Uses randomness: call from events only. */
  const ask = (item: ReviewItem): Question | null => {
    const key = reviewKey(item);
    switch (item.kind) {
      case "drill": {
        const { mode, id } = item;
        const info = modeInfo(mode);
        return {
          key,
          prompt: <DrillPrompt mode={mode} id={id} form={randomForm()} />,
          lang: info.answer === "fa" ? "fa" : "translit",
          check: (s) => checkDrill(mode, id, s),
          solution: <DrillSolution mode={mode} id={id} />,
          from: { label: `Trainer: ${info.title}`, href: `/practice/drill/${mode}` },
          record: deckAnswer({ kind: "drill", mode, id }, (ok) => recordDrillAnswer(mode, id, ok)),
        };
      }
      case "verb": {
        const q = askFor(item.id, verbsStore.get().ask, Math.random);
        if (!q) return null;
        return {
          key,
          prompt: <VerbPrompt q={q} />,
          lang: "fa",
          check: (s) => checkVerb(q, s),
          solution: <VerbSolution q={q} />,
          from: { label: "Verb trainer", href: "/verbs" },
          record: deckAnswer({ kind: "verb", verb: q.verb.id, ...q.spec }, (ok) => recordVerbAnswer(item.tense, item.id, ok)),
        };
      }
      case "vocab": {
        const card = byId.vocab.get(item.id);
        if (!card) return null;
        return {
          key,
          prompt: <VocabPrompt card={card} sound={vocabStore.get().sound} />,
          lang: "fa",
          check: (s) => checkVocab(card, vocab, s),
          solution: <VocabSolution card={card} />,
          from: { label: "Vocabulary deck", href: "/vocab" },
          record: deckAnswer({ kind: "vocab", id: card.id, fa: card.fa, spoken: card.spoken, en: card.en, hint: card.hint }, (ok) =>
            recordVocabAnswer(card.id, ok),
          ),
        };
      }
      case "cloze": {
        const card = byId.cloze.get(item.id);
        if (!card) return null;
        return {
          key,
          prompt: <ClozePrompt card={card} />,
          lang: "fa",
          check: (s) => checkCloze(card, s),
          solution: <ClozeSolution card={card} />,
          from: { label: "Cloze practice", href: "/practice/cloze" },
          record: deckAnswer({ kind: "cloze", ...card }, (ok) => recordClozeAnswer(card.id, ok)),
        };
      }
      case "convert": {
        const card = byId.convert.get(item.id);
        if (!card) return null;
        const { dir } = item;
        return {
          key,
          prompt: <ConvertPrompt card={card} dir={dir} />,
          lang: "fa",
          check: (s) => checkConvert(card, dir, s),
          solution: <ConvertSolution card={card} />,
          from: { label: "Spoken and written", href: "/practice/convert" },
          record: deckAnswer({ kind: "convert", dir, ...card }, (ok) => recordConvertAnswer(dir, card.id, ok)),
        };
      }
      case "mistake": {
        const c = cardOf(item.mistake, lessons);
        if (!c) return null;
        return {
          key,
          prompt: c.item.kind === "lesson" ? <div className="drill-prompt has-fa text-lg">{c.prompt}</div> : c.prompt,
          lang: c.lang,
          check: c.check,
          solution: c.solution,
          from: c.from,
          // As in the notebook: the answer counts toward clearing the item.
          record: (ok) => {
            noteResult(c.item, ok);
            return null;
          },
          notebook: c.item,
        };
      }
    }
  };

  // The queue as shown on the start panel (the minute clock), so the session holds what it promised.
  const start = () => setQuestions(queue.map(ask).filter((q): q is Question => q !== null));

  if (questions) return <Session questions={questions} onEnd={() => setQuestions(null)} />;

  const counts = reviewCounts(queue);
  const parts = COUNT_LABELS.filter(([k]) => counts[k]).map(([k, one, many]) => `${counts[k]} ${counts[k] === 1 ? one : many}`);

  return (
    <div className="ui panel trainer-card">
      {!now ? (
        <p className="text-muted">Looking for reviews…</p>
      ) : queue.length ? (
        <>
          <p className="font-medium">
            {queue.length} to review: {parts.join(", ")}.
          </p>
          <p className="mt-1 text-muted">
            Cards due in every deck, earliest first, then the mistake notebook. Each answer is scheduled in its own deck, as if you
            had answered it there.
          </p>
          <button type="button" className="btn mt-4" onClick={start}>
            Start
          </button>
        </>
      ) : (
        <>
          <p className="font-medium">All caught up.</p>
          <p className="mt-1 text-muted">
            Nothing is due in any deck, and the mistake notebook is empty. Cards come back here when their review is due; to learn new
            ones, open a trainer.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <Link href="/practice" className="btn">
              Practise anyway
            </Link>
          </div>
        </>
      )}
    </div>
  );
}

function Session({ questions, onEnd }: { questions: Question[]; onEnd: () => void }) {
  const nb = useStore(mistakesStore);
  const [at, setAt] = useState(0);
  const [input, setInput] = useState("");
  const [verdict, setVerdict] = useState<Verdict | null>(null);
  const [error, setError] = useState("");
  const [banner, setBanner] = useState("");
  const [results, setResults] = useState<boolean[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const q = questions[at];
  const right = results.filter(Boolean).length;

  // Each question opens with the answer field focused.
  useEffect(() => inputRef.current?.focus(), [at]);

  if (!q) {
    return (
      <div className="ui panel trainer-card" role="status">
        <p className="text-lg font-medium">
          {right} of {results.length} right.
        </p>
        <p className="mt-1">Every answer was scheduled in its own deck. Misses are in the mistake notebook.</p>
        <button type="button" className="btn mt-4" onClick={onEnd} autoFocus>
          Back to the review
        </button>
      </div>
    );
  }

  const next = () => {
    setAt(at + 1);
    setInput("");
    setVerdict(null);
    setError("");
  };
  const submit = () => {
    if (!input.trim()) {
      setError("Type an answer first.");
      return;
    }
    const v = q.check(input);
    // Another word with the same English (vocabulary): not a miss. Say so, and let the learner try again.
    if (v.again) {
      setError(v.hint ?? "");
      setInput("");
      return;
    }
    setVerdict(v);
    setResults((r) => [...r, v.ok]);
    const opened = q.record(v.ok);
    if (opened) setBanner(opened);
  };
  const change = (v: string) => {
    setInput(v);
    setError("");
  };
  const standing = q.notebook ? nb[mistakeId(q.notebook)] : undefined;
  const fa = q.lang === "fa";

  return (
    <div className="drill">
      <div className="ui session-head">
        <span>
          {at + 1} of {questions.length} · {right} right
        </span>
        <div className="session-bar" aria-hidden="true">
          <span style={{ width: `${(100 * at) / questions.length}%` }} />
        </div>
        <button type="button" className="text-sm underline underline-offset-4" onClick={onEnd}>
          End
        </button>
      </div>
      <p role="status" className="ui drill-banner has-fa" hidden={!banner}>
        {banner}
      </p>
      <div className="panel trainer-card" key={q.key}>
        {q.prompt}
        <p className="ui mt-1 text-center text-xs text-muted">
          From{" "}
          <Link href={q.from.href} className="underline underline-offset-4">
            {q.from.label}
          </Link>
        </p>
        {fa ? (
          <FaAnswerField
            id="review-input"
            value={input}
            onChange={change}
            onSubmit={submit}
            onNext={next}
            answered={!!verdict}
            ok={verdict?.ok}
            inputRef={inputRef}
            describedBy="review-feedback"
          />
        ) : (
          <form
            className="mt-4"
            noValidate
            onSubmit={(e) => {
              e.preventDefault();
              if (verdict) next();
              else submit();
            }}
          >
            <label htmlFor="review-input" className="sr-only">
              Your answer
            </label>
            <div className="flex gap-2">
              <input
                id="review-input"
                ref={inputRef}
                autoFocus
                value={input}
                onChange={(e) => change(e.target.value)}
                readOnly={!!verdict}
                lang={q.lang === "translit" ? "fa-Latn" : "en"}
                className="quiz-input"
                autoComplete="off"
                autoCorrect="off"
                autoCapitalize="off"
                spellCheck={false}
                aria-invalid={verdict ? !verdict.ok : undefined}
                aria-describedby="review-feedback"
              />
              {!verdict ? (
                <button key="check" type="submit" className="ui btn">
                  Check
                </button>
              ) : (
                <button key="next" type="button" className="ui btn" onClick={next} autoFocus>
                  Next
                </button>
              )}
            </div>
          </form>
        )}
        <div id="review-feedback" role="status" className="ui mt-3">
          {error && <p className="text-sm text-[var(--err)]">{error}</p>}
          {verdict && (
            <Feedback
              verdict={verdict}
              typed={input}
              typedFa={fa}
              after={
                q.notebook && (
                  <p className="text-sm">
                    {!standing
                      ? "Cleared from the notebook."
                      : verdict.ok
                        ? `${standing.streak} of ${CLEAR_AFTER} right in a row.`
                        : "It stays in the notebook."}
                  </p>
                )
              }
            >
              {q.solution}
            </Feedback>
          )}
        </div>
      </div>
    </div>
  );
}
