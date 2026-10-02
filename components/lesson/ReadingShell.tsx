"use client";

import { useId, useState } from "react";

/**
 * A reading text's frame: the vowel-mark switch for the whole text. The text
 * shows without marks, the way Iranians print it, whatever the display
 * setting; the switch shows them all (CSS picks the variant, see .reading).
 */
export function ReadingShell({ style, label, title, note, children }: { style: string; label: string; title?: React.ReactNode; note?: React.ReactNode; children: React.ReactNode }) {
  const [marks, setMarks] = useState(false);
  return (
    <figure className={`reading reading-${style}`} data-marks={marks ? "on" : undefined} aria-label={label}>
      <figcaption className="reading-head">
        <span className="reading-title">{title}</span>
        <button type="button" className="tool-btn reading-marks ui" aria-pressed={marks} onClick={() => setMarks((m) => !m)}>
          <span aria-hidden="true">اَ</span> Vowel marks
        </button>
      </figcaption>
      <ol className="reading-text" data-inspect>
        {children}
      </ol>
      {note && <div className="reading-note">{note}</div>}
    </figure>
  );
}

/**
 * One line of a reading text, with a button that reveals its transliteration
 * and translation underneath, so the reader can try it first. The revealed
 * text sits in a live region, so it is announced.
 */
export function RevealLine({ n, className, reveal, children }: { n: number; className?: string; reveal: React.ReactNode; children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const id = useId();
  return (
    <li className={["reading-line", className].filter(Boolean).join(" ")} data-open={open ? "" : undefined}>
      <div className="reading-line-body">
        {children}
        <button type="button" className="tool-btn reading-show ui" aria-expanded={open} aria-controls={id} onClick={() => setOpen((o) => !o)}>
          {open ? "Hide" : "Show"}
          <span className="sr-only"> line {n}</span>
        </button>
      </div>
      <div id={id} className="reading-reveal ui" aria-live="polite">
        {open && reveal}
      </div>
    </li>
  );
}
