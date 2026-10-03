import type { Metadata } from "next";
import Link from "next/link";
import { VocabTrainerLoader } from "@/components/practice/Loaders";

export const metadata: Metadata = {
  title: "Vocabulary deck",
  description: "The words of every Alefbe lesson you have done, with spaced repetition: see the English, type the Persian.",
};

export default function VocabPage() {
  return (
    <>
      <nav aria-label="Breadcrumb" className="ui breadcrumb">
        <Link href="/practice">Practice</Link>
        <span aria-hidden="true"> / </span>
        <span>Vocabulary deck</span>
      </nav>
      <h1 className="page-title mt-2">Vocabulary deck</h1>
      <p className="page-lede">
        Each review shows a word&apos;s English; you type the Persian, in its written or its spoken form. A lesson&apos;s words join
        the deck when you mark the lesson done, and each comes back just before you would forget it. Where two words share an
        English meaning, the prompt says how the one wanted begins. All the words are also in the{" "}
        <Link href="/dictionary" className="hl underline underline-offset-4">
          dictionary
        </Link>
        .
      </p>
      <div className="mt-6">
        <VocabTrainerLoader />
      </div>
    </>
  );
}
