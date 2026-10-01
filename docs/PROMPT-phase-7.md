# Prompt: Phase 7 (placement check, Units 10–11)

Paste everything below the line into a new session. It builds the placement check from "Feature ideas" in CLAUDE.md, then Phase 7 of `docs/PLAN.md`: the engine forms Unit 11 needs, Unit 10 "Longer sentences" and Unit 11 "More verb forms".

Run it only once Phase 6 and the practice extras are merged (PR #8, 2026-10-01) and `nextgen` matches `main`.

---

Continue building Alefbe (Next.js static export, Iranian Persian course) on the `nextgen` branch: Phase 7.

1. Get oriented:
   - Read "Alefbe: where the work stands" in CLAUDE.md: Phase 5 and 6 status, "Practice extras status", "Feature ideas", "Waiting on the owner" and "Working habits".
   - Confirm the tree is clean and `nextgen` contains `main` (`git log main..nextgen` may show commits; `git log nextgen..main` must be empty). If not, stop and tell me.
   - Run `npx vitest run`; every test should pass. Start the dev server `alefbe-dev` from .claude/launch.json.
   - Read, as models: `content/STYLE.md`; `content/lessons/where-when.ts` (the newest unit) and `content/lessons/past.ts`; `lib/conjugate.ts`, `content/verbs.ts` and `tests/conjugate-unit8.test.ts` (how a tense joins the engine); `content/lesson-quizzes.ts`, `lib/mistakes.ts`, `lib/progress.ts` (or wherever lessons are marked done), `lib/stores.ts` and `lib/backup.ts`.

2. Build in this order, one sub-phase at a time. Plan each one briefly before coding. Pure logic goes in `lib/` with Vitest tests. Match the Orosi tokens and the existing components.

   - **7a. Placement check, at `/start`** (or another path if a better one fits; tell me).
     - The hard rule from the practice extras applies: no new Persian. Every question is an existing lesson-quiz question from `LESSON_QUIZZES`, unchanged.
     - `lib/placement.ts` (pure, with tests): pick 12–15 questions, two or so per unit band (script 1–3, core sentence 4, verbs 5, nouns 6, past 7, want/can/must 8, where/when 9). Prefer questions that test the unit's main point, not a detail; choose them by hand in a list in `content/placement.ts` (by lesson key and question index, with a test that each still exists), not at random, so the check is the same for everyone.
     - Adaptive is fine but not required. Decide and tell me how a result becomes a suggestion (my default: the first band with two misses is where to start; with no misses, Unit 10).
     - The result page says where to start and why ("you missed both past-tense questions"), links to that lesson, and offers to mark the earlier lessons done. That button needs a confirmation step, because marking a lesson done opens its cards in the vocabulary, cloze and spoken ↔ written decks. Decide and tell me whether it should also open the matching verb tenses.
     - Misses do not go to the mistake notebook, and nothing is scheduled: it is a check, not practice. Store only the last result (`alefbe2:placement`, in `ALL_STORES` and `BACKUP_KEYS`, with a backup round-trip test), so the home page can stop offering it.
     - Link it from lesson 0.3 (the fast-track lesson; English prose only, no Persian change), from the home page for a learner who has marked nothing done, from the search index and from `content/routes.ts`.
     - Units 10–11 are built later in this phase: make adding their questions a one-line change to `content/placement.ts`, and add them at the end of 7d.

   - **7b. The engine: past perfect, past subjunctive and the passive.**
     - `Tense` gains `past-perfect` (رَفْته بودَم; spoken رَفْته بودَم too: check what speech does), `past-subjunctive` (رَفْته باشَم) and, if it fits the engine, the passive with شدن (دیده شُد, دیده می‌شَوَد). Add each to `TENSES` with its title, Persian term, lesson (11.1, 11.2, 11.4) and `says`.
     - Golden tables by hand for every verb in every new form, spoken and written, in a new test file, the way `tests/conjugate-unit8.test.ts` does it. Mark with `lacks` the verbs that have no such form, with the reason (an intransitive verb has no passive).
     - The trainer picks the new tenses up through `TENSES`; check the gate links and the tables on `/verbs`.
     - A fresh reviewer agent gets `npx tsx scripts/verbs.ts past-perfect past-subjunctive passive < /dev/null`, `lib/conjugate.ts` and STYLE.md. Apply every finding; what it cannot verify goes under "Waiting on the owner".

   - **7c. Unit 10, "Longer sentences", lessons 10.1–10.6**, in `content/lessons/<slug>.ts`: ـی + که for "the book that…"; که clauses; اگه with real conditions; the linking words وقتی، چون، ولی، پس; object endings (دیدَمِش، بِهِش); word-building (ـی، ـگاه، ـچی، ـسْتان).
     - The template, the full vowel marking and the spoken-first-then-written rule of the earlier units. Every lesson has a `source`.
     - Object endings are the first contracted pronoun endings in the course: check how the text engine reads them before writing (`npx tsx scripts/check-words.ts`), add overrides where it misreads, and make sure the half-space and content tests know them.
     - Link the grammar overview's matching topics to the new lessons.
     - A fresh reviewer agent gets the unit file, `npm run dump <unit>` and STYLE.md. Apply every finding before shipping.

   - **7d. Unit 11, "More verb forms", lessons 11.1–11.5**: past perfect; past subjunctive; unreal conditions (اگه می‌دونِسْتَم…); the passive with شدن; کردن/شدن pairs and causatives.
     - Tables come from the engine through `table()`, like Units 5, 7 and 8. Their slugs must be the ones the 7b tenses open with; the content test checks that.
     - Reviewed the same way as 7c.
     - Then add Units 10–11 questions to the placement check.

3. For each new unit, as in Phase 6:
   - its vocabulary joins the dictionary and the vocabulary deck; its highlighted lines join the cloze deck and, where spoken and written differ, the spoken ↔ written deck. Re-run `scripts/cloze.ts` and `scripts/convert.ts`, and give a reviewer agent the new cards (the X1/X2 checklist in CLAUDE.md). Fix by rule changes or leave-outs, never by rewording Persian that has already been reviewed.
   - If you find a mistake in earlier lesson content, list it for me; fix it only if it is plainly wrong (an unmarked word, a broken half-space), and say so.

4. Rules (the same as Phase 6):
   - Before calling a sub-phase done: tests, `npm run typecheck`, `npm run lint` and `npm run build` pass; check it at 375 px in light and dark (no console errors beyond the known local-only ones, no horizontal scroll, visible keyboard focus); Lighthouse accessibility stays at 100 on the pages you add or change, measured on `alefbe-static`.
   - Preload only first-paint fonts. No new dependencies.
   - Commit and push to `nextgen` once per finished sub-phase, and keep CLAUDE.md's progress section up to date in each commit. Move the placement check out of "Feature ideas" when it is done.
   - Never merge into `main` and don't open a PR unless I ask. Don't touch Vercel protection settings.

5. When the four are done, report to me:
   - what changed, per sub-phase;
   - which quiz questions the placement check uses, and the decisions you made for it;
   - the reviewer findings per sub-phase and how many were fixed;
   - the new card counts in the vocabulary, cloze and spoken ↔ written decks, and what was left out;
   - the forms and readings you could not verify (they go under "Waiting on the owner");
   - any mistakes you noticed in earlier lesson content.
