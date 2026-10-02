"use client";

import Link from "next/link";
import { useStore } from "@/lib/storage";
import { mistakesStore } from "@/lib/stores";

/** The practice hub's link to the mistake notebook, with how many items wait there. */
export function MistakesCard() {
  const n = Object.keys(useStore(mistakesStore)).length;
  return (
    <Link href="/practice/mistakes" className="panel card-link">
      <span className="drill-mode-title">
        Mistake notebook{" "}
        {n > 0 && (
          <span className="pill-count" aria-label={`${n} waiting`}>
            {n}
          </span>
        )}
      </span>
      <span className="drill-mode-blurb">
        {n > 0 ? "Go over what you got wrong until you get it right twice." : "Wrong answers from anywhere collect here."}
      </span>
    </Link>
  );
}
