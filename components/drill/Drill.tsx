"use client";

import Link from "next/link";
import { useLayoutEffect, useRef, useState } from "react";
import { DRILL_GROUPS, checkDrill, drillCandidates, modeInfo, wordById, type DrillMode } from "@/lib/drill";
import { DIGITS, FORMS, formOf, letterByChar, type Form } from "@/lib/persian/letters";
import { answer, deckStats, nextCard, practiceCard, unlockNext } from "@/lib/srs";
import { useStore } from "@/lib/storage";
import { deckOf, drillUiStore, logActivity, noteResult, progressStore, srsStore, type SrsData } from "@/lib/stores";
import type { Verdict } from "@/lib/answers";
import { FaText } from "../FaText";
import { Rich } from "../Rich";
import { PersianKeyboard } from "./PersianKeyboard";
import { Feedback } from "../practice/Feedback";
import { formatWait, useMinuteClock } from "./useDrillClock";

/** The lesson that teaches the vowel marks the word drills rely on. */
export const WORD_GATE_LESSON = "sounds/long-vowels";

const digitByChar = new Map(DIGITS.map((d) => [d.ch, d]));

const candidatesFor = (mode: DrillMode, data: SrsData) => drillCandidates(mode, data.decks);

const randomForm = (): Form => FORMS[Math.floor(Math.random() * FORMS.length)];

export function DrillPrompt({ mode, id, form }: { mode: DrillMode; id: string; form: Form }) {
  const letter = letterByChar.get(id);
  const digit = digitByChar.get(id);
  if (mode === "sound") {
    const glyph = letter ? formOf(letter, form) : id;
    return (
      <div className="drill-prompt">
        <p className="drill-glyph naskh" lang="fa" dir="rtl">
          {glyph}
        </p>
        <p className="drill-glyph-print fa" lang="fa" dir="rtl" aria-hidden="true">
          {glyph}
        </p>
        <p className="ui drill-sub">{letter ? `${form} form` : "digit"} · type its sound or name</p>
      </div>
    );
  }
  if (mode === "letter") {
    return (
      <div className="drill-prompt">
        <p className="drill-name">
          {letter ? letter.name : digit!.name} <span className="text-muted">·</span>{" "}
          {letter ? letter.sounds[0] : digit!.value}
        </p>
        <p className="ui drill-sub">type the {letter ? "letter" : "Persian digit"}</p>
      </div>
    );
  }
  const w = wordById.get(id)!;
  if (mode === "read") {
    return (
      <div className="drill-prompt">
        <p className="drill-word">
          <FaText text={w.fa} translit="none" force="all" />
        </p>
        <p className="ui drill-sub">type how it sounds</p>
      </div>
    );
  }
  return (
    <div className="drill-prompt">
      <p className="drill-name">{w.translit}</p>
      <p className="ui drill-sub">“{w.en}” · write it in Persian script</p>
    </div>
  );
}

export function DrillSolution({ mode, id }: { mode: DrillMode; id: string }) {
  const letter = letterByChar.get(id);
  const digit = digitByChar.get(id);
  if (mode === "sound" || mode === "letter") {
    return (
      <p className="drill-solution">
        <span className="fa text-2xl">{id}</span>{" "}
        {letter ? (
          <>
            is <strong>{letter.name}</strong>: <Rich text={letter.hint} />.
          </>
        ) : (
          <>
            is <strong>{digit!.name}</strong>, {digit!.value}.
          </>
        )}
      </p>
    );
  }
  const w = wordById.get(id)!;
  return (
    <p className="drill-solution has-fa">
      <FaText text={w.fa} translit="none" force="all" className="text-2xl" /> <em>{w.translit}</em>, “{w.en}”.
    </p>
  );
}

