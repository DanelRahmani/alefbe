// Progress backup: every Alefbe store in one versioned JSON file, and import
// of both this format and the old Alefbe app's export. Pure: storage access is
// passed in, so it runs in tests and in the browser alike.

import { emptyActivity, type ActivityData } from "./activity";
import { legacyUnlockedGroups } from "./drill";
import { mergeLegacyActivity, mergeLegacyTrace, parseLegacyExport, type LegacyData } from "./legacy";
import { migrateTraceV1 } from "./trace";

export const BACKUP_KEYS = [
  "alefbe2:settings",
  "alefbe2:progress",
  "alefbe2:srs",
  "alefbe2:trace",
  "alefbe2:path-filter",
  "alefbe2:drill-ui",
  "alefbe2:activity",
  "alefbe2:practice-ui",
  "alefbe2:games",
  "alefbe2:lessons",
  "alefbe2:mistakes",
  "alefbe2:starred",
  "alefbe2:today",
  "alefbe2:verbs",
] as const;

/** Keys the "Reset statistics" button clears; lessons, trainer and tracing stay. */
export const STATS_KEYS = ["alefbe2:activity", "alefbe2:games"] as const;

export interface Backup {
  app: "alefbe";
  format: 3;
  exported: string;
  /** Raw localStorage values, keyed by store. */
  stores: Partial<Record<(typeof BACKUP_KEYS)[number], string>>;
}

export type Parsed =
  | { kind: "alefbe"; exported: string; stores: Backup["stores"] }
  | { kind: "legacy"; exported?: string; data: LegacyData }
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
  const legacy = parseLegacyExport(d);
  if (legacy) return { kind: "legacy", exported: typeof d.exported === "string" ? d.exported : undefined, data: legacy };
  return { kind: "invalid", reason: "This file isn't an Alefbe backup." };
}

/** A store's envelope {v, data}, or undefined. */
function readEnvelope<T>(read: Read, key: string): { v: number; data: T } | undefined {
  try {
    const raw = read(key);
    return raw ? (JSON.parse(raw) as { v: number; data: T }) : undefined;
  } catch {
    return undefined;
  }
}
const readData = <T,>(read: Read, key: string): T | undefined => readEnvelope<T>(read, key)?.data;

/** Fold the old app's data into the stores: groups, tracing, activity. */
export function applyLegacy(d: LegacyData, read: Read, write: Write) {
  const open = legacyUnlockedGroups(JSON.stringify({ l: d.learned }));
  const srs = readData<{ decks: Record<string, { cards: object; unlocked: number }>; legacyChecked?: boolean }>(read, "alefbe2:srs") ?? {
    decks: {},
  };
  const lift = (mode: string) => {
    const deck = srs.decks[mode] ?? { cards: {}, unlocked: 1 };
    return { ...deck, unlocked: Math.max(deck.unlocked ?? 1, open ?? 1) };
  };
  write("alefbe2:srs", JSON.stringify({ v: 1, data: { ...srs, legacyChecked: true, decks: { ...srs.decks, sound: lift("sound"), letter: lift("letter") } } }));

  const env = readEnvelope<Record<string, number>>(read, "alefbe2:trace");
  const trace = env?.v === 2 ? env.data : migrateTraceV1(env?.data);
  write("alefbe2:trace", JSON.stringify({ v: 2, data: mergeLegacyTrace(trace, d) }));

  const activity = readData<ActivityData>(read, "alefbe2:activity") ?? emptyActivity();
  write("alefbe2:activity", JSON.stringify({ v: 1, data: { ...mergeLegacyActivity({ ...emptyActivity(), ...activity }, d), legacy: true } }));
}

/** Write a parsed backup into storage. */
export function applyBackup(p: Parsed, read: Read, write: Write) {
  if (p.kind === "alefbe") {
    for (const [k, v] of Object.entries(p.stores)) if (v !== undefined) write(k, v);
    return;
  }
  if (p.kind === "legacy") applyLegacy(p.data, read, write);
}
