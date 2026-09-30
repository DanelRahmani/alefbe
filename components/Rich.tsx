// English prose with inline markup; Persian runs inside it are detected and
// rendered with FaText (vowel modes, inline transliteration). No hooks.

import { Fragment } from "react";
import { parseMarkup, sliceTokens, splitScript, tokenText, type Token } from "@/lib/markup";
import type { VowelMode } from "@/lib/persian/marks";
import { FaText } from "./FaText";

function Latin({ tokens }: { tokens: Token[] }) {
  return (
    <>
      {tokens.map((t, i) => {
        let node: React.ReactNode = tokenText(t);
        if (t.it) node = <em>{node}</em>;
        if (t.bold) node = <strong>{node}</strong>;
        if (t.hl) node = <span className="hl">{node}</span>;
        return <Fragment key={i}>{node}</Fragment>;
      })}
    </>
  );
}

export function Rich({ text, translit = true, force }: { text: string; translit?: boolean; force?: VowelMode }) {
  const tokens = parseMarkup(text);
  const segments: { fa: boolean; tokens: Token[] }[] = [];
  let pos = 0;
  for (const run of splitScript(tokens.map(tokenText).join(""))) {
    segments.push({ fa: run.fa, tokens: sliceTokens(tokens, pos, pos + run.s.length) });
    pos += run.s.length;
  }
  return (
    <>
      {segments.map((seg, i) =>
        seg.fa ? (
          <FaText
            key={i}
            tokens={seg.tokens}
            translit={translit ? "inline" : "none"}
            force={force}
            className={seg.tokens.map(tokenText).join("").length <= 24 ? "whitespace-nowrap" : undefined}
          />
        ) : (
          <Latin key={i} tokens={seg.tokens} />
        ),
      )}
    </>
  );
}

/** True when a Rich string contains Persian (so its paragraph needs extra line height). */
export const hasFa = (text: string) => /[؀-ۿ]/.test(text);
