import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { LessonRenderer } from "@/components/lesson/LessonRenderer";
import { MarkDone } from "@/components/MarkDone";
import { Rich, hasFa } from "@/components/Rich";
import { ALL_LESSONS, faNumber, findLesson } from "@/content/units";
import { KIND_LABELS, REGISTER_LABELS } from "@/content/types";
import { plainOf, parseMarkup } from "@/lib/markup";

export const dynamicParams = false;

export function generateStaticParams() {
  return ALL_LESSONS.map((r) => ({ unit: r.unit.slug, lesson: r.lesson.slug }));
}

export async function generateMetadata({ params }: PageProps<"/learn/[unit]/[lesson]">): Promise<Metadata> {
  const { unit, lesson } = await params;
  const ref = findLesson(unit, lesson);
  if (!ref) return {};
  return { title: `${ref.number} ${plainOf(parseMarkup(ref.lesson.title))}`, description: ref.lesson.summary };
}

export default async function LessonPage({ params }: PageProps<"/learn/[unit]/[lesson]">) {
  const { unit, lesson } = await params;
  const ref = findLesson(unit, lesson);
  if (!ref) notFound();
  const { lesson: l } = ref;
  const i = ALL_LESSONS.indexOf(ref);
  const prev = ALL_LESSONS[i - 1];
  const next = ALL_LESSONS[i + 1];

  return (
    <article className="lesson">
      <nav aria-label="Breadcrumb" className="ui breadcrumb">
        <Link href="/">Path</Link>
        <span aria-hidden="true"> / </span>
        <span className="has-fa">
          Unit {ref.unitIndex}: <Rich text={ref.unit.title} translit={false} />
        </span>
      </nav>

      <header className="lesson-head">
        <p className="ui lesson-num">
          <span>{ref.number}</span>
          <span className="fa" lang="fa">
            {faNumber(ref.number)}
          </span>
        </p>
        <h1 className="lesson-title">
          <Rich text={l.title} translit={false} />
        </h1>
        <p className={hasFa(l.summary) ? "lesson-summary has-fa" : "lesson-summary"}>
          <Rich text={l.summary} />
        </p>
        <p className="ui lesson-meta">
          <span className="meta-tag">{REGISTER_LABELS[l.register]}</span>
          {l.kinds.map((k) => (
            <span key={k} className="meta-tag meta-tag-quiet">
              {KIND_LABELS[k]}
            </span>
          ))}
        </p>
      </header>

      <LessonRenderer blocks={l.blocks} ctx={{ register: l.register, alwaysTranslit: l.showTranslit }} />

      <section className="finish" aria-label="Finish the lesson">
        <MarkDone lessonKey={ref.key} />
      </section>

      <p className="source">
        <span className="ui eyebrow">Checked against</span> <Rich text={l.source} translit={false} />
      </p>

      <nav aria-label="Lessons" className="ui lesson-nav">
        {prev ? (
          <Link href={prev.href} className="has-fa">
            ← {prev.number} <Rich text={prev.lesson.title} translit={false} />
          </Link>
        ) : (
          <span />
        )}
        {next && (
          <Link href={next.href} className="has-fa text-right">
            {next.number} <Rich text={next.lesson.title} translit={false} /> →
          </Link>
        )}
      </nav>
    </article>
  );
}