/** Schedule an answered card in its mode's deck; returns the unlock banner, if a group opened. */
export function recordDrillAnswer(mode: DrillMode, id: string, ok: boolean): string | null {
  const s = srsStore.get();
  const groups = modeInfo(mode).kind === "letters" ? DRILL_GROUPS : [];
  const r = answer(groups, deckOf(s, mode), id, ok, Date.now());
  srsStore.set({ ...s, decks: { ...s.decks, [mode]: r.state } });
  if (!r.newlyUnlocked.length) return null;
  const chars = r.newlyUnlocked.flatMap((g) => DRILL_GROUPS[g]).join(" ");
  return `New ${r.newlyUnlocked.includes(8) ? "characters" : "letters"} unlocked: ${chars}`;
}

export function Drill({ mode }: { mode: DrillMode }) {
  const info = modeInfo(mode);
  const data = useStore(srsStore);
  const ui = useStore(drillUiStore);
  const progress = useStore(progressStore);
  const now = useMinuteClock();

  const [started, setStarted] = useState(false);
  const [cardId, setCardId] = useState<string | null>(null);
  const [form, setForm] = useState<Form>("isolated");
  const [practice, setPractice] = useState(false);
  const [input, setInput] = useState("");
  const [verdict, setVerdict] = useState<Verdict | null>(null);
  const [error, setError] = useState("");
  const [banner, setBanner] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const caret = useRef<number | null>(null);

  useLayoutEffect(() => {
    if (caret.current !== null && inputRef.current) {
      inputRef.current.setSelectionRange(caret.current, caret.current);
      caret.current = null;
    }
  }, [input]);

  const isFa = info.answer === "fa";
  const deck = deckOf(data, mode);
  const candidates = candidatesFor(mode, data);
  const stats = deckStats(candidates, deck, now);
  const gated = info.kind === "words" && !progress[WORD_GATE_LESSON] && !ui.wordsOpen;

  const show = (id: string | null) => {
    setCardId(id);
    setForm(randomForm());
    setInput("");
    setVerdict(null);
    setError("");
    requestAnimationFrame(() => inputRef.current?.focus());
  };

  const pick = (practising: boolean, last?: string) => {
    const s = srsStore.get();
    const cands = candidatesFor(mode, s);
    return practising ? practiceCard(cands, last, Math.random()) : nextCard(cands, deckOf(s, mode), Date.now(), last);
  };

  const start = () => {
    setStarted(true);
    show(pick(practice));
  };

  const next = () => show(pick(practice, cardId ?? undefined));

  const submit = () => {
    if (!cardId) return;
    if (!input.trim()) {
      setError("Type an answer first.");
      return;
    }
    const v = checkDrill(mode, cardId, input);
    setVerdict(v);
    logActivity({ kind: "drill" });
    noteResult({ kind: "drill", mode, id: cardId }, v.ok);
    if (practice) return;
    const opened = recordDrillAnswer(mode, cardId, v.ok);
    if (opened) setBanner(opened);
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

  const unlockMore = () => {
    srsStore.set((s) => ({ ...s, decks: { ...s.decks, [mode]: unlockNext(DRILL_GROUPS, deckOf(s, mode)) } }));
    const added = DRILL_GROUPS[Math.min(DRILL_GROUPS.length - 1, deck.unlocked)].join(" ");
    setBanner(`New ${deck.unlocked === 8 ? "characters" : "letters"} unlocked: ${added}`);
    show(pick(false));
  };

  const practiseAnyway = () => {
    setPractice(true);
    show(pick(true));
  };
  const backToReview = () => {
    setPractice(false);
    show(pick(false));
  };

  if (gated) {
    return (
      <div className="ui panel trainer-card">
        <p className="font-medium">Word drills use vowel marks.</p>
        <p className="mt-1 text-muted">
          The marks are taught in lesson 2.2. Open the word drills now if you can already read short vowels.
        </p>
        <button type="button" className="btn mt-4" onClick={() => drillUiStore.set((u) => ({ ...u, wordsOpen: true }))}>
          Open anyway
        </button>
      </div>
    );
  }

  const statusLine =
    info.kind === "letters"
      ? `${deck.unlocked} of ${DRILL_GROUPS.length} groups open · ${stats.due} due · ${stats.fresh} new`
      : `${candidates.length} words available · ${stats.due} due · ${stats.fresh} new`;

  return (
    <div className="drill">
      <div className="ui drill-status">
        <span aria-live="polite">{statusLine}</span>
        {practice && <span className="practice-pill">Practice: not scheduled</span>}
      </div>

      <p role="status" className="ui drill-banner" hidden={!banner}>
        {banner}
      </p>

      {!started ? (
        <div className="ui panel trainer-card">
          <p className="font-medium">{info.blurb}</p>
          <p className="mt-1 text-muted">
            {info.kind === "words" && candidates.length === 0
              ? "No words yet: unlock more letters in Letter → sound first."
              : stats.due
                ? `${stats.due} card${stats.due === 1 ? "" : "s"} to review.`
                : stats.fresh
                  ? `${stats.fresh} new card${stats.fresh === 1 ? "" : "s"} waiting.`
                  : "Nothing due right now."}
          </p>
          <button type="button" className="btn mt-4" onClick={start} disabled={candidates.length === 0}>
            Start
          </button>
        </div>
      ) : cardId === null ? (
        <div className="ui panel trainer-card">
          <p className="font-medium">All caught up.</p>
          <p className="mt-1 text-muted">
            {stats.nextDue ? `Next review in ${formatWait(stats.nextDue - now)}.` : "Nothing is scheduled yet."}
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <button type="button" className="btn" onClick={practiseAnyway} disabled={candidates.length === 0}>
              Practise anyway
            </button>
            {info.kind === "letters" && deck.unlocked < DRILL_GROUPS.length && (
              <button type="button" className="btn btn-quiet" onClick={unlockMore}>
                I know these: unlock the next group
              </button>
            )}
          </div>
          {info.kind === "words" && (
            <p className="mt-3 text-sm text-muted">
              More words open as you unlock letters in{" "}
              <Link href="/practice/drill/sound" className="hl underline underline-offset-4">
                Letter → sound
              </Link>
              .
            </p>
          )}
        </div>
      ) : (
        <div className="panel trainer-card">
          <DrillPrompt mode={mode} id={cardId} form={form} />
          <form
            onSubmit={(e) => {
              e.preventDefault();
              submit();
            }}
            noValidate
            className="mt-4"
          >
            <label htmlFor="drill-input" className="sr-only">
              Your answer
            </label>
            <div className="flex gap-2">
              <input
                id="drill-input"
                ref={inputRef}
                value={input}
                onChange={(e) => {
                  setInput(e.target.value);
                  setError("");
                }}
                onKeyDown={onKeyDown}
                readOnly={!!verdict}
                dir={isFa ? "rtl" : "ltr"}
                lang={isFa ? "fa" : "fa-Latn"}
                inputMode={isFa && ui.keyboard ? "none" : "text"}
                className={isFa ? "quiz-input fa" : "quiz-input"}
                autoComplete="off"
                autoCorrect="off"
                autoCapitalize="off"
                spellCheck={false}
                aria-invalid={verdict ? !verdict.ok : undefined}
                aria-describedby="drill-feedback"
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

          {isFa && (
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
          )}

          <div id="drill-feedback" role="status" className="ui mt-3">
            {error && <p className="text-sm text-[var(--err)]">{error}</p>}
            {verdict && (
              <Feedback verdict={verdict} typed={input} typedFa={isFa}>
                <DrillSolution mode={mode} id={cardId} />
              </Feedback>
            )}
          </div>

          {practice && (
            <button type="button" className="ui mt-4 text-sm underline underline-offset-4" onClick={backToReview}>
              Back to scheduled review
            </button>
          )}
        </div>
      )}
    </div>
  );
}
