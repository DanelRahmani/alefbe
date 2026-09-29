import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Alefbe · Learn Persian",
  description:
    "An example-first course in Iranian Persian: the alphabet, vowel marks, spoken and written grammar, with spaced-repetition drills.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en">
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
