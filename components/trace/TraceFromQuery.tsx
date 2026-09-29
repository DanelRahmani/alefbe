"use client";

import { useSearchParams } from "next/navigation";
import { FORMS, LETTERS, formsOf, letterBySlug, type Form } from "@/lib/persian/letters";
import { TRACE_LEVELS, type TraceLevel } from "@/lib/trace";
import { Tracer } from "./Tracer";

/** The tracer, opened on the letter, form and level named in the URL (?letter=be&form=initial). */
export function TraceFromQuery() {
  const q = useSearchParams();
  const letter = letterBySlug.get(q.get("letter") ?? "");
  const index = letter ? LETTERS.indexOf(letter) : 0;
  const f = q.get("form") as Form | null;
  const form: Form = f && FORMS.includes(f) && formsOf(LETTERS[index]).includes(f) ? f : "isolated";
  const lv = q.get("level") as TraceLevel | null;
  const level = TRACE_LEVELS.some((l) => l.id === lv) ? lv! : undefined;
  return <Tracer key={`${index}:${form}:${level}`} initial={{ index, form, level }} />;
}
