import type { Metadata } from "next";
import Link from "next/link";
import { LetterQuiz } from "@/components/quiz/LetterQuiz";

export const metadata: Metadata = {
  title: "Letter quiz",
  description: "Quick rounds on the Persian letters: names, sounds, joined forms and flashcards, by choice or typed.",
};

export default function QuizPage() {
  return (
    <>
      <nav aria-label="Breadcrumb" className="ui breadcrumb">
        <Link href="/practice">Practice</Link>
        <span aria-hidden="true"> / </span>
        <span>Letter quiz</span>
      </nav>
      <h1 className="page-title mt-2">Letter quiz</h1>
      <p className="page-lede">
        A quick round on names, sounds and joined forms. Wrong options are chosen from letters that look or sound alike,
        so the quiz trains the differences that matter.
      </p>
      <LetterQuiz />
    </>
  );
}
