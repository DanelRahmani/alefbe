import type { Lesson } from "../types";

// Unit 0: how the course works, Persian in one page, and a fast track for
// people who already speak it. Examples are original.

export const startHere: Lesson[] = [
  {
    slug: "how-it-works",
    title: "How this course works",
    summary: "Real Persian first, one change at a time; vowel marks you can turn down as your reading grows; a seal for every lesson.",
    register: "both",
    kinds: ["reading"],
    source:
      "The course conventions in content/STYLE.md; vowel marks as in Thackston, An Introduction to Persian, and the Academy of Persian Language and Literature's spelling rules.",
    vocab: [
      { fa: "سَلام", en: "hello", topic: "everyday" },
      { fa: "کِتاب", en: "book", topic: "learning" },
      { fa: "چایی", written: "چای", en: "tea", topic: "food" },
      { fa: "گُل", en: "flower", topic: "nature" },
      { fa: "گِل", en: "mud", topic: "nature" },
      { fa: "تَمام", en: "finished, complete", topic: "everyday" },
    ],
    blocks: [
      {
        type: "idea",
        text: "Every lesson shows real Persian first, then changes **one thing** so you can see exactly what that one thing does.",
      },
      {
        type: "text",
        text: "A lesson has the same parts each time: **the idea** in one sentence; **examples**, with the key word in colour; **contrast pairs** that change one thing; a **common mistake**; a short **conversation** or a note on culture; and a quick **check** where you type your answers. Finish a lesson and it gets its seal, تَمام (*done*).",
      },
      { type: "heading", text: "Reading aids" },
      {
        type: "text",
        text: "Persian is usually written without its short vowels, so you often can't tell how to say a word you haven't heard. This course starts with the vowel marks shown. One exception: a few common words spell *o* with a plain و, like تُو (*to*, you) and چِطُور (*chetor*, how); the transliteration shows them until lesson 2.5. As your reading grows, turn them down: first to the key words only, then to none, the way Iranians write. A transliteration (the sound spelled in Latin letters, like *ketâb* for کِتاب) can be switched on under every sentence.",
      },
      { type: "display" },
      { type: "heading", text: "Try the settings on these" },
      {
        type: "examples",
        items: [
          { fa: "سَلام!", en: "Hello!" },
          { fa: "این {کِتابِ} مَنه.", written: "این {کِتابِ} مَن اَسْت.", en: "This is my book." },
          { fa: "یه {چایی} می‌خُوری؟", written: "یِک {چای} می‌خُوری؟", en: "Would you like a tea?" },
        ],
      },
      { type: "heading", text: "Contrast pair" },
      {
        type: "pair",
        title: "One small mark",
        a: { fa: "گُل", en: "flower" },
        b: { fa: "گِل", en: "mud" },
        diff: "Only the mark differs: a pish ([ـُ|]) gives *gol*, a zir ([ـِ|]) gives *gel*. In everyday writing both are [گل|gol / gel], and the sentence tells you which is meant. That is why the course starts with the marks on.",
      },
      { type: "heading", text: "Common mistake" },
      {
        type: "callout",
        kind: "mistake",
        title: "Reading transliteration as spelling",
        text: "Transliteration shows the sound, not the spelling: *s* can be written with three different letters (س ص ث), and *z* with four. Use it to check yourself, then switch it off. The script is what you will see in Iran. (The course does keep *q* and *gh* apart, to show ق and غ, which sound the same.)",
      },
      {
        type: "callout",
        kind: "culture",
        title: "Persian, Farsi, Dari",
        text: "Persian is called فارْسی (*fârsi*) in Iran. In Afghanistan its official name is دَری (*dari*), though many Afghans call it فارْسی too; in Tajikistan it is called Tajik and written in Cyrillic. This course teaches the Persian of Iran: the written standard and everyday Tehran speech.",
      },
      {
        type: "quiz",
        questions: [
          {
            prompt: "Type the transliteration of گُل (flower).",
            lang: "translit",
            answers: ["gol"],
            explain: "The pish ([ـُ|]) is the vowel *o*: *gol*. With a zir it would be گِل, *gel* (mud).",
          },
          {
            prompt: "Which vowel-mark setting shows Persian the way Iranians write it? Type all, key or none.",
            lang: "en",
            answers: ["none"],
            explain: "Everyday Persian leaves the short vowels out. The course starts with all marks and works toward none.",
          },
          {
            prompt: "What is the Persian language called in Iran? Type it in transliteration.",
            lang: "translit",
            answers: ["farsi", "fârsi"],
            explain: "فارْسی, *fârsi*.",
          },
        ],
      },
    ],
  },
  {
    slug: "persian-in-one-page",
    title: "Persian in one page",
    summary: "The verb usually comes last and its ending says who; written Persian has no word for “the”; and one pronoun means both he and she.",
    register: "both",
    kinds: ["grammar", "word-order"],
    source:
      "Mahootian, Persian (Routledge Descriptive Grammars), on word order, definiteness and gender; Thackston, An Introduction to Persian, lessons 1–3; Stilo, Talattof and Clinton, Modern Persian: Spoken and Written, for the spoken forms.",
    vocab: [
      { fa: "مَن", en: "I", topic: "people" },
      { fa: "او", en: "he, she", topic: "people" },
      { fa: "خَریدَن", en: "to buy", topic: "verbs" },
      { fa: "نون", written: "نان", en: "bread", topic: "food" },
      { fa: "ایرانی", en: "Iranian", topic: "people" },
      { fa: "بَرادَر", en: "brother", topic: "people" },
      { fa: "میز", en: "table, desk", topic: "home" },
      { fa: "صَد", en: "hundred", topic: "numbers" },
      { fa: "هِزار", en: "thousand", topic: "numbers" },
      { fa: "تُومَن", written: "تُومان", en: "toman (ten rials)", topic: "everyday" },
    ],
    blocks: [
      {
        type: "idea",
        text: "Persian usually puts the **verb at the end**, has **no separate word for *the***, and has **no grammatical gender**: او means both *he* and *she*.",
      },
      {
        type: "text",
        text: "Three facts cover most of the surprises. The verb comes last, and its ending already says who is acting, so a word like *I* is often left out. There is no article like *the* in written Persian (spoken Tehrani adds a definite ending ـه, as in کِتابه, *the book*, which comes later). A specific direct object is tagged with را (Unit 6), but را is not *the*. And Persian has no grammatical gender: nouns are neither masculine nor feminine, and the one pronoun او (*u*) covers both *he* and *she*.",
      },
      { type: "heading", text: "Core examples" },
      {
        type: "examples",
        items: [
          {
            fa: "مَن نون {خَریدَم}.",
            written: "مَن نان {خَریدَم}.",
            en: "I bought bread.",
            note: "The verb خَریدَم (*I bought*) comes last, and its ending ـَم already means *I*.",
          },
          {
            fa: "نون {خَریدَم}.",
            written: "نان {خَریدَم}.",
            en: "I bought bread.",
            note: "The same sentence without مَن: the ending says who.",
          },
          {
            fa: "{او} ایرانیه.",
            written: "{او} ایرانی اَسْت.",
            en: "He is Iranian. / She is Iranian.",
            note: "One pronoun for both; the situation tells you which.",
          },
          { fa: "بَرادَرَم تو {تِهْرونه}.", written: "بَرادَرَم دَر {تِهْران} اَسْت.", en: "My brother is in Tehran." },
        ],
      },
      { type: "heading", text: "Contrast pair" },
      {
        type: "pair",
        title: "Who did it?",
        a: { fa: "{خَریدَم}.", en: "I bought it." },
        b: { fa: "{خَریدیم}.", en: "We bought it." },
        diff: "Only the ending changes: ـَم is *I*, ـیم is *we*. Because the ending carries the subject, the pronoun can go.",
      },
      { type: "heading", text: "Common mistake" },
      {
        type: "callout",
        kind: "mistake",
        title: "او is for people",
        text: "For a thing, Persian uses آن (spoken اون, *un*) or simply leaves the pronoun out; او is only for people. In speech اون is common for people too: اون ایرانیه, *he's Iranian*.",
        wrong: { fa: "او رویِ میزه.", written: "او رویِ میز اَسْت.", en: "It's on the table. (said of a book)" },
        right: { fa: "رویِ میزه.", written: "رویِ میز اَسْت.", en: "It's on the table." },
      },
      { type: "heading", text: "In real conversation" },
      {
        type: "dialogue",
        title: "In a bookshop",
        lines: [
          { who: "Sara", fa: "سَلام! این کِتاب {چَنْده}؟", written: "سَلام! این کِتاب {چَنْد اَسْت}؟", en: "Hello! How much is this book?" },
          { who: "Seller", fa: "صَد هِزار {تُومَنه}.", written: "صَد هِزار {تُومان اَسْت}.", en: "It's a hundred thousand tomans." },
          { who: "Sara", fa: "باشه، مِرْسی.", written: "باشَد، مُتَشَکِّرَم.", en: "OK, thanks." },
        ],
        note: "The first two lines end in their verb: چَنْده (*how much is it*) and تُومَنه (*it is … tomans*) end in the spoken ـه, *is*. Prices are said in *tomans*, the everyday unit; one toman is ten rials, the official currency.",
      },
      {
        type: "quiz",
        questions: [
          {
            prompt: "Where does the verb go in a Persian sentence? Type first or last.",
            lang: "en",
            answers: ["last", "at the end", "the end", "end"],
            explain: "Last: مَن نان خَریدَم, literally *I bread bought*.",
          },
          {
            prompt: "Type the written pronoun from this lesson that means both *he* and *she*.",
            lang: "fa",
            answers: ["او", "اون", "وی"],
            explain: "او (*u*): Persian has no grammatical gender. Speech often uses اون (*un*), and formal prose وَی (*vey*), the same way.",
          },
          {
            prompt: "خَریدَم means *I bought*. Type the ending that means *I*.",
            lang: "fa",
            answers: ["م"],
            explain: "ـَم (*-am*) at the end of the verb means *I*: خَریدَم, *kharidam*.",
          },
          {
            prompt: "Write *We bought* as one Persian word.",
            lang: "fa",
            answers: ["خریدیم"],
            explain: "خَریدیم, *kharidim*: the ending ـیم means *we*.",
          },
        ],
      },
    ],
  },
  {
    slug: "fast-track",
    title: "Already speak Persian? Your fast track",
    summary: "For heritage and Dari speakers: skip the script units if you read already, and focus on spelling and the spoken–written split.",
    register: "both",
    kinds: ["spoken", "spelling"],
    source:
      "Stilo, Talattof and Clinton, Modern Persian: Spoken and Written, on spoken Tehrani forms; Windfuhr and Perry, “Persian and Tajik”, in The Iranian Languages (Routledge, 2009), on the vowels of Dari and Iranian Persian.",
    vocab: [
      { fa: "خونه", written: "خانه", en: "house, home", topic: "home" },
      { fa: "خواسْتَن", en: "to want", topic: "verbs" },
      { fa: "اِسْم", en: "name", topic: "everyday" },
      { fa: "دیروز", en: "yesterday", topic: "time" },
      { fa: "عَروسی", en: "wedding", topic: "people" },
      { fa: "شیر", en: "milk; lion", topic: "food" },
    ],
    blocks: [
      {
        type: "idea",
        text: "If you already speak Persian and can read the script, skip Units 1 and 2 and focus on what is new: **Iranian spelling**, and how **written** and **spoken** Persian differ.",
      },
      {
        type: "text",
        text: "Heritage speakers usually understand far more than they can read or write. Two things tend to be new: the script and its spelling (which letter, where the half-space goes), and the two registers. Persian is written in a formal standard but spoken, in Tehran, with shorter forms. Lessons that teach sentences show both, spoken first.",
      },
      {
        type: "skip",
        units: ["alphabet", "sounds"],
        groups: 9,
        label: "I can read Persian: skip Units 1 and 2",
        text: "This marks the alphabet and sound lessons finished and opens every letter group in the trainer. Unit 3, on spelling and the half-space, is worth doing anyway.",
      },
      {
        type: "link",
        href: "/placement",
        label: "Take the placement check",
        text: "if you know some grammar too: two questions per unit, taken from the lesson quizzes, suggest which unit to start at, and the check can mark the earlier lessons finished.",
      },
      { type: "heading", text: "Spoken and written, side by side" },
      {
        type: "examples",
        items: [
          {
            fa: "{می‌خوام} {بِرَم} {خونه}.",
            written: "{می‌خواهَم} به {خانه} {بِرَوَم}.",
            en: "I want to go home.",
            note: "In speech the place you go to often follows the verb; in writing it comes before, with به (*to*).",
          },
          {
            fa: "{اِسْمِت} {چیه}؟",
            written: "{اِسْمَت} {چیسْت}؟",
            en: "What's your name? (to a friend)",
            note: "The ending for *your* is *-et* (اِسْمِت) in speech and *-at* (اِسْمَت) in formal Persian; چیه is the spoken چیسْت.",
          },
          { fa: "{نون} نَداریم.", written: "{نان} نَداریم.", en: "We don't have any bread." },
        ],
      },
      {
        type: "pair",
        title: "â before n",
        a: { fa: "نان", en: "bread (written)" },
        b: { fa: "نون", en: "bread (spoken)" },
        diff: "In many everyday words Tehrani speech turns *ân* into *un*: *nân* → *nun*, *khâne* → *khune* (and sometimes *âm* into *um*: کُدام → کُدوم, *which*). Not every word does: ایران stays *irân*. Formal writing always keeps the ا; نون and خونه are written only where people write the way they talk, as in chat messages.",
      },
      { type: "heading", text: "Common mistake" },
      {
        type: "callout",
        kind: "mistake",
        title: "Writing speech in formal text",
        text: "Spoken forms like خونه and می‌خوام are fine in a chat message, but a letter, an essay or a form needs the written forms خانه and می‌خواهَم.",
        wrong: { fa: "دَر {خونه} هَسْتَم.", en: "I am at home. (in a formal letter)" },
        right: { fa: "دَر {خانه} هَسْتَم.", en: "I am at home." },
      },
      {
        type: "callout",
        kind: "dari",
        title: "For Dari speakers",
        text: "Dari and Iranian Persian use the same script and almost the same formal written language, so formal Iranian texts will mostly look familiar apart from some vocabulary; what is new is Tehrani speech. One difference you will hear at once is in the vowels: Dari keeps two old long vowels, *ē* and *ō*, which Iranian Persian merged into *i* and *u*. شیر, for example, is *shir* (milk) and *shēr* (lion) in Dari, but *shir* for both in Iran.",
        // Vowels: Windfuhr and Perry 2009. Awaiting the owner's confirmation (a fluent Dari speaker).
        checked: false,
      },
      {
        type: "dialogue",
        title: "A cousin visits",
        lines: [
          { who: "Neda", fa: "سَلام! چِطُوری؟", written: "سَلام! حالِ تُو چِطُور اَسْت؟", en: "Hi! How are you?" },
          { who: "Omid", fa: "خوبَم، {مِرْسی}. تُو چِطُوری؟", written: "خوبَم، {مُتَشَکِّرَم}. حالِ تُو چِطُور اَسْت؟", en: "I'm fine, thanks. How are you?" },
          {
            who: "Neda",
            fa: "{مَنَم} خوبَم. کَی {اومَدی} {تِهْرون}؟",
            written: "{مَن هَم} خوبَم. کَی به {تِهْران} {آمَدی}؟",
            en: "I'm fine too. When did you get to Tehran?",
          },
          { who: "Omid", fa: "دیروز. {واسه} عَروسی اومَدَم.", written: "دیروز. {بَرایِ} عَروسی آمَدَم.", en: "Yesterday. I came for the wedding." },
        ],
        note: "The spoken forms here: مَنَم for مَن هَم (*me too*), اومَدی for آمَدی, تِهْرون for تِهْران, and واسه for بَرایِ (*for*); مِرْسی (from French *merci*) is the everyday *thanks*, مُتَشَکِّرَم the more formal one.",
      },
      {
        type: "quiz",
        questions: [
          {
            prompt: "Type the written form of the spoken word خونه (home).",
            lang: "fa",
            answers: ["خانه"],
            explain: "خانه, *khâne*; Tehrani speech says *khune*.",
          },
          {
            prompt: "In Tehran, نان (bread) is usually said…? Type the transliteration.",
            lang: "translit",
            answers: ["nun"],
            explain: "*nun*: *ân* before *n* often becomes *un* in speech.",
          },
          {
            prompt: "Type the spoken form of می‌خواهَم (I want), with its half-space.",
            lang: "fa",
            answers: ["می‌خوام"],
            explain: "می‌خوام, *mikhâm*.",
          },
        ],
      },
    ],
  },
];
