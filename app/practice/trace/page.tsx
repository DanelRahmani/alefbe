import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { Tracer } from "@/components/trace/Tracer";
import { TraceFromQuery } from "@/components/trace/TraceFromQuery";

export const metadata: Metadata = {
  title: "Trace the letters",
  description: "Trace each Persian letter in all four joining forms, guided, in outline or freehand.",
};

export default function TracePage() {
  return (
    <>
      <nav aria-label="Breadcrumb" className="ui breadcrumb">
        <Link href="/practice">Practice</Link>
        <span aria-hidden="true"> / </span>
        <span>Tracing</span>
      </nav>
      <h1 className="page-title mt-2">Trace the letters</h1>
      <p className="page-lede">
        Trace along the path from the numbered start, following the arrows, and it fills in as you go; then tap the dots.
        Persian is written right to left, so most strokes start at the right. Press “Show me” to watch the stroke order.
      </p>
      <p className="ui mt-3">
        <Link href="/practice/trace/session" className="pill-link">
          Start a tracing session <span aria-hidden="true">→</span>
        </Link>
      </p>
      <Suspense fallback={<Tracer />}>
        <TraceFromQuery />
      </Suspense>
    </>
  );
}
