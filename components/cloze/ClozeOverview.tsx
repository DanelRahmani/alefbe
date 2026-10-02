"use client";

import Link from "next/link";
import { clozeStats, type ClozeCard } from "@/lib/cloze";
import { useStore } from "@/lib/storage";
import { clozeStore, progressStore } from "@/lib/stores";
import { useMinuteClock } from "../drill/useDrillClock";

/** The practice hub's card for cloze practice, with its counts. Takes only what counting needs. */
export function ClozeOverview({ cards }: { cards: Pick<ClozeCard, "id" | "lessons">[] }) {
  const data = useStore(clozeStore);
  const progress = useStore(progressStore);
  const now = useMinuteClock();
  const s = clozeStats(cards, data, progress, now);
  return (
    <ul className="drill-modes">
      <li>
        <Link href="/practice/cloze" className="panel card-link">
          <span className="drill-mode-title">Cloze practice</span>
          <span className="drill-mode-blurb">Fill the gap in a lesson&apos;s example line, from its English.</span>
          <span className="ui drill-mode-stats">
            {s.fresh + s.seen} of {cards.length} lines met · {s.due} due · {s.fresh} new
          </span>
        </Link>
      </li>
    </ul>
  );
}
