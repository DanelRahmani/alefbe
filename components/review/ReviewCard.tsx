"use client";

import Link from "next/link";
import { useStore } from "@/lib/storage";
import { clozeStore, convertStore, mistakesStore, srsStore, verbsStore, vocabStore } from "@/lib/stores";
import { reviewsDue } from "@/lib/today";
import { useMinuteClock } from "../drill/useDrillClock";

/** The practice hub's link to the review queue, with how many cards are due and how many mistakes wait. */
export function ReviewCard() {
  const now = useMinuteClock();
  const srs = useStore(srsStore);
  const verbs = useStore(verbsStore);
  const vocab = useStore(vocabStore);
  const cloze = useStore(clozeStore);
  const convert = useStore(convertStore);
  const mistakes = Object.keys(useStore(mistakesStore)).length;
  const due = now ? reviewsDue(srs.decks, now, verbs, { data: vocab, known: null }, { cloze, convert }).total : 0;
  const n = due + mistakes;
  return (
    <Link href="/practice/review" className="drill-mode">
      <span className="drill-mode-title">
        Review everything due{" "}
        {n > 0 && (
          <span className="pill-count" aria-label={`${n} waiting`}>
            {n}
          </span>
        )}
      </span>
      <span className="drill-mode-blurb">
        {n > 0
          ? `${due} ${due === 1 ? "card" : "cards"} due across the decks, and ${mistakes} in the mistake notebook, in one session.`
          : "Cards due in every deck, then the mistake notebook, in one session."}
      </span>
    </Link>
  );
}
