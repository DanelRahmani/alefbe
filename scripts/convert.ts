// Prints every spoken ↔ written card for review: `npx tsx scripts/convert.ts < /dev/null`.
// Each card shows both lines, the English, and the other ways each target is
// accepted, with their notes; then the lines left out by hand.

import { CONVERT_CARDS, CONVERT_LEFT_OUT } from "../content/convert";
import { parseMarkup, plainOf } from "../lib/markup";

const plain = (s: string) => plainOf(parseMarkup(s));

for (const c of CONVERT_CARDS) {
  console.log(`\n${c.id}${c.only ? ` [only ${c.only}]` : ""} (lesson ${c.lesson.number}${c.lessons.length > 1 ? `; also ${c.lessons.slice(1).join(", ")}` : ""})`);
  console.log(`  spoken:  ${plain(c.fa)}`);
  for (const a of c.alsoSpoken ?? []) console.log(`           also: ${a.fa}   (${a.note})`);
  for (const t of c.twinsSpoken ?? []) console.log(`           twin: ${t}   (another card shows the same written line)`);
  console.log(`  written: ${plain(c.written)}`);
  for (const a of c.alsoWritten ?? []) console.log(`           also: ${a.fa}   (${a.note})`);
  for (const t of c.twinsWritten ?? []) console.log(`           twin: ${t}   (another card shows the same spoken line)`);
  console.log(`  en:      ${c.en}`);
}
console.log(`\n${CONVERT_CARDS.length} cards.`);
console.log(`\nLeft out (${CONVERT_LEFT_OUT.length} directions; [to-written] = not asked toward writing):`);
for (const l of CONVERT_LEFT_OUT) console.log(`  ${l.lesson}  ${l.fa} | ${l.written}: ${l.why}`);
