"use client";

import Link from "next/link";
import { LETTERS, formOf, type Letter } from "@/lib/persian/letters";
import { letterMastery, type TraceLevel } from "@/lib/trace";
import { useStore } from "@/lib/storage";
import { deckOf, practiceUiStore, srsStore, traceStore, type ChartFilter } from "@/lib/stores";
import { letterStatus, STATUS_LABEL } from "@/lib/letter-status";

const FILTERS: [ChartFilter, string][] = [
  ["all", "All 32"],
  ["persian", "Persian letters"],
  ["non-joining", "Never join forward"],
  ["to-learn", "Still to learn"],
];

const TRACE_LABEL: Record<TraceLevel, string> = { guided: "traced", outline: "traced in outline", freehand: "written from memory" };

export function LetterChart() {
  const ui = useStore(practiceUiStore);
  const srs = useStore(srsStore);
  const trace = useStore(traceStore);
  const deck = deckOf(srs, "sound");

  const keep = (l: Letter) =>
    ui.chart === "persian"
      ? l.persianOnly
      : ui.chart === "non-joining"
        ? !l.joins
        : ui.chart === "to-learn"
          ? letterStatus(deck, l.ch) !== "learned" && letterStatus(deck, l.ch) !== "solid"
          : true;
  const shown = LETTERS.filter(keep);

  return (
    <>
      <div className="ui chips mt-3" role="group" aria-label="Show letters">
        {FILTERS.map(([id, label]) => (
          <button
            key={id}
            type="button"
            className="chip"
            aria-pressed={ui.chart === id}
            onClick={() => practiceUiStore.set((u) => ({ ...u, chart: id }))}
          >
            {label}
          </button>
        ))}
      </div>
      {shown.length === 0 ? (
        <p className="ui empty-state">Every letter here is learned in the trainer. Choose another filter to see them.</p>
      ) : (
        <ol className="letter-chart">
          {shown.map((l) => {
            const status = letterStatus(deck, l.ch);
            const m = letterMastery(trace, l.ch);
            return (
              <li key={l.ch}>
                <Link href={`/script/${l.slug}`} className={`letter-card status-${status}`}>
                  <span className="letter-big naskh" lang="fa" dir="rtl">
                    {l.ch}
                  </span>
                  <span className="letter-forms fa" lang="fa" dir="rtl" aria-label="initial, medial and final forms">
                    {formOf(l, "initial")} {formOf(l, "medial")} {formOf(l, "final")}
                  </span>
                  <span className="ui letter-name">
                    {l.name} <span className="text-muted">· {l.sounds.join(" / ")}</span>
                  </span>
                  <span className="ui letter-marks">
                    {status !== "new" && <span className={`status-dot status-dot-${status}`} title={STATUS_LABEL[status]} />}
                    <span className="sr-only">
                      Trainer: {STATUS_LABEL[status]}.{m ? ` Tracing: ${TRACE_LABEL[m]}.` : ""}
                    </span>
                    {m && (
                      <span className={`trace-mark trace-${m}`} aria-hidden="true" title={TRACE_LABEL[m]}>
                        ✎
                      </span>
                    )}
                  </span>
                  {!l.joins && <span className="ui letter-tag">never joins forward</span>}
                  {l.persianOnly && <span className="ui letter-tag">Persian letter</span>}
                </Link>
              </li>
            );
          })}
        </ol>
      )}
      <p className="ui mt-3 text-sm text-muted chart-legend">
        <span className="status-dot status-dot-open" /> open in the trainer <span className="status-dot status-dot-learned" /> learned
        (box 3) <span className="status-dot status-dot-solid" /> solid (box 5) <span className="trace-mark trace-guided">✎</span> traced
      </p>
    </>
  );
}
