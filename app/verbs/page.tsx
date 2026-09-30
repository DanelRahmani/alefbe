import type { Metadata } from "next";
import Link from "next/link";
import { FaText } from "@/components/FaText";
import { VerbTrainer } from "@/components/verbs/VerbTrainer";
import { VERBS } from "@/content/verbs";
import { PERSONS, PERSON_EN, PRONOUNS, table, type Verb } from "@/lib/conjugate";

export const metadata: Metadata = {
  title: "Verb trainer",
  description: "Conjugate the 25 core Persian verbs in the present, spoken and written, with spaced repetition and typed answers.",
};

function VerbTable({ verb, negative }: { verb: Verb; negative: boolean }) {
  const spoken = table(verb, "present", "spoken", negative, VERBS);
  const written = table(verb, "present", "written", negative, VERBS);
  return (
    <div className="table-wrap">
      <table className="lesson-table">
        <caption>{negative ? "Present, negative" : "Present"}</caption>
        <thead>
          <tr>
            <th scope="col">Who</th>
            <th scope="col">Spoken</th>
            <th scope="col">Written</th>
          </tr>
        </thead>
        <tbody>
          {PERSONS.map((p, i) => (
            <tr key={p}>
              <th scope="row" className="has-fa">
                {PERSON_EN[p]} <FaText text={PRONOUNS[p].written} translit="none" />
              </th>
              <td className="has-fa">
                <FaText text={spoken[i]} />
              </td>
              <td className="has-fa">
                <FaText text={written[i]} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function VerbsPage() {
  return (
    <>
      <nav aria-label="Breadcrumb" className="ui breadcrumb">
        <Link href="/practice">Practice</Link>
        <span aria-hidden="true"> / </span>
        <span>Verb trainer</span>
      </nav>
      <h1 className="page-title mt-2">Verb trainer</h1>
      <p className="page-lede">
        Each review shows a verb, a person, and whether to answer in spoken or written Persian; you type the form. A verb
        comes back just before you would forget it. The verbs open five at a time, starting with the ten most common (
        <Link href="/learn/present/ten-verbs" className="hl underline underline-offset-4">
          lesson 5.3
        </Link>
        ).
      </p>

      <div className="mt-6">
        <VerbTrainer />
      </div>

      <h2 className="lesson-h2 mt-10">The verbs</h2>
      <p className="ui mt-1 text-sm text-muted">Every form the trainer asks, spoken and written. Open a verb to see its tables.</p>
      <div className="verb-list mt-4">
        {VERBS.map((v) => (
          <details key={v.id} className="verb-details">
            <summary className="has-fa">
              <FaText text={v.inf} translit="inline" /> <span className="ui text-muted">{v.en}</span>
            </summary>
            <VerbTable verb={v} negative={false} />
            <VerbTable verb={v} negative />
          </details>
        ))}
      </div>
    </>
  );
}
