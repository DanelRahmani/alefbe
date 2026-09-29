"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

// Each section carries a short Persian word as its mark: the way, letter,
// practice, word, step.
const ITEMS = [
  { href: "/", label: "Path", fa: "راه" },
  { href: "/script", label: "Script", fa: "حرف" },
  { href: "/practice", label: "Practice", fa: "تمرین" },
  { href: "/dictionary", label: "Words", fa: "واژه" },
  { href: "/progress", label: "Progress", fa: "گام" },
];

const isCurrent = (path: string, href: string) =>
  href === "/" ? path === "/" || path.startsWith("/learn") : path === href || path.startsWith(href + "/");

/** The header links, shown on wide screens. */
export function SiteNav() {
  const path = usePathname() ?? "/";
  return (
    <nav aria-label="Main" className="ui site-nav">
      {ITEMS.map((i) => (
        <Link key={i.href} href={i.href} aria-current={isCurrent(path, i.href) ? "page" : undefined}>
          {i.label}
        </Link>
      ))}
    </nav>
  );
}

/**
 * The same sections as a tab bar at the foot of the screen, on phones. It sits
 * outside the header: the header's backdrop blur would make it the tab bar's
 * containing block and pin the bar to the top.
 */
export function TabBar() {
  const path = usePathname() ?? "/";
  return (
    <nav aria-label="Sections" className="ui tab-bar glass">
      {ITEMS.map((i) => (
        <Link key={i.href} href={i.href} aria-current={isCurrent(path, i.href) ? "page" : undefined}>
          <span className="tab-fa" lang="fa" dir="rtl" aria-hidden="true">
            {i.fa}
          </span>
          <span className="tab-label">{i.label}</span>
        </Link>
      ))}
    </nav>
  );
}
