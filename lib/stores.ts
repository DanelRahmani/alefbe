"use client";

import type { LessonKind } from "@/content/types";
import type { VowelMode } from "./persian/marks";
import { SETTINGS_KEY } from "./prepaint";
import { createPersistentStore } from "./storage";
import { emptyDeck, type DeckState } from "./srs";
import type { DrillMode } from "./drill";
import { emptyActivity, record, type ActivityData, type ActivityEvent } from "./activity";
import { migrateTraceV1 } from "./trace";
import { DEFAULT_QUIZ, type QuizSetup } from "./quiz";

export type Theme = "system" | "light" | "dark";

export interface Settings {
  vowels: VowelMode;
  translit: boolean;
  theme: Theme;
}

export const DEFAULT_SETTINGS: Settings = { vowels: "all", translit: false, theme: "system" };

export const settingsStore = createPersistentStore<Settings>(SETTINGS_KEY, DEFAULT_SETTINGS);

/** Mirror settings onto <html> data attributes; CSS does the rest. */
export function applySettings(s: Settings) {
  const d = document.documentElement;
  d.dataset.vowels = s.vowels;
  d.dataset.translit = s.translit ? "on" : "off";
  d.dataset.theme = s.theme;
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
];
