import type { Topic } from "./topics";
import type { SyllableVowel } from "@/lib/persian/letters";

/** Persian with markup, fully vowel-marked (see content/STYLE.md). */
export type Fa = string;
/** English with markup; Persian runs inside it are detected automatically. */
export type Rich = string;

export type LessonKind =
  | "script"
  | "pronunciation"
  | "spelling"
  | "word-order"
  | "grammar"
  | "verbs"
  | "prepositions"
  | "suffixes"
  | "spoken"
  | "culture"
  | "reading";

export const KIND_LABELS: Record<LessonKind, string> = {
  script: "Script",
  pronunciation: "Pronunciation",
  spelling: "Spelling",
  "word-order": "Word order",
  grammar: "Grammar",
  verbs: "Verbs",
  prepositions: "Prepositions",
  suffixes: "Suffixes",
  spoken: "Spoken Persian",
  culture: "Culture",
  reading: "Reading",
};

/** Which Persian a lesson teaches. "both" shows spoken first, written beneath. */
export type Register = "spoken" | "written" | "both";

export const REGISTER_LABELS: Record<Register, string> = {
  spoken: "Spoken (Tehrani)",
  written: "Written",
  both: "Spoken and written",
};

export interface Example {
  /** The spoken form when the lesson's register is "both". */
  fa: Fa;
  /** The written form, shown beneath the spoken one. */
  written?: Fa;
  en: Rich;
  note?: Rich;
}

export interface DialogueLine {
  who: string;
  fa: Fa;
  written?: Fa;
  en: Rich;
}

export interface QuizQuestion {
  prompt: Rich;
  /** What the learner types: Persian script, transliteration, or English. */
  lang: "fa" | "translit" | "en";
  answers: string[];
  explain: Rich;
}

export type Block =
  | { type: "idea"; text: Rich }
  | { type: "heading"; text: Rich }
  | { type: "text"; text: Rich }
  | { type: "examples"; items: Example[] }
  | { type: "pair"; title?: Rich; a: Example; b: Example; diff: Rich }
  | { type: "table"; caption?: Rich; headers: Rich[]; rows: Rich[][] }
  | {
      type: "callout";
      kind: "mistake" | "culture" | "tip" | "dari";
      title?: string;
      text: Rich;
      wrong?: Example;
      right?: Example;
      /** Dari notes stay false until the owner has confirmed them. */
      checked?: boolean;
    }
  | { type: "dialogue"; title?: Rich; lines: DialogueLine[]; note?: Rich }
  | { type: "link"; href: string; label: string; text?: Rich }
  | { type: "quiz"; questions: QuizQuestion[] }
  /** Letter cards (forms, name, sound, key word) for letters of the alphabet. */
  | { type: "letters"; chars: string[] }
  /** Words built letter by letter: the separate letters, the form each takes, then the joined word. */
  | { type: "build"; items: { word: Fa; en: string }[] }
  /** A grid of consonants × vowels, generated and transliterated (بَ بِ بُ با بی بو). */
  | { type: "syllables"; consonants: string[]; vowels: SyllableVowel[]; caption?: Rich }
  /** Ways into practice for one drill group: trainer, quiz, tracing and games. */
  | { type: "practice"; group: number; text?: Rich }
  /** The Display settings (vowel marks, transliteration), inline. */
  | { type: "display" }
  /** Fast track: mark whole units finished and open trainer groups, after a confirmation. */
  | { type: "skip"; units: string[]; groups: number; label: string; text: Rich };

export interface VocabItem {
  fa: Fa;
  en: string;
  written?: Fa;
  /** Dictionary topic. */
  topic?: Topic;
}

export interface Lesson {
  slug: string;
  /** Plain English: what the lesson teaches. */
  title: string;
  summary: string;
  register: Register;
  kinds: LessonKind[];
  /** The reference(s) the lesson was checked against. */
  source: string;
  /** Script units show transliteration under examples regardless of the setting. */
  showTranslit?: boolean;
  /** Lessons about the vowel marks show every mark regardless of the setting. */
  showMarks?: boolean;
  vocab?: VocabItem[];
  blocks: Block[];
}

export interface Unit {
  slug: string;
  title: string;
  titleFa: Fa;
  description: string;
  lessons: Lesson[];
}
