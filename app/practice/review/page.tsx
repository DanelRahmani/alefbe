import type { Metadata } from "next";
import Link from "next/link";
import { ReviewQueueLoader } from "@/components/practice/Loaders";

export const metadata: Metadata = {
  title: "Review everything due",
  description: "One session with every card due in the Alefbe trainers, then the mistake notebook, each scheduled in its own deck.",
};

export default function ReviewPage() {
  return (
    <>
      <nav aria-label="Breadcrumb" className="ui breadcrumb">
        <Link href="/practice">Practice</Link>
        <span aria-hidden="true"> / </span>
        <span>Review everything due</span>
      </nav>
      <h1 className="page-title mt-2">Review everything due</h1>
      <p className="page-lede">
        One session for every deck: the letter and word trainer, the verbs, the vocabulary, cloze practice and spoken ↔ written,
        then the mistake notebook. Each card is asked as its own trainer asks it, and your answer is scheduled there.
      </p>
      <div className="mt-6">
        <ReviewQueueLoader />
      </div>
    </>
  );
}
