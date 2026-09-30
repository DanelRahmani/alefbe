// The months of the Iranian (Solar Hijri) calendar, fully vowel-marked, in
// order from Farvardin (starting at Nowruz). The Today card shows the date
// itself as Intl writes it, unmarked; these give the month's reading.
// tests/today.test.ts checks them against Intl's own month names.

import type { Fa } from "./types";

export const PERSIAN_MONTHS: Fa[] = [
  "فَرْوَرْدین",
  "اُرْدیبِهِشْت",
  "خُرْداد",
  "تیر",
  "مُرْداد",
  "شَهْریوَر",
  "مِهْر",
  "آبان",
  "آذَر",
  "دِی",
  "بَهْمَن",
  "اِسْفَنْد",
];
