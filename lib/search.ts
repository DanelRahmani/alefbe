// Site-wide search: one small index of lessons, letters, words, grammar
// topics and pages, searched in Persian (marks optional), transliteration
// (accents optional) or English. Pure; the index is built at build time.

import { foldFa, foldLatin } from "./dictionary";

export type SearchKind = "lesson" | "letter" | "word" | "grammar" | "page";

export const KIND_TITLES: Record<SearchKind, string> = {
  lesson: "Lessons",
  letter: "Letters",
  word: "Words",
  grammar: "Grammar",
  page: "Pages",
};

export interface SearchItem {
  kind: SearchKind;
  /** English title (may contain Persian runs). */
  title: string;
  /** A Persian mark shown beside it. */
  fa?: string;
  /** A word's Tehrani spoken form, when it differs (for the word inspector). */
  spoken?: string;
  /** One line under the title. */
  sub?: string;
  href: string;
  /** Pre-folded keys: Persian, transliteration, English. */
  keys: { fa: string; tr: string; en: string };
}

const ARABIC = /[؀-ۿ]/;
const PERSIAN_RUNS = /[؀-ۿ‌]+/g;

/** Keys for an item: Persian runs folded, transliteration folded, English lower-cased. */
export function keysFor(texts: { fa?: string[]; tr?: string[]; en?: string[] }) {
  const fa = (texts.fa ?? []).flatMap((s) => s.match(PERSIAN_RUNS) ?? []).map(foldFa);
  return {
    fa: fa.filter(Boolean).join(" "),
    tr: (texts.tr ?? []).map(foldLatin).join(" "),
    en: (texts.en ?? []).join(" ").toLowerCase(),
  };
}

/** Lower is better; Infinity means no match. */
export function score(item: Pick<SearchItem, "keys">, query: string): number {
  const q = query.trim();
  if (!q) return Infinity;
  const words = (s: string) => s.split(/[^\p{L}\p{N}']+/u).filter(Boolean);
  if (ARABIC.test(q)) {
    const f = foldFa(q);
    if (!f) return Infinity;
    const ws = item.keys.fa.split(" ");
    if (ws.some((w) => w === f)) return 0;
    if (ws.some((w) => w.startsWith(f))) return 1;
    return item.keys.fa.includes(f) ? 3 : Infinity;
  }
  const lq = q.toLowerCase();
  const t = foldLatin(q);
  const en = item.keys.en;
  const tr = item.keys.tr.split(" ");
  if (tr.some((w) => w === t) || words(en).some((w) => w === lq)) return 0;
  if (tr.some((w) => w.startsWith(t)) || words(en).some((w) => w.startsWith(lq))) return 1;
  if (en.includes(lq)) return 2;
  if (t.length >= 3 && item.keys.tr.includes(t)) return 3;
  return Infinity;
}

const KIND_ORDER: SearchKind[] = ["page", "lesson", "grammar", "letter", "word"];

/** The best matches, grouped by kind in a fixed order. */
export function search(items: SearchItem[], query: string, limit = 24): { kind: SearchKind; items: SearchItem[] }[] {
  const hits = items
    .map((item, i) => ({ item, s: score(item, query), i }))
    .filter((h) => h.s < Infinity)
    .sort((a, b) => a.s - b.s || a.i - b.i)
    .slice(0, limit);
  return KIND_ORDER.map((kind) => ({ kind, items: hits.filter((h) => h.item.kind === kind).map((h) => h.item) })).filter(
    (g) => g.items.length,
  );
}
