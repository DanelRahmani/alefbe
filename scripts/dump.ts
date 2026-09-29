// Prints every Persian string of a unit with its transliteration and the three
// vowel-mark modes, for proofreading. Usage: npm run dump -- <unit-slug>

import { UNITS } from "../content/units";
import type { Block, Example } from "../content/types";
import { parseMarkup, plainOf, splitScript, translitOf, tokenText } from "../lib/markup";
import { variantsOf } from "../lib/persian/marks";

const slug = process.argv[2];
const unit = UNITS.find((u) => u.slug === slug);
if (!unit) {
  console.error(`Unknown unit "${slug}". Units: ${UNITS.map((u) => u.slug).join(", ")}`);
  process.exit(1);
}

function fa(label: string, s: string) {
  const t = parseMarkup(s);
  const v = variantsOf(t);
  console.log(`  ${label}: ${plainOf(t)}`);
  console.log(`      translit: ${translitOf(t)}`);
  console.log(`      key mode: ${v.key.map(tokenText).join("")}   none: ${v.none.map(tokenText).join("")}`);
}

function rich(label: string, s: string) {
  const runs = splitScript(plainOf(parseMarkup(s))).filter((r) => r.fa);
  console.log(`  ${label}: ${s}`);
  for (const r of runs) console.log(`      «${r.s}» → ${translitOf(parseMarkup(r.s))}`);
}

function ex(label: string, e: Example) {
  fa(`${label} fa`, e.fa);
  if (e.written) fa(`${label} written`, e.written);
  rich(`${label} en`, e.en);
  if (e.note) rich(`${label} note`, e.note);
}

function block(b: Block, i: number) {
  const L = `[${i + 1} ${b.type}]`;
  switch (b.type) {
    case "idea":
    case "heading":
    case "text":
      return rich(L, b.text);
    case "examples":
      return b.items.forEach((e, j) => ex(`${L} #${j + 1}`, e));
    case "pair":
      if (b.title) rich(`${L} title`, b.title);
      ex(`${L} A`, b.a);
      ex(`${L} B`, b.b);
      return rich(`${L} diff`, b.diff);
    case "table":
      b.headers.forEach((h) => rich(`${L} header`, h));
      return b.rows.forEach((r) => r.forEach((c) => rich(`${L} cell`, c)));
    case "callout":
      if (b.title) rich(`${L} ${b.kind} title`, b.title);
      rich(`${L} ${b.kind}`, b.text);
      if (b.wrong) ex(`${L} wrong`, b.wrong);
      if (b.right) ex(`${L} right`, b.right);
      return;
    case "dialogue":
      if (b.title) rich(`${L} title`, b.title);
      b.lines.forEach((l, j) => ex(`${L} ${l.who} ${j + 1}`, { fa: l.fa, written: l.written, en: l.en }));
      if (b.note) rich(`${L} note`, b.note);
      return;
    case "link":
      return rich(`${L} ${b.href}`, b.text ?? b.label);
    case "quiz":
      return b.questions.forEach((q, j) => {
        rich(`${L} q${j + 1} (${q.lang}) prompt`, q.prompt);
        console.log(`      answers: ${q.answers.join(" | ")}`);
        rich(`${L} q${j + 1} explain`, q.explain);
      });
  }
}

const n = UNITS.indexOf(unit);
console.log(`Unit ${n}: ${unit.title}`);
fa("titleFa", unit.titleFa);
unit.lessons.forEach((l, i) => {
  console.log(`\n=== ${n}.${i + 1} ${l.title} (${l.register}; ${l.kinds.join(", ")})`);
  console.log(`  source: ${l.source}`);
  rich("summary", l.summary);
  l.vocab?.forEach((v) => fa(`vocab "${v.en}"${v.written ? " (spoken)" : ""}`, v.fa + (v.written ? `  /  ${v.written}` : "")));
  l.blocks.forEach(block);
});
