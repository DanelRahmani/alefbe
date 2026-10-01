import type { Lesson } from "../types";
import { VERBS, verbById } from "../verbs";
import { table, type Style, type Tense } from "@/lib/conjugate";

// Unit 8, want, can, must: the subjunctive and what uses it, commands, and
// the future. Spoken Tehrani first, written beneath. Conjugation tables come
// from lib/conjugate.ts. Examples are original. The slugs `subjunctive`,
// `commands` and `future` are the ones the trainer's tenses open with.

const SOURCE =
  "Thackston, An Introduction to Persian, on the subjunctive, the imperative and the future; Mahootian, Persian (Routledge Descriptive Grammars), on mood and modality; Lazard, A Grammar of Contemporary Persian; Stilo, Talattof and Clinton, Modern Persian: Spoken and Written, for the Tehrani forms.";

const forms = (id: string, tense: Tense, style: Style, negative = false) => table(verbById.get(id)!, tense, style, negative, VERBS);

const WHO = [
  "I (مَن)",
  "you (تُو)",
  "he, she (اون / او)",
  "we (ما)",
  "you (شُما)",
  "they (اونا / آن‌ها)",
];

/** Rows of Who | Spoken | Written for one verb in one tense. */
const spokenWritten = (id: string, tense: Tense, negative = false) => {
  const s = forms(id, tense, "spoken", negative);
  const w = forms(id, tense, "written", negative);
  return WHO.map((who, i) => [who, s[i], w[i]]);
};

/** Rows of Who | Spoken | Written for a helper verb in the present followed by another verb's subjunctive. */
const withSubjunctive = (helper: string, id: string) => {
  const row = (style: Style) => {
    const h = forms(helper, "present", style);
    const v = forms(id, "subjunctive", style);
    return h.map((x, i) => `${x} ${v[i]}`);
  };
  const s = row("spoken");
  const w = row("written");
  return WHO.map((who, i) => [who, s[i], w[i]]);
};

/** A row of the command table: the verb, the command to تو, and to شما in speech and in writing. */
const commandRow = (id: string) => {
  const v = verbById.get(id)!;
  const s = forms(id, "imperative", "spoken");
  const w = forms(id, "imperative", "written");
  return [`${v.inf}, ${v.en}`, s[0], s[1], w[1]];
};

