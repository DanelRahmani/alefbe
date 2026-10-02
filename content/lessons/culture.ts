import type { Lesson } from "../types";
import { PERSIAN_MONTHS } from "../calendar";

// Unit 13, culture in conversation: how to address people, greetings,
// taarof and the polite verbs, set phrases, and the Iranian calendar.
// Spoken Tehrani first, written beneath. Culture claims are kept to what
// holds broadly, and hedged where it varies by family, region or
// generation. Some lines are taken unchanged from earlier units (the comment
// names the lesson); the rest are original.
//
// The polite verbs (تَشْریف آوَرْدَن, مَیل کَرْدَن, فَرْمودَن) are not in the
// conjugation engine: they are used of the person addressed, in a few set
// forms, and never of oneself, so a full table would teach forms nobody uses.

const SOURCE =
  "Stilo, Talattof and Clinton, Modern Persian: Spoken and Written, on forms of address, greetings and polite phrases; Beeman, Language, Status, and Power in Iran (Indiana University Press, 1986), on taarof and the polite verbs; Brookshaw and Shabani-Jadidi, Farsi Shirin Ast, for everyday phrases.";

// The Iranian months and roughly when each begins (the first day of Farvardin
// falls on the spring equinox, 20 or 21 March).
const MONTH_STARTS = ["21 March", "21 April", "22 May", "22 June", "23 July", "23 August", "23 September", "23 October", "22 November", "22 December", "21 January", "20 February"];
const SEASONS = ["spring", "spring", "spring", "summer", "summer", "summer", "autumn", "autumn", "autumn", "winter", "winter", "winter"];

