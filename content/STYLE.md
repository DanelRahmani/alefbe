# Alefbe content style

The rules every lesson follows. The content tests (`tests/content.test.ts`) enforce the mechanical ones; the per-unit reviewer checks the rest.

## Teaching approach

Two influences, adapted to Persian:

- **Logic first (after Cure Dolly).** Explain what a structure *does* in the sentence rather than listing rules through English translation. The Persian core sentence has the verb last, and the verb ending carries the subject, so می‌رَوَم alone is a full sentence. را is a tag on the one specific thing acted on. The ezafe is the glue that hangs describers onto a noun.
- **Contrast pairs (after Jouzu Juls).** Teach through near-identical sentences with one thing changed, and say plainly what the change does. The pair block is the heart of every lesson.

**Tone:** neutral textbook. Clear and precise, no jokes, no chattiness.

**Terms:** use the proper grammatical term and explain it on first use, with its Persian name where one is common. For example: "the **direct object** (مَفْعولِ صَریح, the thing the action is done to)".

## Lesson template

Every lesson has, in order:

1. **The idea** (`idea`): one sentence.
2. **Core examples** (`examples`): 3–5 natural, original sentences with the key part in `{highlight}`.
3. **Contrast pairs** (`pair`): the same sentence with one thing changed, plus a plain-English note on what changes.
4. **Common mistake** (`callout` kind `mistake`): what learners get wrong and the fix, ideally with `wrong` / `right` examples.
5. **In real conversation** (`dialogue`, or a `culture` callout).
6. **Check yourself** (`quiz`): 3–5 typed questions, each with an explanation.

Every lesson also carries:

- `source`: the published reference(s) it was checked against;
- `register`: `spoken`, `written` or `both`;
- at least one `kinds` tag.

## Spoken and written

- **`both`:** the example's `fa` is the spoken (Tehrani) form and `written` is the written form, shown beneath it. If the two are identical, omit `written`.
- **Spoken spelling:** follow how Iranians actually type colloquial Persian, e.g. می‌خوام, خونه, رو, یه. Where the spoken spelling hides the pronunciation, use a `[base|translit]` override, but only with a source for the pronunciation. Contracted forms whose pronunciation is unconfirmed (e.g. خونه‌ش) stay out of lessons.

## Markup

| Markup | Meaning |
| --- | --- |
| `{…}` | Highlight: the lesson's key part, the "red pen". In Persian it stays colour-only. It may split a word only between letters, never before a lone vowel mark. |
| `**…**` / `*…*` | Bold / italic. In Persian, bold only whole words (a weight change breaks letter joining). |
| `[متن\|translit]` | Transliteration override for one irregular word: names, loanwords (رادیو *râdiyo*), گفت‌وگو *goftogu*. Use sparingly. |
| `ـها` (leading tatweel) | An affix, read as a suffix (*-hâ*). Skips the readability check. |
| A bare single letter | A letter mentioned by name ("و and ی"). Not transliterated. |

English strings are "Rich". Persian runs inside them are detected automatically and follow the same vowel rules as Persian strings.

## Vowel marking (authoring convention)

Every Persian string is written **fully vowel-marked** in its real spelling. The display modes are derived from this by stripping marks, and the transliteration is generated from it.

- **Short vowels:** zabar ـَ (*a*), zir ـِ (*e*), pish ـُ (*o*) on every consonant that has one.
- **Sukun ـْ:** on every syllable-final consonant *except the last letter of a word or of a half-space-separated part*: دوسْت, پَرْوانه, روزْها. This makes every word read one way only.
- **Long vowels:** ا (*â*), و (*u*), ی (*i*) carry no mark on the letter before them. Arabic-style marking (ـَا, or ـِی before a consonant) is an error.
- **و that spells o** (واوِ بَیانِ حَرَکَت): pish on the consonant, then a bare و, as in تُو (*to*, you), دُو, خُود, رُو, چِطُوری. A bare و after a bare consonant is *u*: تو (*tu*, inside). This pish is an **authoring marker only**: Iranian primers don't write it, so it is never displayed, not even in "All marks" mode. It only tells the engine how to read the word. Learners meet these words as a set to learn (lesson 2.5), with the transliteration as the guide.
- **Silent و after خ** (واوِ مَعْدوله): خوا (*khâ*) and خوی (*khi*), with no mark on خ.
- **Diphthongs:** zabar followed by a bare و or ی gives *ow* / *ey* (نَوروز *nowruz*, کَی *key*), unless a vowel letter follows (هَوا *havâ*).
- **Final ه:** silent by default. It reads *e* after an unmarked consonant (خانه *khâne*, به *be*), or nothing when the consonant before it already has a mark (نَه *na*). It is the consonant *h* only after ا or a vowel و (ماه, کوه) or with a sukun (دَهْ *dah*, شَبیهْ *shabih*).
- **Ezafe:**
  - a word-final zir after a consonant (کِتابِ *ketâb-e*);
  - zir on a final vowel ی (صَنْدَلیِ *sandali-ye*);
  - ی with zir after ا/و (دانِشْجویِ, خُدایِ *-ye*);
  - **ـهٔ** after a silent ه (خانهٔ *khâne-ye*), as the Academy prescribes. Never write a zir on a silent ه.
