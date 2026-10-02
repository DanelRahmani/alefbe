import { describe, expect, it } from "vitest";
import { ALL_LESSONS, UNITS } from "@/content/units";
import { DRILL_WORDS } from "@/content/drill-words";
import { DRILL_GROUPS, LETTERS, letterByChar } from "@/lib/persian/letters";
import { MARKS, SIGNS } from "@/content/reference";
import { GRAMMAR } from "@/content/grammar";
import { PERSIAN_MONTHS } from "@/content/calendar";
import { STATIC_PAGES, isPage } from "@/content/routes";
import { readdirSync } from "node:fs";
import { join } from "node:path";

/** Lessons the marks table points at that are planned but not written yet. */
const FUTURE_LESSONS = new Set(["sounds/short-vowels", "sounds/tashdid-sukun-tanvin", "sounds/vowel-carriers", "sounds/hamze-and-eyn"]);
import type { Block, Example, Lesson } from "@/content/types";
import { parseMarkup, plainOf, splitScript, translitWithErrors, type Token } from "@/lib/markup";
import { VERBS } from "@/content/verbs";
import { TENSES, allForms } from "@/lib/conjugate";
import { checkReadable } from "@/lib/persian/syllables";
import { NON_JOINING, ZWNJ } from "@/lib/persian/chars";
import { tokenizeFa, wordKind } from "@/lib/translit";
import { normalizeFa } from "@/lib/persian/normalize";

// ── Collect every string in the course, tagged Persian (fa) or English (rich).
interface Str {
  where: string;
  kind: "fa" | "rich";
  s: string;
}

function exampleStrs(e: Example, where: string): Str[] {
  const out: Str[] = [
    { where, kind: "fa", s: e.fa },
    { where, kind: "rich", s: e.en },
  ];
  if (e.written) out.push({ where: where + " (written)", kind: "fa", s: e.written });
  if (e.note) out.push({ where: where + " note", kind: "rich", s: e.note });
  return out;
}

function blockStrs(b: Block, where: string): Str[] {
  switch (b.type) {
    case "idea":
    case "heading":
    case "text":
      return [{ where, kind: "rich", s: b.text }];
    case "examples":
      return b.items.flatMap((e, i) => exampleStrs(e, `${where} #${i + 1}`));
    case "pair":
      return [
        ...(b.title ? [{ where, kind: "rich" as const, s: b.title }] : []),
        ...exampleStrs(b.a, where + " a"),
        ...exampleStrs(b.b, where + " b"),
        { where: where + " diff", kind: "rich", s: b.diff },
      ];
    case "table":
      return [
        ...(b.caption ? [{ where, kind: "rich" as const, s: b.caption }] : []),
        ...b.headers.map((h) => ({ where: where + " header", kind: "rich" as const, s: h })),
        ...b.rows.flat().map((c) => ({ where: where + " cell", kind: "rich" as const, s: c })),
      ];
    case "callout":
      return [
        { where, kind: "rich", s: b.text },
        ...(b.title ? [{ where, kind: "rich" as const, s: b.title }] : []),
        ...(b.wrong ? exampleStrs(b.wrong, where + " wrong") : []),
        ...(b.right ? exampleStrs(b.right, where + " right") : []),
      ];
    case "dialogue":
      return [
        ...(b.title ? [{ where, kind: "rich" as const, s: b.title }] : []),
        ...(b.note ? [{ where, kind: "rich" as const, s: b.note }] : []),
        ...b.lines.flatMap((l, i) => exampleStrs({ fa: l.fa, written: l.written, en: l.en }, `${where} line ${i + 1}`)),
      ];
    case "link":
      return b.text ? [{ where, kind: "rich", s: b.text }] : [];
    case "letters":
    case "syllables":
    case "display":
      return [];
    case "build":
      return b.items.flatMap((it, i) => [
        { where: `${where} #${i + 1}`, kind: "fa" as const, s: it.word },
        { where: `${where} #${i + 1} en`, kind: "rich" as const, s: it.en },
      ]);
    case "practice":
      return b.text ? [{ where, kind: "rich", s: b.text }] : [];
    case "skip":
      return [
        { where, kind: "rich", s: b.text },
        { where: where + " label", kind: "rich", s: b.label },
      ];
    case "reading":
      return [
        ...(b.title ? [{ where, kind: "rich" as const, s: b.title }] : []),
        ...(b.note ? [{ where, kind: "rich" as const, s: b.note }] : []),
        ...b.lines.flatMap((l, i) => [
          { where: `${where} line ${i + 1}`, kind: "fa" as const, s: l.fa },
          { where: `${where} line ${i + 1} en`, kind: "rich" as const, s: l.en },
          ...(l.price ? [{ where: `${where} line ${i + 1} price`, kind: "fa" as const, s: l.price }] : []),
        ]),
      ];
    case "quiz":
      return b.questions.flatMap((q, i) => [
        { where: `${where} q${i + 1}`, kind: "rich" as const, s: q.prompt },
        { where: `${where} q${i + 1} explain`, kind: "rich" as const, s: q.explain },
      ]);
  }
}

