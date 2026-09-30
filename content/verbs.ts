import type { Verb } from "@/lib/conjugate";

// The core verbs of the conjugation trainer, fully vowel-marked. Spoken stems
// are the Tehrani ones (Stilo, Talattof and Clinton, Modern Persian: Spoken
// and Written); the written forms follow Thackston and Mahootian. Golden
// tables for every verb are in tests/conjugate.test.ts.
//
// Cited stems ending in zabar + و (رَو, شَو) read *row*, *show* on their own,
// as Persian says -av at a syllable end; lessons cite them as [رَو|rav]. The
// one-letter spoken stems (ر, ش, گ, د) and آ are never shown alone.
//
// Spoken past stems are given only where speech changes the stem (اومَد,
// دونِسْت, تونِسْت, خونْد, آوُرْد). `stative` verbs name a state and have no
// progressive with داشتن (Mahootian, on the progressive). For a state, the
// past with می is the plain English past (می‌دونِسْتَم, I knew) and the simple
// past is an event (دونِسْتَم, I found out): `enEvent` glosses the event.
// After a prefix, spoken گذاشتن drops its گُـ in the past as in the present
// (نَذاشْتَم, می‌ذاشْتَم): `spoken.pastPrefixed`.
//
// The subjunctive and the command take بِـ (Thackston). Tehrani speech often
// says bo- before an o (bokon, bokhor); the forms here keep be-, and بُرُو
// (boro) is the one command given with it. `command` holds a command to one
// person that is not بِـ + stem; `bare` marks the compounds with کردن, which
// usually drop بِـ (کار کُنَم).

