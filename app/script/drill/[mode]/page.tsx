import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Drill } from "@/components/drill/Drill";
import { MODES, type DrillMode } from "@/lib/drill";

export const dynamicParams = false;

export function generateStaticParams() {
  return MODES.map((m) => ({ mode: m.id }));
}

export async function generateMetadata({ params }: PageProps<"/script/drill/[mode]">): Promise<Metadata> {
  const { mode } = await params;
  const m = MODES.find((x) => x.id === mode);
  return m ? { title: `${m.title} · Script trainer` } : {};
}

export default async function DrillPage({ params }: PageProps<"/script/drill/[mode]">) {
  const { mode } = await params;
  const m = MODES.find((x) => x.id === mode);
  if (!m) notFound();
  return (
    <>
      <nav aria-label="Breadcrumb" className="ui breadcrumb">
        <Link href="/script">Script</Link>
        <span aria-hidden="true"> / </span>
        <span>Trainer</span>
      </nav>
      <h1 className="page-title mt-2">{m.title}</h1>
      <nav aria-label="Drill modes" className="ui mode-tabs">
        {MODES.map((x) => (
          <Link key={x.id} href={`/script/drill/${x.id}`} aria-current={x.id === mode ? "page" : undefined}>
            {x.title}
          </Link>
        ))}
      </nav>
      <Drill key={mode} mode={mode as DrillMode} />
    </>
  );
}
