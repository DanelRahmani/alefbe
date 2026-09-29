import type { Metadata } from "next";
import Link from "next/link";
import { FaText } from "@/components/FaText";
import { Rich } from "@/components/Rich";
import { LetterChart } from "@/components/script/LetterChart";
import { MARKS, SIGNS } from "@/content/reference";
import { ALL_LESSONS } from "@/content/units";
import { DIGITS } from "@/lib/persian/letters";
import { ZWNJ } from "@/lib/persian/chars";

export const metadata: Metadata = {
  title: "The script",
  description: "The 32 letters of the Persian alphabet with their joining forms, the vowel marks and signs, and the digits.",
};

const lessonHref = (key?: string) => ALL_LESSONS.find((r) => r.key === key)?.href;

export default function ScriptPage() {
  return (
    <>
      <section className="page-head">
        <p className="ui eyebrow">The script</p>
        <h1 className="page-title">Letters, marks and digits</h1>
        <p className="page-lede">
          Persian is written right to left in 32 letters. Most letters join the next one and change shape with their
          position; seven never join forward. Tap a letter for its forms, real words that use it, and your progress.
        </p>
      </section>

      <div className="ui quick-links">
        <Link href="/practice/drill/sound" className="pill-link">
          Letter trainer <span aria-hidden="true">→</span>
        </Link>
        <Link href="/practice/quiz" className="pill-link">
          Quick quiz <span aria-hidden="true">→</span>
        </Link>
        <Link href="/practice/trace" className="pill-link">
          Tracing <span aria-hidden="true">→</span>
        </Link>
      </div>

      <h2 className="lesson-h2 mt-10">The alphabet</h2>
      <p className="ui mt-1 text-sm text-muted">Each letter large in book style (Naskh), then its initial, medial and final forms.</p>
      <LetterChart />

      <h2 id="marks" className="lesson-h2 mt-12">
        Vowel marks
      </h2>
      <p className="ui mt-1 text-sm text-muted">
        Written above or below a letter. Everyday Persian leaves most of them out; this course shows them until you are
        ready to read without.
      </p>
      <div className="table-wrap">
        <table className="lesson-table marks-table">
          <thead>
            <tr>
              <th scope="col">Mark</th>
              <th scope="col">Name</th>
              <th scope="col">What it does</th>
              <th scope="col">Example</th>
            </tr>
          </thead>
          <tbody>
            {MARKS.map((m) => {
              const href = lessonHref(m.lesson);
              return (
                <tr key={m.name}>
                  <td className="naskh mark-sign" lang="fa" dir="rtl">
                    {m.sign}
                  </td>
                  <td className="has-fa">
                    {href ? (
                      <Link href={href} className="underline underline-offset-4">
                        {m.name}
                      </Link>
                    ) : (
                      m.name
                    )}
                    <br />
                    <FaText text={m.fa} translit="none" />
                  </td>
                  <td>
                    <Rich text={m.does} />
                  </td>
                  <td className="has-fa">
                    <FaText text={m.example} translit="block" alwaysTranslit />
                    <span className="text-sm text-muted">{m.en}</span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <h2 id="signs" className="lesson-h2 mt-12">
        Signs and punctuation
      </h2>
      <div className="table-wrap">
        <table className="lesson-table">
          <thead>
            <tr>
              <th scope="col">Sign</th>
              <th scope="col">Name</th>
              <th scope="col">Use</th>
            </tr>
          </thead>
          <tbody>
            {SIGNS.map((s) => (
              <tr key={s.name}>
                <td className="fa mark-sign" lang="fa" dir="rtl">
                  {s.sign === ZWNJ ? <span className="zwnj-sign">می‌</span> : s.sign}
                </td>
                <td>{s.name}</td>
                <td className="has-fa">
                  <Rich text={s.does} translit={false} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2 className="lesson-h2 mt-12">Digits</h2>
      <p className="ui mt-1 text-sm text-muted">Persian digits are written left to right, like Western ones: ۱۴۰۵ is 1405.</p>
      <ol className="digit-row">
        {DIGITS.map((d) => (
          <li key={d.ch} className="digit-card">
            <span className="fa text-3xl" lang="fa">
              {d.ch}
            </span>
            <span className="ui text-sm">
              {d.value} · {d.name}
            </span>
          </li>
        ))}
      </ol>
    </>
  );
}
