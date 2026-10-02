"use client";

import Link from "next/link";
import { DRILL_GROUPS, MODES, drillCandidates } from "@/lib/drill";
import { deckStats } from "@/lib/srs";
import { useStore } from "@/lib/storage";
import { deckOf, srsStore } from "@/lib/stores";
import { useMinuteClock } from "./useDrillClock";

export function DrillOverview() {
  const data = useStore(srsStore);
  const now = useMinuteClock();

  return (
    <ul className="drill-modes">
      {MODES.map((m) => {
        const deck = deckOf(data, m.id);
        const cands = drillCandidates(m.id, data.decks);
        const s = deckStats(cands, deck, now);
        return (
          <li key={m.id}>
            <Link href={`/practice/drill/${m.id}`} className="panel card-link">
              <span className="drill-mode-title">{m.title}</span>
              <span className="drill-mode-blurb">{m.blurb}</span>
              <span className="ui drill-mode-stats">
                {m.kind === "letters" ? `${deck.unlocked} of ${DRILL_GROUPS.length} groups open` : `${cands.length} words`}
                {" · "}
                {s.due} due · {s.fresh} new
              </span>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
