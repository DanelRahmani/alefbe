"use client";

import type { LessonKind } from "@/content/types";
import type { VowelMode } from "./persian/marks";
import { SETTINGS_KEY } from "./prepaint";
import { createPersistentStore } from "./storage";

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

export interface PathFilter {
  kind: LessonKind | "all";
  hideDone: boolean;
}

export const pathFilterStore = createPersistentStore<PathFilter>("alefbe2:path-filter", {
  kind: "all",
  hideDone: false,
});