export const culture: Lesson[] = [
  {
    slug: "shoma-and-to",
    title: "شُما and تُو: which “you”",
    summary: "تُو is for family, close friends and children; شُما for everyone else, and for more than one. The verb follows: شُما takes the plural ending even for one person.",
    register: "both",
    kinds: ["culture", "grammar"],
    source: SOURCE,
    vocab: [
      { fa: "ایشون", written: "ایشان", en: "he, she (respectful)", topic: "people" },
      { fa: "صَمیمی", en: "close, friendly, informal", topic: "people" },
    ],
    blocks: [
      {
        type: "idea",
        text: "Persian has two words for *you*: **تُو** for people you are close to, and **شُما** for everyone else, and for more than one person. With شُما the verb takes the plural ending, even when you speak to one person.",
      },
      {
        type: "text",
        text: "Use تُو with family, close friends, children, and among young people of the same age. Use شُما with anyone you don't know well, with older people, in shops and offices, and with a teacher or a doctor. Families differ: in some, children say شُما to their parents; in many, تُو. When in doubt, start with شُما: moving to تُو is a step closer, and it is usually the older person who takes it. The verb and the endings follow the pronoun: کُجا می‌ری؟ to تُو, کُجا می‌رین؟ to شُما; اِسْمِت, *your name*, and اِسْمِتون. Speaking *about* someone you respect, Persian uses ایشان (spoken ایشون, *ishun*) with a plural verb, where English says *he* or *she*.",
      },
      { type: "heading", text: "Core examples" },
      {
        type: "examples",
        items: [
          // 0.3
          { fa: "{اِسْمِت} {چیه}؟", written: "{اِسْمَت} {چیسْت}؟", en: "What's your name? (to a friend)" },
          // 4.4
          { fa: "اِسْمِتون {چیه}؟", written: "نامِ شُما {چیسْت}؟", en: "What's your name?" },
          // 5.6
          { fa: "کُجا {زِنْدِگی می‌کُنین}؟", written: "کُجا {زِنْدِگی می‌کُنید}؟", en: "Where do you live?" },
          { fa: "{ایشون} مُعَلِّمِ مَنَن.", written: "{ایشان} مُعَلِّمِ مَن هَسْتَنْد.", en: "She is my teacher. (said with respect)" },
        ],
      },
      { type: "heading", text: "Contrast pair" },
      {
        type: "pair",
        title: "To a friend, or politely",
        // 8.5
        a: { fa: "{بیا} تو.", written: "{بیا} داخِل.", en: "Come in. (to a friend)" },
        b: { fa: "{بیایین} تو.", written: "{بیایید} داخِل.", en: "Come in. (politely, or to several people)" },
        diff: "The same command to تُو and to شُما. The شُما form serves for one person you are polite to and for a group alike.",
      },
      { type: "heading", text: "Common mistake" },
      {
        type: "callout",
        kind: "mistake",
        title: "شُما with a singular verb",
        text: "With شُما, use the plural ending, even for one person. A singular verb after it is heard in familiar speech, but it is a halfway form between تُو and شُما; keep the plural.",
        wrong: { fa: "شُما کُجا {می‌ری}؟", en: "(meant: Where are you going? said politely)" },
        right: { fa: "شُما کُجا {می‌رین}؟", written: "شُما کُجا {می‌رَوید}؟", en: "Where are you going?" },
      },
      { type: "heading", text: "In real conversation" },
      {
        type: "dialogue",
        title: "Meeting someone new",
        // 4.4
        lines: [
          { who: "Reza", fa: "اِسْمِتون {چیه}؟", written: "نامِ شُما {چیسْت}؟", en: "What's your name?" },
          { who: "Maryam", fa: "مَرْیَم. شُما {اَهْلِ کُجایین}؟", written: "مَرْیَم. شُما {اَهْلِ کُجا هَسْتید}؟", en: "Maryam. Where are you from?" },
          { who: "Reza", fa: "اَهْلِ شیرازَم. شُما چی؟", written: "اَهْلِ شیراز هَسْتَم. شُما چِطُور؟", en: "I'm from Shiraz. And you?" },
          { who: "Maryam", fa: "مَن اَهْلِ تِهْرونَم.", written: "مَن اَهْلِ تِهْران هَسْتَم.", en: "I'm from Tehran." },
        ],
        note: "Two people who have just met use شُما, and the verb follows it: کُجایین. If they become friends, one of them may later move to تُو.",
      },
      {
        type: "quiz",
        questions: [
          { prompt: "Which *you* would you use to a shopkeeper? Type its transliteration.", lang: "translit", answers: ["shomâ"], explain: "شُما, *shomâ*: for anyone you don't know well." },
          { prompt: "After شُما, is the verb singular or plural, even for one person? Type singular or plural.", lang: "en", answers: ["plural"], explain: "Plural: شُما کُجا می‌رین؟" },
          { prompt: "Make it polite: اِسْمِت چیه؟", lang: "fa", answers: ["اسمتون چیه"], explain: "اِسْمِتون چیه؟: the ending ـِتون goes with شُما." },
          { prompt: "Spoken, to شُما: *where do you live?* (three words)", lang: "fa", answers: ["کجا زندگی می‌کنین", "کجا زندگی می‌کنید"], explain: "کُجا زِنْدِگی می‌کُنین؟ (written می‌کُنید)." },
          { prompt: "Type the written respectful *he* or *she*, used with a plural verb.", lang: "fa", answers: ["ایشان"], explain: "ایشان, spoken ایشون (*ishun*)." },
        ],
      },
    ],
  },
  {
    slug: "names-and-titles",
    title: "Names, جان, آقا and خانُم",
    summary: "آقایِ and خانُمِ go before a surname; آقا before a first name and خانُم after it; جان after a first name is warm. Children call older people عَمو and خاله.",
    register: "both",
    kinds: ["culture"],
    source: SOURCE,
    vocab: [
      { fa: "آقا", en: "Mr; sir; gentleman", topic: "people" },
      { fa: "خانُم", en: "Mrs, Ms; madam; lady", topic: "people" },
      { fa: "جون", written: "جان", en: "dear (after a name); soul, life", topic: "people" },
      { fa: "عَمو", en: "uncle (father's brother)", topic: "people" },
      { fa: "خاله", en: "aunt (mother's sister)", topic: "people" },
      { fa: "عَزیزَم", en: "my dear", topic: "people" },
    ],
    blocks: [
      {
        type: "idea",
        text: "Iranians address people with **آقا** (*Mr, sir*) and **خانُم** (*Mrs, Ms, madam*) and a name, add **جان** (*dear*) after a first name to be warm, and use family words such as **عَمو** and **خاله** for older people.",
      },
      {
        type: "text",
        text: "With a surname, آقا and خانُم take the ezafe and come first: آقایِ رِضایی, خانُمِ رِضایی. This is the polite, formal way, and the one for strangers, colleagues and teachers. With a first name it is warmer but still respectful, and there is no ezafe: آقا comes before or after the name (آقا رِضا, رِضا آقا), and خانُم comes after it (سارا خانُم). On their own, آقا! and خانُم! call for someone's attention, in a shop or in the street. جان (*jân*, literally *soul, life*) after a first name is affectionate: سارا جان, said *sârâ jun* in speech and written جون in chat. It is used among family and friends, by older people to younger ones, and to elders after a family word (خاله جون, مامان جون). Children, and sometimes young people, call an older man عَمو (*uncle*, a father's brother) and an older woman خاله (*aunt*, a mother's sister), relative or not. Titles such as دُکْتُر are used as forms of address too.",
      },
      {
        type: "table",
        caption: "Ways to address someone",
        headers: ["Form", "Example", "Use"],
        rows: [
          ["آقایِ / خانُمِ + surname", "آقایِ رِضایی، خانُمِ رِضایی", "polite, formal"],
          ["آقا + first name, or after it", "آقا رِضا، رِضا آقا", "respectful, warmer"],
          ["first name + خانُم", "سارا خانُم", "respectful, warmer"],
          ["first name + جان", "سارا جان، spoken سارا جون", "warm, among family and friends"],
          ["عَمو، خاله", "سَلام عَمو!", "children, to an older person"],
        ],
      },
      { type: "heading", text: "Core examples" },
      {
        type: "examples",
        items: [
          { fa: "سَلام، {آقایِ رِضایی}!", en: "Hello, Mr Rezaei!" },
          { fa: "{سارا خانُم}، بِفَرْمایین.", written: "{سارا خانُم}، بِفَرْمایید.", en: "Here you are, Sara. (respectfully)" },
          { fa: "{مَرْیَم جون}، کُجایی؟", written: "{مَرْیَم جان}، کُجا هَسْتی؟", en: "Maryam dear, where are you?" },
          { fa: "{خانُم}، بِبَخْشید!", en: "Excuse me, madam!" },
        ],
      },
      { type: "heading", text: "Contrast pair" },
      {
        type: "pair",
        title: "Surname, or first name",
        a: { fa: "سَلام، {آقایِ رِضایی}!", en: "Hello, Mr Rezaei!" },
        b: { fa: "سَلام، {آقا رِضا}!", en: "Hello, Reza! (respectfully)" },
        diff: "With the surname, آقایِ takes the ezafe: formal. With the first name there is no ezafe: still respectful, but closer.",
      },
      { type: "heading", text: "Common mistake" },
      {
        type: "callout",
        kind: "mistake",
        title: "خانُم before a first name",
        text: "خانُمِ with the ezafe goes before a surname. With a first name alone, خانُم comes after it.",
        wrong: { fa: "سَلام، {خانُمِ سارا}!", en: "(meant: Hello, Sara! respectfully)" },
        right: { fa: "سَلام، {سارا خانُم}!", en: "Hello, Sara! (respectfully)" },
      },
      {
        type: "callout",
        kind: "dari",
        title: "Uncle in Kabul",
        text: "Where Iran says عَمو for a father's brother, Dari says کاکا (*kâkâ*), and children in Afghanistan call an older man کاکا as Iranian children say عَمو.",
        checked: false,
      },
      { type: "heading", text: "In real conversation" },
      {
        type: "dialogue",
        title: "On the stairs",
        lines: [
          { who: "Neda", fa: "سَلام، {خانُمِ رِضایی}! حالِتون چِطُوره؟", written: "سَلام، {خانُمِ رِضایی}! حالِ شُما چِطُور اَسْت؟", en: "Hello, Mrs Rezaei! How are you?" },
          { who: "Mrs Rezaei", fa: "مِرْسی، {نِدا جون}. مامانِت خوبه؟", written: "مُتَشَکِّرَم، {نِدا جان}. مادَرَت خوب اَسْت؟", en: "Thank you, Neda dear. Is your mum well?" },
          { who: "Neda", fa: "خوبه، سَلام می‌رِسونه.", written: "خوب اَسْت، سَلام می‌رِسانَد.", en: "She's well, and sends her regards." },
        ],
        note: "The younger neighbour uses خانُم and the surname; the older one uses the first name and جون. سَلام می‌رِسونه, literally *she delivers greetings*, is how Persian sends regards.",
      },
      {
        type: "quiz",
        questions: [
          { prompt: "Formal: *Mr Rezaei* (two words).", lang: "fa", answers: ["آقای رضایی"], explain: "آقایِ رِضایی: آقا with the ezafe, before the surname." },
          { prompt: "With a first name, does خانُم go before or after it? Type before or after.", lang: "en", answers: ["after"], explain: "After: سارا خانُم." },
          { prompt: "Spoken, as friends say it: *Sara dear* (two words).", lang: "fa", answers: ["سارا جون", "سارا جان"], explain: "سارا جون (*sârâ jun*); written سارا جان." },
          { prompt: "What does جان literally mean? Type one English word.", lang: "en", answers: ["soul", "life"], explain: "*Soul* or *life*: سارا جان is something like *Sara, my dear*." },
          { prompt: "Type the word children use for an older man, literally *uncle* (a father's brother).", lang: "fa", answers: ["عمو"], explain: "عَمو, *amu*; for an older woman, خاله." },
        ],
      },
    ],
  },
  {
    slug: "greetings",
    title: "Greetings and goodbyes through the day",
    summary: "سَلام at any hour, صُبْح بِخَیر in the morning, and شَب بِخَیر only when parting at night. خُداحافِظ is goodbye; چه خَبَر؟ asks what's new.",
    register: "both",
    kinds: ["culture", "spoken"],
    source: SOURCE,
    vocab: [
      { fa: "صُبْح بِخَیر", en: "good morning", topic: "everyday" },
      { fa: "شَب بِخَیر", en: "good night", topic: "everyday" },
      { fa: "خُداحافِظ", en: "goodbye", topic: "everyday" },
      { fa: "خُدانِگَهْدار", en: "goodbye (literally: God keep you)", topic: "everyday" },
      { fa: "چه خَبَر", en: "what's new?", topic: "everyday" },
      { fa: "سَلامَتی", en: "health; (reply) all's well", topic: "everyday" },
      { fa: "فِعْلاً", en: "for now; bye for now", topic: "everyday" },
    ],
    blocks: [
      {
        type: "idea",
        text: "**سَلام** works at any hour. **صُبْح بِخَیر** is *good morning*; **شَب بِخَیر** is *good night*, said mostly when parting at night or going to bed. **خُداحافِظ** is *goodbye*.",
      },
      {
        type: "text",
        text: "After سَلام comes a question about health: حالِت چِطُوره؟ to a friend, حالِتون چِطُوره؟ politely, or simply خوبی؟. چه خَبَر؟ (*che khabar?*, literally *what news?*) asks what's new; the usual answer is خَبَری نیسْت (*no news*) or سَلامَتی (*health*, meaning all is well). صُبْح بِخَیر (literally *morning with good*) is said until about midday; some people also say عَصْر بِخَیر in the late afternoon, but سَلام is always safe. For goodbye, خُداحافِظ (*khodâhâfez*, literally *(may) God (be your) protector*) suits everyone; it is often said quickly as *khodâfez*. خُدانِگَهْدار (*God keep you*) is a little more formal. Among friends and young people فِعْلاً (*for now*) and بای (from English *bye*) are common.",
      },
      { type: "heading", text: "Core examples" },
      {
        type: "examples",
        items: [
          { fa: "{صُبْح بِخَیر}! خوب خوابیدی؟", en: "Good morning! Did you sleep well?" },
          { fa: "سَلام! {چه خَبَر}؟", en: "Hi! What's new?" },
          { fa: "{خَبَری نیسْت}. {سَلامَتی}.", en: "Nothing much. All's well." },
          { fa: "{خُداحافِظ}، تا فَرْدا!", en: "Goodbye, see you tomorrow!" },
        ],
      },
      { type: "heading", text: "Contrast pair" },
      {
        type: "pair",
        title: "Arriving or leaving, at night",
        // 3.7
        a: { fa: "سَلام، حالِت چِطُوره؟", written: "سَلام، حالَت چِطُور اَسْت؟", en: "Hi, how are you?" },
        b: { fa: "{شَب بِخَیر}، {خُداحافِظ}!", en: "Good night, goodbye!" },
        diff: "Arriving in the evening, you say سَلام. شَب بِخَیر belongs mostly to leaving, or to going to bed.",
      },
      { type: "heading", text: "Common mistake" },
      {
        type: "callout",
        kind: "mistake",
        title: "شَب بِخَیر as hello",
        text: "English *good evening* is a greeting, but شَب بِخَیر is mostly a farewell (a radio or television host may open an evening programme with it). To greet someone arriving in the evening, say سَلام.",
        wrong: { fa: "{شَب بِخَیر}! حالِت چِطُوره؟", en: "(meant: Good evening! How are you? said on arriving)" },
        right: { fa: "{سَلام}! حالِت چِطُوره؟", written: "{سَلام}! حالَت چِطُور اَسْت؟", en: "Hello! How are you?" },
      },
      {
        type: "callout",
        kind: "dari",
        title: "Greetings in Kabul",
        text: "In Kabul people greet with *salâm* too, often the fuller *as-salâmu alaykum*, and to someone at work Dari says *mânda nabâshi*, where Tehran says خَسْته نَباشی (lesson 13.5).",
        checked: false,
      },
      { type: "heading", text: "In real conversation" },
      {
        type: "dialogue",
        title: "Leaving a dinner",
        lines: [
          // 10.4
          { who: "Ali", fa: "دیر شُده، {پَس} بِریم.", written: "دیر شُده اَسْت، {پَس} بِرَویم.", en: "It's late, so let's go." },
          { who: "Host", fa: "مِرْسی که اومَدین!", written: "مُتَشَکِّرَم که آمَدید!", en: "Thank you for coming!" },
          { who: "Ali", fa: "خَیلی خُوش گُذَشْت. {شَب بِخَیر}!", en: "We had a lovely time. Good night!" },
          { who: "Host", fa: "{خُداحافِظ}، بِه سَلامَت!", en: "Goodbye, safe journey!" },
        ],
        note: "بِه سَلامَت (*be salâmat*, literally *with health*) is said to someone setting off: *go safely*. Hosts also often say خَیلی خُوش اومَدین, *it was lovely to have you*, to guests leaving.",
      },
      {
        type: "quiz",
        questions: [
          { prompt: "Type *good morning* (two words).", lang: "fa", answers: ["صبح بخیر", "صبح به خیر"], explain: "صُبْح بِخَیر, *sobh bekheyr*." },
          { prompt: "Is شَب بِخَیر the usual way to greet someone arriving in the evening? Type yes or no.", lang: "en", answers: ["no"], explain: "No: it is mostly said when parting at night. Greet with سَلام." },
          { prompt: "Type the everyday *goodbye* (one word).", lang: "fa", answers: ["خداحافظ", "خدافظ", "خدانگهدار"], explain: "خُداحافِظ, *khodâhâfez*, often said *khodâfez* (and typed خُدافِظ in chat); خُدانِگَهْدار is a little more formal." },
          { prompt: "Someone asks چه خَبَر؟ Type a short reply meaning *nothing much* (two words).", lang: "fa", answers: ["خبری نیست"], explain: "خَبَری نیسْت, literally *there's no news*; or سَلامَتی." },
        ],
      },
    ],
  },
  {
    slug: "taarof",
    title: "Taarof and the polite verbs: بِفَرْمایید",
    summary: "Taarof is the ritual courtesy of offering, refusing and insisting. Polite verbs replace everyday ones when you speak of the other person: بِفَرْمایید, تَشْریف آوَرْدَن, مَیل کَرْدَن.",
    register: "both",
    kinds: ["culture", "verbs"],
    source: SOURCE,
    vocab: [
      { fa: "تَعارُف", en: "taarof, ritual politeness", topic: "everyday" },
      { fa: "تَعارُف کَرْدَن", en: "to offer out of politeness; to stand on ceremony", topic: "verbs" },
      { fa: "تَشْریف آوَرْدَن", en: "to come (of someone honoured)", topic: "verbs" },
      { fa: "مَیل کَرْدَن", en: "to eat, to drink (polite)", topic: "verbs" },
      { fa: "مَیل داشْتَن", en: "to feel like, to want (polite)", topic: "verbs" },
      { fa: "زَحْمَت", en: "trouble, effort", topic: "everyday" },
    ],
    blocks: [
      {
        type: "idea",
        text: "**Taarof** (تَعارُف) is the ritual courtesy of offering and refusing: a host offers, a guest declines, the host insists. And when you speak of what the other person does, **polite verbs** replace the everyday ones.",
      },
      {
        type: "text",
        text: "A host offers tea, fruit, a better seat, again and again; a guest often declines once or twice before accepting, and the host's insisting is part of the courtesy. A shopkeeper or a taxi driver may say قابِلی نَداره (*it's not worthy of you*) when you ask the price: it is politeness, not a gift, and you insist and pay. There is no sure test of a real offer, since insisting is part of the ritual too. The signs: it is pressed beyond the usual two or three rounds; it comes with concrete details (a time, a place); and the setting fits. Food offered at a host's home is meant; a shopkeeper's قابِلی نَداره never is. Friends cut through it with تَعارُف نَکُن (*don't stand on ceremony*) or تَعارُف نِمی‌کُنَم (*I mean it*). How much taarof people use varies a great deal: by family, by region, between generations, and with closeness.",
      },
      {
        type: "text",
        text: "**Polite verbs.** بِفَرْمایید (from فَرْمودَن, literally *to command*) is the all-purpose polite *please*: come in, sit down, help yourself, go ahead, here you are (lesson 8.5). تَشْریف آوَرْدَن (literally *to bring honour*) replaces آمَدَن for the person you honour: کَی تَشْریف میارین؟. مَیل کَرْدَن replaces خُورْدَن when you offer food or drink: بِفَرْمایین مَیل کُنین, *please, help yourself*. Its cousin مَیل داشْتَن, *to feel like*, asks what someone would like: چی مَیل دارین؟ (lesson 5.3); unlike the others it is said of yourself too, as a polite *no*: مِرْسی، مَیل نَدارَم. These verbs describe the other person, never yourself: of yourself you say اومَدَم, and تَشْریف آوُرْدَم would sound boastful, or like a joke. The same family has تَشْریف بُرْدَن (*to go*) and تَشْریف داشْتَن (*to be (somewhere)*); for yourself, the humble عَرْض کَرْدَن (*to say*, literally *to submit*) does the opposite job.",
      },
      {
        type: "table",
        caption: "Polite verbs",
        headers: ["Everyday", "Polite, of the other person", "Meaning"],
        rows: [
          ["بیا، بِشین، بِخُور", "بِفَرْمایید", "come, sit, help yourself…"],
          ["اومَدَن، آمَدَن", "تَشْریف آوَرْدَن", "to come"],
          ["خُورْدَن", "مَیل کَرْدَن", "to eat, to drink"],
          ["خواسْتَن", "مَیل داشْتَن", "to feel like (also of yourself)"],
        ],
      },
      { type: "heading", text: "Core examples" },
      {
        type: "examples",
        items: [
          // 8.5
          { fa: "سَلام! {بِفَرْمایین} تو.", written: "سَلام! {بِفَرْمایید} داخِل.", en: "Hello! Please come in." },
          { fa: "کَی {تَشْریف میارین}؟", written: "کَی {تَشْریف می‌آوَرید}؟", en: "When are you coming? (very politely)" },
          { fa: "بِفَرْمایین، {مَیل کُنین}.", written: "بِفَرْمایید، {مَیل کُنید}.", en: "Please, help yourself." },
          { fa: "{تَعارُف نَکُن}، بِفَرْما!", en: "Don't be shy, help yourself!" },
        ],
      },
      { type: "heading", text: "Contrast pair" },
      {
        type: "pair",
        title: "Polite, or more polite",
        a: { fa: "کَی {میایین}؟", written: "کَی {می‌آیید}؟", en: "When are you coming? (to شُما)" },
        b: { fa: "کَی {تَشْریف میارین}؟", written: "کَی {تَشْریف می‌آوَرید}؟", en: "When are you coming? (very politely)" },
        diff: "Both are said to شُما. The plain verb is polite enough; to someone you honour, such as an older relative or a guest, تَشْریف آوَرْدَن goes further.",
      },
      { type: "heading", text: "Common mistake" },
      {
        type: "callout",
        kind: "mistake",
        title: "A polite verb about yourself",
        text: "The polite verbs honour the other person. Used of yourself, they sound boastful or comic.",
        wrong: { fa: "دیروز {تَشْریف آوُرْدَم}.", en: "(meant: I came yesterday)" },
        right: { fa: "دیروز {اومَدَم}.", written: "دیروز {آمَدَم}.", en: "I came yesterday." },
      },
      { type: "heading", text: "In real conversation" },
      {
        type: "dialogue",
        title: "A cup of tea",
        lines: [
          { who: "Host", fa: "چایی {مَیل دارین}؟", written: "چای {مَیل دارید}؟", en: "Would you like some tea?" },
          { who: "Guest", fa: "نَه، مِرْسی. زَحْمَت نَکِشین.", written: "نَه، مُتَشَکِّرَم. زَحْمَت نَکِشید.", en: "No, thank you. Don't go to any trouble." },
          { who: "Host", fa: "زَحْمَتی نیسْت. {تَعارُف نَکُنین}!", written: "زَحْمَتی نیسْت. {تَعارُف نَکُنید}!", en: "It's no trouble. Please, don't be shy!" },
          // 0.2
          { who: "Guest", fa: "باشه، مِرْسی.", written: "باشَد، مُتَشَکِّرَم.", en: "OK, thanks." },
        ],
        note: "The guest declines once, the host insists, and the guest accepts: a short round of taarof. چایی مَیل دارین؟ uses مَیل داشْتَن, *to feel like*. زَحْمَت نَکِشین is literally *don't take trouble*.",
      },
      {
        type: "quiz",
        questions: [
          { prompt: "Type the polite all-purpose *please* (come in, help yourself), spoken, to شُما.", lang: "fa", answers: ["بفرمایین", "بفرمایید"], explain: "بِفَرْمایین (written بِفَرْمایید), from فَرْمودَن." },
          { prompt: "Which polite verb replaces خُورْدَن when offering food? Type the infinitive (two words).", lang: "fa", answers: ["میل کردن"], explain: "مَیل کَرْدَن: بِفَرْمایین مَیل کُنین. (چی مَیل دارین؟ is مَیل داشْتَن, *to feel like*.)" },
          { prompt: "Would you say تَشْریف آوُرْدَم about yourself? Type yes or no.", lang: "en", answers: ["no"], explain: "No: the polite verbs describe the other person. Say اومَدَم." },
          { prompt: "A shopkeeper says قابِلی نَداره when you ask the price. Should you leave without paying? Type yes or no.", lang: "en", answers: ["no"], explain: "No: it is taarof. Insist and pay." },
          { prompt: "Spoken, to a friend: *don't stand on ceremony* (two words).", lang: "fa", answers: ["تعارف نکن"], explain: "تَعارُف نَکُن; to شُما, تَعارُف نَکُنین." },
        ],
      },
    ],
  },
  {
    slug: "set-phrases",
    title: "Set phrases: دَسْتِت دَرْد نَکُنه, خَسْته نَباشی, نوشِ جان",
    summary: "Persian has a fixed phrase for thanking someone's effort, greeting someone at work, wishing a meal well, congratulating and offering condolences. Each has a literal meaning and a right moment.",
    register: "both",
    kinds: ["culture", "spoken"],
    source: SOURCE,
    vocab: [
      { fa: "دَسْتِت دَرْد نَکُنه", written: "دَسْتَت دَرْد نَکُنَد", en: "thank you (for what you did)", topic: "everyday" },
      { fa: "خَسْته نَباشی", en: "hello, well done (to someone working)", topic: "everyday" },
      { fa: "نوشِ جان", en: "enjoy your meal", topic: "food" },
      { fa: "مُبارَک", en: "blessed; congratulations", topic: "everyday" },
      { fa: "تَوَلُّد", en: "birth; birthday", topic: "everyday" },
      { fa: "خُوشْمَزه", en: "tasty, delicious", topic: "food" },
      { fa: "سیر", en: "full (after eating)", topic: "food" },
    ],
    blocks: [
      {
        type: "idea",
        text: "Everyday courtesy runs on **set phrases**: one to thank someone's effort, one for someone at work, one for a meal, one to congratulate and one to console. Each has a literal meaning, and a right moment.",
      },
      {
        type: "table",
        caption: "Set phrases (to تُو; to شُما the verb takes ـین and the ending ـِتون)",
        headers: ["Phrase", "Literally", "When"],
        rows: [
          ["دَسْتِت دَرْد نَکُنه", "may your hand not hurt", "thanks for something someone did or made for you; the reply is سَرِت دَرْد نَکُنه, *may your head not hurt*"],
          ["خَسْته نَباشی", "may you not be tired", "to someone working or just finished (a shopkeeper, a colleague, a cook); the reply is سَلامَت باشی or مِرْسی"],
          ["نوشِ جان", "(may it be) sweet to your soul", "to someone eating, or in reply to thanks for food"],
          ["تَوَلُّدِت مُبارَک", "your birthday (be) blessed", "happy birthday; مُبارَک باشه, *may it be blessed*, for any good news"],
          ["خُدا رَحْمَتِش کُنه", "may God have mercy on him (her)", "on hearing of a death, or when mentioning someone who has died"],
        ],
      },
      {
        type: "text",
        text: "Two of them can surprise: خَسْته نَباشی is not a remark that you look tired, but a kind word for someone's work, and it is answered, not argued with. It would be odd to someone who has spent the day resting, unless as a tease. دَسْتِت دَرْد نَکُنه thanks an effort, so it suits a meal, a favour or a gift, more than a plain *thank you* would. To someone who has lost a relative or a friend, say the condolence in the examples below (literally *I say condolence*).",
      },
      { type: "heading", text: "Core examples" },
      {
        type: "examples",
        items: [
          { fa: "{نوشِ جان}!", en: "Enjoy your meal!" },
          { fa: "{تَوَلُّدِت مُبارَک}!", written: "{تَوَلُّدَت مُبارَک}!", en: "Happy birthday!" },
          { fa: "{[تَسْلیت|tasliyat] می‌گَم}.", written: "{[تَسْلیت|tasliyat] می‌گویَم}.", en: "My condolences." },
          { fa: "{مُبارَک باشه}!", written: "{مُبارَک باشَد}!", en: "Congratulations!" },
        ],
      },
      { type: "heading", text: "Contrast pair" },
      {
        type: "pair",
        title: "To a friend, or politely",
        a: { fa: "{خَسْته نَباشی}!", en: "Good work! (to a friend at work)" },
        b: { fa: "{خَسْته نَباشین}!", written: "{خَسْته نَباشید}!", en: "Good work! (politely, to someone at work)" },
        diff: "The same phrase to تُو and to شُما: only the verb's ending changes. To a shopkeeper or a colleague, the شُما form.",
      },
      { type: "heading", text: "Common mistake" },
      {
        type: "callout",
        kind: "mistake",
        title: "Answering the words, not the wish",
        text: "خَسْته نَباشی is a kind wish, not a question about how you feel. Thank the person instead of telling them whether you are tired.",
        wrong: { fa: "نَه، {خَسْته نیسْتَم}.", en: "(as a reply to خَسْته نَباشی: it answers the words)" },
        right: { fa: "{سَلامَت باشی}!", en: "Thank you! (literally: may you be healthy)" },
      },
      { type: "heading", text: "In real conversation" },
      {
        type: "dialogue",
        title: "After dinner",
        lines: [
          { who: "Ali", fa: "{دَسْتِت دَرْد نَکُنه}! خَیلی خُوشْمَزه بود.", written: "{دَسْتَت دَرْد نَکُنَد}! خَیلی خُوشْمَزه بود.", en: "Thank you! It was delicious." },
          { who: "Sara", fa: "{نوشِ جان}! بازَم می‌خوای؟", written: "{نوشِ جان}! باز هَم می‌خواهی؟", en: "Enjoy! Would you like some more?" },
          { who: "Ali", fa: "نَه، مِرْسی. سیر شُدَم.", written: "نَه، مُتَشَکِّرَم. سیر شُدَم.", en: "No, thanks. I'm full." },
        ],
        note: "دَسْتِت دَرْد نَکُنه thanks the cook for the work; نوشِ جان wishes the food well, and also answers the thanks.",
      },
      {
        type: "quiz",
        questions: [
          { prompt: "Spoken, to a friend who cooked for you: *thank you* (three words).", lang: "fa", answers: ["دستت درد نکنه"], explain: "دَسْتِت دَرْد نَکُنه, *may your hand not hurt*." },
          { prompt: "Type what you say to someone who is eating (two words).", lang: "fa", answers: ["نوش جان"], explain: "نوشِ جان, *nush-e jân*." },
          { prompt: "Spoken, to a shopkeeper: *may you not be tired* (two words).", lang: "fa", answers: ["خسته نباشین", "خسته نباشید"], explain: "خَسْته نَباشین: the شُما form." },
          { prompt: "Spoken: *happy birthday*, to a friend (two words).", lang: "fa", answers: ["تولدت مبارک"], explain: "تَوَلُّدِت مُبارَک." },
          { prompt: "Someone says خَسْته نَباشی. Type the usual two-word reply.", lang: "fa", answers: ["سلامت باشی", "سلامت باشین", "سلامت باشید"], explain: "سَلامَت باشی, *may you be healthy* (to شُما, سَلامَت باشین); a plain مِرْسی also does." },
        ],
      },
    ],
  },
  {
    slug: "calendar",
    title: "Nowruz, Yalda and the Iranian calendar",
    summary: "Iran's year begins at Nowruz, the spring equinox. Its festivals follow the seasons: Nowruz, سیزْدَهْ‌بِه‌دَر thirteen days later, and Yalda, the longest night.",
    register: "both",
    kinds: ["culture"],
    source:
      "The Iranian calendar as the Today card computes it (the browser's Intl Persian calendar) and as Encyclopaedia Iranica describes it; Stilo, Talattof and Clinton, Modern Persian: Spoken and Written, on the festivals and their phrases; the Encyclopaedia Iranica entries on Nowruz, the Iranian calendars and the seasonal festivals (Čahāršanba-sūrī, Sizdah-bedar, Yaldā) for the customs.",
    vocab: [
      { fa: "نَوروز", en: "Nowruz, the Iranian new year", topic: "time" },
      { fa: "عید", en: "festival, holiday (in speech, often Nowruz)", topic: "time" },
      { fa: "سیزْدَهْ‌بِه‌دَر", en: "Sizdah-bedar, the 13th day of the new year", topic: "time" },
      { fa: "یَلْدا", en: "Yalda, the longest night", topic: "time" },
      { fa: "اَنار", en: "pomegranate", topic: "food" },
      { fa: "هِنْدونه", written: "هِنْدِوانه", en: "watermelon", topic: "food" },
      { fa: "تَقْویم", en: "calendar", topic: "time" },
      { fa: "سالِ نَو", en: "the new year", topic: "time" },
    ],
    blocks: [
      {
        type: "idea",
        text: "Iran's calendar is **solar**, and its year begins at **Nowruz** (نَوروز, *new day*), the spring equinox, on 20 or 21 March. Its festivals follow the seasons.",
      },
      {
        type: "text",
        text: "The official calendar (هِجْریِ شَمْسی, *solar hijri*) counts its years from the Hijra, as the Islamic calendar does, but by the sun: the year 1405 began in March 2026. The first six months have 31 days, the next five 30, and اِسْفَنْد 29, or 30 in a leap year. The week starts on Saturday (lesson 9.5). Religious holidays follow the lunar Islamic calendar, so they move through the solar year. The Today card on the home page shows today's date in this calendar.",
      },
      {
        type: "table",
        caption: "The months",
        headers: ["Month", "Season", "Begins around"],
        rows: PERSIAN_MONTHS.map((m, i) => [m, SEASONS[i], MONTH_STARTS[i]]),
      },
      {
        type: "text",
        text: "**Nowruz** is the new year and the main holiday: families visit relatives, starting with the oldest; a table is laid with the هَفْت‌سین, seven things whose names begin with س; children are given عیدی, a new-year present, often money; schools close for about two weeks. In everyday speech عید on its own usually means Nowruz. Before it, on the evening before the last Wednesday of the year, چَهارْشَنْبه‌سوری is celebrated with bonfires that people jump over. **سیزْدَهْ‌بِه‌دَر**, the thirteenth of فَرْوَرْدین, ends the holidays: families spend the day outdoors, often at a picnic. **شَبِ یَلْدا**, the longest night of the year (the night before the first of دِی, around 21 December), is spent with family, eating pomegranates and watermelon and taking a فال (an omen) from Hafez's poems. Customs vary by family and region.",
      },
      { type: "heading", text: "Core examples" },
      {
        type: "examples",
        items: [
          { fa: "{عیدِتون مُبارَک}!", written: "{عیدِتان مُبارَک}!", en: "Happy Nowruz! (to شُما)" },
          { fa: "{نَوروز} کُجا می‌رین؟", written: "{نَوروز} کُجا می‌رَوید؟", en: "Where are you going for Nowruz?" },
          { fa: "{شَبِ یَلْدا} اَنار وُ هِنْدونه می‌خُوریم.", written: "{شَبِ یَلْدا} اَنار وَ هِنْدِوانه می‌خُوریم.", en: "On Yalda night we eat pomegranates and watermelon." },
          { fa: "اِمْروز {چَنْدُمه}؟", written: "اِمْروز {چَنْدُم اَسْت}؟", en: "What's the date today?" },
        ],
      },
      { type: "heading", text: "Contrast pair" },
      {
        type: "pair",
        title: "The holiday, or the year",
        a: { fa: "{عیدِتون مُبارَک}!", written: "{عیدِتان مُبارَک}!", en: "Happy Nowruz! (to شُما)" },
        b: { fa: "{سالِ نَو مُبارَک}!", en: "Happy New Year!" },
        diff: "Both are said at Nowruz. عید is the holiday, and also serves for other festivals; سالِ نَو is the new year itself.",
      },
      { type: "heading", text: "Common mistake" },
      {
        type: "callout",
        kind: "mistake",
        title: "شَبِ جُمْعه is Thursday night",
        text: "شَبِ with a day names the evening *before* that day: شَبِ جُمْعه is Thursday night, as شَبِ عید is the eve of Nowruz. For the evening of the day itself, put شَب after it.",
        wrong: { fa: "{شَبِ جُمْعه} میام.", en: "(meant: I'll come on Friday night; this says Thursday night)" },
        right: { fa: "{جُمْعه شَب} میام.", written: "{جُمْعه شَب} می‌آیَم.", en: "I'll come on Friday night." },
      },
      {
        type: "callout",
        kind: "dari",
        title: "The months in Afghanistan",
        text: "Afghans have long used the solar calendar too, with the year beginning at Nowruz, but Dari names the months after the signs of the zodiac: the first three are حَمَل, ثَور and جَوزا.",
        checked: false,
      },
      { type: "heading", text: "In real conversation" },
      {
        type: "dialogue",
        title: "A Nowruz call",
        lines: [
          { who: "Neda", fa: "سَلام خاله جون! {عیدِتون مُبارَک}!", written: "سَلام خاله جان! {عیدِتان مُبارَک}!", en: "Hello, auntie! Happy Nowruz!" },
          { who: "Aunt", fa: "مِرْسی عَزیزَم، {عیدِ تُو هَم مُبارَک}!", written: "مُتَشَکِّرَم عَزیزَم، {عیدِ تُو هَم مُبارَک}!", en: "Thank you, dear, happy Nowruz to you too!" },
          { who: "Neda", fa: "{سیزْدَهْ‌بِه‌دَر} کُجا می‌رین؟", written: "{سیزْدَهْ‌بِه‌دَر} کُجا می‌رَوید؟", en: "Where are you going for Sizdah-bedar?" },
          { who: "Aunt", fa: "می‌ریم باغ. شُما هَم بیایین!", written: "به باغ می‌رَویم. شُما هَم بیایید!", en: "We're going to the garden. Come along, all of you!" },
        ],
        note: "Neda says شُما to her aunt; the aunt answers with تُو and عَزیزَم, *my dear*. On Sizdah-bedar many families go out of town for the day.",
      },
      {
        type: "link",
        href: "/",
        label: "See today's Iranian date",
        text: "on the Today card of the home page.",
      },
      {
        type: "quiz",
        questions: [
          { prompt: "Type the first month of the Iranian year.", lang: "fa", answers: ["فروردین"], explain: "فَرْوَرْدین: it begins at Nowruz." },
          { prompt: "On which day of فَرْوَرْدین is سیزْدَهْ‌بِه‌دَر? Type the number.", lang: "en", answers: ["13", "13th", "thirteen", "thirteenth"], explain: "The thirteenth: سیزْدَهْ is *thirteen*." },
          { prompt: "Besides watermelon, which fruit is eaten on شَبِ یَلْدا? Type it in Persian.", lang: "fa", answers: ["انار"], explain: "اَنار, *anâr*, pomegranate." },
          { prompt: "شَبِ جُمْعه is which evening? Type the English day.", lang: "en", answers: ["thursday", "thursday night", "thursday evening"], explain: "Thursday: شَبِ names the evening before the day." },
          { prompt: "Spoken, to شُما: *Happy Nowruz!* (two words)", lang: "fa", answers: ["عیدتون مبارک"], explain: "عیدِتون مُبارَک." },
        ],
      },
    ],
  },
];
