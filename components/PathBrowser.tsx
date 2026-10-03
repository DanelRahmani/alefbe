"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { KIND_LABELS, type LessonKind } from "@/content/types";
import { DRILL_GROUPS } from "@/lib/persian/letters";
import { faNumber } from "@/lib/persian/chars";
import { deckStats, unlockedIds } from "@/lib/srs";
import { useStore } from "@/lib/storage";
import { deckOf, lessonsStore, pathFilterStore, placementStore, progressStore, srsStore } from "@/lib/stores";
import { useMinuteClock } from "./drill/useDrillClock";
import { Seal } from "./Seal";
import { TodayCard } from "./TodayCard";

// The text arrives rendered (the page renders Rich and FaText on the server),
// so hydrating the path doesn't parse every title's markup again in the
// browser. The link and the Persian number are derived here.
export interface PathLesson {
  key: string;
  number: string;
  title: ReactNode;
  summary: ReactNode;
  /** A short Persian mark for the lesson (its key word), rendered. */
  mark: ReactNode;
  kinds: LessonKind[];
}

const lessonHref = (key: string) => `/learn/${key}`;

export interface PathUnit {
  slug: string;
  number: number;
  numberFa: string;
  title: ReactNode;
  titleFa: ReactNode;
  description: ReactNode;
  lessons: PathLesson[];
}

function NextCard({ units, progress, last }: { units: PathUnit[]; progress: Record<string, true>; last?: string }) {
  const all = units.flatMap((u) => u.lessons.map((l) => ({ ...l, unitTitle: u.title })));
  if (!all.length) return null;
  const started = all.some((l) => progress[l.key]);
  // The lesson opened last, if it isn't finished; otherwise the first unfinished one.
  const resume = all.find((l) => l.key === last && !progress[l.key]);
  const next = resume ?? all.find((l) => !progress[l.key]);
  if (!next) {
    return (
      <Link href="/practice" className="panel card-link next-card">
        <span className="next-mark" aria-hidden="true">
          <Seal size={64} />
        </span>
        <span className="next-text">
          <span className="ui eyebrow">Every lesson finished</span>
          <span className="next-title">Every lesson carries its seal.</span>
          <span className="next-summary">Keep the letters sharp in the trainer, or revisit any lesson below.</span>
        </span>
        <span className="next-arrow" aria-hidden="true">
          →
        </span>
      </Link>
    );
  }
  const target = next;
  const label = resume ? "Continue" : started ? "Next lesson" : "First lesson";
  return (
    <Link href={lessonHref(target.key)} className="panel card-link next-card">
      <span className="next-mark display-fa" aria-hidden="true">
        {target.mark}
      </span>
      <span className="next-text">
        <span className="ui eyebrow">
          {label} · {target.number} · {target.unitTitle}
        </span>
        <span className="next-title has-fa">
          {target.title}
        </span>
        <span className="next-summary">
          {target.summary}
        </span>
      </span>
      <span className="next-arrow" aria-hidden="true">
        →
      </span>
    </Link>
  );
}

