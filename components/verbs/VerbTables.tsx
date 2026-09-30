"use client";

import { useState } from "react";
import { VERBS } from "@/content/verbs";
import { PERSON_EN, PRONOUNS, TENSES, lacks, personsOf, stylesOf, table, tenseInfo, type Tense, type Verb } from "@/lib/conjugate";
import { FaText } from "../FaText";
import { Rich } from "../Rich";

function VerbTable({ verb, tense, negative }: { verb: Verb; tense: Tense; negative: boolean }) {
  const title = tenseInfo(tense).title;
  const why = lacks(verb, tense, negative, VERBS);
  if (why) {
    return (
      <p className="ui verb-none">
        <span className="font-medium">{negative ? `${title}, negative` : title}: none.</span> <Rich text={why} translit={false} />
      </p>
    );
  }
  // A tense may have one style only (the written future) and fewer persons (a command).
  const columns = stylesOf(tense).map((style) => ({ style, forms: table(verb, tense, style, negative, VERBS) }));
  return (
    <div className="table-wrap">
      <table className="lesson-table">
        <caption>{negative ? `${title}, negative` : title}</caption>
        <thead>
          <tr>
            <th scope="col">Who</th>
            {columns.map((c) => (
              <th key={c.style} scope="col">
                {c.style === "spoken" ? "Spoken" : "Written"}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {personsOf(tense).map((p, i) => (
            <tr key={p}>
              <th scope="row" className="has-fa">
                {PERSON_EN[p]} <FaText text={PRONOUNS[p].written} translit="none" />
              </th>
              {columns.map((c) => (
                <td key={c.style} className="has-fa">
                  <FaText text={c.forms[i]} />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/** Every form the trainer asks, one tense at a time: a collapsible pair of tables per verb. */
export function VerbTables() {
  const [tense, setTense] = useState<Tense>("present");
  const info = tenseInfo(tense);
  return (
    <>
      <div className="ui chips chips-wrap mt-4" role="group" aria-label="Tense of the tables">
        {TENSES.map((t) => (
          <button key={t.id} type="button" className="chip" aria-pressed={tense === t.id} onClick={() => setTense(t.id)}>
            {t.title}
          </button>
        ))}
      </div>
      <p className="ui verb-says">
        {info.title}: <em>{info.says}</em>
      </p>
      {info.note && (
        <p className="ui verb-note">
          <Rich text={info.note} translit={false} />
        </p>
      )}
      <div className="verb-list mt-4">
        {VERBS.map((v) => {
          // A verb with no such tense at all says so once; the negative alone is noted under the table.
          const none = lacks(v, tense, false, VERBS);
          return (
            <details key={v.id} className="verb-details">
              <summary className="has-fa">
                <FaText text={v.inf} translit="inline" /> <span className="ui text-muted">{v.en}</span>
                {none && <span className="ui verb-none-tag">no {tenseInfo(tense).title.toLowerCase()}</span>}
              </summary>
              <VerbTable verb={v} tense={tense} negative={false} />
              {!none && <VerbTable verb={v} tense={tense} negative />}
            </details>
          );
        })}
      </div>
    </>
  );
}
