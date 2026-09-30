@AGENTS.md

# Alefbe: where the work stands

Updated 2026-09-30. Read this first when picking the work back up.

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

Next: **Phase 6**, Units 7–9 and the vocabulary deck (see `docs/PLAN.md`), once the owner has reviewed Phase 5. The past tenses join `Tense` in `lib/conjugate.ts`; the spoken past stems are already in `content/verbs.ts` for five verbs.

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
- Check the month names in `content/calendar.ts`.
- 21st.dev components need the owner's registry API key, set as an environment variable. Until then, components are hand-built.
- Review new.alefbe.study and merge `nextgen` into `main` when happy.

## Working habits that matter here

- **Checks:** `npx vitest run`, `npm run typecheck`, `npm run lint`, `npm run build`.
- **Dev server:** `alefbe-dev` in `.claude/launch.json`, on port 3000. `alefbe-static` serves the built `out/` on port 3001; use it for audits and Lighthouse.
- **Build EPERM:** if `npm run build` fails with EPERM on `.next`, stop the dev server and delete `.next`; it is only a cache (OneDrive locks).
- **Verb tables:** `npx tsx scripts/verbs.ts < /dev/null` prints every conjugation for proofreading.
- **Fonts:** preload only what the first paint needs (`subsets` in `app/layout.tsx` means "preloaded"). Decorative faces take `preload: false`.
- **Editing Persian text:** use the Edit tool, or a small Node script in the scratchpad.
  - Shell heredocs break on quotes.
  - `\uXXXX` escapes typed in tool input turn into real characters, so use constants such as `TATWEEL` and `ZWNJ`, or `String.fromCharCode`.
- **Checking the engine's reading of words:** `npx tsx scripts/check-words.ts <words> < /dev/null`.
- **Content tests:** `tests/content.test.ts` checks every string for readability, transliteration errors, links and valid blocks.
- **New pages:** add them to `content/routes.ts`.
- **Stores** are versioned localStorage envelopes (`lib/storage.ts`). A new store needs three things:
  - its definition in `lib/stores.ts`;
  - an entry in `ALL_STORES`;
  - its key in `BACKUP_KEYS` in `lib/backup.ts`.