/** The path, with the next-lesson card and the Today card on top. */
export function PathBrowser({ units }: { units: PathUnit[] }) {
  const filter = useStore(pathFilterStore);
  const progress = useStore(progressStore);
  const lessons = useStore(lessonsStore);
  const srs = useStore(srsStore);
  const placement = useStore(placementStore);
  const now = useMinuteClock();

  const soundDeck = deckOf(srs, "sound");
  const due = deckStats(unlockedIds(DRILL_GROUPS, soundDeck), soundDeck, now).due;

  const kindsPresent = (Object.keys(KIND_LABELS) as LessonKind[]).filter((k) =>
    units.some((u) => u.lessons.some((l) => l.kinds.includes(k))),
  );
  const filtering = filter.kind !== "all" || filter.hideDone;

  const shown = units
    .map((u) => ({
      ...u,
      lessons: u.lessons.filter(
        (l) => (filter.kind === "all" || l.kinds.includes(filter.kind)) && !(filter.hideDone && progress[l.key]),
      ),
    }))
    .filter((u) => !filtering || u.lessons.length > 0);

  const total = units.reduce((n, u) => n + u.lessons.length, 0);
  const finished = units.reduce((n, u) => n + u.lessons.filter((l) => progress[l.key]).length, 0);

  return (
    <div>
      <NextCard units={units} progress={progress} last={lessons.last} />
      {finished === 0 && !placement.last && (
        <p className="ui placement-offer">
          Already know some Persian?{" "}
          <Link href="/placement" className="underline underline-offset-4">
            Take the placement check
          </Link>{" "}
          to find where to start.
        </p>
      )}
      <TodayCard />

      <div className="ui quick-links">
        <Link href="/practice/drill/sound" className="pill-link">
          <span className="pill-count" aria-label={`${due} due`}>
            {due}
          </span>
          Letter trainer <span aria-hidden="true">→</span>
        </Link>
        <Link href="/practice/trace" className="pill-link">
          <span className="pill-count pill-count-quiet display-fa" aria-hidden="true">
            ب
          </span>
          Trace the letters <span aria-hidden="true">→</span>
        </Link>
        <Link href="/grammar" className="pill-link">
          <span className="pill-count pill-count-quiet display-fa" aria-hidden="true">
            د
          </span>
          Grammar at a glance <span aria-hidden="true">→</span>
        </Link>
      </div>

      <div className="ui path-head">
        <h2 className="eyebrow">
          The path · {finished}/{total} finished
        </h2>
        <label className="hide-done">
          <input
            type="checkbox"
            checked={filter.hideDone}
            onChange={(e) => pathFilterStore.set((f) => ({ ...f, hideDone: e.target.checked }))}
          />
          Hide finished lessons
        </label>
      </div>
      <div className="ui chips" role="group" aria-label="Show lessons of type">
        {(["all", ...kindsPresent] as const).map((k) => (
          <button
            key={k}
            type="button"
            aria-pressed={filter.kind === k}
            onClick={() => pathFilterStore.set((f) => ({ ...f, kind: k }))}
            className="chip"
          >
            {k === "all" ? "All" : KIND_LABELS[k]}
          </button>
        ))}
      </div>

      {shown.length === 0 ? (
        <div className="ui panel panel-dashed empty-state">
          <p className="font-medium">No lessons match these filters.</p>
          <button type="button" className="chip mt-3" onClick={() => pathFilterStore.set({ kind: "all", hideDone: false })}>
            Show all lessons
          </button>
        </div>
      ) : (
        <ol className="units">
          {shown.map((u) => {
            const done = u.lessons.filter((l) => progress[l.key]).length;
            const empty = u.lessons.length === 0;
            return (
              <li
                key={u.slug}
                id={u.slug}
                className={empty ? "panel panel-dashed unit-card unit-card-empty" : done === u.lessons.length ? "panel unit-card unit-done" : "panel unit-card"}
              >
                <header className="unit-head">
                  <span className="unit-num khatam" aria-hidden="true">
                    {u.numberFa}
                  </span>
                  <div className="unit-head-text">
                    <p className="ui eyebrow">
                      Unit {u.number}
                      {!empty && (
                        <span className="unit-count">
                          {" "}
                          · {done}/{u.lessons.length}
                        </span>
                      )}
                      {!empty && (
                        <span className="girih-band" aria-hidden="true">
                          {u.lessons.map((l) => (
                            <span key={l.key} className={progress[l.key] ? "khatam girih-star is-done" : "khatam girih-star"} />
                          ))}
                        </span>
                      )}
                    </p>
                    <h3 className="unit-title">
                      {u.title}
                    </h3>
                    <p className="unit-desc has-fa">
                      {u.description}
                    </p>
                  </div>
                  <p className="unit-fa display-fa" aria-hidden="true">
                    {u.titleFa}
                  </p>
                </header>
                {empty ? (
                  <p className="ui coming-soon">Lessons in preparation</p>
                ) : (
                  <ol
                    className="lessons"
                    // Until it is drawn, a generous height per lesson: never less than the real one,
                    // so nothing below it is ever overlapped (content-visibility, components.css).
                    style={{ containIntrinsicBlockSize: `auto ${u.lessons.length * 12}rem` }}
                  >
                    {u.lessons.map((l) => (
                      <li key={l.key}>
                        <Link href={lessonHref(l.key)} className="lesson-row">
                          <span className="lesson-row-num ui">
                            <span>{l.number}</span>
                            <span className="fa" lang="fa">
                              {faNumber(l.number)}
                            </span>
                          </span>
                          <span className="lesson-row-text">
                            <span className="lesson-row-title has-fa">
                              {l.title}
                            </span>
                            <span className="lesson-row-summary">
                              {l.summary}
                            </span>
                            {lessons.quiz[l.key] && (
                              <span className="ui lesson-row-quiz">
                                Quiz: {lessons.quiz[l.key].right} of {lessons.quiz[l.key].total} right first time
                              </span>
                            )}
                          </span>
                          {progress[l.key] ? (
                            <Seal size={44} label="Finished" />
                          ) : (
                            <span className="todo-ring" aria-label="Not finished yet" role="img" />
                          )}
                        </Link>
                      </li>
                    ))}
                  </ol>
                )}
              </li>
            );
          })}
        </ol>
      )}
    </div>
  );
}
