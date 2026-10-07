import type { Metadata } from "next";
import { Suspense } from "react";
import { DictionaryBrowser } from "@/components/DictionaryBrowser";
import { DictionaryFromQuery } from "@/components/DictionaryFromQuery";
import { WordInspector } from "@/components/WordInspector";
import { DICTIONARY } from "@/content/dictionary";
import { dictionaryData } from "@/content/static-data";
import { TOPIC_LABELS, type Topic } from "@/content/topics";
import { UNITS } from "@/content/units";

export const metadata: Metadata = {
  title: "Dictionary",
  description: "Every word in the Alefbe course, fully vowel-marked, with transliteration, meaning and the lesson that teaches it.",
};

const units = UNITS.map((u, i) => ({ slug: u.slug, label: `Unit ${i}: ${u.title}` })).filter((u) =>
  DICTIONARY.some((e) => e.lessons.some((l) => l.unit === u.slug)),
);

// The first entries are drawn in the HTML; the rest come from /data/dictionary.json.
const HEAD = 40;
const list = {
  head: dictionaryData().slice(0, HEAD),
  total: DICTIONARY.length,
  topics: (Object.keys(TOPIC_LABELS) as Topic[]).filter((t) => DICTIONARY.some((e) => e.topic === t)),
  initials: [...new Set(DICTIONARY.map((e) => e.initial))],
  units,
};

export default function DictionaryPage() {
  return (
    <>
      <section className="page-head">
        <h1 className="page-title">Dictionary</h1>
        <p className="page-lede">
          Every word in the course, in Persian alphabet order. Search in Persian (with or without vowel marks), in
          transliteration (<em>ab</em> finds <em>âb</em>) or in English.
        </p>
        <p className="page-lede text-sm text-muted">
          Beyond the lessons, common words were chosen from a frequency list of film subtitles,{" "}
          <a href="https://github.com/hermitdave/FrequencyWords" className="underline underline-offset-4">
            FrequencyWords
          </a>{" "}
          by Hermit Dave (from OpenSubtitles 2018,{" "}
          <a href="https://creativecommons.org/licenses/by-sa/4.0/" className="underline underline-offset-4">
            CC BY-SA 4.0
          </a>
          ). Their vowel marks, spoken forms and meanings are the course&apos;s own.
        </p>
      </section>
      <div data-inspect>
        <Suspense fallback={<DictionaryBrowser {...list} />}>
          <DictionaryFromQuery {...list} />
        </Suspense>
      </div>
      <WordInspector />
    </>
  );
}
