import type { Lesson } from "../types";

// Unit 14, reading real texts: signs, a menu, chat messages, a news headline,
// a short story and one line of Hafez. Each text is a `reading` block, shown
// without vowel marks the way Iranians print it; every word is fully marked
// in the source, so the reading and the word inspector stay exact. All texts
// are original, apart from the Hafez line (public domain). Reading texts make
// no practice cards: the cloze and spoken ↔ written decks read only examples,
// pairs and dialogues (see lib/cloze.ts, lib/convert.ts).

const SOURCE =
  "Thackston, An Introduction to Persian, and Mahootian, Persian (Routledge Descriptive Grammars), on the written register; the Academy of Persian Language and Literature's دستورِ خَطِّ فارسی on spelling; Stilo, Talattof and Clinton, Modern Persian: Spoken and Written, for the spoken forms. The texts are written for the course.";

export const reading: Lesson[] = [
  {
    slug: "signs",
    title: "Signs: وُرود مَمْنوع",
    summary: "Signs use the written language at its shortest: a noun, an unwritten ezafe, and مَمْنوع for no. Read them without marks.",
    register: "written",
    kinds: ["reading"],
    source: SOURCE,
    vocab: [
      { fa: "وُرود", en: "entry, entrance", topic: "places" },
      { fa: "خُروج", en: "exit, way out", topic: "places" },
      { fa: "مَمْنوع", en: "forbidden, no (on a sign)", topic: "everyday" },
      { fa: "تَوَقُّف", en: "stopping, a stop", topic: "everyday" },
      { fa: "شَبانه‌روزی", en: "open day and night, 24-hour", topic: "time" },
      { fa: "هُل دادَن", en: "to push", topic: "verbs" },
    ],
    blocks: [
      {
        type: "idea",
        text: "Signs use the written language at its **shortest**: a noun or two, the ezafe left unwritten, and **مَمْنوع** (*forbidden*) for *no…*. With no marks, you supply the ezafe yourself.",
      },
      {
        type: "text",
        text: "A street sign names the street with an ezafe nobody writes: [خیابان حافظ|khiyâbân-e hâfez] is read خیابانِ حافِظ, *khiyâbân-e hâfez*, Hafez Street. A sign that forbids puts the action first and مَمْنوع after it: وُرود مَمْنوع, *no entry*; تَوَقُّف مَمْنوع, *no stopping*. Doors say بِکِشید (*pull*) and هُل دَهید (*push*), commands to شُما in the written form. Shop signs often leave out even the ـهٔ after a silent ه, which you read in the same way. Street signs in Iran are usually white on blue, and in big cities they often add the name in Latin letters below. Tap any word on a sign below for its reading and meaning, and use **Show** to check a line once you have tried it.",
      },
      {
        type: "reading",
        style: "sign",
        title: "A street sign",
        lines: [
          { fa: "خیابانِ حافِظ", en: "Hafez Street" },
          { fa: "وُرود مَمْنوع", en: "No entry" },
        ],
      },
      {
        type: "reading",
        style: "sign",
        title: "On a pharmacy door",
        lines: [
          { fa: "داروخانهٔ شَبانه‌روزی", en: "24-hour pharmacy" },
          { fa: "بِکِشید", en: "Pull" },
        ],
      },
      { type: "heading", text: "Core examples" },
      {
        type: "examples",
        items: [
          { fa: "{وُرود} مَمْنوع", en: "No entry" },
          { fa: "{تَوَقُّف} مَمْنوع", en: "No stopping" },
          { fa: "{خُروج}", en: "Exit" },
          { fa: "{هُل دَهید}", en: "Push" },
        ],
      },
      { type: "heading", text: "Contrast pair" },
      {
        type: "pair",
        title: "In, or out",
        a: { fa: "{وُرود}", en: "Entrance" },
        b: { fa: "{خُروج}", en: "Exit" },
        diff: "Both are Arabic loanwords on the same pattern (*vorud*, *khoruj*). With a door, an arrow or a car park, they are the two signs you meet most.",
      },
      { type: "heading", text: "Common mistake" },
      {
        type: "callout",
        kind: "mistake",
        title: "Leaving out the ezafe you can't see",
        text: "Print almost never shows the ezafe after a consonant. A street name, a shop name or a dish is usually a noun with its ezafe: read it in.",
        wrong: { fa: "خیابان حافِظ", en: "(read *khiyâbân hâfez*: the ezafe is missing)" },
        right: { fa: "خیابانِ حافِظ", en: "Hafez Street (*khiyâbân-e hâfez*)" },
      },
      {
        type: "callout",
        kind: "culture",
        title: "Streets named after poets",
        text: "Many Iranian towns have streets named after poets, such as حافِظ, سَعْدی and فِرْدُوسی. A sign reading [خیابان فردوسی|khiyâbân-e ferdosi] needs the same ezafe: *khiyâbân-e ferdosi*.",
      },
      {
        type: "quiz",
        questions: [
          { prompt: "Type the word for *exit* on a sign.", lang: "fa", answers: ["خروج"], explain: "خُروج, *khoruj*; *entrance* is وُرود." },
          { prompt: "Type *no entry* as a sign says it (two words).", lang: "fa", answers: ["ورود ممنوع"], explain: "وُرود مَمْنوع: the action, then مَمْنوع." },
          { prompt: "Type the transliteration of the street sign [خیابان حافظ|khiyâbân-e hâfez].", lang: "translit", answers: ["khiyâbân-e hâfez", "khiyâbân e hâfez"], explain: "*khiyâbân-e hâfez*: the ezafe is read though it is not written." },
          { prompt: "A door says بِکِشید. Do you push or pull? Type push or pull.", lang: "en", answers: ["pull"], explain: "Pull: بِکِشید is the written command of کِشیدَن, *to pull*." },
        ],
      },
    ],
  },
  {
    slug: "menu",
    title: "A menu: چِلُوکَباب, دوغ",
    summary: "A café menu: dish names with unwritten ezafes, prices in thousands of tomans, and ordering in speech.",
    register: "both",
    kinds: ["reading", "culture"],
    source: SOURCE,
    vocab: [
      { fa: "مِنو", en: "menu", topic: "food" },
      { fa: "چِلُوکَباب", en: "kebab with rice", topic: "food" },
      { fa: "چِلُو", en: "plain cooked rice", topic: "food" },
      { fa: "جوجه‌کَباب", en: "chicken kebab", topic: "food" },
      { fa: "سالاد", en: "salad", topic: "food" },
      { fa: "سالادِ شیرازی", en: "Shirazi salad (cucumber, tomato, onion)", topic: "food" },
      { fa: "دوغ", en: "doogh, a yoghurt drink", topic: "food" },
      { fa: "قیمَت", en: "price", topic: "everyday" },
    ],
    blocks: [
      {
        type: "idea",
        text: "A menu lists dishes as **nouns with an unwritten ezafe** (سالادِ شیرازی), and prices often in **thousands of tomans**, so ۲۸۰ means 280,000 tomans.",
      },
      {
        type: "text",
        text: "Many menus say so at the top: قیمَت‌ها به هِزار تُومان, *prices in thousands of tomans*. Digits are written left to right, as in English, even in a right-to-left line (lesson 1.10). Dish names are compounds or nouns with their describer: چِلُوکَباب is kebab with چِلُو, plain cooked rice; سالادِ شیرازی is a salad of cucumber, tomato and onion. You read the menu in the written language and order in the spoken one. The prices below are made up for the course.",
      },
      {
        type: "reading",
        style: "menu",
        title: "A café menu",
        lines: [
          { fa: "مِنو", en: "Menu" },
          { fa: "قیمَت‌ها به هِزار تُومان", en: "Prices in thousands of tomans" },
          { fa: "چِلُوکَباب", en: "Kebab with rice", price: "۲۸۰" },
          { fa: "جوجه‌کَباب", en: "Chicken kebab", price: "۳۲۰" },
          { fa: "قُرْمه‌سَبْزی", en: "Ghorme sabzi (herb stew)", price: "۲۵۰" },
          { fa: "سالادِ شیرازی", en: "Shirazi salad", price: "۹۰" },
          { fa: "دوغ", en: "Doogh", price: "۴۰" },
          { fa: "چای", en: "Tea", price: "۲۵" },
        ],
      },
      { type: "heading", text: "Core examples" },
      {
        type: "examples",
        items: [
          { fa: "یه {چِلُوکَباب}، لُطْفاً.", written: "یِک {چِلُوکَباب}، لُطْفاً.", en: "One kebab with rice, please." },
          { fa: "{سالادِ شیرازی} هَم دارین؟", written: "{سالادِ شیرازی} هَم دارید؟", en: "Do you have Shirazi salad too?" },
          { fa: "{دُو تا دوغ}، لُطْفاً.", written: "{دُو دوغ}، لُطْفاً.", en: "Two doogh, please." },
        ],
      },
      { type: "heading", text: "Contrast pair" },
      {
        type: "pair",
        title: "With rice, or without",
        a: { fa: "{چِلُوکَباب}", en: "kebab with rice" },
        b: { fa: "{کَباب}", en: "kebab" },
        diff: "چِلُو is plain cooked rice; چِلُوکَباب is the kebab served on it, written as one word.",
      },
      { type: "heading", text: "Common mistake" },
      {
        type: "callout",
        kind: "mistake",
        title: "Reading the price as tomans",
        text: "When the menu says قیمَت‌ها به هِزار تُومان, add *thousand*: ۲۸۰ is دِویسْت وُ هَشْتاد هِزار تُومَن.",
        wrong: { fa: "{دِویسْت وُ هَشْتاد تُومَن}", en: "(meant: the price ۲۸۰ on this menu)" },
        right: { fa: "{دِویسْت وُ هَشْتاد هِزار تُومَن}", written: "{دِویسْت وَ هَشْتاد هِزار تُومان}", en: "280,000 tomans" },
      },
      { type: "heading", text: "In real conversation" },
      {
        type: "dialogue",
        title: "Ordering",
        // 9.4
        lines: [
          { who: "Waiter", fa: "بِفَرْمایین. چی مَیل دارین؟", written: "بِفَرْمایید. چه مَیل دارید؟", en: "This way, please. What would you like?" },
          { who: "Customer", fa: "{دُو تا} کَباب، {یه} جوجه وُ {چَهار تا} نوشابه.", written: "{دُو} کَباب، {یِک} جوجه وَ {چَهار} نوشابه.", en: "Two kebabs, one chicken kebab and four soft drinks." },
        ],
        note: "In speech the dishes lose words: جوجه is the چِلُوجوجه‌کَباب or جوجه‌کَباب of the menu.",
      },
      {
        type: "quiz",
        questions: [
          { prompt: "Type the word for plain cooked rice, as in چِلُوکَباب.", lang: "fa", answers: ["چلو"], explain: "چِلُو, *chelo*." },
          { prompt: "The menu says قیمَت‌ها به هِزار تُومان and ۹۰ beside the salad. How many tomans is it? Type the number in digits.", lang: "en", answers: ["90000", "90,000", "90 000"], explain: "90,000 tomans: the prices are in thousands." },
          { prompt: "Spoken: *one kebab with rice, please* (three words).", lang: "fa", answers: ["یه چلوکباب لطفا"], explain: "یه چِلُوکَباب، لُطْفاً." },
          { prompt: "Type the name of the yoghurt drink on the menu.", lang: "fa", answers: ["دوغ"], explain: "دوغ, *dugh*." },
        ],
      },
    ],
  },
  {
    slug: "chat",
    title: "Chat messages: کُجایی؟",
    summary: "Reading a chat: the spoken language typed without marks, where رو may be on or را, and اومَدَم means I'm coming.",
    register: "both",
    kinds: ["reading", "spoken"],
    source: SOURCE,
    vocab: [
      { fa: "دَقیقه", en: "minute", topic: "time" },
      { fa: "دیگه", written: "دیگَر", en: "other; more; (after a time) from now", topic: "time" },
      { fa: "مُنْتَظِر", en: "waiting", topic: "everyday" },
      { fa: "جِلُو", en: "in front, front", topic: "places" },
      { fa: "بِلیت", en: "ticket", topic: "everyday" },
    ],
    blocks: [
      {
        type: "idea",
        text: "A chat is the **spoken** language typed without marks (lesson 12.6). Reading one, you meet the spoken forms with no help: رو may be *ru* (on) or *ro* (را), and اومَدَم can mean *I'm coming*.",
      },
      {
        type: "text",
        text: "Read each message aloud as it is said: [میرسم|miresam] is می‌رِسَم, *miresam*; [بلیتا|belitâ] is the plural *belitâ*. Some words look alike without marks, and the sentence decides: in [بلیتا رو گرفتم|belitâ ro gereftam], رو follows the thing taken, so it is *ro*, the spoken را. دَهْ دَقیقه دیگه is *ten minutes from now*. And اومَدَم, *I came*, is what people text when they set off: *coming!*",
      },
      {
        type: "reading",
        style: "chat",
        title: "Meeting at the cinema",
        lines: [
          { who: "Sara", fa: "سَلام! کُجایی؟", en: "Hi! Where are you?" },
          { mine: true, fa: "سَلام، تو راهَم. دَهْ دَقیقه دیگه می‌رِسَم.", en: "Hi, I'm on my way. I'll be there in ten minutes." },
          { who: "Sara", fa: "باشه. مَن جِلُویِ سینِما مُنْتَظِرَم.", en: "OK. I'm waiting in front of the cinema." },
          { mine: true, fa: "اومَدَم!", en: "Coming!" },
          { who: "Sara", fa: "بِلیتا رُو گِرِفْتَم.", en: "I've got the tickets." },
          { mine: true, fa: "مِرْسی!", en: "Thanks!" },
        ],
      },
      { type: "heading", text: "Core examples" },
      {
        type: "examples",
        items: [
          { fa: "دَهْ دَقیقه {دیگه} می‌رِسَم.", written: "دَهْ دَقیقهٔ {دیگَر} می‌رِسَم.", en: "I'll be there in ten minutes." },
          { fa: "جِلُویِ سینِما {مُنْتَظِرَم}.", written: "جِلُویِ سینِما {مُنْتَظِر هَسْتَم}.", en: "I'm waiting in front of the cinema." },
          { fa: "{اومَدَم}!", written: "{آمَدَم}!", en: "Coming! (I'm on my way)" },
        ],
      },
      { type: "heading", text: "Contrast pair" },
      {
        type: "pair",
        title: "Coming, or came",
        a: { fa: "{اومَدَم}!", written: "{آمَدَم}!", en: "Coming! (I'm on my way)" },
        b: { fa: "دیروز {اومَدَم}.", written: "دیروز {آمَدَم}.", en: "I came yesterday." },
        diff: "The same simple past. Alone, as a reply, it says the speaker is already on the way; with دیروز it is the plain past.",
      },
      { type: "heading", text: "Common mistake" },
      {
        type: "callout",
        kind: "mistake",
        title: "رو: *on*, or را",
        text: "Without marks, رو is both *ru*, *on* (رو میز, lesson 9.2), and *ro*, the spoken را (lesson 6.7). After the object of a verb, it is *ro*; before a place, it is *ru*. In [بلیتا رو گرفتم|belitâ ro gereftam] there is no place: it is *ro*.",
      },
      {
        type: "callout",
        kind: "culture",
        title: "Chat without marks",
        text: "Nobody types vowel marks in a chat, and most messages use the spoken forms. Some people type Persian in Latin letters (Finglish, lesson 12.6). Foreign words are common: مِرْسی (from French) is everyday speech, and chats add English ones such as *OK*.",
      },
      {
        type: "quiz",
        questions: [
          { prompt: "In [بلیتا رو گرفتم|belitâ ro gereftam], is رو *ru* or *ro*? Type its transliteration.", lang: "translit", answers: ["ro"], explain: "*ro*: the spoken را after the thing taken." },
          { prompt: "A friend texts [اومدم|umadam]! What do they mean? Type it in English.", lang: "en", answers: ["coming", "i'm coming", "on my way", "i am coming", "i'm on my way", "i am on my way", "on the way"], explain: "*Coming!*: they are setting off." },
          { prompt: "Type the written form of دیگه, as in دَهْ دَقیقه دیگه.", lang: "fa", answers: ["دیگر"], explain: "دیگَر, *digar*." },
          { prompt: "Translate: مَن جِلُویِ سینِما مُنْتَظِرَم.", lang: "en", answers: ["i'm waiting in front of the cinema", "i am waiting in front of the cinema", "i'm waiting outside the cinema", "i am waiting outside the cinema"], explain: "*man jelo-ye sinemâ montazeram*." },
        ],
      },
    ],
  },
  {
    slug: "headline",
    title: "A news headline: مَدارِس تَعْطیل اَسْت",
    summary: "Headlines use the written language at its most compressed: no verb, or one at the end; Arabic plurals such as مَدارِس; a colon to name the source.",
    register: "both",
    kinds: ["reading"],
    source: SOURCE,
    vocab: [
      { fa: "شَدید", en: "severe, heavy", topic: "everyday" },
      { fa: "مَدارِس", en: "schools (written plural of مَدْرِسه)", topic: "learning" },
      { fa: "تَعْطیل", en: "closed; a holiday", topic: "time" },
      { fa: "هَواشِناسی", en: "weather forecasting; the met office", topic: "nature" },
      { fa: "بارِش", en: "rainfall, precipitation", topic: "nature" },
      { fa: "پایان", en: "end", topic: "time" },
      { fa: "اِدامه", en: "continuation", topic: "everyday" },
    ],
    blocks: [
      {
        type: "idea",
        text: "A headline packs the **written** language tight: the verb is often left out, or is just اَسْت, the words are formal (مَدارِس for مَدْرِسه‌ها), and a **colon** names who said it.",
      },
      {
        type: "text",
        text: "Read a headline as two parts. The first often has no verb at all: بارانِ شَدید دَر تِهْران, *heavy rain in Tehran*. A semicolon (؛) joins a second statement. Formal writing uses some Arabic plurals: مَدارِس for مَدْرِسه‌ها, *schools*. A name followed by a colon is the source: هَواشِناسی: …, *the met office says…*. News is read aloud in this same written language (lesson 12.1), so a radio bulletin sounds like the headline. This headline is made up for the course.",
      },
      {
        type: "reading",
        style: "headline",
        title: "A front page",
        lines: [
          { fa: "بارانِ شَدید دَر تِهْران؛ مَدارِس فَرْدا تَعْطیل اَسْت", en: "Heavy rain in Tehran; schools closed tomorrow" },
          { fa: "هَواشِناسی: بارِش تا پایانِ هَفْته اِدامه دارَد", en: "Met office: the rain will continue until the end of the week" },
        ],
      },
      { type: "heading", text: "Core examples" },
      {
        type: "examples",
        items: [
          { fa: "مَدْرِسه‌ها فَرْدا {تَعْطیلَن}.", written: "مَدارِس فَرْدا {تَعْطیل اَسْت}.", en: "Schools are closed tomorrow." },
          { fa: "بارون تا آخَرِ هَفْته {اِدامه داره}.", written: "بارِش تا پایانِ هَفْته {اِدامه دارَد}.", en: "The rain will go on until the end of the week." },
        ],
      },
      { type: "heading", text: "Contrast pair" },
      {
        type: "pair",
        title: "A headline, or a sentence",
        a: { fa: "بارانِ شَدید دَر تِهْران", en: "Heavy rain in Tehran (a headline)" },
        b: { fa: "دَر تِهْران بارانِ شَدیدی {می‌بارَد}.", en: "Heavy rain is falling in Tehran." },
        diff: "The headline is a noun phrase with no verb. The full sentence adds one (باریدَن, *to rain*) and the indefinite ـی.",
      },
      { type: "heading", text: "Common mistake" },
      {
        type: "callout",
        kind: "mistake",
        title: "Looking for the verb",
        text: "Many headlines have no verb, or only اَسْت at the end. Don't hunt for one: read the noun phrases and supply *is* or *there is*. And a plural like مَدارِس has no ـها: it is an Arabic plural, used in formal writing.",
      },
      {
        type: "callout",
        kind: "culture",
        title: "Two Persians in the news",
        text: "The news is written and read in the written register; interviews and street reports within it are in the spoken one. Hearing both in one bulletin is normal.",
      },
      {
        type: "quiz",
        questions: [
          { prompt: "Type the everyday plural of مَدْرِسه that مَدارِس stands for.", lang: "fa", answers: ["مدرسه‌ها"], explain: "مَدْرِسه‌ها: مَدارِس is the Arabic plural, used in formal writing." },
          { prompt: "In هَواشِناسی: بارِش تا پایانِ هَفْته اِدامه دارَد, what does the colon tell you? Type source or time.", lang: "en", answers: ["source"], explain: "The source: the met office says so." },
          { prompt: "Translate the headline: بارانِ شَدید دَر تِهْران.", lang: "en", answers: ["heavy rain in tehran", "severe rain in tehran", "heavy rains in tehran", "heavy rainfall in tehran"], explain: "*bârân-e shadid dar tehrân*: a noun phrase, no verb." },
          { prompt: "Spoken: *schools are closed tomorrow* (three words).", lang: "fa", answers: ["مدرسه‌ها فردا تعطیلن", "مدرسه‌ها فردا تعطیله"], explain: "مَدْرِسه‌ها فَرْدا تَعْطیلَن; speech often gives a plural thing the singular verb too: تَعْطیله." },
        ],
      },
    ],
  },
  {
    slug: "story",
    title: "A short story: شَبِ یَلْدا",
    summary: "A story written for the course, in the written past: one Yalda night, a power cut, a candle and a book of Hafez.",
    register: "written",
    kinds: ["reading", "culture"],
    source: SOURCE,
    vocab: [
      { fa: "خانِواده", en: "family", topic: "people" },
      { fa: "جَمْع شُدَن", en: "to gather", topic: "verbs" },
      { fa: "نوشیدَن", en: "to drink (written)", topic: "verbs" },
      { fa: "ناگَهان", en: "suddenly", topic: "time" },
      { fa: "بَرْق", en: "electricity; lightning", topic: "home" },
      { fa: "ساکِت", en: "quiet, silent", topic: "everyday" },
      { fa: "شَمْع", en: "candle", topic: "home" },
      { fa: "رُوشَن کَرْدَن", en: "to light, to switch on", topic: "verbs" },
      { fa: "دیوان", en: "a poet's collected poems", topic: "learning" },
      { fa: "فال", en: "omen, fortune", topic: "everyday" },
      { fa: "لَبْخَنْد", en: "smile", topic: "people" },
      { fa: "دَقیق", en: "exact, precise; exactly", topic: "everyday" },
      { fa: "کَسی", en: "someone; (with a negative verb) no one", topic: "people" },
    ],
    blocks: [
      {
        type: "idea",
        text: "Stories are told in the **written past**: the simple past for what happened, the past continuous for what was going on, and the past perfect for what had already happened.",
      },
      {
        type: "text",
        text: "Read the story through once without help, tapping the words you don't know, then show the lines you were unsure of. Watch the tenses: جَمْع شُده بودَنْد, *had gathered* (lesson 11.1); بازی می‌کَرْدَنْد, *were playing* (lesson 7.4); and the simple past for each event. The written verbs have their full endings (ـَنْد), and نوشیدَن is a more literary word for *to drink*; speech, and much writing, says خُورْدَن.",
      },
      {
        type: "reading",
        style: "story",
        title: "Yalda night",
        lines: [
          { fa: "شَبِ یَلْدا بود.", en: "It was Yalda night." },
          { fa: "هَمهٔ خانِواده دَر خانهٔ مادَرْبُزُرْگ جَمْع شُده بودَنْد.", en: "The whole family had gathered at Grandmother's house." },
          { fa: "رویِ میز اَنار وَ هِنْدِوانه بود.", en: "There were pomegranates and watermelon on the table." },
          { fa: "بَچّه‌ها بازی می‌کَرْدَنْد وَ بُزُرْگ‌تَرْها چای می‌نوشیدَنْد.", en: "The children were playing and the grown-ups were drinking tea." },
          { fa: "ناگَهان بَرْق رَفْت.", en: "Suddenly the power went out.", para: true },
          { fa: "هَمه ساکِت شُدَنْد.", en: "Everyone went quiet." },
          { fa: "مادَرْبُزُرْگ شَمْعی رُوشَن کَرْد وَ دیوانِ حافِظ را آوَرْد.", en: "Grandmother lit a candle and brought the Divan of Hafez." },
          { fa: "گُفْت: «اِمْشَب طولانی‌تَرین شَبِ سال اَسْت. بیایید فال بِگیریم.»", en: "She said, “Tonight is the longest night of the year. Let's take a fortune from Hafez.”" },
          { fa: "کِتاب را باز کَرْد وَ شِعْری خوانْد.", en: "She opened the book and read a poem.", para: true },
          { fa: "کَسی مَعْنیِ آن را دَقیق نِمی‌دانِسْت، اَمّا هَمه لَبْخَنْد زَدَنْد.", en: "Nobody knew exactly what it meant, but everyone smiled." },
        ],
      },
      { type: "heading", text: "Core examples" },
      {
        type: "examples",
        items: [
          { fa: "هَمهٔ خانِواده {جَمْع شُده بودَنْد}.", en: "The whole family had gathered." },
          { fa: "بَچّه‌ها {بازی می‌کَرْدَنْد}.", en: "The children were playing." },
          { fa: "ناگَهان {بَرْق رَفْت}.", en: "Suddenly the power went out." },
        ],
      },
      { type: "heading", text: "Contrast pair" },
      {
        type: "pair",
        title: "The power went, or Ali went",
        a: { fa: "ناگَهان {بَرْق} رَفْت.", en: "Suddenly the power went out." },
        b: { fa: "ناگَهان {عَلی} رَفْت.", en: "Suddenly Ali left." },
        diff: "رَفْتَن, *to go*, also says that something stopped working: بَرْق رَفْت, *the electricity went*, is a power cut.",
      },
      { type: "heading", text: "Common mistake" },
      {
        type: "callout",
        kind: "mistake",
        title: "Reading the past continuous as the present",
        text: "Without marks, [می‌نوشیدند|minushidand] and [می‌نوشند|minushand] look alike at a glance. The past stem ([نوشید|nushid]) makes it past: *were drinking*. Check the stem before the ending.",
      },
      {
        type: "callout",
        kind: "culture",
        title: "A fortune from Hafez",
        text: "فالِ حافِظ: the reader makes a wish, opens the Divan at random and reads the poem there as the answer. It is part of many families' Yalda night, and the story's ending is the usual one: the poem fits, more or less.",
      },
      {
        type: "quiz",
        questions: [
          { prompt: "Translate: ناگَهان بَرْق رَفْت.", lang: "en", answers: ["suddenly the power went out", "suddenly the power went off", "suddenly there was a power cut", "the power suddenly went out", "suddenly the electricity went out", "suddenly the lights went out", "suddenly the power was cut", "suddenly the power went"], explain: "*nâgahân barq raft*: بَرْق رَفْت is a power cut." },
          { prompt: "What tense is جَمْع شُده بودَنْد? Type past perfect, simple past or present perfect.", lang: "en", answers: ["past perfect"], explain: "The past perfect: the participle شُده with بودَنْد, *had gathered*." },
          { prompt: "Type the literary verb the story uses for *to drink* (the infinitive).", lang: "fa", answers: ["نوشیدن"], explain: "نوشیدَن, the more literary word; speech and much writing say خُورْدَن." },
          { prompt: "What did Grandmother bring? Type it in English.", lang: "en", answers: ["the divan of hafez", "hafez's divan", "a book of hafez", "hafez", "the divan", "a book of poems", "hafez's poems"], explain: "دیوانِ حافِظ, the collected poems of Hafez." },
        ],
      },
    ],
  },
  {
    slug: "hafez",
    title: "One line of Hafez",
    summary: "A line from a ghazal of Hafez, with a literal translation: why classical verse is hard (ezafes no one writes, old word order, a word that means more than it says).",
    register: "written",
    kinds: ["reading", "culture"],
    source:
      "Hafez, Divan, ed. Mohammad Qazvini and Qasem Ghani (Tehran, 1320/1941), ghazal 4, beginning «صبا به لطف بگو آن غزال رعنا را»; Thackston, An Introduction to Persian, on classical usage; Dehkhoda and Sokhan for the readings.",
    vocab: [
      { fa: "صَبا", en: "the morning breeze (in poetry)", topic: "nature" },
      { fa: "لُطْف", en: "kindness, gentleness", topic: "everyday" },
      { fa: "غَزال", en: "gazelle", topic: "nature" },
      { fa: "رَعْنا", en: "graceful, lovely (in poetry)", topic: "everyday" },
      { fa: "بیابان", en: "desert, wilderness", topic: "nature" },
      { fa: "حافِظ", en: "Hafez (the poet)", topic: "learning" },
    ],
    blocks: [
      {
        type: "idea",
        text: "Classical verse uses the same alphabet and much of the same grammar, but it is harder to read: **ezafes no one writes**, an **older word order**, and words that mean more in poetry than they say.",
      },
      {
        type: "text",
        text: "Hafez (حافِظ, about 1315–1390) of Shiraz is among the most loved of the Persian poets; many Iranians know lines of his by heart. This is the first line (بِیْت, *beyt*) of one of his ghazals. A beyt has two half-lines (مِصْراع); here one sits above the other, while printed divans often set them side by side, the first on the right. Try it without marks first, then turn them on.",
      },
      {
        type: "reading",
        style: "poem",
        title: "Hafez, from a ghazal",
        lines: [
          { fa: "صَبا به لُطْف بِگو آن غَزالِ رَعْنا را", en: "Breeze, say gently to that graceful gazelle" },
          { fa: "که سَر به کوه وُ بیابان تُو داده‌ای ما را", en: "that it is you who have sent us to the mountains and the desert" },
        ],
        note: "Literally: *Breeze, with kindness say (to) that graceful gazelle / that head to mountain and desert you have given us.* The gazelle is the beloved; *to give someone's head to the mountains and the desert* is to drive them to wander, mad with love.",
      },
      {
        type: "heading",
        text: "Why it is hard",
      },
      {
        type: "examples",
        items: [
          { fa: "آن غَزالِ رَعْنا را", en: "that graceful gazelle (the object)", note: "The ezafe on غَزال is never written: read *ghazâl-e ra'nâ*." },
          { fa: "تُو داده‌ای ما را", en: "you have given us", note: "Prose puts ما را before the verb; the verse puts it after, for the rhyme: every beyt of this ghazal ends in *-â râ*, the rhyme *-â* and the repeated را." },
          { fa: "سَر به کوه وُ بیابان دادَن", en: "to send someone wandering (literally: to give the head to mountain and desert)", note: "An image, not a phrase anyone says today. The و is read *o*, as in speech." },
        ],
      },
      { type: "heading", text: "Contrast pair" },
      {
        type: "pair",
        title: "Prose order, or verse order",
        a: { fa: "تُو ما را سَر به کوه وُ بیابان داده‌ای.", en: "You have sent us to the mountains and the desert. (prose order)" },
        b: { fa: "سَر به کوه وُ بیابان تُو داده‌ای ما را", en: "the same, in Hafez's order" },
        diff: "Prose puts the subject first and the object with را before the verb. The verse moves both for its metre and rhyme, so the reader has to put the sentence back together.",
      },
      { type: "heading", text: "Common mistake" },
      {
        type: "callout",
        kind: "mistake",
        title: "Reading without the ezafe",
        text: "Without marks, nothing shows that [غزال|ghazâl] and [رعنا|ra'nâ] belong together. The adjective follows its noun with an ezafe, in verse as in prose.",
        wrong: { fa: "آن غَزال رَعْنا را", en: "(read *ghazâl ra'nâ*: the ezafe is missing)" },
        right: { fa: "آن غَزالِ رَعْنا را", en: "that graceful gazelle (*ghazâl-e ra'nâ*)" },
      },
      {
        type: "callout",
        kind: "culture",
        title: "Hafez at home",
        text: "Many Iranian homes keep a Divan of Hafez, and on Yalda night many families take a فال from it (lessons 13.6 and 14.5). His tomb in Shiraz, the حافِظیه, is a garden that people visit to read his poems.",
      },
      {
        type: "quiz",
        questions: [
          { prompt: "Who is addressed in the first half-line? Type it in English.", lang: "en", answers: ["the breeze", "breeze", "the morning breeze", "the wind", "sabâ", "saba"], explain: "صَبا, the morning breeze, the messenger of Persian poetry." },
          { prompt: "Type the transliteration of غَزالِ رَعْنا, with its ezafe.", lang: "translit", answers: ["ghazâl-e ra'nâ", "ghazâl e ra'nâ"], explain: "*ghazâl-e ra'nâ*: the ezafe is read, not written." },
          { prompt: "In prose, does ما را come before or after the verb? Type before or after.", lang: "en", answers: ["before"], explain: "Before: تُو ما را … داده‌ای. Hafez moves it after for the rhyme." },
          { prompt: "In which city is Hafez's tomb? Type it in English.", lang: "en", answers: ["shiraz"], explain: "Shiraz, شیراز: the حافِظیه." },
        ],
      },
    ],
  },
];
