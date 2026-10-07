// Proofread the common words (content/common-words): every entry with its
// transliteration, and any problem the content tests would fail on, plus
// duplicates. `npx tsx scripts/common-words.ts [batch-file-name…] < /dev/null`
// (no names: every batch). Exits 1 when something must be fixed.

import { readdirSync } from "fs";
import { join } from "path";
import { DRILL_WORDS } from "../content/drill-words";
import { ALL_LESSONS } from "../content/units";
import type { CommonWord } from "../content/common-words/types";
import { foldFa } from "../lib/dictionary";
import { parseMarkup } from "../lib/markup";
import { checkReadable } from "../lib/persian/syllables";
import { tokenizeFa, transliterateWithErrors, wordKind } from "../lib/translit";

const dir = join(__dirname, "../content/common-words");
const only = process.argv.slice(2).map((n) => n.replace(/\.ts$/, ""));
const files = readdirSync(dir)
  .filter((f) => f.endsWith(".ts") && f !== "index.ts" && f !== "types.ts")
  .map((f) => f.replace(/\.ts$/, ""))
  .filter((f) => !only.length || only.includes(f));

const strip = (s: string) => s.replace(/[{}*]/g, "").replace(/\[([^|\]]*)\|[^\]]*\]/g, "$1");

// The other sources, by marked spelling and by folded spelling.
const lessonVocab = ALL_LESSONS.flatMap((r) => (r.lesson.vocab ?? []).flatMap((v) => [v.written ?? v.fa, ...(v.written ? [v.fa] : [])]));
const others = [...lessonVocab, ...DRILL_WORDS.map((w) => w.fa)].map(strip);
const otherIds = new Set(others);
const otherFolds = new Map(others.map((s) => [foldFa(s), s]));

function problems(fa: string): string[] {
  const out: string[] = [];
  if (/[يكة]/.test(fa)) out.push("Arabic ي/ك/ة: use Persian ی/ک");
  if (/[0-9٠-٩]/.test(fa)) out.push("digits");
  const text = parseMarkup(fa)
    .map((t) => (t.kind === "override" ? " " : t.text))
    .join("");
  for (const tok of tokenizeFa(text)) if (tok.word && wordKind(tok.s) === "word") out.push(...checkReadable(tok.s));
  out.push(...transliterateWithErrors(strip(fa)).errors);
  return out;
}

async function main() {
  let bad = 0;
  let count = 0;
  const seen = new Map<string, string>();
  for (const name of files) {
    const mod = (await import(`../content/common-words/${name}`)) as Record<string, CommonWord[]>;
    const words = Object.values(mod).find(Array.isArray) ?? [];
    console.log(`\n== ${name} (${words.length})`);
    for (const w of words) {
      count++;
      const id = strip(w.fa);
      const issues = [...problems(w.fa), ...(w.spoken ? problems(w.spoken).map((p) => `spoken: ${p}`) : [])];
      if (w.spoken && foldFa(w.spoken) === foldFa(w.fa)) issues.push("spoken spelled like the written form: drop it");
      if (otherIds.has(id)) issues.push("already in the dictionary (a lesson or trainer word): drop it");
      if (seen.has(id)) issues.push(`duplicate of ${seen.get(id)}`);
      seen.set(id, name);
      const warn =
        !otherIds.has(id) && otherFolds.has(foldFa(id))
          ? `  (same letters as ${otherFolds.get(foldFa(id))}: fine only if a different word)`
          : "";
      const tr = transliterateWithErrors(id).text;
      const sp = w.spoken ? ` / ${strip(w.spoken)} ${transliterateWithErrors(strip(w.spoken)).text}` : "";
      console.log(`${id}  ${tr}${sp}  = ${w.en} [${w.topic}]${warn}${issues.length ? `\n   !! ${issues.join(" | ")}` : ""}`);
      if (issues.length) bad++;
    }
  }
  console.log(`\n${count} words, ${bad} with problems`);
  process.exit(bad ? 1 : 0);
}

void main();
