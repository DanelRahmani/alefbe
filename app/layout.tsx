import type { Metadata, Viewport } from "next";
import Link from "next/link";
import { Amiri, Literata, Vazirmatn } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { DisplaySettings } from "@/components/DisplaySettings";
import { PREPAINT_SCRIPT } from "@/lib/prepaint";
import "./globals.css";
import "./components.css";
import "./drill.css";

const literata = Literata({ subsets: ["latin", "latin-ext"], variable: "--font-literata", display: "swap" });
const vazirmatn = Vazirmatn({ subsets: ["arabic", "latin"], variable: "--font-vazirmatn", display: "swap" });
const amiri = Amiri({ weight: ["400", "700"], subsets: ["arabic", "latin"], variable: "--font-amiri", display: "swap" });

export const metadata: Metadata = {
  title: { default: "Alefbe · Learn Persian", template: "%s · Alefbe" },
  description:
    "An example-first course in Iranian Persian: the alphabet, vowel marks, spoken and written grammar, with spaced-repetition drills.",
  icons: { icon: "/favicon.ico", apple: "/icons/icon-192.png" },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f7f3ea" },
    { media: "(prefers-color-scheme: dark)", color: "#0c0e2b" },
  ],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      data-vowels="all"
      data-translit="off"
      data-theme="system"
      suppressHydrationWarning
      className={`${literata.variable} ${vazirmatn.variable} ${amiri.variable}`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: PREPAINT_SCRIPT }} />
      </head>
      <body>
        <a href="#main" className="skip-link ui">
          Skip to content
        </a>
        <header className="site-header">
          <div className="site-header-inner">
            <Link href="/" className="brand">
              Alefbe
            </Link>
            <nav aria-label="Main" className="ui site-nav">
              <Link href="/">Path</Link>
              <Link href="/script">Script</Link>
              <Link href="/progress">Progress</Link>
            </nav>
            <DisplaySettings />
          </div>
        </header>
        <main id="main" className="site-main">
          {children}
        </main>
        <footer className="ui site-footer">
          <p>Iranian Persian, explained in English. Progress is saved in this browser only.</p>
        </footer>
        <Analytics />
      </body>
    </html>
  );
}