- **Tanvin:** مَثَلاً, with ـً on the alef.
- **Dagger alef:** حَتّیٰ, موسیٰ.
- **Hamze:** ء أ ؤ ئ with their marks: مَسْئَله, رَئیس, سُؤال, مُؤْمِن.
- **Word-initial vowels:** an alef that starts a word or part carries its vowel (اَز, اِمْروز, اُسْتاد), or is written ای / او for *i* / *u* (ایران, او), or is آ (آب).

### Display modes

- **All:** as written.
- **Key words only:** marks only inside `{highlights}`; the ezafe zir and ـهٔ are kept everywhere.
- **None:** zabar, zir, pish, sukun, tashdid and the dagger alef are removed. Tanvin and hamze stay, because standard spelling writes them.
- A mark shown on a bare stroke (ـَ ـّ ـْ) is being named, so every mode shows it. Sukun and tashdid on a stroke have no transliteration; a short vowel on one reads as a suffix (ـِ *-e*), so prose that only names it uses an empty override: `[ـِ|]`.
- Lessons about the marks (Unit 2) set `showMarks`, which shows every mark whatever the setting.

## Transliteration (the â-scheme)

Generated by `lib/persian/analyze.ts`. The rules apply in this order:

0. A standalone وَ is *va* and وُ is *o*. ی + dagger alef is *â* (حَتّیٰ *hattâ*).
1. خوا → *khâ* and خوی → *khi* (the و is silent).
2. At the start of a word or part: آ → *â*; اَ اِ اُ → *a e o*; a bare ای → *i* and او → *u*; any other bare ا is an error. A word-initial ع/ء writes no apostrophe (*ali*, *eshq*).
3. Tanvin: *-an* (*masalan*).
4. و / ی:
   - with a mark or tashdid, or at the start of a part, they are *v* / *y*;
   - after pish, و is silent (it spells *o*);
   - after zabar they are *ow* / *ey*, but *v* / *y* before a vowel letter;
   - after a sukun or any vowel they are *v* / *y*;
   - otherwise *u* / *i*.
5. A long *i* before a vowel adds *y*: *biyâ*, *hediye*.
6. آ inside a word is *'â* (*qor'ân*).
7. Final ه follows the rules above.
8. Ezafe *-e* / *-ye*.
9. Hamze and a non-initial ع are *'*.
10. Tashdid doubles the consonant: *bachche*, *avval*.
11. Consonants:
    - ق *q*, غ *gh*, خ *kh*, ش *sh*, چ *ch*, ژ *zh*;
    - ث س ص are *s*; ذ ز ض ظ are *z*; ت ط are *t*; ح ه are *h*.
    - A hyphen separates *s/z/k/g* from a following *h*: *ruz-hâ*, *es-hâl*.
12. A half-space adds nothing (*miravam*, *ketâbhâ*), except a hyphen between two vowels (*khâne-am*, *khâne-i*).
13. Digits become 0–9; ، ؛ ؟ « » become , ; ? " ".

Answers typed in the drills are lenient:

- *aa*, *ā* or *á* count as *â*;
- curly apostrophes count as *'*;
- ezafe hyphens are optional;
- *x* is accepted for *kh* and *q* for *gh*, with a note;
- a missing *'* is accepted with a note.

## Spelling (Academy of Persian Language and Literature, دستورِ خَطِّ فارسی)

- **Letters and digits:** Persian ی and ک only, never Arabic ي ك, and no ة. Persian digits ۰–۹.
- **Half-space (ZWNJ):**
  - after the verb prefixes می / نمی (می‌رَوَم);
  - before ـها after a joining letter (کِتاب‌ها);
  - before اَم ای اَنْد (and ایم اید) after a silent ه or a final ی (خانه‌اَم، قَدیمی‌اَنْد); اَسْت is a separate word (خانه اَسْت);
  - before ـتر / ـترین, except in بهتر، بیشتر، کمتر، مهتر، کهتر;
  - in compounds (بی‌کار).
