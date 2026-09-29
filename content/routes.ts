// Every page of the site, for checking links in content (tests/content.test.ts
// also checks this list against the app/ folder).

import { GAMES } from "@/lib/games";
import { MODES } from "@/lib/drill";
import { LETTERS } from "@/lib/persian/letters";
import { ALL_LESSONS } from "./units";

/** Pages with a fixed path. */
export const STATIC_PAGES = [
  "/",
  "/script",
  "/practice",
  "/practice/quiz",
  "/practice/trace",
  "/practice/trace/session",
  "/dictionary",
  "/progress",
  "/offline",
];

export const ALL_PAGES = new Set([
  ...STATIC_PAGES,
  ...ALL_LESSONS.map((r) => r.href),
  ...LETTERS.map((l) => `/script/${l.slug}`),
  ...MODES.map((m) => `/practice/drill/${m.id}`),
  ...GAMES.map((g) => `/practice/games/${g.id}`),
]);

/** Is an internal link's path (without ?query or #hash) a real page? */
export const isPage = (href: string) => ALL_PAGES.has(href.split(/[?#]/)[0] || "/");
