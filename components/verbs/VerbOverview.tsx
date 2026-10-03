"use client";

import Link from "next/link";
import { useStore } from "@/lib/storage";
import { progressStore, verbsStore } from "@/lib/stores";
import { DATA_URL } from "@/lib/data-urls";
import { verbTotalsFrom, type DueData } from "@/lib/due";
import { useStaticData } from "@/lib/static-data";
import { useMinuteClock } from "../drill/useDrillClock";

/** The practice hub's card for the conjugation trainer, with its counts across the open tenses. */
export function VerbOverview() {
  const data = useStore(verbsStore);
  const progress = useStore(progressStore);
  const now = useMinuteClock();
  const dueData = useStaticData<DueData>(DATA_URL.due).data;
  const t = dueData && verbTotalsFrom(dueData, data, progress, now);
  return (
    <ul className="drill-modes">
      <li>
        <Link href="/verbs" className="panel card-link">
          <span className="drill-mode-title">Verb trainer</span>
          <span className="drill-mode-blurb">A verb, a person, spoken or written: type the form, one tense at a time.</span>
          <span className="ui drill-mode-stats">
            {dueData && t ? `${t.open} of ${dueData.tenses.length} tenses open · ${t.due} due · ${t.fresh} new` : " "}
          </span>
        </Link>
      </li>
    </ul>
  );
}
