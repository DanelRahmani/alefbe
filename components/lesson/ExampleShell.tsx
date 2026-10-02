"use client";

import { useRef, useState } from "react";
import type { VowelMode } from "@/lib/persian/marks";
import { faIn } from "@/lib/starred";
import { StarButton } from "../StarButton";

const VOWEL_MODES = new Set(["all", "key", "none"]);

/**
 * An example with its tools: star it, peek at its transliteration while the
 * setting is off, or copy the Persian as it is shown.
 */
export function ExampleShell({
  children,
  fa,
  written,
  en,
  source,
  className = "panel example",
  peek = true,
}: {
  children: React.ReactNode;
  fa: string;
  written?: string;
  en: string;
  /** Where the example comes from; without one it can't be starred. */
  source?: { label: string; href: string };
  className?: string;
  /** Offer the transliteration peek (not needed where it always shows). */
  peek?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [peeking, setPeeking] = useState(false);
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    const setting = document.documentElement.dataset.vowels ?? "all";
    const shown = ref.current?.closest(".marks-all") ? "all" : VOWEL_MODES.has(setting) ? (setting as VowelMode) : "all";
    try {
      await navigator.clipboard.writeText(faIn(fa, shown));
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      // Clipboard blocked: nothing to do; the text can still be selected by hand.
    }
  };

  return (
    <div ref={ref} className={peeking ? `${className} peek` : className}>
      {children}
      <div className="ui example-tools">
        {source && <StarButton item={{ fa, written, en, source: source.label, href: source.href }} />}
        {peek && (
          <button type="button" className="tool-btn peek-btn" aria-pressed={peeking} onClick={() => setPeeking((p) => !p)}>
            {peeking ? "Hide sound" : "Show sound"}
          </button>
        )}
        <button type="button" className="tool-btn" onClick={copy} aria-live="polite">
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
    </div>
  );
}
