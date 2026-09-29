import type { Metadata, Viewport } from "next";
import Link from "next/link";
import { Amiri, Literata, Markazi_Text, Vazirmatn } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { DisplaySettings } from "@/components/DisplaySettings";
import { LegacyMigration } from "@/components/LegacyMigration";
import { Orosi } from "@/components/Orosi";
import { ServiceWorker } from "@/components/ServiceWorker";
import { SiteNav, TabBar } from "@/components/SiteNav";
import { PREPAINT_SCRIPT } from "@/lib/prepaint";
import "./globals.css";
import "./components.css";
import "./drill.css";
import "./practice.css";

const literata = Literata({ subsets: ["latin", "latin-ext"], variable: "--font-literata", display: "swap" });
const vazirmatn = Vazirmatn({ subsets: ["arabic", "latin"], variable: "--font-vazirmatn", display: "swap" });
const amiri = Amiri({ weight: ["400", "700"], subsets: ["arabic", "latin"], variable: "--font-amiri", display: "swap" });
// Display face: designed for Persian (Borna Izadpanah), with a matching Latin.
const markazi = Markazi_Text({ subsets: ["arabic", "latin"], variable: "--font-markazi", display: "swap" });

export const metadata: Metadata = {
  title: { default: "Alefbe · Learn Persian", template: "%s · Alefbe" },
  description:
    "An example-first course in Iranian Persian: the alphabet, vowel marks, spoken and written grammar, with spaced-repetition drills.",
  icons: { icon: "/favicon.ico", apple: "/icons/icon-192.png" },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f3f4f8" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0c22" },
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
      className={`${literata.variable} ${vazirmatn.variable} ${amiri.variable} ${markazi.variable}`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: PREPAINT_SCRIPT }} />
      </head>
      <body>
        <Orosi />
        <a href="#main" className="skip-link ui">
          Skip to content
        </a>
        <header className="site-header glass">
          <div className="site-header-inner">
            <Link href="/" className="brand">
              <span className="brand-mark khatam naskh" aria-hidden="true">
                ا
              </span>
              Alefbe
            </Link>
            <SiteNav />
            <span className="header-spacer" />
            <DisplaySettings />
          </div>
        </header>
        <main id="main" className="site-main">
          {children}
        </main>
        <footer className="ui site-footer">
          <div className="star-rule" aria-hidden="true">
            <span className="khatam" />
          </div>
          <p>Iranian Persian, explained in English. Progress is saved in this browser only.</p>
        </footer>
        <TabBar />
        <LegacyMigration />
        <ServiceWorker />
        <Analytics />
      </body>
    </html>
  );
}