function lessonStrs(l: Lesson, where: string): Str[] {
  return [
    { where: where + " title", kind: "rich", s: l.title },
    { where: where + " summary", kind: "rich", s: l.summary },
    ...(l.vocab ?? []).flatMap((v, i) => [
      { where: `${where} vocab ${i + 1}`, kind: "fa" as const, s: v.fa },
      ...(v.written ? [{ where: `${where} vocab ${i + 1} (written)`, kind: "fa" as const, s: v.written }] : []),
    ]),
    ...l.blocks.flatMap((b, i) => blockStrs(b, `${where} block ${i + 1} (${b.type})`)),
  ];
}

const ALL: Str[] = [
  ...DRILL_WORDS.flatMap((w, i) => [{ where: `drill word ${i + 1} (${w.en})`, kind: "fa" as const, s: w.fa }]),
  ...LETTERS.flatMap((l) => [
    { where: `letter ${l.ch} hint`, kind: "rich" as const, s: l.hint },
    { where: `letter ${l.ch} key word`, kind: "fa" as const, s: l.key.fa },
  ]),
  ...MARKS.flatMap((m) => [
    { where: `mark ${m.name}`, kind: "fa" as const, s: m.fa },
    { where: `mark ${m.name} example`, kind: "fa" as const, s: m.example },
    { where: `mark ${m.name} does`, kind: "rich" as const, s: m.does },
  ]),
  ...SIGNS.map((x) => ({ where: `sign ${x.name}`, kind: "rich" as const, s: x.does })),
  ...PERSIAN_MONTHS.map((m, i) => ({ where: `month ${i + 1}`, kind: "fa" as const, s: m })),
  ...GRAMMAR.flatMap((t) => t.blocks.flatMap((b, i) => blockStrs(b, `grammar ${t.slug} block ${i + 1} (${b.type})`))),
  ...UNITS.flatMap((u) => [
    { where: `unit ${u.slug} titleFa`, kind: "fa" as const, s: u.titleFa },
    { where: `unit ${u.slug} description`, kind: "rich" as const, s: u.description },
  ]),
  ...ALL_LESSONS.flatMap((r) => lessonStrs(r.lesson, r.number)),
];

/** The Persian token runs of a string (whole string for fa, detected runs for rich). */
function persianRuns(str: Str): Token[][] {
  const tokens = parseMarkup(str.s);
  if (str.kind === "fa") return [tokens];
  const runs: Token[][] = [];
  for (const t of tokens) {
    if (t.kind === "override") runs.push([t]);
    else for (const part of splitScript(t.text)) if (part.fa) runs.push([{ ...t, text: part.s }]);
  }
  return runs;
}

describe("content: the walker", () => {
  it("sees every Persian word of the course", () => {
    let words = 0;
    for (const str of ALL)
      for (const run of persianRuns(str))
        for (const t of run) if (t.kind === "text") words += tokenizeFa(t.text).filter((x) => x.word).length;
    expect(ALL.length).toBeGreaterThan(80);
    expect(words).toBeGreaterThan(150);
  });
});

