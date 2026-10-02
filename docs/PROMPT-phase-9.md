# Prompt: Phase 9 (polish and the design pass)

Paste everything below the line into a new session. It builds Phase 9 of `docs/PLAN.md`: a design pass that makes the whole app feel like one crafted thing, then performance, an accessibility audit, a 375 px pass on every page, and a final smoke test.

Run it only once Phase 8 is merged and `nextgen` matches `main`. Audio and the "Waiting on the owner" questions are for later: don't start on them.

---

Continue building Alefbe (Next.js static export, Iranian Persian course) on the `nextgen` branch: Phase 9, polish.

1. Get oriented:
   - Read "Alefbe: where the work stands" in CLAUDE.md, especially 4a+ (the Orosi design), 4f (the last audit and its numbers) and "Working habits"; and "Design" in `docs/PLAN.md`.
   - Fast-forward `nextgen` to `main` if it is behind. Confirm the tree is clean and `git log nextgen..main` is empty. If either fails, stop and tell me.
   - Run `npx vitest run`. Start `alefbe-dev`. Build, and start `alefbe-static` for the audits.
   - Read `app/globals.css`, `app/components.css` and `app/practice.css` (the tokens and components), `app/layout.tsx` (fonts), `components/Orosi.tsx`, `components/Seal.tsx`, `components/SiteNav.tsx` and `components/PathBrowser.tsx`.
   - If a design skill is available (impeccable, frontend-design), use it for the critique in 9a, but the app's own design language decides: Persian craft (the orosi window's stained glass, girih and khatam patterns, the مُهر seal, lapis and saffron), restrained and readable, never decoration over content.

2. Build in this order, one sub-phase at a time. Plan each briefly, and show me before/after screenshots at 375 px and at desktop width, light and dark, for every visible change.

   - **9a. Design audit, then a plan.** Before changing anything, walk every kind of page: home and path, a lesson of each kind (script, grammar with tables, dialogue-heavy, reading), `/script` and a letter page, the practice hub and every trainer, `/verbs`, `/vocab`, `/dictionary`, `/grammar`, `/progress`, `/placement`, search, settings and the not-found page. Note what is inconsistent or weak:
     - spacing and type scale;
     - card and panel styles;
     - button and chip variants;
     - how feedback (right, wrong, near miss) looks in each trainer;
     - empty states and loading states;
     - how Persian and English sit together on a line (size, baseline, line height, bidi with brackets and punctuation, a known rough spot);
     - dark mode contrast and glass legibility;
     - the motion that exists.

     Write the findings and a short plan to `docs/DESIGN-PASS.md`, ranked by how much each improves the learner's day. Show me the plan before 9b.

   - **9b. One design system, applied everywhere.**
     - Consolidate the tokens: a type scale for Latin and for Persian (Vazirmatn and the Naskh option), spacing, radii, elevation, and glass levels.
     - Define one set of components and move every page onto it: buttons, chips, cards, panels, feedback blocks, tables, the trainer card, progress rings and bars, and the confirmation box.
     - Remove one-off styles as you go, so the CSS gets smaller, not larger.
     - Keep everything WCAG AA in both themes, and keep the Orosi palette.

   - **9c. Moments of craft**, small and purposeful, each off under `prefers-reduced-motion`:
     - the seal stamping on a finished lesson (it exists: check it);
     - a unit's girih divider that fills in as its lessons are finished;
     - a quiet glow on the Today card's ring when the daily goal is met;
     - a right answer that settles rather than bounces;
     - the stained-glass hero catching light on hover;
     - the path reading as a journey through the units, not a list.

     Pick the ones that earn their place after 9a; skip any that slow a page or distract from reading. No new dependencies: CSS and SVG only.

   - **9d. Performance.** LCP was about 5 s on throttled mobile (4f). Style and layout dominate the main thread; the suspects are the hero window and the `backdrop-filter` glass.
     - Measure first.
     - Then fix: cheaper glass (a solid tint where blur adds little, blur only on small surfaces), the hero's SVG pattern, the size of the HTML for `/practice/review` (about 74 KB gzipped) and other large pages, and fonts (preload only first-paint fonts; check Amiri stays lazy).
     - Targets on mobile, on `alefbe-static`: Performance 90 or more on `/`, a lesson and `/practice`; LCP under 2.5 s; CLS under 0.1. Report before and after.

   - **9e. Accessibility and the 375 px pass, every route.** Repeat the 4f sweep on all routes, now well over 100 (`content/routes.ts` lists them). Script it in the in-app browser, not by hand, and save the script under `scripts/` so it can be rerun. For every page check:
     - no horizontal scroll at 375 px, in light and dark;
     - a visible focus ring on every Tab stop;
     - no console errors beyond the known local-only 404s;
     - nothing moves under reduced motion.

     Also:
     - Fix the lesson tables with an empty first header cell, which fail Lighthouse's `td-has-header` audit (not scored, but real for screen readers).
     - Check the bidi rendering of English sentences with Persian in brackets (for example "(او را دیدَم)" in 10.5), and fix it in `Rich` / `FaText` if a mark or a direction isolate solves it.
     - Lighthouse accessibility 100 on every page you audit; best practices as high as the local-only 404s allow.

   - **9f. Final smoke test.** After the owner merges this phase, check www.alefbe.study:
     - every route returns 200;
     - no console errors;
     - Analytics loads;
     - the service worker and offline page work;
     - a progress backup made on the old build imports cleanly.

     Report it. The preview at new.alefbe.study is behind Vercel login: leave that protection as it is.

3. Rules:
   - Behaviour must not change except where the plan says so. Every test passes after every sub-phase. Add tests for any pure logic you touch.
   - No new dependencies. Preload only first-paint fonts.
   - Don't change lesson content. A visual fix that needs a content change goes on a list for me.
   - Commit and push to `nextgen` once per finished sub-phase, and keep CLAUDE.md's progress section up to date in each commit (add a "Phase 9 status" section).
   - Never merge into `main`, and don't open a PR unless I ask. Don't touch Vercel protection settings.

4. When done, report to me:
   - the design plan and what was carried out, with before/after screenshots;
   - the CSS size before and after;
   - Lighthouse before and after (performance and accessibility) on `/`, a lesson, `/practice` and `/practice/review`;
   - the route sweep results, and what was fixed;
   - anything left for later, ranked.
