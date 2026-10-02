import type { Lesson } from "../types";
import { VERBS, verbById } from "../verbs";
import { personsOf, table, type Person, type Style, type Tense } from "@/lib/conjugate";

// Unit 11, more verb forms: the past perfect, the past subjunctive, unreal
// conditions, the passive, and the کَرْدَن / شُدَن pairs with the causatives.
// Spoken Tehrani first, written beneath. Conjugation tables come from
// lib/conjugate.ts; the slugs of 11.1, 11.2 and 11.4 are the ones the
// trainer's tenses open with (TENSES). Examples are original.

const SOURCE =
  "Thackston, An Introduction to Persian, on the perfect tenses, conditionals and the passive; Mahootian, Persian (Routledge Descriptive Grammars), on mood, conditionals, the passive and causatives; Lazard, A Grammar of Contemporary Persian; Stilo, Talattof and Clinton, Modern Persian: Spoken and Written, for the Tehrani forms.";

const forms = (id: string, tense: Tense, style: Style, negative = false) => table(verbById.get(id)!, tense, style, negative, VERBS);

const WHO: Record<Person, string> = {
  "1s": "I (مَن)",
  "2s": "you (تُو)",
  "3s": "he, she (اون / او)",
  "1p": "we (ما)",
  "2p": "you (شُما)",
  "3p": "they (اونا / آن‌ها)",
};
/** The passive's subject is usually a thing. */
const WHO_THING: Partial<Record<Person, string>> = { "3s": "it (اون / آن)", "3p": "they (اونا / آن‌ها)" };

/** Rows of Who | Spoken | Written for one verb in one tense, for the persons the tense has. */
const spokenWritten = (id: string, tense: Tense, negative = false) => {
  const s = forms(id, tense, "spoken", negative);
  const w = forms(id, tense, "written", negative);
  const thing = tense === "passive" || tense === "past-passive";
  return personsOf(tense).map((p, i) => [(thing && WHO_THING[p]) || WHO[p], s[i], w[i]]);
};

