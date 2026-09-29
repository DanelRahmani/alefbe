import type { Lesson, Unit } from "./types";
import { prepositions } from "./lessons/prepositions";

// The course order. A unit's number is its position here (Start here is 0),
// so every unit is listed even before its lessons are written.
export const UNITS: Unit[] = [
  {
    slug: "start-here",
    title: "Start here",
    titleFa: "اَز اینْجا شُروع کُنید",
    description: "How the course works, Persian in one page, and a fast track for people who already speak it.",
    lessons: [],
  },
  {
    slug: "alphabet",
    title: "The alphabet",
    titleFa: "اَلِفْبا",
    description: "All 32 letters in alphabet order, with their four joining forms, and the Persian digits.",
    lessons: [],
  },
  {
    slug: "sounds",
    title: "Sounds and vowel marks",
    titleFa: "صِداها وَ حَرَکات",
    description: "Short and long vowels, و and ی as consonant or vowel, tashdid, sukun, hamze, and stress.",
    lessons: [],
  },
  {
    slug: "spelling",
    title: "Writing and spelling",
    titleFa: "نِوِشْتَن وَ اِمْلا",
    description: "The half-space, letters that share a sound, loanword patterns, punctuation and the keyboard.",
    lessons: [],
  },
  {
    slug: "word-order",
    title: "Word order",
    titleFa: "تَرْتیبِ کَلَمات",
    description: "The core sentence: the verb comes last, and its ending says who.",
    lessons: [],
  },
  {
    slug: "ezafe",
    title: "The ezafe",
    titleFa: "اِضافه",
    description: "The linking -e that joins a noun to what describes or owns it.",
    lessons: [],
  },
  {
    slug: "prepositions",
    title: "Prepositions and را",
    titleFa: "حُروفِ اِضافه وَ «را»",
    description: "The object marker را, and the small words that say where, with whom and for whom.",
    lessons: prepositions,
  },
  {
    slug: "core-grammar",
    title: "Core grammar",
    titleFa: "دَسْتورِ پایه",
    description: "To be and to have, pronouns, comparison, pointing words, questions and numbers.",
    lessons: [],
  },
  {
    slug: "verbs",
    title: "Verbs",
    titleFa: "فِعْل‌ها",
    description: "Two stems, every A2 tense, the subjunctive, commands and compound verbs.",
    lessons: [],
  },
  {
    slug: "suffixes",
    title: "Suffixes",
    titleFa: "پَسْوَنْدْها",
    description: "Plurals, possessive and object endings, the indefinite ـی and word-building.",
    lessons: [],
  },
  {
    slug: "spoken-written",
    title: "Spoken and written",
    titleFa: "گُفْتاری وَ نِوِشْتاری",
    description: "The regular changes between how Tehranis talk and how Persian is written.",
    lessons: [],
  },
  {
    slug: "culture",
    title: "Culture in conversation",
    titleFa: "فَرْهَنْگ دَر [گُفْت‌وگو|goftogu]",
    description: "شُما and تُو, greetings, taarof, set phrases, names and the Persian calendar.",
    lessons: [],
  },
  {
    slug: "reading",
    title: "Reading real texts",
    titleFa: "خوانْدَنِ مَتْنِ واقِعی",
    description: "Signs, a menu, messages, a headline, a short story and a line of Hafez, without vowel marks.",
    lessons: [],
  },
];

export interface LessonRef {
  unit: Unit;
  unitIndex: number;
  lesson: Lesson;
  lessonIndex: number;
  /** "6.1" */
  number: string;
  key: string;
  href: string;
}

export const ALL_LESSONS: LessonRef[] = UNITS.flatMap((unit, unitIndex) =>
  unit.lessons.map((lesson, lessonIndex) => ({
    unit,
    unitIndex,
    lesson,
    lessonIndex,
    number: `${unitIndex}.${lessonIndex + 1}`,
    key: `${unit.slug}/${lesson.slug}`,
    href: `/learn/${unit.slug}/${lesson.slug}`,
  })),
);

export function findLesson(unitSlug: string, lessonSlug: string): LessonRef | undefined {
  return ALL_LESSONS.find((r) => r.unit.slug === unitSlug && r.lesson.slug === lessonSlug);
}

const PERSIAN_DIGITS = "۰۱۲۳۴۵۶۷۸۹";
/** "6.1" → "۶٫۱" (Persian digits and decimal separator). */
export const faNumber = (n: string) => n.replace(/\d/g, (d) => PERSIAN_DIGITS[+d]).replace(".", "٫");
