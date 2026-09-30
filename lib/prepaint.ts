// Runs in <head> before first paint: copies the saved display settings onto
// <html data-vowels data-translit data-theme data-size data-fafont>, so a
// reload shows the chosen vowel-mark mode, transliteration, text size and
// Persian typeface straight away (no flash). The static HTML ships the
// defaults; CSS keys every mode off these attributes.

export const SETTINGS_KEY = "alefbe2:settings";

export const TEXT_SIZES = ["s", "m", "l"] as const;
export type TextSize = (typeof TEXT_SIZES)[number];

/** Persian body text: Vazirmatn (modern sans) or Amiri (Naskh, the book hand). */
export const FA_FONTS = ["vazirmatn", "naskh"] as const;
export type FaFont = (typeof FA_FONTS)[number];

const oneOf = (attr: string, field: string, values: readonly string[]) =>
  `if(${JSON.stringify(values)}.indexOf(s.${field})>=0)d.dataset.${attr}=s.${field};`;

export const PREPAINT_SCRIPT =
  `(function(){try{var r=localStorage.getItem(${JSON.stringify(SETTINGS_KEY)});if(!r)return;` +
  `var s=JSON.parse(r).data;if(!s)return;var d=document.documentElement;` +
  oneOf("vowels", "vowels", ["all", "key", "none"]) +
  `d.dataset.translit=s.translit?"on":"off";` +
  oneOf("theme", "theme", ["system", "light", "dark"]) +
  oneOf("size", "size", TEXT_SIZES) +
  oneOf("fafont", "faFont", FA_FONTS) +
  `}catch(e){}})();`;
