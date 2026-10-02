// The placement check's questions, chosen by hand from the lesson quizzes
// (lib/placement.ts has the rule). Each one tests its unit's main point, makes
// sense outside its lesson, and is typed in Persian script where possible:
// the transliteration scheme is new to most people taking the check. The
// questions are used unchanged; a test checks that each still exists.
//
// A band per unit (the script units share one). To add a unit, add a line.

import type { PlacementBand } from "@/lib/placement";

const q = (lesson: string, index: number) => ({ lesson, q: index });

export const PLACEMENT: PlacementBand[] = [
  // Reading a word (لیوان: no vowel to guess) and writing one with a half-space.
  { id: "script", title: "The script", topic: "reading and writing the script", units: ["alphabet", "sounds", "spelling"], questions: [q("alphabet/lam-to-vav", 2), q("spelling/half-space", 0)] },
  // The verb ending says who; "is" in writing.
  { id: "core", title: "The core sentence", topic: "the core sentence", units: ["core-sentence"], questions: [q("core-sentence/verb-last", 1), q("core-sentence/to-be", 1)] },
  // می + present stem + ending; نـ on it.
  { id: "present", title: "The present tense", topic: "the present tense", units: ["present"], questions: [q("present/present-tense", 0), q("present/not-doing", 1)] },
  // The written ezafe; را on a specific object.
  { id: "nouns", title: "Nouns and links", topic: "the ezafe and را", units: ["nouns"], questions: [q("nouns/ezafe-after-vowels", 1), q("nouns/ra-specific-object", 2)] },
  // The simple past; the past with می.
  { id: "past", title: "The past", topic: "the past tenses", units: ["past"], questions: [q("past/simple-past", 0), q("past/past-continuous", 0)] },
  // A helper verb plus the subjunctive, spoken and written.
  { id: "want-can-must", title: "Want, can, must", topic: "want, can and must", units: ["want-can-must"], questions: [q("want-can-must/want-to", 0), q("want-can-must/can", 2)] },
  // A place word with the ezafe; the superlative.
  { id: "where-when", title: "Where, when, how much", topic: "places and comparing", units: ["where-when"], questions: [q("where-when/place-words", 0), q("where-when/comparing", 2)] },
  // "The book that…" (ـی + که); اَگه with the subjunctive.
  { id: "longer-sentences", title: "Longer sentences", topic: "clauses with که and اَگه", units: ["longer-sentences"], questions: [q("longer-sentences/the-book-that", 0), q("longer-sentences/if", 1)] },
  // The past perfect; an unreal condition.
  { id: "more-verbs", title: "More verb forms", topic: "the past perfect and unreal conditions", units: ["more-verbs"], questions: [q("more-verbs/past-perfect", 0), q("more-verbs/unreal-if", 0)] },
  // A spoken verb ending; a short spoken stem.
  { id: "spoken-written", title: "Spoken and written", topic: "the spoken forms", units: ["spoken-written"], questions: [q("spoken-written/endings", 2), q("spoken-written/short-stems", 0)] },
];
