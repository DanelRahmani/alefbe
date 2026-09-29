import type { Metadata } from "next";
import Link from "next/link";
import { MistakeNotebook, type LessonQuiz } from "@/components/MistakeNotebook";
import { ALL_LESSONS } from "@/content/units";
import { plainOf, parseMarkup } from "@/lib/markup";

export const metadata: Metadata = {
  title: "Mistake notebook",
  description: "Everything you answered wrong in lessons, the trainer, the letter quiz and games, to review until it sticks.",
};

// Each lesson's quiz questions, so missed ones can be asked again here.
const LESSON_QUIZZES: Record<string, LessonQuiz> = Object.fromEntries(
  ALL_LESSONS.flatMap((r) => {
    const questions = r.lesson.blocks.flatMap((b) => (b.type === "quiz" ? b.questions : []));
    return questions.length
      ? [[r.key, { number: r.number, title: plainOf(parseMarkup(r.lesson.title)), href: r.href, questions }]]
      : [];
  }),
);

export default function MistakesPage() {
  return (
    <>
      <nav aria-label="Breadcrumb" className="ui breadcrumb">
        <Link href="/practice">Practice</Link>
        <span aria-hidden="true"> / </span>
        <span>Mistake notebook</span>
      </nav>
      <h1 className="page-title mt-2">Mistake notebook</h1>
      <p className="page-lede">
        Every wrong answer lands here: from lesson quizzes, the trainer, the letter quiz and the games. Answer an item right
        twice in a row, here or anywhere else, and it leaves the notebook.
      </p>
      <MistakeNotebook lessons={LESSON_QUIZZES} />
    </>
  );
}
