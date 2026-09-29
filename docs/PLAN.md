# Alefbe Nextgen — plan

## Context

`alefbe.study` is currently a small plain-HTML Persian alphabet app: the private repo `DanelRahmani/alefbe` (~20 KB), served by the Vercel project `alefbe` (team `danelrahmanis-projects`, preset "Other", domains `alefbe.study` and `www.alefbe.study`). It has no SRS, its audio is switched off and its games are broken.

We're replacing it with an example-first Persian course modelled on Nihongo Path: a path of numbered lessons, a typed-answer script trainer with Leitner SRS, reading-aid display modes, and content-integrity tests. It is for **Iranian Persian (Tehran standard), explained in English, for English-speaking beginners**, with a "Start here" fast track for people who already speak (heritage, Dari). The owner is a fluent Dari speaker improving their written Iranian Persian, so spelling, half-spaces, Tehrani speech and reading without vowel marks get extra weight.

### Questionnaire answers (confirmed)
1. **Language and audience:** Iranian Persian; English UI and explanations; a public site for beginners, plus a fast track.
2. **Register:** spoken and written side by side, spoken first; every lesson labelled. Small "In Dari" callouts, each flagged for the owner to check.
3. **Script:** 32 letters in **alphabet order**, all four joining forms. Vazirmatn for body text; Amiri (Naskh) on letter cards and in tracing. Persian digits get a lesson and form the last drill group.
4. **Reading aids:** vowel-mark modes **all / key words only / none**. A transliteration toggle, off by default, using the â scheme (ketâb, khâne-ye man), generated from the marked text.
5. **Script trainer:** Leitner boxes 1–5 with typed answers in four modes: letter→sound, sound→letter (on-screen Persian keyboard), read whole words, spell-it dictation.
6. **Curriculum:** 13 units, full A2 (about 95 lessons). Emphasis on same-sound spelling, half-spaces, Tehrani speech and unmarked reading. Example settings rotate between daily life, travel and media.
7. **Teaching:** Nihongo Path's approach (Cure Dolly's logic-first core sentence plus Jouzu Juls-style contrast pairs), in a **neutral textbook tone**, with **proper grammar terms explained** (including their Persian names). Checked against standard published references.
8. **v1 extras:** typed lesson quizzes with explanations, a conjugation trainer, a vocabulary deck (which feeds a dictionary page), letter tracing, and progress export/import. No audio.
9. **Design:** lapis and saffron palette; minimal, with one girih motif; a round مُهر seal «تمام» as the done mark. English LTR UI with Persian runs set `dir="rtl" lang="fa"`.
10. **Hosting:** rebuild inside `alefbe` (old app tagged `v1-legacy`) on a `nextgen` branch with preview deploys. alefbe.study switches when the core is ready. Vercel Web Analytics is kept. Nihongo Path is a reference only; the code is written fresh.

## Architecture

- **Stack:** Next.js 16 (App Router, TypeScript, Tailwind 4), `output: "export"`, `turbopack.root` pinned to the project (a stray lockfile in the home folder otherwise confuses it; learned in Nihongo Path). Vitest and ESLint. Before any code, read `node_modules/next/dist/docs/`. Commit the `AGENTS.md` block that `next dev` writes. Note that `params` is a Promise, `PageProps<…>` comes from `next typegen`, and routes use `generateStaticParams` with `dynamicParams = false`.
- **Vercel:** add `vercel.json` with `"framework": "nextjs"`, so the existing project builds the new branch correctly without touching its settings while `main` still serves the old app. Security headers (HSTS, nosniff, X-Frame-Options DENY, Referrer-Policy) move from the old `middleware.js` into `vercel.json`, because static exports don't run middleware. Add `@vercel/analytics` via `<Analytics />` in the root layout; it's cookieless, so no banner is needed.
- **Routes:**
  - `/` is the path.
  - `/learn/[unit]/[lesson]` is a lesson.
  - `/script` shows the letter chart and trainer entry; `/script/drill` is the trainer.
  - `/script/trace` is tracing.
  - `/vocab` is the vocabulary deck; `/dictionary` is the word list.
  - `/verbs` is the conjugation trainer.
  - `/progress` handles export/import.
