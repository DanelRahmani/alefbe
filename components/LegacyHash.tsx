"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

// The old single-page app's views were hash links (its manifest's shortcuts
// pointed at /index.html#trace and #quiz); send them to their new homes.
const OLD_VIEWS: Record<string, string> = {
  learn: "/script",
  trace: "/practice/trace",
  practice: "/practice/trace/session",
  quiz: "/practice/quiz",
  phonics: "/practice/games/sounds",
  games: "/practice#games",
  dict: "/dictionary",
  ref: "/script#marks",
  grammar: "/grammar",
  progress: "/progress",
  stats: "/progress",
};

export function LegacyHash() {
  const router = useRouter();
  useEffect(() => {
    const to = OLD_VIEWS[window.location.hash.slice(1)];
    if (to) router.replace(to);
  }, [router]);
  return null;
}
