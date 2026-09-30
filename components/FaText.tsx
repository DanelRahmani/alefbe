// Renders Persian with its vowel-mark variants and transliteration. No hooks:
// the active mode is chosen by CSS from <html data-vowels>, so the static HTML
// is correct before hydration and a reload shows the saved mode at once.

import { Fragment } from "react";
import { parseMarkup, tokenText, translitOf, type Token } from "@/lib/markup";
import { VOWEL_MODES, variantsOf, type VowelMode } from "@/lib/persian/marks";
import { NON_JOINING, ZWJ, isLetter, isMark } from "@/lib/persian/chars";
import { wordsOfTokens } from "@/lib/inspect";

/** Where a split falls inside a word, add ZWJ on both sides so each span keeps its joining form. */
function keepJoins(tokens: Token[]): Token[] {
  const out = tokens.map((t) => ({ ...t }));
  for (let i = 0; i + 1 < out.length; i++) {
    const a = tokenText(out[i]);
    const b = tokenText(out[i + 1]);
    let j = a.length - 1;
    while (j >= 0 && isMark(a[j])) j--;
    const left = a[j];
    if (!left || !isLetter(left) || NON_JOINING.has(left) || !b || !isLetter(b[0])) continue;
    if (out[i].kind === "text") (out[i] as { text: string }).text += ZWJ;
    if (out[i + 1].kind === "text") (out[i + 1] as { text: string }).text = ZWJ + b;
  }
  return out;
}

function Spans({ tokens }: { tokens: Token[] }) {
  return (
    <>
      {keepJoins(tokens).map((t, i) => {
        const text = tokenText(t);
        const cls = [t.hl && "hl", t.bold && "font-bold"].filter(Boolean).join(" ");
        return cls ? (
          <span key={i} className={cls}>
            {text}
          </span>
        ) : (
          <Fragment key={i}>{text}</Fragment>
        );
      })}
    </>
  );
}

export interface FaTextProps {
  text?: string;
  tokens?: Token[];
  /** "block" puts the transliteration on its own line; "inline" after the run. */
  translit?: "block" | "inline" | "none";
  /** Show the transliteration regardless of the setting (script lessons). */
  alwaysTranslit?: boolean;
  /** Ignore the vowel-mark setting and always render this mode (e.g. the reading drill). */
  force?: VowelMode;
  className?: string;
}

export function FaText({ text, tokens, translit = "block", alwaysTranslit, force, className }: FaTextProps) {
  const toks = tokens ?? parseMarkup(text ?? "");
  const variants = variantsOf(toks);

  // Render each distinct variant once, tagged with the modes that use it.
  const groups: { modes: VowelMode[]; tokens: Token[] }[] = [];
  for (const mode of force ? [force] : VOWEL_MODES) {
    const sig = variants[mode].map((t) => tokenText(t) + (t.hl ? "¹" : "")).join("\u0001");
    const g = groups.find((x) => x.modes.length && x.tokens.map((t) => tokenText(t) + (t.hl ? "¹" : "")).join("\u0001") === sig);
    if (g) g.modes.push(mode);
    else groups.push({ modes: [mode], tokens: variants[mode] });
  }

  const tr = translit === "none" ? "" : translitOf(toks);
  // For the word inspector: per-word readings where an override changes them,
  // and a flag where the only variant shown is not the marked one.
  const overrides = toks.some((t) => t.kind === "override") ? JSON.stringify(wordsOfTokens(toks).map((w) => w.translit)) : undefined;
  const unmarked = force && force !== "all" ? "" : undefined;
  const trClass = ["tr", translit === "block" ? "tr-block" : "tr-inline", alwaysTranslit && "tr-always"]
    .filter(Boolean)
    .join(" ");

  return (
    <>
      <bdi
        lang="fa"
        dir="rtl"
        className={["fa", className].filter(Boolean).join(" ")}
        data-words={overrides}
        data-unmarked={unmarked}
      >
        {groups.length === 1 ? (
          <Spans tokens={groups[0].tokens} />
        ) : (
          groups.map((g) => (
            <span key={g.modes.join()} className={["vm", ...g.modes.map((m) => `vm-${m}`)].join(" ")}>
              <Spans tokens={g.tokens} />
            </span>
          ))
        )}
      </bdi>
      {tr && (
        <span lang="fa-Latn" dir="ltr" className={trClass}>
          {translit === "inline" ? `(${tr})` : tr}
        </span>
      )}
    </>
  );
}
