// The cloze deck's cards: every highlighted lesson line, blanked at its
// highlight, in course order (lib/cloze.ts).

import { buildClozeCards } from "@/lib/cloze";
import { ALL_LESSONS } from "./units";
import { VERBS } from "./verbs";

/**
 * Cards whose English allows a word the lessons do not give, so a right
 * answer would be marked wrong. Accepting it would mean writing new Persian;
 * the card is left out instead. A test checks every id still names a card.
 */
export const CLOZE_LEAVE_OUT: Record<string, string> = {
  "start-here/fast-track#1a3qd8g": "“thanks” has other everyday words",
  "want-can-must/commands#miv1if": "“please come in” is also a plain command to come",
  "present/ten-verbs#18w0xei": "“what would you like?” is also asked with the verb want",
  "nouns/indefinite#n26swu": "“a good restaurant” is also said without the ending on good",
  "spelling/s-letters#1b4a5uc": "“a second” is also “a moment”",
  "core-sentence/verb-last#1uvdu6b": "“speak” has another compound verb",
  "present/not-doing#1q60ut1": "“speak” has another compound verb",
  "where-when/place-words#kliawx": "“next to” has another preposition",
  "where-when/place-words#j0w5qr": "“at my grandmother’s” is also “at my grandmother’s house”",
  "where-when/comparing#16pfh3x": "“more slowly” has another adverb",
  "nouns/ezafe#1sctjxj": "“size” has another word",
  "past/present-perfect#e0alpb": "“have you been” is also the past of to be",
  "present/compound-verbs#8q06y7": "“call” has another compound verb",
  "present/two-stems#16ofyag": "“can’t see” is also said with can",
  "want-can-must/commands#mxn56k": "“sit” leaves open which “you”, and the verb is not in the engine to give the other",
  "spelling/z-letters#19sutpd": "the English names no food, and the midday meal has its own word",
  "spoken-written/different-words#133sal6": "“like this” has another everyday spoken word",
  "culture/greetings#13rj5vf": "“goodbye” has another word (lesson 13.3)",
  "culture/greetings#68ptrk": "“goodbye” has another word (lesson 13.3)",
  "culture/set-phrases#6xfid6": "“thanks” has other everyday words",
  "culture/taarof#yqek0b": "“would you like” is also asked with the verb want",
  "culture/calendar#18l3fs7": "“Happy Nowruz” leaves open which “you”, and the other form is not in the lessons",
  "more-verbs/passive#znqoxd": "a plural thing can also take the singular verb, which the gap does not accept",
};

const built = buildClozeCards(ALL_LESSONS, { verbs: VERBS, leaveOut: CLOZE_LEAVE_OUT });

export const CLOZE_CARDS = built.cards;
/** The highlighted lines that make no card, and why: for scripts/cloze.ts. */
export const CLOZE_LEFT_OUT = built.leftOut;