export const wantCanMust: Lesson[] = [
  {
    slug: "subjunctive",
    title: "The subjunctive: بـ in place of می",
    summary: "Swap می for بـ and the verb stops stating a fact: بِرَم, that I go. It is the form for what is wanted, possible or suggested.",
    register: "both",
    kinds: ["verbs", "grammar"],
    source: SOURCE,
    vocab: [
      { fa: "شایَد", en: "maybe, perhaps", topic: "everyday" },
      { fa: "بِلیت", en: "ticket", topic: "things" },
      { fa: "پَس", en: "then, so", topic: "everyday" },
    ],
    blocks: [
      {
        type: "idea",
        text: "The present with می states a **fact**. Swap می for **بـ** and you have the **subjunctive**, the form for what is only wanted, possible or suggested: می‌رَم, *I'm going*; بِرَم, *that I go*.",
      },
      {
        type: "text",
        text: "The subjunctive (مُضارِعِ اِلْتِزامی, *mozâre'-e eltezâmi*) is the present with بـ (*be-*) where می was: the same stem and the same endings, in speech and in writing. بـ is joined straight on, with no half-space. The negative puts نـ (*na-*) in the place of بـ: بِرَم → نَرَم. Before a stem that starts with a vowel, such as آ, the prefix is بی: بیام (*biyâm*), written بیایَم. There the negative takes a ی too, as in the past (lesson 7.2): بیام → نَیام. Two verbs go their own way. *To be* uses the stem باش with no prefix: باشَم, باشی. *To have* is داشْته باشَم, the participle داشْته plus that باشَم. And the compounds with کَرْدَن and شُدَن usually drop بـ: کار کُنَم, بیدار شَم (written بیدار شَوَم).",
      },
      {
        type: "table",
        caption: "رَفْتَن, to go: *that I go*",
        headers: ["Who", "Spoken", "Written"],
        rows: spokenWritten("raftan", "subjunctive"),
      },
      {
        type: "table",
        caption: "بودَن, to be: *that I be*",
        headers: ["Who", "Spoken", "Written"],
        rows: spokenWritten("budan", "subjunctive"),
      },
      {
        type: "text",
        text: "Where does it appear? Most often after the verbs for *want*, *can* and *must* (the next three lessons), and usually after شایَد (*maybe*). It also stands on its own, as a suggestion or a question about what to do: بِریم is *let's go*, and بِرَم؟ is *shall I go?* Later units add more places: after *if*, and after words for purpose and necessity.",
      },
      { type: "heading", text: "Core examples" },
      {
        type: "examples",
        items: [
          { fa: "{بِریم}؟", written: "{بِرَویم}؟", en: "Shall we go?" },
          {
            fa: "شایَد فَرْدا بارون {بیاد}.",
            written: "شایَد فَرْدا باران {بیایَد}.",
            en: "It may rain tomorrow.",
            note: "بیاد is the subjunctive of میاد: before آ the prefix is بی.",
          },
          { fa: "چی {بِگَم}؟", written: "چه {بِگویَم}؟", en: "What should I say?" },
          { fa: "شایَد خونه {نَباشه}.", written: "شایَد دَر خانه {نَباشَد}.", en: "He may not be at home. / She may not be at home." },
          { fa: "یه چایی {بِخُوریم}.", written: "یِک چای {بِخُوریم}.", en: "Let's have a tea." },
        ],
      },
      { type: "heading", text: "Contrast pair" },
      {
        type: "pair",
        title: "A fact, or an open question",
        a: { fa: "{می‌رَم}.", written: "{می‌رَوَم}.", en: "I'm going." },
        b: { fa: "{بِرَم}؟", written: "{بِرَوَم}؟", en: "Shall I go?" },
        diff: "Only the prefix changes. With می it is happening, or settled. With بـ it is still open: a suggestion, a wish, a possibility.",
      },
      { type: "heading", text: "Common mistake" },
      {
        type: "callout",
        kind: "mistake",
        title: "Keeping بـ in the negative",
        text: "نـ does not go in front of بـ: it replaces it. The same is true of commands (lesson 8.5).",
        wrong: { fa: "شایَد {نَبِرَم}.", en: "(meant: I may not go)" },
        right: { fa: "شایَد {نَرَم}.", written: "شایَد {نَرَوَم}.", en: "I may not go." },
      },
      { type: "heading", text: "In real conversation" },
      {
        type: "dialogue",
        title: "A free evening",
        lines: [
          { who: "Roya", fa: "کُجا {بِریم}؟", written: "کُجا {بِرَویم}؟", en: "Where shall we go?" },
          { who: "Hamid", fa: "{بِریم} سینِما؟", written: "به سینِما {بِرَویم}؟", en: "Shall we go to the cinema?" },
          { who: "Roya", fa: "شایَد بِلیت {نَداشْته باشَن}.", written: "شایَد بِلیت {نَداشْته باشَنْد}.", en: "They may not have any tickets left." },
          { who: "Hamid", fa: "پَس تو خونه یه فیلْم {بِبینیم}.", written: "پَس دَر خانه یِک فیلْم {بِبینیم}.", en: "Then let's watch a film at home." },
        ],
        note: "بِریم as a question is a suggestion: *shall we go?* نَداشْته باشَن is the subjunctive of نَدارَن: داشْتَن builds it with داشْته and باش, and نـ goes on داشْته.",
      },
      {
        type: "quiz",
        questions: [
          {
            prompt: "Spoken: turn می‌رَم into the subjunctive (one word).",
            lang: "fa",
            answers: ["برم"],
            explain: "بِرَم (*beram*): بـ in place of می. Written: بِرَوَم.",
          },
          { prompt: "Written: *that he go* (one word).", lang: "fa", answers: ["برود"], explain: "بِرَوَد; spoken بِره." },
          { prompt: "Make it negative: بِرَم.", lang: "fa", answers: ["نرم"], explain: "نَرَم (*naram*): نـ takes the place of بـ." },
          {
            prompt: "Write *let's see* (one word).",
            lang: "fa",
            answers: ["ببینیم"],
            explain: "بِبینیم: the *we* form of the subjunctive of دیدَن, used as a suggestion.",
          },
          {
            prompt: "Translate: چی بِگَم؟",
            lang: "en",
            answers: ["what should i say", "what shall i say", "what can i say", "what do i say", "what am i to say"],
            explain: "*chi begam?*: the subjunctive asks what to do, not what is happening.",
          },
        ],
      },
    ],
  },
  {
    slug: "want-to",
    title: "Want to: می‌خوام plus the subjunctive",
    summary: "Persian says “I want that I go”: می‌خوام بِرَم. Both verbs take an ending, and the second is in the subjunctive.",
    register: "both",
    kinds: ["verbs", "grammar"],
    source: SOURCE,
    vocab: [
      { fa: "کوه", en: "mountain", topic: "nature" },
      { fa: "حَیف", en: "a pity, a shame", topic: "everyday" },
      { fa: "دَفْعه", en: "time, occasion", topic: "time" },
      { fa: "کار داشْتَن", en: "to be busy, to have things to do", topic: "verbs" },
    ],
    blocks: [
      {
        type: "idea",
        text: "*I want to go* is **می‌خوام بِرَم**, literally *I want that I go*: the verb for *want*, then the second verb in the **subjunctive**, each with its own ending.",
      },
      {
        type: "text",
        text: "English puts an infinitive after *want*: *to go*. Persian does not. The second verb is a full verb with a personal ending, in the subjunctive, because the going is wanted, not yet a fact. Both verbs change with the person: می‌خوام بِرَم, می‌خوای بِری. The object and the other words that belong to the second verb usually go between the two: می‌خوام فارْسی یاد بِگیرَم. In speech a destination often comes last, after the second verb: می‌خوام بِرَم کوه. For *don't want to*, the negative goes on *want*: نِمی‌خوام بِرَم. When the wanting is in the past, only *want* changes: می‌خواسْتَم بِرَم, *I wanted to go*. The same pattern follows دوسْت داشْتَن: دوسْت دارَم بیام, *I'd like to come*.",
      },
      {
        type: "table",
        caption: "*Want to go*",
        headers: ["Who", "Spoken", "Written"],
        rows: withSubjunctive("khâstan", "raftan"),
      },
      { type: "heading", text: "Core examples" },
      {
        type: "examples",
        items: [
          { fa: "{می‌خوام} فارْسی یاد {بِگیرَم}.", written: "{می‌خواهَم} فارْسی یاد {بِگیرَم}.", en: "I want to learn Persian." },
          { fa: "چی {می‌خوای بِخُوری}؟", written: "چه {می‌خواهی بِخُوری}؟", en: "What do you want to eat?" },
          { fa: "{نِمی‌خوام بِرَم}.", written: "{نِمی‌خواهَم بِرَوَم}.", en: "I don't want to go." },
          {
            fa: "{می‌خوام} تُو هَم {بیای}.",
            written: "{می‌خواهَم} تُو هَم {بیایی}.",
            en: "I want you to come too.",
            note: "Two different people: *I* want, *you* come. Each verb carries its own ending. Writing often links the two with که: می‌خواهَم که تُو هَم بیایی.",
          },
          {
            fa: "{می‌خواسْتَم} یه سُؤال {بِپُرْسَم}.",
            written: "{می‌خواسْتَم} یِک سُؤال {بِپُرْسَم}.",
            en: "I wanted to ask a question.",
            note: "The past is on *want* only. It is also the polite way to begin a question.",
          },
        ],
      },
      { type: "heading", text: "Contrast pair" },
      {
        type: "pair",
        title: "Who is to go",
        a: { fa: "می‌خوام {بِرَم}.", written: "می‌خواهَم {بِرَوَم}.", en: "I want to go." },
        b: { fa: "می‌خوام {بِری}.", written: "می‌خواهَم {بِرَوی}.", en: "I want you to go." },
        diff: "Only the ending of the second verb changes. English needs a different construction (*want to go*, *want you to go*); Persian just changes who the second verb is about.",
      },
      { type: "heading", text: "Common mistake" },
      {
        type: "callout",
        kind: "mistake",
        title: "The infinitive after want",
        text: "After *want*, English uses *to go*, and learners reach for رَفْتَن. Persian needs a conjugated verb in the subjunctive.",
        wrong: { fa: "می‌خوام {رَفْتَن}.", written: "می‌خواهَم {رَفْتَن}.", en: "(meant: I want to go)" },
        right: { fa: "می‌خوام {بِرَم}.", written: "می‌خواهَم {بِرَوَم}.", en: "I want to go." },
      },
      { type: "heading", text: "In real conversation" },
      {
        type: "dialogue",
        title: "Plans for Friday",
        lines: [
          {
            who: "Sahar",
            fa: "آخَرِ هَفْته {می‌خوای} چیکار {کُنی}؟",
            written: "آخَرِ هَفْته {می‌خواهی} چه کار {کُنی}؟",
            en: "What do you want to do at the weekend?",
          },
          { who: "Omid", fa: "{می‌خوام بِرَم} کوه. میای؟", written: "{می‌خواهَم} به کوه {بِرَوَم}. می‌آیی؟", en: "I want to go to the mountains. Are you coming?" },
          { who: "Sahar", fa: "دوسْت دارَم {بیام}، وَلی کار دارَم.", written: "دوسْت دارَم {بیایَم}، وَلی کار دارَم.", en: "I'd like to come, but I'm busy." },
          { who: "Omid", fa: "حَیف! دَفْعهٔ بَعْد.", en: "What a shame! Next time." },
        ],
        note: "چیکار کُنی is the subjunctive of چیکار می‌کُنی: a compound with کَرْدَن usually drops بـ. کوه رَفْتَن, *going to the mountains*, is what many Tehranis do on a Friday morning: a walk up the trails north of the city.",
      },
      {
        type: "quiz",
        questions: [
          {
            prompt: "Spoken: *I want to go* (two words).",
            lang: "fa",
            answers: ["می‌خوام برم"],
            explain: "می‌خوام بِرَم: *want*, then *go* in the subjunctive, both with ـَم.",
          },
          { prompt: "Written: *I want to go* (two words).", lang: "fa", answers: ["می‌خواهم بروم"], explain: "می‌خواهَم بِرَوَم." },
          {
            prompt: "Spoken: *I want you to go* (to a friend; two words).",
            lang: "fa",
            answers: ["می‌خوام بری"],
            explain: "می‌خوام بِری: *I* want, *you* go. Only the second ending changes.",
          },
          {
            prompt: "Spoken: *I don't want to eat* (two words).",
            lang: "fa",
            answers: ["نمی‌خوام بخورم"],
            explain: "نِمی‌خوام بِخُورَم: the negative goes on *want*.",
          },
          {
            prompt: "Translate: می‌خوام فارْسی یاد بِگیرَم.",
            lang: "en",
            answers: [
              "i want to learn persian",
              "i want to learn farsi",
              "i'd like to learn persian",
              "i would like to learn persian",
              "i'd like to learn farsi",
              "i would like to learn farsi",
            ],
            explain: "*mikhâm fârsi yâd begiram*: یاد گِرِفْتَن in the subjunctive, یاد بِگیرَم.",
          },
        ],
      },
    ],
  },
  {
    slug: "can",
    title: "Can: می‌تونَم plus the subjunctive",
    summary: "“I can go” is می‌تونَم بِرَم, built like “want to”. For “may I?”, speech says می‌شه and the subjunctive.",
    register: "both",
    kinds: ["verbs", "grammar"],
    source: SOURCE,
    vocab: [
      { fa: "کُمَک کَرْدَن", en: "to help", topic: "verbs" },
      { fa: "می‌شه", written: "می‌شَوَد", en: "it is possible; may I…?", topic: "everyday" },
      { fa: "مُمْکِن", en: "possible", topic: "describing" },
      { fa: "بَلَد بودَن", en: "to know how to", topic: "verbs" },
      { fa: "شِنا", en: "swimming", topic: "everyday" },
      { fa: "کارْت", en: "card", topic: "things" },
    ],
    blocks: [
      {
        type: "idea",
        text: "*Can* works like *want*: **می‌تونَم** and then the second verb in the **subjunctive**, both with their endings: می‌تونَم بِرَم, *I can go*.",
      },
      {
        type: "text",
        text: "تَوانِسْتَن (*to be able*) is می‌تَوانَم in writing and می‌تونَم in speech (lesson 5.3). The verb after it is in the subjunctive and agrees with it: می‌تونَم بِرَم, می‌تونی بِری. *Can't* is نِمی‌تونَم. In the past the simple form is a single occasion, نَتونِسْتَم بیام (*I couldn't come, I didn't manage to*), and the form with می is a standing ability, می‌تونِسْتَم (*I could, I was able to*: lesson 7.4). To ask permission, speech prefers می‌شه, literally *does it become?*: می‌شه بیام؟, *may I come?* With a *you* verb it is a polite request: می‌شه پَنْجَره رُو باز کُنین؟, *could you open the window?* And for a skill you have learned, speech often says بَلَد: شِنا بَلَدَم, *I can swim*.",
      },
      {
        type: "table",
        caption: "*Can go*",
        headers: ["Who", "Spoken", "Written"],
        rows: withSubjunctive("tavânestan", "raftan"),
      },
      { type: "heading", text: "Core examples" },
      {
        type: "examples",
        items: [
          { fa: "{می‌تونَم} فارْسی حَرْف {بِزَنَم}.", written: "{می‌تَوانَم} فارْسی حَرْف {بِزَنَم}.", en: "I can speak Persian." },
          { fa: "{می‌تونی} به مَن کُمَک {کُنی}؟", written: "{می‌تَوانی} به مَن کُمَک {کُنی}؟", en: "Can you help me?" },
          { fa: "اِمْشَب {نِمی‌تونَم بیام}.", written: "اِمْشَب {نِمی‌تَوانَم بیایَم}.", en: "I can't come tonight." },
          {
            fa: "{می‌شه} پَنْجَره رُو باز {کُنَم}؟",
            written: "{می‌شَوَد} پَنْجَره را باز {کُنَم}؟",
            en: "May I open the window?",
            note: "می‌شه does not change with the person; the second verb says who. A more formal way to ask, in speech and in writing, is مُمْکِن اَسْت (*is it possible*): مُمْکِن اَسْت پَنْجَره را باز کُنَم؟",
          },
          { fa: "دیروز {نَتونِسْتَم} زَنْگ {بِزَنَم}.", written: "دیروز {نَتَوانِسْتَم} زَنْگ {بِزَنَم}.", en: "I couldn't call yesterday." },
          { fa: "شِنا {بَلَد نیسْتَم}.", en: "I can't swim.", note: "A skill never learned: بَلَد, not تَوانِسْتَن." },
        ],
      },
      { type: "heading", text: "Contrast pair" },
      {
        type: "pair",
        title: "Which verb is negative",
        a: { fa: "{نِمی‌تونَم} بیام.", written: "{نِمی‌تَوانَم} بیایَم.", en: "I can't come." },
        b: { fa: "می‌تونَم {نَیام}.", written: "می‌تَوانَم {نَیایَم}.", en: "I can skip it. (It's possible for me not to come.)" },
        diff: "Each verb is negated on its own, so the negative goes on the one you mean. نِمی on *can* is the usual *can't*; نـ on the second verb says that not coming is possible.",
      },
      { type: "heading", text: "Common mistake" },
      {
        type: "callout",
        kind: "mistake",
        title: "می on the second verb",
        text: "After *can*, as after *want*, the second verb is not a fact yet, so it takes بـ, not می.",
        wrong: { fa: "می‌تونَم {می‌رَم}.", written: "می‌تَوانَم {می‌رَوَم}.", en: "(meant: I can go)" },
        right: { fa: "می‌تونَم {بِرَم}.", written: "می‌تَوانَم {بِرَوَم}.", en: "I can go." },
      },
      { type: "heading", text: "In real conversation" },
      {
        type: "dialogue",
        title: "At the station",
        lines: [
          {
            who: "Traveller",
            fa: "بِبَخْشید، {می‌شه} یه سُؤال {بِپُرْسَم}؟",
            written: "بِبَخْشید، {می‌شَوَد} یِک سُؤال {بِپُرْسَم}؟",
            en: "Excuse me, may I ask a question?",
          },
          { who: "Passer-by", fa: "بِفَرْمایین.", written: "بِفَرْمایید.", en: "Go ahead." },
          { who: "Traveller", fa: "اَز کُجا {می‌تونَم} بِلیت {بِخَرَم}؟", written: "اَز کُجا {می‌تَوانَم} بِلیت {بِخَرَم}؟", en: "Where can I buy a ticket?" },
          {
            who: "Passer-by",
            fa: "اونْجا. با کارْت هَم {می‌تونین بِخَرین}.",
            written: "آنْجا. با کارْت هَم {می‌تَوانید بِخَرید}.",
            en: "Over there. You can buy it by card too.",
          },
        ],
        note: "می‌شه…؟ is the everyday way to open a request to a stranger. The passer-by answers with the polite plural *you*: می‌تونین بِخَرین, written می‌تَوانید بِخَرید.",
      },
      {
        type: "quiz",
        questions: [
          { prompt: "Spoken: *I can go* (two words).", lang: "fa", answers: ["می‌تونم برم"], explain: "می‌تونَم بِرَم; written می‌تَوانَم بِرَوَم." },
          {
            prompt: "Spoken: *I can't come* (two words).",
            lang: "fa",
            answers: ["نمی‌تونم بیام"],
            explain: "نِمی‌تونَم بیام: نِمی on *can*, and بیام is the subjunctive of آمَدَن.",
          },
          {
            prompt: "Written: *we can see* (two words).",
            lang: "fa",
            answers: ["می‌توانیم ببینیم"],
            explain: "می‌تَوانیم بِبینیم: both verbs in the *we* form.",
          },
          {
            prompt: "Spoken: ask *may I come?* with می‌شه (two words).",
            lang: "fa",
            answers: ["می‌شه بیام"],
            explain: "می‌شه بیام؟ (*mishe biyâm?*): می‌شه stays as it is; بیام says who.",
          },
          {
            prompt: "Translate: می‌تونی به مَن کُمَک کُنی؟",
            lang: "en",
            answers: ["can you help me", "could you help me", "are you able to help me", "will you help me", "can you help me out"],
            explain: "*mituni be man komak koni?*: کُمَک کَرْدَن drops بـ in the subjunctive, like other compounds with کَرْدَن.",
          },
        ],
      },
    ],
  },
  {
    slug: "must",
    title: "Must and should: بایَد",
    summary: "بایَد never changes; the verb after it is in the subjunctive and says who: بایَد بِرَم, I have to go.",
    register: "both",
    kinds: ["verbs", "grammar"],
    source: SOURCE,
    vocab: [
      { fa: "بایَد", en: "must, have to, should", topic: "everyday" },
      { fa: "لازِم", en: "necessary", topic: "describing" },
      { fa: "بیدار شُدَن", en: "to wake up, to get up", topic: "verbs" },
      { fa: "دیر کَرْدَن", en: "to be late", topic: "verbs" },
      { fa: "اِسْتِراحَت کَرْدَن", en: "to rest", topic: "verbs" },
      { fa: "چَشْم", en: "certainly, will do (literally: eye)", topic: "everyday" },
    ],
    blocks: [
      {
        type: "idea",
        text: "**بایَد** (*must*, *have to*, *should*) is one fixed word. The verb after it is in the **subjunctive** and carries the person: بایَد بِرَم, *I have to go*; بایَد بِری, *you have to go*.",
      },
      {
        type: "text",
        text: "Unlike *want* and *can*, بایَد takes no endings and is the same in speech and writing. It covers the whole range from *must* to *should*; the situation decides. Its negative is نَبایَد, and it means *must not* or *shouldn't*: نَبایَد بِری. For *don't have to*, where there is simply no need, Persian says لازِم نیسْت (*it isn't necessary*) and the subjunctive: لازِم نیسْت بِری. With the past continuous in place of the subjunctive, بایَد looks back: بایَد می‌رَفْتَم, *I should have gone* or, of something that did happen, *I had to go*. The situation decides.",
      },
      {
        type: "table",
        caption: "*Have to go*",
        headers: ["Who", "Spoken", "Written"],
        rows: (() => {
          const s = forms("raftan", "subjunctive", "spoken");
          const w = forms("raftan", "subjunctive", "written");
          return WHO.map((who, i) => [who, `بایَد ${s[i]}`, `بایَد ${w[i]}`]);
        })(),
      },
      { type: "heading", text: "Core examples" },
      {
        type: "examples",
        items: [
          { fa: "{بایَد بِرَم}.", written: "{بایَد بِرَوَم}.", en: "I have to go." },
          {
            fa: "فَرْدا {بایَد} زود بیدار {شَم}.",
            written: "فَرْدا {بایَد} زود بیدار {شَوَم}.",
            en: "I have to get up early tomorrow.",
            note: "بیدار شَم: a compound with شُدَن usually drops بـ (lesson 8.1).",
          },
          { fa: "{نَبایَد} دیر {کُنیم}.", en: "We mustn't be late." },
          { fa: "{بایَد} بیشْتَر فارْسی حَرْف {بِزَنی}.", en: "You should speak more Persian." },
          {
            fa: "{لازِم نیسْت بیای}.",
            written: "{لازِم نیسْت بیایی}.",
            en: "You don't have to come.",
            note: "No need, but no ban either. نَبایَد بیای would be *you mustn't come*.",
          },
        ],
      },
      { type: "heading", text: "Contrast pair" },
      {
        type: "pair",
        title: "Mustn't, or don't have to",
        a: { fa: "{نَبایَد} بِری.", written: "{نَبایَد} بِرَوی.", en: "You mustn't go. / You shouldn't go." },
        b: { fa: "{لازِم نیسْت} بِری.", written: "{لازِم نیسْت} بِرَوی.", en: "You don't have to go." },
        diff: "نَبایَد forbids or advises against. لازِم نیسْت only removes the need. English *must not* and *don't have to* differ in the same way.",
      },
      { type: "heading", text: "Common mistake" },
      {
        type: "callout",
        kind: "mistake",
        title: "An ending on بایَد",
        text: "Because *want* and *can* take endings, learners give one to بایَد. It never changes: the second verb alone says who.",
        wrong: { fa: "{بایَدَم} بِرَم.", written: "{بایَدَم} بِرَوَم.", en: "(meant: I have to go)" },
        right: { fa: "{بایَد} بِرَم.", written: "{بایَد} بِرَوَم.", en: "I have to go." },
      },
      { type: "heading", text: "In real conversation" },
      {
        type: "dialogue",
        title: "At the doctor's",
        lines: [
          { who: "Doctor", fa: "{بایَد} اِسْتِراحَت {کُنین}.", written: "{بایَد} اِسْتِراحَت {کُنید}.", en: "You must rest." },
          { who: "Patient", fa: "می‌تونَم {بِرَم} سَرِ کار؟", written: "می‌تَوانَم سَرِ کار {بِرَوَم}؟", en: "Can I go to work?" },
          { who: "Doctor", fa: "نَه، سه روز {نَبایَد} کار {کُنین}.", written: "نَه، سه روز {نَبایَد} کار {کُنید}.", en: "No, you mustn't work for three days." },
          { who: "Patient", fa: "چَشْم. دارو هَم {بایَد بِخُورَم}؟", en: "All right. Do I have to take medicine too?" },
          { who: "Doctor", fa: "بَله، روزی دُو بار.", en: "Yes, twice a day." },
        ],
        note: "Medicine is *eaten* in Persian: دارو خُورْدَن. روزی دُو بار is *twice a day*, literally *a day, two times*. چَشْم is the polite *certainly, I will*.",
      },
      {
        type: "quiz",
        questions: [
          { prompt: "Spoken: *I have to go* (two words).", lang: "fa", answers: ["باید برم"], explain: "بایَد بِرَم; written بایَد بِرَوَم." },
          {
            prompt: "Spoken: *you mustn't go* (to a friend; two words).",
            lang: "fa",
            answers: ["نباید بری"],
            explain: "نَبایَد بِری: the negative is on بایَد.",
          },
          {
            prompt: "Written: *they have to come* (two words).",
            lang: "fa",
            answers: ["باید بیایند"],
            explain: "بایَد بیایَنْد: بایَد does not change; the second verb is *they*.",
          },
          {
            prompt: "Which one means *you don't have to*: نَبایَد or لازِم نیسْت? Type it in Persian script.",
            lang: "fa",
            answers: ["لازم نیست"],
            explain: "لازِم نیسْت, *it isn't necessary*. نَبایَد is *must not*.",
          },
          {
            prompt: "Translate: بایَد بیشْتَر فارْسی حَرْف بِزَنی.",
            lang: "en",
            answers: [
              "you should speak more persian",
              "you must speak more persian",
              "you have to speak more persian",
              "you need to speak more persian",
              "you ought to speak more persian",
              "you should speak more farsi",
              "you must speak more farsi",
              "you have to speak more farsi",
              "you should speak persian more",
              "you have to speak persian more",
              "you must speak persian more",
              "you should speak farsi more",
              "you need to speak more farsi",
              "you ought to speak more farsi",
              "you need to speak persian more",
              "you've got to speak more persian",
            ],
            explain: "*bâyad bishtar fârsi harf bezani*: بایَد ranges from *should* to *must*.",
          },
        ],
      },
    ],
  },
  {
    slug: "commands",
    title: "Commands: بیا, بُرُو, بِفَرْمایید",
    summary: "A command to تُو is بـ and the present stem with no ending: بِبین, look. To شُما, add the plural ending: بِبینین, written بِبینید.",
    register: "both",
    kinds: ["verbs", "grammar", "culture"],
    source: SOURCE,
    vocab: [
      { fa: "بِفَرْمایین", written: "بِفَرْمایید", en: "please: go ahead, come in, here you are", topic: "everyday" },
      { fa: "نِشَسْتَن", en: "to sit, to sit down", topic: "verbs" },
      { fa: "صَبْر کَرْدَن", en: "to wait", topic: "verbs" },
      { fa: "لَحْظه", en: "moment", topic: "time" },
      { fa: "زَحْمَت کِشیدَن", en: "to go to trouble", topic: "verbs" },
      { fa: "داخِل", en: "inside (written; speech says تو)", topic: "places" },
      { fa: "خواهِش می‌کُنَم", en: "please; you're welcome", topic: "everyday" },
    ],
    blocks: [
      {
        type: "idea",
        text: "A command to one person is **بـ plus the present stem, with no ending**: بِبین, *look*; بِخُور, *eat*. To شُما, several people or one person politely, the plural ending is added: بِبینین, written بِبینید.",
      },
      {
        type: "text",
        text: "This is the imperative (اَمْر, *amr*). To شُما it is the same as the subjunctive; to تُو it is the subjunctive without its ending. The negative puts نـ in place of بـ, as in the subjunctive: نَگو, *don't say*. The commonest commands are a little irregular. *Go* is بُرُو, said *boro*. *Come* is بیا, and *don't come* is نَیا. *Be* is باش. In speech the verbs with one-letter stems bring back a fuller stem: بِگو (*say*), بِده (*give*), بِشُو (*become*); their شُما forms keep the short stem: بِگین, بِدین. And the compounds with کَرْدَن usually drop بـ: صَبْر کُن, *wait*.",
      },
      {
        type: "table",
        caption: "Everyday commands",
        headers: ["Verb", "To تُو", "To شُما, spoken", "To شُما, written"],
        rows: ["raftan", "âmadan", "goftan", "dâdan", "didan", "khordan", "kardan", "budan"].map(commandRow),
      },
      {
        type: "text",
        text: "Before a stem with *o*, Tehran speech usually says *bo-* for بـ: *bokon*, *bokhor*. The spelling does not change. A bare command is fine between friends and family. With strangers, use the شُما form, add لُطْفاً (*please*), or turn it into a question with می‌شه (lesson 8.3).",
      },
      { type: "heading", text: "Core examples" },
      {
        type: "examples",
        items: [
          { fa: "{بیا} اینْجا.", en: "Come here." },
          {
            fa: "اینْجا {بِشینین}، لُطْفاً.",
            written: "اینْجا {بِنِشینید}، لُطْفاً.",
            en: "Sit here, please.",
            note: "نِشَسْتَن, present stem نِشین, shortened in speech to شین. To one person the command is بِشین, which is spelled and said like the spoken شُما form of شُدَن (written بِشَوید); the sentence tells you which.",
          },
          { fa: "به مَن {بِگو}.", en: "Tell me." },
          { fa: "{نَرُو}!", en: "Don't go!" },
          { fa: "یه لَحْظه {صَبْر کُن}.", written: "یِک لَحْظه {صَبْر کُن}.", en: "Wait a moment." },
        ],
      },
      { type: "heading", text: "Contrast pair" },
      {
        type: "pair",
        title: "To a friend, or to شُما",
        a: { fa: "{بیا} تو.", written: "{بیا} داخِل.", en: "Come in. (to a friend)" },
        b: { fa: "{بیایین} تو.", written: "{بیایید} داخِل.", en: "Come in. (politely, or to several people)" },
        diff: "The command to تُو has no ending. For شُما the plural ending goes on: *-in* in speech, *-id* in writing. The تو after the verb here is *tu*, *in, inside* (lesson 2.5), not تُو, *you*.",
      },
      { type: "heading", text: "Common mistake" },
      {
        type: "callout",
        kind: "mistake",
        title: "The ending ـی on a command",
        text: "With its ending, بِری is the subjunctive: *that you go*, as in می‌خوام بِری. A command to تُو has no ending at all. You will hear the subjunctive used as a gentle reminder, but it is not the command.",
        wrong: { fa: "{بِری} خونه!", written: "به خانه {بِرَوی}!", en: "(meant: go home!)" },
        right: { fa: "{بُرُو} خونه!", written: "به خانه {بُرُو}!", en: "Go home!" },
      },
      {
        type: "callout",
        kind: "culture",
        title: "بِفَرْمایید",
        text: "بِفَرْمایید (spoken بِفَرْمایین) is the polite command of فَرْمودَن, *to command*, used for the other person's actions. It is the all-purpose *please*: *come in*, *sit down*, *go ahead*, *after you*, *here you are*, *help yourself*. At a door, both people say it to each other before one of them gives in. That is تَعارُف (*ta'ârof*), the everyday courtesy of putting the other person first.",
      },
      { type: "heading", text: "In real conversation" },
      {
        type: "dialogue",
        title: "At the door",
        lines: [
          { who: "Host", fa: "سَلام! {بِفَرْمایین} تو.", written: "سَلام! {بِفَرْمایید} داخِل.", en: "Hello! Please come in." },
          { who: "Guest", fa: "خواهِش می‌کُنَم، شُما {بِفَرْمایین}.", written: "خواهِش می‌کُنَم، شُما {بِفَرْمایید}.", en: "Please, after you." },
          { who: "Host", fa: "{بِفَرْمایین بِشینین}.", written: "{بِفَرْمایید بِنِشینید}.", en: "Please, have a seat." },
          { who: "Guest", fa: "مِرْسی. زَحْمَت {نَکِشین}.", written: "مُتَشَکِّرَم. زَحْمَت {نَکِشید}.", en: "Thank you. Don't go to any trouble." },
        ],
        note: "زَحْمَت نَکِشین, literally *don't pull trouble*, is what a guest says when the host starts bringing tea and fruit. The host will bring them anyway.",
      },
      {
        type: "quiz",
        questions: [
          { prompt: "Tell a friend: *go!* (one word).", lang: "fa", answers: ["برو"], explain: "بُرُو (*boro*): the one common command said with *bo-* by everyone." },
          {
            prompt: "Spoken, to شُما: *come!* (one word).",
            lang: "fa",
            answers: ["بیایین", "بیاین", "بیایید"],
            explain: "بیایین (*biyâyin*), often typed [بیاین|biyâyin]. بیایید is the written form, and is heard in polite speech too.",
          },
          { prompt: "Tell a friend: *don't say!* (one word).", lang: "fa", answers: ["نگو"], explain: "نَگو: نـ takes the place of بـ." },
          {
            prompt: "Tell a friend: *wait!* (two words, with کَرْدَن).",
            lang: "fa",
            answers: ["صبر کن"],
            explain: "صَبْر کُن: a compound with کَرْدَن usually drops بـ.",
          },
          {
            prompt: "Translate: به مَن بِگو.",
            lang: "en",
            answers: ["tell me", "say it to me", "tell it to me", "say to me"],
            explain: "*be man begu*: گُفْتَن takes به for the person told.",
          },
        ],
      },
    ],
  },
  {
    slug: "future",
    title: "The future: the present in speech, خواهَم رَفْت in writing",
    summary: "Speech uses the present with a time word: فَرْدا می‌رَم. Writing has a future of its own: خواهَم رَفْت, I will go.",
    register: "both",
    kinds: ["verbs", "grammar", "spoken"],
    source: SOURCE,
    vocab: [
      { fa: "مونْدَن", written: "مانْدَن", en: "to stay, to remain", topic: "verbs" },
      { fa: "قَطار", en: "train", topic: "things" },
      { fa: "سُوغاتی", en: "a present brought back from a trip", topic: "things" },
      { fa: "هَفْتهٔ بَعْد", en: "next week", topic: "time" },
    ],
    blocks: [
      {
        type: "idea",
        text: "Everyday Persian has **no separate future**: the present with a time word does the job: فَرْدا می‌رَم, *I'll go tomorrow*. **Writing** has one, built with خواسْتَن: خواهَم رَفْت, *I will go*.",
      },
      {
        type: "text",
        text: "In speech, the present covers the future (lesson 5.2), and a word such as فَرْدا or هَفْتهٔ بَعْد makes the time clear. For a plan, *I'm going to go* is می‌خوام بِرَم (lesson 8.2). The written future is two words. First comes the present of خواسْتَن without می, carrying the ending: خواهَم, خواهی, خواهَد. Then the **past stem** of the verb, with no ending: رَفْت. The negative goes on the first word: نَخواهَم رَفْت. In a compound verb the first part stays in front: کار خواهَم کَرْد. You will meet this future in news, forecasts, announcements and formal promises. In conversation it sounds bookish.",
      },
      {
        type: "table",
        caption: "رَفْتَن, to go: *will go* (written)",
        headers: ["Who", "Will go", "Won't go"],
        rows: (() => {
          const a = forms("raftan", "future", "written");
          const n = forms("raftan", "future", "written", true);
          return WHO.map((who, i) => [who, a[i], n[i]]);
        })(),
      },
      { type: "heading", text: "Core examples" },
      {
        type: "examples",
        items: [
          { fa: "فَرْدا {می‌رَم} تِهْرون.", written: "فَرْدا به تِهْران {خواهَم رَفْت}.", en: "I'll go to Tehran tomorrow." },
          { fa: "هَفْتهٔ بَعْد زَنْگ {می‌زَنَم}.", written: "هَفْتهٔ بَعْد زَنْگ {خواهَم زَد}.", en: "I'll call next week." },
          { fa: "فَرْدا هَوا سَرْد {می‌شه}.", written: "فَرْدا هَوا سَرْد {خواهَد شُد}.", en: "It will get cold tomorrow." },
          { fa: "{نِمیاد}.", written: "{نَخواهَد آمَد}.", en: "He won't come. / She won't come." },
          {
            fa: "قَطار ساعَتِ هَشْت {می‌رِسه}.",
            written: "قَطار ساعَتِ هَشْت {خواهَد رِسید}.",
            en: "The train will arrive at eight.",
            note: "The written line is the style of a station announcement.",
          },
        ],
      },
      { type: "heading", text: "Contrast pair" },
      {
        type: "pair",
        title: "Said, or written",
        a: { fa: "فَرْدا {می‌رَم}.", written: "فَرْدا {می‌رَوَم}.", en: "I'll go tomorrow. (the present: everyday)" },
        b: { fa: "فَرْدا {خواهَم رَفْت}.", en: "I will go tomorrow. (the future: in writing, or a formal speech)" },
        diff: "Both are correct and mean the same. The difference is register. Writing may use the present too, as the written line of the first shows; speech almost never uses خواهَم رَفْت.",
      },
      { type: "heading", text: "Common mistake" },
      {
        type: "callout",
        kind: "mistake",
        title: "An ending on the second word",
        text: "The ending goes on خواه only. The second word is the bare past stem, the same for every person: خواهَم رَفْت, خواهیم رَفْت.",
        wrong: { fa: "فَرْدا خواهَم {رَفْتَم}.", en: "(meant: I will go tomorrow)" },
        right: { fa: "فَرْدا خواهَم {رَفْت}.", en: "I will go tomorrow." },
      },
      { type: "heading", text: "In real conversation" },
      {
        type: "dialogue",
        title: "Summer plans",
        lines: [
          { who: "Neda", fa: "تابِسْتون چیکار {می‌کُنی}؟", written: "تابِسْتان چه کار {خواهی کَرْد}؟", en: "What will you do in the summer?" },
          {
            who: "Babak",
            fa: "{می‌رَم} ایران. دُو ماه {می‌مونَم}.",
            written: "به ایران {خواهَم رَفْت}. دُو ماه {خواهَم مانْد}.",
            en: "I'll go to Iran. I'll stay for two months.",
          },
          { who: "Neda", fa: "خُوش به حالِت!", written: "خُوش به حالَت!", en: "Lucky you!" },
          { who: "Babak", fa: "بَرایِ هَمه سُوغاتی {میارَم}.", written: "بَرایِ هَمه سُوغاتی {خواهَم آوَرْد}.", en: "I'll bring presents back for everyone." },
        ],
        note: "Every spoken line is the plain present; the written lines show how the same talk would read in a formal text. خُوش به حالِت is literally *good to your state*. سُوغاتی is the present a traveller is expected to bring home.",
      },
      {
        type: "quiz",
        questions: [
          { prompt: "Written: *I will go* (two words).", lang: "fa", answers: ["خواهم رفت"], explain: "خواهَم رَفْت: خواه with the ending, then the past stem." },
          {
            prompt: "Written: *she won't come* (two words).",
            lang: "fa",
            answers: ["نخواهد آمد"],
            explain: "نَخواهَد آمَد: نـ goes on the first word.",
          },
          {
            prompt: "Spoken: *I'll go tomorrow* (two words).",
            lang: "fa",
            answers: ["فردا می‌رم"],
            explain: "فَرْدا می‌رَم: the present with a time word. Speech needs no future tense.",
          },
          { prompt: "Written: *we will see* (two words).", lang: "fa", answers: ["خواهیم دید"], explain: "خواهیم دید: the ending is on خواه; دید is the past stem of دیدَن." },
          {
            prompt: "Translate: فَرْدا هَوا سَرْد خواهَد شُد.",
            lang: "en",
            answers: [
              "it will get cold tomorrow",
              "it will be cold tomorrow",
              "tomorrow it will get cold",
              "tomorrow it will be cold",
              "the weather will get cold tomorrow",
              "the weather will be cold tomorrow",
              "tomorrow the weather will get cold",
              "tomorrow the weather will be cold",
              "it will turn cold tomorrow",
              "the weather will turn cold tomorrow",
              "it'll get cold tomorrow",
              "it'll be cold tomorrow",
              "tomorrow it'll get cold",
              "tomorrow it'll be cold",
              "it is going to be cold tomorrow",
              "it's going to be cold tomorrow",
              "it will become cold tomorrow",
            ],
            explain: "*fardâ havâ sard khâhad shod*: literally *tomorrow the air will become cold*.",
          },
        ],
      },
    ],
  },
];
