// Cloze practice at /practice/cloze. Pure: the UI keeps state.
//
// A card is a lesson line with its {highlight} blanked: a core example, a line
// of a contrast pair or a dialogue line. The learner reads the English and the
// sentence with gaps, and types the missing words. A card joins the deck when
// its lesson is marked done. Leitner scheduling is lib/srs.ts, one deck.
//
// Every Persian string a learner sees on a card is lesson text: the line cut
// at its highlight, the line before it in a dialogue, and the full lines after
// an answer. Other answers that are right come from lesson text (the written
// line) or from the conjugation engine (lib/forms.ts); none is written here.
//
// Decisions:
// - The line asked is the one the lesson shows first: the spoken line where
//   the lesson has both. Each gap also takes the words the written line has in
//   that place, with a note. Gaps are matched to the written line's highlights
//   by likeness, so a written line in another order still lines up.
// - Several highlights are one answer: the missing words in order, a space
//   between them. Each gap is judged on its own, spoken or written.
// - A gap with a verb names its tense ("simple past"): the English often fits
//   several tenses, and the lesson wants one.
// - In a dialogue the line before is shown, as the answer may hang on it.
// - Also right: the engine's other spellings of a verb form (میام, می‌آم),
//   the other "you" where nothing fixes تُو or شُما, را spelled را, رُو or ـو,
//   تو / تویِ / دَر for "in", and اون for او.
// - Left out: callouts (so every `wrong` example), lines whose blank would be
//   the whole sentence, highlights on part of a word (a prefix such as می‌),
//   lines whose English holds the answer (in Persian or transliterated), a gap
//   that is a name the English gives, and the cards in `leaveOut` (the English
//   allows a word the lessons do not give, such as another polite phrase).
// - A line taught in several lessons is one card, which joins with any of them.
// - Cards that look the same (the same text around the gaps, the same English)
//   accept each other's answers: کُجا … زِنْدِگی می‌کُنین / می‌کُنی, "Where do you live?".

import type { Block, Lesson } from "@/content/types";
import { checkFa, type Verdict } from "./answers";
import { tenseInfo, type Verb } from "./conjugate";
import { formIndex, gapTenses, hasCommand, hasYouVerb, phraseAlts, segments, type FormIndex } from "./forms";
import { parseMarkup, plainOf, sliceTokens, tokenText, translitOf, type Token } from "./markup";
import { ARABIC_SCRIPT, DAMMA, FATHA, HAMZA_ABOVE, KASRA, ZWNJ, isLetter, isMark } from "./persian/chars";
import { canonicalFa, markedWords, normalizeFa } from "./persian/normalize";
import { deckStats, emptyDeck, type DeckState, type DeckStats } from "./srs";

/** A piece of the asked line: lesson text, or a gap (numbered from 0). */
export type ClozePart = { text: string } | { gap: number };

/** Another answer for one gap, and the note shown when it is typed. */
export interface ClozeAlt {
  fa: string;
  note: string;
  /** It is the other "you": every gap with a 2nd-person word must then take it too. */
  you?: true;
}

export interface ClozeGap {
  /** The words the lesson highlights, marked. */
  fa: string;
  /** The written line's words in this place, when they differ and fit. */
  written?: string;
  /** Other answers that are right. */
  also?: ClozeAlt[];
  /** The tenses of its verbs, for the hint: "simple past", "present + present subjunctive". */
  tense?: string;
}

export interface ClozeCard {
  /** "unit/lesson#hash": the first lesson's key and a hash of the line. */
  id: string;
  /** The line as the lesson writes it, with its highlights. */
  fa: string;
  /** The written twin the lesson shows beneath it. */
  written?: string;
  en: string;
  /** The asked line cut into text and gaps. */
  parts: ClozePart[];
  gaps: ClozeGap[];
  /** The highlighted words, in order, a space between gaps. */
  answer: string;
  /** The answers of other cards that look the same: right here too. */
  twins?: string[];
  /** The line before, in a dialogue. */
  before?: { fa: string; en: string };
  /** The lesson shows every vowel mark whatever the setting (Unit 2). */
  marks?: boolean;
  /** The lessons that teach the line, as "unit/lesson" keys. */
  lessons: string[];
  /** The first of them, for the link after an answer. */
  lesson: { number: string; href: string };
}

