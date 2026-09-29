"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { lessonsStore } from "@/lib/stores";
import { isTyping } from "../Shortcuts";

/**
 * On a lesson page: remembers it as the lesson to resume, and turns ← and →
 * into the previous and next lesson.
 */
export function LessonKeys({ lessonKey, prev, next }: { lessonKey: string; prev?: string; next?: string }) {
  const router = useRouter();

  useEffect(() => {
    lessonsStore.set((s) => (s.last === lessonKey ? s : { ...s, last: lessonKey }));
  }, [lessonKey]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.altKey || e.ctrlKey || e.metaKey || e.shiftKey || isTyping(e.target) || document.querySelector("dialog[open]")) return;
      const href = e.key === "ArrowLeft" ? prev : e.key === "ArrowRight" ? next : undefined;
      if (!href) return;
      e.preventDefault();
      router.push(href);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [router, prev, next]);

  return null;
}
