@AGENTS.md

# Alefbe: where the work stands

Updated 2026-10-02. Read this first when picking the work back up.

## The project

Alefbe is an example-first course in Iranian Persian, built as a Next.js static export. It replaces alefbe.study.

- The approved plan is `docs/PLAN.md`: the Pareto curriculum and the phases. Phase 4 in detail is in `C:\Users\danel\.claude\plans\ancient-nibbling-torvalds.md`.
- Accuracy comes first:
  - Every Persian string is fully vowel-marked; the rules are in `content/STYLE.md`.
  - Every lesson has a `source`.
  - Each new unit gets a fresh reviewer agent. Give it the unit file, the `npm run dump <unit>` output and STYLE.md, and apply every finding before shipping.

## Branches and deploys

- Work on `nextgen`. Pushing it updates new.alefbe.study, a preview behind Vercel login; leave that protection as it is.
- `main` is production: www.alefbe.study. The owner merged `nextgen` into `main` themselves on 2026-09-29.
- Don't merge into `main` unasked. Push to `nextgen` and let the owner review and merge.
- Commit and push once per finished sub-phase.

## Phase 4 status

Done:

- **4a:** practice platform, and parity with the old app.
- **4a+:** the "Orosi" design.
- **4b, 4c, 4c+:** Units 0–4, 33 lessons, each unit reviewed and corrected.
- **4d:** the dictionary and the `/grammar` overview. Also site search (`/` or Ctrl+K).
- **4e, part 1** (pushed 2026-09-30):
  - Lesson quizzes keep scores (`alefbe2:lessons`), show them on the path, and offer "Retry the ones I missed".
  - The continue card resumes the last opened lesson.
  - The mistake notebook (`lib/mistakes.ts`, `alefbe2:mistakes`, `/practice/mistakes`):
    - it is fed by lesson quizzes, the trainer, the letter quiz and the games;
    - an item leaves after two right answers in a row.
  - Stars on dictionary entries, lesson examples and dialogue lines (`lib/starred.ts`, `alefbe2:starred`). "My words" on `/dictionary?view=mine` has a CSV download.
  - Tools on each example: star; "Show sound", which reveals that one example's transliteration; and "Copy", which copies the Persian as it is displayed.
  - Keyboard shortcuts: `?` opens the list, and ← → move between lessons (`components/Shortcuts.tsx`, `components/lesson/LessonKeys.tsx`).
  - Unit 2 lessons set `showMarks`, so every vowel mark shows whatever the setting.
  - A mark named on a bare stroke (ـّ ـْ) shows in every vowel mode.

- **4e, part 2** (pushed 2026-09-30):
  - The Today card on the home page (`components/TodayCard.tsx`, `lib/today.ts`, store `alefbe2:today`):
    - reviews due across all four trainer decks (via `drillCandidates` in `lib/drill.ts`), and mistakes waiting;
    - a daily goal ring of 5, 10 or 20 activities, counted from `alefbe2:activity`;
    - the streak;
    - a word of the day, which strides through the dictionary by date, so nothing repeats until every word has had its day;
    - today in the Iranian calendar. The Persian date comes from `Intl` and is shown unmarked. The month's reading comes from the marked names in `content/calendar.ts`, which a test checks against `Intl`.
  - The word inspector (`components/WordInspector.tsx`, `lib/inspect.ts`):
    - Tapping a Persian word inside `[data-inspect]` (lesson articles and the dictionary) opens a popover. It shows the reading, the meaning if the word is in the dictionary, and the letters with their forms, linked to the letter pages.
    - Lookup is by exact marked spelling, written or spoken, and also without an ezafe. It never ignores marks, so مَرد is never taken for مُرد.
    - Quizzes are excluded (`data-no-inspect`).
    - `FaText` emits `data-words` for runs with transliteration overrides, and `data-unmarked` for forced unmarked runs.
  - Display settings gained text size S/M/L and a Persian typeface, Vazirmatn or Naskh (Amiri). They are stored in `alefbe2:settings` as `size` and `faFont` and put on `<html data-size data-fafont>` by `lib/prepaint.ts`, which has its own test. The CSS uses the `--fa-font` variable.
  - The "Type it" game (`/practice/games/type`):
    - Copy-typing uses short examples from the lessons of Unit 3 on (`content/type-it.ts`); half of each game has a half-space.
    - `checkCopy` in `lib/games.ts` ignores marks and punctuation. It names each spacing mistake, such as "Half-space between می and خرم (you typed a space)".
    - The feedback shows spaces and half-spaces as visible markers.
  - Printing:
    - Tracing sheets at `/practice/sheets` (`lib/sheets.ts`, `components/trace/SheetBuilder.tsx`): choose letter groups, all forms or only the isolated one, and a key word row.
    - The print stylesheet in `app/practice.css`: ink on white in any theme; the chrome, quizzes, tools and anything marked `data-no-print` are hidden.

- **4f** (pushed 2026-09-30): the static export (`alefbe-static` in `.claude/launch.json`, port 3001) was checked on all 87 routes at 375 px, in light and dark, with reduced motion on.
  - Results: no horizontal scroll, no running animations, and a focus ring on every Tab stop (the first 60 per page). There were no console errors other than local-only 404s: the Vercel Analytics script, and Next's prefetch files, which `serve` can't map but Vercel serves.
  - Fixes:
    - The search button had no accessible name at phone width.
    - The faint tracing guides failed the contrast check; they are now CSS-drawn decoration.
    - Fonts: only Literata (latin), Vazirmatn and Markazi (latin) are preloaded. Amiri loads when used. Every page used to preload 10 font files, about 540 KB.
  - Lighthouse (mobile, local static server), before → after:

    | Page | Performance | Accessibility |
    |---|---|---|
    | `/` | 28 → 67 | 95 → 100 |
    | Lesson 4.5 | 28 → 78 | 95 → 100 |
    | `/practice/sheets` | 52 → 76 | 90 → 100 |

    SEO is 100. Best practices is 96 locally, only because of those 404s. Production (4e part 1) scored 75 / 95 / 100 / 100.
  - Still open: LCP is about 5 s on throttled mobile. The next step is to look at the hero window and the `backdrop-filter` glass (style and layout dominate the main thread).

## Phase 5 status

Phase 5 is Units 5–6 and the conjugation trainer (see `docs/PLAN.md`).

