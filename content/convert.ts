// The spoken ↔ written drill's cards: every lesson line given in both
// registers, where the two differ (lib/convert.ts).

import { buildConvertCards, type ConvertLeave } from "@/lib/convert";
import { ALL_LESSONS } from "./units";
import { VERBS } from "./verbs";

const REWORDED = "the written line rewords it beyond the spoken and written rules, so the target can't be worked out";
const OBJECT_PRONOUN = "the written pronoun becomes an ending in speech or stays a spoken pronoun, and both are right";
const W = (why: string): ConvertLeave => ({ dir: "to-written", why });
const S = (why: string): ConvertLeave => ({ dir: "to-spoken", why });

/**
 * Cards left out after review, in one direction or both, with the reason.
 * Accepting the other right answers would mean writing new Persian. A test
 * checks every id still names a card. (A written هستم after a consonant is
 * left out toward writing by a rule, in lib/convert.ts.)
 */
export const CONVERT_LEAVE_OUT: Record<string, ConvertLeave> = {
  // Both directions: the written line is a rewording.
  "core-sentence/possessive-endings#y5va9t": { why: REWORDED },
  "where-when/time-and-prices#dk5xzx": { why: `${REWORDED} (it adds a word the spoken line lacks)` },
  "nouns/indefinite#1a1j2w9": { why: REWORDED },
  "past/past-continuous#cxibtv": { why: `${REWORDED}; both phrasings of "as a child" are good speech` },
  "past/present-perfect#1g6qy8u": { why: `${REWORDED} (added words and another order)` },
  "past/past-continuous#7elyes": { why: `${REWORDED}; the shown line is right in speech too` },
  "spelling/s-letters#ywnozj": { why: "a fragment: the written line adds “is”, which the English does not have" },
  "core-sentence/questions#3g2ocp": { why: "the written line uses another word for “name” and a separate pronoun" },
  "nouns/plurals#uxr451": { why: "the written line uses a separate pronoun where the ending is just as right" },
  // Toward writing only: the written line picks one of several right forms.
  "core-sentence/possessive-endings#qrc6r0": W("writing takes the spoken word for “name” too"),
  "nouns/ezafe-of#a032n": W("writing takes the spoken word for “name” too"),
  "spelling/z-letters#md8168": W("the written line uses a separate pronoun where the ending is just as right"),
  "start-here/fast-track#kxx3d8": W(REWORDED),
  "core-sentence/questions#1b5od1s": W("the written question word is optional; the shown line is right in writing too"),
  "nouns/indefinite#p1i2r0": W("“a shop” is written two ways"),
  "nouns/plurals#1hdjh71": W("the written line uses a formal word for “very” where the course writes the everyday one elsewhere"),
  "nouns/ezafe-after-vowels#ax41sg": W(REWORDED),
  "nouns/plurals#me5mcb": W("the people plural is written two ways; only one is accepted"),
  "nouns/plurals#zrnq7f": W("the people plural is written two ways; only one is accepted"),
  "nouns/plurals#evw35i": W("the people plural is written two ways; only one is accepted"),
  "nouns/plurals#1kkfa8t": W("the people plural is written two ways; only one is accepted"),
  // Toward speech only: the written phrasing, or a fuller one, is everyday speech too.
  "core-sentence/questions#mwlk6h": S("the written phrasing is just as natural in speech"),
  "where-when/numbers#14ely91": S("the written phrasing is just as natural in speech"),
  "present/present-tense#1czq1oz": S("speech keeps or drops “in” before home; only one is accepted"),
  "past/simple-past#a6t2yo": S("speech keeps or drops “in” before home; only one is accepted"),
  "want-can-must/subjunctive#6tth92": S("speech keeps or drops “in” before home; only one is accepted"),
  "longer-sentences/if#19ekcpm": S("speech keeps or drops “in” before home; only one is accepted"),
  "longer-sentences/linking-words#va7bzl": S("speech keeps or drops “in” before home; only one is accepted"),
  "longer-sentences/linking-words#g25lxd": S("speech keeps or drops “in” before home; only one is accepted"),
  "longer-sentences/that-clauses#igyw0c": S("speech keeps or drops “in” before a country; only one is accepted"),
  "longer-sentences/the-book-that#1cmyiwd": S("speech may keep or drop the word that points back to the place"),
  // Unit 10: a written pronoun becomes an ending in speech, or a spoken pronoun (اونُو, به اون); both are right.
  "longer-sentences/object-endings#l9rpkw": S(OBJECT_PRONOUN),
  "longer-sentences/object-endings#k192": S(OBJECT_PRONOUN),
  "longer-sentences/object-endings#1nz376f": S(OBJECT_PRONOUN),
  "longer-sentences/object-endings#qoybac": S(OBJECT_PRONOUN),
  "longer-sentences/object-endings#1avw6t3": S(OBJECT_PRONOUN),
  "longer-sentences/object-endings#1e79z0n": S(OBJECT_PRONOUN),
  "longer-sentences/object-endings#inmj9m": S(OBJECT_PRONOUN),
  // Unit 11.
  "more-verbs/past-perfect#1nm49af": { why: "به before *there* is optional in both registers; only one is accepted" },
  "more-verbs/unreal-if#fcre55": S(OBJECT_PRONOUN),
  "more-verbs/unreal-if#9jg042": S(OBJECT_PRONOUN),
  "more-verbs/unreal-if#c5hxob": { why: "toward writing, the if-half may also take the past perfect; toward speech, the pronoun may stay" },
  "more-verbs/unreal-if#n8pyl0": S("speech also says the past continuous in the if-half (lesson 11.3)"),
  "more-verbs/unreal-if#u6uyoq": W("a written real condition may also take the subjunctive"),
  "more-verbs/passive#10121bk": W("in writing a plural thing can take either verb"),
  // Unit 12 (lines from 6.7, a spoken-only lesson, asked here for the first time).
  "spoken-written/different-words#139ainp": S(OBJECT_PRONOUN),
  "spoken-written/different-words#ldn47e": W("the spoken verb is also the present perfect, so the written line could be either tense"),
  "spoken-written/different-words#zby0su": W("a fragment: writing would drop را here as readily as keep it"),
  "spoken-written/different-words#97c9lb": S("“like this” has another everyday spoken word"),
};

const built = buildConvertCards(ALL_LESSONS, { verbs: VERBS, leaveOut: CONVERT_LEAVE_OUT });

export const CONVERT_CARDS = built.cards;
/** The lines left out, in one direction or both, for scripts/convert.ts. */
export const CONVERT_LEFT_OUT = built.leftOut;
