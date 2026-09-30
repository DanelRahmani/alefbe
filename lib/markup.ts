// The inline markup shared by English and Persian strings, parsed once:
//   {…}            highlight (the "red pen")
//   **…** / *…*    bold / italic
//   [متن|translit] transliteration override for one irregular word

import { ARABIC_SCRIPT, ZWNJ } from "./persian/chars";
import { transliterateWithErrors } from "./translit";

interface Flags {
  hl: boolean;
  bold: boolean;
  it: boolean;
}
export type Token = (Flags & { kind: "text"; text: string }) | (Flags & { kind: "override"; base: string; translit: string });

export function parseMarkup(src: string): Token[] {
  const tokens: Token[] = [];
  const f: Flags = { hl: false, bold: false, it: false };
  let buf = "";
  const flush = () => {
    if (buf) tokens.push({ kind: "text", text: buf, ...f });
    buf = "";
  };
  for (let i = 0; i < src.length; i++) {
    const ch = src[i];
    if (ch === "{" || ch === "}") {
      const open = ch === "{";
      if (open === f.hl) throw new Error(`Unbalanced ${ch} in: ${src}`);
      flush();
      f.hl = open;
    } else if (ch === "*" && src[i + 1] === "*") {
      flush();
      f.bold = !f.bold;
      i++;
    } else if (ch === "*") {
      flush();
      f.it = !f.it;
    } else if (ch === "[") {
      const bar = src.indexOf("|", i);
      const end = src.indexOf("]", i);
      if (bar < 0 || end < 0 || bar > end) throw new Error(`Bad [base|translit] in: ${src}`);
      flush();
      tokens.push({ kind: "override", base: src.slice(i + 1, bar), translit: src.slice(bar + 1, end), ...f });
      i = end;
    } else if (ch === "]" || ch === "|") {
      throw new Error(`Stray ${ch} in: ${src}`);
    } else {
      buf += ch;
    }
  }
  flush();
  if (f.hl || f.bold || f.it) throw new Error(`Unclosed marker in: ${src}`);
  return tokens;
}

export const tokenText = (t: Token) => (t.kind === "text" ? t.text : t.base);
export const plainOf = (tokens: Token[]) => tokens.map(tokenText).join("");

/** Cut a token list to the character range [start, end) of its plain text. */
export function sliceTokens(tokens: Token[], start: number, end: number): Token[] {
  const out: Token[] = [];
  let pos = 0;
  for (const t of tokens) {
    const s = tokenText(t);
    const a = pos;
    const b = pos + s.length;
    pos = b;
    if (b <= start || a >= end) continue;
    if (t.kind === "override") out.push(t);
    else out.push({ ...t, text: s.slice(Math.max(0, start - a), Math.min(s.length, end - a)) });
  }
  return out;
}

/** Transliteration of a Persian token list, using overrides where given. */
export function translitWithErrors(tokens: Token[]): { text: string; errors: string[] } {
  let text = "";
  const errors: string[] = [];
  let buf = "";
  const flush = () => {
    const r = transliterateWithErrors(buf);
    text += r.text;
    errors.push(...r.errors);
    buf = "";
  };
  for (const t of tokens) {
    if (t.kind === "text") buf += t.text;
    else {
      flush();
      text += t.translit;
    }
  }
  flush();
  return { text, errors };
}

export const translitOf = (tokens: Token[]) => translitWithErrors(tokens).text;

/**
 * Split English prose into Latin and Persian runs. A Persian run starts and
 * ends with an Arabic-script character; spaces and half-spaces between
 * Persian characters stay inside it.
 */
export function splitScript(text: string): { fa: boolean; s: string }[] {
  const out: { fa: boolean; s: string }[] = [];
  let i = 0;
  while (i < text.length) {
    if (ARABIC_SCRIPT.test(text[i])) {
      let j = i + 1;
      let end = j;
      while (j < text.length) {
        const ch = text[j];
        if (ARABIC_SCRIPT.test(ch)) end = j + 1;
        else if (ch !== " " && ch !== ZWNJ) break;
        j++;
      }
      out.push({ fa: true, s: text.slice(i, end) });
      i = end;
    } else {
      let j = i;
      while (j < text.length && !ARABIC_SCRIPT.test(text[j])) j++;
      out.push({ fa: false, s: text.slice(i, j) });
      i = j;
    }
  }
  return out;
}
