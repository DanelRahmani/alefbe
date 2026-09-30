"use client";

import Link from "next/link";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { findWord, letterParts, nthWord, wordIndexAt } from "@/lib/inspect";
import type { SearchItem } from "@/lib/search";
import { transliterate } from "@/lib/translit";
import { Rich } from "./Rich";
import { loadSearchIndex } from "./SearchPalette";

interface Tapped {
  /** The word as written, fully vowel-marked. */
  word: string;
  translit: string;
  x: number;
  y: number;
}

/** Where the caret falls under a point: the standard API, or WebKit's older one. */
function caretAt(x: number, y: number): { node: Node; offset: number } | null {
  const d = document as Document & { caretRangeFromPoint?: (x: number, y: number) => Range | null };
  if (typeof d.caretPositionFromPoint === "function") {
    const p = d.caretPositionFromPoint(x, y);
    return p ? { node: p.offsetNode, offset: p.offset } : null;
  }
  const r = d.caretRangeFromPoint?.(x, y);
  return r ? { node: r.startContainer, offset: r.startOffset } : null;
}

/** The run's text as displayed (hidden vowel-mode variants skipped), and the caret's offset in it. */
function shownText(run: Element, caret: { node: Node; offset: number }): { text: string; offset: number } | null {
  const walker = document.createTreeWalker(run, NodeFilter.SHOW_TEXT);
  let text = "";
  let offset = -1;
  for (let n = walker.nextNode(); n; n = walker.nextNode()) {
    const variant = n.parentElement?.closest(".vm");
    if (variant && getComputedStyle(variant).display === "none") continue;
    if (n === caret.node) offset = text.length + caret.offset;
    text += n.textContent ?? "";
  }
  return offset < 0 ? null : { text, offset };
}

const SKIP = "a, button, input, textarea, select, label, summary, [contenteditable], [data-no-inspect]";

/** The Persian word at a click inside a [data-inspect] area, or null. */
function tappedWord(e: MouseEvent): Tapped | null {
  const target = e.target instanceof Element ? e.target : null;
  if (!target?.closest("[data-inspect]") || target.closest(SKIP)) return null;
  const run = target.closest("bdi.fa");
  if (!run || run.hasAttribute("data-unmarked")) return null;
  // Selecting text is not a tap.
  if (String(window.getSelection() ?? "").trim()) return null;
  const caret = caretAt(e.clientX, e.clientY);
  if (!caret || !run.contains(caret.node)) return null;
  const shown = shownText(run, caret);
  if (!shown) return null;
  const n = wordIndexAt(shown.text, shown.offset);
  if (n === null) return null;
  // The marked form comes from the "all marks" variant, whatever mode is showing.
  const word = nthWord((run.querySelector(".vm-all") ?? run).textContent ?? "", n);
  if (!word) return null;
  let translit = transliterate(word);
  try {
    const readings = JSON.parse(run.getAttribute("data-words") ?? "null") as string[] | null;
    if (readings?.[n]) translit = readings[n];
  } catch {
    // No per-word readings: the rules' reading stands.
  }
  return { word, translit, x: e.clientX, y: e.clientY };
}

const GUTTER = 16;

/**
 * Tap a Persian word in a lesson or the dictionary: a popover shows its
 * reading, its meaning when the dictionary has it, and its letters with the
 * form each takes, linked to the letter pages.
 */
export function WordInspector() {
  const ref = useRef<HTMLDivElement>(null);
  const [tapped, setTapped] = useState<Tapped | null>(null);
  const [items, setItems] = useState<SearchItem[] | null>(null);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (e.button !== 0 || e.defaultPrevented) return;
      const t = tappedWord(e);
      if (!t) return;
      setTapped(t);
      loadSearchIndex().then((all: SearchItem[]) => setItems(all.filter((it) => it.kind === "word")));
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  // Open beside the tap: below it, or above when there's no room; never off screen.
  useLayoutEffect(() => {
    const pop = ref.current;
    if (!pop || !tapped) return;
    if (!pop.matches(":popover-open")) pop.showPopover();
    const w = pop.offsetWidth;
    const h = pop.offsetHeight;
    const left = Math.min(Math.max(GUTTER, tapped.x - w / 2), window.innerWidth - GUTTER - w);
    const below = tapped.y + 20;
    const top = below + h > window.innerHeight - GUTTER ? Math.max(GUTTER, tapped.y - 20 - h) : below;
    pop.style.left = `${left}px`;
    pop.style.top = `${top}px`;
    pop.focus({ preventScroll: true });
  }, [tapped, items]);

  const entry = tapped && items ? findWord(items, tapped.word) : undefined;
  const parts = tapped ? letterParts(tapped.word) : [];

  return (
    <div
      ref={ref}
      id="word-inspector"
      popover="auto"
      role="dialog"
      aria-label={tapped ? `The word ${tapped.translit}` : "Word"}
      tabIndex={-1}
      className="inspector ui"
      data-no-inspect
      onToggle={(e) => {
        if (e.newState === "closed") setTapped(null);
      }}
    >
      {tapped && (
        <>
          <div className="inspector-head">
            <p className="inspector-word">
              <bdi lang="fa" dir="rtl" className="fa">
                {tapped.word}
              </bdi>
              <span lang="fa-Latn" className="inspector-tr">
                {tapped.translit}
              </span>
            </p>
            <button type="button" className="tool-btn" popoverTarget="word-inspector" popoverTargetAction="hide">
              <span aria-hidden="true">✕</span>
              <span className="sr-only">Close</span>
            </button>
          </div>
          <p className="inspector-meaning">
            {entry ? (
              <>
                <span className="has-fa">
                  <Rich text={entry.title} translit={false} />
                </span>{" "}
                <Link href={entry.href} className="inspector-link">
                  In the dictionary →
                </Link>
              </>
            ) : (
              <span className="text-muted">{items ? "Not in the dictionary yet." : "Looking it up…"}</span>
            )}
          </p>
          {parts.length > 0 && (
            <ol className="inspector-letters" dir="rtl" aria-label="Its letters, right to left">
              {parts.map((p, i) => {
                const body = (
                  <>
                    <span className="inspector-glyph naskh" lang="fa">
                      {p.glyph}
                    </span>
                    <span className="inspector-name" dir="ltr">
                      {p.name}
                      <span className="sr-only">, {p.form} form</span>
                    </span>
                  </>
                );
                return (
                  <li key={i} title={`${p.name}, ${p.form} form`}>
                    {p.href ? (
                      <Link href={p.href} className="inspector-letter">
                        {body}
                      </Link>
                    ) : (
                      <span className="inspector-letter">{body}</span>
                    )}
                  </li>
                );
              })}
            </ol>
          )}
        </>
      )}
    </div>
  );
}
