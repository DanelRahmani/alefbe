import type { Lesson } from "../types";
import { VERBS, verbById } from "../verbs";
import { table, type Style, type Tense } from "@/lib/conjugate";

// Unit 7, talking about the past. Spoken Tehrani first, written beneath.
// Conjugation tables come from lib/conjugate.ts, so lessons and the trainer
// can never disagree. Examples are original. The lesson slugs are the ones
// the trainer's tenses open with (TENSES in lib/conjugate.ts).

const SOURCE =
  "Thackston, An Introduction to Persian, on the past tenses; Mahootian, Persian (Routledge Descriptive Grammars), on tense, aspect and the progressive; Lazard, A Grammar of Contemporary Persian, on the perfect; Stilo, Talattof and Clinton, Modern Persian: Spoken and Written, for the Tehrani forms.";

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

export const past: Lesson[] = [
  {
    slug: "simple-past",
    title: "The simple past: the past stem plus an ending",
    summary: "Take ـَن off the infinitive, add the ending that says who, and leave he/she bare: رَفْتَم, I went; رَفْت, he went.",
    register: "both",
    kinds: ["verbs", "grammar"],
    source: SOURCE,
    vocab: [
      { fa: "بودَن", en: "to be", topic: "verbs" },
      { fa: "خوابیدَن", en: "to sleep, to go to sleep", topic: "verbs" },
      { fa: "دیشَب", en: "last night", topic: "time" },
      { fa: "پارْسال", en: "last year", topic: "time" },
      { fa: "بازار", en: "bazaar, market", topic: "places" },
      { fa: "شُمال", en: "north; the Caspian coast", topic: "places" },
      { fa: "عالی", en: "excellent, great", topic: "describing" },
      { fa: "آخَرِ هَفْته", en: "weekend", topic: "time" },
      { fa: "خُوش گُذَشْتَن", en: "to be enjoyable (to have a good time)", topic: "verbs" },
    ],
    blocks: [
      {
        type: "idea",
        text: "The simple past is the **past stem** plus a personal ending, and *he/she* takes **no ending at all**: رَفْتَم, *I went*; رَفْت, *he went*, *she went*.",
      },
      {
        type: "text",
        text: "The past stem is the infinitive without ـَن (lesson 5.1), and in writing it is never irregular: رَفْتَن → رَفْت, دیدَن → دید, بودَن → بود. The endings are the ones you know from the present, with one difference: *he/she* has none, so the bare stem is a whole sentence: رَفْت. This tense is the simple past (ماضیِ ساده, *mâzi-ye sâde*). It reports something finished: *I went*, *I did go*. The stress falls on the last syllable of the stem, not on the ending: *ráftam*, *khâbídam*. Speech and writing differ in only two endings: plural *you* is *-in* for written *-id*, and *they* is *-an* for written *-and*.",
      },
      {
        type: "table",
        caption: "رَفْتَن, to go",
        headers: ["Who", "Spoken", "Written"],
        rows: spokenWritten("raftan", "past"),
      },
      {
        type: "text",
        text: "*To be* is regular here, unlike in the present: بودَن → بود, so بودَم is *I was* and بود is *he was*, *she was*, *it was*. A few verbs change their past stem in speech. آمَدَن (*to come*) becomes اومَد: اومَدَم, *I came*. And the verbs that turn *ân* into *un* in the present do so in the past as well: خوانْدَم → خونْدَم (*I read*), دانِسْت → دونِسْت, تَوانِسْت → تونِسْت.",
      },
      {
        type: "table",
        caption: "بودَن, to be",
        headers: ["Who", "Spoken", "Written"],
        rows: spokenWritten("budan", "past"),
      },
      { type: "heading", text: "Core examples" },
      {
        type: "examples",
        items: [
          { fa: "دیروز {رَفْتَم} بازار.", written: "دیروز به بازار {رَفْتَم}.", en: "I went to the bazaar yesterday." },
          { fa: "دیشَب یه فیلْمِ خوب {دیدیم}.", written: "دیشَب یِک فیلْمِ خوب {دیدیم}.", en: "We watched a good film last night." },
          {
            fa: "مَرْیَم کَی {اومَد}؟",
            written: "مَرْیَم کَی {آمَد}؟",
            en: "When did Maryam come?",
            note: "*He/she*: the bare stem, with no ending. Speech says اومَد for آمَد.",
          },
          { fa: "پارْسال تو شیراز {بودَم}.", written: "پارْسال دَر شیراز {بودَم}.", en: "I was in Shiraz last year." },
          {
            fa: "بَچّه‌ها زود {خوابیدَن}.",
            written: "بَچّه‌ها زود {خوابیدَنْد}.",
            en: "The children went to sleep early.",
            note: "The spoken *they* form is spelled like the infinitive: خوابیدَن is both *they slept* and *to sleep*. Its place at the end of a sentence with a subject tells you which.",
          },
        ],
      },
      { type: "heading", text: "Contrast pair" },
      {
        type: "pair",
        title: "Every day, or yesterday",
        a: { fa: "هَر روز {می‌رَم} بازار.", written: "هَر روز به بازار {می‌رَوَم}.", en: "I go to the bazaar every day." },
        b: { fa: "دیروز {رَفْتَم} بازار.", written: "دیروز به بازار {رَفْتَم}.", en: "I went to the bazaar yesterday." },
        diff: "The present has می and the present stem; the past has the past stem and no prefix. The ending ـَم (*I*) is the same in both.",
      },
      { type: "heading", text: "Common mistake" },
      {
        type: "callout",
        kind: "mistake",
        title: "An ending on he/she",
        text: "In the present, *he/she* has an ending: *-e* in speech, *-ad* in writing. In the past it has none. The bare past stem is the *he/she* form, so nothing is added to رَفْت. Adding the spoken *-e* does not give the past either: رَفْته is *has gone* (lesson 7.3).",
        wrong: { fa: "عَلی دیروز {رَفْتَد}.", en: "(meant: Ali went yesterday)" },
        right: { fa: "عَلی دیروز {رَفْت}.", en: "Ali went yesterday." },
      },
      { type: "heading", text: "In real conversation" },
      {
        type: "dialogue",
        title: "Back at work",
        lines: [
          { who: "Nasrin", fa: "آخَرِ هَفْته چیکار {کَرْدی}؟", written: "آخَرِ هَفْته چه کار {کَرْدی}؟", en: "What did you do at the weekend?" },
          { who: "Dariush", fa: "{رَفْتیم} شُمال. خَیلی خُوش {گُذَشْت}.", written: "به شُمال {رَفْتیم}. خَیلی خُوش {گُذَشْت}.", en: "We went to the north. We had a great time." },
          { who: "Nasrin", fa: "هَوا چِطُور {بود}؟", en: "How was the weather?" },
          { who: "Dariush", fa: "عالی {بود}. خونه {بودی}؟", written: "عالی {بود}. دَر خانه {بودی}؟", en: "It was great. Were you at home?" },
          { who: "Nasrin", fa: "آره، دَرْس {خونْدَم}.", written: "بَله، دَرْس {خوانْدَم}.", en: "Yes, I studied." },
        ],
        note: "شُمال, *the north*, is what Tehranis call the Caspian coast, the usual weekend escape. خُوش گُذَشْت is literally *it passed pleasantly*: the way to say *we had a good time*. To name who enjoyed it, add به: به ما خُوش گُذَشْت. دَرْس خوانْدَن, literally *to read a lesson*, is *to study*.",
      },
      {
        type: "quiz",
        questions: [
          { prompt: "Write *I went* (one word).", lang: "fa", answers: ["رفتم"], explain: "رَفْتَم: the past stem رَفْت plus ـَم, the same in speech and writing." },
          {
            prompt: "Type the *he/she* form of دیدَن: *he saw* (one word).",
            lang: "fa",
            answers: ["دید"],
            explain: "دید: the bare past stem. *He/she* takes no ending in the past.",
          },
          { prompt: "Spoken: *they went* (one word).", lang: "fa", answers: ["رفتن"], explain: "رَفْتَن (*raftan*); written رَفْتَنْد." },
          { prompt: "Written: *you were* (شُما; one word).", lang: "fa", answers: ["بودید"], explain: "بودید; spoken بودین." },
          {
            prompt: "Translate: دیشَب یه فیلْمِ خوب دیدیم.",
            lang: "en",
            answers: [
              "we watched a good film last night",
              "we saw a good film last night",
              "last night we watched a good film",
              "last night we saw a good film",
              "we watched a good movie last night",
              "we saw a good movie last night",
              "last night we watched a good movie",
              "last night we saw a good movie",
            ],
            explain: "*dishab ye film-e khub didim*: دیدیم is the past stem دید plus ـیم (*we*).",
          },
        ],
      },
    ],
  },
  {
    slug: "past-negative",
    title: "Not in the past: نـ on the verb",
    summary: "Put نـ straight onto the past verb: نَرَفْتَم, I didn't go. Before آ a ی slips in: نَیامَد, he didn't come.",
    register: "both",
    kinds: ["verbs", "grammar"],
    source: SOURCE,
    vocab: [
      { fa: "صُبْحونه", written: "صُبْحانه", en: "breakfast", topic: "food" },
      { fa: "هیچ‌کَس", en: "nobody, no one", topic: "people" },
      { fa: "جَواب دادَن", en: "to answer", topic: "verbs" },
      { fa: "پَیدا کَرْدَن", en: "to find", topic: "verbs" },
      { fa: "مُوبایْل", en: "mobile phone", topic: "things" },
      { fa: "سَرِ کار", en: "at work, to work", topic: "places" },
      { fa: "شارْژ", en: "charge (of a battery)", topic: "things" },
    ],
    blocks: [
      {
        type: "idea",
        text: "The past takes the same **نـ** as the present, put straight onto the verb with no می: رَفْتَم → نَرَفْتَم, *I didn't go*.",
      },
      {
        type: "text",
        text: "Here نـ is said *na-*, and it takes the stress of the word: *náraftam*. It is the same for every person, in speech and in writing. In a compound verb it goes on the verb part: کار نَکَرْدَم, *I didn't work*. *To be* and *to have* follow the rule: نَبودَم (*I wasn't*), نَداشْتَم (*I didn't have*). One thing needs care. When the stem starts with آ, a ی slips in between: آمَد → نَیامَد (*nayâmad*, he didn't come), آوَرْد → نَیاوَرْد (*nayâvard*, he didn't bring). Speech does the same with its own stem: اومَد → نَیومَد (*nayumad*).",
      },
      {
        type: "table",
        caption: "آمَدَن (to come), negative",
        headers: ["Who", "Spoken", "Written"],
        rows: spokenWritten("âmadan", "past", true),
      },
      { type: "heading", text: "Core examples" },
      {
        type: "examples",
        items: [
          { fa: "دیروز سَرِ کار {نَرَفْتَم}.", en: "I didn't go to work yesterday." },
          { fa: "صُبْحونه {نَخُورْدَم}.", written: "صُبْحانه {نَخُورْدَم}.", en: "I didn't have breakfast." },
          { fa: "سارا {نَیومَد}.", written: "سارا {نَیامَد}.", en: "Sara didn't come." },
          { fa: "دیشَب خوب {نَخوابیدَم}.", en: "I didn't sleep well last night." },
          {
            fa: "هیچ‌کَس جَواب {نَداد}.",
            en: "Nobody answered.",
            note: "With هیچ‌کَس (*nobody*) the verb is still negative: literally *nobody didn't answer*. Persian needs both.",
          },
        ],
      },
      { type: "heading", text: "Contrast pair" },
      {
        type: "pair",
        title: "Found it, didn't find it",
        a: { fa: "کِلید رُو {پَیدا کَرْدَم}.", written: "کِلید را {پَیدا کَرْدَم}.", en: "I found the key." },
        b: { fa: "کِلید رُو {پَیدا نَکَرْدَم}.", written: "کِلید را {پَیدا نَکَرْدَم}.", en: "I didn't find the key." },
        diff: "Only نـ is added, and in a compound verb it goes on the verb part (کَرْدَم), not on پَیدا.",
      },
      { type: "heading", text: "Common mistake" },
      {
        type: "callout",
        kind: "mistake",
        title: "نِمی for one finished event",
        text: "Because the present says نِمی‌رَم, learners reach for نِمی in the past too. نِمی‌رَفْتَم is a real form, but it means *I wasn't going* or *I didn't use to go* (lesson 7.4). For one event that did not happen, the past takes plain نـ.",
        wrong: { fa: "دیروز {نِمی‌رَفْتَم} مَدْرِسه.", en: "(meant: I didn't go to school yesterday)" },
        right: { fa: "دیروز {نَرَفْتَم} مَدْرِسه.", written: "دیروز به مَدْرِسه {نَرَفْتَم}.", en: "I didn't go to school yesterday." },
      },
      { type: "heading", text: "In real conversation" },
      {
        type: "dialogue",
        title: "The morning after",
        lines: [
          { who: "Mina", fa: "دیشَب چِرا {نَیومَدی}؟", written: "دیشَب چِرا {نَیامَدی}؟", en: "Why didn't you come last night?" },
          { who: "Farhad", fa: "بِبَخْشید، حالَم خوب {نَبود}.", en: "Sorry, I wasn't feeling well." },
          { who: "Mina", fa: "زَنْگ هَم {نَزَدی}!", en: "You didn't even call!" },
          { who: "Farhad", fa: "مُوبایْلَم شارْژ {نَداشْت}.", en: "My phone had no charge." },
        ],
        note: "حالَم خوب نَبود is literally *my state was not good*. With a negative verb, هَم means *even* or *either*: زَنْگ هَم نَزَدی. In زَنْگ نَزَدی the نـ is on زَدَن, the verb part of زَنْگ زَدَن.",
      },
      {
        type: "quiz",
        questions: [
          { prompt: "Make it negative: رَفْتَم.", lang: "fa", answers: ["نرفتم"], explain: "نَرَفْتَم (*naraftam*): نـ straight onto the verb, with no می." },
          {
            prompt: "Written: *he didn't come* (one word).",
            lang: "fa",
            answers: ["نیامد"],
            explain: "نَیامَد (*nayâmad*): a ی bridges نـ and the vowel of آمَد.",
          },
          { prompt: "Spoken: *they didn't come* (one word).", lang: "fa", answers: ["نیومدن"], explain: "نَیومَدَن (*nayumadan*); written نَیامَدَنْد." },
          {
            prompt: "Make it negative: کار کَرْدیم (we worked).",
            lang: "fa",
            answers: ["کار نکردیم"],
            explain: "کار نَکَرْدیم: the prefix goes on the verb part, not on کار.",
          },
          {
            prompt: "Translate: دیشَب خوب نَخوابیدَم.",
            lang: "en",
            answers: [
              "i didn't sleep well last night",
              "i did not sleep well last night",
              "last night i didn't sleep well",
              "last night i did not sleep well",
            ],
            explain: "*dishab khub nakhâbidam*: خوابیدَم with نـ in front.",
          },
        ],
      },
    ],
  },
  {
    slug: "present-perfect",
    title: "The present perfect: رَفْته‌اَم",
    summary: "“I have gone” is the past participle plus the short “to be”: written رَفْته‌اَم. Speech puts the stress on the ending, and its he/she form is رَفْته.",
    register: "both",
    kinds: ["verbs", "grammar", "spelling"],
    source: SOURCE,
    vocab: [
      { fa: "تا حالا", en: "so far; ever", topic: "time" },
      { fa: "تاکُنون", en: "so far; ever (formal)", topic: "time" },
      { fa: "تازه", en: "just, only just; fresh", topic: "time" },
      { fa: "قَبْلاً", en: "before, previously", topic: "time" },
      { fa: "دُرُسْت کَرْدَن", en: "to make, to prepare; to fix", topic: "verbs" },
      { fa: "قُرْمه‌سَبْزی", en: "ghorme sabzi (a herb stew)", topic: "food" },
    ],
    blocks: [
      {
        type: "idea",
        text: "The present perfect says that something happened and **still counts now**: *I have gone*. It is the **past participle** (the past stem plus ـه) followed by the short forms of *to be*: رَفْته‌اَم.",
      },
      {
        type: "text",
        text: "The past participle (صِفَتِ مَفْعولی, *sefat-e maf'uli*) is the past stem with a silent ه: رَفْته (*gone*), دیده (*seen*), خُورْده (*eaten*). For the present perfect (ماضیِ نَقْلی, *mâzi-ye naqli*), writing adds the short *to be* of lesson 4.2, joined with a half-space because the participle ends in a silent ه: رَفْته‌اَم, رَفْته‌ای. Only اَسْت is a separate word: رَفْته اَسْت. Writers often leave that اَسْت out and write just رَفْته. The negative is نـ on the participle: نَرَفْته‌اَم, *I haven't gone*.",
      },
      {
        type: "table",
        caption: "رَفْتَن, to go: *have gone*",
        headers: ["Who", "Spoken", "Written"],
        rows: spokenWritten("raftan", "perfect"),
      },
      {
        type: "text",
        text: "In speech the ending swallows the participle's *-e*, so the forms are spelled like the simple past, except for *he/she*: رَفْته (*rafte*). In positive forms, what tells the two tenses apart is the **stress**. The simple past stresses the stem: *ráftam*, *I went*. The perfect stresses the ending: *raftám*, *I have gone*. The negative is spelled like the simple past as well (نَخُورْدَم); there, words such as هَنوز show which tense is meant. In messages many people type the written form, رَفْته‌اَم, to make the meaning plain. Words such as تا حالا (*so far*, *ever*), هَنوز (*still*, *yet*) and تازه (*just*) often go with the perfect and help to mark it.",
      },
      { type: "heading", text: "Core examples" },
      {
        type: "examples",
        items: [
          {
            fa: "تا حالا ایران {رَفْتی}؟",
            written: "آیا تاکُنون به ایران {رَفْته‌ای}؟",
            en: "Have you ever been to Iran?",
            note: "Said *raftí*, with the stress on the ending. Persian says *have you gone* where English says *have you been*.",
          },
          { fa: "سارا {رَفْته}.", written: "سارا {رَفْته اَسْت}.", en: "Sara has gone. / Sara has left.", note: "She is not here now: the result still holds." },
          { fa: "هَنوز ناهار {نَخُورْدَم}.", written: "هَنوز ناهار {نَخُورْده‌اَم}.", en: "I haven't had lunch yet." },
          { fa: "این فیلْم رُو قَبْلاً {دیدَم}.", written: "این فیلْم را قَبْلاً {دیده‌اَم}.", en: "I've seen this film before." },
          { fa: "تازه {اومَده}.", written: "تازه {آمَده اَسْت}.", en: "He has just arrived. / She has just arrived." },
        ],
      },
      {
        type: "callout",
        kind: "tip",
        title: "Two differences from English",
        text: "For something that began in the past and is still going on, Persian uses the **present**, not the perfect: English *I have lived here for two years* is a present-tense sentence in Persian. And with verbs of posture the perfect names the state someone is in now: نِشَسْته is *is sitting*, خوابیده is *is asleep*.",
      },
      { type: "heading", text: "Contrast pair" },
      {
        type: "pair",
        title: "Went, or has gone",
        a: { fa: "عَلی {رَفْت}.", en: "Ali went. / Ali left." },
        b: { fa: "عَلی {رَفْته}.", written: "عَلی {رَفْته اَسْت}.", en: "Ali has gone. (He isn't here.)" },
        diff: "The simple past reports the event. The perfect says its result holds now. *He/she* is the one person where speech shows the difference in letters: the ـه of رَفْته.",
      },
      { type: "heading", text: "Common mistake" },
      {
        type: "callout",
        kind: "mistake",
        title: "The ending as a separate word",
        text: "The short *to be* is joined to the participle with a half-space: not two words, and not run together. The half-space keeps the silent ه from joining the next letter (lesson 3.2). Only اَسْت stands apart, as a word of its own: دیده اَسْت.",
        wrong: { fa: "این فیلْم را {دیده اَم}.", en: "(a full space before the ending)" },
        right: { fa: "این فیلْم را {دیده‌اَم}.", en: "I have seen this film." },
      },
      { type: "heading", text: "In real conversation" },
      {
        type: "dialogue",
        title: "An evening visit",
        lines: [
          { who: "Host", fa: "شام {خُورْدی}؟", written: "شام {خُورْده‌ای}؟", en: "Have you had dinner?" },
          { who: "Guest", fa: "نَه، هَنوز {نَخُورْدَم}.", written: "نَه، هَنوز {نَخُورْده‌اَم}.", en: "No, not yet." },
          { who: "Host", fa: "پَس بیا، غَذا حاضِره.", written: "پَس بیا، غَذا حاضِر اَسْت.", en: "Come on then, the food is ready." },
          { who: "Guest", fa: "مِرْسی! چی {دُرُسْت کَرْدی}؟", written: "مُتَشَکِّرَم! چه {دُرُسْت کَرْده‌ای}؟", en: "Thanks! What have you made?" },
          { who: "Host", fa: "قُرْمه‌سَبْزی {دُرُسْت کَرْدَم}.", written: "قُرْمه‌سَبْزی {دُرُسْت کَرْده‌اَم}.", en: "I've made ghorme sabzi." },
        ],
        note: "In speech خُورْدی and کَرْدَم are said here with the stress on the ending, *khordí*, *dorost kardám*: that is the perfect. دُرُسْت کَرْدَن, literally *to make right*, is the everyday verb for making a meal. هَنوز with a negative verb is *not yet*. قُرْمه‌سَبْزی is a stew of herbs, beans and meat, and a national favourite.",
      },
      {
        type: "quiz",
        questions: [
          {
            prompt: "Written: *I have gone* (one word, with a half-space).",
            lang: "fa",
            answers: ["رفته‌ام"],
            explain: "رَفْته‌اَم: the participle رَفْته, a half-space, and اَم.",
          },
          {
            prompt: "Written: *she has come* (two words).",
            lang: "fa",
            answers: ["آمده است"],
            explain: "آمَده اَسْت: اَسْت is the one form that is a separate word. Speech says اومَده.",
          },
          { prompt: "Spoken: *he has gone* (one word).", lang: "fa", answers: ["رفته"], explain: "رَفْته (*rafte*): the one spoken form spelled unlike the simple past." },
          {
            prompt: "Written: *we haven't seen* (one word).",
            lang: "fa",
            answers: ["ندیده‌ایم"],
            explain: "نَدیده‌ایم: نـ on the participle دیده, then ایم after a half-space.",
          },
          {
            prompt: "Translate: هَنوز ناهار نَخُورْده‌اَم.",
            lang: "en",
            answers: [
              "i haven't had lunch yet",
              "i have not had lunch yet",
              "i haven't eaten lunch yet",
              "i have not eaten lunch yet",
              "i still haven't had lunch",
              "i still haven't eaten lunch",
              "i still have not had lunch",
              "i still have not eaten lunch",
              "i haven't yet had lunch",
              "i have not yet had lunch",
            ],
            explain: "*hanuz nâhâr nakhorde-am*: هَنوز with a negative perfect is *not yet*.",
          },
        ],
      },
    ],
  },
  {
    slug: "past-continuous",
    title: "The past continuous: می on the past",
    summary: "می in front of the simple past gives “was doing” and “used to do”: می‌رَفْتَم, I was going, I used to go.",
    register: "both",
    kinds: ["verbs", "grammar"],
    source: SOURCE,
    vocab: [
      { fa: "هَمیشه", en: "always", topic: "time" },
      { fa: "تابِسْتون", written: "تابِسْتان", en: "summer", topic: "time" },
      { fa: "وَقْتی", en: "when (at the time that)", topic: "time" },
      { fa: "بابابُزُرْگ", written: "پِدَرْبُزُرْگ", en: "grandfather", topic: "people" },
      { fa: "مادَرْبُزُرْگ", en: "grandmother", topic: "people" },
      { fa: "قِصّه", en: "story, tale", topic: "everyday" },
      { fa: "بازی کَرْدَن", en: "to play", topic: "verbs" },
      { fa: "اِسْتَخْر", en: "swimming pool", topic: "places" },
      { fa: "فوتْبال", en: "football", topic: "everyday" },
    ],
    blocks: [
      {
        type: "idea",
        text: "Put **می** on the simple past and it becomes the past continuous, for something that **was going on** or **used to happen**: می‌رَفْتَم, *I was going*, *I used to go*.",
      },
      {
        type: "text",
        text: "The past continuous (ماضیِ اِسْتِمْراری, *mâzi-ye estemrâri*) is the simple past with می in front, joined by a half-space as always. Its negative is نِمی: نِمی‌رَفْتَم. It has two jobs. One is a **habit** in the past: هَر روز می‌رَفْتَم, *I used to go every day*. The other is the **background**: what was going on when something else happened, often with وَقْتی (*when*).",
      },
      {
        type: "table",
        caption: "رَفْتَن, to go: *was going*, *used to go*",
        headers: ["Who", "Spoken", "Written"],
        rows: spokenWritten("raftan", "imperfect"),
      },
      {
        type: "text",
        text: "For most verbs that name a state, this is the everyday past. *I knew* is می‌دونِسْتَم (written می‌دانِسْتَم), *I wanted* is می‌خواسْتَم, and *I could* is می‌تونِسْتَم (written می‌تَوانِسْتَم). Their simple past is a single event: تونِسْتَم is *I managed to*. Two verbs go the other way and take no می in the past, in everyday Persian: داشْتَم is both *I had* and *I used to have*, and بودَم is both *I was* and *I used to be*. In speech آمَدَن runs into می, as it does in the present: written می‌آمَدَم is said [میومَدَم|miyumadam].",
      },
      { type: "heading", text: "Core examples" },
      {
        type: "examples",
        items: [
          {
            fa: "وَقْتی بَچّه بودَم، هَر روز فوتْبال {بازی می‌کَرْدَم}.",
            en: "When I was a child, I played football every day.",
            note: "A habit: English says *played* or *used to play*. بودَم beside it takes no می, as *to be* never does.",
          },
          {
            fa: "وَقْتی زَنْگ زَدی، شام {می‌خُورْدیم}.",
            en: "When you called, we were having dinner.",
            note: "The background (*were having*) takes می; the event that cut in (*called*) is the simple past.",
          },
          { fa: "{نِمی‌دونِسْتَم}.", written: "{نِمی‌دانِسْتَم}.", en: "I didn't know." },
          {
            fa: "بابابُزُرْگَم هَمیشه قِصّه {می‌گُفْت}.",
            written: "پِدَرْبُزُرْگَم هَمیشه قِصّه {می‌گُفْت}.",
            en: "My grandfather always told stories.",
          },
          {
            fa: "یه چایی {می‌خواسْتَم}.",
            written: "یِک چای {می‌خواسْتَم}.",
            en: "I'd like a tea.",
            note: "Literally *I wanted a tea*: the past makes a request softer, as *I wanted to ask…* does in English.",
          },
        ],
      },
      { type: "heading", text: "Contrast pair" },
      {
        type: "pair",
        title: "Once, or again and again",
        a: { fa: "دیروز {رَفْتَم} اِسْتَخْر.", written: "دیروز به اِسْتَخْر {رَفْتَم}.", en: "I went to the pool yesterday." },
        b: { fa: "هَر روز {می‌رَفْتَم} اِسْتَخْر.", written: "هَر روز به اِسْتَخْر {می‌رَفْتَم}.", en: "I used to go to the pool every day." },
        diff: "The verb and its ending are the same. Without می it is one finished event; with می it is a habit, or something in progress at the time.",
      },
      { type: "heading", text: "Common mistake" },
      {
        type: "callout",
        kind: "mistake",
        title: "می on داشْتَن and بودَن",
        text: "*To have* takes no می in the present (lesson 5.5), and in everyday Persian it takes none in the past either. The same goes for *to be*. Their simple past already covers *used to have* and *used to be*. The compounds of داشْتَن that take می in the present (lesson 5.5) keep it in the past.",
        wrong: { fa: "پارْسال یه ماشین {می‌داشْتَم}.", written: "پارْسال یِک ماشین {می‌داشْتَم}.", en: "(meant: I had a car last year)" },
        right: { fa: "پارْسال یه ماشین {داشْتَم}.", written: "پارْسال یِک ماشین {داشْتَم}.", en: "I had a car last year." },
      },
      { type: "heading", text: "In real conversation" },
      {
        type: "dialogue",
        title: "Childhood summers",
        lines: [
          {
            who: "Shirin",
            fa: "بَچّه که بودین، تابِسْتونا کُجا {می‌رَفْتین}؟",
            written: "وَقْتی بَچّه بودید، تابِسْتان‌ها کُجا {می‌رَفْتید}؟",
            en: "When you were a child, where did you use to go in the summers?",
          },
          {
            who: "Kaveh",
            fa: "{می‌رَفْتیم} خونهٔ مادَرْبُزُرْگَم، تو یه روسْتا.",
            written: "به خانهٔ مادَرْبُزُرْگَم {می‌رَفْتیم}، دَر یِک روسْتا.",
            en: "We used to go to my grandmother's house, in a village.",
          },
          { who: "Shirin", fa: "اونْجا چیکار {می‌کَرْدین}؟", written: "آنْجا چه کار {می‌کَرْدید}؟", en: "What did you do there?" },
          {
            who: "Kaveh",
            fa: "صُبْح تا شَب تو باغ {بازی می‌کَرْدیم}.",
            written: "اَز صُبْح تا شَب دَر باغ {بازی می‌کَرْدیم}.",
            en: "We played in the garden from morning till night.",
          },
        ],
        note: "Every verb here is a habit of those summers, so every one takes می, except بودین: *to be* never does. بَچّه که بودین is the spoken way to say *when you were a child*; writing uses وَقْتی. Shirin uses the polite plural *you*: می‌رَفْتین, written می‌رَفْتید.",
      },
      {
        type: "quiz",
        questions: [
          { prompt: "Write *I used to go* (one word).", lang: "fa", answers: ["می‌رفتم"], explain: "می‌رَفْتَم: می, a half-space, and the simple past رَفْتَم." },
          {
            prompt: "Spoken: *I didn't know* (one word).",
            lang: "fa",
            answers: ["نمی‌دونستم"],
            explain: "نِمی‌دونِسْتَم (*nemidunestam*); written نِمی‌دانِسْتَم. For a state, the past with می is the everyday past.",
          },
          { prompt: "Written: *they were eating* (one word).", lang: "fa", answers: ["می‌خوردند"], explain: "می‌خُورْدَنْد; spoken می‌خُورْدَن." },
          {
            prompt: "Write *I had*, as in *I had a car* (one word).",
            lang: "fa",
            answers: ["داشتم"],
            explain: "داشْتَم: داشْتَن takes no می, so this is also *I used to have*.",
          },
          {
            prompt: "Translate: وَقْتی زَنْگ زَدی، شام می‌خُورْدیم.",
            lang: "en",
            answers: [
              "when you called we were having dinner",
              "when you called we were eating dinner",
              "we were having dinner when you called",
              "we were eating dinner when you called",
              "when you rang we were having dinner",
              "we were having dinner when you rang",
              "when you phoned we were having dinner",
              "we were having dinner when you phoned",
              "when you rang we were eating dinner",
              "we were eating dinner when you rang",
              "when you phoned we were eating dinner",
              "we were eating dinner when you phoned",
              "when you called we were eating",
              "we were eating when you called",
              "when you called we were having supper",
              "we were having supper when you called",
            ],
            explain: "*vaqti zang zadi, shâm mikhordim*: the call is one event (simple past); the dinner was in progress (می).",
          },
        ],
      },
    ],
  },
  {
    slug: "in-progress",
    title: "In the middle of it: دارَم می‌رَم, داشْتَم می‌رَفْتَم",
    summary: "داشْتَن in front of the verb, both with their endings, says the action is or was in full swing: دارَم می‌رَم, I'm on my way.",
    register: "both",
    kinds: ["verbs", "spoken"],
    source: SOURCE,
    vocab: [
      { fa: "بارون", written: "باران", en: "rain", topic: "weather" },
      { fa: "مِهْمون", written: "مِهْمان", en: "guest", topic: "people" },
      { fa: "رِسیدَن", en: "to arrive", topic: "verbs" },
      { fa: "پارْک کَرْدَن", en: "to park", topic: "verbs" },
      { fa: "آشْپَزی کَرْدَن", en: "to cook, to do the cooking", topic: "verbs" },
      { fa: "تِلِفُن", en: "telephone", topic: "things" },
      { fa: "راه", en: "road, way", topic: "places" },
    ],
    blocks: [
      {
        type: "idea",
        text: "To insist that something is **in the middle of happening**, put داشْتَن in front of the verb and conjugate **both**: دارَم می‌رَم, *I'm going right now*; داشْتَم می‌رَفْتَم, *I was just going*.",
      },
      {
        type: "text",
        text: "This is the progressive. For now, it is the present of داشْتَن plus the present: دارَم می‌رَم. For then, it is the past of داشْتَن plus the past continuous: داشْتَم می‌رَفْتَم. Both verbs take the same ending, and داشْتَن has lost its meaning *to have*: it only marks the action as under way. Other words can stand between the two: دارَم نامه می‌نِویسَم, *I'm writing a letter*. In a compound verb the first part stays next to its verb: دارَم کار می‌کُنَم. With a verb that names a single moment, such as رِسیدَن (*to arrive*), it means *about to*: دارَن می‌رِسَن, *they are about to arrive*.",
      },
      {
        type: "table",
        caption: "رَفْتَن, to go: *am going right now*",
        headers: ["Who", "Spoken", "Written"],
        rows: spokenWritten("raftan", "progressive"),
      },
      {
        type: "table",
        caption: "رَفْتَن, to go: *was just going*",
        headers: ["Who", "Spoken", "Written"],
        rows: spokenWritten("raftan", "past-progressive"),
      },
      {
        type: "text",
        text: "Three limits. The progressive has **no negative**: for *I'm not going*, say the plain نِمی‌رَم, and for *I wasn't going*, نِمی‌رَفْتَم. It is not normally used with verbs that name a **state**: داشْتَن, دانِسْتَن, خواسْتَن, تَوانِسْتَن and بودَن keep the plain tense. And it belongs first of all to **speech**: stories and news reports write it too, but formal prose avoids it. It is never required. The plain present already means *I'm going* (lesson 5.2); دارَم only adds *right now*.",
      },
      { type: "heading", text: "Core examples" },
      {
        type: "examples",
        items: [
          { fa: "{دارَم} شام {می‌خُورَم}.", en: "I'm having dinner right now." },
          {
            fa: "{داره} بارون {میاد}.",
            written: "{دارَد} باران {می‌آیَد}.",
            en: "It's raining.",
            note: "Rain *comes* in Persian: بارون میاد. With داره, it is coming down right now.",
          },
          { fa: "{داری} چیکار {می‌کُنی}؟", written: "{داری} چه کار {می‌کُنی}؟", en: "What are you doing right now?" },
          { fa: "مامان {داره} آشْپَزی {می‌کُنه}.", written: "مادَر {دارَد} آشْپَزی {می‌کُنَد}.", en: "Mum is cooking right now." },
          {
            fa: "{داشْتَم می‌رَفْتَم} بیرون که تِلِفُن زَنْگ زَد.",
            written: "{داشْتَم} بیرون {می‌رَفْتَم} که تِلِفُن زَنْگ زَد.",
            en: "I was just going out when the phone rang.",
            note: "که here is *when*: it brings in the event that cut across.",
          },
        ],
      },
      { type: "heading", text: "Contrast pair" },
      {
        type: "pair",
        title: "Reading, or reading right now",
        a: { fa: "کِتاب {می‌خونَم}.", written: "کِتاب {می‌خوانَم}.", en: "I read books. / I'm reading a book." },
        b: { fa: "{دارَم} کِتاب {می‌خونَم}.", written: "{دارَم} کِتاب {می‌خوانَم}.", en: "I'm reading a book right now." },
        diff: "The plain present can be a habit or what is happening now. With دارَم it cannot be a habit: the action is under way, at this moment or in this period.",
      },
      { type: "heading", text: "Common mistake" },
      {
        type: "callout",
        kind: "mistake",
        title: "A negative progressive",
        text: "Neither verb of the progressive can be negated. نَدارَم means *I don't have*, and دارَم نِمی‌رَم is not said either. To say that something is not happening, use the plain negative present.",
        wrong: { fa: "دارَم {نِمی‌رَم}.", written: "دارَم {نِمی‌رَوَم}.", en: "(meant: I'm not going)" },
        right: { fa: "{نِمی‌رَم}.", written: "{نِمی‌رَوَم}.", en: "I'm not going." },
      },
      { type: "heading", text: "In real conversation" },
      {
        type: "dialogue",
        title: "On the phone",
        lines: [
          { who: "Mother", fa: "اَلُو، کُجایی؟", written: "اَلُو، کُجا هَسْتی؟", en: "Hello, where are you?" },
          { who: "Arash", fa: "تو راهَم. {دارَم میام}.", written: "دَر راه هَسْتَم. {دارَم می‌آیَم}.", en: "I'm on my way. I'm coming." },
          {
            who: "Mother",
            fa: "مِهْمونا {دارَن می‌رِسَن}.",
            written: "مِهْمان‌ها {دارَنْد می‌رِسَنْد}.",
            en: "The guests are about to arrive.",
          },
          {
            who: "Arash",
            fa: "می‌دونَم. {داشْتَم} پارْک {می‌کَرْدَم} که زَنْگ زَدی.",
            written: "می‌دانَم. {داشْتَم} پارْک {می‌کَرْدَم} که زَنْگ زَدی.",
            en: "I know. I was just parking when you called.",
          },
        ],
        note: "دارَم میام is what you say when you are already on the way. می‌دونَم stays plain: *to know* is a state, so it takes no دارَم. In داشْتَم پارْک می‌کَرْدَم the first part of the compound, پارْک, sits between the two verbs. دارَن می‌رِسَن is *they are about to arrive*.",
      },
      {
        type: "quiz",
        questions: [
          {
            prompt: "Spoken: *I'm going right now* (two words).",
            lang: "fa",
            answers: ["دارم می‌رم"],
            explain: "دارَم می‌رَم: both verbs take ـَم. Written: دارَم می‌رَوَم.",
          },
          {
            prompt: "Written: *he is writing right now* (two words).",
            lang: "fa",
            answers: ["دارد می‌نویسد"],
            explain: "دارَد می‌نِویسَد; spoken داره می‌نِویسه.",
          },
          {
            prompt: "Spoken: *we were in the middle of eating* (two words).",
            lang: "fa",
            answers: ["داشتیم می‌خوردیم"],
            explain: "داشْتیم می‌خُورْدیم: the past of داشْتَن, then the past continuous.",
          },
          {
            prompt: "Spoken: *I'm not going* (one word). Remember what the progressive lacks.",
            lang: "fa",
            answers: ["نمی‌رم"],
            explain: "نِمی‌رَم: the progressive has no negative, so the plain present is used.",
          },
          {
            prompt: "Translate: داره بارون میاد.",
            lang: "en",
            answers: ["it's raining", "it is raining", "it's raining right now", "it is raining right now", "it's raining now", "it is raining now"],
            explain: "*dâre bârun miyâd*: literally *rain is coming*, and داره says it is coming down now.",
          },
        ],
      },
    ],
  },
];
