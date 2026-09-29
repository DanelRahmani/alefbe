# Features from Alefbe worth bringing to Nihongo Path

Written 2026-09-29, after comparing the two codebases. Nihongo Path currently has:
- the lesson path with filters, a continue card and seals;
- the reading modes (kana / furigana / kanji) with a romaji switch;
- the SRS kana drill;
- the kana chart;
- content-integrity tests.

The list below is what Alefbe has on top of that, with notes on how each translates to Japanese. Effort: **S** = hours, **M** = a day or so, **L** = several days.

## High value

1. **Lesson quizzes (M).** A `quiz` block with 3–5 typed questions and an explanation after each answer, plus near-miss hints.
   - Japanese: accept kana or kanji answers.
   - Convert typed romaji to kana with `wanakana` so learners without an IME can answer.
   - Hint on long-vowel and small-っ slips (おばさん vs おばあさん, きて vs きって).
2. **Kana stroke tracing (L).**
   - The tracer's guided, outline and freehand levels, "Show me", coverage × accuracy scoring and stars all carry over.
   - Japanese is easier than Persian here: KanjiVG (CC BY-SA 3.0) gives every kana's strokes as ordered SVG paths, so no glyph-derived paths are needed.
   - Add tracing sessions with a summary.
3. **Quick kana quiz (M).**
   - Question types: kana → romaji, romaji → kana, and "which kana?" for dakuten and handakuten, plus flashcards.
   - Wrong options come from look-alike families: シ ツ, ソ ン, ぬ め, わ れ ね, る ろ, さ ち, は ほ, ク ケ タ, ア マ, and ー 一.
   - Keys 1–4 pick an option, and "retry the missed" repeats the ones you got wrong.
   - Never touches the SRS.
4. **Progress page (M):**
   - streak by local date;
   - an 8-week activity calendar;
   - a kana mastery grid coloured by SRS box;
   - quiz accuracy;
   - **backup download and import**;
   - "Reset statistics" kept separate from "Clear everything".

   Nihongo Path has no export yet, so progress is lost with the browser.
5. **Mobile bottom tab bar and a manual theme switch (S).** Nihongo Path follows the system theme only. Alefbe's Display popover adds System / Light / Dark, with a pre-paint script so the page never flashes the wrong theme.
6. **Dictionary page (M).**
   - Every lesson's vocabulary, searchable in kana, kanji, romaji or English, where romaji search ignores macrons (*toukyou* finds *tōkyō*).
   - Filters by topic and by unit, and every entry links to its lesson.
   - Needs a `vocab` list on each lesson.

## Learning tools

7. **Per-kana pages (S–M):** stroke count and order, look-alikes, words using the kana, and your SRS and tracing status.
8. **Games (M):**
   - **Word builder:** tap kana tiles to spell a word.
   - **Sound it out:** see kana, tap romaji syllable tiles.
   - **Flash:** a kana flashes, then name it.
   - **Kana by kana:** name each kana of a word in turn.
   - Best scores are saved.
9. **Word inspector (M, planned in Alefbe 4e):** tap any word to see its reading, meaning and a kanji breakdown with links. This matters most in kanji mode.
10. **Mistake notebook (M, Alefbe 4e):** wrong answers from the drill, quiz and lesson quizzes are collected automatically for a "review my mistakes" session.
11. **Starred words with Anki CSV export (S, Alefbe 4e).**
12. **Today card (S, Alefbe 4e):**
    - due reviews, a daily goal ring and the streak;
    - a word of the day;
    - today's date in the Japanese era calendar, via `Intl.DateTimeFormat("ja-JP-u-ca-japanese")`: 令和8年9月29日.
13. **Typing practice (M, Alefbe 4e):** type words with the IME, including ー, small っ/ゃ, and を/は/へ as particles.
14. **Printable practice sheets (S–M):** 原稿用紙 grids with faint guide kana to trace on paper.

## Quality of life

15. **Search everything (M):** press `/` or Ctrl+K to find lessons, kana, words and grammar points.
16. **Keyboard shortcuts (S):** ← and → for the previous and next lesson, and `?` for a help sheet.
17. **Text size and typeface (S):**
    - S, M or L text.
    - A **Mincho or Gothic** choice, since learners must read both, as Alefbe's Naskh vs modern sans.
    - Both applied before the page first draws.
18. **Per-example romaji peek (S):** reveal the romaji of one sentence while the global switch stays off.
19. **Copy button on examples (S).**
20. **Installable app and offline use (S):** `app/manifest.ts` with shortcuts, plus a small service worker with network-first pages and cache-first hashed assets. Nihongo Path has neither.
21. **More content tests (S):**
    - a test that the list of pages matches the `app/` folder;
    - link checks covering every page, not only lessons;
    - a check that every lesson's letter or kana cards refer to real characters.
22. **Sticky header with a blurred background (S).** Watch out: a `backdrop-filter` makes the header the containing block for fixed children, so the tab bar has to sit outside it (this bit Alefbe).
23. **Accounts and sync (L):** the same Firebase plan as [ACCOUNTS.md](ACCOUNTS.md), possibly sharing one project so one Google sign-in covers both apps.

## Suggested order

**5, 4, 1, 3, 20** first: small or medium, and each fixes a real gap (theme, lost progress, no checking of understanding, no offline use). Then **2** (tracing, the biggest single feature), **6** and **8**, then the rest as the lessons grow.
