"use client";

import { useState } from "react";
import { useStore } from "@/lib/storage";
import { logActivity, progressStore } from "@/lib/stores";
import { Seal } from "./Seal";

export function MarkDone({ lessonKey }: { lessonKey: string }) {
  const progress = useStore(progressStore);
  const done = Boolean(progress[lessonKey]);
  const [justStamped, setJustStamped] = useState(false);

  const finish = () => {
    progressStore.set((p) => ({ ...p, [lessonKey]: true }));
    logActivity({ kind: "lesson" });
    setJustStamped(true);
  };
  const undo = () => {
    progressStore.set((p) => {
      const next = { ...p };
      delete next[lessonKey];
      return next;
    });
    setJustStamped(false);
  };

  return (
    <div className="ui flex min-h-24 items-center gap-5" aria-live="polite">
      {done ? (
        <>
          <Seal size={88} stamp={justStamped} label="Lesson finished" />
          <div>
            <p className="font-medium">Lesson finished</p>
            <button type="button" onClick={undo} className="text-sm text-muted underline underline-offset-4">
              Mark as not finished
            </button>
          </div>
        </>
      ) : (
        <button
          type="button"
          onClick={finish}
          className="rounded-full border-2 border-accent px-5 py-2.5 font-medium text-accent hover:bg-accent-soft"
        >
          Mark as finished
        </button>
      )}
    </div>
  );
}
