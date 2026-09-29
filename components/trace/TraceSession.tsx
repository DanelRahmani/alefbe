"use client";

import { useState } from "react";
import { DRILL_GROUPS, FORM_LABELS, LETTERS, formOf, formsOf, letterByChar, type Form, type Letter } from "@/lib/persian/letters";
import { PASS_SCORE, TRACE_LEVELS, letterMastery, starsFor, type TraceLevel } from "@/lib/trace";
import { shuffle } from "@/lib/quiz";
import { percent } from "@/lib/games";
import { useStore } from "@/lib/storage";
import { activityStore, traceStore } from "@/lib/stores";
import { Tracer } from "./Tracer";

type Pick = "group" | "persian" | "weakest" | "custom";
type FormPick = Form | "all";
type LevelPick = TraceLevel | "step";

interface Item {
  letter: Letter;
  form: Form;
  level: TraceLevel;
}
interface Done extends Item {
  score: number | null;
  passed: boolean;
}

const ORDER: (TraceLevel | null)[] = [null, "guided", "outline", "freehand"];
/** One level above the hardest one passed so far. */
const stepUp = (m: TraceLevel | null): TraceLevel => ORDER[Math.min(3, ORDER.indexOf(m) + 1)] ?? "freehand";

export function TraceSession() {
  const best = useStore(traceStore);
  const activity = useStore(activityStore);
  const [pick, setPick] = useState<Pick>("group");
  const [group, setGroup] = useState(0);
  const [custom, setCustom] = useState<string[]>(["ب", "پ", "ت"]);
  const [formPick, setFormPick] = useState<FormPick>("all");
  const [rounds, setRounds] = useState(1);
  const [levelPick, setLevelPick] = useState<LevelPick>("step");
  const [queue, setQueue] = useState<Item[] | null>(null);
  const [done, setDone] = useState<Done[]>([]);

  const weakest = () =>
    [...LETTERS]
      .sort((a, b) => {
        const d = ORDER.indexOf(letterMastery(best, a.ch)) - ORDER.indexOf(letterMastery(best, b.ch));
        return d || (activity.traced[a.ch] ?? 0) - (activity.traced[b.ch] ?? 0);
      })
      .slice(0, 6);

  const chosen = (): Letter[] =>
    pick === "group"
      ? DRILL_GROUPS[group].map((ch) => letterByChar.get(ch)!)
      : pick === "persian"
        ? LETTERS.filter((l) => l.persianOnly)
        : pick === "weakest"
          ? weakest()
          : LETTERS.filter((l) => custom.includes(l.ch));

  const formsFor = (l: Letter): Form[] =>
    formPick === "all" ? formsOf(l) : formsOf(l).includes(formPick) ? [formPick] : [];

  const build = (letters: Letter[]): Item[] =>
    Array.from({ length: rounds }, () =>
      shuffle(
        letters.flatMap((letter) =>
          formsFor(letter).map((form) => ({
            letter,
            form,
            level: levelPick === "step" ? stepUp(letterMastery(best, letter.ch)) : levelPick,
          })),
        ),
        Math.random,
      ),
    ).flat();

  const start = (items: Item[]) => {
    setDone([]);
    setQueue(items);
  };

  const planned = rounds * chosen().reduce((n, l) => n + formsFor(l).length, 0);

  if (queue && done.length < queue.length) {
    const item = queue[done.length];
    return (
      <div className="trace-session">
        <div className="ui session-head">
          <span>
            {done.length + 1} of {queue.length}
          </span>
          <div className="session-bar" aria-hidden="true">
            <span style={{ width: `${(100 * done.length) / queue.length}%` }} />
          </div>
          <button type="button" className="text-sm underline underline-offset-4" onClick={() => setQueue(null)}>
            End session
          </button>
        </div>
        <Tracer
          key={done.length}
          initial={{ index: LETTERS.indexOf(item.letter), form: item.form, level: item.level }}
          session={{ onFinish: (r) => setDone((d) => [...d, { ...item, score: r.score, passed: r.passed }]) }}
        />
      </div>
    );
  }

  if (queue) {
    const passed = done.filter((d) => d.passed).length;
    const scored = done.filter((d) => d.score !== null);
    const avg = scored.length ? Math.round(scored.reduce((n, d) => n + d.score!, 0) / scored.length) : 0;
    const missed = done.filter((d) => !d.passed);
    const pct = percent(passed, done.length);
    return (
      <div className="ui drill-panel" role="status">
        <p className="font-medium text-lg">
          {pct >= 90 ? "Beautifully written." : pct >= 70 ? "Well done." : pct >= 50 ? "Good progress." : "Keep going: every pass counts."}
        </p>
        <dl className="stat-grid mt-3">
          <div className="stat">
            <dt>Passed</dt>
            <dd>
              {passed} <span>of {done.length}</span>
            </dd>
          </div>
          <div className="stat">
            <dt>Average score</dt>
            <dd>{avg}%</dd>
          </div>
        </dl>
        <ul className="session-results">
          {done.map((d, i) => (
            <li key={i} className={d.passed ? "is-pass" : "is-miss"}>
              <span className="naskh session-glyph" lang="fa" dir="rtl">
                {formOf(d.letter, d.form)}
              </span>
              <span className="text-sm">
                {d.letter.name}, {FORM_LABELS[d.form].toLowerCase()}
                <br />
                <span className="text-muted">
                  {d.score === null ? "skipped" : `${d.score}% ${"★".repeat(starsFor(d.score))}`}
                </span>
              </span>
            </li>
          ))}
        </ul>
        <div className="mt-4 flex flex-wrap gap-2">
          <button type="button" className="drill-btn" onClick={() => start(build(chosen()))}>
            Again
          </button>
          {missed.length > 0 && (
            <button type="button" className="drill-btn drill-btn-quiet" onClick={() => start(shuffle(missed.map(({ letter, form, level }) => ({ letter, form, level })), Math.random))}>
              Retry the {missed.length} missed
            </button>
          )}
          <button type="button" className="drill-btn drill-btn-quiet" onClick={() => setQueue(null)}>
            Change the setup
          </button>
        </div>
      </div>
    );
  }

  const chip = <T extends string | number>(value: T, current: T, set: (v: T) => void, label: string) => (
    <button key={String(value)} type="button" className="chip" aria-pressed={value === current} onClick={() => set(value)}>
      {label}
    </button>
  );

  return (
    <div className="ui session-setup">
      <fieldset>
        <legend className="font-medium">Letters</legend>
        <div className="chips chips-wrap">
          {chip<Pick>("group", pick, setPick, "A lesson group")}
          {chip<Pick>("persian", pick, setPick, "Persian letters پ چ ژ گ")}
          {chip<Pick>("weakest", pick, setPick, "My weakest")}
          {chip<Pick>("custom", pick, setPick, "Choose")}
        </div>
        {pick === "group" && (
          <div className="chips chips-wrap mt-2">
            {DRILL_GROUPS.slice(0, 8).map((g, i) => (
              <button key={i} type="button" className="chip fa-chip" aria-pressed={group === i} onClick={() => setGroup(i)}>
                <span lang="fa" dir="rtl" className="fa">
                  {g.join(" ")}
                </span>
              </button>
            ))}
          </div>
        )}
        {pick === "custom" && (
          <div className="letter-strip letter-strip-wrap mt-2" dir="rtl" role="group" aria-label="Letters to trace">
            {LETTERS.map((l) => (
              <button
                key={l.ch}
                type="button"
                className="letter-strip-btn naskh"
                aria-pressed={custom.includes(l.ch)}
                aria-label={l.name}
                onClick={() => setCustom((c) => (c.includes(l.ch) ? c.filter((x) => x !== l.ch) : [...c, l.ch]))}
              >
                {l.ch}
              </button>
            ))}
          </div>
        )}
        {pick === "weakest" && (
          <p className="mt-2 text-sm text-muted">
            The six letters you have traced least well: <span className="fa" lang="fa">{weakest().map((l) => l.ch).join(" ")}</span>
          </p>
        )}
      </fieldset>

      <fieldset>
        <legend className="font-medium">Forms</legend>
        <div className="chips chips-wrap">
          {chip<FormPick>("all", formPick, setFormPick, "Every form")}
          {(["isolated", "initial", "medial", "final"] as Form[]).map((f) => chip<FormPick>(f, formPick, setFormPick, FORM_LABELS[f]))}
        </div>
        <p className="mt-1 text-sm text-muted">Letters that never join forward only have the isolated and final forms.</p>
      </fieldset>

      <fieldset>
        <legend className="font-medium">Level</legend>
        <div className="chips chips-wrap">
          {chip<LevelPick>("step", levelPick, setLevelPick, "Step up")}
          {TRACE_LEVELS.map((l) => chip<LevelPick>(l.id, levelPick, setLevelPick, l.label))}
        </div>
        <p className="mt-1 text-sm text-muted">
          {levelPick === "step"
            ? "Each letter one level above the hardest you have passed: new letters start guided."
            : TRACE_LEVELS.find((l) => l.id === levelPick)!.hint}
        </p>
      </fieldset>

      <fieldset>
        <legend className="font-medium">Rounds</legend>
        <div className="chips chips-wrap">{[1, 2, 3].map((n) => chip<number>(n, rounds, setRounds, `${n}×`))}</div>
      </fieldset>

      <button type="button" className="drill-btn" disabled={planned === 0} onClick={() => start(build(chosen()))}>
        Start: {planned} letter form{planned === 1 ? "" : "s"}
      </button>
      <p className="text-sm text-muted">A form passes at {PASS_SCORE}%. Skipping moves on without counting it as passed.</p>
    </div>
  );
}
