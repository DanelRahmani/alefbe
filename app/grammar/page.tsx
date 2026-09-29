import type { Metadata } from "next";
import Link from "next/link";
import { LessonRenderer } from "@/components/lesson/LessonRenderer";
import { GRAMMAR } from "@/content/grammar";
import { ALL_LESSONS, UNITS } from "@/content/units";

export const metadata: Metadata = {
  title: "Grammar overview",
  description: "The core of Persian grammar on one page, spoken and written side by side, each point linked to its full lesson.",
};

export default function GrammarPage() {
  return (
    <>
      <section className="page-head">
        <p className="ui eyebrow">Grammar</p>
        <h1 className="page-title">Grammar at a glance</h1>
        <p className="page-lede">
          The core of Persian grammar on one page, in the order the course teaches it: spoken Tehrani first, written
          Persian beneath. Each point links to its full lesson.
        </p>
      </section>

      <nav aria-label="Topics" className="ui chips chips-wrap grammar-toc">
        {GRAMMAR.map((t) => (
          <a key={t.slug} href={`#${t.slug}`} className="chip">
            {t.title}
          </a>
        ))}
      </nav>

      <div className="grammar-topics">
        {GRAMMAR.map((t) => {
          const ref = t.lesson ? ALL_LESSONS.find((r) => r.key === t.lesson) : undefined;
          const unitIndex = UNITS.findIndex((u) => u.slug === t.unit);
          const unit = UNITS[unitIndex];
          return (
            <section key={t.slug} id={t.slug} className="grammar-topic" aria-labelledby={`${t.slug}-title`}>
              <h2 id={`${t.slug}-title`} className="lesson-h2">
                {t.title}
              </h2>
              <LessonRenderer blocks={t.blocks} ctx={{ register: "both" }} />
              <p className="ui grammar-more">
                {ref ? (
                  <Link href={ref.href} className="pill-link">
                    Full lesson {ref.number}: {ref.lesson.title} <span aria-hidden="true">→</span>
                  </Link>
                ) : (
                  <span className="text-sm text-muted">
                    Full lessons in Unit {unitIndex}: {unit.title} (coming soon).
                  </span>
                )}
              </p>
            </section>
          );
        })}
      </div>
    </>
  );
}
