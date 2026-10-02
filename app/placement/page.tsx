import type { Metadata } from "next";
import { PlacementCheck, type PlacementLessonInfo, type PlacementQuestionInfo } from "@/components/placement/PlacementCheck";
import { LESSON_QUIZZES } from "@/content/lesson-quizzes";
import { PLACEMENT } from "@/content/placement";
import { ALL_LESSONS } from "@/content/units";
import { placementQuestions, refId } from "@/lib/placement";

export const metadata: Metadata = {
  title: "Placement check",
  description: "A short check, built from the lesson quizzes, that suggests where to start the Alefbe course if you already know some Persian.",
};

// Only the questions asked and a list of lessons go to the browser.
const QUESTIONS: Record<string, PlacementQuestionInfo> = Object.fromEntries(
  placementQuestions(PLACEMENT).map(({ ref }) => [refId(ref), { q: LESSON_QUIZZES[ref.lesson].questions[ref.q], lesson: ref.lesson }]),
);
const LESSONS: PlacementLessonInfo[] = ALL_LESSONS.map((r) => ({
  key: r.key,
  unit: r.unit.slug,
  number: r.number,
  title: r.lesson.title,
  href: r.href,
}));

export default function PlacementPage() {
  return (
    <>
      <p className="ui eyebrow">Already know some Persian?</p>
      <h1 className="page-title mt-2">Placement check</h1>
      <p className="page-lede">
        A few questions from each unit&apos;s lesson quizzes suggest where to start. Miss two on the same unit, and that unit is
        your starting point; get past them all, and you can mark the earlier lessons finished in one go.
      </p>
      <div className="mt-6">
        <PlacementCheck bands={PLACEMENT} questions={QUESTIONS} lessons={LESSONS} />
      </div>
    </>
  );
}
