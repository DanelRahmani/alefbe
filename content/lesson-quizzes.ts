// Each lesson's quiz questions, so missed ones can be asked again in the
// mistake notebook and the review queue.

import type { LessonQuiz } from "@/components/MistakeNotebook";
import { parseMarkup, plainOf } from "@/lib/markup";
import { ALL_LESSONS } from "./units";

export const LESSON_QUIZZES: Record<string, LessonQuiz> = Object.fromEntries(
  ALL_LESSONS.flatMap((r) => {
    const questions = r.lesson.blocks.flatMap((b) => (b.type === "quiz" ? b.questions : []));
    return questions.length
      ? [[r.key, { number: r.number, title: plainOf(parseMarkup(r.lesson.title)), href: r.href, questions }]]
      : [];
  }),
);
