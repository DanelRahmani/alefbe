"use client";

import Link from "next/link";
import { useStore } from "@/lib/storage";
import { progressStore, vocabStore } from "@/lib/stores";
import { vocabStats } from "@/lib/vocab";
import type { PracticeCards } from "@/content/static-data";
import { DATA_URL } from "@/lib/data-urls";
import { useStaticData } from "@/lib/static-data";
import { useMinuteClock } from "../drill/useDrillClock";

/** The practice hub's card for the vocabulary deck, with its counts. Its cards come from /data/practice-cards.json. */
export function VocabOverview() {
  const cards = useStaticData<PracticeCards>(DATA_URL.practiceCards).data?.vocab;
  const data = useStore(vocabStore);
  const progress = useStore(progressStore);
  const now = useMinuteClock();
  const s = cards && vocabStats(cards, data, progress, now);
  return (
    <ul className="drill-modes">
      <li>
        <Link href="/vocab" className="panel card-link">
          <span className="drill-mode-title">Vocabulary deck</span>
          <span className="drill-mode-blurb">See the English, type the Persian: the words of every lesson you have done.</span>
          <span className="ui drill-mode-stats">
            {cards && s ? `${s.fresh + s.seen} of ${cards.length} words met · ${s.due} due · ${s.fresh} new` : "\u00a0"}
          </span>
        </Link>
      </li>
    </ul>
  );
}
