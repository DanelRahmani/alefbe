"use client";

import Link from "next/link";
import { clozeStats } from "@/lib/cloze";
import type { PracticeCards } from "@/content/static-data";
import { DATA_URL } from "@/lib/data-urls";
import { useStaticData } from "@/lib/static-data";
import { useStore } from "@/lib/storage";
import { clozeStore, progressStore } from "@/lib/stores";
import { useMinuteClock } from "../drill/useDrillClock";

/** The practice hub's card for cloze practice, with its counts. Its cards come from /data/practice-cards.json. */
export function ClozeOverview() {
  const cards = useStaticData<PracticeCards>(DATA_URL.practiceCards).data?.cloze;
  const data = useStore(clozeStore);
  const progress = useStore(progressStore);
  const now = useMinuteClock();
  const s = cards && clozeStats(cards, data, progress, now);
  return (
    <ul className="drill-modes">
      <li>
        <Link href="/practice/cloze" className="panel card-link">
          <span className="drill-mode-title">Cloze practice</span>
          <span className="drill-mode-blurb">Fill the gap in a lesson&apos;s example line, from its English.</span>
          <span className="ui drill-mode-stats">
            {cards && s ? `${s.fresh + s.seen} of ${cards.length} lines met · ${s.due} due · ${s.fresh} new` : "\u00a0"}
          </span>
        </Link>
      </li>
    </ul>
  );
}
