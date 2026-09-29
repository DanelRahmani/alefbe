import type { Metadata } from "next";
import Link from "next/link";
import { DrillOverview } from "@/components/drill/DrillOverview";
import { GameCards } from "@/components/games/GameCards";

export const metadata: Metadata = {
  title: "Practice",
  description: "The spaced-repetition letter trainer, a quick letter quiz, tracing and games for the Persian script.",
};

export default function PracticePage() {
  return (
    <>
      <section className="page-head">
        <p className="ui eyebrow">Practice</p>
        <h1 className="page-title">Practise the script</h1>
        <p className="page-lede">
          The trainer schedules reviews so letters stick: a card comes back just before you would forget it. The quiz,
          tracing and games are for extra practice whenever you like; they never change the schedule.
        </p>
      </section>

      <h2 className="lesson-h2 mt-8">Letter trainer</h2>
      <p className="ui mt-1 text-sm text-muted">Spaced repetition, typed answers. New letters open group by group.</p>
      <DrillOverview />

      <h2 className="lesson-h2 mt-10">Quick practice</h2>
      <ul className="drill-modes">
        <li>
          <Link href="/practice/quiz" className="drill-mode">
            <span className="drill-mode-title">Letter quiz</span>
            <span className="drill-mode-blurb">Names, sounds, joined forms and flashcards, by choice or typed.</span>
          </Link>
        </li>
        <li>
          <Link href="/practice/trace" className="drill-mode">
            <span className="drill-mode-title">Tracing</span>
            <span className="drill-mode-blurb">Write any letter in any form, guided, in outline or from memory.</span>
          </Link>
        </li>
        <li>
          <Link href="/practice/trace/session" className="drill-mode">
            <span className="drill-mode-title">Tracing session</span>
            <span className="drill-mode-blurb">A set of letters and forms one after another, with a summary at the end.</span>
          </Link>
        </li>
      </ul>

      <h2 id="games" className="lesson-h2 mt-10">
        Games
      </h2>
      <GameCards />
    </>
  );
}
