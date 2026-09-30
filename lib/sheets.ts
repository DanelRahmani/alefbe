// Printable tracing sheets: which rows to print for a chosen set of letters.
// Pure; app/practice/sheets renders them and the print stylesheet lays them
// out on paper.

import { DIGITS, DRILL_GROUPS, formOf, formsOf, letterByChar, type Form } from "./persian/letters";

export interface SheetOptions {
  /** Drill groups to print (0–7 letters, 8 the digits). */
  groups: number[];
  /** Every joining form, or only the isolated letter. */
  forms: "all" | "isolated";
  /** Add a row for each letter's key word. */
  words: boolean;
}

export const DEFAULT_SHEET: SheetOptions = { groups: [0], forms: "all", words: true };

export interface SheetRow {
  /** The glyph to trace: a letter form (with its joining stroke) or a word. */
  glyph: string;
  kind: "form" | "word";
  /** "isolated", "initial"… for forms; the meaning for words. */
  label: string;
}

export interface SheetLetter {
  ch: string;
  name: string;
  sound: string;
  rows: SheetRow[];
}

/** The letters of the chosen groups, in alphabet order, each with its rows. */
export function sheetLetters(opts: SheetOptions): SheetLetter[] {
  const groups = [...new Set(opts.groups)].filter((g) => g >= 0 && g < DRILL_GROUPS.length).sort((a, b) => a - b);
  return groups.flatMap((g) =>
    DRILL_GROUPS[g].map((ch) => {
      const letter = letterByChar.get(ch);
      if (!letter) {
        const d = DIGITS.find((x) => x.ch === ch)!;
        return { ch, name: d.name, sound: String(d.value), rows: [{ glyph: ch, kind: "form" as const, label: "digit" }] };
      }
      const forms: Form[] = opts.forms === "all" ? formsOf(letter) : ["isolated"];
      const rows: SheetRow[] = forms.map((f) => ({ glyph: formOf(letter, f), kind: "form", label: f }));
      if (opts.words) rows.push({ glyph: letter.key.fa, kind: "word", label: letter.key.en });
      return { ch, name: letter.name, sound: letter.sounds[0], rows };
    }),
  );
}

/** A short title for the selection: "ا – ث" for one group, "3 groups" for more. */
export function sheetTitle(opts: SheetOptions): string {
  const letters = sheetLetters({ ...opts, words: false });
  if (!letters.length) return "No letters chosen";
  if (opts.groups.length === 1) return `${letters[0].ch} – ${letters[letters.length - 1].ch}`;
  return `${letters.length} letters`;
}