export const moreVerbs: Lesson[] = [
  {
    slug: "past-perfect",
    title: "The past perfect: رَفْته بودَم",
    summary: "The participle with بودَن in the past: رَفْته بودَم, I had gone. It puts one past event before another.",
    register: "both",
    kinds: ["verbs", "grammar"],
    source: SOURCE,
    vocab: [
      { fa: "شُروع شُدَن", en: "to start, to begin (by itself)", topic: "verbs" },
      { fa: "تَموم شُدَن", written: "تَمام شُدَن", en: "to run out, to be finished", topic: "verbs" },
      { fa: "مَوقِع", en: "time, moment", topic: "time" },
      { fa: "اِشْکال", en: "problem, fault", topic: "everyday" },
    ],
    blocks: [
      {
        type: "idea",
        text: "The past perfect is the **participle** with **بودَن** in the simple past: رَفْته بودَم, *I had gone*. It puts one past event before another.",
      },
      {
        type: "text",
        text: "The participle is the past stem with ـه: رَفْته, دیده; speech builds it on its own stem: اومَده, خونْده. Add بودَم, بودی, بود… and you have the past perfect (ماضیِ بَعید, *mâzi-ye ba'id*): وَقْتی رِسیدَم، رَفْته بود, *when I arrived, he had gone*. Speech uses it the same way, with its own endings (بودین, بودَن). The negative puts نـ on the participle: نَرَفْته بودَم. Persian also uses it where English has a simpler tense: کُجا رَفْته بودی؟, *where did you go?*, said to someone who has just come back.",
      },
      { type: "table", caption: "رَفْتَن in the past perfect", headers: ["Who", "Spoken", "Written"], rows: spokenWritten("raftan", "past-perfect") },
      { type: "heading", text: "Core examples" },
      {
        type: "examples",
        items: [
          { fa: "وَقْتی رِسیدَم، فیلْم {شُروع شُده بود}.", en: "When I arrived, the film had started." },
          { fa: "قَبْلاً اونْجا {رَفْته بودَم}.", written: "قَبْلاً به آنْجا {رَفْته بودَم}.", en: "I'd been there before." },
          { fa: "کُجا {رَفْته بودی}؟", en: "Where did you go?", note: "Said to someone who has just come back." },
          { fa: "تا اون مَوقِع ناهار {نَخُورْده بودیم}.", written: "تا آن مَوقِع ناهار {نَخُورْده بودیم}.", en: "We hadn't had lunch by then." },
        ],
      },
      { type: "heading", text: "Contrast pair" },
      {
        type: "pair",
        title: "After, or before",
        a: { fa: "وَقْتی رِسیدَم، {رَفْت}.", en: "When I arrived, he left." },
        b: { fa: "وَقْتی رِسیدَم، {رَفْته بود}.", en: "When I arrived, he had left." },
        diff: "The simple past puts his leaving after my arriving; the past perfect puts it before.",
      },
      { type: "heading", text: "Common mistake" },
      {
        type: "callout",
        kind: "mistake",
        title: "The present perfect for *had*",
        text: "The present perfect (lesson 7.3) reaches up to now. For something done before another past moment, use the past perfect.",
        wrong: { fa: "وَقْتی رِسیدَم، {رَفْته}.", en: "(meant: When I arrived, he had left)" },
        right: { fa: "وَقْتی رِسیدَم، {رَفْته بود}.", en: "When I arrived, he had left." },
      },
      { type: "heading", text: "In real conversation" },
      {
        type: "dialogue",
        title: "Late for the party",
        lines: [
          { who: "Nima", fa: "چِرا دیر اومَدی؟ هَمه {رَفْته بودَن}.", written: "چِرا دیر آمَدی؟ هَمه {رَفْته بودَنْد}.", en: "Why were you so late? Everyone had left." },
          { who: "Ava", fa: "بِبَخْشید، اُتُوبوس {نَیومَده بود}.", written: "بِبَخْشید، اُتُوبوس {نَیامَده بود}.", en: "Sorry, the bus hadn't come." },
          { who: "Nima", fa: "غَذا هَم {تَموم شُده بود}.", written: "غَذا هَم {تَمام شُده بود}.", en: "And the food had run out." },
          { who: "Ava", fa: "اِشْکال نَداره. قَبْلاً شام {خُورْده بودَم}.", written: "اِشْکال نَدارَد. قَبْلاً شام {خُورْده بودَم}.", en: "Never mind. I'd already had dinner." },
        ],
        note: "تَموم شُدَن, written تَمام شُدَن, is *to run out, to be finished*. اِشْکال نَداره, *it's no problem*, is the everyday *never mind*.",
      },
      {
        type: "quiz",
        questions: [
          { prompt: "Written: *I had gone* (two words).", lang: "fa", answers: ["رفته بودم"], explain: "رَفْته بودَم: the participle رَفْته, then بودَم." },
          { prompt: "Make it negative: رَفْته بودیم.", lang: "fa", answers: ["نرفته بودیم"], explain: "نَرَفْته بودیم: نـ goes on the participle." },
          { prompt: "Spoken: *they had come* (two words).", lang: "fa", answers: ["اومده بودَن"], explain: "اومَده بودَن (*umade budan*): speech builds the participle on اومَد." },
          {
            prompt: "*When I arrived, he had left*: وَقْتی رِسیدَم، ___ (two words).",
            lang: "fa",
            answers: ["رفته بود"],
            explain: "رَفْته بود: his leaving came before my arriving.",
          },
          {
            prompt: "Translate: کُجا رَفْته بودی؟",
            lang: "en",
            answers: ["where have you been", "where had you gone", "where did you go", "where were you", "where'd you go", "where have you gone"],
            explain: "*kojâ rafte budi?*: the everyday question to someone who has just come back.",
          },
        ],
      },
    ],
  },
  {
    slug: "past-subjunctive",
    title: "The past subjunctive: رَفْته باشَم",
    summary: "The participle with باشَم: شایَد رَفْته باشه, he may have gone. It looks back at something that may already have happened.",
    register: "both",
    kinds: ["verbs", "grammar"],
    source: SOURCE,
    vocab: [
      { fa: "شایَد", en: "maybe, perhaps", topic: "everyday" },
      { fa: "تا حالا", en: "by now; so far", topic: "time" },
    ],
    blocks: [
      {
        type: "idea",
        text: "The past subjunctive is the **participle** with **باشَم**: شایَد رَفْته باشه, *he may have gone*. It goes where the subjunctive goes, for something that may already have happened.",
      },
      {
        type: "text",
        text: "باشَم, باشی, باشه… is the subjunctive of بودَن (lesson 8.1); with the participle in front it becomes the past subjunctive (ماضیِ اِلْتِزامی, *mâzi-ye eltezâmi*). It follows the same words as the present subjunctive: شایَد (*maybe*), اُمیدْوارَم (*I hope*), فِکْر نِمی‌کُنَم (*I don't think*). After بایَد it is usually a conclusion: بایَد رِسیده باشَن, *they must have arrived*, where بایَد with the past continuous was *should have* (lesson 8.4). With a deadline, such as تا فَرْدا, it says something must be done by then. The negative puts نـ on the participle: نَرَفْته باشه.",
      },
      { type: "table", caption: "رَفْتَن in the past subjunctive", headers: ["Who", "Spoken", "Written"], rows: spokenWritten("raftan", "past-subjunctive") },
      { type: "heading", text: "Core examples" },
      {
        type: "examples",
        items: [
          { fa: "شایَد {رَفْته باشه}.", written: "شایَد {رَفْته باشَد}.", en: "He may have gone." },
          { fa: "بایَد تا حالا {رِسیده باشَن}.", written: "بایَد تا حالا {رِسیده باشَنْد}.", en: "They must have arrived by now." },
          { fa: "اُمیدْوارَم خوب {خوابیده باشی}.", en: "I hope you slept well." },
          { fa: "فِکْر نِمی‌کُنَم {دیده باشه}.", written: "فِکْر نِمی‌کُنَم {دیده باشَد}.", en: "I don't think she's seen it." },
        ],
      },
      { type: "heading", text: "Contrast pair" },
      {
        type: "pair",
        title: "Ahead, or already",
        a: { fa: "شایَد {بِره}.", written: "شایَد {بِرَوَد}.", en: "He may go." },
        b: { fa: "شایَد {رَفْته باشه}.", written: "شایَد {رَفْته باشَد}.", en: "He may have gone." },
        diff: "The present subjunctive looks ahead; the past subjunctive looks back at something that may already have happened.",
      },
      { type: "heading", text: "Common mistake" },
      {
        type: "callout",
        kind: "mistake",
        title: "*Must have* is not *should have*",
        text: "بایَد with the past continuous is *should have* or *had to* (lesson 8.4). For a conclusion, *must have*, use the past subjunctive.",
        wrong: { fa: "بایَد {می‌رَفْت}.", en: "(meant: He must have gone; this says he should have gone)" },
        right: { fa: "بایَد {رَفْته باشه}.", written: "بایَد {رَفْته باشَد}.", en: "He must have gone." },
      },
      { type: "heading", text: "In real conversation" },
      {
        type: "dialogue",
        title: "Where's Babak?",
        lines: [
          { who: "Shirin", fa: "بابَک کُجاسْت؟", en: "Where's Babak?" },
          { who: "Kaveh", fa: "نِمی‌دونَم. شایَد خونه {رَفْته باشه}.", written: "نِمی‌دانَم. شایَد به خانه {رَفْته باشَد}.", en: "I don't know. Maybe he's gone home." },
          {
            who: "Shirin",
            fa: "کیفِش اینْجاسْت. فِکْر نِمی‌کُنَم {رَفْته باشه}.",
            written: "کیفَش اینْجاسْت. فِکْر نِمی‌کُنَم {رَفْته باشَد}.",
            en: "His bag is here. I don't think he's gone.",
          },
        ],
        note: "شایَد and فِکْر نِمی‌کُنَم take the subjunctive: the present one for now or later, the past one for what may already have happened.",
      },
      {
        type: "quiz",
        questions: [
          { prompt: "Written: *(that) I have gone* (two words).", lang: "fa", answers: ["رفته باشم"], explain: "رَفْته باشَم: the participle, then باشَم." },
          { prompt: "Spoken: *maybe he's gone* (three words).", lang: "fa", answers: ["شایَد رفته باشه"], explain: "شایَد رَفْته باشه (*shâyad rafte bâshe*)." },
          { prompt: "Spoken: *they must have arrived* (three words).", lang: "fa", answers: ["باید رسیده باشن"], explain: "بایَد رِسیده باشَن: بایَد with the past subjunctive is *must have*." },
          { prompt: "Make it negative: رَفْته باشَد.", lang: "fa", answers: ["نرفته باشد"], explain: "نَرَفْته باشَد: نـ goes on the participle." },
          {
            prompt: "Translate: اُمیدْوارَم خوب خوابیده باشی.",
            lang: "en",
            answers: ["i hope you slept well", "i hope you've slept well", "i hope you have slept well", "i hope you had a good sleep", "i hope you had a good night's sleep", "i hope you had a good night"],
            explain: "*omidvâram khub khâbide bâshi*.",
          },
        ],
      },
    ],
  },
  {
    slug: "unreal-if",
    title: "Unreal conditions: اَگه می‌دونِسْتَم…",
    summary: "For what isn't so, or didn't happen, both halves take past forms: اَگه می‌دونِسْتَم، بِهِت می‌گُفْتَم, if I knew (or had known), I'd tell (or have told) you.",
    register: "both",
    kinds: ["verbs", "grammar"],
    source: SOURCE,
    vocab: [
      { fa: "پول", en: "money", topic: "things" },
      { fa: "جَواب دادَن", en: "to answer", topic: "verbs" },
      { fa: "کُنْسِرْت", en: "concert", topic: "everyday" },
    ],
    blocks: [
      {
        type: "idea",
        text: "For something that isn't so, or didn't happen, both halves take **past** forms, usually the **past continuous**: اَگه می‌دونِسْتَم، بِهِت می‌گُفْتَم, *if I knew, I'd tell you*.",
      },
      {
        type: "text",
        text: "A real condition (lesson 10.3) may still come true; an unreal one is contrary to fact. Speech uses the past continuous in both halves, for now and for the past alike: اَگه می‌دونِسْتَم، بِهِت می‌گُفْتَم is *if I knew, I would tell you* and *if I had known, I would have told you*; the context decides. Speech and writing can both make the past clear with the past perfect in the if-half: اَگه اومَده بودی…, اَگَر آمَده بودی…, *if you had come…*; writing does so more often. بودَن and داشْتَن take no می (lesson 7.4), so their simple past serves: اَگه جایِ تُو بودَم, *if I were you*; اَگه پول داشْتَم, *if I had money*. With them the if-half looks like a real condition, and the other half shows which is meant.",
      },
      { type: "heading", text: "Core examples" },
      {
        type: "examples",
        items: [
          {
            fa: "اَگه {می‌دونِسْتَم}، بِهِت {می‌گُفْتَم}.",
            written: "اَگَر {می‌دانِسْتَم}، به تُو {می‌گُفْتَم}.",
            en: "If I knew, I'd tell you.",
            note: "Also *if I had known, I would have told you*: speech uses the same form for both.",
          },
          { fa: "اَگه پول {داشْتَم}، یه ماشین {می‌خَریدَم}.", written: "اَگَر پول {داشْتَم}، یِک ماشین {می‌خَریدَم}.", en: "If I had money, I'd buy a car." },
          { fa: "اَگه جایِ تُو {بودَم}، {نِمی‌رَفْتَم}.", written: "اَگَر جایِ تُو {بودَم}، {نِمی‌رَفْتَم}.", en: "If I were you, I wouldn't go." },
          {
            fa: "اَگه زودْتَر {اومَده بودی}، عَلی رُو {می‌دیدی}.",
            written: "اَگَر زودْتَر {آمَده بودی}، عَلی را {می‌دیدی}.",
            en: "If you'd come earlier, you'd have seen Ali.",
          },
        ],
      },
      { type: "heading", text: "Contrast pair" },
      {
        type: "pair",
        title: "A real plan, or an unreal one",
        a: { fa: "اَگه وَقْت داشْتَم، {میام}.", written: "اَگَر وَقْت داشْتَم، {می‌آیَم}.", en: "If I have time, I'll come." },
        b: { fa: "اَگه وَقْت داشْتَم، {میومَدَم}.", written: "اَگَر وَقْت داشْتَم، {می‌آمَدَم}.", en: "If I had time, I'd come." },
        diff: "The if-half is the same: داشْتَن has no past continuous, and its simple past can look ahead (lesson 10.3). The other half decides: میام is a plan that may come true; میومَدَم is unreal.",
      },
      { type: "heading", text: "Common mistake" },
      {
        type: "callout",
        kind: "mistake",
        title: "*Would* is the past continuous",
        text: "English *would* has no word of its own in Persian: the past continuous does its work. With the present, the sentence becomes a real plan.",
        wrong: { fa: "اَگه پول داشْتَم، یه ماشین {می‌خَرَم}.", en: "(meant: If I had money, I'd buy a car; this says: if I have money, I'll buy one)" },
        right: { fa: "اَگه پول داشْتَم، یه ماشین {می‌خَریدَم}.", written: "اَگَر پول داشْتَم، یِک ماشین {می‌خَریدَم}.", en: "If I had money, I'd buy a car." },
      },
      { type: "heading", text: "In real conversation" },
      {
        type: "dialogue",
        title: "The concert",
        lines: [
          { who: "Sam", fa: "کُنْسِرْتِ دیشَب عالی بود. چِرا نَیومَدی؟", written: "کُنْسِرْتِ دیشَب عالی بود. چِرا نَیامَدی؟", en: "Last night's concert was great. Why didn't you come?" },
          {
            who: "Nazanin",
            fa: "اَگه {می‌دونِسْتَم}، {میومَدَم}! کَسی بِهَم نَگُفْت.",
            written: "اَگَر {می‌دانِسْتَم}، {می‌آمَدَم}! کَسی به مَن نَگُفْت.",
            en: "If I'd known, I'd have come! Nobody told me.",
          },
          {
            who: "Sam",
            fa: "اَگه تِلِفُن رُو جَواب {می‌دادی}، بِهِت {می‌گُفْتَم}.",
            written: "اَگَر به تِلِفُن جَواب {می‌دادی}، به تُو {می‌گُفْتَم}.",
            en: "If you'd answered the phone, I'd have told you.",
          },
          { who: "Nazanin", fa: "حَیف شُد!", en: "What a shame!" },
        ],
        note: "Both halves are the past continuous, though everything here is already past: speech marks *had known*, *would have come* this way. کَسی with a negative verb is *nobody*.",
      },
      {
        type: "quiz",
        questions: [
          { prompt: "Spoken: *if I knew* (two words).", lang: "fa", answers: ["اگه می‌دونستم"], explain: "اَگه می‌دونِسْتَم: the past continuous of دونِسْتَن." },
          { prompt: "Spoken: *if I were you* (four words).", lang: "fa", answers: ["اگه جای تو بودم", "اگه جای شما بودم"], explain: "اَگه جایِ تُو بودَم: بودَن takes no می, so its simple past serves." },
          {
            prompt: "Written: *I would buy*, as in *if I had money, I would buy a car* (one word).",
            lang: "fa",
            answers: ["می‌خریدم"],
            explain: "می‌خَریدَم: the past continuous does the work of *would*.",
          },
          {
            prompt: "Complete with داشْتَن: اَگه پول ___، یه ماشین می‌خَریدَم. (one word)",
            lang: "fa",
            answers: ["داشتم"],
            explain: "داشْتَم: داشْتَن takes no می, so the simple past serves.",
          },
          {
            prompt: "Translate: اَگه جایِ تُو بودَم، نِمی‌رَفْتَم.",
            lang: "en",
            answers: [
              "if i were you i wouldn't go",
              "if i were you i would not go",
              "if i was you i wouldn't go",
              "if i was you i would not go",
              "if i were in your place i wouldn't go",
              "if i were you i wouldn't have gone",
              "if i had been you i wouldn't have gone",
              "if i'd been you i wouldn't have gone",
              "i wouldn't go if i were you",
              "i wouldn't have gone if i were you",
            ],
            explain: "*age jâ-ye to budam, nemiraftam*: literally *if I were in your place*.",
          },
        ],
      },
    ],
  },
  {
    slug: "passive",
    title: "The passive with شُدَن: دیده شُد",
    summary: "The participle with شُدَن: دیده می‌شَوَد, it is seen; دیده شُد, it was seen. Only verbs that take an object have one.",
    register: "both",
    kinds: ["verbs", "grammar"],
    source: SOURCE,
    vocab: [
      { fa: "ساخْتَن", en: "to build, to make", topic: "verbs" },
      { fa: "پُخْتَن", en: "to cook, to bake", topic: "verbs" },
      { fa: "فِرِسْتادَن", en: "to send", topic: "verbs" },
      { fa: "کِشیدَن", en: "to draw; to pull", topic: "verbs" },
      { fa: "کاخ", en: "palace", topic: "places" },
      { fa: "نَقّاشی", en: "painting", topic: "things" },
      { fa: "شِعْر", en: "poem, poetry", topic: "learning" },
    ],
    blocks: [
      {
        type: "idea",
        text: "The passive is the **participle** with **شُدَن**: دیده می‌شَوَد, *it is seen*; دیده شُد, *it was seen*.",
      },
      {
        type: "text",
        text: "شُدَن (*to become*) carries the tense, the person and the negative; the participle stays the same: دیده شُد, دیده نَشُد, دیده می‌شَوَد, دیده خواهَد شُد. The thing done to is the subject, so it loses its را. Only a verb that takes an object has a passive: رَفْتَن and آمَدَن have none. Persian usually leaves out who did it; news writing sometimes names the doer with تَوَسُّطِ (*by*), a use that style guides discourage. Speech uses the passive less than writing and often says *they* with the active verb instead: این خونه رُو ساخْتَن, *they built this house*. Many compound verbs make their passive another way, with شُدَن in place of کَرْدَن (lesson 11.5).",
      },
      { type: "table", caption: "دیدَن in the present passive", headers: ["Who", "Spoken", "Written"], rows: spokenWritten("didan", "passive") },
      { type: "table", caption: "دیدَن in the past passive", headers: ["Who", "Spoken", "Written"], rows: spokenWritten("didan", "past-passive") },
      { type: "heading", text: "Core examples" },
      {
        type: "examples",
        items: [
          { fa: "این شِعْر صَد سال پیش {نِوِشْته شُد}.", en: "This poem was written a hundred years ago." },
          { fa: "نون هَر روز صُبْح {پُخْته می‌شه}.", written: "نان هَر روز صُبْح {پُخْته می‌شَوَد}.", en: "The bread is baked every morning." },
          { fa: "نامه هَنوز {فِرِسْتاده نَشُده}.", written: "نامه هَنوز {فِرِسْتاده نَشُده اَسْت}.", en: "The letter hasn't been sent yet." },
          { fa: "این غَذا سَرْد {خُورْده می‌شه}.", written: "این غَذا سَرْد {خُورْده می‌شَوَد}.", en: "This dish is eaten cold." },
        ],
      },
      { type: "heading", text: "Contrast pair" },
      {
        type: "pair",
        title: "They built it, or it was built",
        a: { fa: "این خونه رُو پارْسال {ساخْتَن}.", written: "این خانه را پارْسال {ساخْتَنْد}.", en: "They built this house last year." },
        b: { fa: "این خونه پارْسال {ساخْته شُد}.", written: "این خانه پارْسال {ساخْته شُد}.", en: "This house was built last year." },
        diff: "Speech usually says *they built it*, with *they* left vague; writing uses the passive more. In the passive the house is the subject, so it loses its را.",
      },
      { type: "heading", text: "Common mistake" },
      {
        type: "callout",
        kind: "mistake",
        title: "را in the passive",
        text: "را marks the object of a verb. In the passive the thing done to is the subject, so it takes no را.",
        wrong: { fa: "این خونه {رُو} ساخْته شُد.", en: "(meant: This house was built)" },
        right: { fa: "این خونه {ساخْته شُد}.", written: "این خانه {ساخْته شُد}.", en: "This house was built." },
      },
      { type: "heading", text: "In real conversation" },
      {
        type: "dialogue",
        title: "At the palace museum",
        lines: [
          { who: "Guide", fa: "این کاخ دِویسْت سال پیش {ساخْته شُد}.", en: "This palace was built two hundred years ago." },
          { who: "Visitor", fa: "این نَقّاشی‌ها کَی {کِشیده شُدَن}؟", written: "این نَقّاشی‌ها کَی {کِشیده شُدَنْد}؟", en: "When were these paintings painted?" },
          { who: "Guide", fa: "هَمون مَوقِع.", written: "هَمان مَوقِع.", en: "At the same time." },
        ],
        note: "Persian *draws* a painting: کِشیدَن. In writing a plural thing can also take the singular verb: نَقّاشی‌ها کِشیده شُد.",
      },
      {
        type: "quiz",
        questions: [
          { prompt: "Written: *it was seen* (two words).", lang: "fa", answers: ["دیده شد"], explain: "دیده شُد: the participle دیده, then شُد." },
          { prompt: "Written: *it gets written*, as a regular event (two words), from نِوِشْتَن.", lang: "fa", answers: ["نوشته می‌شود"], explain: "نِوِشْته می‌شَوَد; spoken نِوِشْته می‌شه." },
          { prompt: "Make it negative: دیده شُد.", lang: "fa", answers: ["دیده نشد"], explain: "دیده نَشُد: the negative goes on شُدَن." },
          { prompt: "Does رَفْتَن have a passive? Type yes or no.", lang: "en", answers: ["no"], explain: "No: رَفْتَن takes no object, so nothing can be *gone*." },
          {
            prompt: "Translate: این خونه پارْسال ساخْته شُد.",
            lang: "en",
            answers: ["this house was built last year", "the house was built last year", "last year this house was built", "this home was built last year"],
            explain: "*in khune pârsâl sâkhte shod*.",
          },
        ],
      },
    ],
  },
  {
    slug: "kardan-shodan",
    title: "کَرْدَن and شُدَن pairs, and causatives",
    summary: "With کَرْدَن someone does it; with شُدَن it happens by itself: باز کَرْدَم, I opened it; باز شُد, it opened. A few verbs make someone do it with ـانْدَن.",
    register: "both",
    kinds: ["verbs", "grammar"],
    source: SOURCE,
    vocab: [
      { fa: "شُروع کَرْدَن", en: "to start, to begin (something)", topic: "verbs" },
      { fa: "پَیدا کَرْدَن", en: "to find", topic: "verbs" },
      { fa: "پَیدا شُدَن", en: "to turn up, to be found", topic: "verbs" },
      { fa: "خوابونْدَن", written: "خوابانْدَن", en: "to put to sleep, to put to bed", topic: "verbs" },
      { fa: "رِسونْدَن", written: "رِسانْدَن", en: "to give a lift, to drop off; to deliver", topic: "verbs" },
      { fa: "خَنْدونْدَن", written: "خَنْدانْدَن", en: "to make laugh", topic: "verbs" },
      { fa: "خُدا", en: "God", topic: "everyday" },
    ],
    blocks: [
      {
        type: "idea",
        text: "Many compound verbs come in pairs: with **کَرْدَن** someone does it to something; with **شُدَن** it happens by itself: پَنْجَره رُو باز کَرْدَم, *I opened the window*; پَنْجَره باز شُد, *the window opened*.",
      },
      {
        type: "text",
        text: "A compound with کَرْدَن takes an object; its partner with شُدَن takes none, and its subject is what was the object. This is how most compound verbs say what English says with a passive or with the same verb used both ways (*I opened it*, *it opened*). Lesson 5.6 met باز کَرْدَن and باز شُدَن. Not every شُدَن verb has a کَرْدَن partner, and not every pair is exact, so learn them as pairs.",
      },
      {
        type: "table",
        caption: "Some everyday pairs",
        headers: ["With کَرْدَن (someone does it)", "With شُدَن (it happens)", "Meaning"],
        rows: [
          ["باز کَرْدَن", "باز شُدَن", "open"],
          ["تَمام کَرْدَن", "تَمام شُدَن", "finish (spoken تَموم)"],
          ["شُروع کَرْدَن", "شُروع شُدَن", "start"],
          ["گُم کَرْدَن", "گُم شُدَن", "lose / get lost"],
          ["پَیدا کَرْدَن", "پَیدا شُدَن", "find / turn up"],
          ["بیدار کَرْدَن", "بیدار شُدَن", "wake (someone) / wake up"],
        ],
      },
      {
        type: "text",
        text: "The other way round, a few simple verbs make a **causative**, *make someone do it*, with ـانْدَن on the present stem: خوابیدَن (*to sleep*) → خوابانْدَن, *to put to sleep*. Speech says ـونْدَن (*ân* → *un*, lesson 0.3), and writing also has a longer ـانیدَن: خوابانیدَن. Most verbs have no such form.",
      },
      {
        type: "table",
        caption: "Three causatives",
        headers: ["Verb", "Causative", "Spoken"],
        rows: [
          ["خوابیدَن, *to sleep*", "خوابانْدَن, *to put to sleep*", "خوابونْدَن"],
          ["رِسیدَن, *to arrive*", "رِسانْدَن, *to take someone, to deliver*", "رِسونْدَن"],
          ["خَنْدیدَن, *to laugh*", "خَنْدانْدَن, *to make laugh*", "خَنْدونْدَن"],
        ],
      },
      { type: "heading", text: "Core examples" },
      {
        type: "examples",
        items: [
          { fa: "پَنْجَره رُو {باز کَرْدَم}.", written: "پَنْجَره را {باز کَرْدَم}.", en: "I opened the window." },
          { fa: "پَنْجَره {باز شُد}.", en: "The window opened." },
          { fa: "کِلاس ساعَتِ نُهْ {شُروع می‌شه}.", written: "کِلاس ساعَتِ نُهْ {شُروع می‌شَوَد}.", en: "The class starts at nine." },
          { fa: "بَچّه رُو {خوابونْدَم}.", written: "بَچّه را {خوابانْدَم}.", en: "I put the child to bed." },
          { fa: "مَنُو تا خونه {رِسونْد}.", written: "مَرا تا خانه {رِسانْد}.", en: "She gave me a lift home." },
        ],
      },
      { type: "heading", text: "Contrast pair" },
      {
        type: "pair",
        title: "We started it, or it started",
        a: { fa: "کِلاس رُو {شُروع کَرْدیم}.", written: "کِلاس را {شُروع کَرْدیم}.", en: "We started the class." },
        b: { fa: "کِلاس {شُروع شُد}.", en: "The class started." },
        diff: "With کَرْدَن someone starts something, and the class is the object, with را. With شُدَن the class starts by itself, and it is the subject.",
      },
      { type: "heading", text: "Common mistake" },
      {
        type: "callout",
        kind: "mistake",
        title: "گُم کَرْدَم or گُم شُدَم",
        text: "*I got lost* is the شُدَن verb. With کَرْدَن it says you lost something, even with no object named.",
        wrong: { fa: "تو بازار {گُم کَرْدَم}.", en: "(meant: I got lost in the bazaar; this says I lost something there)" },
        right: { fa: "تو بازار {گُم شُدَم}.", written: "دَر بازار {گُم شُدَم}.", en: "I got lost in the bazaar." },
      },
      { type: "heading", text: "In real conversation" },
      {
        type: "dialogue",
        title: "The key",
        lines: [
          { who: "Parisa", fa: "کِلیدَم رُو {گُم کَرْدَم}!", written: "کِلیدَم را {گُم کَرْده‌اَم}!", en: "I've lost my key!" },
          { who: "Hamid", fa: "آخَرین بار کُجا بود؟", en: "Where did you have it last?" },
          { who: "Parisa", fa: "تو کیفَم بود… آهان، {پَیدا شُد}!", written: "دَر کیفَم بود… آهان، {پَیدا شُد}!", en: "It was in my bag… oh, it's turned up!" },
          { who: "Hamid", fa: "خُدا رُو شُکْر!", written: "خُدا را شُکْر!", en: "Thank goodness!" },
        ],
        note: "پَیدا شُد, *it turned up*, is the شُدَن partner of پَیدا کَرْدَن, *to find*. خُدا رُو شُکْر, literally *thanks be to God*, is the everyday *thank goodness*.",
      },
      {
        type: "quiz",
        questions: [
          { prompt: "Spoken: *I got lost* (two words).", lang: "fa", answers: ["گم شدم"], explain: "گُم شُدَم: the شُدَن verb. گُم کَرْدَم is *I lost (something)*." },
          { prompt: "Write *the window opened* (three words).", lang: "fa", answers: ["پنجره باز شد"], explain: "پَنْجَره باز شُد: with شُدَن the window opens by itself." },
          {
            prompt: "*We started the class*: which light verb, کَرْدَن or شُدَن? Type its transliteration.",
            lang: "translit",
            answers: ["kardan"],
            explain: "کَرْدَن: we start something, and the class is the object: کِلاس رُو شُروع کَرْدیم.",
          },
          { prompt: "Type the written causative of خوابیدَن, *to put to sleep* (one word).", lang: "fa", answers: ["خواباندن", "خوابانیدن"], explain: "خوابانْدَن: ـانْدَن on the present stem خواب; spoken خوابونْدَن." },
          {
            prompt: "Translate: مَنُو تا خونه رِسونْد.",
            lang: "en",
            answers: [
              "she gave me a lift home",
              "he gave me a lift home",
              "she drove me home",
              "he drove me home",
              "she took me home",
              "he took me home",
              "she dropped me home",
              "he dropped me home",
              "she dropped me off at home",
              "he dropped me off at home",
              "she gave me a ride home",
              "he gave me a ride home",
            ],
            explain: "*mano tâ khune resund*: رِسونْدَن, *to make arrive*.",
          },
        ],
      },
    ],
  },
];
