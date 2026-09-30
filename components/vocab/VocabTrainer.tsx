"use client";

import Link from "next/link";
import { useLayoutEffect, useRef, useState } from "react";
import { answer, nextCard, practiceCard } from "@/lib/srs";
import { useStore } from "@/lib/storage";
import { drillUiStore, logActivity, noteResult, progressStore, vocabStore } from "@/lib/stores";
import { checkVocab, vocabCandidates, vocabStats, type VocabAsk, type VocabCard, type VocabData, type VocabVerdict } from "@/lib/vocab";
import { PersianKeyboard } from "../drill/PersianKeyboard";
import { formatWait, useMinuteClock } from "../drill/useDrillClock";
import { FaText } from "../FaText";
import { Rich } from "../Rich";

/** The question: the English, the hint that tells same-gloss words apart, and the sound if asked for. */
export function VocabPrompt({ card, sound }: { card: VocabAsk & { translit?: string }; sound?: boolean }) {
  return (
    <div className="drill-prompt">
      <p className="drill-name">{card.en}</p>
      {card.hint && <p className="ui drill-sub">{card.hint}</p>}
      {sound && card.translit && (
        <p className="ui drill-sub">
          sounds like <em>{card.translit}</em>
        </p>
      )}
      <p className="ui drill-sub">type it in Persian script, spoken or written</p>
    </div>
  );
}

/** The answer: the written form, and the spoken one where it differs, marked and transliterated. */
export function VocabSolution({ card, lesson }: { card: VocabAsk; lesson?: { number: string; href: string } }) {
  return (
    <span className="verb-solution has-fa">
      <span>
        {card.spoken ? "Written: " : ""}
        <FaText text={card.fa} translit="inline" alwaysTranslit force="all" className="text-xl" />
      </span>
      {card.spoken && (
        <span>
          Spoken: <FaText text={card.spoken} translit="inline" alwaysTranslit force="all" className="text-xl" />
        </span>
      )}
      {lesson && (
        <span className="text-sm">
          From{" "}
          <Link href={lesson.href} className="underline underline-offset-4">
            lesson {lesson.number}
          </Link>
          .
        </span>
      )}
    </span>
  );
}

/** The next card, read fresh from the store: due or new, or any card when practising. */
function pickCard(cards: readonly VocabCard[], practising: boolean, last?: string): string | null {
  const s = vocabStore.get();
  const met = vocabCandidates(cards, progressStore.get());
  // Practising with no lesson done yet: every word of the course.
  const pool = practising && !met.length ? cards.map((c) => c.id) : met;
  return practising ? practiceCard(pool, last, Math.random()) : nextCard(pool, s.deck, Date.now(), last);
}

/** Schedule an answer in the deck. */
function recordAnswer(id: string, ok: boolean) {
  const s = vocabStore.get();
  vocabStore.set({ ...s, deck: answer([], s.deck, id, ok, Date.now()).state });
}

