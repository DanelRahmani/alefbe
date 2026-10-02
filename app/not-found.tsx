import Link from "next/link";

export default function NotFound() {
  return (
    <section className="page-head">
      <h1 className="page-title">This page isn&apos;t here</h1>
      <p className="page-lede">
        The address may have a typo, or the page may have moved. The path, the script and the practice pages are one tap
        away.
      </p>
      <p className="ui quick-links mt-4">
        <Link href="/" className="pill-link">
          The path <span aria-hidden="true">→</span>
        </Link>
        <Link href="/script" className="pill-link">
          The script <span aria-hidden="true">→</span>
        </Link>
        <Link href="/practice" className="pill-link">
          Practice <span aria-hidden="true">→</span>
        </Link>
      </p>
    </section>
  );
}
