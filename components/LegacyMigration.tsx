"use client";

import { useEffect } from "react";
import { applyLegacy } from "@/lib/backup";
import { legacyTheme, parseLegacyStore } from "@/lib/legacy";
import { SETTINGS_KEY } from "@/lib/prepaint";
import { activityStore, srsStore, traceStore, updateSettings } from "@/lib/stores";

const read = (k: string) => {
  try {
    return window.localStorage.getItem(k);
  } catch {
    return null;
  }
};

/**
 * Once per browser, on alefbe.study: fold the old app's data (key `alefbe_v1`)
 * into the new stores — learned letters open trainer groups, passed traces and
 * quiz totals carry over — and keep its light or dark theme. The old keys are
 * left untouched.
 */
export function LegacyMigration() {
  useEffect(() => {
    if (activityStore.get().legacy) return;
    const old = parseLegacyStore(read("alefbe_v1"));
    try {
      if (old) {
        if (srsStore.get().legacyChecked) old.learned = [];
        applyLegacy(old, read, (k, v) => window.localStorage.setItem(k, v));
      } else {
        activityStore.set((a) => ({ ...a, legacy: true }));
      }
      const theme = legacyTheme(read("alefbe_theme"));
      if (theme && read(SETTINGS_KEY) === null) updateSettings({ theme });
    } catch {
      // Storage blocked: nothing to migrate.
    }
    srsStore.refresh();
    traceStore.refresh();
    activityStore.refresh();
  }, []);
  return null;
}
