// The dictionary: every lesson's vocabulary plus the trainer's words, merged,
// sorted in Persian alphabet order, and searchable by Persian (marks optional),
// transliteration (accents optional) or English. Pure.

import type { Topic } from "@/content/topics";
import type { Fa } from "@/content/types";
import { parseMarkup, translitOf } from "./markup";
import { ZWNJ } from "./persian/chars";
import { LETTERS } from "./persian/letters";
import { normalizeFa } from "./persian/normalize";

export interface DictSource {
  /** The headword: the written form. */
  fa: Fa;
  /** The Tehrani spoken form, when it differs. */
  spoken?: Fa;
  en: string;
  topic?: Topic;
  /** The lesson that teaches it, if any. */
  lesson?: { href: string; number: string; title: string; unit: string };
  trainer?: boolean;
  /** From the frequency list (content/common-words), not taught in a lesson. */
  common?: boolean;
}

export interface DictEntry {
  /** The marked spelling without markup; unique. */
  id: string;
  fa: Fa;
  spoken?: Fa;
  en: string;
  translit: string;
  spokenTranslit?: string;
  topic?: Topic;
  lessons: { href: string; number: string; title: string; unit: string }[];
  trainer: boolean;
  common: boolean;
  /** First letter, for the alphabet index (آ files under ا). */
  initial: string;
  /** Pre-folded search keys. */
  keys: { fa: string; tr: string; en: string };
}

const stripMarkup = (s: string) => s.replace(/[{}*]/g, "").replace(/\[([^|\]]*)\|[^\]]*\]/g, "$1");

/** Transliteration folded for lenient matching: â→a, x→kh, gh/q merged, no ' - or spaces. */
export function foldLatin(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFC")
    .replace(/[âāáàä]/g, "a")
    .replace(/[’‘`ʿʼ'-]/g, "")
    .replace(/x/g, "kh")
    .replace(/gh/g, "q")
    .replace(/ow/g, "o")
    .replace(/\s+/g, "");
}

/** Persian folded for matching: no marks, no half-spaces or spaces, آ as ا. */
export const foldFa = (s: string) => normalizeFa(stripMarkup(s)).split(ZWNJ).join("").replace(/\s+/g, "").replace(/آ/g, "ا");

const ORDER = new Map(LETTERS.map((l, i) => [l.ch, i]));
/** Persian alphabet order, letter by letter. */
export function compareFa(a: string, b: string): number {
  const x = foldFa(a);
  const y = foldFa(b);
  for (let i = 0; i < Math.min(x.length, y.length); i++) {
    const d = (ORDER.get(x[i]) ?? 99) - (ORDER.get(y[i]) ?? 99);
    if (d) return d;
  }
  return x.length - y.length;
}

const mergeEn = (a: string, b: string) => (a.toLowerCase().includes(b.toLowerCase()) ? a : b.toLowerCase().includes(a.toLowerCase()) ? b : `${a}; ${b}`);

export function buildDictionary(sources: DictSource[]): DictEntry[] {
  const byId = new Map<string, DictEntry>();
  for (const s of sources) {
    const id = stripMarkup(s.fa);
    const prev = byId.get(id);
    if (prev) {
      prev.en = mergeEn(prev.en, s.en);
      prev.topic ??= s.topic;
      if (!prev.spoken && s.spoken) {
        prev.spoken = stripMarkup(s.spoken);
        prev.spokenTranslit = translitOf(parseMarkup(s.spoken));
      }
      prev.trainer ||= !!s.trainer;
      prev.common ||= !!s.common;
      if (s.lesson && !prev.lessons.some((l) => l.href === s.lesson!.href)) prev.lessons.push(s.lesson);
      continue;
    }
    const fa = stripMarkup(s.fa);
    const spoken = s.spoken ? stripMarkup(s.spoken) : undefined;
    byId.set(id, {
      id,
      fa,
      spoken,
      en: s.en,
      // Read from the markup, so a [base|translit] override keeps its reading (رادیو râdiyo).
      translit: translitOf(parseMarkup(s.fa)),
      spokenTranslit: s.spoken ? translitOf(parseMarkup(s.spoken)) : undefined,
      topic: s.topic,
      lessons: s.lesson ? [s.lesson] : [],
      trainer: !!s.trainer,
      common: !!s.common,
      initial: foldFa(fa)[0] ?? "",
      keys: { fa: "", tr: "", en: "" },
    });
  }
  const entries = [...byId.values()];
  for (const e of entries) e.keys = searchKeys(e);
  return entries.sort((a, b) => compareFa(a.fa, b.fa));
}

/** An entry without its search keys, as /data/dictionary.json carries it (the keys are rebuilt in the browser). */
export type DictData = Omit<DictEntry, "keys">;

/** The pre-folded search keys of an entry. */
export function searchKeys(e: Pick<DictEntry, "fa" | "spoken" | "translit" | "spokenTranslit" | "en">): DictEntry["keys"] {
  return {
    fa: [foldFa(e.fa), e.spoken ? foldFa(e.spoken) : ""].join(" "),
    tr: [foldLatin(e.translit), e.spokenTranslit ? foldLatin(e.spokenTranslit) : ""].join(" "),
    en: e.en.toLowerCase(),
  };
}

/** Entries from /data/dictionary.json, ready to search. */
export const withKeys = (data: DictData[]): DictEntry[] => data.map((e) => ({ ...e, keys: searchKeys(e) }));

const ARABIC = /[؀-ۿ]/;

/** Does an entry match the query? Persian queries match the spelling; Latin ones the transliteration or English. */
export function matches(e: Pick<DictEntry, "keys">, query: string): boolean {
  const q = query.trim();
  if (!q) return true;
  if (ARABIC.test(q)) return e.keys.fa.includes(foldFa(q));
  const lq = q.toLowerCase();
  return e.keys.en.includes(lq) || e.keys.tr.includes(foldLatin(q));
}

/** Lower is better: spelling or transliteration starting with the query, then containing it, then English. */
export function rank(e: Pick<DictEntry, "keys">, query: string): number {
  const q = query.trim();
  if (!q) return 0;
  if (ARABIC.test(q)) {
    const f = foldFa(q);
    return e.keys.fa.split(" ").some((k) => k.startsWith(f)) ? 0 : 1;
  }
  const t = foldLatin(q);
  const lq = q.toLowerCase();
  if (e.keys.tr.split(" ").some((k) => k.startsWith(t))) return 0;
  if (e.keys.en.split(/[^a-z]+/).some((w) => w.startsWith(lq))) return 1;
  if (e.keys.tr.includes(t)) return 2;
  return 3;
}
