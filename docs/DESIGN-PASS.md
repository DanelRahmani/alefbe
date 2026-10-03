# Design pass (Phase 9a): findings and plan

Audited 2026-10-02 on the static build (`alefbe-static`, port 3001) and `alefbe-dev`, at 375 px and at desktop width, light and dark. Pages walked: home and path, lessons of each kind (script 1.2, grammar with tables 5.2, dialogue-heavy 4.2, reading 14.2, prose with Persian 10.5), `/script` and `/script/be`, the practice hub, the vocab, cloze, convert, review and drill trainers, `/verbs`, `/dictionary`, `/grammar`, `/progress`, `/placement`, search, display settings and the not-found page.

How: screenshots (`scripts/design-shots.cjs`, seeded with the same progress every time), an in-page script that counted the distinct font sizes, radii, button styles and blur layers on 27 pages, a font and network trace of the home page, and Lighthouse on the static build. The critique followed the impeccable skill's method (Nielsen heuristics, cognitive load, the product register), run in one context, not as its two separate sub-agents. Its automated detector was not run: the bundle is missing from the skill install. The app's own language decides throughout: the orosi, girih and khatam, the مُهر seal, lapis and saffron, restrained and readable.

## What works, and stays

- The identity is real and not generic: the orosi lattice, the khatam unit numbers, the seal on finished lessons, the Markazi titles, lapis by day and saffron by night. Nothing here reads as a template.
- Content leads. Lessons are one column of 46rem; examples are large; spoken and written sit together; the tools on each example are quiet.
- One feedback look already: every trainer uses `quiz-fb` (green for right, red for wrong), so learners meet one vocabulary.
- Search, display settings, the word inspector and the reading styles (sign, menu, chat, headline, story, verse) are well made in both themes.
- No horizontal scroll on any page audited; focus rings everywhere (4f's sweep still holds on the pages walked).

## Findings, ranked by how much fixing each improves a learner's day

### 1. The first open is slow (every visit starts here)

Lighthouse, mobile, simulated throttling, static build, idle machine, before any change (`scripts/lighthouse.sh`):

| Page | Performance | LCP | TBT | CLS | Accessibility | Best practices |
|---|---|---|---|---|---|---|
| `/` | 51 | 5.9 s | 1,030 ms | 0.001 | 100 | 96 |
| Lesson 4.2 | 56 | 5.5 s | 770 ms | 0.001 | 100 | 96 |
| `/practice` | 56 | 5.4 s | 880 ms | 0 | 100 | 96 |
| `/practice/review` | 47 | 6.1 s | 1,190 ms | 0.087 | 100 | 96 |

Performance has slipped since 4f (`/` 67 → 51, a lesson 78 → 56) as the course and its client data grew. Best practices is 96 only because of the local-only 404s.

The causes found so far:

- **Amiri is not lazy in practice.** The header's brand mark (`brand-mark khatam naskh`), the hero pane, the next-lesson mark, the unit titles' Persian and the seal's «تمام» all ask for Amiri, so every page fetches three Amiri files, about 228 KB, on top of the four preloaded files (about 159 KB).
- **Blur everywhere it shows least.** `backdrop-filter: blur(18px) saturate(1.6)` is on the sticky header and the fixed tab bar (repainted on every scroll frame), the next-lesson card, the Today card, the practice-links and skip-ahead panels, the hero pane, and the display-inline panel. Over the plain page background a blur changes nothing you can see; it only costs.
- **The hero window** is a masked element holding the orosi pattern (a second copy of the SVG pattern) with a blurred pane on top.
- **Large HTML:** `/practice/review` is 107 KB gzipped (it was 74 KB in X3, and has grown with every unit's cards); `/dictionary` 79 KB; `/practice/cloze` 44 KB; the home page 42 KB.
- **Main-thread time** is high (TBT about 1 s on every page): hydration of the path (92 lesson rows, each a client component tree with `Rich`/`FaText`), plus style and layout.

### 2. English lines inside Persian-bearing paragraphs are double-spaced (every lesson)

`.has-fa` sets `line-height: 2.1` on a whole paragraph as soon as it holds one Persian word, and `.idea-text.has-fa` sets 2. The lesson summary, the idea box, unit descriptions and lesson-row titles all get it, so mostly-English prose reads as if double-spaced (lesson 1.2's summary and 5.2's idea box are clear examples), and a two-line lesson title in the path takes the height of four. The Persian needs room for stacked marks, but only on the Persian run, not on every line.

### 3. Bidi in brackets: checked, no bug

The audit first reported that two Persian phrases in one bracket (lesson 10.5, «(به او, کَسی که با او حَرْف زَدَم)») came out in reverse order. Measured in 9b with text ranges, they don't: the first phrase sits left of the comma and the second to its right, as English order wants; the screenshot had been read right to left as a whole. Each Persian run is its own `<bdi>`, which is what keeps this right. 9e checks the remaining bracket cases across every lesson.

### 4. Feedback doesn't put the right answer first (every trainer, many times a day)

- A wrong answer shows "Not quite.", then "You typed: xyz" at body size, then the correct form at body size. The thing to learn is no bigger than the mistake.
- A near miss (a half-space, a missing ezafe mark, the other "you") looks the same as a plain miss: red, "Not quite."
- The same feedback markup is copied into about twelve components (`Drill`, `VerbTrainer`, `VocabTrainer`, `ClozeTrainer`, `ConvertTrainer`, `ReviewQueue`, `MistakeNotebook`, `LetterQuiz`, `Game`, `Tracer`, `PlacementCheck`, `Quiz`).

### 5. Too many sizes, radii and button styles (consistency)

- **Type:** about 49 distinct computed font sizes across 27 pages. Sizes come from two places: rem values in the CSS (0.6, 0.62, 0.65, 0.7, 0.72, 0.75, 0.78, 0.8, 0.85, 0.88, 0.9, 0.93, 0.95, 0.97, 1, 1.05…) and Tailwind utilities in the components (`text-sm` 91 times, `text-xl`, `text-lg`, `text-2xl`, `text-xs`).
- **Radii:** 3, 5, 6, 7, 10, 12, 14, 16, 18, 20 px and pills.
- **Buttons:** at least six looks for one job: `drill-btn` (glazed, radius 12), `quiz-check` (flat, radius 10), MarkDone's one-off Tailwind button (pill, 2 px border), `drill-btn-quiet` (outline), unclassed `chip`s used as buttons, `tracer-tabs` and `mode-tabs` (copies of `chip`), `goal-chip`, `settings-chip`.
- **Cards and panels:** `unit-card`, `stat`, `drill-mode` and `grammar-topic` pair a 1 px border with a 28 px soft shadow; `example`, `callout`, `drill-card`, `verb-details`, `quiz-summary`, `confirm-box`, `form-card`, `build` each restate surface + border + radius with small differences (14, 16, 20 px).

### 6. Dark mode: busy glass behind titles

The orosi sits at 62 % opacity at night. Behind a lesson's breadcrumb, number and title, the saturated panes compete with the text (lesson 4.2 at 375 px), though Lighthouse contrast passes. The hero's frosted pane over the coloured arch turns muddy (pink-blue). The header glass over the panes is fine.

### 7. The path reads as a list, not a journey (home, daily)

Fifteen identical white cards, each with its own border and shadow. The unit's progress is only "Unit 4 · 2/5" in small caps. Nothing connects one unit to the next, and the plan's "girih band on unit dividers" was never built.

### 8. Kickers above every section

A small uppercase tracked label sits above nearly every heading: "A COURSE IN IRANIAN PERSIAN", "PRACTICE" over "Practise letters…", "WORDS" over "Dictionary", "PROGRESS" over "Your progress", "THE SCRIPT", "TODAY", "WORD OF THE DAY", "THE PATH · 0/92", "UNIT 4 · 2/5", "THE IDEA", "CONTINUE · 4.2 · …". Where it repeats the tab the learner just pressed, it adds nothing; where it labels a thing (Today, Unit 4, Spoken/Written) it earns its place.

### 9. Smaller things

- **Verb trainer:** fifteen tense chips in one wall (cognitive load: more than four options at one decision point). Grouping them as Present / Past / Moods / Passive, with a small label per group, makes the one you want findable. Same buttons, same behaviour.
- **Progress page:** six identical big-number cards (the "hero metric" template). A compact two-column list reads faster and keeps the khatam style.
- **Horizontal chip rows** (path filters, `/script` filters) show a thin grey scrollbar at 375 px; an edge fade says "more" more quietly.
- **Dictionary:** the search placeholder is cut off at 375 px ("…or En"); the two selects have ragged widths.
- **Tables** with an empty first header cell (lesson 4.5 and others) fail Lighthouse's `td-has-header` (planned for 9e). Persian inside tables is at body size, smaller than anywhere else Persian appears.
- **Motion that exists:** the seal's stamp (its curve overshoots to 1.2, a small bounce), the flash game's drain bar, 150 ms colour transitions, and a 1 px lift on card hover. All are off under reduced motion through the global rule.
- **Dead CSS:** `settings-option`, `settings-preview`, `tracer-pick`.
- **Loading:** pages render their default state first and fill in from `localStorage` after hydration; the next-lesson card changes from "First lesson" to "Continue…" and can change height. Lighthouse sees CLS 0 because it has no saved progress; 9d checks a returning learner too.

## Plan

Each sub-phase is committed and pushed on its own, with before/after screenshots at 375 px and 1280 px, light and dark, for every visible change. Behaviour changes only where this plan says so; tests pass after each.

### 9b. One design system

1. **Tokens** in `globals.css`:
   - Latin type scale, a 1.2 ratio from a 1.0625rem body: `--text-xs` 0.8rem, `--text-sm` 0.9rem, `--text-base` 1.0625rem, `--text-lg` 1.25rem, `--text-xl` 1.5rem, `--text-2xl` 2rem, display `clamp(2.2rem, 7.5vw, 2.9rem)` (titles only).
   - Persian scale, relative to the Latin it sits beside: inline 1.12em (Vazirmatn) / 1.25em (Naskh), as now; standalone steps `--fa-sm` 1.25rem, `--fa-md` 1.65rem (examples), `--fa-lg` 2.1rem, `--fa-xl` 3rem (letters and prompts).
   - Line heights: `--lh-prose` 1.7 for English, `--lh-fa` 2 for a Persian line. Paragraphs keep the prose line height; an inline Persian run gets the room for its marks (padding-block on the run, checked against stacked marks in every display mode), so English lines stop doubling.
   - Spacing on a 4 px base (0.25rem steps), radii `--r-sm` 8 px, `--r-md` 12 px, `--r-lg` 16 px, `--r-pill`.
   - Elevation: none for panels on the page; `--shadow-float` only for what floats (popovers, dialogs, the sticky header, the tab bar).
   - Glass levels: `--glass-bar` (header and tab bar) and `--glass-float` (popovers); everything else is solid surface.
2. **Components** (in `components.css`, replacing the copies):
   - `.btn` (primary, the glazed tile), `.btn-quiet` (outline), `.btn-tool` (the small example tools), `.chip` (toggle and filter, used by the path, `/script`, verbs, the tracer, the Today goal, settings and mode tabs), `.pill-link` (a link with a count).
   - `.panel` (surface, border, `--r-lg`) and `.card-link` (a panel that is a link, with a hover border). Examples, callouts, the trainer card, verb tables, quiz summaries, the confirmation box, stat boxes and grammar topics move onto them.
   - One `Feedback` component (`components/practice/Feedback.tsx`) used by all twelve trainers: the verdict line, then the right form large (`--fa-md`), then "You typed" smaller and quieter, then the note or hint and the lesson link.
   - Tables: one `.table` style; Persian cells at `--fa-sm`.
   - Progress ring and bar: one ring (Today's) and one bar (session, form bars); the flash drain bar stays its own.
   - The confirmation box (`confirm-box`) used by progress import, placement marking and reset.
3. **Clean-up:** replace the Tailwind type and spacing utilities in components with the tokens' classes where they set sizes (`text-sm` → `.text-sm` mapped to the token, so the scale has one source); delete the copies and the dead classes. Target: the CSS bundle smaller than 79 KB (16.2 KB gzipped) despite the new components.
4. ~~Bidi fix~~: not needed (finding 3).
5. **Dark mode:** the orosi's mask starts fading sooner behind the page head at night, and the hero pane becomes a solid tinted plate (also helps 9d).
6. **Kickers:** keep them where they label a thing (Today, Word of the day, Unit n, Spoken/Written, the next-lesson card); drop the ones that repeat the section name on `/practice`, `/dictionary`, `/progress`, `/script` and the not-found page. *Visible change, no behaviour change.*
7. **Verb trainer:** the tense chips in four labelled groups. *Visible change, same behaviour.*
8. **Progress page:** the six stats as a compact two-column list. *Visible change, same numbers.*

### 9c. Moments of craft (CSS and SVG only, each off under reduced motion)

Chosen, because each marks a real state change:

- **The seal** stamps without the overshoot: it settles (ease-out, no scale past 1). Checked on lesson finish.
- **A girih divider per unit** that fills as its lessons are finished: an eight-point-star band in the unit card's head, one star per lesson, filled in lapis (saffron at night) as each is finished. It replaces nothing; the "2/5" count stays for screen readers. It is also the plan's unbuilt "girih band on unit dividers".
- **The path as a journey:** a thin lattice thread joining each unit's khatam number to the next, filled up to the current unit. Static (no motion), CSS only.
- **The goal ring's glow** when the daily goal is met: one soft saffron halo, once, then still.
- **A right answer that settles:** the feedback block fades and rises 4 px over 200 ms; a wrong one appears without motion (no shake).

Skipped: the stained-glass hero catching light on hover. It is hover-only on something that is not a control, it would put more paint work on the page 9d is trying to speed up, and on a phone it never shows.

### 9d. Performance

Measure again after 9b and 9c (they change the CSS and the glass), for an empty and a returning learner, and trace where the main-thread time goes. Then:

- Brand mark, next-lesson mark and unit titles' Persian in Vazirmatn or Markazi instead of Amiri; Amiri only where Naskh is the point (letter cards, tracing, the Naskh setting, the seal if it doesn't cost the first paint). Target: no Amiri request on `/` or a grammar lesson with default settings.
- Blur only on the header and tab bar (smaller radius), solid tint everywhere else; the hero pane solid.
- The hero's pattern drawn once, reused, and not masked twice; check whether it is the LCP element.
- `/practice/review`: ship each deck's cards as a static JSON file fetched after first paint (the queue is built in the browser anyway), so the HTML holds only the page. The same for `/dictionary` if it helps. Same behaviour.
- The path: render the unit list on the server and hydrate only what reads progress (the seal per row), to cut TBT.
- Targets, mobile on `alefbe-static`: performance 90+ on `/`, a lesson and `/practice`; LCP under 2.5 s; CLS under 0.1.

### 9e. Accessibility and the 375 px sweep

A rerunnable script under `scripts/` that walks every route in `content/routes.ts` (153 pages in the build) in the in-app browser at 375 px, light and dark, reduced motion on: horizontal scroll, a focus ring on each Tab stop, console errors beyond the known local 404s, and running animations. Fix the empty first header cells (a real header, or `<td>`), check the bidi fix in every lesson, Lighthouse accessibility 100 on every page audited.

## Carried out

### 9b (2026-10-03)

- **Tokens** (`globals.css`): a Latin scale (`--fs-2xs` … `--fs-2xl`, `--fs-display`), a Persian scale (`--fa-sm` … `--fa-2xl`), line heights (`--lh-prose` 1.65, `--lh-mixed` 1.8, `--lh-fa` 2), radii (`--r-sm/md/lg/pill`). Tailwind's `text-*` utilities read the same scale. 158 literal font sizes became tokens (11 tuned ones kept, e.g. the brand mark, keyboard keys, the mark signs); 58 radii became four. Each colour is written once as `light-dark(day, night)`, so the dark theme is no longer copied out twice.
- **Mixed lines:** a paragraph with Persian is 1.8, not 2.1; its Persian runs carry their own line height (1.5, 1.35 in Naskh) so the marks clear and English lines don't double.
- **Components** (`components.css`, top): `.btn` / `.btn-quiet` / `.btn-danger` (was `drill-btn`, `quiz-check`, `danger-btn`, `file-btn` and MarkDone's one-off), `.chip` and `.chip-row` (was `chip`, `goal-chip`, `settings-chip`, `tracer-tabs`, `mode-tabs`, `chips-wrap`), `.panel` / `.panel-dashed` / `.panel-accent` and `.card-link` (trainer cards, examples, callouts, stats, the confirmation box, practice cards, grammar topics, unit cards, the sheet, the inspector…), one table style with Persian a step larger, one rule for quiet links.
- **Feedback** (`components/practice/Feedback.tsx`, `lib/feedback.ts`): the verdict, the right form at example size, the hint, then "You typed" small. Used by every typed-answer trainer, the lesson quiz, the notebook and placement; the games, tracer and status messages use its classes. A near miss (`near` on the verdict: a half-space, a madde, a same-sound letter, a Persian digit, copy-typing spacing) shows "Nearly." in saffron; it still counts as a miss.
- **Glass:** only the header and tab bar (blur 14px); the next-lesson card, Today card, practice links, skip-ahead and display panels are solid; the hero pane is a solid tinted plate.
- **Dark:** the orosi fades sooner at night (opacity 0.55, gone by 18rem).
- **Kickers** dropped on `/practice`, `/dictionary`, `/progress`, `/script`, `/grammar`, the not-found and offline pages.
- **Verbs:** tense chips in four labelled rows (`lib/tense-groups.ts`), in the trainer and the tables.
- **Progress:** the stats as one panel with a two-column list (three on desktop), also on the letter pages and the tracing session.
- **Brand mark** in Vazirmatn. **Dictionary:** shorter placeholder, equal-width filters.
- **Found on the way:** Tailwind size classes on Persian runs (`fa text-xl`) never applied (the unlayered `.fa` rule wins); the tracer read colour tokens as hex, now resolved through the browser (`lib/color.ts`).
- **CSS:** 79,064 → 79,063 bytes (16,339 → 16,147 gzipped). Lightning CSS transpiles `light-dark()` for older browsers, which costs back most of the colour dedupe.

### 9c (2026-10-03)

All CSS and markup, no new dependencies; each ends in its final state at once under reduced motion (the global rule in `globals.css`).

- **The seal** comes down and settles (320 ms, ease-out-quart, scale 1.35 → 1); the old curve dipped to 0.94 and bounced back.
- **A girih band per unit:** in the unit's kicker, one eight-point star per lesson on a hairline, lit in lapis (saffron at night) as each lesson is finished. It is decorative (`aria-hidden`); the "3/10" count still reads.
- **The path as a journey:** a 2 px thread joins each unit's khatam to the next one in the gap between the cards, lit once the unit is finished.
- **The goal ring** gains a soft saffron halo when the day's goal is met: it eases in once (900 ms) and stays still.
- **A right answer settles:** the feedback fades in and rises 4 px (220 ms); a wrong or near one appears without motion.
- Skipped, as planned: the hero catching light on hover.

### 9d (2026-10-03)

Lighthouse, mobile, simulated throttling, static build; the median of three runs (`scripts/lighthouse.sh`, `RUNS=3` by default):

| Page | 9a | 9d | LCP 9a → 9d | TBT 9d | CLS 9d | Accessibility |
|---|---|---|---|---|---|---|
| `/` | 51 | 83 | 5.9 → 4.0 s | 240 ms | 0 | 100 |
| Lesson 4.2 | 56 | 88 | 5.5 → 3.9 s | 120 ms | 0.001 | 100 |
| `/practice` | 56 | 91 | 5.4 → 3.5 s | 40 ms | 0 | 100 |
| `/practice/review` | 47 | 92 | 6.1 → 3.4 s | 60 ms | 0.017 | 100 |

What the measurements showed, and what was done:

- **Why LCP stays above 2.5 s here.** The smallest page, `/offline` (the header, a heading, a paragraph), scores 94 with LCP 3.1 s: that is the floor of this setup. Headless Chrome paints late (0.5–1.5 s even without scripts), and Lighthouse's simulation then counts every byte and script that arrived before that paint. Stripping all scripts from `/practice` gave LCP 2.1 s; so the remaining LCP is the framework (about 125 KB gzipped of React and Next on every page) and the fonts, not anything a page adds. A returning learner's layout shift was measured separately (Lighthouse has empty storage): 0.005 on the home page.
- **Amiri off every page.** The header's Display glyph and the brand mark asked for Amiri on every page (about 228 KB); now they use Vazirmatn. The home page's decorative Persian (the hero, the next-lesson mark, unit titles, the seal's «تمام») is set in Markazi, the display face drawn for Persian (40 KB for its Arabic, against Amiri's 200 KB). Amiri stays for letters, tracing and the Naskh setting, and loads only there.
- **Data out of the HTML.** Big lists the client needs are prerendered as static JSON under `/data/` (`app/data/*/route.ts`, `content/static-data.ts`) and fetched when the browser is idle after load (`lib/static-data.ts`): the review queue's cards, each trainer's cards, the lesson quizzes for the notebook, the practice hub's counts, the words for the word of the day, and what due counts need. HTML, gzipped: `/practice/review` 105 → 6 KB, `/practice/cloze` 43 → 6 KB, `/vocab` 25 → 6 KB, `/practice` 24 → 7 KB. The service worker keeps a copy, as for the search index; a trainer that can't load its cards says so.
- **Less JavaScript on every page.** `lib/stores.ts` imported its defaults from the trainers' modules and so brought the verb tables, the conjugation engine, the card logic and the stroke data into every page; the defaults now live in `lib/store-defaults.ts`. The due counts on the home page and the practice hub run on `lib/due.ts` with prebuilt data (`/data/due.json`, built by `lib/due-data.ts`), not on the trainers' code; tests check that both give the same answers. The old app's migration is fetched only when an old key exists; the search code when the palette first opens; the display controls when the panel is about to open. App JavaScript on the home page and the practice hub fell by about 10 KB gzipped each.
- **The path.** Each unit's lesson list is drawn only near the screen (`content-visibility: auto`, with a placeholder height per list that is never too small, so nothing below is overlapped while it waits); style and layout on the home page fell from about 940 to 600 ms. The path's titles and summaries arrive rendered from the server, so hydration doesn't parse their markup again (blocking time about halved), and the props carry only what can't be derived.
- **Glass:** blur only on the header and tab bar (9b). The hero pane is a solid plate.
- Not reached: performance 90 on `/` (83) and on a lesson (88), and LCP under 2.5 s anywhere (see the floor above). Server HTML with client islands for the path was tried afterwards and ruled out (see "After Phase 9" below).

### 9e (2026-10-03)

- **The sweep** (`scripts/sweep-375.js`, rerunnable; instructions at its top): every route in `content/routes.ts` (151, served as `/data/routes.json`) plus a missing page, in a 375 px frame, light and dark. Result: **152 routes, 10,406 Tab stops, nothing failing**, in the in-app browser, and again in Playwright with reduced motion emulated (10,419 stops).
  - No horizontal scroll at 375 px, light or dark.
  - A visible focus ring on every Tab stop. The rings are simulated: a background window never matches `:focus-visible`, so each focus rule gets a twin keyed to a test class, inserted beside it (cascade order kept), and checked on each stop. A planted `outline: none` is caught.
  - Nothing moving at rest; under reduced motion, nothing longer than the global rule's 0.01 ms transitions.
  - Persian phrases inside English brackets keep their order on the line (checked on the line fragments, English lines only).
  - Console: script errors none; the only 404s are the local-only ones (Vercel Analytics, Next's prefetch files that `serve` can't map).
- **Tables:** a lesson table with an empty first header now has row headers (`<th scope="row">`) and a plain corner cell; `td-has-header` passes (lesson 4.5 and four more). The labels keep their regular weight.
- **Lighthouse accessibility 100** on the four target pages and on 18 more: lessons 1.2, 4.5, 10.5, 14.2; `/script`, `/script/be`, `/verbs`, `/vocab`, `/dictionary`, `/grammar`, `/progress`, `/placement`, the letter trainer, the type-it game, `/practice/sheets`, `/practice/cloze`, `/practice/mistakes`, `/offline`. (The missing page returns 404, which Lighthouse won't audit.) Best practices 96 everywhere, from the local-only 404s alone.
- **Found on the way:** the footer links were 23.8 px tall (under the 24 px target size) and, on the home page, reported as covered by the skipped lesson lists while Lighthouse measured them; both fixed (9d). Tailwind scanned the docs, tests and scripts for class names and generated unused utilities from their words; they are excluded now (`@source not` in `globals.css`).
- **Bidi in brackets:** no rendering fault (see finding 3); `Rich` needed no change.
- **CSS at the end of Phase 9:** 79,860 bytes, 16,339 gzipped, from 79,064 and 16,339. 9b alone ended a byte smaller; the craft rules of 9c and the performance rules of 9d (content-visibility, the display face, the loading card, the target sizes) add about 0.8 KB raw and nothing gzipped.

### After Phase 9: the home page and the dictionary (2026-10-03)

The owner asked to go on toward 90 on the home page and lessons, and to look at the dictionary. OneDrive kept the CPU at 70–100 % throughout, so absolute scores were lower than in 9d. Each change was therefore measured as an interleaved A/B: two builds served side by side (ports 3101 and 3102), Lighthouse alternating between them, four to six runs each. Two copies of the same build differed by about 3 points, which is the noise.

- **The home page: stopped, with evidence.** In App Router, hydration covers server-rendered output too, so "server HTML with client islands" would not remove the path's hydration. Two bounding tests:
  - with plain `<a>` in place of `<Link>` on the 92 lesson rows, the score went down (59 against 69), so `Link` stays;
  - with the whole lesson list removed (100 KB less HTML), the score rose by only 3 (79 against 76), with the same blocking time and LCP.

  So no rewrite of the path can reach 90. A trace explains why. All files arrive by 0.33 s and the page is laid out at 0.3 s, then the main thread idles until a paint is reported at 1.6 s. The gap is in Chrome's GPU process presenting the first frame of a long page; a one-line page paints at 0.09 s. Lighthouse's simulation then charges all the JavaScript loaded before that paint to LCP (4.3 s simulated, against 1.25 s for FCP). That is this machine's headless Chrome, not the page. PageSpeed Insights (Google's servers) would say more, but its keyless quota was used up.
- **The dictionary** (604 entries, about 1 MB of HTML, 80 KB gzipped) went from about 55 to about 59. Its blocking time fell from 4.0–5.8 s to 1.7 s:
  - **Lazy layout:** each entry is drawn only near the screen (`content-visibility: auto`, with a placeholder of one entry's height, 11rem at phone width and 7rem from 640 px, and the real height remembered once drawn). Style and layout fell from 6.6 s to 1.0 s, and rendering from 1.0 s to 0.2 s. Paint containment would clip the focus rings of the star and the letter links, which sit 3 px from the entry's edge, so `overflow-clip-margin: 0.5rem` lets them show; this was checked on screen at both edges.
  - **Plain links:** the list's 3,095 links (2,476 letters, 619 lessons) are plain anchors. One click listener on the list (`lib/client-link.ts`, with tests) gives them the client-side navigation a `Link` would, and leaves modified clicks, other targets and downloads to the browser. Script evaluation fell from 5.0 s to 3.2 s. Viewport prefetching of those pages is gone; a click fetches the page then, as it would for an unprefetched link.
  - **One subscription:** the dictionary already read the starred items for its "My words" count, so it now passes each star its state (`StarToggle`) instead of 604 stars subscribing to the store each. Blocking time fell from 2.2 s to 1.7 s.

  Checked on the static build at 375 px: a letter link navigates in place (same document, scrolled to the top), Back returns, stars toggle and the count follows, and there is no horizontal scroll. Lighthouse accessibility is 100.

  What's left is hydrating about 15,000 DOM nodes for 604 entries. Going further would mean drawing fewer entries at first, which changes behaviour (find in page, the full list without JavaScript), so it was not done.

## Decisions for the owner

The owner said to continue without choosing, so each is taken as recommended (yes to all four; the brand mark in Vazirmatn, whose Arabic subset is already preloaded). Any of them can be reverted on review.

1. **Near-miss look.** Add a `near` flag to the checkers' verdict (pure logic, with tests) for the cases they already describe as nearly right (half-space, missing or extra ezafe mark, the other "you", typing the shown line), shown in saffron with "Nearly." instead of red "Not quite."? Scheduling stays as it is: a near miss still counts as a miss.
2. **Kickers** dropped where they repeat the section name (item 9b.6)?
3. **Verb chips** grouped, and **progress stats** as a list (items 9b.7 and 9b.8)?
4. **The brand mark** in Markazi (or Vazirmatn) instead of Amiri, to keep Amiri off every page?

## Content list (visual fixes that need a content change)

None found so far.
