"use client";

import Link from "next/link";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { DRILL_GROUPS, WORD_CARDS, type WordCard } from "@/lib/drill";
import {
  FORM_WORD,
  checkCopy,
  gameInfo,
  letterOptions,
  letterSteps,
  letterTiles,
  percent,
  soundTiles,
  typeRound,
  wordPool,
  type GameId,
  type LetterStep,
  type Tile,
  type TypeItem,
} from "@/lib/games";
import type { Verdict } from "@/lib/answers";
import { LETTERS, highlightLetter, type Letter } from "@/lib/persian/letters";
import { normalizeFa } from "@/lib/persian/normalize";
import { shuffle } from "@/lib/quiz";
import { unlockedIds } from "@/lib/srs";
import { useStore } from "@/lib/storage";
import { deckOf, drillUiStore, gamesStore, logActivity, noteResult, practiceUiStore, srsStore } from "@/lib/stores";
import { PersianKeyboard } from "../drill/PersianKeyboard";
import { FaText } from "../FaText";

const FLASH_SPEEDS: [number, string][] = [
  [2000, "Slow"],
  [1200, "Medium"],
  [600, "Fast"],
];

/** Shared frame: start screen, score line and the end screen. `items` feeds Type it. */
export function Game({ id, items = [] }: { id: GameId; items?: TypeItem[] }) {
  const info = gameInfo(id);
  const games = useStore(gamesStore);
  const srs = useStore(srsStore);
  const ui = useStore(practiceUiStore);
  const [onlyOpen, setOnlyOpen] = useState(true);
  const [run, setRun] = useState<{ key: number; words: WordCard[]; letters: Letter[]; typed: TypeItem[] } | null>(null);
  const [final, setFinal] = useState<{ right: number; total: number } | null>(null);

  const open = new Set(unlockedIds(DRILL_GROUPS, deckOf(srs, "sound")));
  const openLetters = LETTERS.filter((l) => open.has(l.ch));

  const start = () => {
    const words = shuffle(wordPool(WORD_CARDS, onlyOpen ? open : null), Math.random).slice(0, info.rounds);
    const pool = onlyOpen && openLetters.length >= 4 ? openLetters : LETTERS;
    const letters = Array.from({ length: info.rounds }, (_, i) => shuffle(pool, Math.random)[i % pool.length]);
    setFinal(null);
    const typed = id === "type" ? typeRound(items, info.rounds, Math.random) : [];
    setRun((r) => ({ key: (r?.key ?? 0) + 1, words, letters, typed }));
  };

  const end = (right: number, total: number) => {
    const pct = percent(right, total);
    gamesStore.set((g) => ({ ...g, [id]: { best: Math.max(g[id]?.best ?? 0, pct), played: (g[id]?.played ?? 0) + 1 } }));
    setFinal({ right, total });
  };

  const best = games[id];

  if (final) {
    const pct = percent(final.right, final.total);
    return (
      <div className="ui drill-panel" role="status">
        <p className="text-lg font-medium">
          {pct === 100 ? "Perfect." : pct >= 80 ? "Excellent." : pct >= 50 ? "Good work." : "Keep going: it gets easier."}
        </p>
        <p className="mt-1">
          {final.right} of {final.total} ({pct}%). Best so far: {Math.max(best?.best ?? 0, pct)}%.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <button type="button" className="drill-btn" onClick={start} autoFocus>
            Play again
          </button>
          <Link href="/practice#games" className="drill-btn drill-btn-quiet">
            All games
          </Link>
        </div>
      </div>
    );
  }

  if (!run) {
    return (
      <div className="ui session-setup">
        <p>{info.blurb}</p>
        {id === "type" ? (
          <p className="text-sm text-muted">
            Vowel marks and punctuation are optional; letters, spaces and half-spaces count. On the standard Persian
            keyboard the half-space is Shift + Space, and the on-screen keyboard has one too.
          </p>
        ) : id !== "flash" ? (
          <label className="hide-done">
            <input type="checkbox" checked={onlyOpen} onChange={(e) => setOnlyOpen(e.target.checked)} />
            Only words made of letters I&apos;ve opened in the trainer
          </label>
        ) : (
          <>
            <label className="hide-done">
              <input type="checkbox" checked={onlyOpen} onChange={(e) => setOnlyOpen(e.target.checked)} />
              Only letters I&apos;ve opened in the trainer
            </label>
            <fieldset>
              <legend className="font-medium">Speed</legend>
              <div className="chips chips-wrap">
                {FLASH_SPEEDS.map(([ms, label]) => (
                  <button
                    key={ms}
                    type="button"
                    className="chip"
                    aria-pressed={ui.flashSpeed === ms}
                    onClick={() => practiceUiStore.set((u) => ({ ...u, flashSpeed: ms }))}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </fieldset>
          </>
        )}
        <button type="button" className="drill-btn" onClick={start}>
          Start
        </button>
        {best && (
          <p className="text-sm text-muted">
            Best: {best.best}% · played {best.played} time{best.played === 1 ? "" : "s"}
          </p>
        )}
      </div>
    );
  }

  const props = { key: run.key, words: run.words, letters: run.letters, onEnd: end };
  switch (id) {
    case "builder":
      return <WordBuilder {...props} />;
    case "sounds":
      return <SoundItOut {...props} />;
    case "letters":
      return <LetterByLetter {...props} />;
    case "flash":
      return <Flash {...props} speed={ui.flashSpeed} />;
    case "type":
      return <TypeIt key={run.key} items={run.typed} onEnd={end} />;
  }
}

interface PlayProps {
  words: WordCard[];
  letters: Letter[];
  onEnd: (right: number, total: number) => void;
}

function Head({ at, total, right, unit = "" }: { at: number; total: number; right: number; unit?: string }) {
  return (
    <div className="ui session-head">
      <span>
        {Math.min(at + 1, total)} of {total}
        {unit} · {right} right
      </span>
      <div className="session-bar" aria-hidden="true">
        <span style={{ width: `${(100 * at) / total}%` }} />
      </div>
    </div>
  );
}

// ── Tile games: word builder and sound it out ─────────────────────────────

function TileRound({
  word,
  kind,
  tiles,
  answer,
  onDone,
}: {
  word: WordCard;
  kind: "letters" | "sounds";
  tiles: Tile[];
  answer: string[];
  onDone: (ok: boolean) => void;
}) {
  const [placed, setPlaced] = useState<Tile[]>([]);
  const [checked, setChecked] = useState<boolean | null>(null);
  const fa = kind === "letters";
  const full = placed.length === answer.length;

  const settle = (ok: boolean) => {
    setChecked(ok);
    logActivity({ kind: "game" });
    noteResult({ kind: "word", dir: fa ? "spell" : "read", fa: word.fa, translit: word.translit, en: word.en }, ok);
  };
  const check = () => {
    if (!full || checked !== null) return;
    settle(placed.map((t) => t.s).join("|") === answer.join("|"));
  };

  return (
    <div className="drill-card">
      <div className="drill-prompt">
        {fa ? (
          <>
            <p className="drill-name">{word.translit}</p>
            <p className="ui drill-sub">“{word.en}” · tap the letters in order</p>
          </>
        ) : (
          <>
            <p className="drill-word">
              <FaText text={word.fa} translit="none" force="all" />
            </p>
            <p className="ui drill-sub">tap its sounds in order</p>
          </>
        )}
      </div>

      <div className={`tile-slots ${fa ? "tile-slots-fa" : ""}`} dir={fa ? "rtl" : "ltr"} aria-label="Your answer">
        {answer.map((_, i) => (
          <span key={i} className={`tile-slot ${checked === null ? "" : placed[i]?.s === answer[i] ? "is-right" : "is-wrong"}`}>
            <span className={fa ? "fa" : "ui"} lang={fa ? "fa" : undefined}>
              {placed[i]?.s ?? ""}
            </span>
          </span>
        ))}
      </div>
      {fa && placed.length > 0 && (
        <p className="tile-preview naskh" lang="fa" dir="rtl" aria-label="The letters joined">
          {placed.map((t) => t.s).join("")}
        </p>
      )}

      <div className={`tiles ${fa ? "tiles-fa" : ""}`} dir={fa ? "rtl" : "ltr"}>
        {tiles.map((t) => (
          <button
            key={t.id}
            type="button"
            className="tile"
            disabled={placed.includes(t) || full || checked !== null}
            onClick={() => setPlaced((p) => [...p, t])}
          >
            <span className={fa ? "fa" : "ui"} lang={fa ? "fa" : undefined}>
              {t.s}
            </span>
          </button>
        ))}
      </div>

      <div className="ui mt-4 flex flex-wrap gap-2">
        {checked === null ? (
          <>
            <button type="button" className="drill-btn" disabled={!full} onClick={check}>
              Check
            </button>
            <button type="button" className="drill-btn drill-btn-quiet" disabled={!placed.length} onClick={() => setPlaced((p) => p.slice(0, -1))}>
              Undo
            </button>
            <button
              type="button"
              className="drill-btn drill-btn-quiet"
              onClick={() => settle(false)}
            >
              Show me
            </button>
          </>
        ) : (
          <button type="button" className="drill-btn" onClick={() => onDone(checked)} autoFocus>
            Next
          </button>
        )}
      </div>

      <div role="status" className="ui mt-3">
        {checked !== null && (
          <div className={`quiz-fb ${checked ? "quiz-ok" : "quiz-no"}`}>
            <p className="font-medium">{checked ? "Correct." : "Here it is:"}</p>
            <p className="has-fa">
              <FaText text={word.fa} translit="none" force="all" className="text-2xl" /> <em>{word.translit}</em>, “{word.en}”
              {!fa && <span className="text-muted"> · {answer.join(" · ")}</span>}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

function useTileGame(words: WordCard[], onEnd: PlayProps["onEnd"], make: (w: WordCard) => { tiles: Tile[]; answer: string[] }) {
  const [at, setAt] = useState(0);
  const [right, setRight] = useState(0);
  const [round, setRound] = useState(() => make(words[0]));
  const done = (ok: boolean) => {
    const r = right + (ok ? 1 : 0);
    setRight(r);
    if (at + 1 >= words.length) return onEnd(r, words.length);
    setAt(at + 1);
    setRound(make(words[at + 1]));
  };
  return { at, right, round, done };
}

function WordBuilder({ words, onEnd }: PlayProps) {
  const g = useTileGame(words, onEnd, (w) => letterTiles(w.fa, 2, Math.random));
  return (
    <div className="drill">
      <Head at={g.at} total={words.length} right={g.right} />
      <TileRound key={g.at} word={words[g.at]} kind="letters" tiles={g.round.tiles} answer={g.round.answer} onDone={g.done} />
    </div>
  );
}

function SoundItOut({ words, onEnd }: PlayProps) {
  const others = WORD_CARDS.map((w) => w.fa);
  const g = useTileGame(words, onEnd, (w) => soundTiles(w.fa, others, 3, Math.random));
  return (
    <div className="drill">
      <Head at={g.at} total={words.length} right={g.right} />
      <TileRound key={g.at} word={words[g.at]} kind="sounds" tiles={g.round.tiles} answer={g.round.answer} onDone={g.done} />
    </div>
  );
}

// ── Letter by letter ──────────────────────────────────────────────────────

function LetterByLetter({ words, onEnd }: PlayProps) {
  const [w, setW] = useState(0);
  const [k, setK] = useState(0);
  const [right, setRight] = useState(0);
  const [picked, setPicked] = useState<string | null>(null);
  const [options, setOptions] = useState<Letter[]>(() => letterOptions(letterSteps(words[0].fa)[0].letter, Math.random));
  const steps: LetterStep[] = letterSteps(words[w].fa);
  const step = steps[k];
  const total = words.reduce((n, x) => n + letterSteps(x.fa).length, 0);
  const doneBefore = words.slice(0, w).reduce((n, x) => n + letterSteps(x.fa).length, 0) + k;

  const choose = (l: Letter) => {
    if (picked) return;
    setPicked(l.ch);
    if (l.ch === step.letter.ch) setRight((r) => r + 1);
    logActivity({ kind: "game" });
    noteResult({ kind: "letter", type: "form-letter", ch: step.letter.ch }, l.ch === step.letter.ch);
  };
  const next = () => {
    if (k + 1 < steps.length) {
      setK(k + 1);
      setOptions(letterOptions(steps[k + 1].letter, Math.random));
    } else if (w + 1 < words.length) {
      setW(w + 1);
      setK(0);
      setOptions(letterOptions(letterSteps(words[w + 1].fa)[0].letter, Math.random));
    } else {
      return onEnd(right, total);
    }
    setPicked(null);
  };

  return (
    <div className="drill">
      <Head at={doneBefore} total={total} right={right} unit=" letters" />
      <div className="drill-card">
        <div className="drill-prompt">
          <p className="drill-word">
            <FaText text={highlightLetter(words[w].fa, step)} translit="none" force="none" />
          </p>
          <p className="ui drill-sub">
            “{words[w].en}” · letter {k + 1} of {steps.length}, reading from the right
          </p>
        </div>
        <ol className="quiz-options" aria-label="Which letter is highlighted?">
          {options.map((o) => (
            <li key={o.ch}>
              <button
                type="button"
                className={`quiz-option ${picked ? (o.ch === step.letter.ch ? "is-right" : o.ch === picked ? "is-wrong" : "") : ""}`}
                onClick={() => choose(o)}
                disabled={!!picked}
              >
                <span className="naskh quiz-option-glyph" lang="fa" dir="rtl">
                  {o.ch}
                </span>
                <span className="ui text-sm">{o.name}</span>
              </button>
            </li>
          ))}
        </ol>
        <div role="status" className="ui mt-3">
          {picked && (
            <div className={`quiz-fb ${picked === step.letter.ch ? "quiz-ok" : "quiz-no"}`}>
              <p>
                <span className="fa text-xl">{step.ch}</span> is <strong>{step.letter.name}</strong>
                {step.ch === "آ" ? " (alef with a madde)" : ""}, {FORM_WORD[step.form]} ({step.form} form).
              </p>
              <button type="button" className="drill-btn mt-2" onClick={next} autoFocus>
                {k + 1 < steps.length ? "Next letter" : w + 1 < words.length ? "Next word" : "Finish"}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Flash ─────────────────────────────────────────────────────────────────

function Flash({ letters, onEnd, speed }: PlayProps & { speed: number }) {
  const [at, setAt] = useState(0);
  const [right, setRight] = useState(0);
  const [phase, setPhase] = useState<"show" | "ask" | "done">("show");
  const [picked, setPicked] = useState<string | null>(null);
  const [options, setOptions] = useState<Letter[]>(() => letterOptions(letters[0], Math.random));
  const timer = useRef<number | undefined>(undefined);
  const letter = letters[at];

  // Show the letter for `speed` ms, then ask. Timers stop when the game is left.
  useEffect(() => {
    if (phase !== "show") return;
    timer.current = window.setTimeout(() => setPhase("ask"), speed);
    return () => window.clearTimeout(timer.current);
  }, [phase, at, speed]);
  useEffect(() => () => window.clearTimeout(timer.current), []);

  const choose = (l: Letter) => {
    if (phase !== "ask") return;
    setPicked(l.ch);
    setPhase("done");
    const ok = l.ch === letter.ch;
    if (ok) setRight((r) => r + 1);
    logActivity({ kind: "game" });
    noteResult({ kind: "letter", type: "letter-name", ch: letter.ch }, ok);
  };
  const next = () => {
    if (at + 1 >= letters.length) return onEnd(right, letters.length);
    setAt(at + 1);
    setOptions(letterOptions(letters[at + 1], Math.random));
    setPicked(null);
    setPhase("show");
  };

  return (
    <div className="drill">
      <Head at={at} total={letters.length} right={right} />
      <div className="drill-card">
        <div className="drill-prompt flash-stage">
          {phase === "ask" ? (
            <p className="flash-hidden ui" aria-live="polite">
              Which letter was it?
            </p>
          ) : (
            <p className="drill-glyph naskh" lang="fa" dir="rtl">
              {letter.ch}
            </p>
          )}
          {phase === "show" && (
            <div className="flash-bar" aria-hidden="true">
              <span key={at} style={{ animationDuration: `${speed}ms` }} />
            </div>
          )}
        </div>
        <ol className="quiz-options" aria-label="Options">
          {options.map((o) => (
            <li key={o.ch}>
              <button
                type="button"
                className={`quiz-option ${phase === "done" ? (o.ch === letter.ch ? "is-right" : o.ch === picked ? "is-wrong" : "") : ""}`}
                disabled={phase !== "ask"}
                onClick={() => choose(o)}
              >
                <span className="ui">{o.name}</span>
              </button>
            </li>
          ))}
        </ol>
        <div role="status" className="ui mt-3">
          {phase === "done" && (
            <div className={`quiz-fb ${picked === letter.ch ? "quiz-ok" : "quiz-no"}`}>
              <p>
                <span className="fa text-xl">{letter.ch}</span> is <strong>{letter.name}</strong> ({letter.sounds[0]}).
              </p>
              <button type="button" className="drill-btn mt-2" onClick={next} autoFocus>
                {at + 1 < letters.length ? "Next" : "Finish"}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}


// ── Type it ───────────────────────────────────────────────────────────────

const HALF_SPACE = "‌";

/** Typed text with its half-spaces and spaces made visible. */
function Spacing({ text }: { text: string }) {
  return (
    <bdi lang="fa" dir="rtl" className="fa">
      {[...text].map((ch, i) =>
        ch === HALF_SPACE ? (
          <span key={i} className="gap-mark gap-half" title="half-space">
            {HALF_SPACE}
          </span>
        ) : ch === " " ? (
          <span key={i} className="gap-mark gap-space" title="space">
            {" "}
          </span>
        ) : (
          ch
        ),
      )}
    </bdi>
  );
}

function TypeIt({ items, onEnd }: { items: TypeItem[]; onEnd: PlayProps["onEnd"] }) {
  const ui = useStore(drillUiStore);
  const [at, setAt] = useState(0);
  const [right, setRight] = useState(0);
  const [input, setInput] = useState("");
  const [verdict, setVerdict] = useState<Verdict | null>(null);
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const caret = useRef<number | null>(null);
  const item = items[at];

  useLayoutEffect(() => {
    if (caret.current !== null && inputRef.current) {
      inputRef.current.setSelectionRange(caret.current, caret.current);
      caret.current = null;
    }
  }, [input]);

  if (!item) return null;

  const submit = () => {
    if (!input.trim()) {
      setError("Type the text first.");
      return;
    }
    const v = checkCopy(input, item.fa);
    setVerdict(v);
    if (v.ok) setRight((r) => r + 1);
    logActivity({ kind: "game" });
    noteResult({ kind: "word", dir: "spell", fa: item.fa, translit: item.translit, en: item.en }, v.ok);
  };
  const next = () => {
    if (at + 1 >= items.length) return onEnd(right, items.length);
    setAt(at + 1);
    setInput("");
    setVerdict(null);
    setError("");
    requestAnimationFrame(() => inputRef.current?.focus());
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
      <Head at={at} total={items.length} right={right} />
      <div className="drill-card">
        <div className="drill-prompt">
          <p className="drill-word type-target">
            <FaText text={item.fa} translit="none" />
          </p>
          <p className="ui drill-sub">
            “{item.en}”{item.fa.includes(HALF_SPACE) && " · mind the half-space"}
          </p>
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (verdict) next();
            else submit();
          }}
          noValidate
          className="mt-4"
        >
          <label htmlFor="type-input" className="sr-only">
            Type the text above
          </label>
          <div className="flex gap-2">
            <input
              id="type-input"
              ref={inputRef}
              value={input}
              onChange={(e) => {
                setInput(e.target.value);
                setError("");
              }}
              readOnly={!!verdict}
              dir="rtl"
              lang="fa"
              inputMode={ui.keyboard ? "none" : "text"}
              className="quiz-input fa"
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="off"
              spellCheck={false}
              autoFocus
              aria-invalid={verdict ? !verdict.ok : undefined}
              aria-describedby="type-feedback"
            />
            {!verdict ? (
              <button type="submit" className="ui quiz-check">
                Check
              </button>
            ) : (
              <button type="button" className="ui quiz-check" onClick={next} autoFocus>
                {at + 1 < items.length ? "Next" : "Finish"}
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

        <div id="type-feedback" role="status" className="ui mt-3">
          {error && <p className="text-sm text-[var(--err)]">{error}</p>}
          {verdict && (
            <div className={`quiz-fb ${verdict.ok ? "quiz-ok" : "quiz-no"}`}>
              <p className="font-medium">{verdict.ok ? "Correct." : "Not quite."}</p>
              {verdict.hint && <p className="has-fa">{verdict.hint}</p>}
              <p className="has-fa">
                <span className="text-muted">Shown: </span>
                <Spacing text={normalizeFa(item.fa)} /> <em>{item.translit}</em>
              </p>
              {!verdict.ok && (
                <p className="has-fa">
                  <span className="text-muted">You typed: </span>
                  <Spacing text={normalizeFa(input)} />
                </p>
              )}
              <p className="text-sm text-muted" aria-hidden="true">
                <span className="gap-key gap-half" /> half-space · <span className="gap-key gap-space" /> space
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
