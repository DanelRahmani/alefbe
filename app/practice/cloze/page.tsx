import type { Metadata } from "next";
import Link from "next/link";
import { ClozeTrainer } from "@/components/cloze/ClozeTrainer";
import { CLOZE_CARDS } from "@/content/cloze";

export const metadata: Metadata = {
  title: "Cloze practice",
  description: "Fill the gaps in the example lines of every Alefbe lesson you have done, with spaced repetition.",
};

export default function ClozePage() {
  return (
    <>
      <nav aria-label="Breadcrumb" className="ui breadcrumb">
        <Link href="/practice">Practice</Link>
        <span aria-hidden="true"> / </span>
        <span>Cloze practice</span>
      </nav>
      <h1 className="page-title mt-2">Cloze practice</h1>
      <p className="page-lede">
        Each review shows an example line from a lesson with the part the lesson highlights taken out, and its English beneath. Type
        the missing words. Where a lesson gives a line in speech and in writing, you see the spoken line, and the written words count
        too. A lesson&apos;s lines join the deck when you mark the lesson done.
      </p>
      <div className="mt-6">
        <ClozeTrainer cards={CLOZE_CARDS} />
      </div>
    </>
  );
}
