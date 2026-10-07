"use client";

import { useRouter } from "next/navigation";
import { startTransition, useDeferredValue, useEffect, useMemo, useState, type MouseEvent } from "react";
import { TOPIC_LABELS, type Topic } from "@/content/topics";
import { clientHref } from "@/lib/client-link";
import { DATA_URL } from "@/lib/data-urls";
import { matches, rank, withKeys, type DictData } from "@/lib/dictionary";
import { LETTERS, letterByChar } from "@/lib/persian/letters";
import { useStaticData } from "@/lib/static-data";
import { useStore } from "@/lib/storage";
import { starKey } from "@/lib/starred";
import { starredStore } from "@/lib/stores";
import { FaText } from "./FaText";
import { MyWords } from "./MyWords";
import { StarToggle } from "./StarButton";

export interface DictionaryProps {
  /** The first entries in alphabet order, drawn in the page's HTML. */
  head: DictData[];
  /** How many entries there are in all. */
  total: number;
  topics: Topic[];
  /** The letters some word starts with. */
  initials: string[];
  units: { slug: string; label: string }[];
}

/** The first batch drawn once the full list has loaded; each batch after it doubles what is drawn, so the list is complete in a few steps. */
const STEP = 40;

const onIdle = (f: () => void) => {
  if (typeof requestIdleCallback === "function") {
    const id = requestIdleCallback(f, { timeout: 500 });
    return () => cancelIdleCallback(id);
  }
  const id = setTimeout(f, 16);
  return () => clearTimeout(id);
};

