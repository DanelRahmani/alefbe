import type { Metadata } from "next";
import Link from "next/link";
import { DrillOverview } from "@/components/drill/DrillOverview";
import { GameCards } from "@/components/games/GameCards";
import { MistakesCard } from "@/components/MistakesCard";
import { VerbOverview } from "@/components/verbs/VerbOverview";
import { VERBS } from "@/content/verbs";
import { VocabOverview } from "@/components/vocab/VocabOverview";
import { VOCAB_CARDS } from "@/content/vocab";
import { ClozeOverview } from "@/components/cloze/ClozeOverview";
import { CLOZE_CARDS } from "@/content/cloze";

export const metadata: Metadata = {
  title: "Practice",
  description: "Spaced-repetition trainers for the letters, the verbs, the vocabulary and the lessons' example lines, a quick letter quiz, tracing and games.",
};

export default function PracticePage() {
  return (
    <>
      <section className="page-head">
        <p className="ui eyebrow">Practice</p>
        <h1 className="page-title">Practise letters, verbs and words</h1>
        <p className="page-lede">
          The trainers schedule reviews so letters, verb forms and words stick: a card comes back just before you would forget it. The quiz,
          tracing and games are for extra practice whenever you like; they never change the schedule.
        </p>
      </section>

      <h2 className="lesson-h2 mt-8">Letter trainer</h2>
      <p className="ui mt-1 text-sm text-muted">Spaced repetition, typed answers. New letters open group by group.</p>
      <DrillOverview />

      <h2 className="lesson-h2 mt-10">Verb trainer</h2>
      <p className="ui mt-1 text-sm text-muted">{VERBS.length} core verbs in every tense of the core course, spoken and written. Verbs open five at a time, and each tense opens with its lesson.</p>
      <VerbOverview />

      <h2 className="lesson-h2 mt-10">Vocabulary deck</h2>
      <p className="ui mt-1 text-sm text-muted">The words of the lessons you have done, {VOCAB_CARDS.length} in all. See the English, type the Persian.</p>
      <VocabOverview cards={VOCAB_CARDS.map((c) => ({ id: c.id, lessons: c.lessons }))} />

      <h2 className="lesson-h2 mt-10">Cloze practice</h2>
      <p className="ui mt-1 text-sm text-muted">{CLOZE_CARDS.length} example lines from the lessons, each with a gap. Read the English, type the missing words.</p>
      <ClozeOverview cards={CLOZE_CARDS.map((c) => ({ id: c.id, lessons: c.lessons }))} />

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
