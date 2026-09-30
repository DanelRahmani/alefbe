import type { Verb } from "@/lib/conjugate";

// The core verbs of the conjugation trainer, fully vowel-marked. Spoken stems
// are the Tehrani ones (Stilo, Talattof and Clinton, Modern Persian: Spoken
// and Written); the written forms follow Thackston and Mahootian. Golden
// tables for every verb are in tests/conjugate.test.ts.
//
// Cited stems ending in zabar + و (رَو, شَو) read *row*, *show* on their own,
// as Persian says -av at a syllable end; lessons cite them as [رَو|rav]. The
// one-letter spoken stems (ر, ش, گ, د) and آ are never shown alone.

export const VERBS: Verb[] = [
  // The ten most common verbs (lesson 5.3).
  { id: "raftan", inf: "رَفْتَن", en: "to go", enForms: ["go", "goes"], past: "رَفْت", present: "رَو", spoken: { present: "ر" } },
  {
    id: "âmadan",
    inf: "آمَدَن",
    en: "to come",
    enForms: ["come", "comes"],
    past: "آمَد",
    present: "آ",
    spoken: { present: "آ", past: "اومَد" },
  },
  { id: "kardan", inf: "کَرْدَن", en: "to do, to make", enForms: ["do", "does"], past: "کَرْد", present: "کُن" },
  { id: "shodan", inf: "شُدَن", en: "to become", enForms: ["become", "becomes"], past: "شُد", present: "شَو", spoken: { present: "ش" } },
  { id: "goftan", inf: "گُفْتَن", en: "to say", enForms: ["say", "says"], past: "گُفْت", present: "گو", spoken: { present: "گ" } },
  {
    id: "dâdan",
    inf: "دادَن",
    en: "to give",
    enForms: ["give", "gives"],
    past: "داد",
    present: "دِهْ",
    presentJoin: "دَه",
    spoken: { present: "د" },
  },
  { id: "didan", inf: "دیدَن", en: "to see", enForms: ["see", "sees"], past: "دید", present: "بین" },
  { id: "khâstan", inf: "خواسْتَن", en: "to want", enForms: ["want", "wants"], past: "خواسْت", present: "خواه", spoken: { present: "خوا" } },
  {
    id: "dânestan",
    inf: "دانِسْتَن",
    en: "to know (a fact)",
    enForms: ["know", "knows"],
    enHint: "a fact",
    past: "دانِسْت",
    present: "دان",
    spoken: { present: "دون", past: "دونِسْت" },
  },
  {
    id: "tavânestan",
    inf: "تَوانِسْتَن",
    en: "to be able, can",
    enForms: ["can", "can"],
    modal: true,
    past: "تَوانِسْت",
    present: "تَوان",
    spoken: { present: "تون", past: "تونِسْت" },
  },

  // Everyday verbs.
  { id: "dâshtan", inf: "داشْتَن", en: "to have", enForms: ["have", "has"], past: "داشْت", present: "دار", noMi: true },
  { id: "khordan", inf: "خُورْدَن", en: "to eat; to drink", enForms: ["eat", "eats"], past: "خُورْد", present: "خُور" },
  { id: "kharidan", inf: "خَریدَن", en: "to buy", enForms: ["buy", "buys"], past: "خَرید", present: "خَر" },
  { id: "neveshtan", inf: "نِوِشْتَن", en: "to write", enForms: ["write", "writes"], past: "نِوِشْت", present: "نِویس" },
  {
    id: "khândan",
    inf: "خوانْدَن",
    en: "to read; to study; to sing",
    enForms: ["read", "reads"],
    past: "خوانْد",
    present: "خوان",
    spoken: { present: "خون", past: "خونْد" },
  },
  { id: "gereftan", inf: "گِرِفْتَن", en: "to take, to get", enForms: ["take", "takes"], past: "گِرِفْت", present: "گیر" },
  { id: "zadan", inf: "زَدَن", en: "to hit", enForms: ["hit", "hits"], past: "زَد", present: "زَن" },
  {
    id: "âvardan",
    inf: "آوَرْدَن",
    en: "to bring",
    enForms: ["bring", "brings"],
    past: "آوَرْد",
    present: "آوَر",
    spoken: { present: "آر", past: "آوُرْد" },
  },
  {
    id: "gozâshtan",
    inf: "گُذاشْتَن",
    en: "to put; to let",
    enForms: ["put", "puts"],
    past: "گُذاشْت",
    present: "گُذار",
    spoken: { present: "ذار" },
  },
  { id: "porsidan", inf: "پُرْسیدَن", en: "to ask", enForms: ["ask", "asks"], past: "پُرْسید", present: "پُرْس" },
  { id: "fahmidan", inf: "فَهْمیدَن", en: "to understand", enForms: ["understand", "understands"], past: "فَهْمید", present: "فَهْم" },
  { id: "shenâkhtan", inf: "شِناخْتَن", en: "to know (a person)", enForms: ["know", "knows"], enHint: "a person", past: "شِناخْت", present: "شِناس" },

  // Compound verbs (lesson 5.6): a noun plus a light verb, which carries the endings.
  { id: "kâr-kardan", inf: "کار کَرْدَن", en: "to work", enForms: ["work", "works"], past: "کَرْد", present: "کُن", part: "کار", light: "kardan" },
  { id: "harf-zadan", inf: "حَرْف زَدَن", en: "to talk, to speak", enForms: ["talk", "talks"], past: "زَد", present: "زَن", part: "حَرْف", light: "zadan" },
  {
    id: "zendegi-kardan",
    inf: "زِنْدِگی کَرْدَن",
    en: "to live",
    enForms: ["live", "lives"],
    past: "کَرْد",
    present: "کُن",
    part: "زِنْدِگی",
    light: "kardan",
  },
];

export const verbById = new Map(VERBS.map((v) => [v.id, v]));
