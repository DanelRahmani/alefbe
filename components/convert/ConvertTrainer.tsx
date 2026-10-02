"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import type { Verdict } from "@/lib/answers";
import { pruneDeck } from "@/lib/cloze";
import {
  CONVERT_DIRS,
  checkConvert,
  convertAsk,
  convertCandidates,
  convertCards,
  convertStats,
  sides,
  type ConvertAsk,
  type ConvertCard,
  type ConvertDir,
} from "@/lib/convert";
import { parseMarkup } from "@/lib/markup";
import { answer, nextCard, practiceCard } from "@/lib/srs";
import { useStore } from "@/lib/storage";
import { convertStore, logActivity, noteResult, progressStore } from "@/lib/stores";
import { formatWait, useMinuteClock } from "../drill/useDrillClock";
import { FaText } from "../FaText";
import { Rich } from "../Rich";
import { Feedback } from "../practice/Feedback";
import { FaAnswerField } from "../practice/FaAnswerField";

/** The question: one form of the line, its English, and which form to type. */
export function ConvertPrompt({ card, dir }: { card: ConvertAsk; dir: ConvertDir }) {
  const { shown, to, from } = sides(card, dir);
  return (
    <div className="drill-prompt">
      <p className="ui register-tag">{from}</p>
      <p className="cloze-line">
        <FaText tokens={parseMarkup(shown).map((t) => ({ ...t, hl: false }))} translit="none" force={card.marks ? "all" : undefined} />
      </p>
      <p className="cloze-en has-fa">
        <Rich text={card.en} translit={false} />
      </p>
      <p className="ui drill-sub">type the whole line in its {to} form</p>
    </div>
  );
}

