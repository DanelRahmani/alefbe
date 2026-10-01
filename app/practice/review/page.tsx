import type { Metadata } from "next";
import Link from "next/link";
import { ReviewQueue } from "@/components/review/ReviewQueue";
import { CLOZE_CARDS } from "@/content/cloze";
import { CONVERT_CARDS } from "@/content/convert";
import { LESSON_QUIZZES } from "@/content/lesson-quizzes";
import { VOCAB_CARDS } from "@/content/vocab";
import { clozeAsk } from "@/lib/cloze";
import { convertAsk } from "@/lib/convert";

export const metadata: Metadata = {
  title: "Review everything due",
  description: "One session with every card due in the Alefbe trainers, then the mistake notebook, each scheduled in its own deck.",
};

// What the queue needs to ask a card; the lesson lists stay on the server.
const VOCAB = VOCAB_CARDS.map((c) => ({ id: c.id, fa: c.fa, spoken: c.spoken, en: c.en, hint: c.hint, translit: c.translit }));
const CLOZE = CLOZE_CARDS.map(clozeAsk);
const CONVERT = CONVERT_CARDS.map(convertAsk);

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
        <ReviewQueue lessons={LESSON_QUIZZES} vocab={VOCAB} cloze={CLOZE} convert={CONVERT} />
      </div>
    </>
  );
}
