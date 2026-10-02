"use client";

import { useEffect, useRef, useState } from "react";
import { DRILL_GROUPS } from "@/lib/drill";
import { formOf, letterByChar, type Letter } from "@/lib/persian/letters";
import {
  QUIZ_COUNTS,
  QUIZ_TYPES,
  checkQuizTyped,
  makeRound,
  optionLabel,
  quizTypeInfo,
  scopeLetters,
  type QuizItem,
  type QuizSetup,
} from "@/lib/quiz";
import { percent } from "@/lib/games";
import { unlockedIds } from "@/lib/srs";
import { useStore } from "@/lib/storage";
import { deckOf, drillUiStore, logActivity, noteResult, practiceUiStore, srsStore } from "@/lib/stores";
import type { Verdict } from "@/lib/answers";
import { FaText } from "../FaText";
import { Rich } from "../Rich";
import { PersianKeyboard } from "../drill/PersianKeyboard";

interface Answered {
  item: QuizItem;
  ok: boolean;
}

function LetterFacts({ l }: { l: Letter }) {
  return (
    <p className="drill-solution has-fa">
      <span className="fa text-2xl">{l.ch}</span> is <strong>{l.name}</strong>: <Rich text={l.hint} />.{" "}
      <FaText text={l.key.fa} translit="inline" alwaysTranslit /> “{l.key.en}”.
    </p>
  );
}

