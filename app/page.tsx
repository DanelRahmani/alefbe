import { PathBrowser, type PathUnit } from "@/components/PathBrowser";
import { FaText } from "@/components/FaText";
import { UNITS, faNumber } from "@/content/units";

// Only what the path needs goes to the browser, not whole lessons.
const units: PathUnit[] = UNITS.map((u, i) => ({
  slug: u.slug,
  number: i,
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
