// Maps lesson blocks (data) to components. Server-rendered except the quiz.

import Link from "next/link";
import type { Block, Example, Register } from "@/content/types";
import { FaText } from "../FaText";
import { Rich, hasFa } from "../Rich";
import { LetterCards } from "./LetterCards";
import { Quiz } from "./Quiz";

interface Ctx {
  register: Register;
  alwaysTranslit?: boolean;
}

function P({ text, className = "" }: { text: string; className?: string }) {
  return (
    <p className={`${hasFa(text) ? "has-fa " : ""}${className}`}>
      <Rich text={text} />
    </p>
  );
}

function ExampleCard({ e, ctx, label }: { e: Example; ctx: Ctx; label?: string }) {
  const both = ctx.register === "both" && e.written;
  return (
    <div className="example">
      {label && <span className="ui example-label">{label}</span>}
      <div className="example-fa">
        {both && <span className="ui register-tag">Spoken</span>}
        <FaText text={e.fa} alwaysTranslit={ctx.alwaysTranslit} />
      </div>
      {both && (
        <div className="example-written">
          <span className="ui register-tag">Written</span>
          <FaText text={e.written!} alwaysTranslit={ctx.alwaysTranslit} />
        </div>
      )}
      <P text={e.en} className="example-en" />
      {e.note && <P text={e.note} className="example-note" />}
    </div>
  );
}

function MistakeLine({ e, ok, ctx }: { e: Example; ok: boolean; ctx: Ctx }) {
  const both = ctx.register === "both" && e.written;
  return (
    <div className={ok ? "right" : "wrong"}>
      <span className="ui mark-tag">{ok ? "✓ Right" : "✗ Wrong"}</span>
      <div className="example-fa">
        {both && <span className="ui register-tag">Spoken</span>}
        <FaText text={e.fa} alwaysTranslit={ctx.alwaysTranslit} />
      </div>
      {both && (
        <div className="example-written">
          <span className="ui register-tag">Written</span>
          <FaText text={e.written!} alwaysTranslit={ctx.alwaysTranslit} />
        </div>
      )}
      <P text={e.en} className="example-en" />
    </div>
  );
}

const CALLOUT_LABEL ={ mistake: "Common mistake", culture: "Culture", tip: "Note", dari: "In Dari" };

function BlockView({ b, ctx }: { b: Block; ctx: Ctx }) {
  switch (b.type) {
    case "idea":
      return (
        <div className="idea jadval">
          <span className="ui eyebrow">The idea</span>
          <P text={b.text} className="idea-text" />
        </div>
      );
    case "heading":
      return (
        <h2 className="lesson-h2">
          <Rich text={b.text} translit={false} />
        </h2>
      );
    case "text":
      return <P text={b.text} className="lesson-text" />;
    case "examples":
      return (
        <div className="examples">
          {b.items.map((e, i) => (
            <ExampleCard key={i} e={e} ctx={ctx} />
          ))}
        </div>
      );
    case "pair":
      return (
        <div className="pair">
          {b.title && (
            <h3 className="pair-title">
              <Rich text={b.title} translit={false} />
            </h3>
          )}
          <div className="pair-grid">
            <ExampleCard e={b.a} ctx={ctx} label="A" />
            <ExampleCard e={b.b} ctx={ctx} label="B" />
          </div>
          <div className="pair-diff">
            <span className="ui eyebrow">What changes</span>
            <P text={b.diff} />
          </div>
        </div>
      );
    case "table":
      return (
        <div className="table-wrap">
          <table className="lesson-table">
            {b.caption && (
              <caption>
                <Rich text={b.caption} />
              </caption>
            )}
            <thead>
              <tr>
                {b.headers.map((h, i) => (
                  <th key={i} scope="col">
                    <Rich text={h} />
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {b.rows.map((row, i) => (
                <tr key={i}>
                  {row.map((c, j) => (
                    <td key={j} className={hasFa(c) ? "has-fa" : undefined}>
                      <Rich text={c} />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    case "callout":
      return (
        <aside className={`callout callout-${b.kind}`}>
          <p className="ui eyebrow">
            {CALLOUT_LABEL[b.kind]}
            {b.kind === "dari" && !b.checked && <span className="draft-tag">Draft: awaiting a Dari speaker&apos;s check</span>}
          </p>
          {b.title && (
            <h3 className="callout-title">
              <Rich text={b.title} translit={false} />
            </h3>
          )}
          <P text={b.text} />
          {(b.wrong || b.right) && (
            <div className="mistake-pair">
              {b.wrong && <MistakeLine e={b.wrong} ok={false} ctx={ctx} />}
              {b.right && <MistakeLine e={b.right} ok ctx={ctx} />}
            </div>
          )}
        </aside>
      );
    case "dialogue":
      return (
        <div className="dialogue">
          {b.title && (
            <h3 className="pair-title">
              <Rich text={b.title} translit={false} />
            </h3>
          )}
          <ol>
            {b.lines.map((l, i) => (
              <li key={i} className="dialogue-line">
                <span className="ui speaker">{l.who}</span>
                <div>
                  <div className="example-fa">
                    <FaText text={l.fa} alwaysTranslit={ctx.alwaysTranslit} />
                  </div>
                  {ctx.register === "both" && l.written && (
                    <div className="example-written">
                      <span className="ui register-tag">Written</span>
                      <FaText text={l.written} alwaysTranslit={ctx.alwaysTranslit} />
                    </div>
                  )}
                  <P text={l.en} className="example-en" />
                </div>
              </li>
            ))}
          </ol>
          {b.note && <P text={b.note} className="dialogue-note" />}
        </div>
      );
    case "link":
      return (
        <p className="lesson-text">
          <Link href={b.href} className="hl underline underline-offset-4">
            {b.label}
          </Link>
          {b.text && (
            <>
              {" "}
              <Rich text={b.text} />
            </>
          )}
        </p>
      );
    case "quiz":
      return <Quiz questions={b.questions} />;
    case "letters":
      return <LetterCards chars={b.chars} />;
  }
}

export function LessonRenderer({ blocks, ctx }: { blocks: Block[]; ctx: Ctx }) {
  return (
    <div className="lesson-body">
      {blocks.map((b, i) => (
        <BlockView key={i} b={b} ctx={ctx} />
      ))}
    </div>
  );
}
