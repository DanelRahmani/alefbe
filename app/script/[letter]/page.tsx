import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { FaText } from "@/components/FaText";
import { Rich } from "@/components/Rich";
import { LetterProgress } from "@/components/script/LetterProgress";
import { ALL_LESSONS } from "@/content/units";
import { WORD_CARDS } from "@/lib/drill";
import {
  FORM_LABELS,
  LETTERS,
  formOf,
  formsInWord,
  formsOf,
  highlightLetter,
  letterByChar,
  letterBySlug,
  sameSoundAs,
  type Form,
} from "@/lib/persian/letters";

export const dynamicParams = false;

export function generateStaticParams() {
  return LETTERS.map((l) => ({ letter: l.slug }));
}

export async function generateMetadata({ params }: PageProps<"/script/[letter]">): Promise<Metadata> {
  const l = letterBySlug.get((await params).letter);
  return l ? { title: `${l.ch} ${l.name}`, description: `The Persian letter ${l.name} (${l.ch}): its sound, its four forms and words that use it.` } : {};
}

const FORM_NOTE: Record<Form, string> = {
  isolated: "on its own",
  initial: "at the start, joined to the next letter",
  medial: "in the middle, joined on both sides",
  final: "at the end, joined to the letter before",
};

/** Up to `n` trainer words with the letter in the given form (alef also matches آ). */
function wordsWith(ch: string, form: Form, n: number) {
  const out: { fa: string; en: string; translit: string }[] = [];
  for (const w of WORD_CARDS) {
    const hit = formsInWord(w.fa).find((x) => (x.ch === ch || (ch === "ا" && x.ch === "آ")) && x.form === form);
    if (hit) out.push({ fa: highlightLetter(w.fa, hit), en: w.en, translit: w.translit });
    if (out.length >= n) break;
  }
  return out;
}

export default async function LetterPage({ params }: PageProps<"/script/[letter]">) {
  const l = letterBySlug.get((await params).letter);
  if (!l) notFound();
  const i = LETTERS.indexOf(l);
  const prev = LETTERS[i - 1];
  const next = LETTERS[i + 1];
  const forms = formsOf(l);
  const same = sameSoundAs(l.ch).map((c) => letterByChar.get(c)!);
  const keyHit = formsInWord(l.key.fa).find((x) => x.ch === l.ch);
  const lesson = ALL_LESSONS.find((r) => r.lesson.blocks.some((b) => b.type === "letters" && b.chars.includes(l.ch)));

  return (
    <>
      <nav aria-label="Breadcrumb" className="ui breadcrumb">
        <Link href="/script">Script</Link>
        <span aria-hidden="true"> / </span>
        <span>{l.name}</span>
      </nav>

      <header className="letter-head">
        <p className="letter-hero naskh" lang="fa" dir="rtl">
          {l.ch}
        </p>
        <div>
          <h1 className="page-title">{l.name}</h1>
          {l.altNames && <p className="ui text-sm text-muted">also called {l.altNames.join(", ")}</p>}
          <p className="mt-2">
            <strong className="ui">{l.sounds.join(" / ")}</strong>: <Rich text={l.hint} />.
          </p>
          <p className="ui mt-2 flex flex-wrap gap-2">
            {!l.joins && <span className="meta-tag">never joins forward</span>}
            {l.persianOnly && <span className="meta-tag">Persian letter (not in Arabic)</span>}
            <span className="meta-tag meta-tag-quiet">letter {i + 1} of 32</span>
          </p>
        </div>
      </header>

      {same.length > 0 && (
        <p className="ui same-sound">
          Same sound as{" "}
          {same.map((s, k) => (
            <span key={s.ch}>
              {k > 0 && (k === same.length - 1 ? " and " : ", ")}
              <Link href={`/script/${s.slug}`} className="underline underline-offset-4">
                <span className="fa" lang="fa">
                  {s.ch}
                </span>{" "}
                {s.name}
              </Link>
            </span>
          ))}
          . Which one a word uses is a matter of spelling (lessons 3.3 to 3.5).
        </p>
      )}

      <h2 className="lesson-h2 mt-8">Its forms</h2>
      <ol className="form-row">
        {forms.map((f) => (
          <li key={f} className="form-card">
            <span className="form-glyph naskh" lang="fa" dir="rtl">
              {formOf(l, f)}
            </span>
            <span className="ui form-label">{FORM_LABELS[f]}</span>
            <span className="ui form-note">{FORM_NOTE[f]}</span>
            <Link href={`/practice/trace?letter=${l.slug}&form=${f}`} className="ui form-trace">
              Trace
            </Link>
          </li>
        ))}
      </ol>
      {!l.joins && (
        <p className="ui mt-2 text-sm text-muted">
          {l.name} never joins the letter after it, so it has no separate initial or medial form: at the start of a word it
          looks isolated, and inside a word it looks final and leaves a small gap after it.
        </p>
      )}

      <h2 className="lesson-h2 mt-10">In words</h2>
      <div className="key-word has-fa">
        <FaText text={keyHit ? highlightLetter(l.key.fa, keyHit) : l.key.fa} translit="block" alwaysTranslit className="text-3xl" />
        <span className="ui text-muted">{l.key.en}</span>
      </div>
      <div className="word-forms">
        {forms.map((f) => {
          const ws = wordsWith(l.ch, f, 3);
          if (!ws.length) return null;
          return (
            <section key={f}>
              <h3 className="ui eyebrow">{FORM_LABELS[f]}</h3>
              <ul>
                {ws.map((w) => (
                  <li key={w.fa} className="has-fa">
                    <FaText text={w.fa} translit="none" className="text-xl" /> <em className="text-muted">{w.translit}</em>{" "}
                    <span className="ui text-sm">{w.en}</span>
                  </li>
                ))}
              </ul>
            </section>
          );
        })}
      </div>

      <h2 className="lesson-h2 mt-10">Your progress</h2>
      <LetterProgress ch={l.ch} slug={l.slug} />
      {lesson && (
        <p className="ui mt-3">
          <Link href={lesson.href} className="pill-link">
            Lesson {lesson.number}: {lesson.lesson.title} <span aria-hidden="true">→</span>
          </Link>
        </p>
      )}

      <nav className="lesson-nav ui" aria-label="Other letters">
        {prev ? (
          <Link href={`/script/${prev.slug}`}>
            <span className="text-sm text-muted">← Previous</span>
            <span>
              <span className="fa" lang="fa">
                {prev.ch}
              </span>{" "}
              {prev.name}
            </span>
          </Link>
        ) : (
          <span />
        )}
        {next && (
          <Link href={`/script/${next.slug}`} className="text-right">
            <span className="text-sm text-muted">Next →</span>
            <span>
              {next.name}{" "}
              <span className="fa" lang="fa">
                {next.ch}
              </span>
            </span>
          </Link>
        )}
      </nav>
    </>
  );
}
