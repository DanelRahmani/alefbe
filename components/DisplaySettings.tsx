"use client";

import { useEffect } from "react";
import { applySettings, settingsStore } from "@/lib/stores";
import { DisplayControls } from "./DisplayControls";

export function DisplaySettings() {
  // Another tab changed the settings: mirror them onto <html>.
  useEffect(() => settingsStore.subscribe(() => applySettings(settingsStore.get())), []);

  return (
    <>
      <button
        type="button"
        popoverTarget="display-settings"
        className="ui header-btn"
      >
        <span className="naskh text-lg leading-none" aria-hidden="true">
          اَ
        </span>
        Display
      </button>
      <div id="display-settings" popover="auto" className="ui settings-panel" aria-label="Display settings">
        <DisplayControls />
      </div>
    </>
  );
}
