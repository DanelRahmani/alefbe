"use client";

import { lazy, Suspense, useEffect, useState } from "react";
import { applySettings, settingsStore } from "@/lib/stores";

// The controls (with their previews) are fetched when the panel is about to
// open, not with every page: pointing at or focusing the button starts it.
const loadControls = () => import("./DisplayControls");
const DisplayControls = lazy(() => loadControls().then((m) => ({ default: m.DisplayControls })));

export function DisplaySettings() {
  const [opened, setOpened] = useState(false);
  // Another tab changed the settings: mirror them onto <html>.
  useEffect(() => settingsStore.subscribe(() => applySettings(settingsStore.get())), []);

  return (
    <>
      <button
        type="button"
        popoverTarget="display-settings"
        className="ui header-btn"
        onPointerEnter={loadControls}
        onFocus={loadControls}
      >
        <span className="text-lg leading-none" aria-hidden="true">
          اَ
        </span>
        Display
      </button>
      <div
        id="display-settings"
        popover="auto"
        className="ui settings-panel"
        aria-label="Display settings"
        onBeforeToggle={(e) => {
          if ((e.nativeEvent as ToggleEvent).newState === "open") setOpened(true);
        }}
      >
        {opened && (
          <Suspense fallback={<p className="text-sm text-muted">Loading…</p>}>
            <DisplayControls />
          </Suspense>
        )}
      </div>
    </>
  );
}
