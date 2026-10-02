// The tenses, grouped for the pickers on /verbs: four short rows read faster
// than thirteen chips in one wall. Every tense is in exactly one group
// (tests/tense-groups.test.ts), in the order of TENSES within each.

import { TENSES, type Tense, type TenseInfo } from "./conjugate";

const GROUPS: { title: string; ids: Tense[] }[] = [
  { title: "Now and later", ids: ["present", "progressive", "future"] },
  { title: "The past", ids: ["past", "perfect", "imperfect", "past-progressive", "past-perfect"] },
  { title: "Wishes and commands", ids: ["subjunctive", "past-subjunctive", "imperative"] },
  { title: "Passive", ids: ["passive", "past-passive"] },
];

export const TENSE_GROUPS: { title: string; tenses: TenseInfo[] }[] = GROUPS.map((g) => ({
  title: g.title,
  tenses: TENSES.filter((t) => g.ids.includes(t.id)),
}));
