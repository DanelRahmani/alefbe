// The vocabulary deck's cards: every word a lesson teaches, from the
// dictionary, in the order the course teaches them (lib/vocab.ts).

import { buildVocabCards } from "@/lib/vocab";
import { DICTIONARY } from "./dictionary";
import { ALL_LESSONS } from "./units";

export const VOCAB_CARDS = buildVocabCards(
  DICTIONARY,
  ALL_LESSONS.map((r) => r.key),
);
