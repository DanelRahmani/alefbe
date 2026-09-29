"use client";

import { useSyncExternalStore } from "react";

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

export function formatWait(ms: number): string {
  const min = Math.max(1, Math.round(ms / 60_000));
  if (min < 60) return `${min} min`;
  const h = Math.round(min / 60);
  if (h < 36) return `${h} hour${h === 1 ? "" : "s"}`;
  const d = Math.round(h / 24);
  return `${d} day${d === 1 ? "" : "s"}`;
}
