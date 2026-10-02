"use client";

import { useId } from "react";
import { useStore } from "@/lib/storage";
import { settingsStore, updateSettings, type Theme } from "@/lib/stores";
import type { VowelMode } from "@/lib/persian/marks";
import type { FaFont, TextSize } from "@/lib/prepaint";
import { FaText } from "./FaText";

const VOWEL_OPTIONS: { value: VowelMode; label: string; hint: string }[] = [
  { value: "all", label: "All marks", hint: "Every short vowel shown, like a first reader." },
  { value: "key", label: "Key words", hint: "Marks on the highlighted words and the ezafe." },
  { value: "none", label: "None", hint: "Real-world text, as Iranians write it." },
];

const THEME_OPTIONS: { value: Theme; label: string }[] = [
  { value: "system", label: "System" },
  { value: "light", label: "Light" },
  { value: "dark", label: "Dark" },
];

const FONT_OPTIONS: { value: FaFont; label: string }[] = [
  { value: "vazirmatn", label: "Vazirmatn" },
  { value: "naskh", label: "Naskh" },
];

const SIZE_OPTIONS: { value: TextSize; label: string }[] = [
  { value: "s", label: "Small" },
  { value: "m", label: "Medium" },
  { value: "l", label: "Large" },
];

/** Vowel marks, transliteration, typeface, text size and (optionally) theme: in the Display popover and inline in lesson 0.1. */
export function DisplayControls({ theme = true }: { theme?: boolean }) {
  const s = useStore(settingsStore);
  const id = useId();

  return (
    <div className="display-controls">
      <fieldset>
        <legend className="font-medium">Vowel marks</legend>
        <div className="mode-cards">
          {VOWEL_OPTIONS.map((o) => (
            <label key={o.value} className="mode-card">
              <input
                type="radio"
                name={`${id}-vowels`}
                value={o.value}
                checked={s.vowels === o.value}
                onChange={() => updateSettings({ vowels: o.value })}
                className="sr-only"
              />
              <span className="mode-preview has-fa">
                <FaText text="{کِتابِ} مَن" translit="none" force={o.value} />
              </span>
              <span className="mode-label">{o.label}</span>
            </label>
          ))}
        </div>
        <p className="mt-2 text-sm text-muted">{VOWEL_OPTIONS.find((o) => o.value === s.vowels)?.hint}</p>
      </fieldset>

      <div className="settings-row">
        <span id={`${id}-translit`}>
          <span className="block font-medium">Transliteration</span>
          <span className="block text-sm text-muted">ketâb-e man, under each sentence</span>
        </span>
        <button
          type="button"
          role="switch"
          aria-checked={s.translit}
          aria-labelledby={`${id}-translit`}
          onClick={() => updateSettings({ translit: !s.translit })}
          className="switch"
        >
          <span className="switch-knob" />
        </button>
      </div>

      <fieldset>
        <legend className="font-medium">Persian typeface</legend>
        <div className="mode-cards mode-cards-2">
          {FONT_OPTIONS.map((o) => (
            <label key={o.value} className="mode-card">
              <input
                type="radio"
                name={`${id}-font`}
                value={o.value}
                checked={s.faFont === o.value}
                onChange={() => updateSettings({ faFont: o.value })}
                className="sr-only"
              />
              <span className={`mode-preview has-fa font-preview-${o.value}`}>
                <FaText text="کِتابِ مَن" translit="none" force="all" />
              </span>
              <span className="mode-label">{o.label}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <fieldset>
        <legend className="font-medium">Text size</legend>
        <div className="flex gap-2">
          {SIZE_OPTIONS.map((o) => (
            <label key={o.value} className="chip">
              <input
                type="radio"
                name={`${id}-size`}
                value={o.value}
                checked={s.size === o.value}
                onChange={() => updateSettings({ size: o.value })}
                className="sr-only"
              />
              <span>{o.label}</span>
            </label>
          ))}
        </div>
      </fieldset>

      {theme && (
        <fieldset>
          <legend className="font-medium">Theme</legend>
          <div className="flex gap-2">
            {THEME_OPTIONS.map((o) => (
              <label key={o.value} className="chip">
                <input
                  type="radio"
                  name={`${id}-theme`}
                  value={o.value}
                  checked={s.theme === o.value}
                  onChange={() => updateSettings({ theme: o.value })}
                  className="sr-only"
                />
                <span>{o.label}</span>
              </label>
            ))}
          </div>
        </fieldset>
      )}
    </div>
  );
}
