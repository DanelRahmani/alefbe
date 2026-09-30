import type { Metadata } from "next";
import Link from "next/link";
import { SheetBuilder } from "@/components/trace/SheetBuilder";

export const metadata: Metadata = {
  title: "Tracing sheets",
  description: "Printable tracing sheets for the Persian letters in every joining form, with a key word for each.",
};

export default function SheetsPage() {
  return (
    <>
      <nav aria-label="Breadcrumb" className="ui breadcrumb" data-no-print>
        <Link href="/practice">Practice</Link>
        <span aria-hidden="true"> / </span>
        <span>Tracing sheets</span>
      </nav>
      <div data-no-print>
        <h1 className="page-title mt-2">Tracing sheets</h1>
        <p className="page-lede">
          Handwriting sticks best on paper. Pick the letters, print, and trace each form over the grey copies before
          writing it on your own.
        </p>
      </div>
      <SheetBuilder />
    </>
  );
}
