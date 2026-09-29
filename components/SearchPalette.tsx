"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useId, useRef, useState } from "react";
import { KIND_TITLES, search, type SearchItem } from "@/lib/search";
import { isTyping } from "./Shortcuts";

let cached: Promise<SearchItem[]> | null = null;
/** The search index, fetched once on first use (it is a static file). */
export const loadSearchIndex = () =>
  (cached ??= fetch("/search-index.json")
    .then((r) => (r.ok ? r.json() : []))
    .catch(() => {
      cached = null;
      return [];
    }));

/** Search everything: `/` or Ctrl+K opens it; arrows move, Enter opens, Esc closes. */
export function SearchPalette() {
  const router = useRouter();
  const id = useId();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [items, setItems] = useState<SearchItem[] | null>(null);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);

  const open = useCallback(() => {
    const d = dialogRef.current;
    if (!d || d.open) return;
    d.showModal();
    inputRef.current?.focus();
    loadSearchIndex().then(setItems);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.key === "k" || e.key === "K") && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        open();
      } else if (e.key === "/" && !isTyping(e.target) && !e.altKey && !e.ctrlKey && !e.metaKey) {
        e.preventDefault();
        open();
      }
    };
    const onOpen = () => open();
    window.addEventListener("keydown", onKey);
    window.addEventListener("alefbe:search", onOpen);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("alefbe:search", onOpen);
    };
  }, [open]);

  const groups = items && query.trim() ? search(items, query) : [];
  const flat = groups.flatMap((g) => g.items);
  const current = Math.min(active, Math.max(0, flat.length - 1));

  const close = () => dialogRef.current?.close();
  const go = (item: SearchItem) => {
    close();
    router.push(item.href);
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((a) => Math.min(flat.length - 1, a + 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((a) => Math.max(0, a - 1));
    } else if (e.key === "Enter" && flat[current]) {
      e.preventDefault();
      go(flat[current]);
    }
  };

  // Each group's first index in the flat list, for arrow-key navigation.
  const offsets = groups.map((_, gi) => groups.slice(0, gi).reduce((sum, g) => sum + g.items.length, 0));
  return (
    <>
      <button type="button" className="ui header-btn" onClick={open} aria-keyshortcuts="/ Control+K">
        <svg viewBox="0 0 20 20" width="16" height="16" aria-hidden="true" focusable="false">
          <circle cx="8.5" cy="8.5" r="5.5" fill="none" stroke="currentColor" strokeWidth="1.8" />
          <path d="M12.6 12.6 17 17" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
        <span className="header-btn-label">Search</span>
        <kbd className="header-kbd">/</kbd>
      </button>
      <dialog
        ref={dialogRef}
        className="ui search-dialog"
        aria-label="Search the course"
        onClose={() => {
          setQuery("");
          setActive(0);
        }}
        onClick={(e) => {
          if (e.target === e.currentTarget) close();
        }}
      >
        <div className="search-box">
          <input
            ref={inputRef}
            type="search"
            className="search-input"
            placeholder="Lessons, letters, words: in Persian, transliteration or English"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setActive(0);
            }}
            onKeyDown={onKeyDown}
            role="combobox"
            aria-expanded={flat.length > 0}
            aria-controls={`${id}-results`}
            aria-activedescendant={flat.length ? `${id}-opt-${current}` : undefined}
            aria-autocomplete="list"
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            spellCheck={false}
          />
          <button type="button" className="search-close" onClick={close} aria-label="Close search">
            Esc
          </button>
        </div>
        <div id={`${id}-results`} role="listbox" aria-label="Results" className="search-results">
          {!items && query && <p className="search-empty">Loading…</p>}
          {items && query.trim() && flat.length === 0 && (
            <p className="search-empty">Nothing matches “{query}”. Try fewer letters, or search in English.</p>
          )}
          {!query.trim() && (
            <p className="search-empty">
              Try <em>ketab</em>, کتاب, <em>past tense</em> or <em>tracing</em>. Use ↑ ↓ and Enter.
            </p>
          )}
          {groups.map((g, gi) => (
            <div key={g.kind} role="group" aria-label={KIND_TITLES[g.kind]}>
              <p className="search-group">{KIND_TITLES[g.kind]}</p>
              {g.items.map((item, ii) => {
                const i = offsets[gi] + ii;
                return (
                  <div
                    key={`${item.kind}:${item.href}`}
                    id={`${id}-opt-${i}`}
                    role="option"
                    aria-selected={i === current}
                    className="search-option"
                    onMouseMove={() => setActive(i)}
                    onClick={() => go(item)}
                  >
                    {item.fa && (
                      <span className="search-fa fa" lang="fa" dir="rtl">
                        {item.fa}
                      </span>
                    )}
                    <span className="search-text">
                      <span className="search-title">{item.title}</span>
                      {item.sub && <span className="search-sub">{item.sub}</span>}
                    </span>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </dialog>
    </>
  );
}
