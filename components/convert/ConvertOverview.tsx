"use client";

import Link from "next/link";
import { convertCards, convertStats, type ConvertCard } from "@/lib/convert";
import { useStore } from "@/lib/storage";
import { convertStore, progressStore } from "@/lib/stores";
import { useMinuteClock } from "../drill/useDrillClock";

/** The practice hub's card for the spoken ↔ written drill, with counts for the direction practised last. */
export function ConvertOverview({ cards }: { cards: Pick<ConvertCard, "id" | "lessons" | "only">[] }) {
  const data = useStore(convertStore);
  const progress = useStore(progressStore);
  const now = useMinuteClock();
  const s = convertStats(cards, data, data.dir, progress, now);
  const due = convertStats(cards, data, data.dir === "to-written" ? "to-spoken" : "to-written", progress, now).due + s.due;
  return (
    <ul className="drill-modes">
      <li>
        <Link href="/practice/convert" className="panel card-link">
          <span className="drill-mode-title">Spoken and written</span>
          <span className="drill-mode-blurb">See a lesson line as it is said; type it as it is written, or the other way round.</span>
          <span className="drill-mode-blurb">Unit 12, “Spoken and written”, gathers the rules.</span>
          <span className="ui drill-mode-stats">
            {s.fresh + s.seen} of {convertCards(cards, data.dir).length} lines met · {due} due · {s.fresh} new
          </span>
        </Link>
      </li>
    </ul>
  );
}