- **Content as data:**
  - `content/types.ts` holds the `Lesson`, `Unit` and `Block` types.
  - `content/lessons/<unit>.ts` exports a typed `Lesson[]`; `content/units.ts` sets the order and derives `ALL_LESSONS` (numbering, prev/next).
  - Block types are `idea`, `heading`, `text`, `examples`, `pair`, `table`, `callout` (kind `mistake | culture | tip | dari`), `dialogue`, `link` and `quiz`.
  - Each lesson has `slug, title, summary, register: "spoken"|"written"|"both", tags: LessonKind[], source, vocab?: VocabItem[], blocks`.
  - Examples look like `{ fa: Fa; written?: Fa; en: string; note?: Rich }`. `fa` is the spoken form when the register is `both`, and `written` shows underneath, smaller.
  - `LessonRenderer` maps each block type to a component.
- **`lib/`:**
  - `persian/letters.ts`: the letter table, ported by hand from the old `AL` data (forms, names, sounds, joining flag), plus digits.
  - `persian/normalize.ts`: maps ي→ی, ك→ک, ٠–٩→۰–۹ and strips tatweel.
  - `persian/parse.ts`: letters plus their mark sets, with ZWNJ as a morpheme boundary; shared by the transliteration and the readability check.
  - `persian/marks.ts`: vowel-mode rendering.
  - `persian/syllables.ts`: checks that every word is fully readable.
  - `translit.ts`: generates the transliteration.
  - `markup.ts`, `srs.ts`, `storage.ts`, `conjugate.ts`, `answers.ts` (typed-answer checking and near-miss hints).
  - All of these are pure and unit-tested except `storage.ts`.
- **Storage:** `lib/storage.ts` provides `createPersistentStore(key, fallback)` over `useSyncExternalStore`, with try/catch, a cross-tab `storage` event, and a **version field plus migrate function**. Keys: `alefbe2:settings`, `alefbe2:progress`, `alefbe2:srs` (every deck), `alefbe2:path-filter`, `alefbe2:trace`. On first load, the old `alefbe_v1` learned letters (same origin) are read once to pre-unlock drill groups; the old key is left untouched.
- **Display settings:** a native `popover` in the header offers vowel marks (all / key / none), transliteration (a switch), and theme (system / light / dark).
  - To avoid a flash on the static HTML, a tiny inline script in `<head>` copies the saved settings onto `<html data-vowels data-translit data-theme>` before first paint.
  - The static HTML ships default values, `<html>` has `suppressHydrationWarning`, and the CSS treats a missing attribute as "all".
  - Persian runs render each variant that differs and CSS hides the others. Hidden variants use `display:none`, so screen readers skip them.
  - Settings persist per browser and survive a reload.

## Persian text engine (the heart; it gets the most tests)

**Authoring rule:** every Persian string is written **fully vowel-marked** in its real spelling (ی/ک, ZWNJ, ٔ). That includes a **sukun on every syllable-final consonant except the word's last letter**, which is what makes the readability check exact. The display modes are derived by stripping marks, so there is no separate `[base|reading]` for normal words.
- **Mode "all":** the text as written. Whether sukun is displayed in this mode is decided in Phase 1's visual check; the source keeps it either way.
- **Mode "key":** marks stay inside `{highlighted}` spans. Elsewhere zabar, zir, pish, sukun and tashdid are stripped. The ezafe is always kept (a word-final kasra, including on ـیِ, or ٔ).
- **Mode "none":** strips exactly U+064E–U+0652 plus U+0670, never `\p{Mn}`. Tanvin (مثلاً) and hamze (ٔ ء أ ؤ ئ) are kept, because standard spelling writes them.

**One parser, two users** (`lib/persian/parse.ts`): it tokenises each word into letters, each with an **unordered set** of marks, and treats ZWNJ as a morpheme boundary. The set matters because NFC can reorder shadda and the vowel mark. Both the transliteration and the readability check consume its output, and a mark the parser didn't use is an error.

**Markup** (`lib/markup.ts`, parsed once) inside Persian strings:
- `{…}` for highlight;
- `**…**` for bold and `*…*` for italic;
- `[متن|translit]` as an escape hatch for the transliteration of irregular words (names, loanwords, Tehrani contractions like خونه‌ش). It is used sparingly, and a test counts the overrides.
- An `affix` or `letter` token (ـها, ـم, a lone ب) skips the readability check and may contain tatweel or ZWJ.

