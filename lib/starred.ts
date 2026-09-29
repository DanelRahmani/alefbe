// Starred words and examples, and their export as CSV for flashcard apps
// (Anki) and spreadsheets. Pure.

import { parseMarkup, plainOf, tokenText, translitOf } from "./markup";
import { variantsOf, type VowelMode } from "./persian/marks";

export interface StarredItem {
  /** Persian as the course writes it, markup included. */
  fa: string;
  /** The written form, when `fa` is the spoken one. */
  written?: string;
  en: string;
  /** Where it was starred ("Lesson 2.3", "Dictionary") and a link back. */
  source: string;
  href: string;
  /** When it was starred (ms). */
  at: number;
}

export type Starred = Record<string, StarredItem>;

/** Items are keyed by their Persian without markup, so a word starred twice is one item. */
export const starKey = (fa: string) => plainOf(parseMarkup(fa));

export function toggleStar(s: Starred, item: Omit<StarredItem, "at">, now: number): Starred {
  const key = starKey(item.fa);
  const next = { ...s };
  if (next[key]) delete next[key];
  else next[key] = { ...item, at: now };
  return next;
}

/** The Persian of `fa` as a vowel-mark mode shows it, without markup. */
export const faIn = (fa: string, mode: VowelMode) => variantsOf(parseMarkup(fa))[mode].map(tokenText).join("");

/** Oldest first: the order they were starred in. */
export const starredList = (s: Starred): StarredItem[] => Object.values(s).sort((a, b) => a.at - b.at);

export const CSV_HEADERS = ["Persian", "Persian without vowel marks", "Transliteration", "Written form", "Meaning", "Source"];

const cell = (v: string) => `"${v.replace(/"/g, '""')}"`;

/** A CSV file: UTF-8 with a byte-order mark so Excel reads the Persian, CRLF line ends. */
export function starredCsv(s: Starred): string {
  const rows = starredList(s).map((it) => [
    faIn(it.fa, "all"),
    faIn(it.fa, "none"),
    translitOf(parseMarkup(it.fa)),
    it.written ? faIn(it.written, "all") : "",
    it.en.replace(/\*/g, ""),
    it.source,
  ]);
  return String.fromCharCode(0xfeff) + [CSV_HEADERS, ...rows].map((r) => r.map(cell).join(",")).join("\r\n") + "\r\n";
}
