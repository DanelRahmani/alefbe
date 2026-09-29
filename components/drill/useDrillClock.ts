"use client";

import { useEffect, useSyncExternalStore } from "react";
import { legacyUnlockedGroups } from "@/lib/drill";
import { emptyDeck } from "@/lib/srs";
import { srsStore } from "@/lib/stores";

const subscribe = (cb: () => void) => {
  const t = window.setInterval(cb, 30_000);
  return () => window.clearInterval(t);
};

/** The current time, rounded up to the next minute so just-missed cards count as due (0 on the server). */
export function useMinuteClock(): number {
  return useSyncExternalStore(
    subscribe,
    () => Math.ceil(Date.now() / 60_000) * 60_000,
    () => 0,
  );
}

/** Once per browser: open the drill groups whose letters the old Alefbe app marked as learned. */
export function useLegacyMigration() {
  useEffect(() => {
    if (srsStore.get().legacyChecked) return;
    let raw: string | null = null;
    try {
      raw = window.localStorage.getItem("alefbe_v1");
    } catch {
      // Storage blocked: nothing to migrate.
    }
    const n = legacyUnlockedGroups(raw);
    srsStore.set((prev) => {
      if (!n) return { ...prev, legacyChecked: true };
      const lift = (mode: "sound" | "letter") => {
        const d = prev.decks[mode] ?? emptyDeck();
        return { ...d, unlocked: Math.max(d.unlocked, n) };
      };
      return { ...prev, legacyChecked: true, decks: { ...prev.decks, sound: lift("sound"), letter: lift("letter") } };
    });
  }, []);
}

export function formatWait(ms: number): string {
  const min = Math.max(1, Math.round(ms / 60_000));
  if (min < 60) return `${min} min`;
  const h = Math.round(min / 60);
  if (h < 36) return `${h} hour${h === 1 ? "" : "s"}`;
  const d = Math.round(h / 24);
  return `${d} day${d === 1 ? "" : "s"}`;
}
