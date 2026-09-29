import Link from "next/link";
import { FORM_LABELS, formOf, formsInWord, formsOf, highlightLetter, letterByChar } from "@/lib/persian/letters";
import { FaText } from "../FaText";
import { Rich } from "../Rich";

/** Letter cards inside a lesson: the letter large, its forms, its sound and a key word. */
export function LetterCards({ chars }: { chars: string[] }) {
  return (
    <ul className="lesson-letters">
      {chars.map((ch) => {
        const l = letterByChar.get(ch)!;
        const hit = formsInWord(l.key.fa).find((x) => x.ch === ch);
        return (
          <li key={ch} className="lesson-letter">
            <div className="lesson-letter-top">
              <span className="lesson-letter-big naskh" lang="fa" dir="rtl">
                {ch}
              </span>
              <div className="ui">
                <p className="font-semibold">
                  {l.name} <span className="text-muted">· {l.sounds.join(" / ")}</span>
                </p>
                <p className="text-sm">
                  <Rich text={l.hint} />
                </p>
              </div>
            </div>
            <ol className="lesson-letter-forms" aria-label={`${l.name}: its forms`}>
              {formsOf(l).map((f) => (
                <li key={f}>
                  <span className="naskh" lang="fa" dir="rtl">
                    {formOf(l, f)}
                  </span>
                  <span className="ui">{FORM_LABELS[f].toLowerCase()}</span>
                </li>
              ))}
            </ol>
            <p className="has-fa lesson-letter-key">
              <FaText text={hit ? highlightLetter(l.key.fa, hit) : l.key.fa} translit="inline" alwaysTranslit className="text-xl" />{" "}
              <span className="ui text-sm text-muted">{l.key.en}</span>
            </p>
            <p className="ui text-sm lesson-letter-links">
              <Link href={`/script/${l.slug}`}>More about {l.name}</Link>
              <Link href={`/practice/trace?letter=${l.slug}`}>Trace it</Link>
            </p>
          </li>
        );
      })}
    </ul>
  );
}
