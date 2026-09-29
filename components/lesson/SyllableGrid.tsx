import { SYLLABLE_VOWELS, syllable, syllableSound, type SyllableVowel } from "@/lib/persian/letters";
import { FaText } from "../FaText";
import { Rich } from "../Rich";

/** Consonants down the side, vowels across the top: every syllable fully marked, with its sound. */
export function SyllableGrid({ consonants, vowels, caption }: { consonants: string[]; vowels: SyllableVowel[]; caption?: string }) {
  const cols = SYLLABLE_VOWELS.filter((v) => vowels.includes(v.v));
  return (
    <div className="table-wrap">
      <table className="lesson-table syllable-grid">
        {caption && (
          <caption>
            <Rich text={caption} />
          </caption>
        )}
        <thead>
          <tr>
            <th scope="col">
              <span className="sr-only">Letter</span>
            </th>
            {cols.map((c) => (
              <th key={c.v} scope="col">
                <span className="syllable-vowel">{c.label}</span>
                <span className="syllable-how">{c.how}</span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {consonants.map((k) => (
            <tr key={k}>
              <th scope="row" className="naskh syllable-letter" lang="fa">
                {k}
              </th>
              {cols.map((c) => (
                <td key={c.v}>
                  <FaText text={syllable(k, c.v)} translit="none" force="all" className="naskh syllable-fa" />
                  <span className="syllable-sound" lang="fa-Latn">
                    {syllableSound(k, c.v)}
                  </span>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
