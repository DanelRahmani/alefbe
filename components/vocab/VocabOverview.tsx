"use client";

import Link from "next/link";
import { useStore } from "@/lib/storage";
import { progressStore, vocabStore } from "@/lib/stores";
import { vocabStats, type VocabCard } from "@/lib/vocab";
import { useMinuteClock } from "../drill/useDrillClock";

/** The practice hub's card for the vocabulary deck, with its counts. Takes only what counting needs. */
export function VocabOverview({ cards }: { cards: Pick<VocabCard, "id" | "lessons">[] }) {
  const data = useStore(vocabStore);
  const progress = useStore(progressStore);
  const now = useMinuteClock();
  const s = vocabStats(cards, data, progress, now);
  const met = s.fresh + s.seen;
  return (
    <ul className="drill-modes">
      <li>
        <Link href="/vocab" className="drill-mode">
          <span className="drill-mode-title">Vocabulary deck</span>
          <span className="drill-mode-blurb">See the English, type the Persian: the words of every lesson you have done.</span>
          <span className="ui drill-mode-stats">
            {met} of {cards.length} words met · {s.due} due · {s.fresh} new
          </span>
        </Link>
      </li>
    </ul>
  );
}
