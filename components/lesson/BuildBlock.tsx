import { formGlyph, formsInWord } from "@/lib/persian/letters";
import { FaText } from "../FaText";

/** Words built letter by letter: the separate letters, the form each takes in the word, and the word itself. */
export function BuildBlock({ items }: { items: { word: string; en: string }[] }) {
  return (
    <ul className="build-list">
      {items.map((it) => {
        const parts = formsInWord(it.word.replace(/[{}*]/g, ""));
        return (
          <li key={it.word} className="build">
            <p className="build-letters naskh" lang="fa" dir="rtl" aria-label="The letters, separately">
              {parts.map((p, i) => (
                <span key={i}>
                  {i > 0 && (
                    <span className="build-plus" aria-hidden="true">
                      +
                    </span>
                  )}
                  {p.ch}
                </span>
              ))}
            </p>
            <p className="build-forms naskh" lang="fa" dir="rtl" aria-label="The form each letter takes in the word">
              {parts.map((p, i) => (
                <span key={i} className="build-form">
                  {formGlyph(p.ch, p.form)}
                </span>
              ))}
            </p>
            <p className="build-word has-fa">
              <FaText text={it.word} alwaysTranslit className="naskh" />
              <span className="ui text-sm text-muted">{it.en}</span>
            </p>
          </li>
        );
      })}
    </ul>
  );
}
