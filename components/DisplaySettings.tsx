"use client";

import { useEffect } from "react";
import { useStore } from "@/lib/storage";
import { applySettings, settingsStore, updateSettings, type Theme } from "@/lib/stores";
import type { VowelMode } from "@/lib/persian/marks";
import { FaText } from "./FaText";

const VOWEL_OPTIONS: { value: VowelMode; label: string; hint: string }[] = [
  { value: "all", label: "All marks", hint: "Every short vowel shown, like a first reader." },
  { value: "key", label: "Key words only", hint: "Marks on the highlighted words and the ezafe." },
  { value: "none", label: "None", hint: "Real-world text, as Iranians write it." },
];

const THEME_OPTIONS: { value: Theme; label: string }[] = [
  { value: "system", label: "System" },
  { value: "light", label: "Light" },
  { value: "dark", label: "Dark" },
];

export function DisplaySettings() {
  const s = useStore(settingsStore);

  // Another tab changed the settings: mirror them onto <html>.
  useEffect(() => settingsStore.subscribe(() => applySettings(settingsStore.get())), []);

  return (
    <>
      <button
        type="button"
        popoverTarget="display-settings"
        className="ui flex items-center gap-2 rounded-full border border-rule px-3 py-1.5 text-sm hover:border-accent"
      >
        <span className="naskh text-lg leading-none" aria-hidden="true">
          اَ
        </span>
        Display
      </button>
      <div id="display-settings" popover="auto" className="ui settings-panel" aria-label="Display settings">
        <fieldset>
          <legend className="font-medium">Vowel marks</legend>
          <p className="settings-preview has-fa">
            <FaText text="این {کِتابِ} مَن اَسْت." translit="none" />
          </p>
          {VOWEL_OPTIONS.map((o) => (
            <label key={o.value} className="settings-option">
              <input
                type="radio"
                name="vowels"
                value={o.value}
                checked={s.vowels === o.value}
                onChange={() => updateSettings({ vowels: o.value })}
              />
              <span>
                <span className="block">{o.label}</span>
                <span className="block text-sm text-muted">{o.hint}</span>
              </span>
            </label>
          ))}
        </fieldset>

        <div className="settings-row">
          <span id="translit-label">
            <span className="block font-medium">Transliteration</span>
            <span className="block text-sm text-muted">ketâb-e man, under each sentence</span>
          </span>
          <button
            type="button"
            role="switch"
            aria-checked={s.translit}
            aria-labelledby="translit-label"
            onClick={() => updateSettings({ translit: !s.translit })}
            className="switch"
          >
            <span className="switch-knob" />
          </button>
        </div>

        <fieldset>
          <legend className="font-medium">Theme</legend>
          <div className="flex gap-2">
            {THEME_OPTIONS.map((o) => (
              <label key={o.value} className="settings-chip">
                <input
                  type="radio"
                  name="theme"
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
      </div>
    </>
  );
}
