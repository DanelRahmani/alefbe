import type { Lesson } from "../types";
import { VERBS, verbById } from "../verbs";
import { table, type Style } from "@/lib/conjugate";

// Unit 5, everyday verbs in the present. Spoken Tehrani first, written
// beneath. Conjugation tables come from lib/conjugate.ts, so lessons and the
// trainer can never disagree. Examples are original.

const SOURCE =
  "Thackston, An Introduction to Persian, on the stems and the present; Mahootian, Persian (Routledge Descriptive Grammars), on the present, negation and compound verbs; Stilo, Talattof and Clinton, Modern Persian: Spoken and Written, for the Tehrani forms.";

const forms = (id: string, style: Style, negative = false) => table(verbById.get(id)!, "present", style, negative, VERBS);

const WHO = [
  "I (مَن)",
  "you (تُو)",
  "he, she (اون / او)",
  "we (ما)",
  "you (شُما)",
  "they (اونا / آن‌ها)",
];

/** Rows of Who | Spoken | Written for one verb. */
const spokenWritten = (id: string, negative = false) => {
  const s = forms(id, "spoken", negative);
  const w = forms(id, "written", negative);
  return WHO.map((who, i) => [who, s[i], w[i]]);
};

export const present: Lesson[] = [
  {
    slug: "two-stems",
    title: "Two stems: every verb has a past and a present stem",
    summary: "Take ـَن off the infinitive for the past stem; the present stem often has to be learned with the verb.",
    register: "both",
    kinds: ["verbs", "grammar"],
    source: SOURCE,
    vocab: [
      { fa: "فَهْمیدَن", en: "to understand", topic: "verbs" },
      { fa: "پُرْسیدَن", en: "to ask", topic: "verbs" },
      { fa: "فیلْم", en: "film", topic: "everyday" },
      { fa: "هَفْته", en: "week", topic: "time" },
      { fa: "شَب", en: "night; in the evening", topic: "time" },
    ],
    blocks: [
      {
        type: "idea",
        text: "Every verb has **two stems**: the **past stem**, which is the infinitive without ـَن, and the **present stem**, which often looks different and is learned with the verb.",
      },
      {
        type: "text",
        text: "The dictionary form of a verb is the **infinitive** (مَصْدَر, *masdar*): خَریدَن, *to buy*. It always ends in ـتَن or ـدَن. Take off the ـَن and you have the **past stem** (بُنِ ماضی, *bon-e mâzi*): خَرید. That step never fails. The **present stem** (بُنِ مُضارِع, *bon-e mozâre'*) is where the surprises are. For verbs in ـیدَن it is almost always the past stem without ـید: خَریدَن → خَر, پُرْسیدَن → پُرْس; the big exceptions are دیدَن (*to see*) → بین and شِنیدَن (*to hear*) → [شِنَو|shenav]. Verbs with other endings, which include most of the commonest, are mostly irregular: رَفْتَن → [رَو|rav], کَرْدَن → کُن. So learn each verb as a set of three. The past stem builds the past tenses (Unit 7); the present stem builds the present, commands and the subjunctive.",
      },
      {
        type: "table",
        caption: "Infinitive, past stem, present stem",
        headers: ["Infinitive", "Past stem", "Present stem", "Meaning"],
        rows: [
          ["خَریدَن", "خَرید", "خَر", "to buy"],
          ["فَهْمیدَن", "فَهْمید", "فَهْم", "to understand"],
          ["رَفْتَن", "رَفْت", "[رَو|rav]", "to go"],
          ["کَرْدَن", "کَرْد", "کُن", "to do, to make"],
          ["دیدَن", "دید", "بین", "to see"],
          ["گُفْتَن", "گُفْت", "گو", "to say"],
          ["خواسْتَن", "خواسْت", "خواه", "to want"],
          ["آمَدَن", "آمَد", "[آ|â]", "to come"],
        ],
      },
      { type: "heading", text: "Core examples" },
      {
        type: "examples",
        items: [
          {
            fa: "دیروز نون {خَریدَم}.",
            written: "دیروز نان {خَریدَم}.",
            en: "I bought bread yesterday.",
            note: "The past stem خَرید plus the ending ـَم (*I*).",
          },
          {
            fa: "هَر روز نون {می‌خَرَم}.",
            written: "هَر روز نان {می‌خَرَم}.",
            en: "I buy bread every day.",
            note: "The present stem خَر, with می in front and the same ending ـَم.",
          },
          {
            fa: "فیلْم رُو {دیدَم}.",
            written: "فیلْم را {دیدَم}.",
            en: "I saw the film.",
            note: "The past stem دید.",
          },
          {
            fa: "بِدونِ عَینَک خوب {نِمی‌بینَم}.",
            en: "I can't see well without glasses.",
            note: "The present stem بین: nothing like دید. Persian says *I don't see well* where English says *can't*.",
          },
        ],
      },
      { type: "heading", text: "Contrast pair" },
      {
        type: "pair",
        title: "One verb, two stems",
        a: { fa: "{رَفْتَم}.", en: "I went." },
        b: { fa: "{می‌رَم}.", written: "{می‌رَوَم}.", en: "I go. / I'm going." },
        diff: "Same verb, same ending ـَم. The past uses the past stem رَفْت; the present uses می and the present stem [رَو|rav] (shortened in speech to *r-*).",
      },
      { type: "heading", text: "Common mistake" },
      {
        type: "callout",
        kind: "mistake",
        title: "The present built on the past stem",
        text: "Putting می on the past stem does make a real verb, but not the present: می‌دیدَم means *I used to see* or *I was seeing* (Unit 7). The present needs the present stem.",
        wrong: { fa: "{می‌دیدَم}.", en: "(meant: I see)" },
        right: { fa: "{می‌بینَم}.", en: "I see." },
      },
      { type: "heading", text: "In real conversation" },
      {
        type: "dialogue",
        title: "Book talk",
        lines: [
          { who: "Neda", fa: "دیروز چی {خَریدی}؟", written: "دیروز چه {خَریدی}؟", en: "What did you buy yesterday?" },
          {
            who: "Omid",
            fa: "یه کِتاب {خَریدَم}. هَر هَفْته کِتاب {می‌خَرَم}.",
            written: "یِک کِتاب {خَریدَم}. هَر هَفْته کِتاب {می‌خَرَم}.",
            en: "I bought a book. I buy books every week.",
          },
          { who: "Neda", fa: "زیاد {می‌خونی}؟", written: "زیاد {می‌خوانی}؟", en: "Do you read a lot?" },
          { who: "Omid", fa: "آره، هَر شَب {می‌خونَم}.", written: "بَله، هَر شَب {می‌خوانَم}.", en: "Yes, I read every night." },
        ],
        note: "خَریدی and خَریدَم are built on the past stem خَرید; می‌خَرَم and می‌خونی on the present stems خَر and خون (written خوان).",
      },
      {
        type: "quiz",
        questions: [
          {
            prompt: "Type the past stem of خَریدَن (take off the ending).",
            lang: "fa",
            answers: ["خرید"],
            explain: "خَرید: the infinitive without ـَن. The past stem is always made this way.",
          },
          {
            prompt: "What is the present stem of دیدَن (to see)? Type it in Persian script.",
            lang: "fa",
            answers: ["بین"],
            explain: "بین, as in می‌بینَم (*I see*). It has to be learned with the verb.",
          },
          {
            prompt: "پُرْسیدَن (to ask) ends in ـیدَن. Type its present stem.",
            lang: "fa",
            answers: ["پرس"],
            explain: "پُرْس: take ـید off the past stem پُرْسید. Verbs in ـیدَن are nearly all regular; دیدَن is the big exception.",
          },
          {
            prompt: "Which stem builds the present tense? Type past or present.",
            lang: "en",
            answers: ["present", "the present stem", "present stem", "the present"],
            explain: "The present stem: می + present stem + ending.",
          },
        ],
      },
    ],
  },
  {
    slug: "present-tense",
    title: "The present: می + stem + ending",
    summary: "One tense covers “I go”, “I'm going” and often “I'll go”: می, the present stem, and the ending that says who.",
    register: "both",
    kinds: ["verbs", "grammar"],
    source: SOURCE,
    vocab: [
      { fa: "قَهْوه", en: "coffee", topic: "food" },
      { fa: "اَلان", en: "now, right now", topic: "time" },
      { fa: "نِوِشْتَن", en: "to write", topic: "verbs" },
      { fa: "خونْدَن", written: "خوانْدَن", en: "to read; to study", topic: "verbs" },
      { fa: "اِمْشَب", en: "tonight", topic: "time" },
    ],
    blocks: [
      {
        type: "idea",
        text: "The present tense is **می + present stem + personal ending**, and the one form covers *I go*, *I'm going* and often *I'll go*.",
      },
      {
        type: "text",
        text: "می is joined to the stem with a half-space (lesson 3.1) and takes the stress: *mínevisam*, with the beat on *mi* (lesson 2.8). The endings are the ones from lesson 4.1. Speech and writing share three of them (ـَم, ـی, ـیم). *He, she* is *-e* in speech and *-ad* in writing; plural *you* is *-in* in speech for written *-id*; and *they* drops its *d*: *-an* for *-and*. When a written stem ends in a vowel, a ی slides in before the ending: می‌گویَم (*miguyam*, I say), می‌آیَم (*mi-âyam*, I come). Here is نِوِشْتَن (*to write*), present stem نِویس:",
      },
      {
        type: "table",
        caption: "نِوِشْتَن, to write",
        headers: ["Who", "Spoken", "Written"],
        rows: spokenWritten("neveshtan"),
      },
      { type: "heading", text: "Core examples" },
      {
        type: "examples",
        items: [
          { fa: "هَر روز قَهْوه {می‌خُورَم}.", en: "I drink coffee every day." },
          { fa: "اَلان نامه {می‌نِویسَم}.", en: "I'm writing a letter right now." },
          {
            fa: "مَرْیَم فارْسی {می‌خونه}.",
            written: "مَرْیَم فارْسی {می‌خوانَد}.",
            en: "Maryam is studying Persian.",
            note: "خونْدَن (written خوانْدَن) is *to read*, and also *to study* a subject.",
          },
          {
            fa: "هَفْتهٔ بَعْد {می‌ریم} شیراز.",
            written: "هَفْتهٔ بَعْد به شیراز {می‌رَویم}.",
            en: "We're going to Shiraz next week.",
            note: "A plan for the near future is usually just the present.",
          },
        ],
      },
      { type: "heading", text: "Contrast pair" },
      {
        type: "pair",
        title: "Now or every day",
        a: { fa: "اَلان {می‌خونَم}.", written: "اَلان {می‌خوانَم}.", en: "I'm reading now." },
        b: { fa: "هَر روز {می‌خونَم}.", written: "هَر روز {می‌خوانَم}.", en: "I read every day." },
        diff: "The verb is the same; only the time word changes the meaning. Persian has no separate *-ing* tense here. Speech can add دارَم in front to stress *right in the middle of it*, which Unit 7 covers.",
      },
      { type: "heading", text: "Common mistake" },
      {
        type: "callout",
        kind: "mistake",
        title: "Leaving out می",
        text: "Without می the verb is not the everyday present. The bare form survives in poetry, and a form with بـ instead, بِخُورَم (*that I eat*), is the subjunctive of Unit 8. For *I eat*, *I drink*, always use می.",
        wrong: { fa: "هَر روز قَهْوه {خُورَم}.", en: "(meant: I drink coffee every day)" },
        right: { fa: "هَر روز قَهْوه {می‌خُورَم}.", en: "I drink coffee every day." },
      },
      {
        type: "callout",
        kind: "dari",
        title: "The prefix in Dari",
        text: "In Dari the prefix is said *mē-*, with the long *ē* that Iranian Persian has merged into *i* (lesson 0.3). The spelling می is the same.",
        checked: false,
      },
      { type: "heading", text: "In real conversation" },
      {
        type: "dialogue",
        title: "A phone call",
        lines: [
          { who: "Sara", fa: "کُجایی؟ چیکار {می‌کُنی}؟", written: "کُجا هَسْتی؟ چه کار {می‌کُنی}؟", en: "Where are you? What are you doing?" },
          { who: "Babak", fa: "خونه‌اَم، فیلْم {می‌بینَم}.", written: "دَر خانه هَسْتَم، فیلْم {می‌بینَم}.", en: "I'm at home, watching a film." },
          {
            who: "Sara",
            fa: "مَن وُ مینا اِمْشَب {می‌ریم} سینِما. {میای}؟",
            written: "مَن وَ مینا اِمْشَب به سینِما {می‌رَویم}. {می‌آیی}؟",
            en: "Mina and I are going to the cinema tonight. Are you coming?",
          },
          { who: "Babak", fa: "آره، {میام}!", written: "بَله، {می‌آیَم}!", en: "Yes, I'm coming!" },
        ],
        note: "Every verb here is the plain present, where English uses *-ing*. In speech the place you're going to can follow the verb: می‌ریم سینِما.",
      },
      {
        type: "quiz",
        questions: [
          {
            prompt: "Write *I write* (one word).",
            lang: "fa",
            answers: ["می‌نویسم"],
            explain: "می‌نِویسَم: می + نِویس + ـَم, the same in speech and writing.",
          },
          {
            prompt: "Spoken: *she reads* (one word).",
            lang: "fa",
            answers: ["می‌خونه"],
            explain: "می‌خونه (*mikhune*); written می‌خوانَد.",
          },
          {
            prompt: "Written: *they eat* (one word).",
            lang: "fa",
            answers: ["می‌خورند"],
            explain: "می‌خُورَنْد; spoken می‌خُورَن.",
          },
          {
            prompt: "Translate: هَر روز قَهْوه می‌خُورَم.",
            lang: "en",
            answers: ["i drink coffee every day", "every day i drink coffee", "i drink coffee everyday", "i have coffee every day", "every day i have coffee", "i have coffee everyday", "i drink coffee each day"],
            explain: "*har ruz qahve mikhoram*: the time word هَر روز makes it a habit.",
          },
        ],
      },
    ],
  },
  {
    slug: "ten-verbs",
    title: "The ten most common verbs",
    summary: "Go, come, do, become, say, give, see, want, know and can, with the short stems speech uses for most of them.",
    register: "both",
    kinds: ["verbs", "spoken"],
    source: SOURCE,
    vocab: [
      { fa: "رَفْتَن", en: "to go", topic: "verbs" },
      { fa: "آمَدَن", en: "to come", topic: "verbs" },
      { fa: "کَرْدَن", en: "to do, to make", topic: "verbs" },
      { fa: "شُدَن", en: "to become", topic: "verbs" },
      { fa: "گُفْتَن", en: "to say", topic: "verbs" },
      { fa: "دادَن", en: "to give", topic: "verbs" },
      { fa: "دیدَن", en: "to see", topic: "verbs" },
      { fa: "خواسْتَن", en: "to want", topic: "verbs" },
      { fa: "دانِسْتَن", en: "to know (a fact)", topic: "verbs" },
      { fa: "تَوانِسْتَن", en: "to be able, can", topic: "verbs" },
      { fa: "آدْرِس", en: "address", topic: "everyday" },
    ],
    blocks: [
      {
        type: "idea",
        text: "Ten verbs carry most everyday sentences, and in speech most of them **shorten their present stem**: written می‌رَوَم, spoken می‌رَم.",
      },
      {
        type: "text",
        text: "The spoken stems follow three patterns. **ân becomes un**, as in many common words (نان → نون): دان → دون, خوان → خون, and تَوان → تون, which also loses its *av*. **Short stems** shrink: [رَو|rav] → *r-*, [شَو|shav] → *sh-*, گو → *g-*, دَهْ → *d-*, خواه → *khâ-*. And **آ runs into می**: می‌آیَم is spoken میام (*miyâm*), typed as one word. Of these ten, only کَرْدَن and دیدَن keep their written stem. The written forms stay regular, so learn the spoken and written column side by side.",
      },
      {
        type: "table",
        caption: "The ten verbs: *I*",
        headers: ["Verb", "Spoken", "Written"],
        rows: ["raftan", "âmadan", "kardan", "shodan", "goftan", "dâdan", "didan", "khâstan", "dânestan", "tavânestan"].map((id) => {
          const s = forms(id, "spoken");
          const w = forms(id, "written");
          return [`${verbById.get(id)!.inf}, ${verbById.get(id)!.en}`, s[0], w[0]];
        }),
      },
      {
        type: "table",
        caption: "آمَدَن (to come) in full",
        headers: ["Who", "Spoken", "Written"],
        rows: spokenWritten("âmadan"),
      },
      {
        type: "text",
        text: "After the *â* of میا and می‌خوا, speech keeps the ی of the plural endings: میاییم (*miyâyim*, we come), می‌خوایین (*mikhâyin*, you want). Chat often types them with one ی: [میایم|miyâyim], [می‌خواین|mikhâyin].",
      },
      { type: "heading", text: "Core examples" },
      {
        type: "examples",
        items: [
          { fa: "یه قَهْوه {می‌خوام}.", written: "یِک قَهْوه {می‌خواهَم}.", en: "I'd like a coffee." },
          { fa: "چی {می‌گی}؟", written: "چه {می‌گویی}؟", en: "What are you saying?" },
          { fa: "آدْرِس رُو {می‌دونی}؟", written: "آدْرِس را {می‌دانی}؟", en: "Do you know the address?" },
          { fa: "کَی {میای}؟", written: "کَی {می‌آیی}؟", en: "When are you coming?" },
          { fa: "هَوا سَرْد {می‌شه}.", written: "هَوا سَرْد {می‌شَوَد}.", en: "It's getting cold.", note: "شُدَن, *to become*: literally *the air becomes cold*." },
        ],
      },
      { type: "heading", text: "Contrast pair" },
      {
        type: "pair",
        title: "Written stem, spoken stem",
        a: { fa: "{می‌تَوانَم}.", en: "I can. (written)" },
        b: { fa: "{می‌تونَم}.", en: "I can. (spoken)" },
        diff: "In many common words speech turns *ân* into *un*: دان → دون, خوان → خون, and تَوان → تون, which also loses its *av*. Writing keeps the full form.",
      },
      { type: "heading", text: "Common mistake" },
      {
        type: "callout",
        kind: "mistake",
        title: "Spoken stems in writing",
        text: "The short stems belong to speech and to chat messages. In an email, an essay or anything formal, write the full form: می‌رَوَم, not می‌رَم; می‌دانَم, not می‌دونَم.",
        wrong: { fa: "فَرْدا به تِهْران {می‌رَم}.", en: "I'm going to Tehran tomorrow. (in a formal email)" },
        right: { fa: "فَرْدا به تِهْران {می‌رَوَم}.", en: "I'm going to Tehran tomorrow." },
      },
      { type: "heading", text: "In real conversation" },
      {
        type: "dialogue",
        title: "At a café",
        lines: [
          { who: "Waiter", fa: "چی {مَیل دارین}؟", written: "چه {مَیل دارید}؟", en: "What would you like?" },
          { who: "Customer", fa: "یه چایی {می‌خوام}، لُطْفاً.", written: "یِک چای {می‌خواهَم}، لُطْفاً.", en: "A tea, please." },
          { who: "Waiter", fa: "چَشْم. کیک هَم {می‌خوایین}؟", written: "چَشْم. کیک هَم {می‌خواهید}؟", en: "Certainly. Would you like cake too?" },
          { who: "Customer", fa: "نَه، مِرْسی. فَقَط چایی.", written: "نَه، مُتَشَکِّرَم. فَقَط چای.", en: "No, thanks. Just tea." },
        ],
        note: "چی مَیل دارین؟ (literally *what do you have an appetite for?*) is the polite waiter's question. چَشْم, literally *eye*, is a polite *certainly, right away*.",
      },
      {
        type: "quiz",
        questions: [
          { prompt: "Spoken: *I want* (one word).", lang: "fa", answers: ["می‌خوام"], explain: "می‌خوام (*mikhâm*); written می‌خواهَم." },
          { prompt: "Spoken: *I know* (a fact; one word).", lang: "fa", answers: ["می‌دونم"], explain: "می‌دونَم (*midunam*): written دان becomes دون." },
          {
            prompt: "Spoken: *I'm coming* (one word).",
            lang: "fa",
            answers: ["میام", "می‌آم"],
            explain: "میام (*miyâm*), usually typed as one word; written می‌آیَم.",
          },
          { prompt: "Type the written form of spoken می‌گه (he says).", lang: "fa", answers: ["می‌گوید"], explain: "می‌گویَد: the written stem گو, a ی, then ـَد." },
        ],
      },
    ],
  },
  {
    slug: "not-doing",
    title: "Not doing: نِمی",
    summary: "Put نـ in front of می for the negative present: می‌رَم, نِمی‌رَم. It takes the stress, and in a compound verb it goes on the verb part.",
    register: "both",
    kinds: ["verbs", "grammar"],
    source: SOURCE,
    vocab: [
      { fa: "گوشْت", en: "meat", topic: "food" },
      { fa: "کَلَمه", en: "word", topic: "learning" },
      { fa: "مِهْمونی", written: "مِهْمانی", en: "party; guests over", topic: "everyday" },
      { fa: "جِدّی", en: "serious; really?", topic: "everyday" },
    ],
    blocks: [
      {
        type: "idea",
        text: "Put **نـ** (*na-*, said *ne-* before می) in front of می and the present becomes negative: می‌رَم → نِمی‌رَم, *I don't go*.",
      },
      {
        type: "text",
        text: "The negative prefix works the same for every person, in speech and in writing: نِمی‌رَم, نِمی‌ری, نِمی‌ره. It takes the stress of the word: *némiram*. With spoken آ-verbs it joins the one word: نِمیام (*nemiyâm*, I'm not coming), written نِمی‌آیَم. In a compound verb it goes on the verb part: حَرْف نِمی‌زَنَم (*I don't talk*). داشْتَن is different: it takes نـ with no می (نَدارَم, *I don't have*), which is the next lesson.",
      },
      {
        type: "table",
        caption: "خواسْتَن (to want), negative",
        headers: ["Who", "Spoken", "Written"],
        rows: spokenWritten("khâstan", true),
      },
      { type: "heading", text: "Core examples" },
      {
        type: "examples",
        items: [
          { fa: "گوشْت {نِمی‌خُورَم}.", en: "I don't eat meat." },
          { fa: "اِمْروز {نِمیام}.", written: "اِمْروز {نِمی‌آیَم}.", en: "I'm not coming today." },
          { fa: "این کَلَمه رُو {نِمی‌فَهْمَم}.", written: "این کَلَمه را {نِمی‌فَهْمَم}.", en: "I don't understand this word." },
          {
            fa: "اونا فارْسی {حَرْف نِمی‌زَنَن}.",
            written: "آن‌ها فارْسی {حَرْف نِمی‌زَنَنْد}.",
            en: "They don't speak Persian.",
            note: "نـ goes on زَدَن, the verb part of حَرْف زَدَن.",
          },
        ],
      },
      { type: "heading", text: "Contrast pair" },
      {
        type: "pair",
        title: "I know, I don't know",
        a: { fa: "{می‌دونَم}.", written: "{می‌دانَم}.", en: "I know." },
        b: { fa: "{نِمی‌دونَم}.", written: "{نِمی‌دانَم}.", en: "I don't know." },
        diff: "Only نـ is added, and it takes the stress: *mídunam*, *némidunam*.",
      },
      { type: "heading", text: "Common mistake" },
      {
        type: "callout",
        kind: "mistake",
        title: "نَه is not “not”",
        text: "نَه is the answer word *no*. It does not make a verb negative the way English *not* does; the negative is a prefix on the verb itself. (Paired, نَه… نَه… means *neither… nor…*.)",
        wrong: { fa: "مَن {نَه} می‌رَم.", en: "(meant: I'm not going)" },
        right: { fa: "مَن {نِمی‌رَم}.", en: "I'm not going." },
      },
      { type: "heading", text: "In real conversation" },
      {
        type: "dialogue",
        title: "The party",
        lines: [
          { who: "Leila", fa: "فَرْدا میای مِهْمونی؟", written: "فَرْدا به مِهْمانی می‌آیی؟", en: "Are you coming to the party tomorrow?" },
          { who: "Kian", fa: "نَه، {نِمیام}. خَیلی خَسْته‌اَم.", written: "نَه، {نِمی‌آیَم}. خَیلی خَسْته هَسْتَم.", en: "No, I'm not coming. I'm really tired." },
          { who: "Leila", fa: "حَیف شُد! سارا هَم {نِمیاد}.", written: "حَیف شُد! سارا هَم {نِمی‌آیَد}.", en: "What a shame! Sara isn't coming either." },
          { who: "Kian", fa: "جِدّی؟ چِرا؟", en: "Really? Why?" },
          { who: "Leila", fa: "{نِمی‌دونَم}.", written: "{نِمی‌دانَم}.", en: "I don't know." },
        ],
        note: "نِمیام and نِمیاد are the spoken forms of نِمی‌آیَم and نِمی‌آیَد. With a negative verb, هَم means *either*.",
      },
      {
        type: "quiz",
        questions: [
          { prompt: "Make it negative (spoken): می‌رَم.", lang: "fa", answers: ["نمی‌رم"], explain: "نِمی‌رَم (*nemiram*): نـ in front of می." },
          { prompt: "Written: *we don't understand* (one word).", lang: "fa", answers: ["نمی‌فهمیم"], explain: "نِمی‌فَهْمیم, the same in speech." },
          {
            prompt: "Spoken: *I'm not coming* (one word).",
            lang: "fa",
            answers: ["نمیام", "نمی‌آم"],
            explain: "نِمیام (*nemiyâm*), usually typed as one word; written نِمی‌آیَم.",
          },
          {
            prompt: "Make it negative: حَرْف می‌زَنَن (they talk).",
            lang: "fa",
            answers: ["حرف نمی‌زنن"],
            explain: "حَرْف نِمی‌زَنَن: the prefix goes on the verb part, not on حَرْف.",
          },
        ],
      },
    ],
  },
  {
    slug: "to-have",
    title: "To have: داشْتَن",
    summary: "Apart from “to be”, داشْتَن is the one common verb whose present takes no می: دارَم, I have; نَدارَم, I don't have.",
    register: "both",
    kinds: ["verbs", "grammar"],
    source: SOURCE,
    vocab: [
      { fa: "داشْتَن", en: "to have", topic: "verbs" },
      { fa: "بَرادَر", en: "brother", topic: "people" },
      { fa: "کِلاس", en: "class", topic: "learning" },
      { fa: "دوسْت داشْتَن", en: "to like, to love", topic: "verbs" },
      { fa: "بیسْت", en: "twenty", topic: "numbers" },
      { fa: "مُتَأَسِّفَم", en: "I'm sorry", topic: "everyday" },
    ],
    blocks: [
      {
        type: "idea",
        text: "Apart from *to be* (Unit 4), داشْتَن (*to have*) is the one common verb whose present takes **no می**: دارَم, *I have*; its negative is **نـ**: نَدارَم, *I don't have*.",
      },
      {
        type: "table",
        caption: "داشْتَن, to have",
        headers: ["Who", "Spoken", "Written", "Not (spoken)"],
        rows: (() => {
          const s = forms("dâshtan", "spoken");
          const w = forms("dâshtan", "written");
          const n = forms("dâshtan", "spoken", true);
          return WHO.map((who, i) => [who, s[i], w[i], n[i]]);
        })(),
      },
      {
        type: "text",
        text: "داشْتَن does more than own things. Age is something you have: بیسْت سال دارَم, *I'm twenty*. Being busy is having work: کار دارَم. And *to like* is the compound دوسْت داشْتَن (lesson 5.6), with the same forms: دوسْت دارَم. Most compounds with داشْتَن keep this pattern, like اِحْتیاج دارَم (*I need*); a few that describe an action take می, such as نِگَهْ داشْتَن, *to keep*: نِگَهْ می‌دارَم.",
      },
      { type: "heading", text: "Core examples" },
      {
        type: "examples",
        items: [
          { fa: "یه بَرادَر {دارَم}.", written: "یِک بَرادَر {دارَم}.", en: "I have a brother." },
          { fa: "ماشین {نَدارَم}.", en: "I don't have a car." },
          { fa: "بیسْت سال {دارَم}.", en: "I'm twenty.", note: "Literally *I have twenty years*." },
          { fa: "این آهَنْگ رُو خَیلی دوسْت {دارَم}.", written: "این آهَنْگ را خَیلی دوسْت {دارَم}.", en: "I really like this song." },
          { fa: "فَرْدا کِلاس {دارین}؟", written: "فَرْدا کِلاس {دارید}؟", en: "Do you have class tomorrow?" },
        ],
      },
      { type: "heading", text: "Contrast pair" },
      {
        type: "pair",
        title: "Have and don't have",
        a: { fa: "ماشین {دارَم}.", en: "I have a car." },
        b: { fa: "ماشین {نَدارَم}.", en: "I don't have a car." },
        diff: "The negative is نـ (*na-*), joined straight onto دار: there is no می, so there is no نِمی either.",
      },
      { type: "heading", text: "Common mistake" },
      {
        type: "callout",
        kind: "mistake",
        title: "می on داشْتَن",
        text: "By analogy with every other verb, learners add می. For *to have*, the present is plain دارَم, and the negative is نَدارَم, not نِمی‌دارَم.",
        wrong: { fa: "ماشین {می‌دارَم}.", en: "(meant: I have a car)" },
        right: { fa: "ماشین {دارَم}.", en: "I have a car." },
      },
      { type: "heading", text: "In real conversation" },
      {
        type: "dialogue",
        title: "At the corner shop",
        lines: [
          {
            who: "Customer",
            fa: "بِبَخْشید، نونِ بَرْبَری {دارین}؟",
            written: "بِبَخْشید، نانِ بَرْبَری {دارید}؟",
            en: "Excuse me, do you have barbari bread?",
          },
          { who: "Shopkeeper", fa: "نَه، شَرْمَنْده. اِمْروز {نَداریم}.", written: "نَه، مُتَأَسِّفَم. اِمْروز {نَداریم}.", en: "No, sorry. We don't have any today." },
          { who: "Customer", fa: "سَنْگَک چی؟", written: "سَنْگَک چِطُور؟", en: "What about sangak?" },
          {
            who: "Shopkeeper",
            fa: "سَنْگَک {داریم}. چَنْد تا {می‌خوایین}؟",
            written: "سَنْگَک {داریم}. چَنْد عَدَد {می‌خواهید}؟",
            en: "Sangak we have. How many would you like?",
          },
        ],
        note: "The shopkeeper answers with *we*, داریم and نَداریم: the shop. شَرْمَنْده (*sharmande*, literally *ashamed*) is the everyday spoken *sorry*. Barbari and sangak are two everyday Iranian breads.",
      },
      {
        type: "quiz",
        questions: [
          { prompt: "Write *I have* (one word).", lang: "fa", answers: ["دارم"], explain: "دارَم, with no می." },
          { prompt: "Write *I don't have* (one word).", lang: "fa", answers: ["ندارم"], explain: "نَدارَم: نـ joined straight on." },
          {
            prompt: "Ask a shopkeeper *do you have…?* (شُما; one word, spoken or written).",
            lang: "fa",
            answers: ["دارین", "دارید"],
            explain: "دارین in speech, دارید in writing.",
          },
          {
            prompt: "Translate: بیسْت سال دارَم.",
            lang: "en",
            answers: ["i'm twenty", "i am twenty", "i'm 20", "i am 20", "i'm twenty years old", "i am twenty years old", "i'm 20 years old", "i am 20 years old"],
            explain: "*bist sâl dâram*: age is *had* in Persian.",
          },
        ],
      },
    ],
  },
  {
    slug: "compound-verbs",
    title: "Compound verbs: a noun plus کَرْدَن, شُدَن or زَدَن",
    summary: "Most Persian verbs are a noun or adjective plus a light verb that carries the endings: کار می‌کُنَم, I work.",
    register: "both",
    kinds: ["verbs", "grammar"],
    source:
      SOURCE + " Lazard, A Grammar of Contemporary Persian, on compound verbs.",
    vocab: [
      { fa: "کار کَرْدَن", en: "to work", topic: "verbs" },
      { fa: "زِنْدِگی کَرْدَن", en: "to live", topic: "verbs" },
      { fa: "حَرْف زَدَن", en: "to talk, to speak", topic: "verbs" },
      { fa: "زَنْگ زَدَن", en: "to phone, to call", topic: "verbs" },
      { fa: "باز کَرْدَن", en: "to open", topic: "verbs" },
      { fa: "یاد گِرِفْتَن", en: "to learn", topic: "verbs" },
      { fa: "پَنْجَره", en: "window", topic: "home" },
      { fa: "بانْک", en: "bank", topic: "places" },
    ],
    blocks: [
      {
        type: "idea",
        text: "Most Persian verbs are **compound**: a noun or adjective plus a **light verb**, such as کَرْدَن, شُدَن or زَدَن, which carries the endings: کار می‌کُنَم, *I work*.",
      },
      {
        type: "text",
        text: "Persian has only a few hundred simple verbs; new verbs are made by pairing a word with one of them (فِعْلِ مُرَکَّب, *fe'l-e morakkab*, compound verb). The first part keeps its place and its form. The light verb is conjugated as usual, so می and نـ go on it: کار می‌کُنَم, کار نِمی‌کُنَم. The light verb's own meaning often fades: زَدَن is *to hit*, but حَرْف زَدَن is simply *to talk*. With an adjective, کَرْدَن often means someone does it, and شُدَن that it happens: باز کَرْدَن, *to open (something)*; باز شُدَن, *to open, come open*.",
      },
      {
        type: "table",
        caption: "Everyday compound verbs",
        headers: ["Compound", "Literally", "Meaning"],
        rows: [
          ["کار کَرْدَن", "work + do", "to work"],
          ["زِنْدِگی کَرْدَن", "life + do", "to live"],
          ["باز کَرْدَن", "open + do", "to open (something)"],
          ["باز شُدَن", "open + become", "to open, come open"],
          ["حَرْف زَدَن", "word + hit", "to talk, to speak"],
          ["زَنْگ زَدَن", "bell + hit", "to phone, to call"],
          ["دوسْت داشْتَن", "friend + have", "to like, to love"],
          ["یاد گِرِفْتَن", "memory + take", "to learn"],
        ],
      },
      { type: "heading", text: "Core examples" },
      {
        type: "examples",
        items: [
          { fa: "تو یه بانْک {کار می‌کُنَم}.", written: "دَر یِک بانْک {کار می‌کُنَم}.", en: "I work at a bank." },
          { fa: "کُجا {زِنْدِگی می‌کُنین}؟", written: "کُجا {زِنْدِگی می‌کُنید}؟", en: "Where do you live?" },
          { fa: "شَبا به مامانَم {زَنْگ می‌زَنَم}.", written: "شَب‌ها به مادَرَم {زَنْگ می‌زَنَم}.", en: "I call my mum in the evenings." },
          { fa: "فارْسی {یاد می‌گیرَم}.", en: "I'm learning Persian." },
          { fa: "این دَر خوب {باز نِمی‌شه}.", written: "این دَر خوب {باز نِمی‌شَوَد}.", en: "This door doesn't open properly." },
        ],
      },
      { type: "heading", text: "Contrast pair" },
      {
        type: "pair",
        title: "Someone opens it, or it opens",
        a: { fa: "پَنْجَره رُو {باز می‌کُنَم}.", written: "پَنْجَره را {باز می‌کُنَم}.", en: "I'm opening the window." },
        b: { fa: "پَنْجَره {باز می‌شه}.", written: "پَنْجَره {باز می‌شَوَد}.", en: "The window opens. / The window is opening." },
        diff: "With کَرْدَن someone does it, and the window is the object (with را). With شُدَن it happens to the window, which becomes the subject.",
      },
      { type: "heading", text: "Common mistake" },
      {
        type: "callout",
        kind: "mistake",
        title: "The prefix on the wrong part",
        text: "می and نـ belong to the light verb, directly before it, never to the noun in front: کار می‌کُنَم, کار نِمی‌کُنَم.",
        wrong: { fa: "{می‌کار} کُنَم.", en: "(meant: I work)" },
        right: { fa: "کار {می‌کُنَم}.", en: "I work." },
      },
      { type: "heading", text: "In real conversation" },
      {
        type: "dialogue",
        title: "Getting to know someone",
        lines: [
          { who: "Ali", fa: "چیکار {می‌کُنی}؟", written: "چه کار {می‌کُنی}؟", en: "What do you do?" },
          {
            who: "Nazanin",
            fa: "مُعَلِّمَم. تو یه مَدْرِسه {کار می‌کُنَم}.",
            written: "مُعَلِّم هَسْتَم. دَر یِک مَدْرِسه {کار می‌کُنَم}.",
            en: "I'm a teacher. I work at a school.",
          },
          { who: "Ali", fa: "کُجا {زِنْدِگی می‌کُنی}؟", en: "Where do you live?" },
          { who: "Nazanin", fa: "تِهْرون. وَلی شیرازی‌اَم.", written: "تِهْران. وَلی شیرازی هَسْتَم.", en: "Tehran. But I'm from Shiraz." },
        ],
        note: "چیکار می‌کُنی؟ asks about a job as well as what someone is doing right now. In کار می‌کُنَم and زِنْدِگی می‌کُنی the noun stays put, and the light verb takes می and the ending.",
      },
      {
        type: "quiz",
        questions: [
          { prompt: "Write *I work* (two words).", lang: "fa", answers: ["کار می‌کنم"], explain: "کار می‌کُنَم: the light verb کَرْدَن takes می and the ending." },
          {
            prompt: "Spoken: *I don't work* (two words).",
            lang: "fa",
            answers: ["کار نمی‌کنم"],
            explain: "کار نِمی‌کُنَم: نـ goes on the light verb, before می.",
          },
          {
            prompt: "Which light verb makes *to open, come open* (by itself) from باز: کَرْدَن or شُدَن? Type its transliteration.",
            lang: "translit",
            answers: ["shodan", "baz shodan", "bâz shodan"],
            explain: "باز شُدَن (*bâz shodan*); باز کَرْدَن is someone opening something.",
          },
          {
            prompt: "Translate: فارْسی یاد می‌گیرَم.",
            lang: "en",
            answers: ["i'm learning persian", "i am learning persian", "i learn persian", "i'm learning farsi", "i am learning farsi", "i learn farsi"],
            explain: "*fârsi yâd migiram*: یاد گِرِفْتَن, literally *to take memory*.",
          },
        ],
      },
    ],
  },
];
