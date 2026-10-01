# Prompt: practice extras (the easy feature ideas)

Paste everything below the line into a new session, once Phase 6 is pushed. It builds the three easiest ideas from "Feature ideas" in CLAUDE.md. None of them needs new Persian content.

Do not run it while another session is still working on Phase 6: both touch `lib/stores.ts`, `lib/backup.ts`, the Today card and the practice hub.

---

Continue building Alefbe (Next.js static export, Iranian Persian course) on the `nextgen` branch: practice extras.

1. Get oriented:
   - Read "Alefbe: where the work stands" in CLAUDE.md: the Phase 6 status, "Feature ideas", "Waiting on the owner" and "Working habits".
   - Confirm the tree is clean and that Phase 6 is finished and pushed (6a–6f in CLAUDE.md). If 6f, the vocabulary deck, is not there, stop and tell me.
   - Run `npx vitest run`; every test should pass. Start the dev server `alefbe-dev` from .claude/launch.json.
   - Read, as models: `lib/verb-drill.ts` and `components/verbs/VerbTrainer.tsx` (a trainer with its own deck), the vocabulary deck from 6f (a deck whose cards join when a lesson is marked done), `lib/srs.ts`, `lib/answers.ts`, `lib/mistakes.ts`, `lib/today.ts`, `lib/stores.ts` and `lib/backup.ts`.

2. The one hard rule: no new Persian.
   - Every Persian string a learner sees in these features must come, unchanged, from lesson data that a reviewer has already checked (`content/lessons/*.ts`). Do not write, reword or "fix" any Persian. If a card needs a string that is not there, leave the card out.
   - If you find a mistake in lesson content while doing this, do not correct it silently: list it for me.

3. Build in this order, one sub-phase at a time:
   - X1. Cloze practice from lesson examples, at `/practice/cloze`.
     - `lib/cloze.ts` (pure, with tests) turns every core example, contrast-pair line and dialogue line that has a `{highlight}` into a card: the sentence with the highlighted words blanked, its English underneath, and the learner types the missing words.
     - Skip `wrong` examples. Skip a card whose blank would be the whole sentence.
     - A card's id must survive edits to the lesson around it: build it from the lesson key and the sentence itself, not from block positions.
     - A card joins the deck when its lesson is marked done, like the vocabulary deck.
     - Decide and tell me: which line is asked when an example has both a spoken and a written form (my default: the spoken line, with the written words accepted with a note); and how a sentence with several highlights is answered (my default: one answer box, the words in order).
     - Leitner scheduling from `lib/srs.ts`; answers checked by `lib/answers.ts`; after an answer, show the full sentence in both forms.
   - X2. Spoken ↔ written conversion drill, at `/practice/convert`.
     - `lib/convert.ts` (pure, with tests) makes a card from every example and dialogue line whose `written` differs from its `fa`. Show one form, type the other. Spoken → written is the default direction; the learner can switch.
     - Checking a whole sentence: ignore vowel marks and punctuation; treat a missing or extra half-space as a near miss with the existing hint; on a wrong answer, name the first word that differs ("you typed می‌رم; the written form is می‌روم").
     - Decide and tell me: which spelling variants are accepted (the trainer already accepts some, such as ـید for the spoken ـین and the one-ی spellings).
     - Cards join when their lesson is marked done.
   - X3. One review queue, at `/practice/review`.
     - `lib/review.ts` (pure, with tests) merges what is due now across every deck: the four letter and word decks, the verb decks, the vocabulary deck, the two new decks, and the mistake notebook.
     - The page asks them one after another, each with its own existing prompt and checker, and schedules each answer in its own deck. It adds no store of its own.
     - The Today card's review count links here, and the practice hub gets a card for it.
     - Build it last, so it includes X1 and X2.
   Plan each sub-phase briefly before coding. Pure logic goes in `lib/` with Vitest tests. Match the Orosi tokens and the existing trainer components.

4. For each new deck (X1, X2):
   - a store in `lib/stores.ts`, in `ALL_STORES`, and its key in `BACKUP_KEYS`, with a backup round-trip test;
   - misses go to the mistake notebook and can be replayed there;
   - its due cards count on the Today card;
   - the page is in `content/routes.ts`, the search index and the practice hub;
   - an empty state for a learner who has marked no lesson done, with a "practise anyway" mode that schedules nothing.

5. Review, since there is no new content to proofread:
   - After X1 and again after X2, write a script that prints every generated card, and give a fresh reviewer agent that output, the lesson files and content/STYLE.md.
   - It checks that each card makes sense as a question: the blank can be filled from the English alone; the accepted answers are right and complete; no card gives its own answer away; no pair of cards looks identical but wants different answers.
   - Apply every finding by changing the card rules or leaving cards out, never by changing the Persian. Report the count.

6. Rules (the same as Phase 6):
   - Before calling a sub-phase done: tests, `npm run typecheck`, `npm run lint` and `npm run build` pass; check it at 375 px in light and dark (no console errors beyond the known local-only ones, no horizontal scroll, visible keyboard focus); Lighthouse accessibility stays at 100 on the pages you add, measured on `alefbe-static`.
   - Preload only first-paint fonts. No new dependencies.
   - Commit and push to `nextgen` once per finished sub-phase, and keep CLAUDE.md's progress section up to date in each commit. Move each finished idea out of "Feature ideas".
   - Never merge into `main` and don't open a PR unless I ask. Don't touch Vercel protection settings.

7. When the three are done, report to me:
   - what changed, per sub-phase;
   - how many cards each deck has, and how many were left out and why;
   - the reviewer findings and how many were fixed;
   - the decisions you made for me;
   - any mistakes you noticed in lesson content;
   - whether idea 4 (reading without vowel marks) looks as easy as CLAUDE.md says, now that you have built these.
