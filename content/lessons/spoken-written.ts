import type { Block, Lesson } from "../types";
import { VERBS, verbById } from "../verbs";
import { PERSONS, conjugate, table, type Person, type Style, type Tense } from "@/lib/conjugate";

// Unit 12, spoken and written: the changes earlier units taught one at a
// time, gathered into rules a learner can apply to any sentence. Spoken
// Tehrani first, written beneath. Most example and dialogue lines are taken
// unchanged from earlier units (reviewed there), so the cloze and spoken ↔
// written decks join their existing cards; the lesson they come from is noted
// beside each one. Conjugations come from lib/conjugate.ts.

const SOURCE =
  "Stilo, Talattof and Clinton, Modern Persian: Spoken and Written, on the Tehrani forms and how they differ from the written ones; Mahootian, Persian (Routledge Descriptive Grammars), on colloquial Persian; Lazard, A Grammar of Contemporary Persian; the Academy of Persian Language and Literature's دستورِ خَطِّ فارسی for written spelling.";

const forms = (id: string, tense: Tense, style: Style) => table(verbById.get(id)!, tense, style, false, VERBS);
const one = (id: string, tense: Tense, style: Style, person: Person = "1s") =>
  conjugate(verbById.get(id)!, { tense, person, style, negative: false }, VERBS);

const WHO: Record<Person, string> = {
  "1s": "I",
  "2s": "you (تُو)",
  "3s": "he, she",
  "1p": "we",
  "2p": "you (شُما)",
  "3p": "they",
};

/** The end of every lesson: the drill that practises this unit. */
const DRILL: Block = {
  type: "link",
  href: "/practice/convert",
  label: "Practise in the spoken ↔ written drill",
  text: "which asks the lines of the lessons you have done, in either direction.",
};

