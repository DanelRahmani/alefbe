// Checking typed answers: Persian script, transliteration, or English.
// Wrong answers that are nearly right get a hint naming the problem.

import { normalizeFa } from "./persian/normalize";

export { normalizeFa };

export interface Verdict {
  ok: boolean;
  /** Shown with a correct answer: an accepted variant or a style nudge. */
  note?: string;
  /** Shown with a wrong answer: what exactly went wrong. */
  hint?: string;
}

// Common variant spellings → the Academy (فرهنگستان) spelling. Normalised forms.
const VARIANTS: Record<string, string> = {
  بلیط: "بلیت",
  اطاق: "اتاق",
  مسأله: "مسئله",
  سوال: "سؤال",
  پائیز: "پاییز",
  هیأت: "هیئت",
};

function applyVariants(s: string): { text: string; notes: string[] } {
  const notes: string[] = [];
  const words = s.split(" ").map((w) => {
    if (VARIANTS[w]) {
      notes.push(`${w} is also seen; the standard spelling is ${VARIANTS[w]}.`);
      return VARIANTS[w];
    }
    if (/ه‌ی$/.test(w)) {
      notes.push(`ـه‌ی for the ezafe is common; the Academy spelling is ـهٔ.`);
      return w.slice(0, -2);
    }
    return w;
  });
  return { text: words.join(" "), notes };
}

const squash = (s: string) => s.replace(/[‌ ]/g, "");
const SAME_SOUND: [RegExp, string][] = [
  [/[صث]/g, "س"],
  [/[ذضظ]/g, "ز"],
  [/ط/g, "ت"],
  [/ح/g, "ه"],
  [/غ/g, "ق"],
];
const collapse = (s: string) => SAME_SOUND.reduce((acc, [re, to]) => acc.replace(re, to), s);

export function checkFa(input: string, accepted: string[]): Verdict {
  const inp = normalizeFa(input);
  const accs = accepted.map(normalizeFa);
  if (accs.includes(inp)) return { ok: true };

  // بخیر is also written به خیر (صبح بخیر, lesson 13.3).
  const joinKheyr = (s: string) => s.replace(/(^| )به خیر( |$)/g, "$1بخیر$2");
  if (joinKheyr(inp) !== inp || accs.some((a) => joinKheyr(a) !== a)) {
    if (accs.some((a) => joinKheyr(a) === joinKheyr(inp))) return { ok: true, note: "بخیر is also written به خیر; both are right." };
  }

  const v = applyVariants(inp);
  if (v.notes.length && accs.some((a) => applyVariants(a).text === v.text)) {
    return { ok: true, note: v.notes.join(" ") };
  }

  for (const a of accs) {
    if (squash(inp) === squash(a)) {
      return { ok: false, hint: "Nearly: the letters are right, but check the half-space (‌) and spacing." };
    }
  }
  const noMadde = (s: string) => s.replace(/آ/g, "ا");
  if (accs.some((a) => a.includes("آ") && noMadde(a) === noMadde(inp))) {
    return { ok: false, hint: "Nearly: a long â that starts a word or syllable is written آ (alef with a madde), not ا." };
  }
  for (const a of accs) {
    const x = squash(v.text);
    const y = squash(a);
    if (x.length === y.length && collapse(x) === collapse(y)) {
      const k = [...x].findIndex((ch, i) => ch !== y[i]);
      return { ok: false, hint: `Same sound, other letter: ${y[k]} not ${x[k]}.` };
    }
  }
  return { ok: false };
}

function latin(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFC")
    .replace(/a\^|aa|[āáàä]/g, "â")
    .replace(/[’‘`ʿʼ]/g, "'")
    .replace(/ei/g, "ey")
    .replace(/ow(?![aeiouâ])/g, "o")
    .replace(/[-\s.,!?;:"]/g, "");
}

export function checkTranslit(input: string, accepted: string[]): Verdict {
  const inp = latin(input);
  const accs = accepted.map(latin);
  if (accs.includes(inp)) return { ok: true };
  if (inp.includes("x") && accs.includes(inp.replace(/x/g, "kh"))) {
    return { ok: true, note: "Accepted. In this course خ is written kh." };
  }
  const q = (s: string) => s.replace(/gh/g, "q");
  if (accs.some((a) => q(a) === q(inp))) {
    return { ok: true, note: "Accepted. In this course غ is gh and ق is q (they sound the same)." };
  }
  const noApos = (s: string) => s.replace(/'/g, "");
  if (accs.some((a) => noApos(a) === noApos(inp))) {
    const a = accepted.find((x) => noApos(latin(x)) === noApos(inp))!;
    return { ok: true, note: `Accepted. Mind the ' for ع / ء: ${a}.` };
  }
  return { ok: false };
}

const english = (s: string) =>
  s
    .toLowerCase()
    .replace(/[.,!?;:"'()]/g, "")
    .replace(/\s+/g, " ")
    .trim();

export function checkEn(input: string, accepted: string[]): Verdict {
  return { ok: accepted.map(english).includes(english(input)) };
}

export function checkAnswer(lang: "fa" | "translit" | "en", input: string, accepted: string[]): Verdict {
  if (lang === "fa") return checkFa(input, accepted);
  if (lang === "translit") return checkTranslit(input, accepted);
  return checkEn(input, accepted);
}
