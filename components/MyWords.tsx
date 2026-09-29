"use client";

import Link from "next/link";
import { dayKey } from "@/lib/activity";
import { parseMarkup, translitOf } from "@/lib/markup";
import { useStore } from "@/lib/storage";
import { starKey, starredCsv, starredList } from "@/lib/starred";
import { starredStore } from "@/lib/stores";
import { FaText } from "./FaText";
import { Rich } from "./Rich";
import { StarButton } from "./StarButton";

/** Starred words and examples, with a CSV download for Anki or a spreadsheet. */
export function MyWords() {
  const starred = useStore(starredStore);
  const list = starredList(starred);

  const download = () => {
    const url = URL.createObjectURL(new Blob([starredCsv(starred)], { type: "text/csv;charset=utf-8" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = `alefbe-my-words-${dayKey(new Date())}.csv`;
    a.click();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  if (list.length === 0) {
    return (
      <div className="empty-state mt-4">
        <p className="font-medium">No starred words yet.</p>
        <p className="mt-1 text-sm text-muted">
          Tap the star on a dictionary word, or on an example or dialogue line in a lesson, and it collects here.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="mt-4 flex flex-wrap items-center gap-3">
        <button type="button" className="drill-btn" onClick={download}>
          Download as CSV
        </button>
        <span className="text-sm text-muted">Persian, transliteration, meaning and source, ready for Anki or a spreadsheet.</span>
      </div>
      <ul className="dict-list">
        {list.map((it) => (
          <li key={starKey(it.fa)} className="dict-entry">
            <div className="dict-word has-fa">
              <FaText text={it.fa} translit="none" className="text-2xl" />
              <span className="dict-translit">{translitOf(parseMarkup(it.fa))}</span>
            </div>
            <div className="dict-meaning">
              <p className="has-fa">
                <Rich text={it.en} translit={false} />
              </p>
              {it.written && (
                <p className="text-sm has-fa">
                  <span className="text-muted">Written </span>
                  <FaText text={it.written} translit="none" />
                </p>
              )}
              <p className="dict-meta">
                <StarButton item={it} />
                <Link href={it.href} className="meta-tag">
                  {it.source}
                </Link>
              </p>
            </div>
          </li>
        ))}
      </ul>
    </>
  );
}