/** What asking and checking need: the notebook carries this, not the card list. */
export type ClozeAsk = Omit<ClozeCard, "lessons">;

/** A card without its lesson list, for the notebook. */
export function clozeAsk(c: ClozeCard): ClozeAsk {
  const ask: ClozeAsk & { lessons?: string[] } = { ...c };
  delete ask.lessons;
  return ask;
}

export interface ClozeData {
  deck: DeckState;
}

export const emptyClozeData = (): ClozeData => ({ deck: emptyDeck() });

/** A lesson as the builder needs it (content/units.ts LessonRef fits). */
export interface ClozeLesson {
  key: string;
  number: string;
  href: string;
  lesson: Pick<Lesson, "register" | "showMarks" | "blocks">;
}

export type ClozeSkip = "whole sentence" | "part of a word" | "answer in the English" | "a name the English gives" | "left out by hand";

export interface ClozeLeftOut {
  lesson: string;
  fa: string;
  reason: ClozeSkip;
  /** For a card left out by hand, why. */
  why?: string;
}

export interface ClozeOptions {
  /** The verb list, for the engine's other spellings and persons. */
  verbs?: readonly Verb[];
  /** Card ids to leave out, with the reason. */
  leaveOut?: Readonly<Record<string, string>>;
}

/** FNV-1a, 32 bits, in base 36: a short, stable id for a line. */
export function hashLine(s: string): string {
  let h = 0x811c9dc5;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return (h >>> 0).toString(36);
}

interface Run {
  start: number;
  end: number;
}

/** The highlighted stretches of a line's plain text, trimmed of spaces. */
function highlightRuns(src: string): { tokens: Token[]; plain: string; runs: Run[] } {
  const tokens = parseMarkup(src);
  const runs: Run[] = [];
  let pos = 0;
  for (const t of tokens) {
    const s = tokenText(t);
    if (t.hl) {
      const last = runs[runs.length - 1];
      if (last && last.end === pos) last.end += s.length;
      else runs.push({ start: pos, end: pos + s.length });
    }
    pos += s.length;
  }
  const plain = plainOf(tokens);
  for (const r of runs) {
    while (r.start < r.end && plain[r.start] === " ") r.start++;
    while (r.end > r.start && plain[r.end - 1] === " ") r.end--;
  }
  return { tokens, plain, runs: runs.filter((r) => r.end > r.start) };
}

/** Does the stretch cut a word: a letter, mark or half-space joins it to its neighbour? */
const joins = (ch: string | undefined) => !!ch && (isLetter(ch) || isMark(ch) || ch === ZWNJ);
const cutsWord = (plain: string, r: Run) =>
  joins(plain[r.start - 1]) || joins(plain[r.end]) || plain[r.start] === ZWNJ || plain[r.end - 1] === ZWNJ;

const runText = (plain: string, r: Run) => plain.slice(r.start, r.end);

/** The first word after a stretch, as typed. */
const wordAfter = (plain: string, r: Run) => normalizeFa(plain.slice(r.end)).split(" ")[0] ?? "";

/** The Persian words of an English gloss, as typed. */
const faWordsIn = (en: string) =>
  normalizeFa([...en].map((ch) => (ARABIC_SCRIPT.test(ch) || ch === ZWNJ ? ch : " ")).join(""))
    .split(" ")
    .filter(Boolean);

/** Latin letters only, lower case, â kept: for comparing transliterations. */
const fold = (s: string) => s.toLowerCase().normalize("NFC").replace(/[^a-zâ]/g, "");

