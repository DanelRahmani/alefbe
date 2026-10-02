// The spoken ↔ written drill at /practice/convert. Pure: the UI keeps state.
//
// A card is a lesson line that the lesson gives in both registers, where the
// written line differs from the spoken one (marks and punctuation aside): a
// core example, a line of a contrast pair or a dialogue line. The learner sees
// one form and types the other; spoken → written is the default, and each
// direction has its own Leitner deck. A card joins when its lesson is marked
// done.
//
// Every Persian string a learner sees is lesson text. Other right answers come
// from the conjugation engine (lib/forms.ts) and the answer checker; none is
// written here.
//
// Checking a whole sentence:
// - vowel marks and punctuation are ignored (lib/answers.ts checkFa);
// - a missing or extra half-space is a near miss with the checker's hint, which
//   also names the word;
// - a wrong answer names the first word that differs, or a word missing or extra.
//
// Accepted with a note:
// - the checker's Academy variants (اطاق for اتاق) and ـه‌ی for the ezafe ـهٔ;
// - every verb form spelled as the conjugation trainer also accepts it: the
//   one-ی spellings (می‌خوایم), می‌آم for میام, ـید for the spoken ـین, the
//   perfect spelled رفته‌ام in chat, رفته for written رفته است, بـ on a compound
//   that usually drops it;
// - toward speech, را spelled رو or joined as ـو (کتابو, کتاب رو);
// - toward writing, اَمّا and وَلی for "but" (both are written);
// - که after a verb of saying or knowing kept or left out (lesson 10.2);
// - the target of a card with the same line shown (a line written two ways).

import type { Block, Lesson } from "@/content/types";
import { checkFa, type Verdict } from "./answers";
import type { Verb } from "./conjugate";
import { formIndex, phraseAlts, presentForFuture, verbIdsIn, type FormHit, type FormIndex } from "./forms";
import { clauseKe, distance, hashLine } from "./cloze";
import { parseMarkup, plainOf } from "./markup";
import { DAMMA, NON_JOINING, ZWNJ } from "./persian/chars";
import { markedWords, normalizeFa } from "./persian/normalize";
import { deckStats, emptyDeck, type DeckState, type DeckStats } from "./srs";

export type ConvertDir = "to-written" | "to-spoken";
export const CONVERT_DIRS: { id: ConvertDir; label: string; from: string; to: string }[] = [
  { id: "to-written", label: "Spoken → written", from: "spoken", to: "written" },
  { id: "to-spoken", label: "Written → spoken", from: "written", to: "spoken" },
];

/** Another way to type the target, and its note. */
export interface ConvertAlt {
  fa: string;
  note: string;
}

export interface ConvertCard {
  /** "unit/lesson#hash": the first lesson's key and a hash of both lines. */
  id: string;
  /** The spoken line, as the lesson writes it (markup: highlights, overrides). */
  fa: string;
  /** The written line, likewise. */
  written: string;
  en: string;
  /** Other ways to type each target, from the engine. */
  alsoWritten?: ConvertAlt[];
  alsoSpoken?: ConvertAlt[];
  /** Targets of other cards that show the same line. */
  twinsWritten?: string[];
  twinsSpoken?: string[];
  /** The lesson shows every vowel mark whatever the setting. */
  marks?: boolean;
  /** The only direction asked, when the other is left out. */
  only?: ConvertDir;
  /** The lessons that teach the line, as "unit/lesson" keys. */
  lessons: string[];
  lesson: { number: string; href: string };
}

/** What asking and checking need: the notebook carries this, not the card list. */
export type ConvertAsk = Omit<ConvertCard, "lessons">;

export function convertAsk(c: ConvertCard): ConvertAsk {
  const ask: ConvertAsk & { lessons?: string[] } = { ...c };
  delete ask.lessons;
  return ask;
}

export interface ConvertData {
  decks: Record<ConvertDir, DeckState>;
  /** The direction practised last. */
  dir: ConvertDir;
}

export const emptyConvertData = (): ConvertData => ({ decks: { "to-written": emptyDeck(), "to-spoken": emptyDeck() }, dir: "to-written" });

/** A lesson as the builder needs it (content/units.ts LessonRef fits). */
export interface ConvertLesson {
  key: string;
  number: string;
  href: string;
  lesson: Pick<Lesson, "register" | "showMarks" | "blocks">;
}

