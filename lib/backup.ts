// Progress backup: every Alefbe store in one versioned JSON file, and import
// of both this format and the old Alefbe app's export. Pure: storage access is
// passed in, so it runs in tests and in the browser alike.

import { legacyUnlockedGroups } from "./drill";

export const BACKUP_KEYS = [
  "alefbe2:settings",
  "alefbe2:progress",
  "alefbe2:srs",
  "alefbe2:trace",
  "alefbe2:path-filter",
  "alefbe2:drill-ui",
] as const;

export interface Backup {
  app: "alefbe";
  format: 3;
  exported: string;
  /** Raw localStorage values, keyed by store. */
  stores: Partial<Record<(typeof BACKUP_KEYS)[number], string>>;
}

export type Parsed =
  | { kind: "alefbe"; exported: string; stores: Backup["stores"] }
  | { kind: "legacy"; exported?: string; learned: number[] }
  | { kind: "invalid"; reason: string };

type Read = (key: string) => string | null;
type Write = (key: string, value: string) => void;

export function makeBackup(read: Read, now: Date): Backup {
  const stores: Backup["stores"] = {};
  for (const k of BACKUP_KEYS) {
    const v = read(k);
    if (v !== null) stores[k] = v;
  }
  return { app: "alefbe", format: 3, exported: now.toISOString(), stores };
}

export const backupFileName = (now: Date) => `alefbe-progress-${now.toISOString().slice(0, 10)}.json`;

const isJson = (s: unknown) => {
  if (typeof s !== "string") return false;
  try {
    JSON.parse(s);
    return true;
  } catch {
    return false;
  }
};

export function parseBackup(text: string): Parsed {
  let data: unknown;
  try {
    data = JSON.parse(text);
  } catch {
    return { kind: "invalid", reason: "This file isn't valid JSON." };
  }
  if (!data || typeof data !== "object") return { kind: "invalid", reason: "This file isn't an Alefbe backup." };
  const d = data as Record<string, unknown>;
  if (d.app === "alefbe" && d.format === 3 && d.stores && typeof d.stores === "object") {
    const stores = d.stores as Record<string, unknown>;
    const keys = Object.keys(stores);
    if (keys.some((k) => !(BACKUP_KEYS as readonly string[]).includes(k) || !isJson(stores[k]))) {
      return { kind: "invalid", reason: "This backup contains data Alefbe doesn't recognise." };
    }
    return { kind: "alefbe", exported: String(d.exported ?? ""), stores: stores as Backup["stores"] };
  }
  if (typeof d.version === "number" && Array.isArray(d.learned)) {
    const learned = d.learned.filter((n): n is number => Number.isInteger(n) && n >= 0 && n < 32);
    return { kind: "legacy", exported: typeof d.exported === "string" ? d.exported : undefined, learned };
  }
  return { kind: "invalid", reason: "This file isn't an Alefbe backup." };
}

/** Write a parsed backup into storage. */
export function applyBackup(p: Parsed, read: Read, write: Write) {
  if (p.kind === "alefbe") {
    for (const [k, v] of Object.entries(p.stores)) if (v !== undefined) write(k, v);
    return;
  }
  if (p.kind === "legacy") {
    const open = legacyUnlockedGroups(JSON.stringify({ l: p.learned })) ?? 1;
    let srs: { decks: Record<string, { cards: object; unlocked: number }>; legacyChecked?: boolean } = { decks: {} };
    try {
      const raw = read("alefbe2:srs");
      if (raw) srs = JSON.parse(raw).data ?? srs;
    } catch {
      // Unreadable: start from empty decks.
    }
    const lift = (mode: string) => {
      const d = srs.decks[mode] ?? { cards: {}, unlocked: 1 };
      return { ...d, unlocked: Math.max(d.unlocked ?? 1, open) };
    };
    const next = { ...srs, legacyChecked: true, decks: { ...srs.decks, sound: lift("sound"), letter: lift("letter") } };
    write("alefbe2:srs", JSON.stringify({ v: 1, data: next }));
  }
}
