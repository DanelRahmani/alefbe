"use client";

import Link from "next/link";
import { deckStats } from "@/lib/srs";
import { useStore } from "@/lib/storage";
import { verbsStore } from "@/lib/stores";
import { deckFor, verbCandidates, verbGroups } from "@/lib/verb-drill";
import { useMinuteClock } from "../drill/useDrillClock";

/** The practice hub's card for the conjugation trainer, with its counts. */
export function VerbOverview() {
  const data = useStore(verbsStore);
  const now = useMinuteClock();
  const deck = deckFor(data, "present");
  const s = deckStats(verbCandidates(data, "present"), deck, now);
  return (
    <ul className="drill-modes">
      <li>
        <Link href="/verbs" className="drill-mode">
          <span className="drill-mode-title">Verb trainer</span>
          <span className="drill-mode-blurb">A verb, a person, spoken or written: type the present-tense form.</span>
          <span className="ui drill-mode-stats">
            {deck.unlocked} of {verbGroups("present").length} verb groups open · {s.due} due · {s.fresh} new
          </span>
        </Link>
      </li>
    </ul>
  );
}
