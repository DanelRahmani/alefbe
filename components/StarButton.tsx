"use client";

import { useStore } from "@/lib/storage";
import { starKey, toggleStar, type StarredItem } from "@/lib/starred";
import { starredStore } from "@/lib/stores";

type StarProps = { item: Omit<StarredItem, "at">; className?: string };

/** Star or unstar a word or example; starred items collect under "My words" in the dictionary. */
export function StarButton(props: StarProps) {
  const starred = useStore(starredStore);
  return <StarToggle {...props} on={Boolean(starred[starKey(props.item.fa)])} />;
}

/** The star button for a list that reads the starred items once and passes each one its state. */
export function StarToggle({ item, on, className = "tool-btn" }: StarProps & { on: boolean }) {
  return (
    <button
      type="button"
      className={className}
      aria-pressed={on}
      title={on ? "Starred: in My words" : "Star: add to My words"}
      onClick={() => starredStore.set((s) => toggleStar(s, item, Date.now()))}
    >
      <svg viewBox="0 0 20 20" width="16" height="16" aria-hidden="true" focusable="false">
        <path
          d="M10 1.8l2.5 5.2 5.7.8-4.1 4 1 5.6L10 14.7l-5.1 2.7 1-5.6-4.1-4 5.7-.8z"
          fill={on ? "currentColor" : "none"}
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
      </svg>
      <span className="sr-only">Star</span>
    </button>
  );
}