/** The italic runs of an English gloss: *ketâb-e man*. */
const italicsIn = (en: string) => parseMarkup(en).filter((t) => t.it).map((t) => fold(tokenText(t)));

/** The capitalised words of an English gloss, possessive 's off: Maryam's → maryam. */
const namesIn = (en: string) => (en.replace(/\*[^*]*\*/g, " ").match(/\b[A-Z][a-zâ]+/g) ?? []).map((w) => fold(w.replace(/'s$/, "")));

/** Levenshtein distance, for lining up the written line's highlights with the spoken one's. */
export function distance(a: string, b: string): number {
  const d = Array.from({ length: b.length + 1 }, (_, j) => j);
  for (let i = 1; i <= a.length; i++) {
    let prev = d[0];
    d[0] = i;
    for (let j = 1; j <= b.length; j++) {
      const cur = d[j];
      d[j] = Math.min(d[j] + 1, d[j - 1] + 1, prev + (a[i - 1] === b[j - 1] ? 0 : 1));
      prev = cur;
    }
  }
  return d[b.length];
}

function permutations(n: number): number[][] {
  if (n <= 1) return [[...Array(n).keys()]];
  return permutations(n - 1).flatMap((p) => [...Array(n).keys()].map((i) => [...p.slice(0, i), n - 1, ...p.slice(i)]));
}

/** For each spoken gap, the written highlight that is most like it (the order may differ). */
function lineUp(spoken: string[], written: string[]): number[] {
  if (spoken.length > 5) return spoken.map((_, i) => i);
  let best = spoken.map((_, i) => i);
  let bestCost = Infinity;
  for (const p of permutations(spoken.length)) {
    const cost = p.reduce((sum, w, i) => sum + distance(normalizeFa(spoken[i]), normalizeFa(written[w])), 0);
    if (cost < bestCost) [best, bestCost] = [p, cost];
  }
  return best;
}

/** Words after a gap that make the written words fill more than the gap: is, are, a pronoun. */
const AFTER = new Set(["است", "هست", "هستم", "هستی", "هستیم", "هستید", "هستند", "من", "تو", "او", "ما", "شما", "آنها", "آن‌ها"]);

/** Cues in the English that fix which "you". */
const WHICH_YOU = /polite|formal|friend|several|you all|plural|singular|child|to one|to a /i;

/** A visible word that fixes the person: the pronoun تُو / شُما, or a "your" ending (ـِت, ـِتون). */
const youWord = (w: string) =>
  w === `ت${DAMMA}و` || w === `ش${DAMMA}ما` || new RegExp(`(${KASRA}|${FATHA}|${ZWNJ})ت(${DAMMA}?ون|ان)?$`).test(w);

/** "You are" in a word: کُجایی, کُجایین, هَسْتی (the course's present of to be is not in the engine). */
const youBe = (w: string) => /ا(یی|یین|یید)$/.test(w) || ["هستی", "هستین", "هستید", "نیستی", "نیستین", "نیستید"].includes(w);

/** The object marker: X رُو, Xُو (کِتابُو), or مَنُو. */
const RO = `ر${DAMMA}و`;

/** Other answers for one gap that the lessons' rules allow, each with its note. */
/** `verbsOnly`: just the engine's other spellings and persons (for the written words, whose other words are the spoken gap's). */
function gapAlts(fa: string, index: FormIndex | null, verbs: readonly Verb[], you: boolean, lessonKey: string, verbsOnly = false): ClozeAlt[] {
  const out: ClozeAlt[] = [];
  const typed = normalizeFa(fa);
  const add = (alt: string, note: string, other?: boolean) => {
    if (alt !== typed && !out.some((o) => o.fa === alt)) out.push({ fa: alt, note, ...(other ? { you: true as const } : {}) });
  };
  const youNote = `That fits too: the English leaves open which “you”. The lesson's line has ${fa}.`;
  if (index)
    for (const a of phraseAlts(fa, index, verbs, you, lessonKey))
      add(a.text, a.why === "you" ? youNote : `Also typed this way; the lesson's line has ${fa}.`, a.why === "you");
  if (verbsOnly) return out;

  const words = markedWords(fa);
  const plainWords = words.map(normalizeFa);
  const swap = (i: number, by: string[]) => [...plainWords.slice(0, i), ...by, ...plainWords.slice(i + 1)].join(" ");
  const isVerb = (w: string) => !!index && segments(w, index).some((s) => s.hits);
  words.forEach((w, i) => {
    const p = plainWords[i];
    // را, spelled three ways: کِتاب رُو, کِتابُو, کِتاب را.
    if (w === RO) {
      add(swap(i, ["را"]), `The same object marker, spelled another way; the lesson's line has ${fa}.`);
      const prev = plainWords[i - 1];
      if (prev && !/[اویه]$/.test(prev)) add([...plainWords.slice(0, i - 1), prev + "و", ...plainWords.slice(i + 1)].join(" "), `The same object marker, spelled another way; the lesson's line has ${fa}.`);
    } else if (w.endsWith(`${DAMMA}و`) && p.length > 2 && !isVerb(w)) {
      const stem = p.slice(0, -1);
      const note = `The same object marker, spelled another way; the lesson's line has ${fa}.`;
      add(swap(i, [stem, "رو"]), note);
      add(swap(i, [stem, "را"]), note);
      if (stem === "من") add(swap(i, ["مرا"]), note);
    }
    // تو for "in" (unmarked: tu, not تُو "you"), with تویِ and دَر.
    if (w === "تو" || p === "توی") for (const x of ["تو", "توی", "در"]) add(swap(i, [x]), `That fits too; the lesson's line has ${fa}.`);
    if (w === "او") add(swap(i, ["اون"]), `That fits too; the lesson's line has ${fa}.`);
    // The other "your": ـِت ⇄ ـِتون.
    if (you && !isVerb(w)) {
      if (new RegExp(`(${KASRA}|${FATHA}|${ZWNJ})ت$`).test(w)) add(swap(i, [p + "ون"]), youNote, true);
      else if (new RegExp(`(${KASRA}|${ZWNJ})تون$`).test(w)) add(swap(i, [p.slice(0, -2)]), youNote, true);
    }
  });
  return out;
}

interface Line {
  fa: string;
  written?: string;
  en: string;
}

/**
 * The lines of a block that cards are made from. A dialogue line comes with
 * the line before it, shown on the card, and the dialogue's other lines, which
 * fix who "you" is.
 */
function linesOf(b: Block): { line: Line; before?: Line; others: string[] }[] {
  if (b.type === "examples") return b.items.map((line) => ({ line, others: [] }));
  if (b.type === "pair") return [{ line: b.a, others: [] }, { line: b.b, others: [] }];
  if (b.type === "dialogue")
    return b.lines.map((line, i) => ({ line, before: b.lines[i - 1], others: b.lines.filter((_, j) => j !== i).map((o) => o.fa) }));
  return [];
}

type Made = Omit<ClozeCard, "id" | "lessons" | "lesson">;

/** One line as a card, or why it is left out. */
function cardOf(l: Line, others: readonly string[], ref: ClozeLesson, index: FormIndex | null, verbs: readonly Verb[]): Made | ClozeSkip | null {
  const { tokens, plain, runs } = highlightRuns(l.fa);
  if (!runs.length) return null;
  if (runs.some((r) => cutsWord(plain, r))) return "part of a word";

  const parts: ClozePart[] = [];
  let at = 0;
  runs.forEach((r, i) => {
    if (r.start > at) parts.push({ text: plain.slice(at, r.start) });
    parts.push({ gap: i });
    at = r.end;
  });
  if (at < plain.length) parts.push({ text: plain.slice(at) });
  const frame = parts.map((p) => ("text" in p ? p.text : " ")).join("");
  if (![...frame].some(isLetter)) return "whole sentence";

  const answers = runs.map((r) => runText(plain, r));
  const answer = answers.join(" ");
  const enWords = new Set(faWordsIn(l.en));
  if (normalizeFa(answer).split(" ").some((w) => enWords.has(w))) return "answer in the English";
  // The sound of a gap in the English gives it away too: *ketâb-e man*.
  const sounds = runs.map((r) => fold(translitOf(sliceTokens(tokens, r.start, r.end))));
  const italics = italicsIn(l.en);
  if (sounds.some((s) => s.length >= 3 && italics.some((it) => it.includes(s)))) return "answer in the English";
  const names = namesIn(l.en);
  if (sounds.some((s) => names.includes(s))) return "a name the English gives";

  // Which "you" is open: the English says you (or the gap is a command), and nothing
  // on the card or elsewhere in its dialogue fixes تُو or شُما.
  const frameWords = markedWords(frame);
  const shown = [frame, ...others.map((o) => plainOf(parseMarkup(o)))].join(" ");
  const shownWords = markedWords(shown);
  const you =
    (/\byou(r|rs)?\b/i.test(l.en) || (!!index && answers.some((a) => hasCommand(a, index)))) &&
    !WHICH_YOU.test(l.en) &&
    !shownWords.some(youWord) &&
    !shownWords.map(normalizeFa).some(youBe) &&
    !(index && hasYouVerb(shown, index));

  // The written twin shows only where the lesson shows both registers.
  const written = ref.lesson.register === "both" ? l.written : undefined;
  let writtenFor: (string | undefined)[] = answers.map(() => undefined);
  if (written) {
    const w = highlightRuns(written);
    if (w.runs.length === runs.length && !w.runs.some((r) => cutsWord(w.plain, r))) {
      const wAnswers = w.runs.map((r) => runText(w.plain, r));
      const order = lineUp(answers, wAnswers);
      const seen = new Set(frameWords.map(normalizeFa).filter((x) => x.length >= 2));
      writtenFor = answers.map((a, i) => {
        const k = order[i];
        const wa = wAnswers[k];
        if (normalizeFa(wa) === normalizeFa(a)) return undefined;
        // The written words would repeat a word the card shows: مَغازه‌ای beside مَغازه.
        const own = new Set(normalizeFa(a).split(" "));
        if (normalizeFa(wa).split(" ").some((x) => !own.has(x) && [...seen].some((f) => x === f || x.startsWith(f)))) return undefined;
        // The written line says "is" or "you" outside its highlight, where the spoken gap holds it: تِهْرونه / تِهْران اَسْت.
        const after = wordAfter(w.plain, w.runs[k]);
        if (AFTER.has(after) && wordAfter(plain, runs[i]) !== after) return undefined;
        return wa;
      });
    }
  }

  const tenseLists = index ? gapTenses(answers, index, ref.key) : answers.map(() => null);
  const gaps: ClozeGap[] = answers.map((a, i) => {
    const own = normalizeFa(a);
    const wa = writtenFor[i];
    // The written words, and their own other spellings and persons: each noted as written.
    const writtenSet: Pick<ClozeAlt, "fa" | "you">[] = wa ? [{ fa: normalizeFa(wa) }, ...gapAlts(wa, index, verbs, you, ref.key, true)] : [];
    const asWritten = (x: Pick<ClozeAlt, "fa" | "you">): ClozeAlt =>
      x.you
        ? { fa: x.fa, note: `Those are the written words, for the other “you”. This line is spoken: ${a}.`, you: true }
        : { fa: x.fa, note: `Those are the written words; this line is spoken: ${a}.` };
    const also: ClozeAlt[] = [];
    const add = (x: ClozeAlt) => {
      if (x.fa !== own && !also.some((o) => o.fa === x.fa)) also.push(x);
    };
    for (const x of gapAlts(a, index, verbs, you, ref.key)) {
      const w = writtenSet.find((y) => y.fa === x.fa);
      add(w ? asWritten({ fa: x.fa, you: x.you ?? w.you }) : x);
    }
    for (const x of writtenSet) add(asWritten(x));
    const tense = tenseLists[i]?.map((t) => tenseInfo(t).title.toLowerCase()).join(" + ");
    return { fa: a, ...(wa ? { written: wa } : {}), ...(also.length ? { also } : {}), ...(tense ? { tense } : {}) };
  });

  return {
    fa: l.fa,
    ...(written ? { written } : {}),
    en: l.en,
    parts,
    gaps,
    answer,
    ...(ref.lesson.showMarks ? { marks: true } : {}),
  };
}

/** Every card, in course order (lessons in order, lines in order), and the lines left out. */
export function buildClozeCards(lessons: readonly ClozeLesson[], opts: ClozeOptions = {}): { cards: ClozeCard[]; leftOut: ClozeLeftOut[] } {
  const verbs = opts.verbs ?? [];
  const index = verbs.length ? formIndex(verbs) : null;
  const cards: ClozeCard[] = [];
  const byLine = new Map<string, ClozeCard>();
  const leftOut: ClozeLeftOut[] = [];
  for (const ref of lessons) {
    for (const b of ref.lesson.blocks) {
      for (const { line: l, before, others } of linesOf(b)) {
        const same = byLine.get(l.fa);
        if (same) {
          if (!same.lessons.includes(ref.key)) same.lessons.push(ref.key);
          continue;
        }
        const made = cardOf(l, others, ref, index, verbs);
        if (made === null) continue;
        if (typeof made === "string") {
          leftOut.push({ lesson: ref.number, fa: l.fa, reason: made });
          continue;
        }
        const id = `${ref.key}#${hashLine(l.fa)}`;
        const why = opts.leaveOut?.[id];
        if (why) {
          leftOut.push({ lesson: ref.number, fa: l.fa, reason: "left out by hand", why });
          continue;
        }
        const card: ClozeCard = {
          id,
          ...made,
          ...(before ? { before: { fa: before.fa, en: before.en } } : {}),
          lessons: [ref.key],
          lesson: { number: ref.number, href: ref.href },
        };
        byLine.set(l.fa, card);
        cards.push(card);
      }
    }
  }
  // Cards that look the same accept each other's answers.
  const looks = new Map<string, ClozeCard[]>();
  for (const c of cards) looks.set(lookKey(c), [...(looks.get(lookKey(c)) ?? []), c]);
  for (const group of looks.values()) {
    for (const c of group) {
      const twins = group.filter((o) => normalizeFa(o.answer) !== normalizeFa(c.answer)).map((o) => o.answer);
      if (twins.length) c.twins = twins;
    }
  }
  return { cards, leftOut };
}

/** What a learner sees of a card: the text around the gaps, and the English. */
const lookKey = (c: Pick<ClozeCard, "parts" | "en">) =>
  normalizeFa(c.parts.map((p) => ("text" in p ? p.text : " _ ")).join("")) + "\n" + c.en.toLowerCase().replace(/\s+/g, " ").trim();

/** How many gaps a card has. */
export const gapCount = (c: Pick<ClozeCard, "parts">) => c.parts.filter((p) => "gap" in p).length;

/** The cards a learner has met: those with a lesson marked done (`done` holds finished lesson keys). */
export function clozeCandidates(cards: readonly Pick<ClozeCard, "id" | "lessons">[], done: Record<string, unknown>): string[] {
  return cards.filter((c) => c.lessons.some((k) => done[k])).map((c) => c.id);
}

/** Each gap's answers, the lesson's first; a note for every other. */
const optionsOf = (g: ClozeGap): ClozeAlt[] => [{ fa: g.fa, note: "" }, ...(g.also ?? [])];

/**
 * Every way to fill all the gaps, the lesson's own first. The other "you" is
 * all or nothing: می‌خوای … کُنی or می‌خواین … کُنین, never one of each. Capped,
 * as each gap multiplies the rest.
 */
function combinations(gaps: readonly ClozeGap[], cap = 512): { text: string; notes: string[] }[] {
  const out: { text: string; notes: string[] }[] = [];
  const youGaps = gaps.map((g) => !!g.also?.some((a) => a.you));
  for (const other of youGaps.some(Boolean) ? [false, true] : [false]) {
    let acc: { text: string[]; notes: string[] }[] = [{ text: [], notes: [] }];
    gaps.forEach((g, i) => {
      const options = optionsOf(g).filter((x) => !youGaps[i] || !!x.you === other);
      const next: typeof acc = [];
      for (const o of acc)
        for (const x of options) {
          if (next.length >= cap) break;
          next.push({ text: [...o.text, x.fa], notes: x.note ? [...o.notes, x.note] : o.notes });
        }
      acc = next;
    });
    out.push(...acc.map((o) => ({ text: o.text.join(" "), notes: o.notes })));
  }
  return out;
}

const HAMZE_EZAFE = `ه${HAMZA_ABOVE}`;

export function checkCloze(card: Pick<ClozeCard, "answer" | "gaps" | "twins" | "parts">, input: string): Verdict {
  const combos = combinations(card.gaps);
  for (const c of combos) {
    const v = checkFa(input, [c.text]);
    if (!v.ok) continue;
    const notes = [...new Set([...c.notes, ...(v.note ? [v.note] : [])])];
    // Marks are not checked, but a lesson about ـهٔ should say when it is missing.
    if (!c.notes.length && card.answer.includes(HAMZE_EZAFE) && !canonicalFa(input).includes(HAMZE_EZAFE))
      notes.push(`Accepted. In writing this ezafe is marked: ${card.answer}.`);
    return notes.length ? { ok: true, note: notes.join(" ") } : { ok: true };
  }
  if (card.twins && checkFa(input, card.twins).ok) return { ok: true, note: `That fits too. The lesson's line has ${card.answer}.` };
  for (const c of combos) {
    const v = checkFa(input, [c.text]);
    if (v.hint) return v;
  }
  if (/[0-9۰-۹٠-٩]/.test(input) && !/[0-9۰-۹٠-٩]/.test(card.answer))
    return { ok: false, hint: "Write the number in words, as the line does." };
  const gaps = gapCount(card);
  const typed = normalizeFa(input).split(" ").filter(Boolean).length;
  const wanted = normalizeFa(card.answer).split(" ").length;
  if (gaps > 1 && typed < wanted) return { ok: false, hint: `This line has ${gaps} gaps: type the missing words of each, in order, with a space between.` };
  return { ok: false };
}

/** Deck counts for the cards the learner has met. */
export const clozeStats = (cards: readonly Pick<ClozeCard, "id" | "lessons">[], data: ClozeData, done: Record<string, unknown>, now: number): DeckStats =>
  deckStats(clozeCandidates(cards, done), data.deck, now);

/** Cards due now, from the deck alone: for the Today card, which has no card list. */
export function clozeDue(data: ClozeData, now: number): number {
  let due = 0;
  for (const c of Object.values(data.deck.cards)) if (c.due <= now) due++;
  return due;
}

/**
 * The deck without cards that have left the course (a line rewritten or
 * removed gets a new id). Returns the same object when nothing goes.
 */
export function pruneDeck(deck: DeckState, ids: ReadonlySet<string>): DeckState {
  const gone = Object.keys(deck.cards).filter((id) => !ids.has(id));
  if (!gone.length) return deck;
  const cards = { ...deck.cards };
  for (const id of gone) delete cards[id];
  return { ...deck, cards };
}