- **Where it never goes:** next to a space, doubled, or after a non-joining letter (روزها needs none).
- **Ezafe after a silent ه:** ـهٔ, not ـه‌ی. Typed answers accept ـه‌ی with a note.

## Accuracy

- **Examples:** original, never copied from videos or textbooks. The only quotation planned is a line of Hafez (public domain) in unit 12.
- **Sources:** every lesson names its sources in `source`:
  - Stilo, Talattof and Clinton, *Modern Persian: Spoken and Written*;
  - Thackston, *An Introduction to Persian*;
  - Mahootian, *Persian* (Routledge Descriptive Grammars);
  - Lazard, *A Grammar of Contemporary Persian*;
  - Brookshaw and Shabani-Jadidi, *Farsi Shirin Ast*;
  - the Academy's دستورِ خَطِّ فارسی;
  - Dehkhoda and Sokhan for vowel marks.
- **Review:** after each unit, a fresh reviewer agent checks grammar, Tehrani naturalness, vowel marks, spoken/written pairs, translation nuance, over-general rules and quiz answers. Anything it can't verify is flagged, not guessed.
- **Dari notes** (`callout` kind `dari`) ship with `checked: false`, which shows a draft tag, until the owner has confirmed them (`checked: true`). Every unconfirmed note is listed for the owner in the phase report. Keep them short, and limit them to claims the owner can check at a glance (owner decision, 2026-09-30).

## Corrected, not copied: the old Alefbe app

The old app's letter table and words were checked before any reuse. Errors found so far:

- ص ض ط ظ were described as "emphatic" (IPA /sˤ zˤ tˤ zˤ/). In Persian they sound exactly like س ز ت ز; the difference is only in spelling.
- ق was given as /q/ "deep throat sound" and غ as a separate "gargling r". In Iranian Persian they have merged into one sound ([ɢ] ~ [ɣ]); the course keeps *q* / *gh* only to show the spelling.
- ع was given only as a glottal stop. In everyday Persian it is often just a break or a lengthened vowel.
- ضعیف was transliterated *zaif*; it is *za'if*.
- چای was *châi*; in this scheme it is *chây*.
- The Reference view read kasra as "/e/i/" and damma as "/o/u/". In Persian, zir is *e* and pish is *o*; the long *i* and *u* are written with ی and و.
- It listed three tanvins (-an, -en, -on). Persian writes only the *-an* one (ـاً, as in لُطْفاً), in some Arabic loanwords.
- Its tashdid example was the Arabic کَبَّر; the course uses Persian words (بَچّه).
- It listed ٪ among the marks; it is the per-cent sign.
- The letter examples ضعیف *zaif* and چای *châi* are corrected as above; ژاپن, the old key word for ژ, stays in the word list, and the letter pages use ژاکَت.

The old **Grammar** view (14 topics) became the grammar overview (content/grammar.ts, /grammar), corrected:

- Its "Prepositions & Postpositions" topic covered no postposition; Persian's one common postposition, را, now has its own topic.
- "To be" gave the full forms (هستم …) as the norm; the everyday forms are the short endings, with اَسْت written and ـه spoken for *is*.
- Plural ـان was "for animate nouns"; it is a written plural for people and some other words, while ـها works for everything.
- Transliterations like *chetour* follow the course scheme (*chetor*), and every example now shows the spoken form next to the written one.
- Numbers with nouns gained the spoken counting word تا (سه تا کِتاب).

The old **60 words** are in content/drill-words.ts, checked (بَچّه *bachche*, مَدْرِسه *madrese*, چای *chây*, کوچَک said *kuchik* in Tehran) and tagged with the old categories as dictionary topics.

## Owner decisions (2026-09-29)

- **Diphthong transliteration:** *nowruz* (the *ow* diphthong is kept).
- **The o-spelling و:** primers don't write تُو / دُو with a pish, so that pish is authoring-only and never displayed.
- **Unconfirmed forms:**
  - Tehrani خونه‌ش (*khunash*?) and similar contracted possessives are unconfirmed and stay out of lessons.
  - The 6.1 Dari note (را said *ra* / typed ره in Kabul, reduced to *-a*, recipients with را) couldn't be confirmed and was removed.