export interface ConvertOptions {
  verbs?: readonly Verb[];
  /** Card ids to leave out, with the reason. */
  leaveOut?: Readonly<Record<string, ConvertLeave>>;
}

/** A card left out: in one direction (`dir`), or both when `dir` is unset. */
export interface ConvertLeave {
  dir?: ConvertDir;
  why: string;
}

export interface ConvertLeftOut {
  id: string;
  lesson: string;
  fa: string;
  written: string;
  /** The direction left out (a card left out both ways has two entries). */
  dir: ConvertDir;
  why: string;
}

interface Line {
  fa: string;
  written?: string;
  en: string;
}

/** The lines of a block that cards are made from (no callouts, so no `wrong` example). */
function linesOf(b: Block): Line[] {
  if (b.type === "examples") return b.items;
  if (b.type === "pair") return [b.a, b.b];
  if (b.type === "dialogue") return b.lines;
  return [];
}

const plain = (markup: string) => plainOf(parseMarkup(markup));

/**
 * The spoken object marker joined to its word: کِتاب رُو → کتابو. Only this
 * way round: no spoken line in the course writes the joined form, and reading
 * every ـُو as را would turn اَلُو or مِتْرُو into a noun and its marker.
 */
function objectSpellings(line: string): string[] {
  const words = markedWords(line);
  const typed = words.map(normalizeFa);
  const out: string[] = [];
  words.forEach((w, i) => {
    if (w === `ر${DAMMA}و` && i > 0 && !/[اویه]$/.test(typed[i - 1]))
      out.push([...typed.slice(0, i - 1), typed[i - 1] + "و", ...typed.slice(i + 1)].join(" "));
  });
  return out;
}

/** One word swapped for another throughout: دَر ⇄ تویِ in writing, آره → بَله in speech. */
const swapWord = (typed: string[], from: string, to: string) => (typed.includes(from) ? typed.map((w) => (w === from ? to : w)).join(" ") : null);

/** Is a spoken word the same word as a written one: the same letters, the same verb, or a sound change (نون / نان, تِهْرون / تِهْران)? */
function sameWord(s: string, w: string, index: FormIndex | null): boolean {
  if (s === w) return true;
  if (index) {
    const a = index.get(s);
    const b = index.get(w);
    if (a && b && a.some((x) => b.some((y) => x.verb.id === y.verb.id && x.spec.person === y.spec.person && x.spec.tense === y.spec.tense))) return true;
  }
  return s.length >= 3 && w.length >= 3 && s[0] === w[0] && distance(s, w) <= 2;
}

/**
 * The spoken words in the written line's order: speech says both دیروز رَفْتَم
 * بازار and دیروز به بازار رَفْتَم. Each written word is matched to one spoken
 * word; a written به may stay or go. Null unless every word finds its partner.
 */
function writtenOrder(spoken: string, written: string, index: FormIndex | null): string[] {
  const sw = normalizeFa(spoken).split(" ");
  const ww = normalizeFa(written).split(" ");
  const used = new Set<number>();
  const withBe: string[] = [];
  for (const w of ww) {
    const i = sw.findIndex((s, k) => !used.has(k) && s === w);
    const j = i >= 0 ? i : sw.findIndex((s, k) => !used.has(k) && sameWord(s, w, index));
    if (j >= 0) {
      used.add(j);
      withBe.push(sw[j]);
    } else if (w === "به") withBe.push("به");
    else return [];
  }
  if (used.size !== sw.length) return [];
  return [withBe.join(" "), withBe.filter((w) => w !== "به").join(" ")];
}

const BE_NOTE = (target: string) => `That word order is right in speech too. The lesson's line has ${target}`;

