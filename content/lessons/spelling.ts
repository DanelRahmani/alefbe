import type { Lesson } from "../types";

// Unit 3: the half-space, letters that share a sound, loanword patterns,
// punctuation and the keyboard. Spelling follows the Academy of Persian
// Language and Literature (see content/STYLE.md). Examples are original.

const SOURCE =
  "The Academy of Persian Language and Literature's spelling rules (دستور خط فارسی); Thackston, An Introduction to Persian, on Arabic loanwords; Stilo, Talattof and Clinton, Modern Persian: Spoken and Written, for the spoken forms.";

export const spelling: Lesson[] = [
  {
    slug: "half-space",
    title: "The half-space: why می‌رَوَم is one word",
    summary: "An invisible break keeps the parts of one word apart without splitting it into two words.",
    register: "written",
    kinds: ["spelling"],
    source: SOURCE,
    vocab: [
      { fa: "نیم‌فاصِله", en: "half-space", topic: "learning" },
      { fa: "بی‌اَدَب", en: "rude (literally without manners)", topic: "describing" },
      { fa: "رَفْتَن", en: "to go", topic: "verbs" },
    ],
    blocks: [
      {
        type: "idea",
        text: "A **half-space** (نیم‌فاصِله) keeps the parts of one word apart without a full space: می‌رَوَم is one word, with an invisible break after می.",
      },
      {
        type: "text",
        text: "Persian letters join automatically, so می and رَوَم typed together fuse into [میروم|miravam], which is hard to read. A space would split them into two words, [می روم|mi ravam], which counts as a spelling mistake. The half-space (in Unicode, the *zero-width non-joiner*) stops the joining but keeps one word: می‌رَوَم. On the standard Persian keyboard it is Shift + Space.",
      },
      {
        type: "examples",
        items: [
          { fa: "{می‌}رَوَم.", en: "I go.", note: "After a prefix: می before the verb." },
          { fa: "کِتاب‌{ها}", en: "books", note: "Before an ending: ـها after the noun." },
          { fa: "خانه‌{اَم}", en: "my house", note: "Before an ending after a silent ه." },
          { fa: "{بی}‌اَدَب", en: "rude", note: "In a compound: بی (*without*) + اَدَب (*manners*)." },
        ],
      },
      {
        type: "pair",
        title: "Needed, or not",
        a: { fa: "کِتاب‌ها", en: "books" },
        b: { fa: "روزْها", en: "days" },
        diff: "ب joins forward, so کِتاب‌ها takes a half-space to keep ـها apart (the Academy also allows it joined). ز never joins forward, so in روزْها the ending already stands apart and no half-space is needed.",
      },
      { type: "heading", text: "Common mistake" },
      {
        type: "callout",
        kind: "mistake",
        title: "A space instead of a half-space",
        text: "Typing a space after می splits the word in two. It is a very common slip in quick typing.",
        wrong: { fa: "[می روم|mi ravam]", en: "two words" },
        right: { fa: "می‌رَوَم", en: "I go" },
      },
      {
        type: "callout",
        kind: "culture",
        title: "Half-spaces online",
        text: "Chat messages often skip the half-space ([میرم|miram]), but books, news sites and schoolwork use it. Learn the careful form first.",
      },
      {
        type: "quiz",
        questions: [
          {
            prompt: "Write *I go* in written Persian, with a half-space.",
            lang: "fa",
            answers: ["می‌روم"],
            explain: "می‌رَوَم: a half-space after می.",
          },
          {
            prompt: "Write *books* (کِتاب + ها).",
            lang: "fa",
            answers: ["کتاب‌ها", "کتابها"],
            explain: "کِتاب‌ها, with a half-space. The Academy also allows the joined [کتابها|ketâbhâ]; this course writes the half-space.",
          },
          {
            prompt: "Does روزْها (days) need a half-space? Type yes or no.",
            lang: "en",
            answers: ["no"],
            explain: "No: ز never joins forward, so ها already stands apart.",
          },
        ],
      },
    ],
  },
  {
    slug: "half-space-rules",
    title: "Where half-spaces go",
    summary: "After می and نِمی, before ـها and ـتَر, before some endings after a silent ه, and in some compounds.",
    register: "written",
    kinds: ["spelling"],
    source: SOURCE,
    vocab: [
      { fa: "قَدیمی", en: "old (of things)", topic: "describing" },
      { fa: "گَرْم", en: "warm", topic: "weather" },
      { fa: "دُخْتَر", en: "girl; daughter", topic: "people" },
      { fa: "دانِش‌آموز", en: "school pupil", topic: "learning" },
      { fa: "بِهْتَر", en: "better", topic: "describing" },
      { fa: "بیشْتَر", en: "more", topic: "describing" },
      { fa: "بُزُرْگ", en: "big", topic: "describing" },
    ],
    blocks: [
      {
        type: "idea",
        text: "The half-space goes where certain prefixes and endings, or the parts of some compounds, would otherwise **fuse onto a joining letter**. Most endings simply join, like the *-am* of کِتابَم (*my book*).",
      },
      {
        type: "table",
        headers: ["Where", "Example", "Note"],
        rows: [
          ["After می and نِمی", "می‌رَوَم، نِمی‌دانَم", "always"],
          ["Before ـها", "کِتاب‌ها، خانه‌ها", "optional elsewhere ([کتابها|ketâbhâ] is allowed); required after a silent ه"],
          ["Before اَم، ای، اَنْد after a silent ه or a final ی", "خانه‌اَم، خانه‌ای، قَدیمی‌اَنْد", "*my house*, *a house*, *they are old*; اَسْت stays a separate word: خانه اَسْت"],
          ["Before ـتَر and ـتَرین", "بُزُرْگ‌تَر، بُزُرْگ‌تَرین", "a few everyday words are one: بِهْتَر، بیشْتَر، کَمْتَر"],
          ["In some compounds", "بی‌اَدَب، دانِش‌آموز", "بی (except a few fused words such as بیچاره), and compounds whose second part starts with آ; many compounds are simply joined: کِتابْخانه"],
        ],
      },
      {
        type: "text",
        text: "Nothing is needed after a letter that never joins forward: روزْها and دَرْها stand apart already. And a half-space never sits next to a real space.",
      },
      {
        type: "examples",
        items: [
          { fa: "{نِمی‌}دانَم.", en: "I don't know." },
          { fa: "این خانه‌{ها} قَدیمی‌اَنْد.", en: "These houses are old." },
          { fa: "هَوا {گَرْم‌تَر} شُد.", en: "The weather got warmer." },
          { fa: "دُخْتَرَم {دانِش‌آموز} اَسْت.", en: "My daughter is a school pupil." },
        ],
      },
      {
        type: "pair",
        title: "The fixed words",
        a: { fa: "بُزُرْگ‌تَر", en: "bigger" },
        b: { fa: "بِهْتَر", en: "better" },
        diff: "ـتَر normally takes a half-space (بُزُرْگ‌تَر), but a few everyday words are written as one: بِهْتَر, بیشْتَر, کَمْتَر.",
      },
      { type: "heading", text: "Common mistake" },
      {
        type: "callout",
        kind: "mistake",
        title: "A half-space where nothing joins",
        text: "After ا د ذ ر ز ژ و a half-space does nothing; it is redundant, and editors remove it. Write روزْها with no break at all.",
      },
      {
        type: "callout",
        kind: "culture",
        title: "Who decides",
        text: "The Academy of Persian Language and Literature (فَرْهَنْگِسْتان) publishes the standard spelling that schoolbooks and many publishers follow. Its half-space rules are among its most visible.",
      },
      {
        type: "quiz",
        questions: [
          {
            prompt: "Write *I don't know* in written Persian.",
            lang: "fa",
            answers: ["نمی‌دانم"],
            explain: "نِمی‌دانَم: a half-space after نِمی.",
          },
          {
            prompt: "Write *bigger* (بُزُرْگ + تَر).",
            lang: "fa",
            answers: ["بزرگ‌تر"],
            explain: "بُزُرْگ‌تَر, with a half-space. You will often see [بزرگتر|bozorgtar] joined, but the Academy writes ـتَر apart except in بِهْتَر، بیشْتَر، کَمْتَر، مِهْتَر، کِهْتَر.",
          },
          {
            prompt: "Write *better* in Persian.",
            lang: "fa",
            answers: ["بهتر"],
            explain: "بِهْتَر: one of the few ـتَر words written as one.",
          },
        ],
      },
    ],
  },
  {
    slug: "s-letters",
    title: "One sound, three letters: س ص ث",
    summary: "س is the everyday s; ص and ث come mostly in words from Arabic, and the spelling is learned with the word.",
    register: "both",
    kinds: ["spelling"],
    source: SOURCE,
    vocab: [
      { fa: "صَبْر", en: "patience", topic: "feelings" },
      { fa: "صَبور", en: "patient", topic: "describing" },
      { fa: "حِساب", en: "account; bill", topic: "everyday" },
      { fa: "ثانیه", en: "second (of time)", topic: "time" },
      { fa: "مِثال", en: "example", topic: "learning" },
      { fa: "سیصَد", en: "three hundred", topic: "numbers" },
      { fa: "شَصْت", en: "sixty", topic: "numbers" },
      { fa: "سوپ", en: "soup", topic: "food" },
      { fa: "هَنوز", en: "still, yet", topic: "time" },
      { fa: "زود", en: "early; soon", topic: "time" },
    ],
    blocks: [
      {
        type: "idea",
        text: "س ص ث all say *s*. **س** is the everyday one; **ص** and **ث** come mostly in words from Arabic.",
      },
      {
        type: "text",
        text: "No rule of sound tells you which *s* to write: the spelling comes with the word. Three things help. Words from European languages always use س (سوپ, *soup*; سینِما, *cinema*). Words from Arabic come in families that keep their letters: صَبْر (patience), صَبور (patient). And a few native Persian words use ص too: صَد (hundred), شَصْت (sixty).",
      },
      {
        type: "table",
        headers: ["Letter", "Where you meet it", "Examples"],
        rows: [
          ["س", "Persian, European and Arabic words", "سَبْز, سوپ, حِساب"],
          ["ص", "mostly Arabic loanwords, and a few Persian words", "صَبْر, صُبْح, صَد"],
          ["ث", "almost only Arabic loanwords", "ثانیه, مِثال, ثابِت"],
        ],
      },
      {
        type: "examples",
        items: [
          { fa: "یه {ثانیه} {صَبْر} کُن!", written: "یِک {ثانیه} {صَبْر} کُن!", en: "Wait a second!" },
          { fa: "{سیصَد} تُومَنه.", written: "{سیصَد} تُومان اَسْت.", en: "It's three hundred tomans." },
          { fa: "این یه {مِثالِ} خوبه.", written: "این یِک {مِثالِ} خوب اَسْت.", en: "This is a good example." },
        ],
      },
      {
        type: "pair",
        title: "Same sound, different words",
        a: { fa: "ثَواب", en: "a good deed's reward (in religion)" },
        b: { fa: "صَواب", en: "right, correct (formal)" },
        diff: "Both are *savâb*; only the first letter tells them apart. صَواب is formal, but ثَواب is everyday: ثَواب داره (*it's a good deed*). Learn the spelling with the word.",
      },
      { type: "heading", text: "Common mistake" },
      {
        type: "callout",
        kind: "mistake",
        title: "ص in a European word",
        text: "Loanwords from European languages never use ص or ث: *soup* is سوپ and *cinema* سینِما, both with س.",
      },
      { type: "heading", text: "In real conversation" },
      {
        type: "dialogue",
        title: "Too early",
        lines: [
          { who: "Omid", fa: "ساعَت چَنْده؟", written: "ساعَت چَنْد اَسْت؟", en: "What time is it?" },
          { who: "Neda", fa: "هَفْتِ {صُبْح}.", written: "هَفْتِ {صُبْح} اَسْت.", en: "Seven in the morning." },
          { who: "Omid", fa: "هَنوز زوده!", written: "هَنوز زود اَسْت!", en: "It's still early!" },
        ],
        note: "ساعَت and صُبْح come from Arabic; هَفْت, هَنوز and زود are Persian.",
      },
      {
        type: "quiz",
        questions: [
          {
            prompt: "Which *s* do words from European languages use? Type the letter.",
            lang: "fa",
            answers: ["س"],
            explain: "س: سوپ, سینِما.",
          },
          { prompt: "Write *hundred* in Persian.", lang: "fa", answers: ["صد", "یکصد"], explain: "صَد, with ص." },
          { prompt: "Write *second* (of time) in Persian.", lang: "fa", answers: ["ثانیه"], explain: "ثانیه, with ث." },
        ],
      },
    ],
  },
  {
    slug: "z-letters",
    title: "One sound, four letters: ز ذ ض ظ",
    summary: "ز is the everyday z; ض and ظ, and most ذ words, come from Arabic, whose families keep their letters.",
    register: "both",
    kinds: ["spelling"],
    source: SOURCE,
    vocab: [
      { fa: "حاضِر", en: "present; ready", topic: "describing" },
      { fa: "حُضور", en: "presence", topic: "everyday" },
      { fa: "نَظَر", en: "opinion; look", topic: "feelings" },
      { fa: "مَنْظَره", en: "view, scenery", topic: "nature" },
      { fa: "ذِهْن", en: "mind", topic: "feelings" },
      { fa: "نَذْری", en: "food given to fulfil a vow", topic: "food" },
      { fa: "پیتْزا", en: "pizza", topic: "food" },
    ],
    blocks: [
      {
        type: "idea",
        text: "ز ذ ض ظ all say *z*. **ز** is the everyday one; **ض** and **ظ** come almost only in words from Arabic, and so do most words with **ذ**, apart from a few Persian ones such as گُذاشْتَن (*to put*) and پَذیرُفْتَن (*to accept*).",
      },
      {
        type: "text",
        text: "As with *s*, the spelling comes with the word, and Arabic families keep their letters: حاضِر (present, ready) and حُضور (presence) share ض; نَظَر (opinion) and مَنْظَره (view) share ظ. Words from European languages use ز: پیتْزا (*pizza*).",
      },
      {
        type: "examples",
        items: [
          { fa: "{حاضِری}؟", written: "{حاضِر} هَسْتی؟", en: "Are you ready?" },
          { fa: "{نَظَرِت} چیه؟", written: "{نَظَرِ} تُو چیسْت؟", en: "What do you think? (literally: what is your opinion?)" },
          { fa: "{ظُهْر} {غَذا} خُورْدیم.", en: "We ate at noon." },
        ],
      },
      {
        type: "pair",
        title: "A family keeps its letter",
        a: { fa: "حاضِر", en: "present; ready" },
        b: { fa: "حُضور", en: "presence" },
        diff: "Both come from one Arabic root, ح ض ر (being present), so both are spelled with ض. Once you know one, you can spell the other.",
      },
      { type: "heading", text: "Common mistake" },
      {
        type: "callout",
        kind: "mistake",
        title: "Spelling by sound",
        text: "Guessing from the sound often picks the wrong *z*: ز is the most frequent, but ذ, ض and ظ are common in words from Arabic. Link a new word to one you know from the same family instead.",
      },
      {
        type: "callout",
        kind: "culture",
        title: "Nazri",
        text: "نَذْری (*nazri*) is food cooked to fulfil a vow and handed out to neighbours and passers-by, especially in the month of Muharram.",
      },
      {
        type: "quiz",
        questions: [
          {
            prompt: "Which *z* is the everyday one, used in most words? Type it.",
            lang: "fa",
            answers: ["ز"],
            explain: "ز: زَبان, زود, روز.",
          },
          { prompt: "Write *food* (*ghazâ*, the everyday word) in Persian.", lang: "fa", answers: ["غذا"], explain: "غَذا, with ذ." },
          { prompt: "Write *noon* in Persian.", lang: "fa", answers: ["ظهر"], explain: "ظُهْر, with ظ." },
        ],
      },
    ],
  },
  {
    slug: "t-h-gh",
    title: "ت or ط, ه or ح, غ or ق",
    summary: "Three more pairs share a sound; ت and ه are the everyday ones, ط and ح mostly Arabic, ق mostly Arabic or Turkic, and غ appears in Persian words too.",
    register: "both",
    kinds: ["spelling"],
    source: SOURCE,
    vocab: [
      { fa: "حَیات", en: "life (formal; everyday زِنْدِگی)", topic: "everyday" },
      { fa: "حَیاط", en: "courtyard", topic: "home" },
      { fa: "باغ", en: "garden", topic: "places" },
      { fa: "چِراغ", en: "lamp, light", topic: "home" },
      { fa: "قَشَنْگ", en: "pretty, beautiful", topic: "describing" },
      { fa: "اُتاق", en: "room", topic: "home" },
      { fa: "حَوض", en: "pool (in a courtyard)", topic: "home" },
      { fa: "بازی", en: "game; play", topic: "everyday" },
    ],
    blocks: [
      {
        type: "idea",
        text: "Three more pairs share a sound: **ت / ط** (*t*), **ه / ح** (*h*) and **غ / ق** (one sound, written *gh* or *q* here). ت and ه are the everyday letters; ط and ح come mostly in words from Arabic.",
      },
      {
        type: "text",
        text: "With *gh* it is less clear-cut: غ appears in Persian words too (باغ, *garden*; چِراغ, *lamp*), while ق comes mostly in words from Arabic (قَهْوه, *coffee*) and Turkic (اُتاق, *room*; قَشَنْگ, *pretty*). Tehran itself was once spelled with ط, [طهران|tehrân]; today it is تِهْران.",
      },
      {
        type: "examples",
        items: [
          { fa: "تو {حَیاط} {بازی} می‌کُنَن.", written: "دَر {حَیاط} {بازی} می‌کُنَنْد.", en: "They're playing in the courtyard." },
          { fa: "{قَهْوه} یا چای؟", en: "Coffee or tea?" },
          { fa: "{باغ} خَیلی {قَشَنْگه}.", written: "{باغ} خَیلی {قَشَنْگ} اَسْت.", en: "The garden is very pretty." },
        ],
      },
      {
        type: "pair",
        title: "Life, or a courtyard",
        a: { fa: "حَیات", en: "life" },
        b: { fa: "حَیاط", en: "courtyard" },
        diff: "Both are *hayât*: with ت it means life, with ط a courtyard.",
      },
      { type: "heading", text: "Common mistake" },
      {
        type: "callout",
        kind: "mistake",
        title: "The wrong *t*",
        text: "Because ت and ط sound the same, it is easy to write the courtyard with ت. That spells *life*.",
        wrong: { fa: "{حَیاتِ} خانه", en: "meant: the courtyard of the house" },
        right: { fa: "{حَیاطِ} خانه", en: "the courtyard of the house" },
      },
      {
        type: "callout",
        kind: "culture",
        title: "The Persian courtyard",
        text: "Traditional Iranian houses face inward onto a حَیاط, with a pool (حَوض, *howz*) and a garden, as in the historic houses of Kashan and Yazd.",
      },
      {
        type: "quiz",
        questions: [
          { prompt: "Write *life* (*hayât*, the formal word) in Persian.", lang: "fa", answers: ["حیات"], explain: "حَیات, with ت; the courtyard is حَیاط. The everyday word for life is زِنْدِگی." },
          { prompt: "Write *courtyard* in Persian.", lang: "fa", answers: ["حیاط"], explain: "حَیاط, with ط." },
          { prompt: "Write *coffee* in Persian.", lang: "fa", answers: ["قهوه"], explain: "قَهْوه, with ق." },
        ],
      },
    ],
  },
  {
    slug: "arabic-loanwords",
    title: "Arabic loanwords: families that predict spelling",
    summary: "Many Persian words come from Arabic in families built on three root letters, and the family keeps its spelling.",
    register: "both",
    kinds: ["spelling"],
    source: SOURCE,
    vocab: [
      { fa: "عِلْم", en: "science, knowledge", topic: "learning" },
      { fa: "عالِم", en: "scholar", topic: "people" },
      { fa: "عالَم", en: "world", topic: "places" },
      { fa: "مَعْلوم", en: "known; clear", topic: "describing" },
      { fa: "کاتِب", en: "scribe", topic: "people" },
      { fa: "مَکْتوب", en: "written", topic: "describing" },
      { fa: "مَعْروف", en: "famous", topic: "describing" },
      { fa: "مُسافِر", en: "traveller, passenger", topic: "people" },
      { fa: "اِنْتِظار", en: "waiting; expectation", topic: "feelings" },
    ],
    blocks: [
      {
        type: "idea",
        text: "Many Persian words come from Arabic in **families built on three root letters**, and the whole family keeps its spelling: learn one word and you can spell the others.",
      },
      {
        type: "text",
        text: "A root like ک ت ب (writing) gives کِتاب (book), کاتِب (scribe) and مَکْتوب (written). The root letters, including the tricky ص ض ط ظ ث ذ ح ع ق, stay the same throughout the family. Two patterns are worth knowing: *ma-…-u-…* for something done to (مَعْروف, *famous*, literally *known*), and *mo-*, which begins many words for the one who does (مُعَلِّم, *teacher*; مُسافِر, *traveller*), though not all: مُحْتَرَم means *respected*.",
      },
      {
        type: "table",
        headers: ["Root", "Words"],
        rows: [
          ["ع ل م (knowing)", "عِلْم (science), عالِم (scholar), مُعَلِّم (teacher), مَعْلوم (known, clear)"],
          ["ک ت ب (writing)", "کِتاب (book), کاتِب (scribe), مَکْتوب (written)"],
          ["ح ض ر (being present)", "حاضِر (ready), حُضور (presence)"],
          ["ن ظ ر (looking)", "نَظَر (opinion), مَنْظَره (view), اِنْتِظار (waiting)"],
        ],
      },
      {
        type: "examples",
        items: [
          { fa: "{مُعَلِّم} اومَد.", written: "{مُعَلِّم} آمَد.", en: "The teacher came." },
          { fa: "{مَعْلومه}!", written: "{مَعْلوم} اَسْت!", en: "Obviously! (it's clear)" },
          { fa: "یه {مُسافِر} اومَد.", written: "یِک {مُسافِر} آمَد.", en: "A traveller came." },
        ],
      },
      {
        type: "pair",
        title: "Same letters, different vowel",
        a: { fa: "عالِم", en: "scholar" },
        b: { fa: "عالَم", en: "world" },
        diff: "Same four letters, same root: with a zir, عالِم (*âlem*) is a scholar, one who knows; with a zabar, عالَم (*âlam*) is the world. Only the vowel mark tells them apart.",
      },
      { type: "heading", text: "Common mistake" },
      {
        type: "callout",
        kind: "mistake",
        title: "Spelling each word from scratch",
        text: "Guessing each word from its sound gets the tricky letters wrong. Look for a relative you can already spell: if you know حاضِر, you know the ض in حُضور.",
      },
      {
        type: "callout",
        kind: "culture",
        title: "Arabic in Persian",
        text: "Arabic words entered Persian over more than a thousand years, much as French and Latin words entered English. Today they are simply Persian words, said the Persian way: ع and ح are softened, and ض and ظ sound like ز.",
      },
      {
        type: "quiz",
        questions: [
          {
            prompt: "مُعَلِّم (teacher) and عِلْم (science) share three root letters. Type them.",
            lang: "fa",
            answers: ["علم", "ع ل م"],
            explain: "ع ل م: knowing.",
          },
          {
            prompt: "Write *presence* in Persian (a relative of حاضِر).",
            lang: "fa",
            answers: ["حضور"],
            explain: "حُضور: the same ح ض ر as حاضِر.",
          },
          {
            prompt: "عالِم or عالَم: which means *world*? Type its transliteration.",
            lang: "translit",
            answers: ["alam", "âlam"],
            explain: "عالَم, *âlam*: world. عالِم, *âlem*, is a scholar.",
          },
        ],
      },
    ],
  },
  {
    slug: "punctuation-and-keyboard",
    title: "Punctuation and the Persian keyboard",
    summary: "Persian has its own comma, semicolon, question mark and quotation marks, and a keyboard layout that types the right ی and ک.",
    register: "both",
    kinds: ["spelling"],
    source: `${SOURCE} Keyboard layout: the national standard ISIRI 9147.`,
    vocab: [
      { fa: "پَنیر", en: "cheese", topic: "food" },
      { fa: "سَبْزی", en: "fresh herbs", topic: "food" },
      { fa: "فَرْدا", en: "tomorrow", topic: "time" },
      { fa: "چِرا", en: "why; yes (to a negative question)", topic: "everyday" },
    ],
    blocks: [
      {
        type: "idea",
        text: "Persian has its own comma **،**, semicolon **؛** and question mark **؟**, turned or mirrored for a right-to-left line, and uses **« »** as quotation marks.",
      },
      {
        type: "table",
        headers: ["Sign", "Name", "Use"],
        rows: [
          ["،", "*virgul* (also *kâmâ*)", "comma"],
          ["؛", "*noqte-virgul*", "semicolon"],
          ["؟", "*alâmat-e so'âl*", "question mark"],
          ["« »", "*giyume*", "quotation marks"],
        ],
      },
      {
        type: "text",
        text: "Full stops and exclamation marks look the same as in English. To type Persian, add the standard Persian keyboard layout: it types the Persian ی and ک and has the half-space on Shift + Space. An Arabic layout types look-alike letters that are different characters, so searches and spell-checkers stop matching.",
      },
      {
        type: "examples",
        items: [
          { fa: "سَلام، حالِت چِطُوره؟", written: "سَلام، حالَت چِطُور اَسْت؟", en: "Hi, how are you?" },
          { fa: "گُفْت: «فَرْدا میام.»", written: "گُفْت: «فَرْدا می‌آیَم.»", en: "He said, “I'll come tomorrow.”" },
          { fa: "نون، پَنیر وُ سَبْزی خَریدَم.", written: "نان، پَنیر وَ سَبْزی خَریدَم.", en: "I bought bread, cheese and herbs." },
        ],
      },
      {
        type: "pair",
        title: "The same word, two jobs",
        a: { fa: "چِرا؟", en: "Why?" },
        b: { fa: "چِرا.", en: "Yes, I did (answering “didn't you…?”)" },
        diff: "As a question, چِرا is *why*. As the answer to a negative question (*Didn't you go?*), it means *yes, I did*, like French *si*.",
      },
      { type: "heading", text: "Common mistake" },
      {
        type: "callout",
        kind: "mistake",
        title: "The English question mark",
        text: "Persian uses its own mirrored question mark, ؟. The English one is a different character and looks wrong in Persian text.",
      },
      {
        type: "callout",
        kind: "culture",
        title: "*and* in speech",
        text: "In everyday speech وَ (*and*) between words is usually said as a short *o*, in lists and elsewhere: *nun, panir o sabzi*; *man o to* (you and me). It is still written وَ.",
      },
      {
        type: "quiz",
        questions: [
          {
            prompt: "What is the Persian comma called? Type it in transliteration.",
            lang: "translit",
            answers: ["virgul", "kama", "kâmâ"],
            explain: "*virgul*, from French *virgule*: ،",
          },
          {
            prompt: "Answering چِرا to *Didn't you go?* means… Type yes or why.",
            lang: "en",
            answers: ["yes"],
            explain: "*Yes, I did*, like French *si*.",
          },
          {
            prompt: "Which keyboard layout types the right ی and ک? Type Persian or Arabic.",
            lang: "en",
            answers: ["persian"],
            explain: "The Persian one; an Arabic layout types look-alike letters that don't match in searches.",
          },
        ],
      },
    ],
  },
];
