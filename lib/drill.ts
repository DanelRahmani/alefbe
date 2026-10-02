// The script trainer's decks and answer checking. Pure: the UI keeps state.

import { DRILL_WORDS } from "@/content/drill-words";
import { checkFa, checkTranslit, type Verdict } from "./answers";
import { DIGITS, DRILL_GROUPS, LETTERS, SAME_SOUND, letterByChar } from "./persian/letters";
import { normalizeFa } from "./persian/normalize";
import { emptyDeck, unlockedIds, type DeckState } from "./srs";
import { transliterate } from "./translit";

export type DrillMode = "sound" | "letter" | "read" | "spell";

export interface ModeInfo {
  id: DrillMode;
  title: string;
  blurb: string;
  /** What the learner types. */
  answer: "translit" | "fa";
  /** Letter decks unlock group by group; word decks follow the letter→sound deck. */
  kind: "letters" | "words";
}

export const MODES: ModeInfo[] = [
  { id: "sound", title: "Letter → sound", blurb: "See a letter in any of its forms and type its sound.", answer: "translit", kind: "letters" },
  { id: "letter", title: "Sound → letter", blurb: "See a letter's name and sound and type the letter.", answer: "fa", kind: "letters" },
  { id: "read", title: "Read whole words", blurb: "Read a vowel-marked word and type how it sounds.", answer: "translit", kind: "words" },
  { id: "spell", title: "Spell it", blurb: "Hear it in transliteration, then write it in Persian script.", answer: "fa", kind: "words" },
];

export const modeInfo = (id: DrillMode) => MODES.find((m) => m.id === id)!;

export { DRILL_GROUPS };

const digitByChar = new Map(DIGITS.map((d) => [d.ch, d]));

export interface WordCard {
  /** The unmarked spelling; unique. */
  id: string;
  /** Fully vowel-marked. */
  fa: string;
  en: string;
  translit: string;
  /** Letters it needs unlocked (آ counts as ا). */
  letters: string[];
}

export const WORD_CARDS: WordCard[] = DRILL_WORDS.map((w) => {
  const id = normalizeFa(w.fa);
  return {
    id,
    fa: w.fa,
    en: w.en,
    translit: transliterate(w.fa),
    letters: [...new Set([...id.replace(/آ/g, "ا")])].filter((ch) => letterByChar.has(ch)),
  };
});

export const wordById = new Map(WORD_CARDS.map((w) => [w.id, w]));

/** Words whose letters are all unlocked, in list order. */
export function wordsFor(unlocked: Set<string>): WordCard[] {
  return WORD_CARDS.filter((w) => w.letters.every((ch) => unlocked.has(ch)));
}

/** The cards a mode can show: its deck's open letter groups, or the words made of letters open in letter → sound. */
export function drillCandidates(mode: DrillMode, decks: Partial<Record<DrillMode, DeckState>>): string[] {
  if (modeInfo(mode).kind === "letters") return unlockedIds(DRILL_GROUPS, decks[mode] ?? emptyDeck());
  const letters = new Set(unlockedIds(DRILL_GROUPS, decks.sound ?? emptyDeck()));
  return wordsFor(letters).map((w) => w.id);
}

// Same-sound families, for naming the slip in "sound → letter".
const family = (ch: string) => SAME_SOUND.find((f) => f.includes(ch));

export function checkDrill(mode: DrillMode, id: string, input: string): Verdict {
  switch (mode) {
    case "sound": {
      const l = letterByChar.get(id);
      if (l) return checkTranslit(input, [...l.sounds, l.name, ...(l.altNames ?? [])]);
      const d = digitByChar.get(id)!;
      return checkTranslit(input, [String(d.value), d.name, ...(d.altNames ?? [])]);
    }
    case "letter": {
      const typed = normalizeFa(input);
      if (typed === id) return { ok: true };
      const d = digitByChar.get(id);
      if (d && typed === String(d.value)) return { ok: false, near: true, hint: `Type the Persian digit ${d.ch}, not ${d.value}.` };
      if (family(id)?.includes(typed)) return { ok: false, near: true, hint: `Same sound, other letter: ${id} not ${typed}.` };
      return { ok: false };
    }
    case "read":
      return checkTranslit(input, [wordById.get(id)!.translit]);
    case "spell":
      return checkFa(input, [wordById.get(id)!.fa]);
  }
}

/**
 * The old Alefbe app kept learned letters in localStorage `alefbe_v1` as
 * {l: [letter index, …]} in the same alphabet order. Returns how many drill
 * groups those open (only when at least the first group was learned).
 */
export function legacyUnlockedGroups(raw: string | null): number | null {
  if (!raw) return null;
  try {
    const learned = new Set<number>((JSON.parse(raw) as { l?: number[] }).l ?? []);
    let open = 0;
    while (open < 8 && DRILL_GROUPS[open].every((ch) => learned.has(LETTERS.findIndex((l) => l.ch === ch)))) open++;
    return open ? Math.min(8, open + 1) : null;
  } catch {
    return null;
  }
}
