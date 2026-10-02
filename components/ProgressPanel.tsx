"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { BACKUP_KEYS, STATS_KEYS, applyBackup, backupFileName, makeBackup, parseBackup, type Parsed } from "@/lib/backup";
import { calendar, emptyActivity, quizTotals, streak, totals } from "@/lib/activity";
import { FORM_LABELS, FORMS, LETTERS } from "@/lib/persian/letters";
import { letterMastery } from "@/lib/trace";
import { letterStatus, STATUS_LABEL } from "@/lib/letter-status";
import { useStore } from "@/lib/storage";
import { ALL_STORES, activityStore, applySettings, deckOf, progressStore, settingsStore, srsStore, traceStore } from "@/lib/stores";
import { useMinuteClock } from "./drill/useDrillClock";

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
  const [confirmReset, setConfirmReset] = useState<"all" | "stats" | null>(null);
  const activity = useStore(activityStore);
  const clock = useMinuteClock();
  const now = clock ? new Date(clock) : null;

  const finished = Object.keys(progress).length;
  const soundDeck = deckOf(srs, "sound");
  const learnt = LETTERS.filter((l) => ["learned", "solid"].includes(letterStatus(soundDeck, l.ch))).length;
  const tracedLetters = LETTERS.filter((l) => letterMastery(trace, l.ch)).length;
  const [qRight, qTotal] = quizTotals(activity);
  const sums = totals(activity);
  const exercises = sums.drill + sums.trace + sums.quiz + sums.game;
  const days = now ? streak(activity, now) : 0;
  const weeks = now ? calendar(activity, now, 8) : [];
  const maxDay = Math.max(1, ...weeks.flat().map((d) => d.total));
  const formMax = Math.max(1, ...FORMS.map((f) => activity.forms[f] ?? 0));

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
    setConfirmReset(null);
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
            ? "Imported your old Alefbe progress: the trainer has opened your letters, and your tracing and quiz history is added."
            : "Backup restored: lessons, trainer, tracing and settings.",
      });
    } catch {
      setMessage({ ok: false, text: "The backup couldn't be saved. Your browser may be blocking storage." });
    }
    setPending(null);
  };

  const reset = (what: "all" | "stats") => {
    try {
      (what === "all" ? BACKUP_KEYS : STATS_KEYS).forEach((k) => window.localStorage.removeItem(k));
      // Either way the old app's data stays imported-once, so it doesn't come back on the next visit.
      activityStore.set(() => ({ ...emptyActivity(), legacy: true }));
      refreshAll();
      setMessage({ ok: true, text: what === "all" ? "All progress cleared." : "Statistics cleared. Lessons, trainer and tracing are kept." });
    } catch {
      setMessage({ ok: false, text: "Progress couldn't be cleared. Your browser may be blocking storage." });
    }
    setConfirmReset(null);
  };

  return (
    <div className="ui">
      <dl className="panel stat-list">
        <div className="stat">
          <dt>Lessons finished</dt>
          <dd>
            {finished} <span>of {totalLessons}</span>
          </dd>
        </div>
        <div className="stat">
          <dt>Day streak</dt>
          <dd>
            {days} <span>{days === 1 ? "day" : "days"}</span>
          </dd>
        </div>
        <div className="stat">
          <dt>Letters learned</dt>
          <dd>
            {learnt} <span>of 32</span>
          </dd>
        </div>
        <div className="stat">
          <dt>Letters traced</dt>
          <dd>
            {tracedLetters} <span>of 32</span>
          </dd>
        </div>
        <div className="stat">
          <dt>Quiz accuracy</dt>
          <dd>
            {qTotal ? (
              <>
                {Math.round((100 * qRight) / qTotal)}%<span> of {qTotal}</span>
              </>
            ) : (
              <span>no quiz yet</span>
            )}
          </dd>
        </div>
        <div className="stat">
          <dt>Exercises done</dt>
          <dd>{exercises}</dd>
        </div>
      </dl>

      <section className="backup">
        <h2 className="lesson-h2">The last eight weeks</h2>
        <div
          className="activity-cal"
          role="img"
          aria-label={`Practice on ${weeks.flat().filter((d) => d.total > 0).length} of the last ${weeks.length * 7} days`}
        >
          <div className="activity-days" aria-hidden="true">
            {["Mon", "", "Wed", "", "Fri", "", "Sun"].map((d, i) => (
              <span key={i}>{d}</span>
            ))}
          </div>
          {weeks.map((w, i) => (
            <div key={i} className="activity-week">
              {w.map((d) => (
                <span
                  key={d.key}
                  className={`activity-day${d.future ? " is-future" : ""}${d.total ? " is-on" : ""}`}
                  style={d.total ? { opacity: 0.35 + (0.65 * d.total) / maxDay } : undefined}
                  title={d.future ? undefined : `${d.key}: ${d.total} ${d.total === 1 ? "activity" : "activities"}`}
                />
              ))}
            </div>
          ))}
        </div>
      </section>

      <section className="backup">
        <h2 className="lesson-h2">Letters</h2>
        <p className="mt-1 text-sm text-muted">
          Colour shows the trainer (letter → sound); ✎ shows tracing; the small number is how often you traced the letter.
        </p>
        <ol className="mastery-grid" dir="rtl">
          {LETTERS.map((l) => {
            const st = letterStatus(soundDeck, l.ch);
            const m = letterMastery(trace, l.ch);
            const n = activity.traced[l.ch] ?? 0;
            return (
              <li key={l.ch}>
                <Link
                  href={`/script/${l.slug}`}
                  className={`mastery-tile status-${st}`}
                  aria-label={`${l.name}: ${STATUS_LABEL[st]}${m ? ", traced" : ""}${n ? `, traced ${n} times` : ""}`}
                >
                  <span className="naskh" lang="fa">
                    {l.ch}
                  </span>
                  {m && <span className={`trace-mark trace-${m}`}>✎</span>}
                  {n > 0 && <span className="mastery-count">{n}</span>}
                </Link>
              </li>
            );
          })}
        </ol>
        <h3 className="ui eyebrow mt-6">Tracing by form</h3>
        <ul className="form-bars">
          {FORMS.map((f) => (
            <li key={f}>
              <span>{FORM_LABELS[f]}</span>
              <span className="form-bar" aria-hidden="true">
                <span style={{ width: `${(100 * (activity.forms[f] ?? 0)) / formMax}%` }} />
              </span>
              <span className="tabular-nums">{activity.forms[f] ?? 0}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="backup">
        <h2 className="lesson-h2">Back up and restore</h2>
        <p className="mt-1 text-muted">
          Progress lives in this browser only. Download a backup to keep it safe or move it to another device; old Alefbe
          backups work too.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <button type="button" className="btn" onClick={download}>
            Download a backup
          </button>
          <label className="btn btn-quiet">
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
          <div className="panel panel-accent confirm-box" role="alertdialog" aria-labelledby="import-q">
            <p id="import-q" className="font-medium">
              {pending.kind === "legacy"
                ? `Import your progress from the old Alefbe app (${pending.data.learned.length} learned letters)${
                    dateOf(pending.exported) ? ` (${dateOf(pending.exported)})` : ""
                  }?`
                : `Replace your current progress with the backup from ${dateOf(pending.exported) ?? "an unknown date"}?`}
            </p>
            <p className="mt-1 text-sm text-muted">
              {pending.kind === "legacy"
                ? "This opens the matching letter groups in the trainer and adds your old tracing, quiz and practice history. Nothing is removed."
                : "Your lessons, trainer, tracing and settings in this browser are overwritten."}
            </p>
            <div className="mt-3 flex gap-2">
              <button type="button" className="btn" onClick={confirmImport}>
                {pending.kind === "legacy" ? "Import" : "Replace progress"}
              </button>
              <button type="button" className="btn btn-quiet" onClick={() => setPending(null)}>
                Cancel
              </button>
            </div>
          </div>
        )}

        <p role="status" className={message ? `mt-4 feedback feedback-${message.ok ? "right" : "wrong"}` : "sr-only"}>
          {message?.text}
        </p>
      </section>

      <section className="backup">
        <h2 className="lesson-h2">Start over</h2>
        {confirmReset ? (
          <div className="panel panel-accent confirm-box" role="alertdialog" aria-labelledby="reset-q">
            <p id="reset-q" className="font-medium">
              {confirmReset === "all" ? "Clear all progress in this browser?" : "Clear your statistics?"}
            </p>
            <p className="mt-1 text-sm text-muted">
              {confirmReset === "all"
                ? "Finished lessons, trainer cards, tracing scores, statistics and settings are removed."
                : "The streak, calendar, quiz accuracy, counts and game scores are removed. Lessons, trainer and tracing stay."}
            </p>
            <div className="mt-3 flex gap-2">
              <button type="button" className="btn btn-danger" onClick={() => reset(confirmReset)}>
                {confirmReset === "all" ? "Clear everything" : "Clear statistics"}
              </button>
              <button type="button" className="btn btn-quiet" onClick={() => setConfirmReset(null)}>
                Keep them
              </button>
            </div>
          </div>
        ) : (
          <div className="mt-3 flex flex-wrap gap-2">
            <button type="button" className="btn btn-quiet" onClick={() => setConfirmReset("stats")}>
              Reset statistics
            </button>
            <button type="button" className="btn btn-quiet" onClick={() => setConfirmReset("all")}>
              Clear all progress
            </button>
          </div>
        )}
      </section>
    </div>
  );
}
