"use client";

import type { LessonKind } from "@/content/types";
import type { VowelMode } from "./persian/marks";
import { SETTINGS_KEY } from "./prepaint";
import { createPersistentStore } from "./storage";
import { emptyDeck, type DeckState } from "./srs";
import type { DrillMode } from "./drill";

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

export interface PathFilter {
  kind: LessonKind | "all";
  hideDone: boolean;
}

export const pathFilterStore = createPersistentStore<PathFilter>("alefbe2:path-filter", {
  kind: "all",
  hideDone: false,
});
