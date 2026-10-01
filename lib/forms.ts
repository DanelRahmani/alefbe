// Verb forms found in lesson text, by way of the conjugation engine: what a
// phrase's verbs are, and the other spellings and persons that are just as
// right. Pure. Used by cloze practice and the conversion drill, which ask for
// lesson words and so must accept what the trainer accepts for the same form.
//
// Every alternative comes from lib/conjugate.ts, which is reviewed with golden
// tables; nothing here writes Persian of its own.

import { acceptedAnswers, conjugate, hasForm, lacks, personsOf, stylesOf, TENSES, type FormSpec, type Person, type Tense, type Verb } from "./conjugate";
import { normalizeFa } from "./persian/normalize";

export interface FormHit {
  verb: Verb;
  spec: FormSpec;
  /** The words of the compound's part left out of the key (کار in کار می‌کُنَم matched as می‌کُنَم). */
  tail?: number;
}

export type FormIndex = Map<string, FormHit[]>;

/** Every form the engine makes, keyed as typed (no marks); a compound also by its verb words alone. */
export function formIndex(verbs: readonly Verb[]): FormIndex {
  const index: FormIndex = new Map();
  const add = (key: string, hit: FormHit) => index.set(key, [...(index.get(key) ?? []), hit]);
  for (const verb of verbs)
    for (const t of TENSES)
      for (const negative of [false, true]) {
        if (lacks(verb, t.id, negative, verbs)) continue;
        for (const style of stylesOf(t.id))
          for (const person of personsOf(t.id)) {
            const spec = { tense: t.id, person, style, negative };
            const key = normalizeFa(conjugate(verb, spec, verbs));
            add(key, { verb, spec });
            if (verb.part) {
              const n = normalizeFa(verb.part).split(" ").length;
              const words = key.split(" ");
              // The progressive puts داشتن before the part: دارَم کار می‌کُنَم. Only a part in front is cut.
              if (words.slice(0, n).join(" ") === normalizeFa(verb.part)) add(words.slice(n).join(" "), { verb, spec, tail: n });
            }
          }
      }
  return index;
}

/** A phrase cut into verb forms (longest first) and other words. */
export type Segment = { words: string; hits?: FormHit[] };

export function segments(phrase: string, index: FormIndex): Segment[] {
  const words = normalizeFa(phrase).split(" ").filter(Boolean);
  const out: Segment[] = [];
  for (let i = 0; i < words.length; ) {
    let found = false;
    for (let n = Math.min(4, words.length - i); n >= 1; n--) {
      const key = words.slice(i, i + n).join(" ");
      const hits = index.get(key);
      if (hits) {
        out.push({ words: key, hits });
        i += n;
        found = true;
        break;
      }
    }
    if (!found) out.push({ words: words[i++] });
  }
  return out;
}

/**
 * The hits of one segment that count: a form two tenses share (spoken اومَدی:
 * simple past or perfect) is read as the tense its lesson teaches, or else as
 * the one the course teaches first.
 */
export function readAs(hits: readonly FormHit[], lessonKey?: string): FormHit[] {
  const tenses = [...new Set(hits.map((h) => h.spec.tense))];
  if (tenses.length < 2) return [...hits];
  const taught = tenses.find((t) => TENSES.find((x) => x.id === t)?.lesson === lessonKey);
  const pick = taught ?? TENSES.find((x) => tenses.includes(x.id))!.id;
  return hits.filter((h) => h.spec.tense === pick);
}

const YOU: Partial<Record<Person, Person>> = { "2s": "2p", "2p": "2s" };

const cut = (form: string, hit: FormHit) => (hit.tail ? form.split(" ").slice(hit.tail).join(" ") : form);

/** The same form spelled another way, as the trainer accepts it (one-ی, می‌آم, بـ on a bare compound…). */
function variantsOf(hit: FormHit, verbs: readonly Verb[]): string[] {
  return (
    acceptedAnswers(hit.verb, hit.spec, verbs)
      .variants.map((v) => normalizeFa(cut(v, hit)))
      // A spoken stem with a written اَسْت (اومده است) mixes the two: not taken in a sentence.
      .filter((v) => hit.spec.style !== "spoken" || !v.split(" ").includes("است"))
  );
}

/** Does the phrase hold a command? Its English has no "you", but either "you" can be meant. */
export const hasCommand = (phrase: string, index: FormIndex) =>
  segments(phrase, index).some((s) => s.hits?.some((h) => h.spec.tense === "imperative"));

/** The same verb, tense and style for the other "you". */
function otherYou(hit: FormHit, verbs: readonly Verb[]): string[] {
  const person = YOU[hit.spec.person];
  if (!person) return [];
  const spec = { ...hit.spec, person };
  if (!hasForm(hit.verb, spec, verbs)) return [];
  const form = conjugate(hit.verb, spec, verbs);
  return [normalizeFa(cut(form, hit)), ...variantsOf({ ...hit, spec }, verbs)];
}

