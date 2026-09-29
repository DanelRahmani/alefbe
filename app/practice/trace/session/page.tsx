import type { Metadata } from "next";
import Link from "next/link";
import { TraceSession } from "@/components/trace/TraceSession";

export const metadata: Metadata = {
  title: "Tracing session",
  description: "Trace a set of Persian letters in their joining forms, one after another, and see how each went.",
};

export default function TraceSessionPage() {
  return (
    <>
      <nav aria-label="Breadcrumb" className="ui breadcrumb">
        <Link href="/practice">Practice</Link>
        <span aria-hidden="true"> / </span>
        <Link href="/practice/trace">Tracing</Link>
        <span aria-hidden="true"> / </span>
        <span>Session</span>
      </nav>
      <h1 className="page-title mt-2">Tracing session</h1>
      <p className="page-lede">
        Pick letters and forms, then trace them one after another. Each form moves on once it passes; at the end you see
        how every one went.
      </p>
      <TraceSession />
    </>
  );
}
