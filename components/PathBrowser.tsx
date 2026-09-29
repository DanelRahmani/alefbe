"use client";

import Link from "next/link";
import { KIND_LABELS, type LessonKind } from "@/content/types";
import { useStore } from "@/lib/storage";
import { pathFilterStore, progressStore } from "@/lib/stores";
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
}

export interface PathUnit {
  slug: string;
  number: number;
  title: string;
  titleFa: string;
  description: string;
  lessons: PathLesson[];
}

export function PathBrowser({ units }: { units: PathUnit[] }) {
  const filter = useStore(pathFilterStore);
  const progress = useStore(progressStore);

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
      <div className="ui path-controls">
        <div className="chips" role="group" aria-label="Show lessons of type">
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
        <label className="hide-done">
          <input
            type="checkbox"
            checked={filter.hideDone}
            onChange={(e) => pathFilterStore.set((f) => ({ ...f, hideDone: e.target.checked }))}
          />
          Hide finished lessons
        </label>
        <p className="text-sm text-muted" aria-live="polite">
          {finished} of {total} lessons finished
        </p>
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
          {shown.map((u) => (
            <li key={u.slug} className="unit">
              <div className="girih" aria-hidden="true" />
              <header className="unit-head">
                <div>
                  <p className="ui eyebrow">Unit {u.number}</p>
                  <h2 className="unit-title">
                    <Rich text={u.title} translit={false} />
                  </h2>
                  <p className="unit-desc has-fa">
                    <Rich text={u.description} translit={false} />
                  </p>
                </div>
                <p className="unit-fa naskh" aria-hidden="true">
                  <FaText text={u.titleFa} translit="none" />
                </p>
              </header>
              {u.lessons.length === 0 ? (
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
                        {progress[l.key] && <Seal size={44} label="Finished" />}
                      </Link>
                    </li>
                  ))}
                </ol>
              )}
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}