describe("content: markup", () => {
  it("every string parses", () => {
    const bad = ALL.filter((x) => {
      try {
        parseMarkup(x.s);
        return false;
      } catch {
        return true;
      }
    });
    expect(bad.map((x) => `${x.where}: ${x.s}`)).toEqual([]);
  });
  it("highlights never start on a lone vowel mark", () => {
    const bad = ALL.filter((x) => /\{[ً-ٰٔ]/.test(x.s));
    expect(bad.map((x) => x.where)).toEqual([]);
  });
});

describe("content: Persian spelling", () => {
  it("uses Persian letters and digits, not Arabic look-alikes", () => {
    const bad = ALL.filter((x) => /[يكةۀ٠-٩ى]/.test(x.s));
    expect(bad.map((x) => `${x.where}: ${x.s}`)).toEqual([]);
  });
  it("uses half-spaces cleanly (none by a space, none doubled, none after a non-joining letter)", () => {
    const bad = ALL.filter((x) => {
      const s = x.s;
      if (/ ‌|‌ | ?‌‌/.test(s)) return true;
      return [...s].some((ch, i, arr) => {
        if (ch !== ZWNJ) return false;
        let j = i - 1;
        while (j >= 0 && /[ً-ٰٔ]/.test(arr[j])) j--;
        return j < 0 || NON_JOINING.has(arr[j]);
      });
    });
    expect(bad.map((x) => `${x.where}: ${x.s}`)).toEqual([]);
  });
  it("never splits or closes up a known half-space form (every verb form, every vocab word)", () => {
    // Known forms: everything conjugate.ts makes, and every vocabulary word
    // with a half-space. A string containing one with its ZWNJ turned into a
    // space or dropped fails. Deliberate "wrong" examples are exempt.
    const known = new Set<string>();
    for (const f of allForms(VERBS)) known.add(normalizeFa(f));
    for (const r of ALL_LESSONS) for (const v of r.lesson.vocab ?? []) for (const s of [v.fa, v.written]) if (s) known.add(normalizeFa(plainOf(parseMarkup(s))));
    // Each broken spelling as a word sequence: "می رم" and "میرم" for می‌رم.
    const broken = new Map<string, string>();
    for (const k of known) {
      if (!k.includes(ZWNJ)) continue;
      broken.set(k.split(ZWNJ).join(" "), k);
      broken.set(k.split(ZWNJ).join(""), k);
    }
    const bad: string[] = [];
    for (const str of ALL) {
      if (str.where.includes(" wrong")) continue;
      for (const run of persianRuns(str)) {
        // Overrides are the escape hatch for deliberate misspellings ([میروم|miravam]): a break here.
        const words = normalizeFa(run.map((t) => (t.kind === "override" ? " | " : t.text)).join(""))
          .split(" ")
          .filter(Boolean);
        for (let i = 0; i < words.length; i++)
          for (let n = 1; n <= 3 && i + n <= words.length; n++) {
            const k = broken.get(words.slice(i, i + n).join(" "));
            if (k) bad.push(`${str.where}: «${words.slice(i, i + n).join(" ")}» should be «${k}»`);
          }
      }
    }
    expect(known.size).toBeGreaterThan(VERBS.length * 20);
    expect(bad).toEqual([]);
  });
  it("never detaches the verb prefix می / نمی with a space", () => {
    const bad = ALL.filter((x) => /(^|[\s«])ن?می[ً-ْ]* +[؀-ۿ]/.test(x.s));
    expect(bad.map((x) => `${x.where}: ${x.s}`)).toEqual([]);
  });
});

describe("content: readable in 'all marks' mode", () => {
  it("every Persian word is fully vowel-marked and splits into syllables", () => {
    const problems: string[] = [];
    for (const str of ALL) {
      for (const run of persianRuns(str)) {
        // A highlight can split a word (می‌{رَوَم}); check whole words, with overrides as breaks.
        const text = run.map((t) => (t.kind === "override" ? " " : t.text)).join("");
        for (const tok of tokenizeFa(text)) {
          if (!tok.word || wordKind(tok.s) !== "word") continue;
          for (const e of checkReadable(tok.s)) problems.push(`${str.where}: ${e}`);
        }
      }
    }
    expect(problems).toEqual([]);
  });
});

describe("content: transliteration", () => {
  it("transliterates without errors and leaves no Persian script behind", () => {
    const problems: string[] = [];
    for (const str of ALL) {
      for (const run of persianRuns(str)) {
        // The renderer's own transliteration: highlighted pieces of one word are read together.
        const r = translitWithErrors(run);
        problems.push(...r.errors.map((e) => `${str.where}: ${e}`));
        if (/[؀-ۿ]/.test(r.text)) problems.push(`${str.where}: leftover Persian in "${r.text}"`);
      }
    }
    expect(problems).toEqual([]);
  });
});

describe("content: structure", () => {
  it("unit and lesson slugs are unique", () => {
    const units = UNITS.map((u) => u.slug);
    expect(new Set(units).size).toBe(units.length);
    for (const u of UNITS) {
      const ls = u.lessons.map((l) => l.slug);
      expect(new Set(ls).size, u.slug).toBe(ls.length);
    }
  });

  it.each(ALL_LESSONS.map((r) => [r.number, r] as const))("%s follows the lesson template", (_n, r) => {
    const l = r.lesson;
    expect(l.title).not.toMatch(/[{}*[\]|]/);
    expect(l.summary.length).toBeGreaterThan(10);
    expect(l.source.length).toBeGreaterThan(10);
    expect(l.kinds.length).toBeGreaterThan(0);
    const types = l.blocks.map((b) => b.type);
    expect(types[0]).toBe("idea");
    expect(types).toContain("examples");
    expect(types).toContain("pair");
    expect(l.blocks.some((b) => b.type === "callout" && b.kind === "mistake")).toBe(true);
    expect(types.includes("dialogue") || l.blocks.some((b) => b.type === "callout" && b.kind === "culture")).toBe(true);
    const quiz = l.blocks.find((b) => b.type === "quiz");
    expect(quiz && quiz.type === "quiz" && quiz.questions.length).toBeGreaterThanOrEqual(3);
  });

  it("quiz answers are plain and normalisable", () => {
    const bad: string[] = [];
    for (const r of ALL_LESSONS) {
      for (const b of r.lesson.blocks) {
        if (b.type !== "quiz") continue;
        for (const q of b.questions) {
          if (!q.answers.length) bad.push(`${r.number}: empty answers`);
          for (const a of q.answers) {
            if (q.lang === "fa" && !/^[؀-ۿ‌ .،؟!]+$/.test(normalizeFa(a))) bad.push(`${r.number}: ${a}`);
            if (q.lang !== "fa" && /[؀-ۿ]/.test(a)) bad.push(`${r.number}: ${a}`);
          }
        }
      }
    }
    expect(bad).toEqual([]);
  });

  it("tables have rows as wide as their headers", () => {
    const bad: string[] = [];
    for (const r of ALL_LESSONS)
      for (const b of r.lesson.blocks)
        if (b.type === "table") b.rows.forEach((row, i) => row.length !== b.headers.length && bad.push(`${r.number} row ${i + 1}`));
    expect(bad).toEqual([]);
  });

  it("internal links point at real pages", () => {
    const bad: string[] = [];
    for (const r of ALL_LESSONS)
      for (const b of r.lesson.blocks) if (b.type === "link" && b.href.startsWith("/") && !isPage(b.href)) bad.push(`${r.number}: ${b.href}`);
    for (const m of MARKS) if (m.lesson && !isPage(`/learn/${m.lesson}`) && !FUTURE_LESSONS.has(m.lesson)) bad.push(`mark ${m.name}: ${m.lesson}`);
    expect(bad).toEqual([]);
  });

  it("grammar topics point at real units and lessons", () => {
    const bad: string[] = [];
    const units = new Set(UNITS.map((u) => u.slug));
    for (const t of GRAMMAR) {
      if (!units.has(t.unit)) bad.push(`${t.slug}: unit ${t.unit}`);
      if (t.lesson && !ALL_LESSONS.some((r) => r.key === t.lesson)) bad.push(`${t.slug}: lesson ${t.lesson}`);
    }
    expect(bad).toEqual([]);
  });

  it("every trainer tense opens with a real lesson", () => {
    const keys = new Set(ALL_LESSONS.map((r) => r.key));
    // A tense may be in the engine before its unit is written; once the unit has lessons, the lesson must exist.
    const written = new Set(UNITS.filter((u) => u.lessons.length).map((u) => u.slug));
    const missing = TENSES.filter((t) => t.lesson && written.has(t.lesson.split("/")[0]) && !keys.has(t.lesson));
    expect(missing.map((t) => `${t.id}: ${t.lesson}`)).toEqual([]);
  });

  it("the page list matches the app folder", () => {
    const found: string[] = [];
    const walk = (dir: string, route: string) => {
      for (const e of readdirSync(dir, { withFileTypes: true })) {
        if (e.isDirectory() && !e.name.startsWith("[")) walk(join(dir, e.name), `${route}/${e.name}`);
        if (e.isFile() && e.name === "page.tsx") found.push(route || "/");
      }
    };
    walk("app", "");
    expect(found.sort()).toEqual([...STATIC_PAGES].sort());
  });

  it("letter blocks name real letters, groups and units", () => {
    const bad: string[] = [];
    const units = new Set(UNITS.map((u) => u.slug));
    for (const r of ALL_LESSONS)
      for (const b of r.lesson.blocks) {
        if (b.type === "letters") for (const ch of b.chars) if (!letterByChar.has(ch)) bad.push(`${r.number}: ${ch}`);
        if (b.type === "syllables") for (const ch of b.consonants) if (!letterByChar.has(ch)) bad.push(`${r.number}: ${ch}`);
        if (b.type === "practice" && !(b.group >= 0 && b.group < DRILL_GROUPS.length)) bad.push(`${r.number}: group ${b.group}`);
        if (b.type === "skip") for (const u of b.units) if (!units.has(u)) bad.push(`${r.number}: unit ${u}`);
      }
    expect(bad).toEqual([]);
  });
});

describe("content: owner review", () => {
  it("lists Dari notes still waiting for the owner's check", () => {
    const pending = ALL_LESSONS.flatMap((r) =>
      r.lesson.blocks.filter((b) => b.type === "callout" && b.kind === "dari" && !b.checked).map(() => r.number),
    );
    if (pending.length) console.warn(`Dari notes awaiting the owner's check: ${pending.join(", ")}`);
    expect(Array.isArray(pending)).toBe(true);
  });
});
