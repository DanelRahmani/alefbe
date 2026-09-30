"use client";

import { useLayoutEffect, useRef, useState } from "react";
import type { Verdict } from "@/lib/answers";
import { PRONOUNS, PERSON_EN, TENSES, englishOf, type Tense } from "@/lib/conjugate";
import { answer, deckStats, nextCard, practiceCard, unlockNext } from "@/lib/srs";
import { useStore } from "@/lib/storage";
import { drillUiStore, logActivity, noteResult, verbsStore } from "@/lib/stores";
import {
  askFor,
  bothStyles,
  checkVerb,
  deckFor,
  parseItem,
  verbCandidates,
  verbGroups,
  type StyleChoice,
  type VerbQuestion,
  type VerbsData,
} from "@/lib/verb-drill";
import { PersianKeyboard } from "../drill/PersianKeyboard";
import { formatWait, useMinuteClock } from "../drill/useDrillClock";
import { FaText } from "../FaText";
import { Rich } from "../Rich";

const STYLE_CHOICES: { id: StyleChoice; label: string }[] = [
  { id: "both", label: "Spoken and written" },
  { id: "spoken", label: "Spoken" },
  { id: "written", label: "Written" },
];

/** The question: the verb, who, spoken or written, and whether it is negative. */
export function VerbPrompt({ q }: { q: VerbQuestion }) {
  const { verb, spec } = q;
  return (
    <div className="drill-prompt">
      <p className="drill-word">
        <FaText text={verb.inf} translit="block" alwaysTranslit force="all" />
      </p>
      <p className="ui drill-sub">{verb.en}</p>
      <p className="ui verb-cue">
        <span className="verb-tag has-fa">
          <FaText text={PRONOUNS[spec.person][spec.style]} translit="none" force="all" /> {PERSON_EN[spec.person]}
        </span>
        <span className="verb-tag">{spec.style === "spoken" ? "Spoken" : "Written"}</span>
        <span className="verb-tag">{TENSES.find((t) => t.id === spec.tense)!.title}</span>
        {spec.negative && <span className="verb-tag verb-tag-neg">Negative</span>}
      </p>
      <p className="ui drill-sub">
        “{englishOf(verb, spec)}” · type the {spec.style} form
      </p>
    </div>
  );
}

/** The answer in both styles, marked and transliterated. */
export function VerbSolution({ q }: { q: VerbQuestion }) {
  const both = bothStyles(q);
  return (
    <span className="verb-solution has-fa">
      <span>
        Spoken: <FaText text={both.spoken} translit="inline" alwaysTranslit force="all" className="text-xl" />
      </span>
      <span>
        Written: <FaText text={both.written} translit="inline" alwaysTranslit force="all" className="text-xl" />
      </span>
    </span>
  );
}

/** The infinitives of the given groups, for the unlock banner. */
const groupNames = (tense: Tense, groups: number[]) =>
  groups
    .flatMap((g) => verbGroups(tense)[g] ?? [])
    .map((id) => parseItem(id)!.verb.inf)
    .join("، ");

