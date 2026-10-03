// Where the prerendered data files live (app/data/*/route.ts serve them;
// lib/static-data.ts fetches them). Kept apart so client code can import the
// paths without the content behind them.

export const DATA_URL = {
  practiceCards: "/data/practice-cards.json",
  review: "/data/review.json",
  vocabCards: "/data/vocab-cards.json",
  clozeCards: "/data/cloze-cards.json",
  convertCards: "/data/convert-cards.json",
  lessonQuizzes: "/data/lesson-quizzes.json",
  words: "/data/words.json",
  due: "/data/due.json",
} as const;
