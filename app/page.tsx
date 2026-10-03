import { LegacyHash } from "@/components/LegacyHash";
import { PathBrowser, type PathUnit } from "@/components/PathBrowser";
import { FaText } from "@/components/FaText";
import { Rich } from "@/components/Rich";
import { splitScript } from "@/lib/markup";
import { OROSI_PATTERN } from "@/components/Orosi";
import { UNITS, faNumber } from "@/content/units";

// Only what the path needs goes to the browser, not whole lessons.
const units: PathUnit[] = UNITS.map((u, i) => ({
  slug: u.slug,
  number: i,
  numberFa: faNumber(String(i)),
  title: <Rich text={u.title} translit={false} />,
  titleFa: <FaText text={u.titleFa} translit="none" force="none" />,
  description: <Rich text={u.description} translit={false} />,
  lessons: u.lessons.map((l, j) => ({
    key: `${u.slug}/${l.slug}`,
    number: `${i}.${j + 1}`,
    title: <Rich text={l.title} translit={false} />,
    summary: <Rich text={l.summary} translit={false} />,
    mark: <FaText text={splitScript(l.title).find((r) => r.fa)?.s ?? faNumber(`${i}.${j + 1}`)} translit="none" force="none" />,
    kinds: l.kinds,
  })),
}));


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
          <p className="hero-pane display-fa">
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
      <PathBrowser units={units} />
      <LegacyHash />
    </>
  );
}
