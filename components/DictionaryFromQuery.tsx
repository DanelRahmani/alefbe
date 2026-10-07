"use client";

import { useSearchParams } from "next/navigation";
import { DictionaryBrowser, type DictionaryProps } from "./DictionaryBrowser";

/** The dictionary, opened on the word named in the URL (?q=…) or on My words (?view=mine). */
export function DictionaryFromQuery(props: DictionaryProps) {
  const params = useSearchParams();
  const q = params.get("q") ?? "";
  const mine = params.get("view") === "mine";
  return <DictionaryBrowser key={`${q}:${mine}`} initialQuery={q} initialView={mine ? "mine" : "all"} {...props} />;
}