**Rendering:**
- Highlights and bold that split a word use **colour only** (a change of font weight breaks letter joining, especially in Safari). The renderer inserts a ZWJ at each split point.
- In English prose, runs of Arabic script are detected automatically and wrapped as `<bdi lang="fa" dir="rtl">` in Vazirmatn. Their transliteration is a sibling `<span lang="fa-Latn" dir="ltr">` outside the `bdi`.
- Line height is raised on the containing paragraph, not the inline run. Persian text never gets clamping, `overflow:hidden` or justification.

**Transliteration rules** (`lib/translit.ts`), applied in this order and written up as a table in STYLE.md:
0. Word list: a standalone وَ → va, وُ → o. ی with a dagger alef (ٰ) → â (حتیٰ, موسیٰ).
1. When the و has no mark: خ+و+ا → khâ, and خ+و+ی → khi.
2. At the start of a morpheme (word start or after ZWNJ):
   - آ → â;
   - اَ اِ اُ → a e o;
   - a bare ا+ی → i, and a bare ا+و → u;
   - any other bare ا is an error;
   - an ع or ء at the very start of a word gives no apostrophe.
3. Tanvin: a consonant with ً followed by ا → consonant + "an", and the ا is silent.
4. و and ی, first match wins:
   - (a) carrying a vowel mark or tashdid → v / y;
   - (b) at the start of a morpheme → v / y;
   - (c) a bare و after pish → o (تُو to, دُو do, خُود khod);
   - (d) after zabar, before a consonant or at word end → ow / ey (نوروز nowruz), but before ا/و/ی → v / y (havâ, bayân);
   - (e) after a consonant with sukun → v / y (پَرْوانه parvâne);
   - (f) after any vowel → v / y (pâyiz, jâyi, âyâ);
   - (g) after a bare consonant → u / i.
5. A long i directly before a vowel adds a y: biyâ, hediye, chiye.
6. آ inside a morpheme → 'â (qor'ân).
7. Final ه, at word end or before ZWNJ:
   - it is h **only** with a sukun, or after ا or a vowel و: râh, kuh, دَهْ dah, شَبیهْ shabih;
   - otherwise it's silent and takes the preceding vowel mark, or e if there is none: خانه or خانِه → khâne, نَه → na, به → be.
8. Ezafe (a word-final kasra):
   - after a consonant → -e;
   - on a glide ی after ا or و → -ye;
   - on a ی that is the vowel i → i-ye (sandali-ye);
   - ـهٔ and ـه‌ی → -ye (khâne-ye).
9. ء أ ؤ ئ, and ع in the middle of a word → '.
10. Tashdid doubles the consonant, digraphs included (bachche).
11. Consonants:
    - ق→q, غ→gh, خ→kh, ش→sh, چ→ch, ژ→zh;
    - ث/س/ص→s, ذ/ز/ض/ظ→z, ت/ط→t, ح/ه→h.
    - A hyphen goes where s, z, k or g meets an h, so ruz-hâ doesn't read as "zh" (ruz-hâ, es-hâl).
12. ZWNJ adds nothing, except a hyphen between two vowels (khâne-am, khâne-i).
13. Digits become Western digits. ، ؛ ؟ « » become , ; ? " ".

About 150 golden words get tests. They include هوا، پروانه، دنیا، هدیه، شبیه، صندلیِ، نه، حتی، بیا، قرآن، دوم، روزها، خواهر، خود، تو/تُو، مثلاً، مسئله، رئیس، خانه‌ای، دانشجویی، پاییز, and each rule also gets its own test. Tehrani contractions the rules can't derive (خونه‌ش khunash) use overrides and are flagged for the owner to confirm.

