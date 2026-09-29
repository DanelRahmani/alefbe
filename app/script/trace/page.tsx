import type { Metadata } from "next";
import Link from "next/link";
import { Tracer } from "@/components/trace/Tracer";

export const metadata: Metadata = {
  title: "Trace the letters",
  description: "Trace each Persian letter in all four joining forms, guided, in outline or freehand.",
};

export default function TracePage() {
  return (
    <>
      <nav aria-label="Breadcrumb" className="ui breadcrumb">
        <Link href="/script">Script</Link>
        <span aria-hidden="true"> / </span>
        <span>Tracing</span>
      </nav>
      <h1 className="page-title mt-2">Trace the letters</h1>
      <p className="page-lede">
        Trace along the path from the numbered start, following the arrows, and it fills in as you go; then tap the dots.
        Persian is written right to left, so most strokes start at the right. Press “Show me” to watch the stroke order.
      </p>
      <Tracer />
    </>
  );
}
