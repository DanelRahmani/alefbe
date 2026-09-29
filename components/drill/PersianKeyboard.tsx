"use client";

// The standard Persian keyboard (ISIRI 9147) letter rows, the digits, the
// letters that sit on Shift on a physical keyboard, and the half-space.

const ROWS = [
  "۱۲۳۴۵۶۷۸۹۰".split(""),
  "ضصثقفغعهخحجچ".split(""),
  "شسیبلاتنمکگ".split(""),
  "ظطزرذدپو".split(""),
  "آژءئؤأ".split(""),
];

const ZWNJ = "‌";

export function PersianKeyboard({
  onInsert,
  onBackspace,
}: {
  onInsert: (text: string) => void;
  onBackspace: () => void;
}) {
  // Keep focus (and the caret) in the answer field while tapping keys.
  const keep = (e: React.PointerEvent) => e.preventDefault();
  return (
    <div className="ui kb" role="group" aria-label="Persian keyboard (standard layout)">
      {ROWS.map((row, i) => (
        <div key={i} className="kb-row" dir="rtl">
          {row.map((ch) => (
            <button key={ch} type="button" className="kb-key fa" onPointerDown={keep} onClick={() => onInsert(ch)}>
              {ch}
            </button>
          ))}
        </div>
      ))}
      <div className="kb-row kb-bottom">
        <button type="button" className="kb-key kb-wide" onPointerDown={keep} onClick={onBackspace} aria-label="Delete">
          ⌫
        </button>
        <button type="button" className="kb-key kb-space" onPointerDown={keep} onClick={() => onInsert(" ")} aria-label="Space">
          space
        </button>
        <button
          type="button"
          className="kb-key kb-wide"
          onPointerDown={keep}
          onClick={() => onInsert(ZWNJ)}
          aria-label="Half-space (zero-width non-joiner)"
        >
          half-space
        </button>
      </div>
    </div>
  );
}
