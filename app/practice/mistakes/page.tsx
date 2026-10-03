import type { Metadata } from "next";
import Link from "next/link";
import { MistakeNotebookLoader } from "@/components/practice/Loaders";

export const metadata: Metadata = {
  title: "Mistake notebook",
  description: "Everything you answered wrong in lessons, the trainer, the letter quiz and games, to review until it sticks.",
};

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
      <MistakeNotebookLoader />
    </>
  );
}
