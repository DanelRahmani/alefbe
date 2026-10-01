// Prints every cloze card for review: `npx tsx scripts/cloze.ts < /dev/null`.
// Each card shows the line before (in a dialogue), the line with its gaps, the
// English, each gap's answers with the tense hint, and the full lines; then the
// lines left out, with the reason.

import { CLOZE_CARDS, CLOZE_LEFT_OUT } from "../content/cloze";
import { gapCount } from "../lib/cloze";

const gapped = (c: (typeof CLOZE_CARDS)[number]) => c.parts.map((p) => ("text" in p ? p.text : `[${p.gap + 1}]`)).join("");

for (const c of CLOZE_CARDS) {
  console.log(`\n${c.id} (lesson ${c.lesson.number}${c.lessons.length > 1 ? `; also ${c.lessons.slice(1).join(", ")}` : ""})`);
  if (c.before) console.log(`  before:  ${c.before.fa}  “${c.before.en}”`);
  console.log(`  ask:     ${gapped(c)}${gapCount(c) > 1 ? `   (${gapCount(c)} gaps)` : ""}`);
  console.log(`  en:      ${c.en}`);
  c.gaps.forEach((g, i) => {
    const hint = g.tense ? `   [hint: ${g.tense}]` : "";
    console.log(`  [${i + 1}]      ${g.fa}${hint}`);
    for (const a of g.also ?? []) console.log(`           also: ${a.fa}   (${a.note})`);
  });
  if (c.twins) console.log(`  twins:   ${c.twins.join(", ")}   (a card that looks the same)`);
  console.log(`  line:    ${c.fa}`);
  if (c.written) console.log(`  written: ${c.written}`);
}
console.log(`\n${CLOZE_CARDS.length} cards.`);
console.log(`\nLeft out (${CLOZE_LEFT_OUT.length}):`);
for (const l of CLOZE_LEFT_OUT) console.log(`  ${l.lesson}  ${l.reason}${l.why ? ` (${l.why})` : ""}: ${l.fa}`);