export function LetterQuiz() {
  const ui = useStore(practiceUiStore);
  const drillUi = useStore(drillUiStore);
  const srs = useStore(srsStore);
  const setup = ui.quiz;
  const set = (patch: Partial<QuizSetup>) => practiceUiStore.set((u) => ({ ...u, quiz: { ...u.quiz, ...patch } }));

  const [round, setRound] = useState<QuizItem[] | null>(null);
  const [answers, setAnswers] = useState<Answered[]>([]);
  const [picked, setPicked] = useState<string | null>(null);
  const [verdict, setVerdict] = useState<Verdict | null>(null);
  const [input, setInput] = useState("");
  const [revealed, setRevealed] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const nextRef = useRef<HTMLButtonElement>(null);
  const advance = useRef<number | undefined>(undefined);

  const info = quizTypeInfo(setup.type);
  const unlocked = unlockedIds(DRILL_GROUPS, deckOf(srs, "sound"));
  const pool = scopeLetters(setup.scope, unlocked);
  const item = round?.[answers.length];
  const choice = setup.style === "choice" && setup.type !== "flashcards";
  const typedFa = info.typed === "fa";

  useEffect(() => () => window.clearTimeout(advance.current), []);
  useEffect(() => {
    if (verdict && !verdict.ok) nextRef.current?.focus();
    else if (!verdict) inputRef.current?.focus();
  }, [verdict, answers.length]);

  const start = (letters: Letter[]) => {
    setRound(makeRound(setup, letters, Math.random));
    setAnswers([]);
    reset();
  };
  const reset = () => {
    setPicked(null);
    setVerdict(null);
    setInput("");
    setRevealed(false);
  };

  const next = () => {
    window.clearTimeout(advance.current);
    if (!item || !verdict) return;
    setAnswers((a) => [...a, { item, ok: verdict.ok }]);
    reset();
  };

  const note = (ch: string, ok: boolean) => {
    logActivity({ kind: "quiz", letter: ch, ok });
    noteResult({ kind: "letter", type: setup.type === "flashcards" ? "letter-name" : setup.type, ch }, ok);
  };

  const judge = (v: Verdict) => {
    if (!item) return;
    setVerdict(v);
    note(item.letter.ch, v.ok);
    if (v.ok) {
      window.clearTimeout(advance.current);
      advance.current = window.setTimeout(() => {
        setAnswers((a) => [...a, { item, ok: true }]);
        reset();
      }, 900);
    }
  };

  const choose = (l: Letter) => {
    if (verdict || !item) return;
    setPicked(l.ch);
    judge({ ok: l.ch === item.letter.ch });
  };

  const submit = () => {
    if (verdict) return next();
    if (!item || !input.trim()) return;
    judge(checkQuizTyped(setup.type, item.letter, input));
  };

  // Keys 1–4 pick an option; Enter moves on.
  useEffect(() => {
    if (!item || !choice) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.altKey || e.ctrlKey || e.metaKey) return;
      const n = Number(e.key);
      if (n >= 1 && n <= item.options.length && !verdict) choose(item.options[n - 1]);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  // ── Setup ──
  if (!round) {
    const scopes: [string, string][] = [
      ["all", "All 32 letters"],
      ["unlocked", `Letters I've opened (${unlocked.filter((c) => letterByChar.has(c)).length})`],
      ["persian", "Persian letters"],
      ...DRILL_GROUPS.slice(0, 8).map((g, i) => [`g${i}`, g.join(" ")] as [string, string]),
    ];
    return (
      <div className="ui session-setup">
        <fieldset>
          <legend className="font-medium">Question</legend>
          <div className="quiz-types">
            {QUIZ_TYPES.map((t) => (
              <label key={t.id} className="mode-card quiz-type">
                <input type="radio" name="qtype" className="sr-only" checked={setup.type === t.id} onChange={() => set({ type: t.id })} />
                <span className="font-medium">{t.title}</span>
                <span className="text-sm text-muted">{t.blurb}</span>
              </label>
            ))}
          </div>
        </fieldset>
        {setup.type !== "flashcards" && (
          <fieldset>
            <legend className="font-medium">Answer by</legend>
            <div className="chip-row">
              <button type="button" className="chip" aria-pressed={setup.style === "choice"} onClick={() => set({ style: "choice" })}>
                Picking from four
              </button>
              <button type="button" className="chip" aria-pressed={setup.style === "typed"} onClick={() => set({ style: "typed" })}>
                Typing {typedFa ? "the letter" : "it"}
              </button>
            </div>
          </fieldset>
        )}
        <fieldset>
          <legend className="font-medium">Letters</legend>
          <div className="chip-row">
            {scopes.map(([id, label]) => (
              <button key={id} type="button" className="chip" aria-pressed={setup.scope === id} onClick={() => set({ scope: id })}>
                {id.startsWith("g") ? (
                  <span className="fa" lang="fa" dir="rtl">
                    {label}
                  </span>
                ) : (
                  label
                )}
              </button>
            ))}
          </div>
        </fieldset>
        <fieldset>
          <legend className="font-medium">Questions</legend>
          <div className="chip-row">
            {QUIZ_COUNTS.map((n) => (
              <button key={n} type="button" className="chip" aria-pressed={setup.count === n} onClick={() => set({ count: n })}>
                {n}
              </button>
            ))}
          </div>
          {pool.length < setup.count && <p className="mt-1 text-sm text-muted">{pool.length} letters in this set, so {pool.length} questions.</p>}
        </fieldset>
        <button type="button" className="btn" disabled={pool.length === 0} onClick={() => start(pool)}>
          Start the quiz
        </button>
        <p className="text-sm text-muted">Quizzes don&apos;t change the trainer&apos;s review schedule.</p>
      </div>
    );
  }

  // ── Results ──
  if (!item) {
    const right = answers.filter((a) => a.ok).length;
    const pct = percent(right, answers.length);
    const missed = answers.filter((a) => !a.ok).map((a) => a.item.letter);
    return (
      <div className="ui panel trainer-card" role="status">
        <p className="text-lg font-medium">
          {pct === 100 ? "Perfect." : pct >= 80 ? "Excellent." : pct >= 60 ? "Good progress." : "Keep at it: these come quickly with practice."}
        </p>
        <p className="mt-1">
          {right} of {answers.length} right ({pct}%).
        </p>
        {missed.length > 0 && (
          <>
            <p className="mt-3 text-sm text-muted">Missed:</p>
            <ul className="missed-list" lang="fa" dir="rtl">
              {missed.map((l) => (
                <li key={l.ch}>
                  <span className="naskh">{l.ch}</span>
                  <span className="ui text-xs" dir="ltr">
                    {l.name}
                  </span>
                </li>
              ))}
            </ul>
          </>
        )}
        <div className="mt-4 flex flex-wrap gap-2">
          <button type="button" className="btn" onClick={() => start(pool)}>
            Again
          </button>
          {missed.length > 0 && (
            <button type="button" className="btn btn-quiet" onClick={() => start(missed)}>
              Retry the {missed.length} missed
            </button>
          )}
          <button type="button" className="btn btn-quiet" onClick={() => setRound(null)}>
            Change the quiz
          </button>
        </div>
      </div>
    );
  }

  // ── A question ──
  const l = item.letter;
  const right = answers.filter((a) => a.ok).length;
  const showsGlyph = ["letter-name", "letter-sound", "form-letter", "flashcards"].includes(setup.type);
  return (
    <div className="drill">
      <div className="ui session-head">
        <span>
          {answers.length + 1} of {round.length} · {right} right
        </span>
        <div className="session-bar" aria-hidden="true">
          <span style={{ width: `${(100 * answers.length) / round.length}%` }} />
        </div>
        <button type="button" className="text-sm underline underline-offset-4" onClick={() => setRound(null)}>
          End
        </button>
      </div>

      <div className="panel trainer-card">
        <div className="drill-prompt">
          {showsGlyph ? (
            <p className="drill-glyph naskh" lang="fa" dir="rtl">
              {formOf(l, item.form)}
            </p>
          ) : (
            <p className="drill-name">
              {l.name}
              {setup.type === "sound-letter" && (
                <>
                  {" "}
                  <span className="text-muted">·</span> {l.sounds[0]}
                </>
              )}
            </p>
          )}
          <p className="ui drill-sub">
            {setup.type === "letter-name"
              ? "What is this letter called?"
              : setup.type === "letter-sound"
                ? "What sound does it spell?"
                : setup.type === "form-letter"
                  ? `Which letter is this? (${item.form} form)`
                  : setup.type === "flashcards"
                    ? "Say its name and sound, then turn the card."
                    : "Which letter is it?"}
          </p>
        </div>

        {setup.type === "flashcards" ? (
          !revealed ? (
            <button type="button" className="btn mt-4" onClick={() => setRevealed(true)} autoFocus>
              Turn the card
            </button>
          ) : (
            <div className="ui mt-4">
              <LetterFacts l={l} />
              <div className="mt-3 flex gap-2">
                <button
                  type="button"
                  className="btn"
                  autoFocus
                  onClick={() => {
                    note(l.ch, true);
                    setAnswers((a) => [...a, { item, ok: true }]);
                    reset();
                  }}
                >
                  I knew it
                </button>
                <button
                  type="button"
                  className="btn btn-quiet"
                  onClick={() => {
                    note(l.ch, false);
                    setAnswers((a) => [...a, { item, ok: false }]);
                    reset();
                  }}
                >
                  Not yet
                </button>
              </div>
            </div>
          )
        ) : choice ? (
          <ol className="quiz-options" aria-label="Options">
            {item.options.map((o, i) => {
              const state = verdict && (o.ch === l.ch ? "is-right" : o.ch === picked ? "is-wrong" : "");
              const glyph = !["letter-name", "letter-sound"].includes(setup.type);
              return (
                <li key={o.ch}>
                  <button type="button" className={`quiz-option ${state || ""}`} onClick={() => choose(o)} disabled={!!verdict}>
                    <span className="quiz-key" aria-hidden="true">
                      {i + 1}
                    </span>
                    {glyph ? (
                      <span className="naskh quiz-option-glyph" lang="fa" dir="rtl">
                        {o.ch}
                      </span>
                    ) : (
                      <span className="ui">{optionLabel(setup.type, o)}</span>
                    )}
                  </button>
                </li>
              );
            })}
          </ol>
        ) : (
          <form
            className="mt-4"
            noValidate
            onSubmit={(e) => {
              e.preventDefault();
              submit();
            }}
          >
            <label htmlFor="quiz-typed" className="sr-only">
              Your answer
            </label>
            <div className="flex gap-2">
              <input
                id="quiz-typed"
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                readOnly={!!verdict}
                dir={typedFa ? "rtl" : "ltr"}
                lang={typedFa ? "fa" : "fa-Latn"}
                inputMode={typedFa && drillUi.keyboard ? "none" : "text"}
                className={typedFa ? "quiz-input fa" : "quiz-input"}
                autoComplete="off"
                autoCorrect="off"
                autoCapitalize="off"
                spellCheck={false}
              />
              {!verdict ? (
                <button key="check" type="submit" className="ui btn">
                  Check
                </button>
              ) : (
                <button key="next" type="button" ref={nextRef} className="ui btn" onClick={next}>
                  Next
                </button>
              )}
            </div>
            {typedFa && (
              <div className="mt-3">
                <button
                  type="button"
                  className="ui text-sm text-muted underline underline-offset-4"
                  onClick={() => drillUiStore.set((u) => ({ ...u, keyboard: !u.keyboard }))}
                  aria-expanded={drillUi.keyboard}
                >
                  {drillUi.keyboard ? "Hide the Persian keyboard" : "Show the Persian keyboard"}
                </button>
                {drillUi.keyboard && (
                  <PersianKeyboard onInsert={(t) => !verdict && setInput((v) => v + t)} onBackspace={() => !verdict && setInput((v) => v.slice(0, -1))} />
                )}
              </div>
            )}
          </form>
        )}

        <div role="status" className="ui mt-3">
          {verdict && (
            <div className={`feedback feedback-${verdict.ok ? "right" : verdict.near ? "near" : "wrong"}`}>
              <p className="feedback-verdict">{verdict.ok ? "Correct." : verdict.near ? "Nearly." : "Not quite."}</p>
              {verdict.note && <p>{verdict.note}</p>}
              {verdict.hint && <p>{verdict.hint}</p>}
              {!verdict.ok && <LetterFacts l={l} />}
              {!verdict.ok && choice && (
                <button type="button" ref={nextRef} className="btn mt-2" onClick={next}>
                  Next
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
