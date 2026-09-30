// Prints every verb's tables with transliteration and any readability errors,
// for proofreading: `npx tsx scripts/verbs.ts < /dev/null`. Name tenses to
// print only those: `npx tsx scripts/verbs.ts past perfect < /dev/null`.

import { VERBS } from "../content/verbs";
import { STYLES, TENSES, lacks, table } from "../lib/conjugate";
import { checkReadable } from "../lib/persian/syllables";
import { transliterateWithErrors } from "../lib/translit";

const show = (fa: string) => {
  const r = transliterateWithErrors(fa);
  const errs = [...r.errors, ...fa.split(" ").flatMap((w) => checkReadable(w))];
  return `${fa} (${r.text})${errs.length ? " !! " + errs.join("; ") : ""}`;
};

const wanted = process.argv.slice(2);
const tenses = TENSES.filter((t) => !wanted.length || wanted.includes(t.id));

for (const v of VERBS) {
  console.log(
    `\n${show(v.inf)} — ${v.en}; past ${show(v.past)}, present ${show(v.present)}` +
      (v.spoken?.present ? `; spoken ${show(v.spoken.present)}` : "") +
      (v.spoken?.past ? `, spoken past ${show(v.spoken.past)}` : ""),
  );
  for (const t of tenses) {
    console.log(`  ${t.title} (${t.id})`);
    for (const neg of [false, true]) {
      const why = lacks(v, t.id, neg, VERBS);
      if (why) {
        console.log(`    ${neg ? "neg" : "aff"}: none. ${why}`);
        continue;
      }
      for (const style of STYLES) console.log(`    ${style.padEnd(7)} ${neg ? "neg" : "aff"}: ${table(v, t.id, style, neg, VERBS).map(show).join(" · ")}`);
    }
  }
}