export const VERBS: Verb[] = [
  // To be. Its present is the short endings and هست (lesson 4.2), so the
  // engine starts it at the past; باش builds the subjunctive and the command.
  { id: "budan", inf: "بودَن", en: "to be", enForms: ["be", "is", "was", "been", "being"], past: "بود", present: "باش", copula: true },

  // The ten most common verbs (lesson 5.3).
  {
    id: "raftan",
    inf: "رَفْتَن",
    en: "to go",
    enForms: ["go", "goes", "went", "gone", "going"],
    past: "رَفْت",
    present: "رَو",
    spoken: { present: "ر" },
    // Said boro in speech and in reading aloud alike.
    command: { spoken: ["بُرُو", "نَرُو"], written: ["بُرُو", "نَرُو"] },
  },
  {
    id: "âmadan",
    inf: "آمَدَن",
    en: "to come",
    enForms: ["come", "comes", "came", "come", "coming"],
    past: "آمَد",
    present: "آ",
    spoken: { present: "آ", past: "اومَد" },
  },
  { id: "kardan", inf: "کَرْدَن", en: "to do, to make", enForms: ["do", "does", "did", "done", "doing"], past: "کَرْد", present: "کُن" },
  { id: "shodan", inf: "شُدَن", en: "to become", enForms: ["become", "becomes", "became", "become", "becoming"], past: "شُد", present: "شَو", spoken: { present: "ش" }, command: { spoken: ["بِشُو", "نَشُو"] } },
  { id: "goftan", inf: "گُفْتَن", en: "to say", enForms: ["say", "says", "said", "said", "saying"], past: "گُفْت", present: "گو", spoken: { present: "گ" }, command: { spoken: ["بِگو", "نَگو"] } },
  {
    id: "dâdan",
    inf: "دادَن",
    en: "to give",
    enForms: ["give", "gives", "gave", "given", "giving"],
    past: "داد",
    present: "دِهْ",
    presentJoin: "دَه",
    spoken: { present: "د" },
    command: { spoken: ["بِده", "نَده"] },
  },
  { id: "didan", inf: "دیدَن", en: "to see", enForms: ["see", "sees", "saw", "seen", "seeing"], enNow: "watching", past: "دید", present: "بین" },
  { id: "khâstan", inf: "خواسْتَن", en: "to want", enForms: ["want", "wants", "wanted", "wanted", "wanting"], past: "خواسْت", present: "خواه", spoken: { present: "خوا" }, stative: true, enEvent: ["wanted (at that moment)", "want (at that moment)"], noCommand: "Rarely used as a command, so it is not drilled here." },
  {
    id: "dânestan",
    stative: true,
    noNegCommand: true,
    enEvent: ["found out", "find out"],
    inf: "دانِسْتَن",
    en: "to know (a fact)",
    enForms: ["know", "knows", "knew", "known", "knowing"],
    enHint: "a fact",
    past: "دانِسْت",
    present: "دان",
    spoken: { present: "دون", past: "دونِسْت" },
  },
  {
    id: "tavânestan",
    stative: true,
    noCommand: "This verb is not used as a command.",
    enEvent: ["managed to", "manage to"],
    inf: "تَوانِسْتَن",
    en: "to be able, can",
    enForms: ["can", "can", "could", "been able to", ""],
    modal: true,
    past: "تَوانِسْت",
    present: "تَوان",
    spoken: { present: "تون", past: "تونِسْت" },
  },

  // Everyday verbs.
  { id: "dâshtan", inf: "داشْتَن", en: "to have", enForms: ["have", "has", "had", "had", "having"], past: "داشْت", present: "دار", noMi: true, stative: true },
  { id: "khordan", inf: "خُورْدَن", en: "to eat; to drink", enForms: ["eat", "eats", "ate", "eaten", "eating"], past: "خُورْد", present: "خُور" },
  { id: "kharidan", inf: "خَریدَن", en: "to buy", enForms: ["buy", "buys", "bought", "bought", "buying"], past: "خَرید", present: "خَر" },
  { id: "neveshtan", inf: "نِوِشْتَن", en: "to write", enForms: ["write", "writes", "wrote", "written", "writing"], past: "نِوِشْت", present: "نِویس" },
  {
    id: "khândan",
    inf: "خوانْدَن",
    en: "to read; to study; to sing",
    enForms: ["read", "reads", "read", "read", "reading"],
    past: "خوانْد",
    present: "خوان",
    spoken: { present: "خون", past: "خونْد" },
  },
  { id: "gereftan", inf: "گِرِفْتَن", en: "to take, to get", enForms: ["take", "takes", "took", "taken", "taking"], past: "گِرِفْت", present: "گیر" },
  { id: "zadan", inf: "زَدَن", en: "to hit", enForms: ["hit", "hits", "hit", "hit", "hitting"], past: "زَد", present: "زَن" },
  {
    id: "âvardan",
    inf: "آوَرْدَن",
    en: "to bring",
    enForms: ["bring", "brings", "brought", "brought", "bringing"],
    past: "آوَرْد",
    present: "آوَر",
    spoken: { present: "آر", past: "آوُرْد" },
  },
  {
    id: "gozâshtan",
    inf: "گُذاشْتَن",
    en: "to put; to let",
    enForms: ["put", "puts", "put", "put", "putting"],
    past: "گُذاشْت",
    present: "گُذار",
    spoken: { present: "ذار", pastPrefixed: "ذاشْت" },
  },
  { id: "porsidan", inf: "پُرْسیدَن", en: "to ask", enForms: ["ask", "asks", "asked", "asked", "asking"], past: "پُرْسید", present: "پُرْس" },
  { id: "fahmidan", inf: "فَهْمیدَن", en: "to understand", enForms: ["understand", "understands", "understood", "understood", "understanding"], enNow: "starting to understand", noNegCommand: true, past: "فَهْمید", present: "فَهْم" },
  { id: "shenâkhtan", inf: "شِناخْتَن", en: "to know (a person)", enForms: ["know", "knows", "knew", "known", "knowing"], enHint: "a person", past: "شِناخْت", present: "شِناس", stative: true, enEvent: ["recognised", "recognise"], noNegCommand: true, enCommand: "get to know" },

  // Compound verbs (lesson 5.6): a noun plus a light verb, which carries the endings.
  { id: "kâr-kardan", inf: "کار کَرْدَن", en: "to work", enForms: ["work", "works", "worked", "worked", "working"], past: "کَرْد", present: "کُن", part: "کار", light: "kardan", bare: true },
  { id: "harf-zadan", inf: "حَرْف زَدَن", en: "to talk, to speak", enForms: ["talk", "talks", "talked", "talked", "talking"], past: "زَد", present: "زَن", part: "حَرْف", light: "zadan" },
  {
    id: "zendegi-kardan",
    inf: "زِنْدِگی کَرْدَن",
    en: "to live",
    enForms: ["live", "lives", "lived", "lived", "living"],
    past: "کَرْد",
    present: "کُن",
    part: "زِنْدِگی",
    light: "kardan",
    bare: true,
  },
];

export const verbById = new Map(VERBS.map((v) => [v.id, v]));
