import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Drill } from "@/components/drill/Drill";
import { MODES, type DrillMode } from "@/lib/drill";

export const dynamicParams = false;

export function generateStaticParams() {
  return MODES.map((m) => ({ mode: m.id }));
}

export async function generateMetadata({ params }: PageProps<"/practice/drill/[mode]">): Promise<Metadata> {
  const { mode } = await params;
  const m = MODES.find((x) => x.id === mode);
  return m ? { title: `${m.title} · Letter trainer` } : {};
}

export default async function DrillPage({ params }: PageProps<"/practice/drill/[mode]">) {
  const { mode } = await params;
  const m = MODES.find((x) => x.id === mode);
  if (!m) notFound();
  return (
    <>
      <nav aria-label="Breadcrumb" className="ui breadcrumb">
        <Link href="/practice">Practice</Link>
        <span aria-hidden="true"> / </span>
        <span>Letter trainer</span>
      </nav>
      <h1 className="page-title mt-2">{m.title}</h1>
      <nav aria-label="Trainer modes" className="ui chips mt-4 mb-5">
        {MODES.map((x) => (
          <Link key={x.id} href={`/practice/drill/${x.id}`} className="chip" aria-current={x.id === mode ? "page" : undefined}>
            {x.title}
          </Link>
        ))}
      </nav>
      <Drill key={mode} mode={mode as DrillMode} />
    </>
  );
}
