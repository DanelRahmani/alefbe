import type { Metadata } from "next";
import Link from "next/link";
import { DrillOverview } from "@/components/drill/DrillOverview";
import { GameCards } from "@/components/games/GameCards";
import { MistakesCard } from "@/components/MistakesCard";
import { VerbOverview } from "@/components/verbs/VerbOverview";
import { VERBS } from "@/content/verbs";

export const metadata: Metadata = {
  title: "Practice",
  description: "Spaced-repetition trainers for the letters and the verbs, a quick letter quiz, tracing and games.",
};

export default function PracticePage() {
  return (
    <>
      <section className="page-head">
        <p className="ui eyebrow">Practice</p>
        <h1 className="page-title">Practise letters and verbs</h1>
        <p className="page-lede">
          The trainers schedule reviews so letters and verb forms stick: a card comes back just before you would forget it. The quiz,
          tracing and games are for extra practice whenever you like; they never change the schedule.
        </p>
      </section>

      <h2 className="lesson-h2 mt-8">Letter trainer</h2>
      <p className="ui mt-1 text-sm text-muted">Spaced repetition, typed answers. New letters open group by group.</p>
      <DrillOverview />

      <h2 className="lesson-h2 mt-10">Verb trainer</h2>
      <p className="ui mt-1 text-sm text-muted">The present and the past tenses of {VERBS.length} core verbs, spoken and written. Verbs open five at a time, and each tense opens with its lesson.</p>
      <VerbOverview />

      <h2 className="lesson-h2 mt-10">Quick practice</h2>
      <ul className="drill-modes">
        <li>
          <MistakesCard />
        </li>
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
        <li>
          <Link href="/practice/sheets" className="drill-mode">
            <span className="drill-mode-title">Tracing sheets</span>
            <span className="drill-mode-blurb">Print the letters in every form to trace on paper, with a key word each.</span>
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