/** The answer: both lines, marked and transliterated. */
export function ConvertSolution({ card }: { card: ConvertAsk }) {
  return (
    <span className="verb-solution has-fa">
      <span>
        Spoken: <FaText text={card.fa} translit="inline" alwaysTranslit force="all" className="text-xl" />
      </span>
      <span>
        Written: <FaText text={card.written} translit="inline" alwaysTranslit force="all" className="text-xl" />
      </span>
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

/** The next card in a direction, read fresh from the store: due or new, or any card when practising. */
function pickCard(cards: readonly ConvertCard[], dir: ConvertDir, practising: boolean, last?: string): string | null {
  const met = convertCandidates(cards, progressStore.get(), dir);
  // Practising with no lesson done yet: every line of the course asked this way.
  const pool = practising && !met.length ? convertCards(cards, dir).map((c) => c.id) : met;
  return practising ? practiceCard(pool, last, Math.random()) : nextCard(pool, convertStore.get().decks[dir], Date.now(), last);
}

export function recordConvertAnswer(dir: ConvertDir, id: string, ok: boolean) {
  const s = convertStore.get();
  convertStore.set({ ...s, decks: { ...s.decks, [dir]: answer([], s.decks[dir], id, ok, Date.now()).state } });
}

export function ConvertTrainer({ cards }: { cards: ConvertCard[] }) {
  const data = useStore(convertStore);
  const progress = useStore(progressStore);
  const now = useMinuteClock();
  const dir = data.dir;

  const [started, setStarted] = useState(false);
  const [id, setId] = useState<string | null>(null);
  const [practice, setPractice] = useState(false);
  const [input, setInput] = useState("");
  const [verdict, setVerdict] = useState<Verdict | null>(null);
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  // Lines rewritten or removed since the last visit leave both decks.
  useEffect(() => {
    const ids = new Set(cards.map((c) => c.id));
    const s = convertStore.get();
    const decks = { "to-written": pruneDeck(s.decks["to-written"], ids), "to-spoken": pruneDeck(s.decks["to-spoken"], ids) };
    if (decks["to-written"] !== s.decks["to-written"] || decks["to-spoken"] !== s.decks["to-spoken"]) convertStore.set({ ...s, decks });
  }, [cards]);

  const card = id ? cards.find((c) => c.id === id) : undefined;
  const met = convertCandidates(cards, progress, dir).length;
  const asked = convertCards(cards, dir).length;
  const stats = convertStats(cards, data, dir, progress, now);
  const to = CONVERT_DIRS.find((d) => d.id === dir)!.to;

  const show = (next: string | null) => {
    setId(next);
    setInput("");
    setVerdict(null);
    setError("");
    requestAnimationFrame(() => inputRef.current?.focus());
  };
  const start = (practising: boolean, d: ConvertDir = dir) => {
    setStarted(true);
    setPractice(practising);
    show(pickCard(cards, d, practising));
  };
  const next = () => show(pickCard(cards, dir, practice, id ?? undefined));
  const setDir = (d: ConvertDir) => {
    convertStore.set((s) => ({ ...s, dir: d }));
    if (started) start(practice, d);
  };

  const submit = () => {
    if (!card) return;
    if (!input.trim()) {
      setError("Type an answer first.");
      return;
    }
    const v = checkConvert(card, dir, input);
    setVerdict(v);
    logActivity({ kind: "drill" });
    noteResult({ kind: "convert", dir, ...convertAsk(card) }, v.ok);
    if (!practice) recordConvertAnswer(dir, card.id, v.ok);
  };

  return (
    <div className="drill">
      <div className="ui chips" role="group" aria-label="Direction">
        {CONVERT_DIRS.map((d) => (
          <button key={d.id} type="button" className="chip" aria-pressed={dir === d.id} onClick={() => setDir(d.id)}>
            {d.label}
          </button>
        ))}
      </div>
      <div className="ui drill-status mt-3">
        <span aria-live="polite">
          {met} of {asked} lines met · {stats.due} due · {stats.fresh} new
        </span>
        {practice && <span className="practice-pill">Practice: not scheduled</span>}
      </div>

      {!started ? (
        <div className="ui panel trainer-card">
          {met ? (
            <>
              <p className="font-medium">See a line as a lesson gives it; type it in its {to} form.</p>
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
                <button type="button" className="btn" onClick={() => start(false)}>
                  Start
                </button>
                {!stats.due && !stats.fresh && (
                  <button type="button" className="btn btn-quiet" onClick={() => start(true)}>
                    Practise anyway
                  </button>
                )}
              </div>
            </>
          ) : (
            <>
              <p className="font-medium">No lines yet.</p>
              <p className="mt-1 text-muted">
                A lesson&apos;s lines join this drill when you mark the lesson done. Until then you can practise every line of the
                course; nothing is scheduled.
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                <Link href="/" className="btn">
                  Go to the lessons
                </Link>
                <button type="button" className="btn btn-quiet" onClick={() => start(true)}>
                  Practise anyway
                </button>
              </div>
            </>
          )}
        </div>
      ) : !card ? (
        <div className="ui panel trainer-card">
          <p className="font-medium">All caught up.</p>
          <p className="mt-1 text-muted">{stats.nextDue ? `Next review in ${formatWait(stats.nextDue - now)}.` : "Nothing is scheduled yet."}</p>
          <button type="button" className="btn mt-4" onClick={() => start(true)}>
            Practise anyway
          </button>
        </div>
      ) : (
        <div className="panel trainer-card">
          <ConvertPrompt card={card} dir={dir} />
          <FaAnswerField
            id="convert-input"
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
            describedBy="convert-feedback"
          />
          <div id="convert-feedback" role="status" className="ui mt-3">
            {error && <p className="text-sm text-[var(--err)]">{error}</p>}
            {verdict && (
              <Feedback verdict={verdict} typed={input}>
                <ConvertSolution card={card} />
              </Feedback>
            )}
          </div>

          {practice && met > 0 && (
            <button
              type="button"
              className="ui mt-4 text-sm underline underline-offset-4"
              onClick={() => {
                setPractice(false);
                show(pickCard(cards, dir, false));
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
