// The old app's data folded into the new stores (see LegacyMigration). Loaded
// only when the old keys are there, so pages don't carry the letter tables and
// the backup code for a one-time migration.

import { applyLegacy } from "@/lib/backup";
import { legacyTheme, parseLegacyStore } from "@/lib/legacy";
import { SETTINGS_KEY } from "@/lib/prepaint";
import { activityStore, srsStore, updateSettings } from "@/lib/stores";

export function runLegacy(read: (k: string) => string | null) {
  const old = parseLegacyStore(read("alefbe_v1"));
  if (old) {
    if (srsStore.get().legacyChecked) old.learned = [];
    applyLegacy(old, read, (k, v) => window.localStorage.setItem(k, v));
  } else {
    activityStore.set((a) => ({ ...a, legacy: true }));
  }
  const theme = legacyTheme(read("alefbe_theme"));
  if (theme && read(SETTINGS_KEY) === null) updateSettings({ theme });
}