- **5a** (2026-09-30): the conjugation engine.
  - `lib/conjugate.ts` builds every form from a verb's stems: the present, affirmative and negative, spoken and written. `Tense` is a union with one case so far; the other tenses join as more cases in `conjugate()`.
  - `content/verbs.ts` holds 25 verbs: 22 simple and 3 compound. Compounds reuse their light verb's stems through `light`. داشتن has `noMi`.
  - Spoken stems are the Tehrani ones: ر ش گ د خوا دون تون خون آر ذار. Speech runs می into آ: میام, میارَم.
  - `tests/conjugate.test.ts` has golden tables written by hand for every verb, spoken and written, plus a golden transliteration for 9 verbs.
  - The content tests now fail any string that splits or closes up a known half-space form: every conjugated form, and every vocab word. Overrides and `wrong` examples are exempt.
  - `npx tsx scripts/verbs.ts < /dev/null` prints every table with its transliteration, for proofreading.
  - The reviewer raised 5 findings, all applied:
    - the spoken 1p/2p after â became می‌خواییم / میایین (*mikhâyim*, *miyâyin*), with the one-ی spellings accepted as variants; lesson 4.1's می‌خوایْن was changed to match;
    - دانستن and شناختن are told apart in English;
    - the stems رَو / شَو read *row*/*show* and آ reads empty on their own, so lessons cite them with overrides.
- **5b** (2026-09-30): Unit 5, "Everyday verbs: the present", lessons 5.1–5.6, in `content/lessons/present.ts`.
  - The lessons are: two stems; می + stem + ending; the ten verbs; نمی; داشتن; compound verbs.
  - Conjugation tables come from `lib/conjugate.ts` through `table()`.
  - The grammar overview's present-tense topic now links to 5.2.
  - The reviewer raised 13 findings, all applied, plus 4 optional polish items. Among them:
    - the shared endings are three, not four;
    - the ـیدَن rule names دیدَن and شِنیدَن as exceptions;
    - *ân*→*un* is hedged;
    - *to be* is also exempt from می;
    - the نگه داشتن rule was restated;
    - the bakery became a corner shop, where the shopkeeper says شَرْمَنْده;
    - a duplicate quiz question was replaced.
  - STYLE.md's Dari rule now matches the owner's instruction: notes ship with `checked: false` and are listed in the phase report. The 5.2 note (the prefix is *mē-* in Dari) is waiting for the owner.
  - Checked at 375 px in light and dark: no horizontal scroll, focus ring shown, no app console errors. Lighthouse accessibility is 100 on 5.3 and 5.5 (served by `alefbe-static`).
- **5c** (2026-09-30): Unit 6, "Nouns and links", lessons 6.1–6.7, in `content/lessons/nouns.ts`.
  - The order is: the ezafe; ezafe for *of*; the ezafe after vowels; plurals; یه and ـی; را; را in speech.
  - The را lesson moved from 6.1 to 6.6 and kept its slug. Progress, quiz scores, the notebook and grammar links are keyed by `unit/slug`, and numbers are positional, so nothing saved breaks.
  - Links added:
    - the grammar topics (ezafe, plurals, a/one) now link to their lessons;
    - the reference table's ezafe-hamze row points at 6.3 (no longer in `FUTURE_LESSONS`).
  - The reviewer raised 16 findings, all applied, plus 2 optional polish items. Among them:
    - the دستِ مریمه gloss;
    - the مرا exception to "را is a separate word";
    - `[ـهٔ|-ye]` and `[ـو|-o]` overrides;
    - broader ـان and ـیان rules (بانوان), and یه + plural + ـی in speech;
    - ordinals as an exception before the noun, and بیشترِ;
    - رو *ru* ("on") told apart from رُو *ro*.
  - Checked at 375 px in dark mode: no horizontal scroll. The only console errors are the known local-only 404s and aborted prefetches. Lighthouse accessibility is 100 on 6.3 and 6.7.
- **5d** (2026-09-30): the conjugation trainer at `/verbs`.
  - `lib/verb-drill.ts` (pure, with tests):
    - an item is `verb:tense`; the items come in five groups of five verbs, and a group opens once every item before it reaches box 3;
    - each review asks one random form: person, spoken or written (the learner can pick one), and negative about 30% of the time;
    - answers are checked with `checkFa`. Chat spellings are accepted with a note (می‌آم for میام, one-ی می‌خوایم, spoken *-id*). Typing another form of the same verb names it: "That is the written form for they, negative…".
  - Store `alefbe2:verbs` (`verbsStore`) holds `{ decks: per tense, ask }`. It is in `ALL_STORES` and `BACKUP_KEYS`, with a backup round-trip test.
  - Wiring:
    - `reviewsDue` counts the verb deck, and the Today card links to `/verbs` when verbs lead (`reviewHref`);
    - misses go to the notebook as `{ kind: "verb", … }`, which the notebook replays with `VerbPrompt` / `VerbSolution`.
  - The page:
    - it has the trainer, plus a collapsible spoken/written table for all 25 verbs;
    - it is in `routes.ts`, the search index and the practice hub (`VerbOverview`);
    - the nav highlights Practice on it.
  - Checked at 375 px in light and dark: no horizontal scroll, 16 Tab stops all with a ring. A wrong answer was hinted, logged in SRS and noted; the notebook replay was right. Lighthouse accessibility is 100 on `/verbs` and `/practice`.

The owner merged Phase 5 into `main` through PR #7 (2026-09-30).

## Phase 6 status

Phase 6 is Units 7–9 and the vocabulary deck (see `docs/PLAN.md`). The owner's brief sets the order: 6a engine (past tenses), 6b Unit 7, 6c engine (subjunctive, imperative, future), 6d Unit 8, 6e Unit 9, 6f the vocabulary deck at `/vocab`.

- **Before 6a:** `nextgen` was fast-forwarded to `main` and pushed. The owner's answers to the Phase 5 questions came back blank, so nothing changed and every question stays under "Waiting on the owner".
- **6a** (2026-09-30): the past tenses in the engine, and a tense picker in the trainer.
  - `Tense` is now `present | past | perfect | imperfect | progressive | past-progressive`. `TENSES` carries each one's title, Persian term, the lesson that opens it, what it says in English (`says`), and an optional `note`.
  - Forms:
    - simple past: past stem + ending, none for he/she; the negative is نَـ, with a ی before a vowel (نَیامَدَم, spoken نَیومَدَم);
    - present perfect: written رَفْته‌اَم … رَفْته اَسْت; spoken رَفْتَم … رَفْته, spelled like the simple past except for he/she (the stress differs: *ráftam*, *raftám*);
    - past continuous: می + simple past; speech runs می into a vowel (میومَدَم, میاوُرْدَم);
    - progressive: داشتن in front, conjugated too, in the present or the past (دارَم می‌رَم, داشْتَم می‌رَفْتَم); a compound's noun stays by its verb (دارَم کار می‌کُنَم).
  - Verbs without a form: `lacks(verb, tense, negative, all)` returns the reason (shown in the tables) or null. `conjugate` throws for a missing form, and `allForms`, the trainer and the tables skip it.
    - بودن has no present here (lesson 4.2 teaches it);
    - بودن and داشتن have no past continuous (no می);
    - the `stative` verbs (بودن, داشتن, خواستن, دانستن, توانستن, شناختن) have no progressive;
    - the progressive has no negative.
  - `content/verbs.ts` has 26 verbs: بودن was added first (flag `copula`; present stem باش for Unit 8). Each verb has five English forms. `enEvent` glosses the simple past of a state as an event (دونِسْتَم, *I found out*; می‌دونِسْتَم is the plain *I knew*). `enNow` gives a natural progressive gloss (*watching*). `spoken.pastPrefixed` is گذاشتن's short stem after a prefix (نَذاشْتَم, می‌ذاشْتَم).
  - The text engine gained one reading (rule 4f′ in `analyze.ts`, in STYLE.md): a bare و after a long *i* and before a consonant is *u*, so میومَدَم reads *miyumadam*.
  - Golden tables for every verb in every new tense, spoken and written, are in `tests/conjugate-past.test.ts`, typed by hand, with the negatives by hand where a ی bridges or the stem shortens. Every new form is in the content tests' half-space list through `allForms`.
  - The trainer (`lib/verb-drill.ts`, `components/verbs/`):
    - a tense picker; `VerbsData` gained `tense` (last practised) and `opened` (tenses opened before their lesson);
    - `tenseOpen`: the present is always open; another tense opens when its lesson is marked done, or through "Open anyway". The page passes each tense's lesson to the trainer, so the client bundle does not carry the lessons;
    - groups are built from the verbs that have the tense, so the present deck's groups did not move;
    - the progressive is never asked in the negative; the spoken perfect asks he/she half the time;
    - a wrong answer that is a form of another tense is named ("That is the simple past …");
    - accepted with a note: رفته‌ام and رفته‌م for the spoken perfect, رفته for written رفته است, می‌اومدم for میومدم, both stems of گذاشتن.
  - `/verbs` shows one tense's tables at a time (`VerbTables`, a client component), so the page did not grow. The practice hub counts across the open tenses (`verbTotals`).
  - The reviewer found no marking or half-space error, and raised 1 error, 3 should-fix, 6 polish and 3 it could not verify. All were applied; the unverified ones are under "Waiting on the owner".
  - Checked at 375 px in light and dark: no horizontal scroll, no console errors; a wrong answer was scheduled and noted, and the notebook names the tense. Lighthouse accessibility is 100 on `/verbs`.

- **6b** (2026-09-30): Unit 7, "Talking about the past", lessons 7.1–7.5, in `content/lessons/past.ts`.
  - The lessons are: the simple past; نـ on the past; the present perfect; the past continuous; the progressive with داشتن.
  - Their slugs are the ones `TENSES` opens with (`simple-past`, `present-perfect`, `past-continuous`, `in-progress`; 7.2 is `past-negative`). A content test checks that every tense's lesson exists.
  - Tables come from `lib/conjugate.ts` through `table()`. The grammar overview's simple-past topic links to 7.1.
  - What the lessons take care over:
    - the spoken perfect is told apart by stress in positive forms only; the lessons claim nothing about the negative;
    - for most states the past with می is the everyday past (می‌دونِسْتَم, *I knew*), and داشتن and بودن take no می;
    - the progressive has no negative, is not used with states, means *about to* with a verb of a single moment, and belongs first to speech;
    - the Persian term for the progressive is left out until the owner confirms its vowel.
  - One override: [میومَدَم|miyumadam] in 7.4. No contracted possessive or object ending is used.
  - The reviewer found no errors and raised 7 should-fix, 12 polish and 2 it could not verify. All were applied (one needed no change). Among them:
    - the ی of نَیامَد comes before آ, not before every vowel;
    - "as a child" became وَقْتی بَچّه بودَم / بَچّه که بودین;
    - صُبْحونه in the spoken line; دُرُسْت کَرْدَن for making a meal;
    - the likelier mistake دارَم نِمی‌رَم replaced نَدارَم می‌رَم;
    - a tip on two differences from English (the present for "have lived here for two years"; نِشَسْته, *is sitting*).
  - Checked at 375 px in light and dark: no horizontal scroll; no app console errors. Lighthouse accessibility is 100 on 7.3 and 7.5.

- **6c** (2026-09-30): the rest of the engine: the present subjunctive, the imperative and the future.
  - `Tense` gained `subjunctive`, `imperative` and `future`. A tense can limit its persons (`persons`: a command is only for تو and شما) and its styles (`styles`: the future is written only). Use `personsOf(tense)` and `stylesOf(tense)`; `hasForm(verb, spec, all)` combines them with `lacks`. `table()` returns one form per person the tense has.
  - Forms:
    - subjunctive: بِـ + present stem + ending (بِرَوَم, spoken بِرَم); before آ it is بیا (بیایَم, بیام); the negative puts نَـ in its place (نَرَم, نَیام); بودن is باشَم, and داشتن is داشْته باشَم;
    - imperative: to تو the stem with بِـ and no ending (بِکُن), to شما the subjunctive form (بِرین, written بِرَوید); `command` in the verb data holds the ones that are not بِـ + stem (بُرُو in both styles; spoken بِشُو, بِگو, بِده);
    - future: خواهَم رَفْت, negative نَخواهَم رَفْت; a compound's noun goes first (کار خواهَم کَرْد).
  - Verb flags: `bare` (a compound with کردن drops بِـ: کار کُنَم, with کار بِکُنَم accepted); `noCommand` (the reason, for توانستن and خواستن); `noNegCommand` (دانستن, شناختن, فهمیدن: nobody orders "don't know", and نَفَهْم is an insult); `enCommand` ("get to know").
  - The prefix is بِـ in every form, spoken and written. Tehrani *bo-* before an *o* (*bokon*, *bokhor*) is explained in a note on the two tenses, not shown in the forms.
  - Not covered yet, as no verb in the list needs it (comments in `conjugate.ts`): a stem starting with اَ / اُ / ای (بیفتم, بایستم); prefixed verbs on داشتن (نِگَهْ دارَم); دَویدَن's *bodo*.
  - Golden tables for every verb are in `tests/conjugate-unit8.test.ts`, typed by hand; every command row, do and don't, is by hand.
  - The trainer asks a command of تو or شما only and the future in writing only. A leading که is accepted before a subjunctive. The `/verbs` tables show only the columns and rows a tense has.
  - The three tenses open with lessons 8.1, 8.5 and 8.6 (`want-can-must/subjunctive`, `…/commands`, `…/future`). Until Unit 8 is written the trainer says the lesson is on the way; the content test checks a tense's lesson only once its unit has lessons.
  - The reviewer found no wrong form or mark, and raised 5 should-fix, 7 polish and 5 it could not verify. All were applied; the unverified ones are under "Waiting on the owner".
  - Checked at 375 px: no horizontal scroll, no app console errors. Lighthouse accessibility is 100 on `/verbs`.

- **6d** (2026-09-30): Unit 8, "Want, can, must", lessons 8.1–8.6, in `content/lessons/want-can-must.ts`.
  - The lessons are: the subjunctive; want to; can; باید; commands; the future. Slugs: `subjunctive`, `want-to`, `can`, `must`, `commands`, `future`.
  - Tables come from the engine. Three helpers build the combined ones: a helper verb plus a subjunctive (می‌خوام بِرَم), باید plus a subjunctive, and the command table (to تو; to شما spoken and written).
  - The prefix is named بـ in prose, unmarked, with its sound given as *be-*: a marked stroke (بِـ) fails the readability check.
  - What the lessons take care over:
    - compounds with کردن and شدن usually drop بـ (کار کُنَم, بیدار شَم);
    - the second verb's own words go between the two verbs, but a destination can follow in speech (می‌خوام بِرَم کوه);
    - می‌شه asks permission with an *I* verb and makes a request with a *you* verb; its written line is می‌شَوَد, and مُمْکِن اَسْت is given as the more formal way;
    - نَباید is *mustn't*, لازِم نیست is *don't have to*; باید with the past continuous is *should have* or *had to*;
    - the command's model verb is بِبین (its شما form really is the تو form plus an ending); the one-letter stems are explained after it;
    - the future is the present in speech; خواهَم رَفْت belongs to writing.
  - One override: [بیاین|biyâyin] in 8.5. No contracted possessive or object ending on a vowel-final word, and no ـست after a vowel, is used.
  - The reviewer found no marking, half-space or contraction problem, and raised 1 error, 13 should-fix and 22 polish. All were applied (two needed no change: lines without a written twin carry no "Spoken" tag, and the بایَدَم callout stands).
  - Checked at 375 px in light and dark: no horizontal scroll, no console errors; the trainer's gate links to each tense's lesson. Lighthouse accessibility is 100 on 8.1 and 8.5.

- **6e** (2026-10-01): Unit 9, "Where, when, how much", lessons 9.1–9.6, in `content/lessons/where-when.ts`.
  - The lessons are: the core prepositions; place words with the ezafe; this and that; numbers and counting words; time, days and prices; comparing. Slugs: `prepositions`, `place-words`, `this-and-that`, `numbers`, `time-and-prices`, `comparing`.
  - The grammar overview's prepositions, comparison and numbers topics link to 9.1, 9.6 and 9.4. The overview's prepositions table gained تا and "by (a vehicle)".
  - What the lessons take care over:
    - تو (*tu*, in) against تُو (*to*, you), and رو (*ru*, on) against رُو (*ro*, را): they look alike in every display mode, so the lessons say which is meant;
    - تو is the short form of تویِ; for *in*, writing has both تویِ and دَر;
    - صِفَتِ اِشاره before a noun, ضَمیرِ اِشاره alone; هَمین جا written apart (the Academy joins only اینجا and آنجا);
    - the three irregular hundreds (دِویسْت, سیصَد, پانْصَد); تا not after یه, not before a measure, and not with نَفَر;
    - no preposition before a day or a time; the week begins on Saturday, and the weekend is *traditionally* Thursday and Friday; prices are in tomans, "in everyday use" ten rials;
    - the comparative and superlative (صِفَتِ بَرْتَر, صِفَتِ بَرْتَرین); بِهْتَر and بیشْتَر are the irregular ones, کَمْتَر is only spelled as one word; both orders with اَز are correct.
  - Unit 5 fix: مَیل (*meyl*) was unmarked in lesson 5.3's dialogue and read *mil*.
  - The reviewer raised 3 errors (two unmarked words, مَیدان and مَیل; one false rule about کَمْتَر), 11 should-fix, 20 polish and 7 it could not verify. All were applied (one polish item, کوبیده for کَباب, needed no change); the unverified ones are under "Waiting on the owner".
  - Checked on the static build at 375 px in light and dark: no horizontal scroll, every table fits. Lighthouse accessibility is 100 on 9.1 and 9.4.

- **6f** (2026-10-01): the vocabulary deck at `/vocab`.
  - `lib/vocab.ts` (pure, with tests). `content/vocab.ts` builds `VOCAB_CARDS` at build time: every dictionary entry a lesson teaches (425 now), in lesson order. Trainer-only words, with no lesson, are left out.
  - A card joins when one of its lessons is marked done. The prompt is the English; the learner types the Persian. "Show the sound" (stored) adds the transliteration. Leitner scheduling from `lib/srs.ts`, one deck, no groups. Answers are checked with `checkFa`.
  - Decisions (for the owner's review):
    - a card accepts the written form and the spoken form alike, says which was typed, and shows both;
    - words with exactly the same English get a hint on the prompt, the shortest start that tells them apart ("starts with ق");
    - typing the other word for the same English, or a word whose English differs only by a note in brackets ("to know (a fact)" / "(a person)"), is not a miss: the learner is told and tries again, and nothing is scheduled;
    - two entries spelled alike once the marks are off (پَنْجَره, پَنْجِره) count as one answer;
    - with no lesson done, "Practise anyway" drills every word and schedules nothing.
  - Store `alefbe2:vocab` (`vocabStore`: `{ deck, sound }`), in `ALL_STORES` and `BACKUP_KEYS`, with a backup round-trip test.
  - Wiring:
    - misses go to the notebook as `{ kind: "vocab", id, fa, spoken, en, hint }`, carried whole so the notebook can ask them without the card list;
    - `reviewsDue` counts due vocabulary cards from the deck alone (`vocabDue`), skipping words no longer in the dictionary, and the Today card links to `/vocab` when they lead;
    - the page is in `content/routes.ts`, the search index and the practice hub (`VocabOverview`), and the nav highlights Practice on it.
  - The client bundle does not carry the lessons: the page passes the cards as props, and the notebook stores what it needs.
  - Checked on the static build (port 3000 was taken by another project's server): no horizontal scroll at 375 px in light and dark; keyboard focus ring shown; a wrong answer was scheduled and noted, the notebook replayed it, and the Today card linked to `/vocab`. The only console errors are the known local-only 404s. Lighthouse accessibility is 100 on `/vocab` and `/practice`.

Phase 6 and the practice extras are complete; the owner merged them into `main` through PR #8 (2026-10-01). Next: Phase 7 (the placement check, the engine forms for Unit 11, Units 10–11), with a ready prompt in `docs/PROMPT-phase-7.md`.

## Phase 7 status

Phase 7 is the placement check, the engine forms for Unit 11, and Units 10–11 (owner's brief: `docs/PROMPT-phase-7.md`). Order: 7a placement check, 7b engine, 7c Unit 10, 7d Unit 11.

- **Before 7a:** the tree was clean; `nextgen` matched `origin/main` (the local `main` ref was stale and was fast-forwarded).
- **7a** (2026-10-02): the placement check at `/placement` (not `/start`, which reads like the "Start here" unit at `/learn/start-here`).
  - The hard rule of the practice extras holds: every question is a lesson-quiz question from `LESSON_QUIZZES`, unchanged.
  - `content/placement.ts` lists them by hand, two per band, in course order: a band per unit, with Units 1–3 sharing the script band. 18 questions (14 up to Unit 9; Units 10 and 11 were added in 7d). Adding a unit is one line. Persian-script answers were preferred, since most people taking the check don't know the transliteration scheme (`ketab-e khub` fails against `ketâb-e khub`); the one transliteration question, لیوان, has no vowel to guess.
  - `lib/placement.ts` (pure, with tests): the first band with two misses is where to start (its first lesson), and the check stops there, as later answers can't change it. A single miss in a band is a slip: the band counts as known, but that lesson stays unfinished. With no band failed, the start is the first lesson after the last band; with nothing after it, the result says "You know what Units 1–9 teach" and links to the review queue. An "I don't know" button counts as a miss.
  - The result page names the reason ("You missed both questions on the past tenses (from lessons 7.1 and 7.4)"), links to the lesson, lists the slips as "worth a look", and offers to mark the earlier lessons finished, slips excepted, after a confirmation. Marking a lesson finished opens its vocabulary, cloze and spoken ↔ written cards, and its verb tense (`tenseOpen` already reads `progress`), so the tenses open with their lessons and nothing separate was needed. When Units 1 and 2 are all marked, every letter group opens too, as the fast track does (`openLetterGroups` in `lib/stores.ts`, now shared with `SkipAhead`). No activity is logged.
  - Misses don't go to the notebook and nothing is scheduled. Store `alefbe2:placement` (`placementStore`: `{ last: { at, answers } }`; the suggestion is worked out from the answers), in `ALL_STORES` and `BACKUP_KEYS`, with a backup round-trip test.
  - Links: lesson 0.3 (an English `link` block after the skip button), the home page (a line under the first-lesson card while nothing is finished and no check has been taken), the search index and `content/routes.ts`.
  - Fix found while testing, in every typed-answer trainer (`FaAnswerField`, vocab, verbs, drill, games, letter quiz, review queue): clicking **Next** with the mouse showed "Type an answer first". React reused one `<button>` for Check and Next, so it became `type="submit"` before the click's default action and submitted the empty field. The two buttons now have their own `key`. Pressing Enter was never affected.
  - Checked on the static build at 375 px in light and dark: no horizontal scroll; a fail, a slip and an all-pass run gave the right start; marking opened 28 lessons and all letter groups; the focus ring shows on every control. Lighthouse accessibility is 100 on `/placement`, `/` and lesson 0.3.
- **7b** (2026-10-02): the past perfect, the past subjunctive and the passive in the engine.
  - `Tense` gained `past-perfect` (ماضیِ بَعید, lesson `more-verbs/past-perfect`), `past-subjunctive` (ماضیِ اِلْتِزامی, `more-verbs/past-subjunctive`), and the passive as two tenses, `passive` and `past-passive` (مُضارِعِ اِخْباریِ مَجْهول, ماضیِ سادهٔ مَجْهول), both opening with `more-verbs/passive`.
  - Forms, all built on the participle (past stem + ه; in speech from the spoken stem, اومَده, خونْده, آوُرْده):
    - past perfect: participle + بودن in the simple past (رَفْته بودَم); speech is the same with its own endings (بودین, بودَن); نَـ on the participle (نَرَفْته بودَم, نَیامَده, spoken نَذاشْته);
    - past subjunctive: participle + باشَم (رَفْته باشَم, spoken باشه, باشین); نَـ on the participle;
    - passive: participle + شدن in the present or the simple past (دیده می‌شَوَد, spoken دیده می‌شه; دیده شُد); نَـ on شدن (دیده نِمی‌شَوَد, دیده نَشُد). Only *it* and *they* (`persons`), as the subject is usually a thing; the prompt shows آن / اون, and این / اینا are accepted (`pronounOf`, `personEnOf`).
  - Missing forms (`lacks`, with the reason): بودن's past perfect (exists, but uncommon); داشتن's past subjunctive (داشْته باشَم serves for both). No passive for a verb that takes no object (new flag `intransitive`: بودن, رفتن, آمدن, شدن and the three compounds) or with `noPassive`: کردن (its compounds put شدن in its place, lesson 11.5), گفتن, خواستن (impersonal), دانستن (*is considered*), فهمیدن, توانستن, داشتن. 12 verbs are drilled in the passive.
  - English: "I had gone", "that I have gone", "he/she/it is seen"; a state's past passive is an event (شِناخْته شُد, *was recognised*); a modal adds "(do it)".
  - Golden tables in `tests/conjugate-unit11.test.ts`, by hand: every past perfect and passive row typed whole; the past subjunctive as each verb's participle plus the باشَم row, with four verbs typed out whole; the negatives by rule, with the exceptions listed (آمدن, آوردن, spoken گذاشتن).
  - The trainer, the tables and the practice hub take the tenses from `TENSES`; the gate says the lessons are on the way until Unit 11 is written. A wrong tense is named ("That is the past passive…"). The cloze and spoken ↔ written decks are unchanged (their scripts' output diffed before and after).
  - The reviewer found no wrong form, mark, negation or half-space, and raised 3 should-fix, 7 polish and 2 it could not verify; all were applied, and the two went to "Waiting on the owner". Among them: آن / اون for the passive's *it*; گفتن out of the passive drill; fairer reasons for بودن, کردن, دانستن and فهمیدن; a note on the past perfect (کُجا رَفْته بودی؟) and on a plural thing with a singular verb (کِتاب‌ها خوانْده شُد).
  - Checked at 375 px in light and dark: no horizontal scroll; the tables show the right rows. Lighthouse accessibility is 100 on `/verbs`.
- **7c** (2026-10-02): Unit 10, "Longer sentences", lessons 10.1–10.6, in `content/lessons/longer-sentences.ts`.
  - The lessons are: "the book that…" (ـی + که); که clauses; اَگه with real conditions; the linking words وَقْتی, چون, وَلی, پَس; object endings; word-building (ـی, ـگاه, ـچی, ـسْتان). Slugs: `the-book-that`, `that-clauses`, `if`, `linking-words`, `object-endings`, `word-building`.
  - Object endings are the first contracted pronoun endings in the course. The engine reads them right with no override (دیدَمِش *didamesh*, بِهِش *behesh*, بِهَم *beham*, باهاش *bâhâsh*, دوسْتِت *dustet*). Only verbs ending in a consonant carry them in examples; the text names the vowel-final forms (دیدیش, می‌بینَتِش) without using them. Writing is shown with the pronoun (او را دیدَم, به او), except دوسْتَت دارَم, which writing has too.
  - What the lessons take care over: که can't be dropped before a relative clause, and ـی goes on the describer (کِتابِ خوبی که), not on a name; where را goes in writing and speech; reported speech keeps the speaker's tense (گُفْت که میاد); اَگه with the subjunctive, the present for what is taken as given, and the simple past for a future event, which وَقْتی shares; *if* meaning *whether* is not اَگه; کَی asks, وَقْتی joins; پَس for a decision or a conclusion; derivational ـی is stressed, and after a silent ه is often ای, often ـگی (خَسْتِگی).
  - The grammar overview gained four topics under Unit 10 (the book that, if, the linking words, me/you/him), each linked to its lesson, with examples copied from the lessons.
  - Vocabulary: 33 new words; 6 existing words also gain a Unit 10 lesson, with their English unchanged. The vocabulary deck has 458 cards (was 425).
  - Cloze: 376 cards (was 322), 63 left out (one more, a whole-sentence blank). 10.1's pair line «کِتابی خَریدَم» is 6.5's line, so it is one card that also joins with 10.1. New rules in `lib/cloze.ts` (all from lesson rules, no new Persian): که after a verb of saying, knowing, hearing, hoping or thinking may go (`clauseKe`, also used by convert; not a که meaning *when*, nor after ـی); وَقْتی که and چون که; اون before a line-initial noun with ـی + که; اونو / اون رو + the verb for a verb with ـِش; the written option of a gap with که gets a "both are right" note.
  - Spoken ↔ written: 379 cards (was 322), 57 directions left out (12 more, by hand). New rules in `lib/convert.ts`: که kept or left out after those verbs, both ways; toward writing, اَمّا and وَلی for each other (five earlier cards gained this too). Left out toward speech by hand: seven object-ending lines (the pronoun may become an ending or stay a spoken pronoun), three "in" before home, one "in" before a country, one where writing points back with به آنْجا.
  - The content reviewer raised 2 errors (اونُو read *unu*; an unmarked conjunction و), 8 should-fix, 10 polish and 3 it could not verify. The card reviewer raised 2 errors (a written option that dropped the verb; وَلی rejected in writing), about 11 should-fix, 8 polish and 2 it could not verify. All were applied, by content changes (the unit was new), rule changes or leave-outs, except these, which needed no change: باران می‌آیَد kept in writing (standard, and parallel to the spoken line); the simple past not accepted on the pair card that asks for the subjunctive; no tense hint for شنیدن (not in the engine); written word order and a repeated به kept as the line has them; خَسْته هَسْتی not added (the line's short ending is right too). The unverified ones are under "Waiting on the owner".
  - Earlier content: رِسْتوران is read *resturân* (since Unit 6); the reviewer expects *restorân*. Listed for the owner, not changed.
  - Checked on the static build at 375 px in light and dark: no horizontal scroll on the six lessons or `/grammar`. Lighthouse accessibility is 100 on 10.1, 10.5 and `/grammar`. Its `td-has-header` audit (not scored) fails on tables with an empty first header, here and already on lesson 4.5.
- **7d** (2026-10-02): Unit 11, "More verb forms", lessons 11.1–11.5, in `content/lessons/more-verbs.ts`.
  - The lessons are: the past perfect; the past subjunctive; unreal conditions; the passive with شدن; کردن / شدن pairs and causatives. Slugs: `past-perfect`, `past-subjunctive`, `unreal-if`, `passive`, `kardan-shodan`; the three tense lessons are the ones `TENSES` opens with, and the trainer's gate now links to them.
  - Tables come from the engine through `table()`; the passive tables have the two rows the tense has, labelled *it* and *they*.
  - What the lessons take care over: the past perfect before another past moment (and not the present perfect for *had*); کُجا رَفْته بودی؟ as *where did you go?*; the past subjunctive after شایَد, اُمیدْوارَم, فِکْر نِمی‌کُنَم, and بایَد as *must have* (usually a conclusion; with a deadline, done by then), against بایَد + past continuous (*should have*, 8.4); unreal conditions with the past continuous in both halves in speech, the past perfect in the if-half in either register, writing more often; بودن and داشتن with the simple past, so اَگه وَقْت داشْتَم، میام (a plan) and …، میومَدَم (unreal) differ only in the second half; *would* is the past continuous; the passive with شدن carrying tense and negative, only for verbs with an object, with no را and usually no doer; a plural thing can take the singular verb in writing; کردن / شدن pairs (گُم کَرْدَم / گُم شُدَم); causatives in ـانْدَن (spoken ـونْدَن, also ـانیدَن).
  - The grammar overview gained two topics under Unit 11 (unreal conditions, the passive).
  - The placement check gained its Units 10 and 11 bands: 10.1 *the book that I bought*, 10.3 *if it rains*, 11.1 *I had gone*, 11.3 *if I knew*.
  - Vocabulary: 476 cards (was 458). Cloze: 417 cards (was 376), 64 left out. Spoken ↔ written: 412 cards (was 379), 66 directions left out. One 11.5 line is the same as a 9.5 line and joins its convert card.
  - Card rules (`lib/forms.ts`, `lib/convert.ts`): the progressive is no longer read across a comma between two gaps (اَگه پول داشْتَم، … می‌خَریدَم); a participle the engine doesn't know with بودن or شدن is named as the past perfect, past subjunctive or passive in the lesson that teaches that tense (elsewhere خَسْته شُدَم stays a compound in the simple past), and a perfect passive (فِرِسْتاده نَشُده) gets no hint; toward writing مَرا also as من را, toward speech مَنُو also as من رو.
  - The content reviewer found no error in marks, half-spaces, readings or forms, and raised 4 should-fix, 6 polish and 4 it could not verify. The card reviewer raised 3 errors (two kinds of wrong tense hint; the past continuous rejected in a spoken if-half), 8 should-fix, 5 polish and 1 it could not verify. All were applied by content changes, rule changes or leave-outs, among them: a natural passive (این غَذا سَرْد خُورْده می‌شه) in place of *dinner is served*; written گُم کَرْده‌اَم for *I've lost*; written اِشْکال نَدارَد; written اَگَر به تِلِفُن جَواب می‌دادی. These needed no change: توی not accepted for spoken تو (the checker can't tell it from تُو, *you*); سُروده شُد for a poem (not in reviewed data, and the English says *written*); two unreal-if gaps without a hint (the English decides). The unverified ones are under "Waiting on the owner".
  - Checked on the static build at 375 px in light and dark: no horizontal scroll on the five lessons, `/verbs` or `/placement`; the passive tables show two rows; the gate links to lesson 11.4. Lighthouse accessibility is 100 on 11.1, 11.4, 11.5, `/placement` and `/verbs`.

Phase 7 is complete on `nextgen`; the owner merged it through PR #10.

## Phase 8 status

Phase 8 is Units 12–14 (owner's brief: `docs/PROMPT-phase-8.md`). Order: 8a Unit 12, 8b Unit 13, 8c the reading view and Unit 14.

- **Before 8a:** the tree was clean and `nextgen` contained `origin/main`; 1155 tests passed.
- **8a** (2026-10-02): Unit 12, "Spoken and written", lessons 12.1–12.6, in `content/lessons/spoken-written.ts`.
  - The lessons are: the two registers; sound changes; *is* and the verb endings; the short spoken stems; words that differ; how Iranians type chat (spoken spellings, Finglish, the half-space). Slugs: `two-registers`, `sound-changes`, `endings`, `short-stems`, `different-words`, `chat`.
  - Reused lines: almost every example, pair and dialogue line is an earlier lesson's line, copied with its markup (a comment names the lesson), so the cloze and spoken ↔ written decks join the existing card. New Persian: the tables, اینْجوری / این‌طُور بِنِویس, the callouts' wrong/right lines, and the 4.3 and 10.1 lines with a new highlight on چی.
  - Each lesson ends with a link to `/practice/convert`; the practice hub's convert card names Unit 12. The stem tables (12.3, 12.4) come from the engine.
  - What the lessons take care over: ân → un is a tendency of particular words (ایران, دانِشْگاه, دانِشْجو, اِنْسان keep it; اِمْتِحان has both); the plural *-â* only after a consonant; *is* as ـه only after a consonant (کُجاسْت, often *kojâs*; آفْتابیه); one spoken ـه for two written things (ـَد and اَسْت); the past stem changes in a few verbs only; آره / بَله is a matter of politeness, not register alone; چی is written چه or چِطُور; Finglish has no standard and writes ق as *gh*.
  - Placement: Unit 12 has a band (12.3 دارین, 12.4 می‌گَم): it tests rules, and a learner who knows the grammar but not the spoken forms should land there. The grammar overview gained a "Spoken and written" topic, linked to 12.3.
  - Card rules: `lib/cloze.ts` keeps a line left out by hand out wherever a later lesson repeats it (reason "repeats a line left out by hand"). `lib/convert.ts` accepts a joined ـُو typed as a separate رو where the written line has را (lesson 6.7); one earlier card gained it (10.5 اونُو دیدَم also takes اون رو دیدم).
  - Earlier content fixed: lesson 5.2's written line had the spoken وُ (مَن وُ مینا); it is now وَ. Its convert card's text changed, nothing else.
  - The content reviewer raised 1 error, 12 should-fix, 9 polish and 3 it could not verify; the card reviewer 2 errors, 4 should-fix, 4 polish, 1 it could not verify. All were applied by content changes, rule changes or leave-outs, except: the cloze note on فَرْدا {چی}؟ still calls چِطُور "the written words" (it is accepted; the note is generic); chat joinings after a vowel (کلیدارو) are not accepted (no lesson teaches them); 9.6's English *more slowly* (also *more quietly*) is earlier content, listed for the owner; 7.5's written progressive kept.
  - Cards: cloze 419 (was 417; 4 new left out by hand or as repeats, 6 whole sentences, 1 answer in the English); spoken ↔ written 418 (was 412; 4 directions left out by hand). Vocabulary: 482 cards (was 476; 6 new words).
  - Checked on the static build at 375 px in light and dark: no horizontal scroll, every table fits (the stem tables were split in two to fit); only the known local-only 404s in the console. Lighthouse accessibility is 100 on 12.1, 12.4 and 12.6.

## Practice extras status

The owner's brief is `docs/PROMPT-practice-extras.md`: X1 cloze, X2 spoken ↔ written, X3 one review queue. The hard rule: no new Persian. Every Persian string a learner sees comes unchanged from reviewed lesson data; a card that would need another string is left out.

- **X1** (2026-10-01): cloze practice at `/practice/cloze`.
  - `lib/cloze.ts` (pure, with tests) turns every highlighted line of an examples block, a pair or a dialogue into a card: the line with its highlight blanked, the English beneath. Callouts are skipped, so no `wrong` example is used. `content/cloze.ts` builds `CLOZE_CARDS` (322) with `VERBS` and `CLOZE_LEAVE_OUT`.
  - A card's id is `unit/lesson#hash`: the first lesson's key and an FNV-1a hash of the line's markup. A line taught twice is one card that joins with either lesson. The trainer prunes deck entries whose id has left the course (`pruneDeck`).
  - Decisions (for the owner's review):
    - the spoken line is asked; each gap also takes the words the written line has in that place, with a note. Gaps are matched to the written highlights by edit distance, so a reordered written line still lines up. A written option is dropped where it would repeat a shown word (مَغازه‌ای) or where the written line has اَسْت, هَسْت- or a pronoun outside its highlight;
    - several highlights: one answer box, the words in order; each gap is judged on its own, spoken or written;
    - a gap with a verb shows its tense ("the verb: past continuous"), as the English often fits several tenses. A form two tenses share (spoken رَفْتَم) is named only in the lesson that teaches one of them. The progressive is named once, also across two gaps (دارَم … می‌رَم);
    - a dialogue card shows the line before;
    - also right, all from reviewed data:
      - the engine's other spellings of a verb form (`lib/forms.ts`: میام / می‌آم, one-ی, بـ on a bare compound);
      - the other "you", all gaps at once, where nothing on the card, in its dialogue or in the English fixes تُو or شُما (commands included);
      - را / رُو / ـو (and مَرا); تو / تویِ / دَر for "in"; اون for او;
      - the answer of a card that looks the same (کُجا … زِنْدِگی می‌کُنین / می‌کُنی);
    - notes for a missing ـهٔ and digits typed for a number.
  - Left out (62): 36 whole-sentence blanks, 6 part-word highlights (می‌, ـها), 3 whose English gives the answer (Persian or *ketâb-e man*), 1 name the English gives, and 16 by hand in `CLOZE_LEAVE_OUT`. The by-hand ones are cards whose English allows a synonym or another construction the lessons don't give (ممنون for مرسی, نشستن not in the engine…); a test checks each id still names a card.
  - `lib/forms.ts` (pure, with tests): a form index over every conjugation, phrase segmentation, the engine's variants (`acceptedAnswers`) per form, the other "you", tense labels (`gapTenses`). X2 reuses it.
  - Store `alefbe2:cloze` (`clozeStore`, `{ deck }`), in `ALL_STORES` and `BACKUP_KEYS`, with a backup round-trip test. Misses go to the notebook as `{ kind: "cloze", ...card }` (no lesson list) and replay there with `ClozePrompt` / `ClozeSolution`. `reviewsDue` counts due cloze cards from the deck alone (`clozeDue`); the Today card links to `/practice/cloze` when they lead.
  - The page is in `content/routes.ts`, the search index and the practice hub (`ClozeOverview`). `components/practice/FaAnswerField.tsx` is the shared typed-answer field (Check/Next, Persian keyboard at the caret).
  - `npx tsx scripts/cloze.ts < /dev/null` prints every card: gaps, accepted answers with their notes, hints, and the lines left out.
  - The reviewer raised 16 findings on the first pass (2 errors, 9 should-fix, 5 polish) and 10 on the re-check (1 error, 4 should-fix, 5 polish); all were applied by rule changes or leave-outs. Two content points went to "Waiting on the owner".
  - Checked on the static build at 375 px in light and dark: no horizontal scroll, focus ring shown, a miss was scheduled and noted, the notebook replayed it, the Today card linked here. Lighthouse accessibility is 100 on `/practice/cloze` and `/practice`.
- **X2** (2026-10-01): the spoken ↔ written drill at `/practice/convert`.
  - `lib/convert.ts` (pure, with tests) makes a card from every example, pair or dialogue line in a "both" lesson whose written line differs from the spoken one once marks and punctuation are off (322 cards; no callouts, so no `wrong` line). Lines that differ only in marks or punctuation are one card. The id is `unit/lesson#hash` of both lines.
  - Two directions, spoken → written by default, each with its own Leitner deck (`decks["to-written"]`, `decks["to-spoken"]`); the chips switch, and the choice is stored (`dir`).
  - Checking a whole sentence: marks and punctuation ignored; a missing or extra half-space is a near miss with the checker's hint, naming the word; a half-space after a non-joining letter (روز‌ها) is dropped first, as it shows nothing. A wrong answer names the first word that differs: "You typed می‌رم; the written form has می‌رَوَم", a word missing, a word extra, a word that comes later, or the right words in the wrong order. Typing the shown line back gets its own hint.
  - Accepted with a note (decisions, for the owner's review), all from reviewed data:
    - the checker's Academy variants and ـه‌ی for ـهٔ;
    - every verb form as the conjugation trainer accepts it (one-ی, می‌آم, ـید for ـین, رفته‌ام in chat, بـ on a bare compound), but only forms of the target's register and of a verb the other line has too (so written گذاشتی never takes spoken ذاشتی, and بِشین is not read as شدن); never a spoken stem with a written اَسْت;
    - toward writing: دَر ⇄ تویِ for "in"; the written present for a written future (with a note that the line wants the future);
    - toward speech: کِتاب رُو joined as کتابو; بَله for آره; the spoken words in the written line's order, with or without به (every word matched to a word of the other line);
    - the target of another card that shows the same line.
    - An alternative never equals the line shown (written رفته for رفته است would let the spoken line pass).
  - Left out (45 directions): 9 cards both ways (the written line rewords beyond register, or a fragment), 17 toward writing only (the written line picks one of several right forms; or a written هستم after a consonant, by a rule, as lesson 4.2 teaches the ending there), 10 toward speech only (the written phrasing is everyday speech too; or speech keeps or drops "in" before home; or, by a rule, the written line is good speech as it stands). By hand in `CONVERT_LEAVE_OUT` (`{ dir?, why }`); a card asked one way only has `only`. 305 cards are asked toward writing, 312 toward speech.
  - Store `alefbe2:convert` (`convertStore`), in `ALL_STORES` and `BACKUP_KEYS`, with a backup round-trip test. Misses go to the notebook as `{ kind: "convert", dir, ...card }` and replay there (`ConvertPrompt` / `ConvertSolution`). `reviewsDue` counts both directions (`convertDue`); the Today card links to `/practice/convert` when they lead. In `content/routes.ts`, the search index and the practice hub (`ConvertOverview`).
  - `npx tsx scripts/convert.ts < /dev/null` prints every card with its accepted answers and the directions left out.
  - The reviewer raised 15 findings (3 errors, 7 should-fix, 5 polish); all were applied by rule changes or leave-outs (one, merging the two حالِت چِطُوره cards, needed no change: their written lines differ, and the twin rule covers them). Three content points went to "Waiting on the owner".
  - Checked on the static build at 375 px in light and dark: no horizontal scroll, focus ring shown; a miss was scheduled and noted, and the notebook replayed it. Lighthouse accessibility is 100 on `/practice/convert` and `/practice`.
- **X3** (2026-10-01): one review queue at `/practice/review`.
  - `lib/review.ts` (pure, with tests) merges what is due now: the four letter and word decks (their open cards, `drillCandidates`), every verb tense (`verbCandidates`), the vocabulary, cloze and both spoken ↔ written decks (only cards still in the course, and a one-way card only in its direction), earliest due first; then the mistake notebook, most recent miss first. A notebook item whose deck card is already in the queue is left out, as that answer counts for it too (`mistakeDeckKey`). At most 50 items; when more cards are due than fit, 10 places stay for the notebook.
  - Each item is asked with its own deck's prompt and checker (`DrillPrompt`/`checkDrill`, `VerbPrompt`/`askFor`/`checkVerb`, `VocabPrompt`/`checkVocab` with its try-again for a same-English word, `ClozePrompt`/`checkCloze`, `ConvertPrompt`/`checkConvert`, and the notebook's `cardOf`). A deck answer is logged as activity, noted in the notebook and scheduled in its deck by the trainer's own recorder (`recordDrillAnswer`, `recordVerbAnswer`, `recordVocabAnswer`, `recordClozeAnswer`, `recordConvertAnswer`, now exported), so letter groups and verb groups still open with their banner. A notebook answer counts toward clearing it, as in the notebook. No store of its own.
  - The page gets the cards without their lesson lists (about 74 KB gzipped of HTML: it must carry every deck's cards, as what is due is known only in the browser). The lesson quizzes moved to `content/lesson-quizzes.ts`, shared with `/practice/mistakes`.
  - The Today card's review count links here, with "most in …" linking to the fullest deck (`reviewHref`). The practice hub opens with a "Review everything due" card (`ReviewCard`) counting due cards and notebook items. In `content/routes.ts` and the search index.
  - Checked on the static build at 375 px in light and dark: no horizontal scroll, the field is focused on each item, focus ring shown; answers in every kind of deck were scheduled there and misses noted; a notebook lesson question was asked and counted. Lighthouse accessibility is 100 on `/practice/review` and `/practice`.

## Feature ideas (owner asked, 2026-09-30)

Not part of Phase 6. Ranked by how easy each is. Everything in `docs/PROMPT-practice-extras.md` (cloze, spoken ↔ written, one review queue) is built (see "Practice extras status"), and so is the placement check (see "Phase 7 status").

1. **Reading without vowel marks** (medium, not quite ready). Show a dictionary word unmarked and ask for its reading, later short sentences. The data and `checkTranslit` exist. Harder than it looks: an unmarked word often reads several ways (کشتی, کرم, مرد/مُرد), and every reading must come from reviewed data, so the deck needs a pass that finds each unmarked spelling's readings across the dictionary and the conjugation tables and either accepts all of them or leaves the word out; sentences add ezafe and contraction ambiguity, as the cloze and convert work showed. Expect a reviewer round like X1's.
2. **Audio** (hard; blocked). The largest gap: stress (*ráftam* / *raftám*), *be-* / *bo-*, and every form under "Waiting on the owner" are things text cannot carry. It needs recordings by a Tehrani speaker, starting with dialogue lines and verb tables; browser speech synthesis is not good enough. It would unlock listening and dictation drills. Blocked until there is a speaker.

## Waiting on the owner

- Confirm the Dari callouts. Until then they ship with `checked: false`, which shows a draft tag:
  - lesson 0.3: majhul vowels ē/ō; شیر *shir*/*shēr*;
  - lesson 5.2: the prefix می is said *mē-* in Dari.