**Readability check** (`lib/persian/syllables.ts`, the Persian equivalent of Nihongo Path's "bare kanji" test):
- The parser's output is syllabified against `^CV(C{0,2}CV)*C{0,2}$`, with ا and آ counted as the glottal consonant.
- A non-final consonant with no vowel, sukun or tashdid, and no vowel letter after it, fails.
- So do two vowels in a row (except rule 5) and any mark the parser didn't use.
- A ZWNJ compound counts as one word here, so the ش in خونه‌ش passes.
- Arabic-style long-vowel marking (ـَا, ـِی before a consonant) is linted.

**Unicode:**
- `lib/persian/normalize.ts` handles typed input only. It uses **explicit maps and never NFD**:
  - ۀ → ه+ٔ
  - ی+ٔ → ئ
  - ي and ى → ی
  - ك and ڪ → ک
  - ە ھ ہ → ه
  - ة → ه, with a hint
  - Arabic presentation forms → base letters
  - bidi controls, the BOM and non-breaking spaces are stripped
- `letters.ts` is exempt, so its joining forms can keep tatweel or ZWJ.

## Content-integrity tests (vitest; they fail the build)
- **Markup:**
  - every string parses;
  - `{}`, `**` and `*` are balanced.
- **Readability:** every Persian word passes the syllable check (fully readable in "all" mode).
- **Spelling:**
  - no Arabic ي ك ة or Arabic-Indic digits;
  - only allowed characters appear.
- **Half-spaces:**
  - **Errors:** a string matching a known form with its ZWNJ removed or turned into a space fails. The known forms are generated from every `conjugate.ts` output and every vocab and plural form, so words like میز, میوه, میدان, تنها and رها don't misfire.
  - **Warnings only:** a pattern check (`می`/`نمی` prefix, `ها`, ه + ام/ای/اش, ـتر) with an allowlist, skipped after non-joining letters. A ZWNJ next to a space or a doubled ZWNJ is an error.
- **Transliteration:** the output has no Arabic-script characters left over.
- **Structure:**
  - internal links resolve;
  - table rows are the right width;
  - slugs are unique and numbering runs in sequence;
  - every lesson has a `source`, a register label, the template blocks (idea, examples, pair, mistake callout, dialogue or culture) and a quiz with at least 3 questions;
  - titles are plain English.
- **Dari callouts:** the report lists any not yet confirmed by the owner. This warns, it doesn't fail.
- **Logic tests:** `srs`, `answers` (normalisation and near-miss hints) and `conjugate` (golden conjugation tables for every trainer verb, spoken and written).

## Script trainer
- **Groups** follow the alphabet lessons (ا–ث, ج–خ, د–ژ, س–ض, ط–غ, ف–گ, ل–و, ه–ی), then the digits. The next group unlocks when every card in the current one reaches box 3.
- **Schedule:** the intervals are 0 · 10 min · 1 d · 3 d · 7 d, and a miss sends the card back to box 1.
- **Escape hatches:** "I know these — unlock the next group", and "Practise anyway" (random unlocked cards, schedule untouched).
- **Modes** (a separate deck per mode, all sharing the unlocked letters):
  1. Letter → sound: a letter in a random joining form (shown inside a carrier word when it's medial or final); you type its sound. Letters with several values accept any of them (و v/u/o, ی y/i, ه h/e, ا â, or a/e/o at the start of a word, ع/ء ').
  2. Sound → letter: the prompt is the letter's **name** plus its sound ("sâd · s") so the answer is unambiguous; you type the letter.
  3. Read whole words: a word made only of unlocked letters, marks shown; you type the transliteration.
  4. Spell it: transliteration plus meaning; you type the Persian spelling.
- **Word modes (3 and 4)** open once lesson 2.2 (the vowel marks) is done, with an "open anyway" link.
- **Checking transliteration answers:**
  - â can also be typed as aa, ā, á or a^;
  - ’ ‘ ` and ʿ all count as ';
  - ezafe hyphens are optional;
  - ow/o and ey/ei both count;
  - kh typed as x, or gh typed as q, is accepted with a note;
  - a missing ' for ع is accepted with a hint.
- **Checking Persian answers** happens in tiers:
  1. An exact match after normalisation is correct.
  2. If the only difference is ZWNJ vs space vs nothing, it gets a "use a half-space here" hint.
  3. If it matches once same-sound letters are collapsed, it gets "same sound, other letter: ص not س".
  - Arabic ي/ك are normalised silently.
  - Accepted variant spellings get a note, with the Academy spelling first: بلیت/بلیط، اتاق/اطاق، مسئله/مسأله، پاییز/پائیز، ـهٔ/ـه‌ی.
- **Input:** the device's own Persian keyboard, or the built-in on-screen **standard Persian (ISIRI 9147) layout**, which has a ZWNJ key. Autocorrect and spellcheck are off.

## Extras
- **Lesson quizzes:** a `quiz` block with 3–5 typed questions, each with accepted answers (normalised) and an explanation shown after answering. They are written with each unit.
- **Vocabulary deck:** built from each lesson's `vocab`. Words join the deck when their lesson is marked done. The prompt is the English meaning (the transliteration hint is optional); you type the Persian, with Leitner scheduling.
- **Dictionary:** every vocab item, searchable and filterable by unit, each linking to its lesson. The old app's 60 words are checked and folded in.
- **Conjugation trainer:** `lib/conjugate.ts` generates conjugations from the infinitive, the present and past stems and an optional spoken stem (می‌رم, می‌گم, می‌خوام).
  - Tenses: present, simple past, past continuous, present perfect, progressive, subjunctive, imperative, and future (written only). Negatives are included.
  - An SRS item is a verb × tense; each review asks a random person, spoken or written.
  - About 25 core verbs.
- **Tracing:** rewritten from scratch as a canvas component. The hand-placed checkpoints come from the old `WP*` tables, which were made for Amiri, so tracing stays on Amiri. Three levels: guided, outline, freehand.
- **Export/import:** one versioned JSON covering every `alefbe2:*` key. It also accepts the old Alefbe export format.

## Design
- **Palette:** lapis and saffron.
  - Light: parchment `#F7F3EA`, ink `#1B1F3B`, lapis accent `#1F4AA8`.
  - Dark: night `#0C0E2B`, text `#E8E0CC`, saffron accent `#E3B550`.
  - Every pairing is checked for WCAG AA.
- **Motif:** one girih band, used in the header and on unit dividers.
- **Fonts:** Vazirmatn for Persian; Amiri on letter cards and in tracing; the Latin UI font is picked in the scaffold's design pass.
- **Done mark:** the مُهر seal is a round, double-ringed SVG stamp reading «تمام», rotated −8°, with a 300 ms stamp animation that is off under `prefers-reduced-motion`.
- **Layout and access:** mobile-first at 375 px with no horizontal scroll, and visible `:focus-visible` rings.
- **Path page:**
  - chips for each lesson kind (Script, Pronunciation, Spelling, Word order, Grammar, Verbs, Prepositions, Suffixes, Spoken Persian, Culture, Reading) and a "hide finished" toggle, both persisted;
  - the server passes only a slimmed-down unit list;
  - an empty state shows when everything is filtered out.
- **Script lessons (Units 1–2)** always show transliteration under example words, since the vowel marks haven't been taught yet.

## Curriculum (13 units, ~95 lessons; the titles are working titles)
- **0 Start here:**
  - 0.1 How this course works: vowel marks, transliteration, the seal
  - 0.2 Persian in one page: verb last, no articles, no gender
  - 0.3 Already speak Persian? Your fast track (heritage and Dari)
- **1 The alphabet:**
  - 1.1 How the script works: right to left, joining, four forms
  - 1.2 ا ب پ ت ث: alef and the boat letters
  - 1.3 ج چ ح خ: one shape, four sounds
  - 1.4 د ذ ر ز ژ: letters that never join forward
  - 1.5 س ش ص ض
  - 1.6 ط ظ ع غ
  - 1.7 ف ق ک گ
  - 1.8 ل م ن و: و is v, u or o
  - 1.9 ه ی: the shape-shifting he, and ye
  - 1.10 Persian digits ۰–۹
- **2 Sounds and vowel marks:**
  - 2.1 Three short vowels: zabar, zir, pish
  - 2.2 Long vowels: ا و ی as â u i
  - 2.3 و and ی: consonant or vowel?
  - 2.4 Words that start with a vowel: ا and آ as carriers
  - 2.5 Letters that spell a vowel: final ه and the و in تو، خود; silent و in خوا
  - 2.6 Tashdid, sukun and tanvin
  - 2.7 Hamze and eyn: the catch in the throat
  - 2.8 Stress: where the beat falls
- **3 Writing and spelling:**
  - 3.1 The half-space: why می‌روم, not می روم or میروم
  - 3.2 Where half-spaces go: می‌، ‌ها، ‌ام after ه, compounds
  - 3.3 One sound, three letters: س ص ث
  - 3.4 One sound, four letters: ز ذ ض ظ
  - 3.5 ت/ط, ح/ه, غ/ق
  - 3.6 Arabic loanwords: patterns that predict spelling
  - 3.7 Punctuation and the Persian keyboard; ی/ک, not ي/ك
- **4 Word order (SOV):**
  - 4.1 The core sentence: the verb comes last
  - 4.2 The invisible subject: the verb ending says who
  - 4.3 Where time and place go
  - 4.4 Objects and "to someone" before the verb
  - 4.5 Negation: ن on the verb
- **5 The ezafe:**
  - 5.1 The ezafe links a noun to its describer
  - 5.2 The ezafe for "of" and possession
  - 5.3 After vowels: ـیِ and ـهٔ
  - 5.4 Ezafe chains
  - 5.5 Where there's no ezafe: numbers, adjectives in front, superlatives
  - 5.6 Hearing the ezafe in unmarked text
- **6 Prepositions and را:**
  - 6.1 را marks the definite object *(the flagship lesson)*
  - 6.2 No را: indefinite and general objects
  - 6.3 را in speech: رو / ـو
  - 6.4 The core prepositions: به از با در برای تا
  - 6.5 Place words with ezafe: رویِ زیرِ کنارِ پیشِ توی
  - 6.6 از in comparisons, and از…تا
- **7 Core grammar:**
  - 7.1 "To be": است and the short endings
  - 7.2 هست and نیست
  - 7.3 "To have": داشتن
  - 7.4 Pronouns and formality
  - 7.5 Comparatives and superlatives: ـتر، ـترین
  - 7.6 این and آن, اینجا and آنجا
  - 7.7 Question words, and yes/no questions
  - 7.8 Numbers and counting words (تا، نفر)
  - 7.9 Prices, time and dates
- **8 Verbs:**
  - 8.1 Infinitive and the two stems
  - 8.2 Present tense
  - 8.3 Irregular present stems
  - 8.4 Simple past
  - 8.5 Past continuous
  - 8.6 Present perfect
  - 8.7 The progressive: دارم می‌رم / داشتم می‌رفتم
  - 8.8 Subjunctive
  - 8.9 Want, can, must + subjunctive
  - 8.10 Imperative
  - 8.11 Future: written خواهم vs spoken present
  - 8.12 Compound verbs
  - 8.13 کردن vs شدن pairs
  - 8.14 Past perfect
- **9 Suffixes:**
  - 9.1 Plural ـها
  - 9.2 Plural ـان, and Arabic plurals you'll meet
  - 9.3 Possessive endings, including after vowels
  - 9.4 The indefinite ـی and یک…ـی
  - 9.5 Object endings: دیدمش، بهش
  - 9.6 Word-building: ـی، ـگاه، ـچی، ـستان
  - 9.7 ـی + که: "the book that…"
- **10 Spoken ↔ written:**
  - 10.1 Why they differ
  - 10.2 ân→un (نان→نون)
  - 10.3 است→ـه and the verb endings
  - 10.4 Short spoken stems
  - 10.5 را→رو, and object endings in speech
  - 10.6 Words that only exist in speech (یه، دیگه، اینجوری)
  - 10.7 How Iranians type chat messages
- **11 Culture in conversation:**
  - 11.1 شما vs تو, and verb agreement
  - 11.2 Greetings and goodbyes
  - 11.3 Taarof
  - 11.4 Set phrases (نوش جان، دستت درد نکنه)
  - 11.5 Polite verbs: بفرمایید، تشریف آوردن
  - 11.6 Names, titles, جان
  - 11.7 Nowruz, Yalda and the Persian calendar
- **12 Reading real texts** (in "none" mode, with help available):
  - 12.1 Signs
  - 12.2 A menu
  - 12.3 Text messages
  - 12.4 A headline
  - 12.5 A short story paragraph
  - 12.6 A line of Hafez, in the public domain; everything else is original

## Content-accuracy process
- **`content/STYLE.md`:**
  - the teaching style: logic-first plus contrast pairs, neutral tone, terms explained;
  - the markup and vowel-mark conventions and the transliteration table;
  - the half-space rules, which follow the Academy's دستور خط فارسی (for example, ـهٔ for the ezafe after a silent ه);
  - how spoken and written forms are labelled;
  - a "Corrected, not copied" list covering the old app's content (grammar page, the 60 words, the letter data).
- **Sources** go in each lesson's `source` field:
  - Stilo, Talattof and Clinton, *Modern Persian: Spoken and Written*;
  - Thackston, *An Introduction to Persian*;
  - Mahootian, *Persian* (Routledge Descriptive Grammars);
  - Lazard, *A Grammar of Contemporary Persian*;
  - Brookshaw and Shabani-Jadidi, *Farsi Shirin Ast*;
  - the فرهنگستان's spelling rules;
  - Dehkhoda and Sokhan for vowel marks.

  The reviewer checks against these as far as it can (using online sources where it can reach them) and flags anything it can't verify rather than guessing.
- **Examples** are original; Unit 12's Hafez line is the only quotation.
- **After each unit,** a fresh `general-purpose` reviewer agent receives the unit file, a transliteration dump and STYLE.md. It checks grammar, Tehrani naturalness, vowel marks, spoken/written pairs, translation nuance, over-general rules, and the quiz answers. I fix what it finds and report the count. Dari callouts are listed for the owner to confirm.

## Build phases
Each phase ends with tests, typecheck, lint, the production build, a browser check, a commit and a push to `nextgen`, which gives a preview deploy. From go-live onwards, each phase is also merged to `main`.

0. **Repo setup:**
   - Make this folder a git checkout of `DanelRahmani/alefbe`, after checking that its files match `origin/main`.
   - Tag `v1-legacy`, create the `nextgen` branch, and scaffold with `create-next-app@latest`.
   - Add `vercel.json` (framework, headers), Analytics, vitest, `.claude/launch.json`, and a copy of this plan in `docs/PLAN.md`.
   - The old files are removed from the branch; they live on in the tag.
1. **Engine:**
   - Build the Persian text engine, the markup, `LessonRenderer` with all blocks including `quiz`, the settings popover with the pre-paint script, storage, the seal, the lesson page and a basic path.
   - Prove it with the flagship **6.1 "را marks the definite object"**, reviewed.
2. **Script trainer:** `srs.ts`, the four modes, the on-screen ISIRI keyboard, near-miss hints, migration of old `alefbe_v1` data, and the `/script` chart.
3. **Tracing.**
4. **Units 0–3** (Start here, Alphabet, Sounds, Writing and spelling), each reviewed. Also path filters with hide-finished, export/import, and the dictionary page with the old words checked.
   - **→ Go-live:** merge `nextgen` into `main`; the existing project deploys it to alefbe.study. Then run a smoke test on the live domain.
5. **Vocabulary deck,** plus vocab added to the lessons already written.
6. **Units 4–7,** each reviewed.
7. **Conjugation trainer** and **Unit 8 Verbs,** reviewed.
8. **Units 9–12,** each reviewed.
9. **Polish:** accessibility audit, a 375 px pass on every page, reduced motion, a Lighthouse run, and a final smoke test of alefbe.study.

Status updates are one line per step; breakages are reported plainly.

## Verification (every phase, in the in-app browser against `next dev` and then the preview URL)
- The path: kind chips filter, hide-finished works, and the empty state appears.
- A lesson in each of the three vowel modes. Check that key mode keeps marks only in highlights plus the ezafe.
- The transliteration toggle survives a reload, with no flash on first paint.
- A drill with a right answer and a wrong one, confirming the box moves up or resets, the unlock banner appears and practise-anyway leaves the schedule untouched.
- Dark and light at 375 px with no horizontal scroll.
- Keyboard focus is visible.
- The console is free of errors.
- `npm test`, `npm run typecheck`, `npm run lint` and `npm run build` all pass.
- After go-live, run the deployment smoke test on https://alefbe.study.

## Risks and notes
- **OneDrive:** the project lives in OneDrive, and `node_modules`/`.next` sync can cause EPERM file locks on Windows. If that happens, pause sync during builds or move the checkout.
- **Content volume:** about 95 reviewed lessons is the long pole. The phases are ordered so the go-live slice is useful on its own.
- **Unverifiable nuance:** when the reviewer can't confirm a point, it's flagged in the phase summary instead of being shipped silently.
- **For you to confirm during Phase 1:**
  - the Tehrani forms خونه‌ش khunash and خونه‌م khunam;
  - "nowruz" vs "noruz";
  - that marking the vowel-spelling و as تُو / دُو matches the primers you know.
