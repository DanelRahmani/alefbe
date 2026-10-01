"use client";

import type { LessonKind } from "@/content/types";
import type { VowelMode } from "./persian/marks";
import { SETTINGS_KEY, type FaFont, type TextSize } from "./prepaint";
import { createPersistentStore } from "./storage";
import { emptyDeck, type DeckState } from "./srs";
import type { DrillMode } from "./drill";
import { emptyActivity, record, type ActivityData, type ActivityEvent } from "./activity";
import { migrateTraceV1 } from "./trace";
import { DEFAULT_QUIZ, type QuizSetup } from "./quiz";
import { noteAnswer, type MistakeItem, type Notebook } from "./mistakes";
import type { Starred } from "./starred";
import { DEFAULT_GOAL, type DailyGoal } from "./today";
import { emptyVerbsData, type VerbsData } from "./verb-drill";
import { emptyVocabData, type VocabData } from "./vocab";
import { emptyClozeData, type ClozeData } from "./cloze";
import { emptyConvertData, type ConvertData } from "./convert";

export type Theme = "system" | "light" | "dark";

export interface Settings {
  vowels: VowelMode;
  translit: boolean;
  theme: Theme;
  size: TextSize;
  faFont: FaFont;
}

export const DEFAULT_SETTINGS: Settings = { vowels: "all", translit: false, theme: "system", size: "m", faFont: "vazirmatn" };

export const settingsStore = createPersistentStore<Settings>(SETTINGS_KEY, DEFAULT_SETTINGS);

/** Mirror settings onto <html> data attributes; CSS does the rest. */
export function applySettings(s: Settings) {
  const d = document.documentElement;
  d.dataset.vowels = s.vowels;
  d.dataset.translit = s.translit ? "on" : "off";
  d.dataset.theme = s.theme;
  d.dataset.size = s.size;
  d.dataset.fafont = s.faFont;
}

export function updateSettings(patch: Partial<Settings>) {
  settingsStore.set((prev) => {
    const next = { ...prev, ...patch };
    applySettings(next);
    return next;
  });
}

/** Finished lessons, keyed "unit/lesson". */
export const progressStore = createPersistentStore<Record<string, true>>("alefbe2:progress", {});

/** Script-trainer decks (Leitner state per drill mode). */
export interface SrsData {
  decks: Partial<Record<DrillMode, DeckState>>;
  /** The old app's learned letters have been looked at once. */
  legacyChecked?: boolean;
}

export const srsStore = createPersistentStore<SrsData>("alefbe2:srs", { decks: {} });

export const deckOf = (data: SrsData, mode: DrillMode): DeckState => data.decks[mode] ?? emptyDeck();

export interface DrillUi {
  /** Show the on-screen Persian keyboard. */
  keyboard: boolean;
  /** Word drills opened before lesson 2.2. */
  wordsOpen: boolean;
}

export const drillUiStore = createPersistentStore<DrillUi>("alefbe2:drill-ui", { keyboard: false, wordsOpen: false });

/** Best tracing score per letter form and level, keyed "ب:initial:guided" (lib/trace.ts traceKey). */
export const traceStore = createPersistentStore<Record<string, number>>(
  "alefbe2:trace",
  {},
  { version: 2, migrate: (old, from) => (from === 1 ? migrateTraceV1(old) : undefined) },
);

export interface PathFilter {
  kind: LessonKind | "all";
  hideDone: boolean;
}

export const pathFilterStore = createPersistentStore<PathFilter>("alefbe2:path-filter", {
  kind: "all",
  hideDone: false,
});

/** What the learner practised, day by day (lib/activity.ts). */
export const activityStore = createPersistentStore<ActivityData>("alefbe2:activity", emptyActivity());

export function logActivity(e: ActivityEvent) {
  activityStore.set((a) => record(a, e, new Date()));
}

export type ChartFilter = "all" | "persian" | "non-joining" | "to-learn";
export type PenSize = "thin" | "medium" | "thick";

/** Remembered choices on the practice pages. */
export interface PracticeUi {
  chart: ChartFilter;
  pen: PenSize;
  quiz: QuizSetup;
  flashSpeed: number;
}

export const practiceUiStore = createPersistentStore<PracticeUi>("alefbe2:practice-ui", {
  chart: "all",
  pen: "medium",
  quiz: DEFAULT_QUIZ,
  flashSpeed: 1200,
});

/** Best score per game, keyed by game id. */
export const gamesStore = createPersistentStore<Record<string, { best: number; played: number }>>("alefbe2:games", {});

export interface QuizScore {
  /** Right at the first try, on the latest full attempt. */
  right: number;
  total: number;
  best: number;
}

export interface LessonsData {
  /** The lesson opened most recently, "unit/lesson". */
  last?: string;
  /** Lesson quizzes, keyed "unit/lesson". */
  quiz: Record<string, QuizScore>;
}

export const lessonsStore = createPersistentStore<LessonsData>("alefbe2:lessons", { quiz: {} });

/** The mistake notebook (lib/mistakes.ts). */
export const mistakesStore = createPersistentStore<Notebook>("alefbe2:mistakes", {});

/** Record an answer for the notebook: a miss goes in, right answers clear it. */
export function noteResult(item: MistakeItem, ok: boolean) {
  const prev = mistakesStore.get();
  const next = noteAnswer(prev, item, ok, Date.now());
  if (next !== prev) mistakesStore.set(next);
}

/** Starred words and examples (lib/starred.ts). */
export const starredStore = createPersistentStore<Starred>("alefbe2:starred", {});

/** The Today card on the home page: the daily goal (lib/today.ts). */
export const todayStore = createPersistentStore<{ goal: DailyGoal }>("alefbe2:today", { goal: DEFAULT_GOAL });

/** The conjugation trainer at /verbs: one Leitner deck per tense, and which forms to ask (lib/verb-drill.ts). */
export const verbsStore = createPersistentStore<VerbsData>("alefbe2:verbs", emptyVerbsData());

/** The vocabulary deck at /vocab: one Leitner deck, and whether to show the sound (lib/vocab.ts). */
export const vocabStore = createPersistentStore<VocabData>("alefbe2:vocab", emptyVocabData());

/** Cloze practice at /practice/cloze: one Leitner deck (lib/cloze.ts). */
export const clozeStore = createPersistentStore<ClozeData>("alefbe2:cloze", emptyClozeData());

/** The spoken ↔ written drill at /practice/convert: a Leitner deck per direction (lib/convert.ts). */
export const convertStore = createPersistentStore<ConvertData>("alefbe2:convert", emptyConvertData());

/** Every store, for refreshing after an import or reset. */
export const ALL_STORES = [
  settingsStore,
  progressStore,
  srsStore,
  drillUiStore,
  traceStore,
  pathFilterStore,
  activityStore,
  practiceUiStore,
  gamesStore,
  lessonsStore,
  mistakesStore,
  starredStore,
  todayStore,
  verbsStore,
  vocabStore,
  clozeStore,
  convertStore,
];
