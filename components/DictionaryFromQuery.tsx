"use client";

import { useSearchParams } from "next/navigation";
import type { DictEntry } from "@/lib/dictionary";
import { DictionaryBrowser } from "./DictionaryBrowser";

/** The dictionary, opened on the word named in the URL (?q=…) or on My words (?view=mine). */
export function DictionaryFromQuery(props: { entries: DictEntry[]; units: { slug: string; label: string }[] }) {
  const params = useSearchParams();
  const q = params.get("q") ?? "";
  const mine = params.get("view") === "mine";
  return <DictionaryBrowser key={`${q}:${mine}`} initialQuery={q} initialView={mine ? "mine" : "all"} {...props} />;
}
