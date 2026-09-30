"use client";

import { useState } from "react";
import { DRILL_GROUPS } from "@/lib/persian/letters";
import { DEFAULT_SHEET, sheetLetters, sheetTitle, type SheetOptions } from "@/lib/sheets";

const groupLabel = (g: number) =>
  g === DRILL_GROUPS.length - 1 ? "Digits" : `${DRILL_GROUPS[g][0]} – ${DRILL_GROUPS[g][DRILL_GROUPS[g].length - 1]}`;

/** Copies of each glyph after the model: grey ones to trace over, then empty boxes. */
const TRACES = 3;
const BLANKS = 2;

/** Choose letters and forms, preview the sheet, print it. */
export function SheetBuilder() {
  const [opts, setOpts] = useState<SheetOptions>(DEFAULT_SHEET);
  const letters = sheetLetters(opts);
  const toggle = (g: number) =>
    setOpts((o) => ({ ...o, groups: o.groups.includes(g) ? o.groups.filter((x) => x !== g) : [...o.groups, g] }));

  return (
    <>
      <div className="ui sheet-controls" data-no-print>
        <fieldset>
          <legend className="font-medium">Letters</legend>
          <div className="chips chips-wrap">
            {DRILL_GROUPS.map((_, g) => (
              <button key={g} type="button" className="chip" aria-pressed={opts.groups.includes(g)} onClick={() => toggle(g)}>
                <span lang={g === DRILL_GROUPS.length - 1 ? undefined : "fa"}>{groupLabel(g)}</span>
              </button>
            ))}
          </div>
        </fieldset>
        <fieldset>
          <legend className="font-medium">Forms</legend>
          <div className="chips chips-wrap">
            <button type="button" className="chip" aria-pressed={opts.forms === "all"} onClick={() => setOpts((o) => ({ ...o, forms: "all" }))}>
              All joining forms
            </button>
            <button
              type="button"
              className="chip"
              aria-pressed={opts.forms === "isolated"}
              onClick={() => setOpts((o) => ({ ...o, forms: "isolated" }))}
            >
              Letters on their own
            </button>
          </div>
        </fieldset>
        <label className="hide-done">
          <input type="checkbox" checked={opts.words} onChange={(e) => setOpts((o) => ({ ...o, words: e.target.checked }))} />
          Add each letter&apos;s key word
        </label>
        <div className="flex flex-wrap items-center gap-3">
          <button type="button" className="drill-btn" disabled={!letters.length} onClick={() => window.print()}>
            Print
          </button>
          <span className="text-sm text-muted">
            {letters.length ? `${letters.length} ${letters.length === 1 ? "letter" : "letters"}, A4 or Letter paper` : "Choose some letters first."}
          </span>
        </div>
      </div>

      {letters.length > 0 && (
        <section className="sheet" aria-label="Sheet preview">
          <header className="sheet-head">
            <p className="sheet-title">
              Alefbe · tracing sheet · <bdi lang="fa">{sheetTitle(opts)}</bdi>
            </p>
            <p className="sheet-name ui">Name ____________ Date ________</p>
          </header>
          <p className="sheet-how ui">
            Trace the grey letters from right to left, then write your own in the empty boxes.
          </p>
          {letters.map((l) => (
            <div key={l.ch} className="sheet-letter">
              <p className="sheet-label ui">
                <span className="naskh sheet-label-fa" lang="fa">
                  {l.ch}
                </span>{" "}
                {l.name} · <em>{l.sound}</em>
              </p>
              {l.rows.map((r) => (
                <div key={r.glyph} className={r.kind === "word" ? "sheet-row sheet-row-word" : "sheet-row"} dir="rtl">
                  <span className="sheet-cell sheet-model naskh" lang="fa">
                    {r.glyph}
                  </span>
                  {Array.from({ length: r.kind === "word" ? 1 : TRACES }, (_, i) => (
                    <span key={i} className="sheet-cell sheet-trace naskh" lang="fa" aria-hidden="true">
                      {r.glyph}
                    </span>
                  ))}
                  {Array.from({ length: r.kind === "word" ? 1 : BLANKS }, (_, i) => (
                    <span key={`b${i}`} className="sheet-cell" aria-hidden="true" />
                  ))}
                  <span className="sheet-row-label ui" dir="ltr">
                    {r.label}
                  </span>
                </div>
              ))}
            </div>
          ))}
        </section>
      )}
    </>
  );
}
