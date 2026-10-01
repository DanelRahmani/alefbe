"use client";

import Link from "next/link";
import { Fragment, useEffect, useRef, useState } from "react";
import { checkCloze, clozeAsk, clozeCandidates, clozeStats, gapCount, pruneDeck, type ClozeAsk, type ClozeCard, type ClozePart } from "@/lib/cloze";
import type { Verdict } from "@/lib/answers";
import { answer, nextCard, practiceCard } from "@/lib/srs";
import { useStore } from "@/lib/storage";
import { clozeStore, logActivity, noteResult, progressStore } from "@/lib/stores";
import { formatWait, useMinuteClock } from "../drill/useDrillClock";
import { parseMarkup } from "@/lib/markup";
import { FaText } from "../FaText";
import { Rich } from "../Rich";
import { FaAnswerField } from "../practice/FaAnswerField";

const plain = (text: string) => [{ kind: "text" as const, text, hl: false, bold: false, it: false }];

/**
 * The line in pieces that wrap only at spaces: a gap and the punctuation
 * touching it (؟ . « ») stay on one line.
 */
function lineChunks(parts: ClozePart[]): { glued: boolean; items: (string | number)[] }[] {
  // Words, spaces and gaps, in order.
  const items: (string | number)[] = parts.flatMap((p): (string | number)[] => ("gap" in p ? [p.gap] : p.text.split(/( +)/).filter(Boolean)));
  const isSpace = (x: string | number) => typeof x === "string" && /^ +$/.test(x);
  const out: { glued: boolean; items: (string | number)[] }[] = [];
  let i = 0;
  while (i < items.length) {
    // A stretch without spaces: glued if it holds a gap.
    let j = i;
    while (j < items.length && !isSpace(items[j])) j++;
    const word = items.slice(i, j);
    if (word.some((x) => typeof x === "number")) out.push({ glued: true, items: word });
    else if (word.length) push(word.join(""));
    if (j < items.length) push(items[j] as string);
    i = j + 1;
  }
  return out;

  function push(s: string) {
    const last = out[out.length - 1];
    if (last && !last.glued) last.items[0] += s;
    else out.push({ glued: false, items: [s] });
  }
}

/** The question: the line with its gaps, the English beneath, and how to answer. */
export function ClozePrompt({ card }: { card: ClozeAsk }) {
  const gaps = gapCount(card);
  const force = card.marks ? "all" : undefined;
  const hints = card.gaps.flatMap((g, i) => (g.tense ? [gaps > 1 ? `gap ${i + 1}: ${g.tense}` : `the verb: ${g.tense}`] : []));
  return (
    <div className="drill-prompt">
      {card.before && (
        <div className="cloze-before">
          <p className="ui text-xs text-muted">The line before</p>
          <p className="has-fa">
            <FaText tokens={parseMarkup(card.before.fa).map((t) => ({ ...t, hl: false }))} translit="none" force={force} />
          </p>
          <p className="text-sm text-muted has-fa">
            <Rich text={card.before.en} translit={false} />
          </p>
        </div>
      )}
      {card.written && <p className="ui register-tag">Spoken</p>}
      <p className="cloze-line" dir="rtl" lang="fa">
        {lineChunks(card.parts).map((chunk, i) => {
          const pieces = chunk.items.map((x, j) =>
            typeof x === "string" ? (
              <FaText key={j} tokens={plain(x)} translit="none" force={force} />
            ) : (
              <span key={j} className="cloze-gap">
                {gaps > 1 && <span aria-hidden="true">{x + 1}</span>}
                <span className="sr-only" lang="en">
                  {gaps > 1 ? `gap ${x + 1}` : "gap"}
                </span>
              </span>
            ),
          );
          return chunk.glued ? (
            <span key={i} className="whitespace-nowrap">
              {pieces}
            </span>
          ) : (
            <Fragment key={i}>{pieces}</Fragment>
          );
        })}
      </p>
      <p className="cloze-en has-fa">
        <Rich text={card.en} translit={false} />
      </p>
      {hints.length > 0 && <p className="ui drill-sub">{hints.join(" · ")}</p>}
      <p className="ui drill-sub">
        {gaps > 1 ? `type the words of all ${gaps} gaps, in order, a space between` : "type the missing words"}
      </p>
    </div>
  );
}

/** The answer: the whole line in both forms, with the highlight, marks and transliteration. */
export function ClozeSolution({ card }: { card: ClozeAsk }) {
  return (
    <span className="verb-solution has-fa">
      <span>
        {card.written ? "Spoken: " : ""}
        <FaText text={card.fa} translit="inline" alwaysTranslit force="all" className="text-xl" />
      </span>
      {card.written && (
        <span>
          Written: <FaText text={card.written} translit="inline" alwaysTranslit force="all" className="text-xl" />
        </span>
      )}
      <span className="text-sm">
        From{" "}
        <Link href={card.lesson.href} className="underline underline-offset-4">
          lesson {card.lesson.number}
        </Link>
        .
      </span>
    </span>
  );
}

