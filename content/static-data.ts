// What the /data/*.json routes serve (lib/static-data.ts fetches them). The
// shapes are exactly what the pages used to pass as props, so nothing in the
// trainers changes; only the pages' HTML gets smaller.

import type { DayWord } from "@/components/TodayCard";
import { clozeAsk } from "@/lib/cloze";
import { convertAsk } from "@/lib/convert";
import type { DictData, DictEntry } from "@/lib/dictionary";
import { CLOZE_CARDS } from "./cloze";
import { CONVERT_CARDS } from "./convert";
import { DICTIONARY } from "./dictionary";
import { LESSON_QUIZZES } from "./lesson-quizzes";
import { VOCAB_CARDS } from "./vocab";

/** The practice hub's counts: each card's id and lessons, nothing to ask with. */
export const practiceCards = () => ({
  vocab: VOCAB_CARDS.map((c) => ({ id: c.id, lessons: c.lessons })),
  cloze: CLOZE_CARDS.map((c) => ({ id: c.id, lessons: c.lessons })),
  convert: CONVERT_CARDS.map((c) => ({ id: c.id, lessons: c.lessons, ...(c.only ? { only: c.only } : {}) })),
});
export type PracticeCards = ReturnType<typeof practiceCards>;

/** The review queue: what it needs to ask each card; the lesson lists stay on the server. */
export const reviewData = () => ({
  lessons: LESSON_QUIZZES,
  vocab: VOCAB_CARDS.map((c) => ({ id: c.id, fa: c.fa, spoken: c.spoken, en: c.en, hint: c.hint, translit: c.translit })),
  cloze: CLOZE_CARDS.map(clozeAsk),
  convert: CONVERT_CARDS.map(convertAsk),
});
export type ReviewData = ReturnType<typeof reviewData>;

/** The word of the day is picked in the browser, by its date, from these. */
export const dayWords = (): DayWord[] => DICTIONARY.map((e) => ({ fa: e.fa, en: e.en, id: e.id }));

/** The dictionary page's full list, without the search keys (the browser rebuilds them). */
export const dictionaryData = (): DictData[] =>
  DICTIONARY.map((e) => {
    const data: Partial<DictEntry> = { ...e };
    delete data.keys;
    return data as DictData;
  });

export { CLOZE_CARDS, CONVERT_CARDS, LESSON_QUIZZES, VOCAB_CARDS };
