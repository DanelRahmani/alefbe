// The vocabulary deck at /vocab. Pure: the UI keeps state.
//
// A card is a dictionary entry that a lesson teaches. It joins the deck when
// one of its lessons is marked done. The prompt is the English meaning; the
// learner types the Persian. Leitner scheduling is lib/srs.ts, one deck, no
// groups.
//
// Two decisions:
// - A card accepts the written form and the spoken form alike: a learner who
//   knows خونه knows the word. The answer shows both.
// - Words that share an English gloss (قِرْمِز and سُرْخ, both "red") are told
//   apart by a hint on the prompt, the first letters of the word wanted. Typing
//   the other word is not a miss: the learner is told and tries again. The same
//   goes for glosses that differ only by a note in brackets ("to know (a fact)",
//   "to know (a person)"): the note tells them apart, and the near twin is not
//   a miss.

import { checkFa, type Verdict } from "./answers";
import type { DictEntry } from "./dictionary";
import { normalizeFa } from "./persian/normalize";
import { deckStats, type DeckState, type DeckStats } from "./srs";
import { emptyVocabData } from "./store-defaults";
export { emptyVocabData };

export interface VocabCard {
  /** The dictionary entry's id: the marked written spelling. */
  id: string;
  /** The written form, fully marked. */
  fa: string;
  /** The Tehrani spoken form, when it differs. */
  spoken?: string;
  en: string;
  translit: string;
  spokenTranslit?: string;
  /** The lessons that teach it, as "unit/lesson" keys. */
  lessons: string[];
  /** The first of them, for the link after an answer. */
  lesson: { number: string; href: string };
  /** Set when another card has the same English: "starts with قر". */
  hint?: string;
}

export interface VocabData {
  deck: DeckState;
  /** Show the transliteration with the prompt. */
  sound: boolean;
}


/** "/learn/past/simple-past" → "past/simple-past" */
const lessonKey = (href: string) => href.replace(/^\/learn\//, "");

/** The English a card is asked by, folded for comparing. */
const glossKey = (en: string) => en.toLowerCase().replace(/\s+/g, " ").trim();

/** The gloss without its notes in brackets: "to know (a fact)" → "to know". */
const baseGloss = (en: string) => glossKey(en.replace(/\([^)]*\)/g, " "));

/** The spellings a card accepts, as typed: no marks. */
const spellings = (c: Pick<VocabCard, "fa" | "spoken">) => [c.fa, ...(c.spoken ? [c.spoken] : [])].map(normalizeFa);

/** The shortest beginning of `word` that none of `others` shares. */
function distinctStart(word: string, others: string[]): string {
  for (let n = 1; n < word.length; n++) {
    const start = word.slice(0, n);
    if (!others.some((o) => o.startsWith(start))) return start;
  }
  return word;
}

/**
 * The deck's cards, from the dictionary: every entry a lesson teaches, in the
 * order the course teaches them (`lessonOrder` lists the lesson keys in course
 * order), so new cards arrive in lesson order.
 */
export function buildVocabCards(entries: readonly DictEntry[], lessonOrder: readonly string[]): VocabCard[] {
  const at = new Map(lessonOrder.map((k, i) => [k, i]));
  const rank = (k: string) => at.get(k) ?? Number.MAX_SAFE_INTEGER;
  const cards: VocabCard[] = entries
    .filter((e) => e.lessons.length > 0)
    .map((e) => {
      const lessons = [...e.lessons].sort((a, b) => rank(lessonKey(a.href)) - rank(lessonKey(b.href)));
      return {
        id: e.id,
        fa: e.fa,
        spoken: e.spoken,
        en: e.en,
        translit: e.translit,
        spokenTranslit: e.spokenTranslit,
        lessons: lessons.map((l) => lessonKey(l.href)),
        lesson: { number: lessons[0].number, href: lessons[0].href },
      };
    });
  cards.sort((a, b) => rank(a.lessons[0]) - rank(b.lessons[0]));

  // Cards with the same English: each gets the start of its word as a hint.
  const byGloss = new Map<string, VocabCard[]>();
  for (const c of cards) byGloss.set(glossKey(c.en), [...(byGloss.get(glossKey(c.en)) ?? []), c]);
  for (const group of byGloss.values()) {
    if (group.length < 2) continue;
    for (const c of group) {
      const mine = normalizeFa(c.fa);
      const others = group.filter((o) => o !== c).flatMap(spellings);
      // Two entries spelled alike once the marks are off (پَنْجَره, پَنْجِره) are one answer: no hint can split them.
      if (others.includes(mine)) continue;
      c.hint = `starts with ${distinctStart(mine, others)}`;
    }
  }
  return cards;
}

/** The cards a learner has met: those with a lesson marked done (`done` holds finished lesson keys). */
export function vocabCandidates(cards: readonly Pick<VocabCard, "id" | "lessons">[], done: Record<string, unknown>): string[] {
  return cards.filter((c) => c.lessons.some((k) => done[k])).map((c) => c.id);
}

export interface VocabVerdict extends Verdict {
  /** The answer was another word with the same English: not a miss, try again. */
  again?: boolean;
}

/** What checking needs of a card: the notebook has these, not the whole card. */
export type VocabAsk = Pick<VocabCard, "id" | "fa" | "spoken" | "en" | "hint">;

export function checkVocab(card: VocabAsk, all: readonly VocabAsk[], input: string): VocabVerdict {
  const accepted = [card.fa, ...(card.spoken ? [card.spoken] : [])];
  const v = checkFa(input, accepted);
  if (v.ok) {
    // Say which form was typed when the card has two.
    if (!card.spoken || v.note) return v;
    const typed = normalizeFa(input);
    const isSpoken = typed === normalizeFa(card.spoken) && typed !== normalizeFa(card.fa);
    return { ok: true, note: isSpoken ? "That is the spoken form." : "That is the written form." };
  }
  if (v.hint) return v;
  const typed = normalizeFa(input);
  const key = baseGloss(card.en);
  const twin = all.find((o) => o.id !== card.id && baseGloss(o.en) === key && spellings(o).includes(typed));
  if (!twin) return { ok: false };
  if (glossKey(twin.en) === glossKey(card.en))
    return { ok: false, again: true, hint: `That also means “${card.en}”. This card wants another word${card.hint ? `: it ${card.hint}` : ""}.` };
  return { ok: false, again: true, hint: `That is “${twin.en}”. This card asks for “${card.en}”.` };
}

/** Deck counts for the cards the learner has met. */
export const vocabStats = (cards: readonly Pick<VocabCard, "id" | "lessons">[], data: VocabData, done: Record<string, unknown>, now: number): DeckStats =>
  deckStats(vocabCandidates(cards, done), data.deck, now);

/**
 * Cards due now, from the deck alone: for the Today card, which has no card
 * list. `known` holds the dictionary's ids, so a card whose word has left the
 * course is not counted.
 */
export { vocabDue } from "./due";
