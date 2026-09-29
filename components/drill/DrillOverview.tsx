"use client";

import Link from "next/link";
import { DRILL_GROUPS, MODES, wordsFor } from "@/lib/drill";
import { deckStats, unlockedIds } from "@/lib/srs";
import { useStore } from "@/lib/storage";
import { deckOf, srsStore } from "@/lib/stores";
import { useLegacyMigration, useMinuteClock } from "./useDrillClock";

export function DrillOverview() {
  const data = useStore(srsStore);
  const now = useMinuteClock();
  useLegacyMigration();
  const letters = new Set(unlockedIds(DRILL_GROUPS, deckOf(data, "sound")));

  return (
    <ul className="drill-modes">
      {MODES.map((m) => {
        const deck = deckOf(data, m.id);
        const cands = m.kind === "letters" ? unlockedIds(DRILL_GROUPS, deck) : wordsFor(letters).map((w) => w.id);
        const s = deckStats(cands, deck, now);
        return (
          <li key={m.id}>
            <Link href={`/script/drill/${m.id}`} className="drill-mode">
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
