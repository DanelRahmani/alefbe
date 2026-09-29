import { PathBrowser, type PathUnit } from "@/components/PathBrowser";
import { FaText } from "@/components/FaText";
import { UNITS, faNumber } from "@/content/units";
import { splitScript } from "@/lib/markup";

/** A lesson's mark: the first Persian run in its title, else the unit's Persian title. */
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
    mark: markOf(l.title, u.titleFa),
    unitTitle: u.title,
  })),
}));

export default function Home() {
  return (
    <>
      <section className="hero">
        <p className="hero-fa naskh" aria-hidden="true">
          <FaText text="اَلِفْبا" translit="none" />
        </p>
        <h1 className="hero-title">Iranian Persian, example first.</h1>
        <p className="hero-lede">
          Each lesson shows real sentences, then changes one thing and shows what that changes. Spoken Tehrani sits next
          to written Persian, and the vowel marks can be turned down as your reading grows.
        </p>
      </section>
      <PathBrowser units={units} />
    </>
  );
}
