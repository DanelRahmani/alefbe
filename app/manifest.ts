import type { MetadataRoute } from "next";

export const dynamic = "force-static";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Alefbe · Learn Persian",
    short_name: "Alefbe",
    description: "An example-first course in Iranian Persian: the alphabet, vowel marks, spoken and written grammar.",
    start_url: "/",
    scope: "/",
    display: "standalone",
    orientation: "portrait",
    lang: "en",
    categories: ["education"],
    background_color: "#f7f3ea",
    theme_color: "#1f4aa8",
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
    ],
    shortcuts: [
      { name: "Letter trainer", url: "/practice/drill/sound", description: "Review the letters that are due" },
      { name: "Trace letters", url: "/practice/trace", description: "Practise writing the letters" },
      { name: "Letter quiz", url: "/practice/quiz", description: "A quick round on the letters" },
      { name: "Dictionary", url: "/dictionary", description: "Look up a word" },
    ],
  };
}
