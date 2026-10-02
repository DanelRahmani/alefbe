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

### 3. A bidi bug changes the order of Persian phrases (correctness)

In English prose, two Persian phrases in one bracket, separated by an English comma, come out in reverse order. Lesson 10.5 writes «(به او, کَسی که با او حَرْف زَدَم)» and «(دیدَمَش, دوسْتَت دارَم)»; both show the second phrase first. Each phrase is its own `<bdi>`, and the comma and space between two right-to-left isolates resolve right-to-left. A single phrase in brackets, like «(او را دیدَم)», is fine. A learner reading "the first form, the second form" gets them swapped. Fix in `Rich` (a left-to-right mark after an isolate that is followed by punctuation), with a test; no content change.

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
4. **Bidi fix** (finding 3) in `Rich`, with a test, here rather than in 9e, since it is a correctness bug.
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

## Decisions for the owner

The owner said to continue without choosing, so each is taken as recommended (yes to all four; the brand mark in Vazirmatn, whose Arabic subset is already preloaded). Any of them can be reverted on review.

1. **Near-miss look.** Add a `near` flag to the checkers' verdict (pure logic, with tests) for the cases they already describe as nearly right (half-space, missing or extra ezafe mark, the other "you", typing the shown line), shown in saffron with "Nearly." instead of red "Not quite."? Scheduling stays as it is: a near miss still counts as a miss.
2. **Kickers** dropped where they repeat the section name (item 9b.6)?
3. **Verb chips** grouped, and **progress stats** as a list (items 9b.7 and 9b.8)?
4. **The brand mark** in Markazi (or Vazirmatn) instead of Amiri, to keep Amiri off every page?

## Content list (visual fixes that need a content change)

None found so far.
