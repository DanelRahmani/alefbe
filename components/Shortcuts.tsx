"use client";

import { useEffect, useRef } from "react";

/** Is the key going into a text field? Then page shortcuts stay out of the way. */
export const isTyping = (t: EventTarget | null) =>
  t instanceof HTMLElement && !!t.closest("input, textarea, select, [contenteditable='true']");

const KEYS: { keys: string[]; sep?: string; what: string }[] = [
  { keys: ["/"], what: "Search the course (Ctrl K works too)" },
  { keys: ["←", "→"], sep: " ", what: "Previous or next lesson" },
  { keys: ["1", "4"], sep: "–", what: "Pick an option in quizzes and games" },
  { keys: ["Enter"], what: "Check an answer, then go on" },
  { keys: ["Esc"], what: "Close a window like this one" },
  { keys: ["?"], what: "Show these shortcuts" },
];

/** `?` opens a sheet of the keyboard shortcuts; so does the footer link. */
export function Shortcuts() {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const open = () => {
      const d = ref.current;
      if (d && !d.open) d.showModal();
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "?" || e.ctrlKey || e.metaKey || e.altKey || isTyping(e.target)) return;
      if (document.querySelector("dialog[open]")) return;
      e.preventDefault();
      open();
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("alefbe:shortcuts", open);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("alefbe:shortcuts", open);
    };
  }, []);

  return (
    <dialog
      ref={ref}
      className="ui search-dialog help-dialog"
      aria-labelledby="shortcuts-title"
      onClick={(e) => {
        if (e.target === e.currentTarget) ref.current?.close();
      }}
    >
      <div className="search-box">
        <h2 id="shortcuts-title" className="help-title">
          Keyboard shortcuts
        </h2>
        <button type="button" className="search-close" onClick={() => ref.current?.close()} aria-label="Close">
          Esc
        </button>
      </div>
      <dl className="help-list">
        {KEYS.map(({ keys, sep, what }) => (
          <div key={what} className="help-row">
            <dt>
              {keys.map((k, i) => (
                <span key={k}>
                  {i > 0 && <span className="text-muted">{sep}</span>}
                  <kbd className="help-kbd">{k}</kbd>
                </span>
              ))}
            </dt>
            <dd>{what}</dd>
          </div>
        ))}
      </dl>
    </dialog>
  );
}

/** A link-styled button that opens the shortcuts sheet. */
export function ShortcutsLink() {
  return (
    <button type="button" className="shortcuts-link" onClick={() => window.dispatchEvent(new Event("alefbe:shortcuts"))}>
      Keyboard shortcuts
    </button>
  );
}