export interface PhraseAlt {
  /** The whole phrase, as typed (no marks). */
  text: string;
  why: "spelling" | "you";
}

/**
 * Other ways to type a phrase that are just as right: each verb form's other
 * spellings, and, when `you` is set (the English leaves تو or شما open), the
 * other "you" for every 2nd-person verb at once. At most `max` alternatives.
 */
export function phraseAlts(phrase: string, index: FormIndex, verbs: readonly Verb[], you: boolean, lessonKey?: string, max = 24): PhraseAlt[] {
  const segs = segments(phrase, index).map((s) => (s.hits ? { ...s, hits: readAs(s.hits, lessonKey) } : s));
  const base = segs.map((s) => s.words);
  const out = new Map<string, PhraseAlt["why"]>();
  const own = base.join(" ");
  const put = (words: string[], why: PhraseAlt["why"]) => {
    const text = words.join(" ");
    if (text !== own && !out.has(text) && out.size < max) out.set(text, why);
  };
  // Each segment's spellings, one segment at a time.
  segs.forEach((s, i) => {
    for (const hit of s.hits ?? []) for (const v of variantsOf(hit, verbs)) put(base.map((w, j) => (j === i ? v : w)), "spelling");
  });
  // The other "you", for every 2nd-person segment together.
  if (you && segs.some((s) => s.hits?.some((h) => YOU[h.spec.person]))) {
    const swapped = segs.map((s) => {
      const hit = s.hits?.find((h) => YOU[h.spec.person]);
      return hit ? otherYou(hit, verbs) : [s.words];
    });
    if (swapped.every((x) => x.length)) {
      put(swapped.map((x) => x[0]), "you");
      swapped.forEach((x, i) => {
        for (const v of x.slice(1)) put(swapped.map((y, j) => (j === i ? v : y[0])), "you");
      });
    }
  }
  return [...out].map(([text, why]) => ({ text, why }));
}

/** Does the phrase hold a 2nd-person verb? */
export const hasYouVerb = (phrase: string, index: FormIndex) =>
  segments(phrase, index).some((s) => s.hits?.some((h) => YOU[h.spec.person]));

const HAVE = "dâshtan";

/** One segment's tense: the only one it has, or the one its lesson teaches; null when that leaves two. */
function tenseOf(hits: readonly FormHit[], lessonKey?: string): Tense | null {
  const tenses = [...new Set(hits.map((h) => h.spec.tense))];
  if (tenses.length === 1) return tenses[0];
  const taught = tenses.filter((t) => TENSES.find((x) => x.id === t)?.lesson === lessonKey);
  return taught.length === 1 ? taught[0] : null;
}

/** داشتن in the present or the past, as the progressive puts it in front: دارَم, داشْتَم. */
const progressiveHave = (hits: readonly FormHit[] | undefined): Tense | null => {
  const h = hits?.find((x) => x.verb.id === HAVE && !x.spec.negative && (x.spec.tense === "present" || x.spec.tense === "past"));
  return h ? (h.spec.tense === "present" ? "progressive" : "past-progressive") : null;
};

/**
 * The tenses of the verbs in a line's gaps, one list per gap, for a hint. A
 * form that two tenses share (spoken رَفْتَم: simple past or perfect) is named
 * by the tense its lesson teaches, or the gap gets no hint. داشتن followed by
 * a verb with می is the progressive, also across two gaps (دارَم … می‌رَم), or
 * where the verb is not in the engine's list (دارَن می‌رِسَن); the progressive
 * is named once, on the gap with داشتن.
 */
export function gapTenses(phrases: readonly string[], index: FormIndex, lessonKey?: string): (Tense[] | null)[] {
  const flat = phrases.flatMap((p, gap) => segments(p, index).map((seg) => ({ gap, seg })));
  const out: (Tense[] | null)[] = phrases.map(() => []);
  for (let k = 0; k < flat.length; k++) {
    const { gap, seg } = flat[k];
    if (out[gap] === null) continue;
    const next = flat[k + 1];
    const prog = progressiveHave(seg.hits);
    // The main verb has the same person (دارَم … می‌رَم). A verb the engine lacks
    // can't be checked, so it counts only inside the same gap (دارَن می‌رِسَن).
    const persons = new Set(seg.hits?.map((h) => h.spec.person));
    const main = next && /^ن?می/.test(next.seg.words) && (next.seg.hits ? next.seg.hits.some((h) => persons.has(h.spec.person)) : next.gap === gap);
    if (prog && main) {
      out[gap]!.push(prog);
      k++; // the main verb belongs to it
      continue;
    }
    if (!seg.hits) continue;
    const t = tenseOf(seg.hits, lessonKey);
    if (t === null) out[gap] = null;
    else out[gap]!.push(t);
  }
  return out.map((t) => (t && t.length ? [...new Set(t)] : null));
}

