import type { Metadata } from "next";
import { Suspense } from "react";
import { DictionaryBrowser } from "@/components/DictionaryBrowser";
import { DictionaryFromQuery } from "@/components/DictionaryFromQuery";
import { DICTIONARY } from "@/content/dictionary";
import { UNITS } from "@/content/units";

export const metadata: Metadata = {
  title: "Dictionary",
  description: "Every word in the Alefbe course, fully vowel-marked, with transliteration, meaning and the lesson that teaches it.",
};

const units = UNITS.map((u, i) => ({ slug: u.slug, label: `Unit ${i}: ${u.title}` })).filter((u) =>
  DICTIONARY.some((e) => e.lessons.some((l) => l.unit === u.slug)),
);

export default function DictionaryPage() {
  return (
    <>
      <section className="page-head">
        <p className="ui eyebrow">Words</p>
        <h1 className="page-title">Dictionary</h1>
        <p className="page-lede">
          Every word in the course, in Persian alphabet order. Search in Persian (with or without vowel marks), in
          transliteration (<em>ab</em> finds <em>âb</em>) or in English.
        </p>
      </section>
      <Suspense fallback={<DictionaryBrowser entries={DICTIONARY} units={units} />}>
        <DictionaryFromQuery entries={DICTIONARY} units={units} />
      </Suspense>
    </>
  );
}