- Confirm these Tehrani forms:
  - spoken 1p/2p after â: *mikhâyim* / *miyâyin* (as taught), or *mikhâym* / *miyâyn*;
  - the spoken past stem of آوردن: *âvord-* or *âvard-* (it is in the verb data for later);
  - گذاشتن spoken *mizâram*, typed می‌ذارم;
  - *khaste-am* / *khune-am* (as taught) vs the contracted *khastam* / *khunam*;
  - *miyây* vs *miyâi*;
  - نِگَهْ said *negah* or *nege*;
  - ایرانی‌اَن (as taught) vs chat ایرانین.
- Confirm these forms from Phase 6a (the reviewer could not verify them):
  - spoken گذاشتن after a prefix: نَذاشْتَم, می‌ذاشْتَم (as the engine gives them), or نَگُذاشْتَم, می‌گُذاشْتَم;
  - the spoken past continuous of آمدن: میومَدَم *miyumadam* (as given), or می‌اومَدَم;
  - the spoken present perfect spelled like the simple past (رَفْتَم … رَفْته), told apart by stress; whether the negative (نَرَفْتَم) differs in stress at all; and whether the spelling رفته‌م should be taught;
  - شناختن treated as a state, with no progressive;
  - the term مُسْتَمِر: *mostamer* (the dictionary form, as written) or *mostamar*.
