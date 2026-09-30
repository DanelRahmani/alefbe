"use client";

import Link from "next/link";
import { TENSES } from "@/lib/conjugate";
import { useStore } from "@/lib/storage";
import { progressStore, verbsStore } from "@/lib/stores";
import { verbTotals } from "@/lib/verb-drill";
import { useMinuteClock } from "../drill/useDrillClock";

/** The practice hub's card for the conjugation trainer, with its counts across the open tenses. */
export function VerbOverview() {
  const data = useStore(verbsStore);
  const progress = useStore(progressStore);
  const now = useMinuteClock();
  const t = verbTotals(data, progress, now);
  return (
    <ul className="drill-modes">
      <li>
        <Link href="/verbs" className="drill-mode">
          <span className="drill-mode-title">Verb trainer</span>
          <span className="drill-mode-blurb">A verb, a person, spoken or written: type the form, one tense at a time.</span>
          <span className="ui drill-mode-stats">
            {t.open} of {TENSES.length} tenses open · {t.due} due · {t.fresh} new
          </span>
        </Link>
      </li>
    </ul>
  );
}
