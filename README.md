# Alefbe

An example-first course in Iranian Persian (Tehran standard), explained in English, live at [alefbe.study](https://alefbe.study).

- A path of numbered lessons (unit.lesson), each built on one template: the idea, core examples, contrast pairs, a common mistake, real conversation, and a short typed quiz.
- A script trainer with Leitner spaced repetition and typed answers.
- Display settings: vowel marks (all / key words only / none) and a transliteration toggle, saved per browser.
- No backend and no accounts: progress lives in `localStorage` and can be exported.

## Stack

Next.js 16 (App Router, static export), TypeScript, Tailwind 4 and Vitest, deployed on Vercel. See [`AGENTS.md`](AGENTS.md): read `node_modules/next/dist/docs/` before changing framework code.

## Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Start the dev server on http://localhost:3000 |
| `npm test` | Unit and content-integrity tests |
| `npm run typecheck` | Generate route types and run `tsc` |
| `npm run lint` | ESLint |
| `npm run build` | Static export into `out/` |

## Layout

- `content/`: lessons as typed data (`lessons/<unit>.ts`), the unit order (`units.ts`), and the teaching and markup rules (`STYLE.md`)
- `lib/`: the Persian text engine (parsing, vowel-mark modes, transliteration, readability checks), SRS and storage
- `components/`: the lesson renderer, drills and settings
- `tests/`: unit tests and the content-integrity suite that fails the build on bad content
- `docs/PLAN.md`: the approved build plan

The previous single-file app is kept at the `v1-legacy` tag; an unpublished multi-page version of it is on the `legacy-multipage` branch.
