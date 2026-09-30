import type { Metadata } from "next";
import Link from "next/link";
import { VerbTables } from "@/components/verbs/VerbTables";
import { VerbTrainer, type TenseLesson } from "@/components/verbs/VerbTrainer";
import { ALL_LESSONS } from "@/content/units";
import { VERBS } from "@/content/verbs";
import { TENSES, type Tense } from "@/lib/conjugate";

export const metadata: Metadata = {
  title: "Verb trainer",
  description: `Conjugate ${VERBS.length} core Persian verbs in the present and the past tenses, spoken and written, with spaced repetition and typed answers.`,
};

/** The lesson behind each tense, where it is written already: only what the trainer's link needs. */
const tenseLessons = (): Partial<Record<Tense, TenseLesson>> => {
  const out: Partial<Record<Tense, TenseLesson>> = {};
  for (const t of TENSES) {
    const r = ALL_LESSONS.find((x) => x.key === t.lesson);
    if (r) out[t.id] = { number: r.number, title: r.lesson.title, href: r.href };
  }
  return out;
};

export default function VerbsPage() {
  return (
    <>
      <nav aria-label="Breadcrumb" className="ui breadcrumb">
        <Link href="/practice">Practice</Link>
        <span aria-hidden="true"> / </span>
        <span>Verb trainer</span>
      </nav>
      <h1 className="page-title mt-2">Verb trainer</h1>
      <p className="page-lede">
        Pick a tense. Each review shows a verb, a person, and whether to answer in spoken or written Persian; you type the form. A
        verb comes back just before you would forget it. The verbs open five at a time, starting with the ten most common (
        <Link href="/learn/present/ten-verbs" className="hl underline underline-offset-4">
          lesson 5.3
        </Link>
        ), and each tense opens when you finish its lesson.
      </p>

      <div className="mt-6">
        <VerbTrainer lessons={tenseLessons()} />
      </div>

      <h2 className="lesson-h2 mt-10">The verbs</h2>
      <p className="ui mt-1 text-sm text-muted">Every form the trainer asks, spoken and written. Pick a tense, then open a verb to see its tables.</p>
      <VerbTables />
    </>
  );
}