export function VerbTrainer() {
  const data = useStore(verbsStore);
  const ui = useStore(drillUiStore);
  const now = useMinuteClock();
  const tense: Tense = "present";

  const [started, setStarted] = useState(false);
  const [q, setQ] = useState<{ id: string; question: VerbQuestion } | null>(null);
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

  const groups = verbGroups(tense);
  const deck = deckFor(data, tense);
  const candidates = verbCandidates(data, tense);
  const stats = deckStats(candidates, deck, now);

  const show = (id: string | null) => {
    const s = verbsStore.get();
    const question = id ? askFor(id, s.ask, Math.random) : null;
    setQ(id && question ? { id, question } : null);
    setInput("");
    setVerdict(null);
    setError("");
    requestAnimationFrame(() => inputRef.current?.focus());
  };

  const pick = (practising: boolean, last?: string) => {
    const s = verbsStore.get();
    const cands = verbCandidates(s, tense);
    return practising ? practiceCard(cands, last, Math.random()) : nextCard(cands, deckFor(s, tense), Date.now(), last);
  };

  const start = () => {
    setStarted(true);
    show(pick(practice));
  };
  const next = () => show(pick(practice, q?.id));

  const submit = () => {
    if (!q) return;
    if (!input.trim()) {
      setError("Type an answer first.");
      return;
    }
    const v = checkVerb(q.question, input);
    setVerdict(v);
    logActivity({ kind: "drill" });
    const { verb, spec } = q.question;
    noteResult({ kind: "verb", verb: verb.id, ...spec }, v.ok);
    if (practice) return;
    const s = verbsStore.get();
    const r = answer(groups, deckFor(s, tense), q.id, v.ok, Date.now());
    verbsStore.set({ ...s, decks: { ...s.decks, [tense]: r.state } });
    if (r.newlyUnlocked.length) setBanner(`New verbs unlocked: ${groupNames(tense, r.newlyUnlocked)}`);
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

  const setAsk = (ask: StyleChoice) => verbsStore.set((s: VerbsData) => ({ ...s, ask }));

  const unlockMore = () => {
    const opened = deck.unlocked;
    verbsStore.set((s) => ({ ...s, decks: { ...s.decks, [tense]: unlockNext(groups, deckFor(s, tense)) } }));
    setBanner(`New verbs unlocked: ${groupNames(tense, [opened])}`);
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

  return (
    <div className="drill">
      <div className="ui drill-status">
        <span aria-live="polite">
          {deck.unlocked} of {groups.length} verb groups open · {stats.due} due · {stats.fresh} new
        </span>
        {practice && <span className="practice-pill">Practice: not scheduled</span>}
      </div>

      <div className="ui chips mt-3" role="group" aria-label="Ask for">
        {STYLE_CHOICES.map((c) => (
          <button key={c.id} type="button" className="chip" aria-pressed={data.ask === c.id} onClick={() => setAsk(c.id)}>
            {c.label}
          </button>
        ))}
      </div>

      <p role="status" className="ui drill-banner" hidden={!banner}>
        {banner && <Rich text={banner} translit={false} />}
      </p>

      {!started ? (
        <div className="ui drill-panel">
          <p className="font-medium">See a verb, a person and spoken or written; type the form.</p>
          <p className="mt-1 text-muted">
            {stats.due
              ? `${stats.due} verb${stats.due === 1 ? "" : "s"} to review.`
              : stats.fresh
                ? `${stats.fresh} new verb${stats.fresh === 1 ? "" : "s"} waiting.`
                : "Nothing due right now."}
          </p>
          <button type="button" className="drill-btn mt-4" onClick={start}>
            Start
          </button>
        </div>
      ) : q === null ? (
        <div className="ui drill-panel">
          <p className="font-medium">All caught up.</p>
          <p className="mt-1 text-muted">
            {stats.nextDue ? `Next review in ${formatWait(stats.nextDue - now)}.` : "Nothing is scheduled yet."}
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <button type="button" className="drill-btn" onClick={practiseAnyway}>
              Practise anyway
            </button>
            {deck.unlocked < groups.length && (
              <button type="button" className="drill-btn drill-btn-quiet" onClick={unlockMore}>
                I know these: open the next verbs
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className="drill-card">
          <VerbPrompt q={q.question} />
          <form
            onSubmit={(e) => {
              e.preventDefault();
              submit();
            }}
            noValidate
            className="mt-4"
          >
            <label htmlFor="verb-input" className="sr-only">
              Your answer
            </label>
            <div className="flex gap-2">
              <input
                id="verb-input"
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
                aria-describedby="verb-feedback"
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

          <div id="verb-feedback" role="status" className="ui mt-3">
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
                <VerbSolution q={q.question} />
              </div>
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

