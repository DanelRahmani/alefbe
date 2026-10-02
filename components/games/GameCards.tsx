"use client";

import Link from "next/link";
import { GAMES } from "@/lib/games";
import { useStore } from "@/lib/storage";
import { gamesStore } from "@/lib/stores";

export function GameCards() {
  const games = useStore(gamesStore);
  return (
    <ul className="drill-modes">
      {GAMES.map((g) => (
        <li key={g.id}>
          <Link href={`/practice/games/${g.id}`} className="panel card-link">
            <span className="drill-mode-title">
              {g.title}{" "}
              <span className="fa text-muted" lang="fa" dir="rtl" aria-hidden="true">
                {g.fa}
              </span>
            </span>
            <span className="drill-mode-blurb">{g.blurb}</span>
            <span className="ui drill-mode-stats">{games[g.id] ? `Best ${games[g.id].best}%` : "Not played yet"}</span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