/** Other ways to type a target line, with notes. `paired` is the other line: a verb counts only if both lines have it. */
function altsOf(target: string, paired: string, index: FormIndex | null, verbs: readonly Verb[], lessonKey: string, spoken: boolean): ConvertAlt[] {
  const own = normalizeFa(target);
  const typed = own.split(" ");
  const note = `Also typed this way. The lesson writes it ${target}`;
  const out = new Map<string, string>();
  const put = (fa: string | null, n: string) => {
    if (fa && fa !== own && !out.has(fa)) out.set(fa, n);
  };
  if (index) {
    // A written target takes written forms only, and a verb the other line also has: written گذاشتی is not spoken ذاشتی,
    // and بِشین (sit, not in the engine) is not a form of شدن.
    const ids = verbIdsIn(paired, index);
    const keep = (h: FormHit) => h.spec.style === (spoken ? "spoken" : "written") && ids.has(h.verb.id);
    for (const a of phraseAlts(target, index, verbs, false, lessonKey, 48, keep)) put(a.text, note);
    if (!spoken) put(presentForFuture(target, index, verbs, keep), `The present is right in writing too, but this line uses the future: ${target}`);
  }
  // که after a verb of saying, knowing or hoping may go (lesson 10.2): see clauseKe.
  const keNote = spoken
    ? `Speech keeps or drops که here; both are right. The lesson's line has ${target}`
    : `Writing usually keeps که here, but it can go. The lesson's line has ${target}`;
  typed.forEach((_, i) => {
    if (clauseKe(typed, i)) put([...typed.slice(0, i), ...typed.slice(i + 1)].join(" "), keNote);
  });
  if (spoken) {
    // And speech may keep the که the written line has: فِکْر می‌کُنَم که….
    const pw = normalizeFa(paired).split(" ");
    pw.forEach((_, i) => {
      if (!clauseKe(pw, i)) return;
      const j = typed.findIndex((t, k) => t === pw[i - 1] && typed[k + 1] !== "که");
      if (j >= 0) put([...typed.slice(0, j + 1), "که", ...typed.slice(j + 1)].join(" "), keNote);
    });
    for (const s of objectSpellings(target)) put(s, `The same object marker, spelled another way. The lesson writes it ${target}`);
    put(swapWord(typed, "آره", "بله"), `That fits too. The lesson's line has ${target}`);
    for (const r of writtenOrder(target, paired, index)) put(r, BE_NOTE(target));
  } else {
    // Writing says "in" with دَر or تویِ.
    put(swapWord(typed, "در", "توی"), `That fits too: writing says “in” both ways. The lesson's line has ${target}`);
    put(swapWord(typed, "توی", "در"), `That fits too: writing says “in” both ways. The lesson's line has ${target}`);
    // Writing says "but" both ways (lesson 10.4).
    put(swapWord(typed, "اما", "ولی"), `That fits too: writing says “but” both ways. The lesson's line has ${target}`);
    put(swapWord(typed, "ولی", "اما"), `That fits too: writing says “but” both ways. The lesson's line has ${target}`);
  }
  return [...out].map(([fa, n]) => ({ fa, note: n }));
}

const BE_FORMS = new Set(["هستم", "هستی", "هستیم", "هستید", "هستند"]);

/**
 * Lesson 4.2 teaches the full هستم after a vowel and the ending after a
 * consonant. A written line with هستم after a consonant can't be predicted
 * from that rule, so the card is not asked toward writing.
 */
const fullBeAfterConsonant = (written: string) => {
  const w = normalizeFa(written).split(" ");
  return w.some((x, i) => BE_FORMS.has(x) && i > 0 && !/[اویه]$/.test(w[i - 1]));
};