- Confirm these from Unit 11 (7d):
  - کُجا رَفْته بودی؟ as the everyday question to someone just back (or کُجا بودی؟); the lesson glosses it *where did you go?*;
  - تِلِفُن رُو جَواب دادَن or گوشی رُو جَواب دادَن for answering a (mobile) phone in speech;
  - شایَد خونه رَفْته باشه (as given) or شایَد رَفْته باشه خونه, with the place after the verb;
  - نَیومَده بود said *nayumade* (as given) or *niyumade* (tied to the نَیومَد question).
- Confirm these from Unit 12 (8a):
  - آپارْتِمان kept with *ân* in speech (some say it with *un*);
  - اِمْتِحان / اِمْتِحون both heard in speech, as 12.2 says;
  - این‌طوری (*intori*) as an everyday spoken *like this* beside اینْجوری (the cards that ask اینْجوری toward speech are left out until then);
  - 9.6's آروم‌تَر حَرْف بِزَن glossed *more slowly*; it is as often *more quietly*;
  - the spoken past آوُرْدَم, now in 12.4's table (the *âvord-* / *âvard-* question).
- Confirm these from Unit 10 (7c):
  - دوسْتِت دارَم read *dustet dâram* (as given), or *duset dâram*, as most Tehranis say it;
  - spoken مادَرَم تِهْرانیه (*tehrâniye*, as given) or تِهْرونیه, beside the course's spoken تِهْرون;
  - ایرانی هَسْتین (as given) or ایرانی‌این in speech;
  - رِسْتوران read *resturân* (as the course has it since Unit 6) or *restorân* (spelled رِسْتُوران under STYLE's o-spelling rule).
- Confirm these from Phase 7b (the reviewer could not verify them):
  - spoken گذاشتن without a prefix in the new tenses: گُذاشْته بودَم, گُذاشْته باشَم, گُذاشْته می‌شه (as given), or ذاشْته…; the trainer accepts ذاشته as a variant, also in the passive;
  - the spoken negative of آوردن: نَیاوُرْده بودَم (*nayâvorde*, as given), *nayovorde* or *nayâvarde* (tied to the *âvord-* / *âvard-* question).
- Confirm these from Unit 9 (6e):
  - سالَمه (*sâlame*) for "I'm … years old" in speech; شیش for شِش, "usually";
  - تِهْرون as the spoken form (many Tehranis now say *tehrân*);
  - رو میز, تو کیف without the ezafe, "usually"; ساعَتِ هَشْت with the ezafe audible in speech;
  - کیلو read *kilu*; مَیدون *meydun*; پیرْهَن *pirhan*; هِدیه *hediye*;
  - مُهِم written without its tashdid (Arabic مهمّ), as the course writes other final geminates;
  - whether Saturday is now a second day off by law, and whether the rial has been redenominated (the lessons hedge both).
- Confirm these forms from Unit 8 (6d):
  - بیدار شَم (no بـ with a شدن compound), as taught;
  - بِشین / بِشینین read *beshin* (as taught) or *bishin*;
  - written می‌شَوَد …؟ for spoken می‌شه …؟ when asking permission;
  - سُوغاتی read *soghâti* (dictionaries also give *sowghât*);
  - تِهْرون in every spoken line.
- Confirm these forms from Phase 6c (the reviewer could not verify them):
  - the spoken prefix shown as *be-* (بِکُن, بِخُور, بِکُنَم), with *bo-* only in a note; or show بُکُن, بُخُور in the spoken column; and *begu* or *bogu*;
  - written بِشَو read *beshow* and بِدِهْ read *bedeh* (as given), or *besho*, *bede*;
  - بِرین (as shown) or بِرید as the spoken plural command;
  - بِشِناسَم, بِنِویسَم shown in full (*beshenâsam*, *benevisam*), not the elided *beshnâsam*, *benvisam*;
  - whether بِشِناس and بِفَهْم should be drilled at all.
- Confirm these forms from Unit 7 (6b):
  - نَیومَد said *nayumad* (as taught) or *niyumad*;
  - صُبْحونه in speech for صُبْحانه;
  - وَقْتی بَچّه بودَم / بَچّه که بودین for "as a child" (bare بَچِّگی was dropped as unnatural);
  - چی دُرُسْت کَرْدی؟ for "what have you made?";
  - بابابُزُرْگ beside مادَرْبُزُرْگ in speech; هیچ‌کَس (not هیشْکی) in a spoken line;
  - آخَرِ هَفْته read *âkhar-e hafte*; مُوبایْل *mobâyl*; تِلِفُن *telefon*.
- Confirm these from the cloze review (X1):
  - lesson 0.2 `{او} ایرانیه.`: a spoken line with او, where the course says اون elsewhere in speech (6.7, 9.3);
  - lesson 9.5 `قابِلی نَداره. {پانْصَد هِزار} تُومَن.`: the spoken line keeps پانْصَد; Tehrani speech says پونْصَد (*punsad*), like تِهْرون and تُومَن.
- Confirm these from the spoken ↔ written review (X2):
  - lesson 1.3 (`alphabet.ts`, the حالِت چِطُوره؟ line): its written line ends تُو چِطُوری؟, the spoken form; lesson 0.3 writes the same line حالِ تُو چِطُور اَسْت؟;
  - seven written lines use هَسْتَم … after a consonant (حاضِر هَسْتی, شیراز هَسْتَم, تِهْران هَسْتَم, مُعَلِّم هَسْتَم, راه هَسْتَم, نَفَر هَسْتید, بِسیار خوب هَسْتَنْد), against lesson 4.2's rule (the full verb after a vowel) and its own خوشحالَنْد: soften the rule's wording, or change the lines (the drill leaves these out toward writing until then);
  - lesson 0.3 writes واسه عَروسی without the ezafe mark, where lesson 9.1 writes واسهٔ.
- Check the month names in `content/calendar.ts`.
- 21st.dev components need the owner's registry API key, set as an environment variable. Until then, components are hand-built.
- Review new.alefbe.study and merge `nextgen` into `main` when happy.

## Working habits that matter here

- **Checks:** `npx vitest run`, `npm run typecheck`, `npm run lint`, `npm run build`.
- **Dev server:** `alefbe-dev` in `.claude/launch.json`, on port 3000. `alefbe-static` serves the built `out/` on port 3001; use it for audits and Lighthouse.
- **Build EPERM:** if `npm run build` fails with EPERM on `.next`, stop the dev server and delete `.next`; it is only a cache (OneDrive locks).
- **Verb tables:** `npx tsx scripts/verbs.ts < /dev/null` prints every conjugation for proofreading; name tenses to print only those (`… verbs.ts past perfect`).
- **Scratch scripts with Persian or quotes:** write them with the Write tool and run them with `node`; a shell heredoc breaks on the quotes.
- **Fonts:** preload only what the first paint needs (`subsets` in `app/layout.tsx` means "preloaded"). Decorative faces take `preload: false`.
- **Editing Persian text:** use the Edit tool, or a small Node script in the scratchpad.
  - Shell heredocs break on quotes.
  - `\uXXXX` escapes typed in tool input turn into real characters, so use constants such as `TATWEEL` and `ZWNJ`, or `String.fromCharCode`.
- **Lesson-quiz questions:** `npx tsx scripts/quizzes.ts [unit…] < /dev/null` prints every question with its lesson key and index (for `content/placement.ts`).
- **Checking the engine's reading of words:** `npx tsx scripts/check-words.ts <words> < /dev/null`.
- **Content tests:** `tests/content.test.ts` checks every string for readability, transliteration errors, links and valid blocks.
- **New pages:** add them to `content/routes.ts`.
- **Stores** are versioned localStorage envelopes (`lib/storage.ts`). A new store needs three things:
  - its definition in `lib/stores.ts`;
  - an entry in `ALL_STORES`;
  - its key in `BACKUP_KEYS` in `lib/backup.ts`.
