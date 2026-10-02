import type { Lesson, Unit } from "./types";
import { alphabet } from "./lessons/alphabet";
import { coreSentence } from "./lessons/core-sentence";
import { culture } from "./lessons/culture";
import { nouns } from "./lessons/nouns";
import { longerSentences } from "./lessons/longer-sentences";
import { moreVerbs } from "./lessons/more-verbs";
import { past } from "./lessons/past";
import { present } from "./lessons/present";
import { reading } from "./lessons/reading";
import { sounds } from "./lessons/sounds";
import { spelling } from "./lessons/spelling";
import { startHere } from "./lessons/start-here";
import { spokenWritten } from "./lessons/spoken-written";
import { wantCanMust } from "./lessons/want-can-must";
import { whereWhen } from "./lessons/where-when";

// The course order. A unit's number is its position here (Start here is 0),
// so every unit is listed even before its lessons are written.
export const UNITS: Unit[] = [
  {
    slug: "start-here",
    title: "Start here",
    titleFa: "اَز اینْجا شُروع کُنید",
    description: "How the course works, Persian in one page, and a fast track for people who already speak it.",
    lessons: startHere,
  },
  {
    slug: "alphabet",
    title: "The alphabet",
    titleFa: "اَلِفْبا",
    description: "All 32 letters in alphabet order, with their four joining forms, and the Persian digits.",
    lessons: alphabet,
  },
  {
    slug: "sounds",
    title: "Sounds and vowel marks",
    titleFa: "صِداها وَ حَرَکات",
    description: "Short and long vowels, و and ی as consonant or vowel, tashdid, sukun, hamze, and stress.",
    lessons: sounds,
  },
  {
    slug: "spelling",
    title: "Writing and spelling",
    titleFa: "نِوِشْتَن وَ اِمْلا",
    description: "The half-space, letters that share a sound, loanword patterns, punctuation and the keyboard.",
    lessons: spelling,
  },
  // Grammar in Pareto order: the core that covers most everyday sentences
  // first (Units 4–9), the rarer forms after (10–11). See docs/PLAN.md.
  {
    slug: "core-sentence",
    title: "The core sentence",
    titleFa: "جُمْلهٔ پایه",
    description: "The verb comes last and its ending says who; is and are; not; questions; my and your.",
    lessons: coreSentence,
  },
  {
    slug: "present",
    title: "Everyday verbs: the present",
    titleFa: "زَمانِ حال",
    description: "Two stems per verb, the present tense, the ten verbs you use most, not doing, to have, and compound verbs.",
    lessons: present,
  },
  {
    slug: "nouns",
    title: "Nouns and links",
    titleFa: "اِسْم وَ اِضافه",
    description: "The ezafe that links a noun to its describer or owner, plurals, “a” and “one”, and را on a specific object.",
    lessons: nouns,
  },
  {
    slug: "past",
    title: "Talking about the past",
    titleFa: "زَمانِ گُذَشْته",
    description: "The simple past, not in the past, the present perfect, the past continuous, and “in the middle of”.",
    lessons: past,
  },
  {
    slug: "want-can-must",
    title: "Want, can, must",
    titleFa: "خواسْتَن، تَوانِسْتَن، بایَد",
    description: "The subjunctive after want, can and must; commands; and the future.",
    lessons: wantCanMust,
  },
  {
    slug: "where-when",
    title: "Where, when, how much",
    titleFa: "کُجا، کَی، چَنْد",
    description: "Prepositions, place words, this and that, numbers, time and prices, and comparing.",
    lessons: whereWhen,
  },
  {
    slug: "longer-sentences",
    title: "Longer sentences",
    titleFa: "جُمْله‌هایِ بُلَنْد",
    description: "“The book that…”, clauses with که, if, the linking words, object endings and word-building. Beyond the core.",
    lessons: longerSentences,
  },
  {
    slug: "more-verbs",
    title: "More verb forms",
    titleFa: "فِعْل‌هایِ بیشْتَر",
    description: "The past perfect, the past subjunctive, unreal conditions, the passive and causatives. Beyond the core.",
    lessons: moreVerbs,
  },
  {
    slug: "spoken-written",
    title: "Spoken and written",
    titleFa: "گُفْتاری وَ نِوِشْتاری",
    description: "The regular changes between how Tehranis talk and how Persian is written.",
    lessons: spokenWritten,
  },
  {
    slug: "culture",
    title: "Culture in conversation",
    titleFa: "فَرْهَنْگ دَر [گُفْت‌وگو|goftogu]",
    description: "شُما and تُو, greetings, taarof, set phrases, names and the Persian calendar.",
    lessons: culture,
  },
  {
    slug: "reading",
    title: "Reading real texts",
    titleFa: "خوانْدَنِ مَتْنِ واقِعی",
    description: "Signs, a menu, messages, a headline, a short story and a line of Hafez, without vowel marks.",
    lessons: reading,
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