/** Every card, in course order, and the lines left out by hand. */
export function buildConvertCards(lessons: readonly ConvertLesson[], opts: ConvertOptions = {}): { cards: ConvertCard[]; leftOut: ConvertLeftOut[] } {
  const verbs = opts.verbs ?? [];
  const index = verbs.length ? formIndex(verbs) : null;
  const cards: ConvertCard[] = [];
  const byLines = new Map<string, ConvertCard>();
  const leftOut: ConvertLeftOut[] = [];
  for (const ref of lessons) {
    // The written line shows only where the lesson shows both registers.
    if (ref.lesson.register !== "both") continue;
    for (const b of ref.lesson.blocks) {
      for (const l of linesOf(b)) {
        if (!l.written) continue;
        const spoken = plain(l.fa);
        const written = plain(l.written);
        if (normalizeFa(spoken) === normalizeFa(written)) continue;
        const key = `${spoken}\n${written}`;
        // Lines that differ only by punctuation or marks are one card (سَلام! / سَلام، حالِت چِطُوره؟).
        const same = byLines.get(`${normalizeFa(spoken)}\n${normalizeFa(written)}`);
        if (same) {
          if (!same.lessons.includes(ref.key)) same.lessons.push(ref.key);
          continue;
        }
        const id = `${ref.key}#${hashLine(key)}`;
        const writtenAlts = altsOf(written, spoken, index, verbs, ref.key, false);
        const spokenAlts = altsOf(spoken, written, index, verbs, ref.key, true);
        // Why each direction is left out: by hand, or by a rule.
        const out = new Map<ConvertDir, string>();
        const byHand = opts.leaveOut?.[id];
        if (byHand) for (const d of byHand.dir ? [byHand.dir] : (["to-written", "to-spoken"] as const)) out.set(d, byHand.why);
        if (fullBeAfterConsonant(written) && !out.has("to-written"))
          out.set("to-written", "the written line has the full verb to be after a consonant, which lesson 4.2 does not predict");
        // The written line is itself good speech (دیروز به بازار رفتم): nothing to convert toward speech.
        // (Only the word order counts here: a chat spelling that matches the written line, such as رفته‌ام, is simply not taken.)
        if (writtenOrder(spoken, written, index).includes(normalizeFa(written)) && !out.has("to-spoken")) out.set("to-spoken", "the written line is right in speech too");
        for (const [d, why] of out) leftOut.push({ id, lesson: ref.number, fa: spoken, written, dir: d, why });
        if (out.size === 2) continue;
        const only: ConvertDir | undefined = out.has("to-written") ? "to-spoken" : out.has("to-spoken") ? "to-written" : undefined;
        // An alternative never equals the line shown: written رفته (for رفته است) would let the spoken line pass.
        const alsoWritten = writtenAlts.filter((a) => a.fa !== normalizeFa(spoken));
        const alsoSpoken = spokenAlts.filter((a) => a.fa !== normalizeFa(written));
        const card: ConvertCard = {
          id,
          fa: l.fa,
          written: l.written,
          en: l.en,
          ...(alsoWritten.length ? { alsoWritten } : {}),
          ...(alsoSpoken.length ? { alsoSpoken } : {}),
          ...(ref.lesson.showMarks ? { marks: true } : {}),
          ...(only ? { only } : {}),
          lessons: [ref.key],
          lesson: { number: ref.number, href: ref.href },
        };
        byLines.set(`${normalizeFa(spoken)}\n${normalizeFa(written)}`, card);
        cards.push(card);
      }
    }
  }
  // A line shown on two cards (the same spoken line, written two ways): each takes the other's target.
  for (const [from, to, twins] of [
    ["fa", "written", "twinsWritten"],
    ["written", "fa", "twinsSpoken"],
  ] as const) {
    const groups = new Map<string, ConvertCard[]>();
    const k = (c: ConvertCard, side: "fa" | "written") => normalizeFa(plain(c[side]));
    for (const c of cards) groups.set(k(c, from), [...(groups.get(k(c, from)) ?? []), c]);
    for (const g of groups.values())
      for (const c of g) {
        const others = [...new Set(g.filter((o) => k(o, to) !== k(c, to)).map((o) => plain(o[to])))];
        if (others.length) c[twins] = others;
      }
  }
  return { cards, leftOut };
}

/** What the card shows and what it wants, for a direction: markup, and the target as plain text. */
export function sides(c: ConvertAsk, dir: ConvertDir) {
  const [shown, target] = dir === "to-written" ? [c.fa, c.written] : [c.written, c.fa];
  return dir === "to-written"
    ? { shown, target: plain(target), also: c.alsoWritten ?? [], twins: c.twinsWritten ?? [], to: "written", from: "spoken" }
    : { shown, target: plain(target), also: c.alsoSpoken ?? [], twins: c.twinsSpoken ?? [], to: "spoken", from: "written" };
}

const squash = (s: string) => s.replace(new RegExp(`[${ZWNJ} ]`, "g"), "");

