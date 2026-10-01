"use client";

import Link from "next/link";
import { useId, useMemo } from "react";
import { modeInfo } from "@/lib/drill";
import { streak } from "@/lib/activity";
import { useStore } from "@/lib/storage";
import { activityStore, clozeStore, convertStore, mistakesStore, srsStore, todayStore, verbsStore, vocabStore } from "@/lib/stores";
import { GOALS, goalProgress, iranianDate, pickForDay, reviewHref, reviewsDue } from "@/lib/today";
import { useMinuteClock } from "./drill/useDrillClock";
import { FaText } from "./FaText";
import { StarButton } from "./StarButton";

export interface DayWord {
  fa: string;
  en: string;
  /** The dictionary entry's id, for the link. */
  id: string;
}

const RING_R = 26;
const RING_C = 2 * Math.PI * RING_R;

function GoalRing({ done, goal, fraction }: { done: number; goal: number; fraction: number }) {
  return (
    <svg className="goal-ring" viewBox="0 0 64 64" role="img" aria-label={`${done} of ${goal} activities today`}>
      <circle className="goal-ring-track" cx="32" cy="32" r={RING_R} />
      <circle
        className="goal-ring-fill"
        cx="32"
        cy="32"
        r={RING_R}
        strokeDasharray={RING_C}
        strokeDashoffset={RING_C * (1 - fraction)}
        transform="rotate(-90 32 32)"
      />
      <text x="32" y="32" className="goal-ring-num" aria-hidden="true">
        {done}
      </text>
    </svg>
  );
}

/**
 * The home page's day at a glance: reviews and mistakes waiting, the daily
 * goal, the streak, a word of the day and the date in the Iranian calendar.
 * Everything here depends on the clock and the browser's stores, so the
 * static HTML renders the frame and the numbers arrive on hydration.
 */
export function TodayCard({ words }: { words: DayWord[] }) {
  const now = useMinuteClock();
  const srs = useStore(srsStore);
  const verbs = useStore(verbsStore);
  const vocab = useStore(vocabStore);
  const cloze = useStore(clozeStore);
  const convert = useStore(convertStore);
  // The words still in the course: a vocabulary card whose word was removed is not counted.
  const known = useMemo(() => new Set(words.map((w) => w.id)), [words]);
  const activity = useStore(activityStore);
  const mistakes = Object.keys(useStore(mistakesStore)).length;
  const { goal } = useStore(todayStore);
  const id = useId();

  const ready = now > 0;
  const date = ready ? new Date(now) : null;
  const iran = date ? iranianDate(date) : null;
  const due = ready ? reviewsDue(srs.decks, now, verbs, { data: vocab, known }, { cloze, convert }) : null;
  const progress = date ? goalProgress(activity, date, goal) : { done: 0, goal, met: false, fraction: 0 };
  const days = date ? streak(activity, date) : 0;
  const word = date ? pickForDay(words, date) : undefined;

  return (
    <section className="today glass" aria-labelledby={`${id}-title`}>
      <header className="today-head">
        <h2 id={`${id}-title`} className="ui eyebrow">
          Today{iran && <span className="today-date-en"> · {iran.en}</span>}
        </h2>
        {iran && (
          <p className="today-date fa" lang="fa" dir="rtl">
            {iran.fa}
          </p>
        )}
      </header>

      <div className="today-body ui">
        <div className="today-goal">
          <GoalRing {...progress} />
          <div className="today-goal-text">
            <p className="today-goal-line">
              {progress.met ? "Goal met today" : `${progress.done} of ${progress.goal} today`}
            </p>
            <div className="goal-chips" role="group" aria-label="Daily goal">
              {GOALS.map((g) => (
                <button
                  key={g}
                  type="button"
                  className="goal-chip"
                  aria-pressed={goal === g}
                  onClick={() => todayStore.set({ goal: g })}
                >
                  {g}
                </button>
              ))}
            </div>
          </div>
        </div>

        <ul className="today-list">
          <li>
            <span className="today-stat">{days}</span>
            <span>
              {days === 0
                ? "day streak: practise today to start one"
                : progress.done === 0
                  ? `${days === 1 ? "day" : "days"} in a row: practise today to keep it`
                  : `${days === 1 ? "day" : "days"} in a row`}
            </span>
          </li>
          <li>
            <span className="today-stat">{due?.total ?? 0}</span>
            {due?.top ? (
              <span>
                <Link href="/practice/review">{due.total === 1 ? "review" : "reviews"} due in the trainers →</Link>{" "}
                <span className="text-muted">
                  (most in{" "}
                  <Link href={reviewHref(due.top)}>
                    {due.top === "verbs" ? "Verbs" : due.top === "vocab" ? "Vocabulary" : due.top === "cloze" ? "Cloze practice" : due.top === "convert" ? "Spoken and written" : modeInfo(due.top).title}
                  </Link>
                  )
                </span>
              </span>
            ) : (
              <span className="text-muted">reviews due in the trainers</span>
            )}
          </li>
          <li>
            <span className="today-stat">{mistakes}</span>
            {mistakes > 0 ? (
              <Link href="/practice/mistakes">{mistakes === 1 ? "mistake" : "mistakes"} to go over →</Link>
            ) : (
              <span className="text-muted">mistakes waiting in the notebook</span>
            )}
          </li>
        </ul>
      </div>

      <div className="today-word">
        <p className="ui eyebrow">Word of the day</p>
        {word ? (
          <div className="today-word-row">
            <p className="today-word-fa has-fa">
              <FaText text={word.fa} alwaysTranslit />
            </p>
            <p className="today-word-en">{word.en}</p>
            <span className="today-word-tools ui">
              <StarButton item={{ fa: word.fa, en: word.en, source: "Word of the day", href: `/dictionary?q=${encodeURIComponent(word.id)}` }} />
              <Link href={`/dictionary?q=${encodeURIComponent(word.id)}`} className="today-word-link">
                In the dictionary →
              </Link>
            </span>
          </div>
        ) : (
          <div className="today-word-row today-word-empty" />
        )}
      </div>
    </section>
  );
}
