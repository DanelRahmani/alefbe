"use client";

import Link from "next/link";
import { KIND_LABELS, type LessonKind } from "@/content/types";
import { DRILL_GROUPS } from "@/lib/drill";
import { deckStats, unlockedIds } from "@/lib/srs";
import { useStore } from "@/lib/storage";
import { deckOf, pathFilterStore, progressStore, srsStore } from "@/lib/stores";
import { useMinuteClock } from "./drill/useDrillClock";
import { FaText } from "./FaText";
import { Rich } from "./Rich";
import { Seal } from "./Seal";

export interface PathLesson {
  key: string;
  href: string;
  number: string;
  numberFa: string;
  title: string;
  summary: string;
  kinds: LessonKind[];
  /** A short Persian mark for the lesson (its key word). */
  mark: string;
  unitTitle: string;
}

export interface PathUnit {
  slug: string;
  number: number;
  numberFa: string;
  title: string;
  titleFa: string;
  description: string;
  lessons: PathLesson[];
}

function NextCard({ units, progress }: { units: PathUnit[]; progress: Record<string, true> }) {
  const all = units.flatMap((u) => u.lessons);
  if (!all.length) return null;
  const started = all.some((l) => progress[l.key]);
  const next = all.find((l) => !progress[l.key]);
  if (!next) {
    return (
      <Link href="/practice" className="next-card glass">
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
  const label = started ? "Next lesson" : "First lesson";
  return (
    <Link href={target.href} className="next-card glass">
      <span className="next-mark naskh" aria-hidden="true">
        <FaText text={target.mark} translit="none" force="none" />
      </span>
      <span className="next-text">
        <span className="ui eyebrow">
          {label} · {target.number} · <Rich text={target.unitTitle} translit={false} />
        </span>
        <span className="next-title has-fa">
          <Rich text={target.title} translit={false} />
        </span>
        <span className="next-summary">
          <Rich text={target.summary} translit={false} />
        </span>
      </span>
      <span className="next-arrow" aria-hidden="true">
        →
      </span>
    </Link>
  );
}

export function PathBrowser({ units }: { units: PathUnit[] }) {
  const filter = useStore(pathFilterStore);
  const progress = useStore(progressStore);
  const srs = useStore(srsStore);
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
      <NextCard units={units} progress={progress} />

      <div className="ui quick-links">
        <Link href="/practice/drill/sound" className="pill-link">
          <span className="pill-count" aria-label={`${due} due`}>
            {due}
          </span>
          Letter trainer <span aria-hidden="true">→</span>
        </Link>
        <Link href="/practice/trace" className="pill-link">
          <span className="pill-count pill-count-quiet naskh" aria-hidden="true">
            ب
          </span>
          Trace the letters <span aria-hidden="true">→</span>
        </Link>
        <Link href="/grammar" className="pill-link">
          <span className="pill-count pill-count-quiet naskh" aria-hidden="true">
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
        <div className="ui empty-state">
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
              <li key={u.slug} id={u.slug} className={empty ? "unit-card unit-card-empty" : "unit-card"}>
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
                    </p>
                    <h3 className="unit-title">
                      <Rich text={u.title} translit={false} />
                    </h3>
                    <p className="unit-desc has-fa">
                      <Rich text={u.description} translit={false} />
                    </p>
                  </div>
                  <p className="unit-fa naskh" aria-hidden="true">
                    <FaText text={u.titleFa} translit="none" force="none" />
                  </p>
                </header>
                {empty ? (
                  <p className="ui coming-soon">Lessons in preparation</p>
                ) : (
                  <ol className="lessons">
                    {u.lessons.map((l) => (
                      <li key={l.key}>
                        <Link href={l.href} className="lesson-row">
                          <span className="lesson-row-num ui">
                            <span>{l.number}</span>
                            <span className="fa" lang="fa">
                              {l.numberFa}
                            </span>
                          </span>
                          <span className="lesson-row-text">
                            <span className="lesson-row-title has-fa">
                              <Rich text={l.title} translit={false} />
                            </span>
                            <span className="lesson-row-summary">
                              <Rich text={l.summary} translit={false} />
                            </span>
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
