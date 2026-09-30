import { LegacyHash } from "@/components/LegacyHash";
import { PathBrowser, type PathUnit } from "@/components/PathBrowser";
import { FaText } from "@/components/FaText";
import { OROSI_PATTERN } from "@/components/Orosi";
import type { DayWord } from "@/components/TodayCard";
import { DICTIONARY } from "@/content/dictionary";
import { UNITS, faNumber } from "@/content/units";
import { splitScript } from "@/lib/markup";

/** A lesson's mark: the first Persian run in its title, else its number in Persian digits. */
const markOf = (title: string, fallback: string) => splitScript(title).find((r) => r.fa)?.s ?? fallback;

// Only what the path needs goes to the browser, not whole lessons.
const units: PathUnit[] = UNITS.map((u, i) => ({
  slug: u.slug,
  number: i,
  numberFa: faNumber(String(i)),
  title: u.title,
  titleFa: u.titleFa,
  description: u.description,
  lessons: u.lessons.map((l, j) => ({
    key: `${u.slug}/${l.slug}`,
    href: `/learn/${u.slug}/${l.slug}`,
    number: `${i}.${j + 1}`,
    numberFa: faNumber(`${i}.${j + 1}`),
    title: l.title,
    summary: l.summary,
    kinds: l.kinds,
    mark: markOf(l.title, faNumber(`${i}.${j + 1}`)),
    unitTitle: u.title,
  })),
}));

// The word of the day is picked in the browser, by its date, from these.
const words: DayWord[] = DICTIONARY.map((e) => ({ fa: e.fa, en: e.en, id: e.id }));

export default function Home() {
  return (
    <>
      <section className="hero">
        {/* An arched orosi window: the stained-glass lattice with a frosted pane. */}
        <div className="hero-window" aria-hidden="true">
          <svg className="hero-glass" focusable="false">
            <rect width="100%" height="100%" fill={`url(#${OROSI_PATTERN})`} />
          </svg>
          <svg className="hero-frame" viewBox="0 0 100 125" preserveAspectRatio="none" focusable="false">
            <path d="M0 125V52C0 26 30 12 50 0c20 12 50 26 50 52v73z" vectorEffect="non-scaling-stroke" />
          </svg>
          <p className="hero-pane glass naskh">
            <FaText text="اَلِفْبا" translit="none" />
          </p>
        </div>
        <div>
          <p className="ui eyebrow">A course in Iranian Persian</p>
          <h1 className="hero-title">Persian, example first.</h1>
          <p className="hero-lede">
            Each lesson shows real sentences, then changes one thing and shows what that changes. Spoken Tehrani sits
            beside written Persian, and the vowel marks fade as your reading grows.
          </p>
        </div>
      </section>
      <PathBrowser units={units} words={words} />
      <LegacyHash />
    </>
  );
}
