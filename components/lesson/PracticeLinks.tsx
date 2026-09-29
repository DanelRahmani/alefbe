"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { DRILL_GROUPS, letterByChar, type Letter } from "@/lib/persian/letters";
import { practiceUiStore } from "@/lib/stores";
import { Rich } from "../Rich";

/** The end of a letter lesson: ways to practise exactly these letters. */
export function PracticeLinks({ group, text }: { group: number; text?: string }) {
  const router = useRouter();
  const chars = DRILL_GROUPS[group] ?? [];
  const letters = chars.map((c) => letterByChar.get(c)).filter((l): l is Letter => l !== undefined);
  const digits = letters.length === 0;

  const quiz = () => {
    practiceUiStore.set((u) => ({ ...u, quiz: { ...u.quiz, scope: `g${group}` } }));
    router.push("/practice/quiz");
  };

  return (
    <section className="practice-links glass" aria-label={digits ? "Practise the digits" : "Practise these letters"}>
      <p className="ui eyebrow">Practise {digits ? "the digits" : "these letters"}</p>
      <p className="practice-chars naskh" lang="fa" dir="rtl">
        {chars.join(" ")}
      </p>
      {text && (
        <p className="has-fa mt-1">
          <Rich text={text} />
        </p>
      )}
      <div className="ui practice-actions">
        <Link href="/practice/drill/sound" className="drill-btn">
          Letter trainer
        </Link>
        {!digits && (
          <>
            <button type="button" className="drill-btn drill-btn-quiet" onClick={quiz}>
              Quiz on these
            </button>
            <Link href={`/practice/trace?letter=${letters[0].slug}`} className="drill-btn drill-btn-quiet">
              Trace them
            </Link>
            <Link href="/practice#games" className="drill-btn drill-btn-quiet">
              Games
            </Link>
          </>
        )}
      </div>
    </section>
  );
}
