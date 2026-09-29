import type { Metadata } from "next";
import Link from "next/link";
import { DrillOverview } from "@/components/drill/DrillOverview";
import { DIGITS, LETTERS, formOf } from "@/lib/persian/letters";

export const metadata: Metadata = {
  title: "The script",
  description: "The 32 letters of the Persian alphabet with their joining forms, and a typed spaced-repetition trainer.",
};

export default function ScriptPage() {
  return (
    <>
      <section className="page-head">
        <p className="ui eyebrow">The script</p>
        <h1 className="page-title">Letters and the trainer</h1>
        <p className="page-lede">
          Persian is written right to left in 32 letters. Most letters join the next one and change shape with their
          position; seven never join forward. The trainer opens the letters group by group, in alphabet order, as you
          learn them.
        </p>
      </section>

      <h2 className="lesson-h2 mt-8">Trainer</h2>
      <DrillOverview />

      <Link href="/script/trace" className="next-card mt-4">
        <span className="next-mark naskh" aria-hidden="true">
          ب
        </span>
        <span className="next-text">
          <span className="ui eyebrow">Tracing</span>
          <span className="next-title">Trace the letters</span>
          <span className="next-summary">Write each letter in all its forms along a guided path, then from memory.</span>
        </span>
        <span className="next-arrow" aria-hidden="true">
          →
        </span>
      </Link>

      <h2 className="lesson-h2 mt-12">The alphabet</h2>
      <p className="ui mt-1 text-sm text-muted">Isolated form large (Naskh book style), then initial, medial and final.</p>
      <ol className="letter-chart">
        {LETTERS.map((l) => (
          <li key={l.ch} className="letter-card">
            <span className="letter-big naskh" lang="fa" dir="rtl">
              {l.ch}
            </span>
            <span className="letter-forms fa" lang="fa" dir="rtl" aria-label="initial, medial and final forms">
              {formOf(l, "initial")} {formOf(l, "medial")} {formOf(l, "final")}
            </span>
            <span className="ui letter-name">
              {l.name} <span className="text-muted">· {l.sounds.join(" / ")}</span>
            </span>
            {!l.joins && <span className="ui letter-tag">never joins forward</span>}
            {l.persianOnly && <span className="ui letter-tag">Persian letter</span>}
          </li>
        ))}
      </ol>

      <h2 className="lesson-h2 mt-12">Digits</h2>
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
