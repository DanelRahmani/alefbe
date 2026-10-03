"use client";

import { useEffect } from "react";
import { activityStore, srsStore, traceStore } from "@/lib/stores";

const read = (k: string) => {
  try {
    return window.localStorage.getItem(k);
  } catch {
    return null;
  }
};

const refresh = () => {
  srsStore.refresh();
  traceStore.refresh();
  activityStore.refresh();
};

/**
 * Once per browser, on alefbe.study: fold the old app's data (key `alefbe_v1`)
 * into the new stores — learned letters open trainer groups, passed traces and
 * quiz totals carry over — and keep its light or dark theme. The old keys are
 * left untouched. The migration code (components/legacy-run.ts) is fetched only
 * when there is an old key to read.
 */
export function LegacyMigration() {
  useEffect(() => {
    if (activityStore.get().legacy) return;
    if (read("alefbe_v1") === null && read("alefbe_theme") === null) {
      try {
        activityStore.set((a) => ({ ...a, legacy: true }));
      } catch {
        // Storage blocked: nothing to migrate.
      }
      refresh();
      return;
    }
    import("./legacy-run")
      .then((m) => m.runLegacy(read))
      .catch(() => {
        // Storage blocked: nothing to migrate.
      })
      .finally(refresh);
  }, []);
  return null;
}
