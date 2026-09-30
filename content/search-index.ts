// Everything the search palette can find, built at build time.

import { keysFor, type SearchItem } from "@/lib/search";
import { GAMES } from "@/lib/games";
import { LETTERS } from "@/lib/persian/letters";
import { DICTIONARY } from "./dictionary";
import { GRAMMAR } from "./grammar";
import { ALL_LESSONS } from "./units";

const PAGES: { title: string; href: string; sub: string; also?: string[] }[] = [
  { title: "The path", href: "/", sub: "All lessons, unit by unit", also: ["home", "lessons", "course"] },
  { title: "The script", href: "/script", sub: "Letters, vowel marks and digits", also: ["alphabet", "letters", "chart"] },
  { title: "Practice", href: "/practice", sub: "Trainers, quiz, tracing and games" },
  { title: "Letter trainer", href: "/practice/drill/sound", sub: "Spaced repetition for the letters", also: ["drill", "srs", "review"] },
  { title: "Verb trainer", href: "/verbs", sub: "Conjugate the core verbs, spoken and written", also: ["verbs", "conjugation", "conjugate", "present tense", "past tense", "present perfect", "past continuous", "progressive", "tenses", "srs"] },
  { title: "Letter quiz", href: "/practice/quiz", sub: "Quick rounds on names, sounds and forms" },
  { title: "Tracing", href: "/practice/trace", sub: "Write the letters", also: ["handwriting", "write"] },
  { title: "Tracing session", href: "/practice/trace/session", sub: "A set of letters, one after another" },
  { title: "Tracing sheets", href: "/practice/sheets", sub: "Print letters to trace on paper", also: ["print", "worksheet", "handwriting"] },
  { title: "Dictionary", href: "/dictionary", sub: "Every word in the course", also: ["words", "vocabulary"] },
  { title: "Grammar at a glance", href: "/grammar", sub: "The core grammar on one page", also: ["overview"] },
  { title: "Progress", href: "/progress", sub: "Streak, statistics, backup", also: ["backup", "export", "import", "stats"] },
  ...GAMES.map((g) => ({ title: g.title, href: `/practice/games/${g.id}`, sub: `Game · ${g.blurb}`, also: ["game"] })),
];

export const SEARCH_INDEX: SearchItem[] = [
  ...PAGES.map((p) => ({
    kind: "page" as const,
    title: p.title,
    sub: p.sub,
    href: p.href,
    keys: keysFor({ en: [p.title, ...(p.also ?? [])] }),
  })),
  ...ALL_LESSONS.map((r) => ({
    kind: "lesson" as const,
    title: r.lesson.title,
    sub: `Lesson ${r.number} · ${r.unit.title}`,
    href: r.href,
    keys: keysFor({ fa: [r.lesson.title], en: [r.lesson.title, r.lesson.summary] }),
  })),
  ...GRAMMAR.map((t) => ({
    kind: "grammar" as const,
    title: t.title,
    sub: "Grammar at a glance",
    href: `/grammar#${t.slug}`,
    keys: keysFor({ en: [t.title] }),
  })),
  ...LETTERS.map((l) => ({
    kind: "letter" as const,
    title: l.name,
    fa: l.ch,
    sub: `Letter · ${l.sounds.join(" / ")}`,
    href: `/script/${l.slug}`,
    keys: keysFor({ fa: [l.ch], tr: [l.name, ...(l.altNames ?? [])], en: ["letter"] }),
  })),
  ...DICTIONARY.map((e) => ({
    kind: "word" as const,
    title: e.en,
    fa: e.fa,
    spoken: e.spoken,
    sub: e.translit,
    href: `/dictionary?q=${encodeURIComponent(e.id)}`,
    keys: e.keys,
  })),
];