export function VocabTrainer({ cards }: { cards: VocabCard[] }) {
  const data = useStore(vocabStore);
  const ui = useStore(drillUiStore);
  const progress = useStore(progressStore);
  const now = useMinuteClock();

  const [started, setStarted] = useState(false);
  const [id, setId] = useState<string | null>(null);
  const [practice, setPractice] = useState(false);
  const [input, setInput] = useState("");
  const [verdict, setVerdict] = useState<VocabVerdict | null>(null);
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const caret = useRef<number | null>(null);

  useLayoutEffect(() => {
    if (caret.current !== null && inputRef.current) {
      inputRef.current.setSelectionRange(caret.current, caret.current);
      caret.current = null;
    }
  }, [input]);

  const byId = new Map(cards.map((c) => [c.id, c]));
  const card = id ? byId.get(id) : undefined;
  const met = vocabCandidates(cards, progress).length;
  const stats = vocabStats(cards, data, progress, now);

  const show = (next: string | null) => {
    setId(next);
    setInput("");
    setVerdict(null);
    setError("");
    requestAnimationFrame(() => inputRef.current?.focus());
  };
  const pick = (practising: boolean, last?: string) => pickCard(cards, practising, last);

  const start = (practising: boolean) => {
    setStarted(true);
    setPractice(practising);
    show(pick(practising));
  };
  const next = () => show(pick(practice, id ?? undefined));

  const submit = () => {
    if (!card) return;
    if (!input.trim()) {
      setError("Type an answer first.");
      return;
    }
    const v = checkVocab(card, cards, input);
    // Another word with the same English: not a miss. Say so, and let the learner try again.
    if (v.again) {
      setError(v.hint ?? "");
      setInput("");
      return;
    }
    setVerdict(v);
    logActivity({ kind: "drill" });
    noteResult({ kind: "vocab", id: card.id, fa: card.fa, spoken: card.spoken, en: card.en, hint: card.hint }, v.ok);
    if (!practice) recordAnswer(card.id, v.ok);
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key !== "Enter") return;
    e.preventDefault();
    if (verdict) next();
    else submit();
  };

  const insert = (text: string) => {
    if (verdict) return;
    const el = inputRef.current;
    const a = el?.selectionStart ?? input.length;
    const b = el?.selectionEnd ?? input.length;
    caret.current = a + text.length;
    setInput(input.slice(0, a) + text + input.slice(b));
    setError("");
  };
  const backspace = () => {
    if (verdict) return;
    const el = inputRef.current;
    const a = el?.selectionStart ?? input.length;
    const b = el?.selectionEnd ?? input.length;
    const from = a === b ? Math.max(0, a - 1) : a;
    caret.current = from;
    setInput(input.slice(0, from) + input.slice(b));
  };

  return (
    <div className="drill">
      <div className="ui drill-status">
        <span aria-live="polite">
          {met} of {cards.length} words met · {stats.due} due · {stats.fresh} new
        </span>
        {practice && <span className="practice-pill">Practice: not scheduled</span>}
      </div>

      <div className="ui chips mt-3" role="group" aria-label="Hints">
        <button type="button" className="chip" aria-pressed={data.sound} onClick={() => vocabStore.set((s: VocabData) => ({ ...s, sound: !s.sound }))}>
          Show the sound
        </button>
      </div>

      {!started ? (
        <div className="ui drill-panel">
          {met ? (
            <>
              <p className="font-medium">See the English; type the Persian word.</p>
              <p className="mt-1 text-muted">
                {stats.due
                  ? `${stats.due} word${stats.due === 1 ? "" : "s"} to review.`
                  : stats.fresh
                    ? `${stats.fresh} new word${stats.fresh === 1 ? "" : "s"} waiting.`
                    : stats.nextDue
                      ? `Nothing due right now. Next review in ${formatWait(stats.nextDue - now)}.`
                      : "Nothing due right now."}
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                <button type="button" className="drill-btn" onClick={() => start(false)}>
                  Start
                </button>
                {!stats.due && !stats.fresh && (
                  <button type="button" className="drill-btn drill-btn-quiet" onClick={() => start(true)}>
                    Practise anyway
                  </button>
                )}
              </div>
            </>
          ) : (
            <>
              <p className="font-medium">No words yet.</p>
              <p className="mt-1 text-muted">
                A lesson&apos;s words join this deck when you mark the lesson done. Until then you can practise every word of the
                course; nothing is scheduled.
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                <Link href="/" className="drill-btn">
                  Go to the lessons
                </Link>
                <button type="button" className="drill-btn drill-btn-quiet" onClick={() => start(true)}>
                  Practise anyway
                </button>
              </div>
            </>
          )}
        </div>
      ) : !card ? (
        <div className="ui drill-panel">
          <p className="font-medium">All caught up.</p>
          <p className="mt-1 text-muted">
            {stats.nextDue ? `Next review in ${formatWait(stats.nextDue - now)}.` : "Nothing is scheduled yet."}
          </p>
          <button type="button" className="drill-btn mt-4" onClick={() => start(true)}>
            Practise anyway
          </button>
        </div>
      ) : (
        <div className="drill-card">
          <VocabPrompt card={card} sound={data.sound} />
          <form
            onSubmit={(e) => {
              e.preventDefault();
              submit();
            }}
            noValidate
            className="mt-4"
          >
            <label htmlFor="vocab-input" className="sr-only">
              Your answer
            </label>
            <div className="flex gap-2">
              <input
                id="vocab-input"
                ref={inputRef}
                value={input}
                onChange={(e) => {
                  setInput(e.target.value);
                  setError("");
                }}
                onKeyDown={onKeyDown}
                readOnly={!!verdict}
                dir="rtl"
                lang="fa"
                inputMode={ui.keyboard ? "none" : "text"}
                className="quiz-input fa"
                autoComplete="off"
                autoCorrect="off"
                autoCapitalize="off"
                spellCheck={false}
                aria-invalid={verdict ? !verdict.ok : undefined}
                aria-describedby="vocab-feedback"
              />
              {!verdict ? (
                <button type="submit" className="ui quiz-check">
                  Check
                </button>
              ) : (
                <button type="button" className="ui quiz-check" onClick={next} autoFocus>
                  Next
                </button>
              )}
            </div>
          </form>

          <div className="mt-3">
            <button
              type="button"
              className="ui text-sm text-muted underline underline-offset-4"
              onClick={() => drillUiStore.set((u) => ({ ...u, keyboard: !u.keyboard }))}
              aria-expanded={ui.keyboard}
            >
              {ui.keyboard ? "Hide the Persian keyboard" : "Show the Persian keyboard"}
            </button>
            {ui.keyboard && <PersianKeyboard onInsert={insert} onBackspace={backspace} />}
          </div>

          <div id="vocab-feedback" role="status" className="ui mt-3">
            {error && <p className="text-sm text-[var(--err)]">{error}</p>}
            {verdict && (
              <div className={`quiz-fb ${verdict.ok ? "quiz-ok" : "quiz-no"}`}>
                <p className="font-medium">{verdict.ok ? "Correct." : "Not quite."}</p>
                {verdict.note && <Rich text={verdict.note} translit={false} />}
                {verdict.hint && <Rich text={verdict.hint} translit={false} />}
                {!verdict.ok && (
                  <p>
                    You typed: <span className="fa">{input}</span>
                  </p>
                )}
                <VocabSolution card={card} lesson={card.lesson} />
              </div>
            )}
          </div>

          {practice && met > 0 && (
            <button
              type="button"
              className="ui mt-4 text-sm underline underline-offset-4"
              onClick={() => {
                setPractice(false);
                show(pick(false));
              }}
            >
              Back to scheduled review
            </button>
          )}
        </div>
      )}
    </div>
  );
}
