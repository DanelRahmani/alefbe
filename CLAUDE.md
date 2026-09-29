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

Next, 4e part 2, in this order:

1. **Today card** on the home page:
   - reviews due across every trainer deck, and mistakes waiting;
   - a daily goal ring (5, 10 or 20 activities, saved);
   - the streak;
   - a word of the day, picked by date;
   - today's date in the Persian calendar (`Intl` with `fa-IR-u-ca-persian`).
2. **Word inspector.** Tapping a Persian word in a lesson or the dictionary opens a popover with:
   - its transliteration;
   - its meaning, if it is in the dictionary;
   - a letter-by-letter breakdown (`formsInWord`), linking to the letter pages.

   Find the tapped word with `caretPositionFromPoint`, and take the marked form from the `vm-all` variant.
3. **Display settings:** text size S/M/L and Persian typeface (Vazirmatn or Naskh), applied before first paint via `lib/prepaint.ts`.
4. **"Type it" game:** copy-typing, including the half-space.
5. **Printing:** printable tracing sheets at `/practice/sheets`, and print CSS for lessons and `/grammar`.

Then **4f**:

1. Check every route at 375 px in light and dark: keyboard focus, reduced motion, the console, Lighthouse.
2. Push `nextgen` and report to the owner for review.

Phase 5 follows: Units 5–6 and the conjugation trainer (see `docs/PLAN.md`).

## Waiting on the owner

- Confirm the Dari callout in lesson 0.3 (majhul vowels ē/ō; شیر *shir*/*shēr*). Until then it ships with `checked: false`, which shows a draft tag.
- 21st.dev components need the owner's registry API key, set as an environment variable. Until then, components are hand-built.
- Review new.alefbe.study and merge `nextgen` into `main` when happy.

## Working habits that matter here

- **Checks:** `npx vitest run`, `npm run typecheck`, `npm run lint`, `npm run build`.
- **Dev server:** `alefbe-dev` in `.claude/launch.json`, on port 3000.
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
