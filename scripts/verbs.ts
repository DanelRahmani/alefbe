// Prints every verb's present tables with transliteration and any readability
// errors, for proofreading: `npx tsx scripts/verbs.ts < /dev/null`.

import { VERBS } from "../content/verbs";
import { STYLES, table } from "../lib/conjugate";
import { checkReadable } from "../lib/persian/syllables";
import { transliterateWithErrors } from "../lib/translit";

const show = (fa: string) => {
  const r = transliterateWithErrors(fa);
  const errs = [...r.errors, ...fa.split(" ").flatMap((w) => checkReadable(w))];
  return `${fa} (${r.text})${errs.length ? " !! " + errs.join("; ") : ""}`;
};

for (const v of VERBS) {
  console.log(`\n${show(v.inf)} — ${v.en}; past ${show(v.past)}, present ${show(v.present)}` +
    (v.spoken?.present ? `; spoken ${show(v.spoken.present)}` : "") + (v.spoken?.past ? `, spoken past ${show(v.spoken.past)}` : ""));
  for (const style of STYLES)
    for (const neg of [false, true])
      console.log(`  ${style.padEnd(7)} ${neg ? "neg" : "aff"}: ${table(v, "present", style, neg, VERBS).map(show).join(" · ")}`);
}
