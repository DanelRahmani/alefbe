"use client";

import { useState } from "react";
import { useStore } from "@/lib/storage";
import { logActivity, openLetterGroups, progressStore } from "@/lib/stores";
import { Rich } from "../Rich";

/** The fast track: mark the script units finished and open the trainer's letter groups. */
export function SkipAhead({ keys, groups, label, text }: { keys: string[]; groups: number; label: string; text: string }) {
  const progress = useStore(progressStore);
  const [asking, setAsking] = useState(false);
  const allDone = keys.length > 0 && keys.every((k) => progress[k]);

  const skip = () => {
    const fresh = keys.filter((k) => !progressStore.get()[k]);
    progressStore.set((p) => ({ ...p, ...Object.fromEntries(keys.map((k) => [k, true as const])) }));
    openLetterGroups(groups);
    if (fresh.length) logActivity({ kind: "lesson", count: fresh.length });
    setAsking(false);
  };

  return (
    <section className="ui skip-ahead glass" aria-labelledby="skip-ahead-title">
      <p id="skip-ahead-title" className="font-medium">
        {label}
      </p>
      <p className="mt-1 has-fa text-muted">
        <Rich text={text} />
      </p>
      {allDone ? (
        <p role="status" className="mt-3 backup-msg quiz-ok">
          Done: those lessons carry their seal and the trainer has every letter open. Carry on with the next unfinished
          lesson on the path.
        </p>
      ) : asking ? (
        <div className="confirm-box" role="alertdialog" aria-labelledby="skip-ahead-q">
          <p id="skip-ahead-q" className="font-medium">
            Mark {keys.length} lessons finished and open every letter group?
          </p>
          <p className="mt-1 text-sm text-muted">
            You can still open any of them, and undo each one with “Mark as not finished”.
          </p>
          <div className="mt-3 flex gap-2">
            <button type="button" className="drill-btn" onClick={skip}>
              Skip ahead
            </button>
            <button type="button" className="drill-btn drill-btn-quiet" onClick={() => setAsking(false)}>
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <button type="button" className="drill-btn mt-3" onClick={() => setAsking(true)}>
          {label}
        </button>
      )}
    </section>
  );
}
