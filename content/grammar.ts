// The grammar overview (/grammar): every core point on one page, in the order
// the course teaches it, each linking to its full lesson. It replaces the old
// app's Grammar view (14 topics), corrected: see content/STYLE.md.

import type { Block } from "./types";

export interface GrammarTopic {
  slug: string;
  title: string;
  /** The unit that teaches it in full. */
  unit: string;
  /** The lesson that teaches it, "unit/lesson", once written. */
  lesson?: string;
  blocks: Block[];
}

export const GRAMMAR: GrammarTopic[] = [
  {
    slug: "word-order",
    title: "The verb comes last",
    unit: "core-sentence",
    lesson: "core-sentence/verb-last",
    blocks: [
      { type: "idea", text: "The core sentence is **subject – object – verb**, and the verb's ending says who, so the subject is often left out." },
      {
        type: "examples",
        items: [
          { fa: "مَن نون {می‌خَرَم}.", written: "مَن نان {می‌خَرَم}.", en: "I buy bread." },
          { fa: "عَلی آب {خُورْد}.", en: "Ali drank water." },
        ],
      },
    ],
  },
  {
    slug: "pronouns",
    title: "Pronouns, and no gender",
    unit: "start-here",
    lesson: "start-here/persian-in-one-page",
    blocks: [
      { type: "idea", text: "Persian has **no grammatical gender**: او is both *he* and *she*, and nothing else in the sentence changes." },
      {
        type: "table",
        headers: ["", "Spoken", "Written"],
        rows: [
          ["I", "مَن", "مَن"],
          ["you (to a friend)", "تُو", "تُو"],
          ["he, she", "او، اون", "او"],
          ["we", "ما", "ما"],
          ["you (polite, or more than one)", "شُما", "شُما"],
          ["they", "اونا", "آن‌ها"],
        ],
      },
    ],
  },
  {
    slug: "to-be",
    title: "Am, is, are",
    unit: "core-sentence",
    lesson: "core-sentence/to-be",
    blocks: [
      {
        type: "idea",
        text: "*Am* and *are* are short endings (خوبَم, *I'm fine*). *Is* is the word اَسْت in writing and the ending ـه in speech.",
      },
      {
        type: "table",
        headers: ["", "Spoken", "Written"],
        rows: [
          ["I am fine", "خوبَم", "خوبَم"],
          ["you are fine", "خوبی", "خوبی"],
          ["he, she is fine", "خوبه", "خوب اَسْت"],
          ["we are fine", "خوبیم", "خوبیم"],
          ["you are fine (شُما)", "خوبین", "خوبید"],
          ["they are fine", "خوبَن", "خوبَنْد"],
        ],
      },
    ],
  },
  {
    slug: "negation",
    title: "Not",
    unit: "core-sentence",
    lesson: "core-sentence/negation",
    blocks: [
      { type: "idea", text: "*Is not* is نیسْت; every other verb takes نـ at the front, said *ne* before می." },
      {
        type: "examples",
        items: [
          { fa: "{خَسْته نیسْتَم}.", en: "I'm not tired." },
          { fa: "{نِمی‌دونَم}.", written: "{نِمی‌دانَم}.", en: "I don't know." },
          { fa: "دیروز {نَرَفْتَم}.", en: "I didn't go yesterday." },
        ],
      },
    ],
  },
  {
    slug: "questions",
    title: "Questions",
    unit: "core-sentence",
    lesson: "core-sentence/questions",
    blocks: [
      { type: "idea", text: "A yes/no question is the statement with a **rising voice**; a question word sits **where the answer would be**." },
      {
        type: "examples",
        items: [
          { fa: "خَسْته‌ای؟", written: "{آیا} خَسْته‌ای؟", en: "Are you tired?" },
          { fa: "{کُجا} می‌ری؟", written: "{کُجا} می‌رَوی؟", en: "Where are you going?" },
        ],
      },
    ],
  },
  {
    slug: "possessive-endings",
    title: "My, your, his",
    unit: "core-sentence",
    lesson: "core-sentence/possessive-endings",
    blocks: [
      { type: "idea", text: "*My*, *your* and *his/her* are endings on the noun: کِتابَم, کِتابِت (written کِتابَت), کِتابِش (written کِتابَش)." },
      {
        type: "examples",
        items: [
          { fa: "{کیفَم} کُجاسْت؟", en: "Where's my bag?" },
          { fa: "{اِسْمِش} چیه؟", written: "{نامَش} چیسْت؟", en: "What's his name? / What's her name?" },
        ],
      },
    ],
  },
  {
    slug: "present-tense",
    title: "The present tense",
    unit: "present",
    lesson: "present/present-tense",
    blocks: [
      {
        type: "idea",
        text: "The present is **می + present stem + ending**, with a half-space after می. Each verb has its own present stem: رَفْتَن (*to go*) has رَو, shortened in speech to ر.",
      },
      {
        type: "table",
        caption: "رَفْتَن, to go",
        headers: ["", "Spoken", "Written"],
        rows: [
          ["I go", "می‌رَم", "می‌رَوَم"],
          ["you go", "می‌ری", "می‌رَوی"],
          ["he, she goes", "می‌ره", "می‌رَوَد"],
          ["we go", "می‌ریم", "می‌رَویم"],
          ["you go (شُما)", "می‌رین", "می‌رَوید"],
          ["they go", "می‌رَن", "می‌رَوَنْد"],
        ],
      },
    ],
  },
  {
    slug: "ezafe",
    title: "The ezafe",
    unit: "nouns",
    lesson: "nouns/ezafe",
    blocks: [
      {
        type: "idea",
        text: "The **ezafe**, an *-e* (after a vowel *-ye*), links a noun to what describes or owns it: کِتابِ خوب, *a good book*; کِتابِ مَن, *my book*.",
      },
      {
        type: "examples",
        items: [
          { fa: "یه {کِتابِ} خوب", written: "یِک {کِتابِ} خوب", en: "a good book" },
          { fa: "{خونهٔ} مَرْیَم", written: "{خانهٔ} مَرْیَم", en: "Maryam's house" },
          { fa: "{دوسْتِ} بَرادَرَم", en: "my brother's friend" },
        ],
      },
    ],
  },
  {
    slug: "plurals",
    title: "Plurals",
    unit: "nouns",
    lesson: "nouns/plurals",
    blocks: [
      {
        type: "idea",
        text: "Add **ـها** for the plural; speech drops the *h* (*-â*). Written Persian can also use **ـان** for people and a few other words.",
      },
      {
        type: "examples",
        items: [
          { fa: "{کِتابا}", written: "{کِتاب‌ها}", en: "books" },
          { fa: "{دوسْتان}", en: "friends (formal)" },
        ],
      },
    ],
  },
  {
    slug: "indefinite",
    title: "A, an, one",
    unit: "nouns",
    lesson: "nouns/indefinite",
    blocks: [
      {
        type: "idea",
        text: "*A* is یه before the noun in speech (written یِک), and in writing often the ending ـی instead: یه کِتاب, کِتابی.",
      },
      {
        type: "examples",
        items: [
          { fa: "{یه} کِتاب خَریدَم.", written: "{یِک} کِتاب خَریدَم.", en: "I bought a book." },
          { fa: "{کِتابی} خَریدَم.", en: "I bought a book. (written style)" },
        ],
      },
    ],
  },
  {
    slug: "ra",
    title: "را on a specific object",
    unit: "nouns",
    lesson: "nouns/ra-specific-object",
    blocks: [
      {
        type: "idea",
        text: "را (spoken رُو, often just *-o*) follows a **specific** direct object: the particular thing the verb acts on. It is not the word for *the*.",
      },
      {
        type: "examples",
        items: [{ fa: "کِتاب {رُو} خَریدَم.", written: "کِتاب {را} خَریدَم.", en: "I bought the book." }],
      },
    ],
  },
  {
    slug: "past-tense",
    title: "The simple past",
    unit: "past",
    lesson: "past/simple-past",
    blocks: [
      {
        type: "idea",
        text: "The simple past is the **past stem** (the infinitive without ـَن) plus the endings, and *he/she* has no ending at all: رَفْت, *he went*.",
      },
      {
        type: "table",
        caption: "رَفْتَن, to go",
        headers: ["", "Spoken", "Written"],
        rows: [
          ["I went", "رَفْتَم", "رَفْتَم"],
          ["you went", "رَفْتی", "رَفْتی"],
          ["he, she went", "رَفْت", "رَفْت"],
          ["we went", "رَفْتیم", "رَفْتیم"],
          ["you went (شُما)", "رَفْتین", "رَفْتید"],
          ["they went", "رَفْتَن", "رَفْتَنْد"],
        ],
      },
    ],
  },
  {
    slug: "prepositions",
    title: "Prepositions",
    unit: "where-when",
    lesson: "where-when/prepositions",
    blocks: [
      { type: "idea", text: "Prepositions come **before** the noun, as in English; many place words also take the ezafe: رویِ میز, *on the table*." },
      {
        type: "table",
        headers: ["Word", "Meaning", "Example"],
        rows: [
          ["به", "to", "به مَدْرِسه رَفْتَم (*I went to school*)"],
          ["اَز", "from; than", "اَز ایران اومَدَم (*I came from Iran*)"],
          ["با", "with; by (a vehicle)", "با دوسْتَم (*with my friend*)"],
          ["دَر (spoken تو)", "in", "دَر خانه, spoken تو خونه (*at home*)"],
          ["بَرایِ (spoken واسهٔ)", "for", "بَرایِ تُو (*for you*)"],
          ["تا", "until; as far as", "تا فَرْدا (*until tomorrow*)"],
          ["رویِ", "on", "رویِ میز (*on the table*)"],
        ],
      },
    ],
  },
  {
    slug: "comparison",
    title: "Comparing",
    unit: "where-when",
    lesson: "where-when/comparing",
    blocks: [
      { type: "idea", text: "ـتَر makes *-er* and ـتَرین *-est*; *than* is اَز." },
      {
        type: "examples",
        items: [
          { fa: "تِهْرون اَز شیراز {بُزُرْگ‌تَره}.", written: "تِهْران اَز شیراز {بُزُرْگ‌تَر اَسْت}.", en: "Tehran is bigger than Shiraz." },
          { fa: "{بِهْتَرین} کِتاب", en: "the best book" },
        ],
      },
    ],
  },
  {
    slug: "numbers",
    title: "Numbers with nouns",
    unit: "where-when",
    lesson: "where-when/numbers",
    blocks: [
      {
        type: "idea",
        text: "After a number the noun stays **singular**: سه کِتاب, *three books*. Speech adds the counting word تا: سه تا کِتاب.",
      },
      {
        type: "examples",
        items: [
          { fa: "سه {تا} کِتاب", written: "سه کِتاب", en: "three books" },
          { fa: "پَنْج {تا} دوسْت", written: "پَنْج دوسْت", en: "five friends" },
        ],
      },
    ],
  },
  {
    slug: "phrases",
    title: "Everyday phrases",
    unit: "culture",
    blocks: [
      { type: "idea", text: "A handful of set phrases carry most everyday politeness." },
      {
        type: "table",
        headers: ["Phrase", "Meaning"],
        rows: [
          ["سَلام", "hello"],
          ["خُداحافِظ", "goodbye"],
          ["مِرْسی، مُتَشَکِّرَم، مَمْنون", "thanks"],
          ["خواهِش می‌کُنَم", "you're welcome; please (I beg you)"],
          ["بَله، آره", "yes (polite, casual)"],
          ["نَه", "no"],
          ["بِبَخْشید", "excuse me; sorry"],
          ["اِسْمِ شُما چیه؟", "what's your name? (polite)"],
          ["حالِتون چِطُوره؟", "how are you? (polite)"],
          ["خوبَم، مِرْسی", "I'm fine, thanks"],
        ],
      },
    ],
  },
];