export const spokenWritten: Lesson[] = [
  {
    slug: "two-registers",
    title: "Two ways of saying it: گُفْتاری and نِوِشْتاری",
    summary: "Iranians speak one Persian and write another. Chat, films and talk use the spoken one; signs, news, forms and books use the written one.",
    register: "both",
    kinds: ["spoken"],
    source: SOURCE,
    vocab: [
      { fa: "گُفْتاری", en: "spoken, colloquial (language)", topic: "learning" },
      { fa: "نِوِشْتاری", en: "written (language)", topic: "learning" },
      { fa: "رَسْمی", en: "formal; official", topic: "learning" },
      { fa: "اَخْبار", en: "the news", topic: "everyday" },
    ],
    blocks: [
      {
        type: "idea",
        text: "Persian has two **registers**: the spoken language (زَبانِ گُفْتاری) and the written one (زَبانِ نِوِشْتاری). Most Iranians use both every day, and they differ in sounds, endings, a few words and word order.",
      },
      {
        type: "text",
        text: "The **spoken** register is what people say: at home, in shops, in films, and in many pop songs (others mix in written forms). It is also what they type to each other in chat messages and on social media. This course teaches the Tehrani form of it, which is the one heard most on television and understood everywhere in Iran. The **written** register, also called رَسْمی (*rasmi*, formal), is what is printed and read out: street signs, newspapers and the news (اَخْبار) on radio and television, forms, letters, textbooks and most books. A newsreader reads the written language aloud, so a broadcast sounds like a text. Poetry, and songs set to classical poems, use the written language too, often in an older form. Many settings fall in between: a lecture, a work email or a speech mixes the two. Iranians often call the spoken language مُحاوِره‌ای (*mohâvere-i*, conversational), and speech that sounds written کِتابی (*ketâbi*, bookish).",
      },
      {
        type: "text",
        text: "Earlier units showed each change where it came up. This unit gathers them into rules: sounds (12.2), *is* and the verb endings (12.3), the short verb stems (12.4), the words and word order that differ (12.5), and how Iranians type the spoken language (12.6). Almost every line in this unit comes from an earlier lesson; the lesson is named where it helps.",
      },
      { type: "heading", text: "Core examples" },
      {
        type: "examples",
        items: [
          // 0.3
          { fa: "{می‌خوام} {بِرَم} {خونه}.", written: "{می‌خواهَم} به {خانه} {بِرَوَم}.", en: "I want to go home." },
          // 0.3
          { fa: "{اِسْمِت} {چیه}؟", written: "{اِسْمَت} {چیسْت}؟", en: "What's your name? (to a friend)" },
          // 4.1
          { fa: "اونا فارْسی {حَرْف می‌زَنَن}.", written: "آن‌ها فارْسی {حَرْف می‌زَنَنْد}.", en: "They speak Persian." },
          // 5.3
          { fa: "یه قَهْوه {می‌خوام}.", written: "یِک قَهْوه {می‌خواهَم}.", en: "I'd like a coffee." },
        ],
      },
      { type: "heading", text: "Contrast pair" },
      {
        type: "pair",
        title: "A sound, or the sentence",
        // 0.2, and 5.2
        a: { fa: "نون {خَریدَم}.", written: "نان {خَریدَم}.", en: "I bought bread." },
        b: { fa: "هَفْتهٔ بَعْد {می‌ریم} شیراز.", written: "هَفْتهٔ بَعْد به شیراز {می‌رَویم}.", en: "We're going to Shiraz next week." },
        diff: "In A only one word's sound changes (*nân* → *nun*). In B the verb is shorter, and speech puts the destination after the verb and drops its به. The changes come in these two kinds: sounds and endings (12.2–12.4), and words and order (12.5).",
      },
      { type: "heading", text: "Common mistake" },
      {
        type: "callout",
        kind: "mistake",
        title: "Speaking the written language",
        text: "Learners who start from books often speak the written forms. Everyone understands them, but to a friend they sound کِتابی, bookish, like a news bulletin. Say the spoken forms; keep the written ones for writing.",
        wrong: { fa: "{می‌خواهَم} به {خانه} {بِرَوَم}.", en: "(said to a friend: it sounds read aloud)" },
        right: { fa: "{می‌خوام} {بِرَم} {خونه}.", written: "{می‌خواهَم} به {خانه} {بِرَوَم}.", en: "I want to go home." },
      },
      { type: "heading", text: "In real conversation" },
      {
        type: "dialogue",
        title: "Plans for tonight",
        lines: [
          // 0.3
          { who: "Sara", fa: "سَلام! چِطُوری؟", written: "سَلام! حالِ تُو چِطُور اَسْت؟", en: "Hi! How are you?" },
          { who: "Reza", fa: "خوبَم، {مِرْسی}. تُو چِطُوری؟", written: "خوبَم، {مُتَشَکِّرَم}. حالِ تُو چِطُور اَسْت؟", en: "I'm fine, thanks. How are you?" },
          // 5.2
          {
            who: "Sara",
            fa: "مَن وُ مینا اِمْشَب {می‌ریم} سینِما. {میای}؟",
            written: "مَن وَ مینا اِمْشَب به سینِما {می‌رَویم}. {می‌آیی}؟",
            en: "Mina and I are going to the cinema tonight. Are you coming?",
          },
          // 4.3
          { who: "Reza", fa: "نَه، {نِمی‌تونَم}. کار دارَم.", written: "نَه، {نِمی‌تَوانَم}. کار دارَم.", en: "No, I can't. I've got things to do." },
        ],
        note: "Nobody would say or text the written lines: they show the same conversation as a story or a letter would put it.",
      },
      {
        type: "quiz",
        questions: [
          { prompt: "Which register does a news broadcast use? Type spoken or written.", lang: "en", answers: ["written"], explain: "The written one: a newsreader reads a written text aloud." },
          { prompt: "Which register do Iranians usually use in chat messages to friends? Type spoken or written.", lang: "en", answers: ["spoken"], explain: "The spoken one, typed as it is said: می‌خوام, خونه." },
          { prompt: "Type the written form of می‌خوام (I want).", lang: "fa", answers: ["می‌خواهم"], explain: "می‌خواهَم, *mikhâham*." },
          { prompt: "Type the spoken form of خانه (home).", lang: "fa", answers: ["خونه"], explain: "خونه, *khune*: the sound change of lesson 12.2." },
        ],
      },
      DRILL,
    ],
  },
  {
    slug: "sound-changes",
    title: "Sound changes: نان → نون",
    summary: "Speech wears some sounds down: ân often becomes un, the plural ـها loses its h after a consonant, “and” is o, and یِک is یه. They are tendencies of everyday words, not rules for every word.",
    register: "both",
    kinds: ["spoken", "pronunciation"],
    source: SOURCE,
    blocks: [
      {
        type: "idea",
        text: "Speech changes a few sounds in regular ways: *ân* often becomes *un* (نان → نون), the plural ـها loses its *h* after a consonant (کِتابا), *and* is said *o*, and یِک is یه. Each is a tendency of common words: which words change has to be learned word by word.",
      },
      {
        type: "text",
        text: "**ân → un.** Before *n*, and in a few words before *m*, a long *â* is said *u* in many everyday words: نان → نون, خانه → خونه, تِهْران → تِهْرون, خیابان → خیابون, کُدام → کُدوم, تَمام → تَموم; also in verb stems: دان → دون, خوان → خون (lesson 12.4), and آمَد → اومَد. Many words keep *ân*: ایران, دانِشْگاه, دانِشْجو, اِنْسان (*human being*), and most loanwords and learned words. In some words both are heard: اِمْتِحان is often اِمْتِحون in speech. Writing always keeps the ا; نون and خونه are written only where people type as they talk.",
      },
      {
        type: "text",
        text: "**The plural.** After a consonant, ـها is said ـا: کِتابا, روزا, اُسْتادا (lesson 6.4). After a vowel it usually keeps its *h*: بَچّه‌ها, دانِشْجوها. **And.** وَ (*va*) is usually *o* between two words: نون، پَنیر وُ سَبْزی. **A, one.** یِک is یه (*ye*) before a noun (lesson 6.5). **Endings.** After a consonant, the possessive *your* and *his, her* are *-et* and *-esh* in speech, *-at* and *-ash* in writing: کیفِت, کیفَت (lesson 4.5).",
      },
      {
        type: "table",
        caption: "The regular sound changes",
        headers: ["Written", "Spoken", "What changes"],
        rows: [
          ["نان، خانه، تِهْران", "نون، خونه، تِهْرون", "*ân* → *un*"],
          ["کُدام، تَمام، آمَد", "کُدوم، تَموم، اومَد", "*âm* → *um*"],
          ["کِتاب‌ها، روزْها", "کِتابا، روزا", "*-hâ* → *-â*"],
          ["نان وَ پَنیر", "نون وُ پَنیر", "*va* → *o*"],
          ["یِک کِتاب", "یه کِتاب", "*yek* → *ye*"],
          ["کیفَت، کیفَش", "کیفِت، کیفِش", "*-at* → *-et*"],
          ["ایران، دانِشْگاه", "ایران، دانِشْگاه", "none"],
        ],
      },
      { type: "heading", text: "Core examples" },
      {
        type: "examples",
        items: [
          // 0.3
          { fa: "{نون} نَداریم.", written: "{نان} نَداریم.", en: "We don't have any bread." },
          // 0.2
          { fa: "بَرادَرَم تو {تِهْرونه}.", written: "بَرادَرَم دَر {تِهْران} اَسْت.", en: "My brother is in Tehran." },
          // 9.6
          { fa: "یه کَم {آروم‌تَر} حَرْف بِزَن، لُطْفاً.", written: "کَمی {آرام‌تَر} حَرْف بِزَن، لُطْفاً.", en: "Speak a little more slowly, please." },
          // 6.4
          { fa: "{کِتابا} رُو خَریدَم.", written: "{کِتاب‌ها} را خَریدَم.", en: "I bought the books." },
          // 3.7
          { fa: "نون، پَنیر وُ سَبْزی خَریدَم.", written: "نان، پَنیر وَ سَبْزی خَریدَم.", en: "I bought bread, cheese and herbs." },
        ],
      },
      { type: "heading", text: "Contrast pair" },
      {
        type: "pair",
        title: "A word that changes, and one that doesn't",
        // 0.2, and 9.1
        a: { fa: "بَرادَرَم تو {تِهْرونه}.", written: "بَرادَرَم دَر {تِهْران} اَسْت.", en: "My brother is in Tehran." },
        b: { fa: "می‌رَم ایران.", written: "{به} ایران می‌رَوَم.", en: "I'm going to Iran." },
        diff: "تِهْران is said تِهْرون; ایران keeps its *ân* in speech. Nothing in the spelling tells you which: learn the spoken form with each word.",
      },
      { type: "heading", text: "Common mistake" },
      {
        type: "callout",
        kind: "mistake",
        title: "Changing every *ân*",
        text: "The change belongs to particular words. Learned words such as دانِشْگاه and دانِشْجو keep their *ân* in speech.",
        wrong: { fa: "می‌رَم {دونِشْگاه}.", en: "(meant: I'm going to the university)" },
        right: { fa: "می‌رَم {دانِشْگاه}.", written: "به {دانِشْگاه} می‌رَوَم.", en: "I'm going to the university." },
      },
      { type: "heading", text: "In real conversation" },
      {
        type: "dialogue",
        title: "Which flat?",
        // 9.6
        lines: [
          { who: "Arash", fa: "کُدوم آپارْتِمان {بِهْتَره}؟", written: "کُدام آپارْتِمان {بِهْتَر اَسْت}؟", en: "Which flat is better?" },
          {
            who: "Leila",
            fa: "اَوَّلی {بُزُرْگ‌تَره}، وَلی دُوُّمی {اَرْزون‌تَره}.",
            written: "اَوَّلی {بُزُرْگ‌تَر اَسْت}، وَلی دُوُّمی {اَرْزان‌تَر اَسْت}.",
            en: "The first one is bigger, but the second is cheaper.",
          },
          { who: "Arash", fa: "کُدوم به مِتْرُو {نَزْدیک‌تَره}؟", written: "کُدام به مِتْرُو {نَزْدیک‌تَر اَسْت}؟", en: "Which is closer to the metro?" },
        ],
        note: "کُدوم and اَرْزون have the *um* and *un* of speech. آپارْتِمان, a loanword, keeps its *ân* in this line; some speakers say it with *un*.",
      },
      {
        type: "quiz",
        questions: [
          { prompt: "Type the spoken form of نان (bread).", lang: "fa", answers: ["نون"], explain: "نون, *nun*: *ân* → *un*." },
          { prompt: "Type the spoken form of کُدام (which).", lang: "fa", answers: ["کدوم"], explain: "کُدوم, *kodum*: *âm* → *um*." },
          { prompt: "Type the spoken plural of کِتاب (book).", lang: "fa", answers: ["کتابا"], explain: "کِتابا, *ketâbâ*: after a consonant ـها is said ـا." },
          { prompt: "Type the spoken form of یِک کِتاب (a book).", lang: "fa", answers: ["یه کتاب"], explain: "یه کِتاب, *ye ketâb*." },
          { prompt: "How is وَ (and) usually said between two words? Type the transliteration.", lang: "translit", answers: ["o"], explain: "*o*: نون، پَنیر وُ سَبْزی, *nun, panir o sabzi*." },
        ],
      },
      DRILL,
    ],
  },
  {
    slug: "endings",
    title: "Is and the verb endings: اَسْت → ـه",
    summary: "After a consonant, written اَسْت is the ending ـه in speech, and three verb endings change: ـَد → ـه, ـید → ـین, ـَنْد → ـَن.",
    register: "both",
    kinds: ["spoken", "verbs"],
    source: SOURCE,
    blocks: [
      {
        type: "idea",
        text: "After a consonant, written **اَسْت** (*is*) is the ending **ـه** in speech, and three verb endings change: *he/she* **ـَد → ـه**, plural *you* **ـید → ـین**, *they* **ـَنْد → ـَن**. The other endings are the same in both.",
      },
      {
        type: "text",
        text: "*Is* (lesson 4.2): after a consonant, speech says ـه where writing has اَسْت: خوبه, خوب اَسْت. After ا it matches writing (کُجاسْت, often said *kojâs*), and after ی it is *-ye* (آفْتابیه). After a silent ه or و, speech keeps it close to the written اَسْت, usually as *-s*. The full verb هَسْتید and هَسْتَنْد shrink the same way: کُجا هَسْتید؟ is کُجایین؟. Verbs (lessons 4.1 and 5.2): the endings ـَم, ـی, ـیم are shared; *he/she* ـَد becomes ـه (می‌خُورَد → می‌خُوره); plural *you* ـید becomes ـین in every tense and in commands (دارید → دارین, بِرَوید → بِرین); and *they* drops its *d* (می‌خَرَنْد → می‌خَرَن). The simple past has no *he/she* ending, so there is nothing to change: خَرید is both. In the present perfect speech drops اَسْت too: رَفْته اَسْت is رَفْته.",
      },
      {
        type: "table",
        caption: "خَریدَن (to buy) in the present",
        headers: ["Who", "Spoken", "Written"],
        rows: PERSONS.map((p, i) => [WHO[p], forms("kharidan", "present", "spoken")[i], forms("kharidan", "present", "written")[i]]),
      },
      {
        type: "table",
        caption: "خَریدَن in the simple past",
        headers: ["Who", "Spoken", "Written"],
        rows: PERSONS.map((p, i) => [WHO[p], forms("kharidan", "past", "spoken")[i], forms("kharidan", "past", "written")[i]]),
      },
      {
        type: "table",
        caption: "*Is* and *are*",
        headers: ["", "Spoken", "Written"],
        rows: [
          ["after a consonant", "خوبه", "خوب اَسْت"],
          ["after ا", "کُجاسْت", "کُجاسْت"],
          ["after ی", "آفْتابیه", "آفْتابی اَسْت"],
          ["you are (شُما)", "کُجایین", "کُجا هَسْتید"],
          ["they are", "خُوشْحالَن", "خُوشْحالَنْد"],
        ],
      },
      { type: "heading", text: "Core examples" },
      {
        type: "examples",
        items: [
          // 9.6
          { fa: "این {اَرْزون‌تَره}.", written: "این {اَرْزان‌تَر اَسْت}.", en: "This one is cheaper." },
          // 5.5
          { fa: "فَرْدا کِلاس {دارین}؟", written: "فَرْدا کِلاس {دارید}؟", en: "Do you have class tomorrow?" },
          // 4.2
          { fa: "بَچّه‌ها {خُوشْحالَن}.", written: "بَچّه‌ها {خُوشْحالَنْد}.", en: "The children are happy." },
          // 4.2
          { fa: "{کُجایین}؟", written: "{کُجا هَسْتید}؟", en: "Where are you?" },
          // 7.3
          { fa: "سارا {رَفْته}.", written: "سارا {رَفْته اَسْت}.", en: "Sara has gone. / Sara has left." },
        ],
      },
      { type: "heading", text: "Contrast pair" },
      {
        type: "pair",
        title: "One spoken ـه, two written forms",
        // 4.1, and 4.2
        a: { fa: "مَرْیَم قَهْوه {می‌خُوره}.", written: "مَرْیَم قَهْوه {می‌خُورَد}.", en: "Maryam drinks coffee." },
        b: { fa: "هَوا {سَرْده}.", written: "هَوا {سَرْد اَسْت}.", en: "It's cold (the weather is cold)." },
        diff: "Both end in spoken ـه. In A it is the verb ending ـَد; in B it is the word اَسْت. To write the line, ask whether the ـه is on a verb or on another word.",
      },
      { type: "heading", text: "Common mistake" },
      {
        type: "callout",
        kind: "mistake",
        title: "ـه after ا",
        text: "After ا, spoken *is* keeps the *s* of writing, and often its *t*: کُجاسْت, اینْجاسْت (often said *kojâs*, *injâs*). ـه goes after a consonant.",
        wrong: { fa: "کِلیدِ خونه {کُجاه}؟", en: "(meant: Where's the house key?)" },
        right: { fa: "کِلیدِ خونه {کُجاسْت}؟", written: "کِلیدِ خانه {کُجاسْت}؟", en: "Where's the house key?" },
      },
      { type: "heading", text: "In real conversation" },
      {
        type: "dialogue",
        title: "The weather",
        // 4.2
        lines: [
          { who: "Ali", fa: "هَوا {چِطُوره}؟", written: "هَوا {چِطُور اَسْت}؟", en: "How's the weather?" },
          { who: "Sima", fa: "یه کَم {سَرْده}، وَلی {آفْتابیه}.", written: "کَمی {سَرْد اَسْت}، وَلی {آفْتابی اَسْت}.", en: "It's a bit cold, but it's sunny." },
          { who: "Ali", fa: "پَس بیرون می‌ریم؟", written: "پَس بیرون می‌رَویم؟", en: "So are we going out?" },
          { who: "Sima", fa: "آره، بِریم!", written: "بَله، بِرَویم!", en: "Yes, let's go!" },
        ],
        note: "چِطُوره and سَرْده have the ـه after a consonant; آفْتابیه has *-ye* after ی. می‌ریم and بِریم also have the short stem of رَفْتَن (lesson 12.4).",
      },
      {
        type: "quiz",
        questions: [
          { prompt: "Type the spoken form of خوب اَسْت (it's good).", lang: "fa", answers: ["خوبه"], explain: "خوبه, *khube*: ـه after a consonant." },
          { prompt: "Type the spoken form of می‌خُورَد (she eats).", lang: "fa", answers: ["می‌خوره"], explain: "می‌خُوره, *mikhore*: ـَد → ـه." },
          { prompt: "Type the spoken form of دارید (you have, شُما).", lang: "fa", answers: ["دارین"], explain: "دارین, *dârin*: ـید → ـین." },
          { prompt: "Type the spoken form of خُوشْحالَنْد (they are happy).", lang: "fa", answers: ["خوشحالن"], explain: "خُوشْحالَن, *khoshhâlan*: *they* drops its *d*." },
          { prompt: "Type the written form of کُجایین؟ (where are you?), without the question mark.", lang: "fa", answers: ["کجا هستید", "کجایید"], explain: "کُجا هَسْتید: after a vowel, writing usually uses the full verb; کُجایید is also written." },
        ],
      },
      DRILL,
    ],
  },
  {
    slug: "short-stems",
    title: "The short spoken stems: می‌رَم, می‌گَم",
    summary: "Eleven common verbs change their present stem in speech ([رَو|rav] → ر, گو → گ, دان → دون…), and a few change their past stem, mostly by a sound change.",
    register: "both",
    kinds: ["spoken", "verbs"],
    source: SOURCE,
    blocks: [
      {
        type: "idea",
        text: "In speech, eleven common verbs **change their present stem**, most by shortening it: می‌رَوَم → می‌رَم, می‌گویَم → می‌گَم. The past stem changes in only a few, mostly by a sound change of lesson 12.2: آمَدَم → اومَدَم, دانِسْتَم → دونِسْتَم.",
      },
      {
        type: "text",
        text: "Lesson 5.3 met the first of them. The present stems fall into three groups. **Short stems:** [رَو|rav] → *r-* (می‌رَم), [شَو|shav] → *sh-* (می‌شَم), گو → *g-* (می‌گَم), دَهْ → *d-* (می‌دَم), خواه → *khâ-* (می‌خوام), گُذار → *zâr-* (می‌ذارَم), آوَر → *âr-* (میارَم). **ân → un:** دان → دون, خوان → خون, and تَوان → تون, which also loses its *av*. **آ runs into می:** می‌آیَم is میام. Every other verb in this course keeps its written stem: می‌کُنَم, می‌بینَم, می‌خَرَم are the same in both. A few more verbs, met later, change too. The past stem shortens in none of them: رَفْتَم, گُفْتَم, دادَم are both spoken and written. It changes in a few: by a sound change in اومَد, دونِسْت, تونِسْت, خونْد, and آوُرْد; after a prefix, گُذاشْت also drops its first syllable (نَذاشْتَم, می‌ذاشْتَم).",
      },
      {
        type: "table",
        caption: "The present: *I*",
        headers: ["Verb", "Spoken", "Written"],
        rows: ["raftan", "shodan", "goftan", "dâdan", "khâstan", "gozâshtan", "âvardan", "dânestan", "tavânestan", "khândan", "âmadan"].map((id) => [
          `${verbById.get(id)!.inf}, ${verbById.get(id)!.en}`,
          one(id, "present", "spoken"),
          one(id, "present", "written"),
        ]),
      },
      {
        type: "table",
        caption: "The past stems that change: *I*",
        headers: ["Verb", "Spoken", "Written"],
        rows: ["âmadan", "dânestan", "tavânestan", "khândan", "âvardan"].map((id) => [
          `${verbById.get(id)!.inf}, ${verbById.get(id)!.en}`,
          one(id, "past", "spoken"),
          one(id, "past", "written"),
        ]),
      },
      { type: "heading", text: "Core examples" },
      {
        type: "examples",
        items: [
          // 5.3
          { fa: "چی {می‌گی}؟", written: "چه {می‌گویی}؟", en: "What are you saying?" },
          // 5.3
          { fa: "آدْرِس رُو {می‌دونی}؟", written: "آدْرِس را {می‌دانی}؟", en: "Do you know the address?" },
          // 5.2
          { fa: "اَلان {می‌خونَم}.", written: "اَلان {می‌خوانَم}.", en: "I'm reading now." },
          // 7.4
          { fa: "{نِمی‌دونِسْتَم}.", written: "{نِمی‌دانِسْتَم}.", en: "I didn't know." },
          // 7.1
          { fa: "مَرْیَم کَی {اومَد}؟", written: "مَرْیَم کَی {آمَد}؟", en: "When did Maryam come?" },
        ],
      },
      { type: "heading", text: "Contrast pair" },
      {
        type: "pair",
        title: "The present shrinks; the past stays",
        // 5.1, and 7.1
        a: { fa: "{می‌رَم}.", written: "{می‌رَوَم}.", en: "I go. / I'm going." },
        b: { fa: "دیروز {رَفْتَم} بازار.", written: "دیروز به بازار {رَفْتَم}.", en: "I went to the bazaar yesterday." },
        diff: "The present stem [رَو|rav] shrinks to *r-* in speech. The past stem رَفْت is the same in both: only the word order differs.",
      },
      { type: "heading", text: "Common mistake" },
      {
        type: "callout",
        kind: "mistake",
        title: "A short stem with a written ending",
        text: "The short stems go with the spoken endings, the full stems with the written ones. Mixing them gives a form nobody uses.",
        wrong: { fa: "کُجا {می‌رَد}؟", en: "(meant: Where is he going?)" },
        right: { fa: "کُجا {می‌ره}؟", written: "کُجا {می‌رَوَد}؟", en: "Where is he going? / Where is she going?" },
      },
      { type: "heading", text: "In real conversation" },
      {
        type: "dialogue",
        title: "A reader",
        // 5.1
        lines: [
          { who: "Babak", fa: "دیروز چی {خَریدی}؟", written: "دیروز چه {خَریدی}؟", en: "What did you buy yesterday?" },
          { who: "Shirin", fa: "یه کِتاب {خَریدَم}. هَر هَفْته کِتاب {می‌خَرَم}.", written: "یِک کِتاب {خَریدَم}. هَر هَفْته کِتاب {می‌خَرَم}.", en: "I bought a book. I buy books every week." },
          { who: "Babak", fa: "زیاد {می‌خونی}؟", written: "زیاد {می‌خوانی}؟", en: "Do you read a lot?" },
          { who: "Shirin", fa: "آره، هَر شَب {می‌خونَم}.", written: "بَله، هَر شَب {می‌خوانَم}.", en: "Yes, I read every night." },
        ],
        note: "خَریدَن keeps its stems in both registers; خوانْدَن has the *un* of speech in both its stems (خون, خونْد).",
      },
      {
        type: "quiz",
        questions: [
          { prompt: "Type the spoken form of می‌گویَم (I say).", lang: "fa", answers: ["می‌گم"], explain: "می‌گَم, *migam*: گو → *g-*." },
          { prompt: "Type the spoken form of می‌دَهَم (I give).", lang: "fa", answers: ["می‌دم"], explain: "می‌دَم, *midam*: دَهْ → *d-*." },
          { prompt: "Type the spoken form of می‌دانی (you know).", lang: "fa", answers: ["می‌دونی"], explain: "می‌دونی, *miduni*: دان → دون." },
          { prompt: "Type the written form of می‌تونَم (I can).", lang: "fa", answers: ["می‌توانم"], explain: "می‌تَوانَم, *mitavânam*." },
          { prompt: "Type the spoken form of آمَدَم (I came).", lang: "fa", answers: ["اومدم"], explain: "اومَدَم, *umadam*: آمَد → اومَد." },
        ],
      },
      DRILL,
    ],
  },
  {
    slug: "different-words",
    title: "Words that differ: واسه, رُو, آره",
    summary: "A handful of everyday words have a spoken twin: واسه for بَرایِ, رُو for را, آره for بَله, اینْجوری for این‌طُور. Speech also puts a destination after the verb.",
    register: "both",
    kinds: ["spoken", "word-order"],
    source: SOURCE,
    vocab: [{ fa: "اینْجوری", written: "این‌طُور", en: "like this, this way", topic: "everyday" }],
    blocks: [
      {
        type: "idea",
        text: "A handful of everyday words have a **spoken twin**: واسه for بَرایِ (*for*), رُو for را, آره for بَله (*yes*), اینْجوری for این‌طُور (*like this*). And speech often puts a destination **after the verb**, without به.",
      },
      {
        type: "text",
        text: "Most of these came up one at a time. Some are not two forms of one word but two words: آره and بَله both mean *yes*, but بَله is also the polite spoken *yes*, said to a shopkeeper or a teacher, while آره is for friends and family; everyday writing has only بَله. In the same way مامان and بابا are what people call their parents, and مادَر and پِدَر are what is written (and said more formally). چی is usually written two ways: چه for *what*, and چِطُور in *what about…?*. Word order: speech says می‌رَم ایران, *I'm going to Iran*, where writing has به ایران می‌رَوَم (lesson 9.1); speech can keep the written order too.",
      },
      {
        type: "table",
        caption: "Everyday words with a spoken twin",
        headers: ["Written", "Spoken", "Meaning"],
        rows: [
          ["بَرایِ", "واسهٔ، بَرایِ", "for"],
          ["را", "رُو، ـو", "(marks a specific object)"],
          ["بَله", "آره، بَله", "yes"],
          ["چه", "چی", "what"],
          ["چه کار", "چیکار", "what (to do)"],
          ["این‌طُور", "اینْجوری", "like this"],
          ["کَمی", "یه کَم", "a little"],
          ["دَر", "تو", "in"],
          ["رویِ", "رو", "on"],
          ["آن‌ها، آن", "اونا، اون", "they, that"],
          ["مُتَشَکِّرَم", "مِرْسی، مَمْنون", "thanks"],
        ],
      },
      { type: "heading", text: "Core examples" },
      {
        type: "examples",
        items: [
          // 0.3
          { fa: "دیروز. {واسه} عَروسی اومَدَم.", written: "دیروز. {بَرایِ} عَروسی آمَدَم.", en: "Yesterday. I came for the wedding." },
          // 6.7
          { fa: "جُمْعه‌ها {خونه رُو} تَمیز می‌کُنیم.", written: "جُمْعه‌ها {خانه را} تَمیز می‌کُنیم.", en: "We clean the house on Fridays." },
          // 9.3
          { fa: "{اینا} مالِ کیه؟", written: "{این‌ها} مالِ کیسْت؟", en: "Whose are these?" },
          { fa: "{اینْجوری} بِنِویس.", written: "{این‌طُور} بِنِویس.", en: "Write it like this." },
          // 5.2
          { fa: "هَفْتهٔ بَعْد {می‌ریم} شیراز.", written: "هَفْتهٔ بَعْد به شیراز {می‌رَویم}.", en: "We're going to Shiraz next week." },
        ],
      },
      { type: "heading", text: "Contrast pair" },
      {
        type: "pair",
        title: "One spoken word, two written ones",
        // 4.3, and 10.1
        a: { fa: "فَرْدا {چی}؟", written: "فَرْدا {چِطُور}؟", en: "What about tomorrow?" },
        b: { fa: "اِسْمِ رِسْتوران {چی} بود؟", written: "اِسْمِ رِسْتوران {چه} بود؟", en: "What was the restaurant called?" },
        diff: "Spoken چی is *what* in B, written چه. In A it asks *what about…?*, which writing says with چِطُور.",
      },
      { type: "heading", text: "Common mistake" },
      {
        type: "callout",
        kind: "mistake",
        title: "A spoken word in a written sentence",
        text: "When you write formally, every word goes into the written register, not just the verb. واسه, رُو and آره stay in speech and chat.",
        wrong: { fa: "این هِدیه {واسهٔ} مادَرَم اَسْت.", en: "(in a card or a letter)" },
        right: { fa: "این هِدیه {بَرایِ} مادَرَم اَسْت.", en: "This present is for my mother." },
      },
      { type: "heading", text: "In real conversation" },
      {
        type: "dialogue",
        title: "The keys",
        // 6.7
        lines: [
          { who: "Mahsa", fa: "{کِلیدا رُو} نَدیدی؟", written: "{کِلیدْها را} نَدیدی؟", en: "Have you seen the keys?" },
          { who: "Kian", fa: "کُدوم کِلیدا؟", written: "کُدام کِلیدْها؟", en: "Which keys?" },
          { who: "Mahsa", fa: "{کِلیدِ ماشینُو}!", written: "{کِلیدِ ماشین را}!", en: "The car key!" },
          { who: "Kian", fa: "آهان، {اونُو} گُذاشْتَم رو میز.", written: "آهان، {آن را} رویِ میز گُذاشْتَم.", en: "Oh, I put it on the table." },
        ],
        note: "Every line has a spoken word or order: رُو and ـو for را, کُدوم, اونُو for آن را, رو for رویِ, and the place after the verb.",
      },
      {
        type: "quiz",
        questions: [
          { prompt: "Type the written form of واسه (for).", lang: "fa", answers: ["برای"], explain: "بَرایِ, *barâ-ye*." },
          { prompt: "Type the casual spoken *yes*, said to friends.", lang: "fa", answers: ["آره"], explain: "آره, *âre*; بَله is the polite one, spoken and written." },
          { prompt: "Type the written form of اینْجوری (like this).", lang: "fa", answers: ["این‌طور"], explain: "این‌طُور, *intor*." },
          { prompt: "Type the written form of چیکار (what, as in چیکار می‌کُنی؟).", lang: "fa", answers: ["چه کار", "چه‌کار", "چکار"], explain: "چه کار, *che kâr*: چه کار می‌کُنی؟" },
          {
            prompt: "Translate: هَفْتهٔ بَعْد می‌ریم شیراز.",
            lang: "en",
            answers: ["we're going to shiraz next week", "we are going to shiraz next week", "next week we're going to shiraz", "next week we are going to shiraz", "we'll go to shiraz next week", "we will go to shiraz next week", "next week we'll go to shiraz", "next week we will go to shiraz"],
            explain: "*hafte-ye ba'd mirim shirâz*: the destination after the verb, without به.",
          },
        ],
      },
      DRILL,
    ],
  },
  {
    slug: "chat",
    title: "How Iranians type: chat, Finglish and the half-space",
    summary: "Chat is speech typed out: خونه, میام, رو, no vowel marks. Some people type Persian in Latin letters (Finglish), and the half-space is often skipped.",
    register: "both",
    kinds: ["spoken", "spelling"],
    source:
      "Stilo, Talattof and Clinton, Modern Persian: Spoken and Written, for the spoken forms; the Academy of Persian Language and Literature's دستورِ خَطِّ فارسی for the half-space. Finglish has no published standard; it is described here from general usage.",
    vocab: [{ fa: "پَیام", en: "message", topic: "everyday" }],
    blocks: [
      {
        type: "idea",
        text: "In chat messages (پَیام) Iranians type the **spoken** language, without vowel marks: خونه, میام, کِتابُو. Some type Persian in Latin letters, called **Finglish**, and many skip the half-space.",
      },
      {
        type: "text",
        text: "**Spoken spellings.** Chat writes speech down, and most words have a settled spelling, the one this course uses: می‌خوام, خونه, یه, ـه for *is*. A few are spelled more than one way: را as رُو or joined as ـو (کِتاب رُو, کِتابُو, lesson 6.7), and the plural endings after *â* with one ی or two ([میایم|miyâyim], میاییم, lesson 5.3). Formal words still turn up in chat when the speaker would say them too: بَله, مُتَشَکِّرَم.",
      },
      {
        type: "text",
        text: "**Finglish** (also *Pinglish*) is Persian typed in Latin letters, from the years when phones and computers often had no Persian keyboard. It is less common now that every phone has one, but it still appears in usernames, in messages from people abroad, and from anyone without a Persian keyboard to hand. It has no fixed spelling: خوب may be *khub*, *khoob* or *khoub*; *â* and *a* are both usually *a*; *kh*, *sh* and *ch* are as in this course (*kh* is sometimes *x*), and *gh* is used for both غ and ق, which the course writes *q*. The course's transliteration is stricter, because it has to show every sound.",
      },
      {
        type: "text",
        text: "**The half-space.** Phone keyboards hide the half-space, so in chat می is often joined to its verb ([میخوام|mikhâm]) or typed with a space ([می خوام|mi khâm]). Readers understand both, but neither is standard spelling. In anything formal, use the half-space (lesson 3.1): می‌خواهَم.",
      },
      { type: "heading", text: "Core examples" },
      {
        type: "examples",
        items: [
          // 0.3
          { fa: "سَلام! چِطُوری؟", written: "سَلام! حالِ تُو چِطُور اَسْت؟", en: "Hi! How are you?", note: "In Finglish: *salam! chetori?*" },
          // 0.3
          { fa: "خوبَم، {مِرْسی}. تُو چِطُوری؟", written: "خوبَم، {مُتَشَکِّرَم}. حالِ تُو چِطُور اَسْت؟", en: "I'm fine, thanks. How are you?", note: "In Finglish: *khoobam, mersi. to chetori?*" },
          // 4.5
          { fa: "{کیفِت} کو؟", written: "{کیفَت} کُجاسْت؟", en: "Where's your bag?", note: "In Finglish: *kifet ku?*" },
          // 7.5
          { fa: "تو راهَم. دارَم میام.", written: "دَر راه هَسْتَم. دارَم می‌آیَم.", en: "I'm on my way. I'm coming.", note: "In Finglish: *too raham. daram miam.*" },
        ],
      },
      { type: "heading", text: "Contrast pair" },
      {
        type: "pair",
        title: "Two chat spellings of را",
        // 6.7
        a: { fa: "{کِتاب رُو} خونْدَم.", en: "I read the book. (typed with رُو)" },
        b: { fa: "{کِتابُو} خونْدَم.", en: "I read the book. (typed as said)" },
        diff: "Both are said *ketâbo khundam*, and chat uses either spelling. Formal writing has only one: کِتاب را خوانْدَم.",
      },
      { type: "heading", text: "Common mistake" },
      {
        type: "callout",
        kind: "mistake",
        title: "Chat habits in formal writing",
        text: "In an email, a form or an essay, the verb takes its half-space and its written form, even if you would type [میخوام|mikhâm] to a friend.",
        wrong: { fa: "{میخواهَم} به خانه بِرَوَم.", en: "(in an email: the half-space is missing)" },
        right: { fa: "{می‌خواهَم} به خانه بِرَوَم.", en: "I want to go home." },
      },
      { type: "heading", text: "In real conversation" },
      {
        type: "dialogue",
        title: "Messages",
        // 5.2
        lines: [
          { who: "Sara", fa: "کُجایی؟ چیکار {می‌کُنی}؟", written: "کُجا هَسْتی؟ چه کار {می‌کُنی}؟", en: "Where are you? What are you doing?" },
          { who: "Reza", fa: "خونه‌اَم، فیلْم {می‌بینَم}.", written: "دَر خانه هَسْتَم، فیلْم {می‌بینَم}.", en: "I'm at home, watching a film." },
          {
            who: "Sara",
            fa: "مَن وُ مینا اِمْشَب {می‌ریم} سینِما. {میای}؟",
            written: "مَن وَ مینا اِمْشَب به سینِما {می‌رَویم}. {می‌آیی}؟",
            en: "Mina and I are going to the cinema tonight. Are you coming?",
          },
          { who: "Reza", fa: "آره، {میام}!", written: "بَله، {می‌آیَم}!", en: "Yes, I'm coming!" },
        ],
        note: "Typed in a chat, these lines would look like the spoken ones without their marks. In Finglish the last one might be *are, miam!*",
      },
      {
        type: "quiz",
        questions: [
          { prompt: "Type in Persian script the Finglish *mersi* (thanks).", lang: "fa", answers: ["مرسی"], explain: "مِرْسی." },
          { prompt: "Type in Persian script the Finglish *khoobam* (I'm fine).", lang: "fa", answers: ["خوبم"], explain: "خوبَم: *oo* is the long *u*, spelled و." },
          { prompt: "Type in Persian script the Finglish *kojai?* (where are you?), without the question mark.", lang: "fa", answers: ["کجایی"], explain: "کُجایی, *kojâyi*." },
          { prompt: "What is Persian typed in Latin letters called? Type it.", lang: "en", answers: ["finglish", "pinglish", "fingilish", "pingilish"], explain: "Finglish, also Pinglish." },
          { prompt: "In a formal email, type *I want* with its half-space.", lang: "fa", answers: ["می‌خواهم"], explain: "می‌خواهَم: the written form, with the half-space after می." },
        ],
      },
      DRILL,
    ],
  },
];
