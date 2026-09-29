import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Game } from "@/components/games/Game";
import { GAMES, type GameId } from "@/lib/games";

export const dynamicParams = false;

export function generateStaticParams() {
  return GAMES.map((g) => ({ game: g.id }));
}

export async function generateMetadata({ params }: PageProps<"/practice/games/[game]">): Promise<Metadata> {
  const { game } = await params;
  const g = GAMES.find((x) => x.id === game);
  return g ? { title: `${g.title} · Games`, description: g.blurb } : {};
}

export default async function GamePage({ params }: PageProps<"/practice/games/[game]">) {
  const { game } = await params;
  const g = GAMES.find((x) => x.id === game);
  if (!g) notFound();
  return (
    <>
      <nav aria-label="Breadcrumb" className="ui breadcrumb">
        <Link href="/practice">Practice</Link>
        <span aria-hidden="true"> / </span>
        <span>Games</span>
      </nav>
      <h1 className="page-title mt-2">{g.title}</h1>
      <nav aria-label="Games" className="ui mode-tabs">
        {GAMES.map((x) => (
          <Link key={x.id} href={`/practice/games/${x.id}`} aria-current={x.id === game ? "page" : undefined}>
            {x.title}
          </Link>
        ))}
      </nav>
      <Game key={g.id} id={g.id as GameId} />
    </>
  );
}
