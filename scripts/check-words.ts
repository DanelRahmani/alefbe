// Spot-check words before they go into lessons: `npx tsx scripts/check-words.ts کِتاب خانه …`
// Prints each word's transliteration and any readability or spelling errors.

import { checkReadable } from "../lib/persian/syllables";
import { transliterateWithErrors } from "../lib/translit";

for (const w of process.argv.slice(2)) {
  const r = transliterateWithErrors(w);
  const errors = [...r.errors, ...checkReadable(w.replace(/[،.؟!]/g, ""))];
  console.log(`${w.padEnd(16)} ${r.text.padEnd(18)} ${errors.join(" | ")}`);
}