/** The next card, read fresh from the store: due or new, or any card when practising. */
function pickCard(cards: readonly ClozeCard[], practising: boolean, last?: string): string | null {
  const met = clozeCandidates(cards, progressStore.get());
  // Practising with no lesson done yet: every line of the course.
  const pool = practising && !met.length ? cards.map((c) => c.id) : met;
  return practising ? practiceCard(pool, last, Math.random()) : nextCard(pool, clozeStore.get().deck, Date.now(), last);
}

function recordAnswer(id: string, ok: boolean) {
  const s = clozeStore.get();
  clozeStore.set({ ...s, deck: answer([], s.deck, id, ok, Date.now()).state });
}

export function ClozeTrainer({ cards }: { cards: ClozeCard[] }) {
  const data = useStore(clozeStore);
  const progress = useStore(progressStore);
  const now = useMinuteClock();

  const [started, setStarted] = useState(false);
  const [id, setId] = useState<string | null>(null);
  const [practice, setPractice] = useState(false);
  const [input, setInput] = useState("");
  const [verdict, setVerdict] = useState<Verdict | null>(null);
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  // Lines rewritten or removed since the last visit leave the deck.
  useEffect(() => {
    const ids = new Set(cards.map((c) => c.id));
    const s = clozeStore.get();
    const deck = pruneDeck(s.deck, ids);
    if (deck !== s.deck) clozeStore.set({ ...s, deck });
  }, [cards]);

  const card = id ? cards.find((c) => c.id === id) : undefined;
  const met = clozeCandidates(cards, progress).length;
  const stats = clozeStats(cards, data, progress, now);

  const show = (next: string | null) => {
    setId(next);
    setInput("");
    setVerdict(null);
    setError("");
    requestAnimationFrame(() => inputRef.current?.focus());
  };
  const start = (practising: boolean) => {
    setStarted(true);
    setPractice(practising);
    show(pickCard(cards, practising));
  };
  const next = () => show(pickCard(cards, practice, id ?? undefined));

  const submit = () => {
    if (!card) return;
    if (!input.trim()) {
      setError("Type an answer first.");
      return;
    }
    const v = checkCloze(card, input);
    setVerdict(v);
    logActivity({ kind: "drill" });
    noteResult({ kind: "cloze", ...clozeAsk(card) }, v.ok);
    if (!practice) recordAnswer(card.id, v.ok);
  };

  return (
    <div className="drill">
      <div className="ui drill-status">
        <span aria-live="polite">
          {met} of {cards.length} lines met · {stats.due} due · {stats.fresh} new
        </span>
        {practice && <span className="practice-pill">Practice: not scheduled</span>}
      </div>

      {!started ? (
        <div className="ui drill-panel">
          {met ? (
            <>
              <p className="font-medium">Read the English; fill the gap in the Persian.</p>
              <p className="mt-1 text-muted">
                {stats.due
                  ? `${stats.due} line${stats.due === 1 ? "" : "s"} to review.`
                  : stats.fresh
                    ? `${stats.fresh} new line${stats.fresh === 1 ? "" : "s"} waiting.`
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
              <p className="font-medium">No lines yet.</p>
              <p className="mt-1 text-muted">
                A lesson&apos;s example lines join this deck when you mark the lesson done. Until then you can practise every line of
                the course; nothing is scheduled.
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
          <p className="mt-1 text-muted">{stats.nextDue ? `Next review in ${formatWait(stats.nextDue - now)}.` : "Nothing is scheduled yet."}</p>
          <button type="button" className="drill-btn mt-4" onClick={() => start(true)}>
            Practise anyway
          </button>
        </div>
      ) : (
        <div className="drill-card">
          <ClozePrompt card={card} />
          <FaAnswerField
            id="cloze-input"
            value={input}
            onChange={(v) => {
              setInput(v);
              setError("");
            }}
            onSubmit={submit}
            onNext={next}
            answered={!!verdict}
            ok={verdict?.ok}
            inputRef={inputRef}
            describedBy="cloze-feedback"
          />
          <div id="cloze-feedback" role="status" className="ui mt-3">
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
                <ClozeSolution card={card} />
              </div>
            )}
          </div>

          {practice && met > 0 && (
            <button
              type="button"
              className="ui mt-4 text-sm underline underline-offset-4"
              onClick={() => {
                setPractice(false);
                show(pickCard(cards, false));
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
