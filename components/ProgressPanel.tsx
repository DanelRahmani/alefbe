"use client";

import { useRef, useState } from "react";
import { BACKUP_KEYS, applyBackup, backupFileName, makeBackup, parseBackup, type Parsed } from "@/lib/backup";
import { DRILL_GROUPS } from "@/lib/drill";
import { PASS_SCORE } from "@/lib/trace";
import { useStore } from "@/lib/storage";
import { ALL_STORES, applySettings, deckOf, progressStore, settingsStore, srsStore, traceStore } from "@/lib/stores";

const read = (k: string) => {
  try {
    return window.localStorage.getItem(k);
  } catch {
    return null;
  }
};
const write = (k: string, v: string) => window.localStorage.setItem(k, v);

function refreshAll() {
  ALL_STORES.forEach((s) => s.refresh());
  applySettings(settingsStore.get());
}

const dateOf = (iso?: string) => {
  const d = iso ? new Date(iso) : null;
  return d && !Number.isNaN(d.getTime()) ? d.toLocaleDateString(undefined, { day: "numeric", month: "long", year: "numeric" }) : null;
};

export function ProgressPanel({ totalLessons }: { totalLessons: number }) {
  const progress = useStore(progressStore);
  const srs = useStore(srsStore);
  const trace = useStore(traceStore);
  const fileRef = useRef<HTMLInputElement>(null);
  const [pending, setPending] = useState<Exclude<Parsed, { kind: "invalid" }> | null>(null);
  const [message, setMessage] = useState<{ ok: boolean; text: string } | null>(null);
  const [confirmReset, setConfirmReset] = useState(false);

  const finished = Object.keys(progress).length;
  const learnt = Object.values(srs.decks).reduce((n, d) => n + Object.values(d?.cards ?? {}).filter((c) => c.box >= 3).length, 0);
  const groupsOpen = deckOf(srs, "sound").unlocked;
  const traced = Object.values(trace).filter((s) => s >= PASS_SCORE).length;

  const download = () => {
    try {
      const now = new Date();
      const json = JSON.stringify(makeBackup(read, now), null, 2);
      const url = URL.createObjectURL(new Blob([json], { type: "application/json" }));
      const a = document.createElement("a");
      a.href = url;
      a.download = backupFileName(now);
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.setTimeout(() => URL.revokeObjectURL(url), 1000);
      setMessage({ ok: true, text: `Downloaded ${backupFileName(now)}. Keep it somewhere safe; import it on any device to continue.` });
    } catch {
      setMessage({ ok: false, text: "The backup couldn't be created. Your browser may be blocking storage or downloads." });
    }
  };

  const choose = async (file: File | undefined) => {
    setConfirmReset(false);
    if (!file) return;
    const parsed = parseBackup(await file.text());
    if (fileRef.current) fileRef.current.value = "";
    if (parsed.kind === "invalid") {
      setPending(null);
      setMessage({ ok: false, text: parsed.reason });
      return;
    }
    setMessage(null);
    setPending(parsed);
  };

  const confirmImport = () => {
    if (!pending) return;
    try {
      applyBackup(pending, read, write);
      refreshAll();
      setMessage({
        ok: true,
        text:
          pending.kind === "legacy"
            ? "Imported the letters you learned in the old Alefbe app; the trainer has opened their groups."
            : "Backup restored: lessons, trainer, tracing and settings.",
      });
    } catch {
      setMessage({ ok: false, text: "The backup couldn't be saved. Your browser may be blocking storage." });
    }
    setPending(null);
  };

  const reset = () => {
    try {
      BACKUP_KEYS.forEach((k) => window.localStorage.removeItem(k));
      refreshAll();
      setMessage({ ok: true, text: "All progress cleared." });
    } catch {
      setMessage({ ok: false, text: "Progress couldn't be cleared. Your browser may be blocking storage." });
    }
    setConfirmReset(false);
  };

  return (
    <div className="ui">
      <dl className="stat-grid">
        <div className="stat">
          <dt>Lessons finished</dt>
          <dd>
            {finished} <span>of {totalLessons}</span>
          </dd>
        </div>
        <div className="stat">
          <dt>Letter groups open</dt>
          <dd>
            {groupsOpen} <span>of {DRILL_GROUPS.length}</span>
          </dd>
        </div>
        <div className="stat">
          <dt>Cards learnt (box 3+)</dt>
          <dd>{learnt}</dd>
        </div>
        <div className="stat">
          <dt>Letter forms traced</dt>
          <dd>{traced}</dd>
        </div>
      </dl>

      <section className="backup">
        <h2 className="lesson-h2">Back up and restore</h2>
        <p className="mt-1 text-muted">
          Progress lives in this browser only. Download a backup to keep it safe or move it to another device; old Alefbe
          backups work too.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <button type="button" className="drill-btn" onClick={download}>
            Download a backup
          </button>
          <label className="drill-btn drill-btn-quiet file-btn">
            Import a backup
            <input
              ref={fileRef}
              type="file"
              accept=".json,application/json"
              className="sr-only"
              onChange={(e) => choose(e.target.files?.[0])}
            />
          </label>
        </div>

        {pending && (
          <div className="confirm-box" role="alertdialog" aria-labelledby="import-q">
            <p id="import-q" className="font-medium">
              {pending.kind === "legacy"
                ? `Import ${pending.learned.length} learned letters from the old Alefbe app${
                    dateOf(pending.exported) ? ` (${dateOf(pending.exported)})` : ""
                  }?`
                : `Replace your current progress with the backup from ${dateOf(pending.exported) ?? "an unknown date"}?`}
            </p>
            <p className="mt-1 text-sm text-muted">
              {pending.kind === "legacy"
                ? "This opens the matching letter groups in the trainer. Nothing else changes."
                : "Your lessons, trainer, tracing and settings in this browser are overwritten."}
            </p>
            <div className="mt-3 flex gap-2">
              <button type="button" className="drill-btn" onClick={confirmImport}>
                {pending.kind === "legacy" ? "Import letters" : "Replace progress"}
              </button>
              <button type="button" className="drill-btn drill-btn-quiet" onClick={() => setPending(null)}>
                Cancel
              </button>
            </div>
          </div>
        )}

        <p role="status" className={message ? `backup-msg ${message.ok ? "quiz-ok" : "quiz-no"}` : "sr-only"}>
          {message?.text}
        </p>
      </section>

      <section className="backup">
        <h2 className="lesson-h2">Start over</h2>
        {confirmReset ? (
          <div className="confirm-box" role="alertdialog" aria-labelledby="reset-q">
            <p id="reset-q" className="font-medium">
              Clear all progress in this browser?
            </p>
            <p className="mt-1 text-sm text-muted">Finished lessons, trainer cards, tracing scores and settings are removed.</p>
            <div className="mt-3 flex gap-2">
              <button type="button" className="drill-btn danger-btn" onClick={reset}>
                Clear everything
              </button>
              <button type="button" className="drill-btn drill-btn-quiet" onClick={() => setConfirmReset(false)}>
                Keep my progress
              </button>
            </div>
          </div>
        ) : (
          <button type="button" className="drill-btn drill-btn-quiet mt-3" onClick={() => setConfirmReset(true)}>
            Clear all progress
          </button>
        )}
      </section>
    </div>
  );
}
