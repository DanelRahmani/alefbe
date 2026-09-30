// The "Type it" game's items: short examples and vocabulary from the lessons
// (so every item is reviewed course content), from Unit 3 on, where the
// half-space is taught. Built at build time; the game page passes it down.

import type { TypeItem } from "@/lib/games";
import { parseMarkup, plainOf, translitOf } from "@/lib/markup";
import { ALL_LESSONS } from "./units";

/** Script and sound lessons come before typing whole words. */
const SKIP_UNITS = new Set(["start-here", "alphabet", "sounds"]);
const MAX_WORDS = 4;

function collect(): TypeItem[] {
  const seen = new Set<string>();
  const out: TypeItem[] = [];
  const add = (fa: string, en: string) => {
    const tokens = parseMarkup(fa);
    // Overrides mark irregular readings; keep the game to regular spelling.
    if (tokens.some((t) => t.kind === "override")) return;
    const plain = plainOf(tokens);
    if (plain.split(" ").length > MAX_WORDS || seen.has(plain)) return;
    seen.add(plain);
    out.push({ fa: plain, en: en.replace(/\*/g, ""), translit: translitOf(tokens) });
  };
  for (const r of ALL_LESSONS) {
    if (SKIP_UNITS.has(r.unit.slug)) continue;
    for (const b of r.lesson.blocks) {
      const examples = b.type === "examples" ? b.items : b.type === "pair" ? [b.a, b.b] : b.type === "dialogue" ? b.lines : [];
      for (const e of examples) {
        add(e.fa, e.en);
        if (e.written) add(e.written, e.en);
      }
    }
    for (const v of r.lesson.vocab ?? []) {
      add(v.fa, v.en);
      if (v.written) add(v.written, v.en);
    }
  }
  return out;
}

export const TYPE_ITEMS: TypeItem[] = collect();