/** Where the typed words first part from the target's, said in a sentence. */
function firstDifference(typed: string[], target: string[], marked: string[], to: string): string | null {
  let i = 0;
  while (i < typed.length && i < target.length && typed[i] === target[i]) i++;
  if (i === typed.length && i === target.length) return null;
  const want = marked[i];
  if (i === typed.length) return `Not finished: the ${to} form goes on with ${marked.slice(i).join(" ")}.`;
  if (i === target.length) return `The ${to} form ends before ${typed.slice(i).join(" ")}.`;
  // A half-space slip in one word: می رم for می‌رم, or two words closed up.
  if (squash(typed[i]) === squash(target[i]) || squash(typed.slice(i, i + 2).join("")) === squash(target[i]) || squash(typed[i]) === squash(target.slice(i, i + 2).join("")))
    return `Nearly: check the half-space (‌) and spacing in ${want}.`;
  const sameWords = [...typed].sort().join(" ") === [...target].sort().join(" ");
  if (sameWords) return `The words are right, but not their order: here the ${to} form has ${want}.`;
  const later = (w: string, list: string[]) => list.slice(i + 1).includes(w);
  if (typed[i] === target[i + 1] && !later(target[i], typed)) return `A word is missing: the ${to} form has ${want} before ${marked[i + 1]}.`;
  const count = (w: string, list: string[]) => list.filter((x) => x === w).length;
  if (typed[i + 1] === target[i] && count(typed[i], typed) > count(typed[i], target)) return `${typed[i]} is not in the ${to} form.`;
  if (later(typed[i], target)) return `${typed[i]} comes later in the ${to} form; here it has ${want}.`;
  return `You typed ${typed[i]}; the ${to} form has ${want}.`;
}

/** A half-space after a letter that never joins (روز‌ها) changes nothing on screen: it is dropped before comparing. */
const dropSilentZwnj = (s: string) => [...s].filter((ch, i, all) => !(ch === ZWNJ && i > 0 && NON_JOINING.has(all[i - 1]))).join("");

export function checkConvert(card: ConvertAsk, dir: ConvertDir, typedInput: string): Verdict {
  const { shown, target, also, twins, to } = sides(card, dir);
  const input = dropSilentZwnj(typedInput);
  const v = checkFa(input, [target]);
  if (v.ok) return v;
  for (const a of also) if (checkFa(input, [a.fa]).ok) return { ok: true, note: a.note };
  if (twins.length && checkFa(input, twins).ok) return { ok: true, note: `That fits too. This card's ${to} line is ${target}` };

  const typed = normalizeFa(input).split(" ").filter(Boolean);
  if (normalizeFa(input) === normalizeFa(plain(shown))) return { ok: false, hint: `That is the line as shown. Type it in its ${to} form.` };
  // Compare with the reading that agrees longest, so a variant typed early is not called wrong.
  const readings = [target, ...also.map((a) => a.fa)].map((t) => normalizeFa(t).split(" "));
  const agree = (r: string[]) => {
    let i = 0;
    while (i < r.length && r[i] === typed[i]) i++;
    return i;
  };
  const best = readings.reduce((a, b) => (agree(b) > agree(a) ? b : a));
  const marked = best === readings[0] ? markedWords(target) : best;
  const diff = firstDifference(typed, best, marked, to);
  if (v.hint && diff?.startsWith("Nearly")) return { ok: false, hint: diff };
  if (v.hint) return v;
  return diff ? { ok: false, hint: diff } : { ok: false };
}

/** The cards a learner has met in a direction: those with a lesson marked done, and asked that way. */
export function convertCandidates(cards: readonly Pick<ConvertCard, "id" | "lessons" | "only">[], done: Record<string, unknown>, dir: ConvertDir): string[] {
  return cards.filter((c) => (!c.only || c.only === dir) && c.lessons.some((k) => done[k])).map((c) => c.id);
}

/** The cards asked in a direction. */
export const convertCards = <T extends Pick<ConvertCard, "only">>(cards: readonly T[], dir: ConvertDir): T[] => cards.filter((c) => !c.only || c.only === dir);

export const convertStats = (cards: readonly Pick<ConvertCard, "id" | "lessons" | "only">[], data: ConvertData, dir: ConvertDir, done: Record<string, unknown>, now: number): DeckStats =>
  deckStats(convertCandidates(cards, done, dir), data.decks[dir], now);

/** Cards due now in both directions, from the decks alone: for the Today card. */
export function convertDue(data: ConvertData, now: number): number {
  let due = 0;
  for (const d of CONVERT_DIRS) for (const c of Object.values(data.decks[d.id]?.cards ?? {})) if (c.due <= now) due++;
  return due;
}
