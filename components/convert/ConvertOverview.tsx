"use client";

import Link from "next/link";
import { convertCards, convertStats } from "@/lib/convert";
import type { PracticeCards } from "@/content/static-data";
import { DATA_URL } from "@/lib/data-urls";
import { useStaticData } from "@/lib/static-data";
import { useStore } from "@/lib/storage";
import { convertStore, progressStore } from "@/lib/stores";
import { useMinuteClock } from "../drill/useDrillClock";

/** The practice hub's card for the spoken ↔ written drill, with counts for the direction practised last. */
export function ConvertOverview() {
  const cards = useStaticData<PracticeCards>(DATA_URL.practiceCards).data?.convert;
  const data = useStore(convertStore);
  const progress = useStore(progressStore);
  const now = useMinuteClock();
  const s = cards && convertStats(cards, data, data.dir, progress, now);
  const due = cards && s ? convertStats(cards, data, data.dir === "to-written" ? "to-spoken" : "to-written", progress, now).due + s.due : 0;
  return (
    <ul className="drill-modes">
      <li>
        <Link href="/practice/convert" className="panel card-link">
          <span className="drill-mode-title">Spoken and written</span>
          <span className="drill-mode-blurb">See a lesson line as it is said; type it as it is written, or the other way round.</span>
          <span className="drill-mode-blurb">Unit 12, “Spoken and written”, gathers the rules.</span>
          <span className="ui drill-mode-stats">
            {cards && s ? `${s.fresh + s.seen} of ${convertCards(cards, data.dir).length} lines met · ${due} due · ${s.fresh} new` : "\u00a0"}
          </span>
        </Link>
      </li>
    </ul>
  );
}