// The page's HTML carries the first entries; the full list (about 2,000) comes
// from /data/dictionary.json and is drawn a little at a time while the browser
// is idle, so the page doesn't hydrate thousands of rows at once.
export function DictionaryBrowser({
  head,
  total,
  topics,
  initials: initialList,
  units,
  initialQuery = "",
  initialView = "all",
}: DictionaryProps & {
  initialQuery?: string;
  initialView?: "all" | "mine";
}) {
  const { data, failed } = useStaticData<DictData[]>(DATA_URL.dictionary);
  const complete = !!data;
  const entries = data ?? head;
  const [view, setView] = useState(initialView);
  const starred = useStore(starredStore);
  const starredCount = Object.keys(starred).length;
  const [query, setQuery] = useState(initialQuery);
  const [topic, setTopic] = useState<Topic | "all">("all");
  const [unit, setUnit] = useState("all");
  const [initial, setInitial] = useState<string | null>(null);
  const q = useDeferredValue(query);
  const router = useRouter();

  // The list's links (about 3,000) are plain anchors; this one listener gives
  // them the client-side navigation a Link would, without hydrating each one.
  const follow = (e: MouseEvent) => {
    const href = clientHref(e, (e.target as Element).closest("a"), location.origin);
    if (href === null) return;
    e.preventDefault();
    router.push(href);
  };

  const filtering = !!q.trim() || topic !== "all" || unit !== "all" || !!initial;
  // The search keys are built the first time someone searches or filters, not on load.
  const [wantKeys, setWantKeys] = useState(false);
  if (filtering && !wantKeys) setWantKeys(true);
  const keyed = useMemo(() => (wantKeys ? withKeys(entries) : null), [wantKeys, entries]);
  const shown =
    filtering && keyed
      ? keyed
          .filter(
            (e) =>
              matches(e, q) &&
              (topic === "all" || e.topic === topic) &&
              (unit === "all" || (unit === "trainer" ? e.trainer : unit === "common" ? e.common : e.lessons.some((l) => l.unit === unit))) &&
              (!initial || e.initial === initial),
          )
          .map((e, i) => ({ e, r: rank(e, q), i }))
          .sort((a, b) => a.r - b.r || a.i - b.i)
          .map((x) => x.e)
      : entries;
  const initials = new Set(initialList);

  const [limit, setLimit] = useState(head.length);
  useEffect(() => {
    if (!complete || limit >= shown.length) return;
    // A transition renders in small slices the browser can interrupt, so drawing
    // the rest of the list never holds up a tap or a keystroke for long.
    return onIdle(() => startTransition(() => setLimit((n) => n + Math.max(STEP, n))));
  }, [complete, limit, shown.length]);
  // Until the full list is here, a search or filter would only see the first entries.
  // (If it failed to load, search the first entries.)
  const waiting = filtering && !complete && !failed;
  const count = complete || failed ? shown.length : filtering ? null : total;

  const views = (
    <div className="chips" role="group" aria-label="Show">
      <button type="button" className="chip" aria-pressed={view === "all"} onClick={() => setView("all")}>
        All words
      </button>
      <button type="button" className="chip" aria-pressed={view === "mine"} onClick={() => setView("mine")}>
        My words{starredCount > 0 && ` · ${starredCount}`}
      </button>
    </div>
  );

  if (view === "mine") {
    return (
      <div className="ui">
        {views}
        <MyWords />
      </div>
    );
  }

  return (
    <div className="ui">
      {views}
      <label htmlFor="dict-search" className="sr-only">
        Search the dictionary
      </label>
      <input
        id="dict-search"
        type="search"
        className="quiz-input dict-search"
        placeholder="Persian, transliteration or English"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="off"
        spellCheck={false}
      />

      <div className="dict-filters">
        <label>
          <span className="sr-only">Topic</span>
          <select value={topic} onChange={(e) => setTopic(e.target.value as Topic | "all")}>
            <option value="all">All topics</option>
            {topics.map((t) => (
              <option key={t} value={t}>
                {TOPIC_LABELS[t]}
              </option>
            ))}
          </select>
        </label>
        <label>
          <span className="sr-only">Source</span>
          <select value={unit} onChange={(e) => setUnit(e.target.value)}>
            <option value="all">All sources</option>
            <option value="trainer">Trainer words</option>
            <option value="common">Common words beyond the lessons</option>
            {units.map((u) => (
              <option key={u.slug} value={u.slug}>
                {u.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="letter-strip letter-strip-wrap dict-index" dir="rtl" role="group" aria-label="Starting letter">
        {LETTERS.filter((l) => initials.has(l.ch)).map((l) => (
          <button
            key={l.ch}
            type="button"
            className="letter-strip-btn naskh"
            aria-pressed={initial === l.ch}
            aria-label={`Words starting with ${l.name}`}
            onClick={() => setInitial(initial === l.ch ? null : l.ch)}
          >
            {l.ch}
          </button>
        ))}
      </div>

      <p className="mt-3 text-sm text-muted" aria-live="polite">
        {count === null ? "Loading the full dictionary…" : `${count} ${count === 1 ? "word" : "words"}`}
        {query || topic !== "all" || unit !== "all" || initial ? (
          <>
            {" · "}
            <button
              type="button"
              className="underline underline-offset-4"
              onClick={() => {
                setQuery("");
                setTopic("all");
                setUnit("all");
                setInitial(null);
              }}
            >
              clear
            </button>
          </>
        ) : null}
      </p>

      {failed && <p className="panel panel-dashed empty-state">The full dictionary couldn&apos;t load (are you offline?). The first words are shown.</p>}
      {waiting ? null : shown.length === 0 ? (
        <p className="panel panel-dashed empty-state">No words match. Try fewer letters, or search in English.</p>
      ) : (
        <ul className="dict-list" onClick={follow}>
          {shown.slice(0, limit).map((e) => (
            <li key={e.id} className="dict-entry">
              <div className="dict-word has-fa">
                <FaText text={e.fa} translit="none" className="text-2xl" />
                <span className="dict-translit">{e.translit}</span>
              </div>
              <div className="dict-meaning">
                <p>{e.en}</p>
                {e.spoken && (
                  <p className="text-sm has-fa">
                    <span className="text-muted">Spoken </span>
                    <FaText text={e.spoken} translit="none" /> <em className="text-muted">{e.spokenTranslit}</em>
                  </p>
                )}
                <p className="dict-meta">
                  <StarToggle
                    item={{ fa: e.fa, en: e.en, source: "Dictionary", href: `/dictionary?q=${encodeURIComponent(e.id)}` }}
                    on={Boolean(starred[starKey(e.fa)])}
                  />
                  {e.topic && <span className="meta-tag meta-tag-quiet">{TOPIC_LABELS[e.topic]}</span>}
                  {e.lessons.map((l) => (
                    <a key={l.href} href={l.href} className="meta-tag">
                      Lesson {l.number}
                    </a>
                  ))}
                  {e.trainer && <span className="meta-tag meta-tag-quiet">in the trainer</span>}
                  {e.common && !e.lessons.length && !e.trainer && <span className="meta-tag meta-tag-quiet">common word</span>}
                  <span className="dict-letters" aria-label="Letters">
                    {[...new Set([...e.id].map((c) => (c === "آ" ? "ا" : c)))]
                      .filter((c) => letterByChar.has(c))
                      .map((c) => (
                        <a key={c} href={`/script/${letterByChar.get(c)!.slug}`} className="dict-letter" aria-label={letterByChar.get(c)!.name}>
                          <span className="fa" lang="fa">
                            {c}
                          </span>
                        </a>
                      ))}
                  </span>
                </p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
