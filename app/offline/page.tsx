import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "Offline", robots: { index: false } };

export default function OfflinePage() {
  return (
    <section className="page-head">
      <p className="ui eyebrow">Offline</p>
      <h1 className="page-title">You are offline</h1>
      <p className="page-lede">
        This page hasn&apos;t been saved on this device yet. Pages you have opened before work without a connection, and so
        does your progress, which lives in this browser.
      </p>
      <p className="ui mt-4">
        <Link href="/" className="pill-link">
          Back to the path <span aria-hidden="true">→</span>
        </Link>
      </p>
    </section>
  );
}
