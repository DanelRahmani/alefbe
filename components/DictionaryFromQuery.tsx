"use client";

import { useSearchParams } from "next/navigation";
import type { DictEntry } from "@/lib/dictionary";
import { DictionaryBrowser } from "./DictionaryBrowser";

/** The dictionary, opened on the word named in the URL (?q=…), as the search palette links it. */
export function DictionaryFromQuery(props: { entries: DictEntry[]; units: { slug: string; label: string }[] }) {
  const q = useSearchParams().get("q") ?? "";
  return <DictionaryBrowser key={q} initialQuery={q} {...props} />;
}
