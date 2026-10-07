// The dictionary's sources: every lesson's vocabulary, then the trainer words,
// then the common words beyond the lessons (content/common-words).

import { buildDictionary, type DictEntry, type DictSource } from "@/lib/dictionary";
import { COMMON_WORDS } from "./common-words";
import { DRILL_WORDS } from "./drill-words";
import { ALL_LESSONS } from "./units";

const fromLessons: DictSource[] = ALL_LESSONS.flatMap((r) =>
  (r.lesson.vocab ?? []).map((v) => ({
    fa: v.written ?? v.fa,
    spoken: v.written ? v.fa : undefined,
    en: v.en,
    topic: v.topic,
    lesson: { href: r.href, number: r.number, title: r.lesson.title, unit: r.unit.slug },
  })),
);

const fromTrainer: DictSource[] = DRILL_WORDS.map((w) => ({ fa: w.fa, en: w.en, topic: w.topic, trainer: true }));

const fromCommon: DictSource[] = COMMON_WORDS.map((w) => ({ fa: w.fa, spoken: w.spoken, en: w.en, topic: w.topic, common: true }));

export const DICTIONARY: DictEntry[] = buildDictionary([...fromLessons, ...fromTrainer, ...fromCommon]);
