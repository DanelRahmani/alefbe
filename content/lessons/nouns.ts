import type { Lesson } from "../types";

export const nouns: Lesson[] = [
  {
    slug: "ra-specific-object",
    title: "را marks a specific direct object",
    summary: "Put را after a direct object that is a particular one (the book, this song, Maryam), not just any book.",
    register: "both",
    kinds: ["grammar", "prepositions"],
    source:
      "Mahootian, Persian (Routledge Descriptive Grammars), on را and specificity; Lazard, A Grammar of Contemporary Persian, on را and definiteness; Stilo, Talattof and Clinton, Modern Persian: Spoken and Written, on spoken رُو / -o.",
    vocab: [
      { fa: "کِتاب", en: "book", topic: "learning" },
      { fa: "خَریدَن", en: "to buy", topic: "verbs" },
      { fa: "دیدَن", en: "to see", topic: "verbs" },
      { fa: "دَر", en: "door", topic: "home" },
      { fa: "بَسْتَن", en: "to close", topic: "verbs" },
      { fa: "آهَنْگ", en: "song", topic: "everyday" },
      { fa: "نامه", en: "letter (mail)", topic: "everyday" },
      { fa: "مُعَلِّم", en: "teacher", topic: "people" },
      { fa: "نون", written: "نان", en: "bread", topic: "food" },
      { fa: "چایی", written: "چای", en: "tea", topic: "food" },
      { fa: "آشْپَزْخونه", written: "آشْپَزْخانه", en: "kitchen", topic: "home" },
    ],
    blocks: [
      {
        type: "idea",
        text: "{را} tags a **specific** direct object: the particular thing the verb acts on.",
      },
      {
        type: "text",
        text: "In the core Persian sentence the verb comes last, and the words before it need to show what role they play. The **direct object** (مَفْعولِ صَریح, the thing the action is done to) gets its tag, را, when it is **specific**: a particular one the speaker has in mind, usually one the listener can identify too, because it is named, pointed at, owned, or already mentioned. A non-specific object (any bread, some book) gets no tag. In speech را is رُو, and after a consonant it is usually said *-o*: Iranians often type کِتاب رُو but say *ketâbo* (more in “را in speech”, later in this unit).",
      },
      { type: "heading", text: "Core examples" },
      {
        type: "examples",
        items: [
          {
            fa: "کِتاب {رُو} خَریدَم.",
            written: "کِتاب {را} خَریدَم.",
            en: "I bought the book.",
            note: "The book you and I both know about.",
          },
          {
            fa: "مَرْیَم {رُو} دیدی؟",
            written: "مَرْیَم {را} دیدی؟",
            en: "Did you see Maryam?",
            note: "A name always points to one person, so it takes را.",
          },
          {
            fa: "دَر {رُو} بِبَنْد.",
            written: "دَر {را} بِبَنْد.",
            en: "Close the door.",
          },
          {
            fa: "این آهَنْگ {رُو} دوسْت دارَم.",
            written: "این آهَنْگ {را} دوسْت دارَم.",
            en: "I like this song.",
            note: "این (this) makes the object specific.",
          },
          {
            fa: "روزْنامهٔ اِمْروز {رُو} خونْدی؟",
            written: "روزْنامهٔ اِمْروز {را} خوانْدی؟",
            en: "Did you read today's paper?",
            note: "را comes after the whole object phrase, ezafe and all.",
          },
        ],
      },
      { type: "heading", text: "Contrast pairs" },
      {
        type: "pair",
        title: "A book or the book",
        a: { fa: "{یه} کِتاب خَریدَم.", written: "{یِک} کِتاب خَریدَم.", en: "I bought a book." },
        b: { fa: "کِتاب {رُو} خَریدَم.", written: "کِتاب {را} خَریدَم.", en: "I bought the book." },
        diff: "With یه (a, one) the book is new to the listener: no را. With را it is a particular book the listener knows.",
      },
      {
        type: "pair",
        title: "Letter-writing or the letter",
        a: { fa: "نامه نِوِشْتَم.", en: "I wrote a letter or letters. (I did some letter-writing.)" },
        b: { fa: "نامه {رُو} نِوِشْتَم.", written: "نامه {را} نِوِشْتَم.", en: "I wrote the letter." },
        diff: "A bare noun with no را and no یه names a kind of thing, not a particular one, and leaves the number open. Adding را picks out one letter.",
      },
      {
        type: "pair",
        title: "Any tea or the tea",
        a: {
          fa: "چایی می‌خُوری؟",
          written: "چای می‌خُوری؟",
          en: "Will you have some tea?",
          note: "The same words can also ask about a habit: *Do you drink tea?*",
        },
        b: { fa: "چایی {رُو} خُورْدی؟", written: "چای {را} خُورْدی؟", en: "Did you drink the tea?" },
        diff: "The offer is about any tea, not a particular glass, so there is no را. The question is about the tea that was poured for you.",
      },
      { type: "heading", text: "Common mistake" },
      {
        type: "callout",
        kind: "mistake",
        title: "را is not the word for “the”",
        text: "English marks most definite common nouns with *the*, so it is tempting to read را as *the*. It is not. Written Persian has no word for *the* (spoken Tehrani has a definite ending, ـه as in کِتابه, which comes later), and را goes only on a specific **direct object**, never on the subject, however definite the subject is. The opposite slip matters too: leaving out را after a specific object (این آهَنْگ دوسْت دارَم) sounds wrong to a native ear.",
        wrong: { fa: "مُعَلِّم رُو اومَد.", written: "مُعَلِّم را آمَد.", en: "The teacher came." },
        right: { fa: "مُعَلِّم اومَد.", written: "مُعَلِّم آمَد.", en: "The teacher came." },
      },
      {
        type: "callout",
        kind: "tip",
        title: "Specific but still “a”",
        text: "An object can be indefinite and still specific: *a certain book*, one the speaker has in mind but the listener does not know. Persian can mark that with را too, usually with یه and often a که clause: یه کِتابی رُو که دیروز دیدَم خَریدَم (I bought a book I had seen yesterday). Unit 10 covers the pattern.",
      },
      { type: "heading", text: "In real conversation" },
      {
        type: "dialogue",
        title: "Back from the shop",
        lines: [
          { who: "Sara", fa: "نون خَریدی؟", written: "نان خَریدی؟", en: "Did you buy bread?" },
          { who: "Ali", fa: "آره، خَریدَم.", written: "بَله، خَریدَم.", en: "Yes, I did." },
          { who: "Sara", fa: "نون {رُو} کُجا گُذاشْتی؟", written: "نان {را} کُجا گُذاشْتی؟", en: "Where did you put the bread?" },
          { who: "Ali", fa: "تو آشْپَزْخونه.", written: "دَر آشْپَزْخانه.", en: "In the kitchen." },
        ],
        note: "In the first question the bread is non-specific (any bread), so there is no را. Once both speakers mean the bread just bought, it takes را. In the last written line دَر means *in*, the written counterpart of spoken تو; the same letters also spell *door*.",
      },
      {
        type: "quiz",
        questions: [
          {
            prompt: "Type the written object marker that follows a specific direct object.",
            lang: "fa",
            answers: ["را"],
            explain: "را in writing; رُو (*ro*) in speech, usually said *-o* after a consonant.",
          },
          {
            prompt: "Does «یه کِتاب خَریدَم» (I bought a book) need را? Type yes or no.",
            lang: "en",
            answers: ["no"],
            explain: "The book is new to the listener, marked by یه, so there is no را.",
          },
          {
            prompt: "Write in Persian (written form): I saw Maryam.",
            lang: "fa",
            answers: ["مریم را دیدم", "من مریم را دیدم"],
            explain: "A name is specific, so it takes را: مَرْیَم را دیدَم.",
          },
          {
            prompt: "Type the transliteration of the spoken marker رُو.",
            lang: "translit",
            answers: ["ro"],
            explain: "رُو is *ro*; the و spells the vowel o here.",
          },
        ],
      },
    ],
  },
];
