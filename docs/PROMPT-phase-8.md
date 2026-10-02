# Prompt: Phase 8 (Units 12–14)

Paste everything below the line into a new session. It builds Phase 8 of `docs/PLAN.md`, the last content units: Unit 12 "Spoken and written", Unit 13 "Culture in conversation" and Unit 14 "Reading real texts", with a reading view made for Unit 14.

Run it only once Phase 7 is merged (PR #10, 2026-10-02). Audio and the "Waiting on the owner" questions are for later: don't start on them, but keep adding to that list.

---

Continue building Alefbe (Next.js static export, Iranian Persian course) on the `nextgen` branch: Phase 8.

1. Get oriented:
   - Read "Alefbe: where the work stands" in CLAUDE.md: Phase 6 and 7 status, "Practice extras status", "Feature ideas", "Waiting on the owner" and "Working habits".
   - `nextgen` is one merge commit behind `main` after PR #10. Fast-forward it (`git merge --ff-only origin/main`) and push. Then confirm the tree is clean and `git log nextgen..main` is empty. If either fails, stop and tell me.
   - Run `npx vitest run`; every test should pass. Start the dev server `alefbe-dev` from .claude/launch.json.
   - Read, as models: `content/STYLE.md`; `content/lessons/longer-sentences.ts` and `content/lessons/more-verbs.ts` (the newest units); `content/lessons/start-here.ts` (lesson 0.3 already introduces spoken and written); `content/types.ts` and `components/lesson/LessonRenderer.tsx` (the blocks); `components/WordInspector.tsx` and `lib/inspect.ts` (the tap-a-word popover); `lib/cloze.ts`, `lib/convert.ts` and their content files (how lines become cards, and the leave-out lists).
   - Run `npx tsx scripts/check-words.ts` on any word you are unsure of before writing it.

2. Build in this order, one sub-phase at a time. Plan each one briefly before coding. Pure logic goes in `lib/` with Vitest tests. Match the Orosi design (lapis and saffron, the glass panels, the girih band, the مُهر seal) and the existing components.

   - **8a. Unit 12, "Spoken and written", lessons 12.1–12.6** (slug `spoken-written`, in `content/lessons/spoken-written.ts`). Earlier units have taught these changes one at a time. This unit gathers them into rules a learner can apply to any sentence:
     - why the two registers exist, and where each is used (chat, signs, news, forms, songs);
     - sound changes: *ân/âm* → *un/um* (نان → نون, but not ایران), and the other regular ones the lessons already show;
     - *is* and the verb endings: اَسْت → ـه, ـَد → ـه, ـید → ـین, ـَنْد → ـَن;
     - the short spoken stems (ر, ش, گ, د, خوا, دون, تون, خون, آر, ذار) and the spoken past stems;
     - words that differ: واسهٔ / بَرایِ, رُو / را, آره / بَله, اینْجوری / این‌طور, and others already reviewed in earlier units;
     - how Iranians type chat: spoken spellings, Finglish (Persian in Latin letters), and the half-space in chat.
     Each lesson keeps the template (idea, examples, a contrast pair, a common mistake, a dialogue, a quiz) and has a `source`.
     - Reuse lines from earlier units where you can: that adds no new Persian to review, and the cloze and spoken ↔ written decks will join the existing card rather than make a twin. Say which lines you reused.
     - Where a rule has exceptions, say so (lesson 0.3 already hedges *ân* → *un*). Don't present a tendency as a rule.
     - The spoken ↔ written drill (`/practice/convert`) is this unit's natural practice: link it from each lesson's end, and give the practice hub's convert card a line naming Unit 12.

   - **8b. Unit 13, "Culture in conversation", lessons 13.1–13.6** (slug `culture`, in `content/lessons/culture.ts`): شُما and تُو; greetings and goodbyes through the day; taarof (offering, refusing and insisting, and how to tell a real offer); set phrases for thanks, apology, condolence, congratulations and food (نوشِ جان, دَسْتِت دَرْد نَکُنه, خَسْته نَباشی); polite verbs (بِفَرْمایید, تَشْریف آوَرْدَن, میل کَرْدَن); names, جان, آقا / خانُم and family titles; Nowruz, Yalda, سیزْده‌بِه‌دَر and the Iranian calendar (link the Today card's date and `content/calendar.ts`).
     - Culture is where claims go stale or become stereotypes. State only what holds broadly, hedge what varies by region, class or generation, and give no figure without a source. Explain each phrase's literal meaning and when it would be odd to use it.
     - Polite verbs replace everyday ones (میل کَرْدَن for خُورْدَن, تَشْریف آوَرْدَن for اومَدَن). If one of them needs to be in the conjugation engine for a table, add it to `content/verbs.ts` with golden tables by hand. Otherwise keep it out of the engine and say why.
     - A `dari` callout fits naturally in a few places (greetings and terms of address differ in Kabul). Ship each with `checked: false` and list it in the report.

   - **8c. A reading view, then Unit 14, "Reading real texts", lessons 14.1–14.6** (slug `reading`, in `content/lessons/reading.ts`): signs, a menu, chat messages, a news headline, a short story written for the course, and one line of Hafez (public domain; the only quotation the course plans: see STYLE.md).
     - **The reading block, first.** Add a `reading` block type to `content/types.ts` and render it in a component of its own, made for reading rather than for examples:
       - the text is shown the way Iranians print it: without vowel marks, whatever the display setting, with a control to show them for the whole text;
       - tapping a word opens the word inspector (reading, meaning, letters), which already works on marked spellings. Each word of the text carries its marked form, as in `FaText`'s `data-words`, so the inspector reads it exactly. Add the dictionary words the texts need, and list any it can't find;
       - one sentence at a time can be revealed with its transliteration and translation (a tap on the sentence, or a "show line" button), so a learner tests their reading before checking;
       - a sign, a menu or a chat message is drawn as that thing (a street sign, a menu card, chat bubbles), in Orosi colours, built in CSS and SVG with no images, and it reads well at 375 px in light and dark;
       - every control is reachable by keyboard and has an accessible name; the revealed text is announced; nothing moves under `prefers-reduced-motion`.
     - Every text is original, apart from the Hafez line, and every word in it is fully marked in the source (marks are only hidden when displayed), so the content tests and the reviewer see the reading. Vocabulary goes in each lesson's `vocab`.
     - The Hafez line: give a literal translation and a short note on why it is hard (ezafe chains, older word order). Name the edition you took it from in `source`.
     - A reading text also makes cloze cards if it has highlights. Decide whether reading texts should feed the cloze deck at all, and tell me. My default: no, as the texts are for reading.

3. For each new unit, as in Phases 6 and 7:
   - A fresh reviewer agent gets the unit file, `npm run dump <unit>` and STYLE.md. Apply every finding before shipping.
   - Its vocabulary joins the dictionary and the vocabulary deck. Its highlighted lines join the cloze deck and, where spoken and written differ, the spoken ↔ written deck. Re-run `scripts/cloze.ts` and `scripts/convert.ts`, diff them against the output before the unit, and give a second fresh reviewer the new cards, with the checklist used in Phase 7. Fix by rule changes or leave-outs, never by rewording Persian that has already been reviewed. A rule change must leave every earlier card unchanged, unless that card was wrong: show the diff.
   - Link the grammar overview's matching topics to the new lessons, where there are any. Add the new pages to `content/routes.ts` and the search index.
   - If you find a mistake in earlier lesson content, list it for me. Fix it only if it is plainly wrong (an unmarked word, a broken half-space), and say so.
   - The placement check covers grammar units. Decide whether Unit 12 should get a band (two questions, one line in `content/placement.ts`), and tell me. Units 13 and 14 get none.

4. Rules (the same as Phase 7):
   - Before calling a sub-phase done: tests, `npm run typecheck`, `npm run lint` and `npm run build` pass. Check it at 375 px in light and dark: no console errors beyond the known local-only ones, no horizontal scroll, visible keyboard focus. Lighthouse accessibility stays at 100 on the pages you add or change, measured on `alefbe-static`.
   - Preload only first-paint fonts. No new dependencies.
   - Commit and push to `nextgen` once per finished sub-phase, and keep CLAUDE.md's progress section up to date in each commit.
   - Never merge into `main`, and don't open a PR unless I ask. Don't touch Vercel protection settings.

5. When the three are done, report to me:
   - what changed, per sub-phase, with a screenshot of the reading view (a sign, the chat messages and the Hafez line, light and dark);
   - the decisions you made (reused lines; whether reading texts feed the cloze deck; a placement band for Unit 12; any verb added to the engine);
   - the reviewer findings per sub-phase and how many were fixed;
   - the new card counts in the vocabulary, cloze and spoken ↔ written decks, and what was left out;
   - the Dari callouts added (unchecked), and the forms and readings you could not verify (they go under "Waiting on the owner");
   - any mistakes you noticed in earlier lesson content.
