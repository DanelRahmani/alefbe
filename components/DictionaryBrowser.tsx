"use client";

import Link from "next/link";
import { useDeferredValue, useState } from "react";
import { TOPIC_LABELS, type Topic } from "@/content/topics";
import { matches, rank, type DictEntry } from "@/lib/dictionary";
import { LETTERS, letterByChar } from "@/lib/persian/letters";
import { FaText } from "./FaText";

export function DictionaryBrowser({ entries, units }: { entries: DictEntry[]; units: { slug: string; label: string }[] }) {
  const [query, setQuery] = useState("");
  const [topic, setTopic] = useState<Topic | "all">("all");
  const [unit, setUnit] = useState("all");
  const [initial, setInitial] = useState<string | null>(null);
  const q = useDeferredValue(query);

  const topics = (Object.keys(TOPIC_LABELS) as Topic[]).filter((t) => entries.some((e) => e.topic === t));
  const shown = entries
    .filter(
      (e) =>
        matches(e, q) &&
        (topic === "all" || e.topic === topic) &&
        (unit === "all" || (unit === "trainer" ? e.trainer : e.lessons.some((l) => l.unit === unit))) &&
        (!initial || e.initial === initial),
    )
    .map((e, i) => ({ e, r: rank(e, q), i }))
    .sort((a, b) => a.r - b.r || a.i - b.i)
    .map((x) => x.e);
  const initials = new Set(entries.map((e) => e.initial));

  return (
    <div className="ui">
      <label htmlFor="dict-search" className="sr-only">
        Search the dictionary
      </label>
      <input
        id="dict-search"
        type="search"
        className="quiz-input dict-search"
        placeholder="Search in Persian, transliteration or English"
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
            <option value="all">Lessons and trainer</option>
            <option value="trainer">Trainer words</option>
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
        {shown.length} {shown.length === 1 ? "word" : "words"}
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

      {shown.length === 0 ? (
        <p className="empty-state">No words match. Try fewer letters, or search in English.</p>
      ) : (
        <ul className="dict-list">
          {shown.map((e) => (
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
                  {e.topic && <span className="meta-tag meta-tag-quiet">{TOPIC_LABELS[e.topic]}</span>}
                  {e.lessons.map((l) => (
                    <Link key={l.href} href={l.href} className="meta-tag">
                      Lesson {l.number}
                    </Link>
                  ))}
                  {e.trainer && <span className="meta-tag meta-tag-quiet">in the trainer</span>}
                  <span className="dict-letters" aria-label="Letters">
                    {[...new Set([...e.id].map((c) => (c === "آ" ? "ا" : c)))]
                      .filter((c) => letterByChar.has(c))
                      .map((c) => (
                        <Link key={c} href={`/script/${letterByChar.get(c)!.slug}`} className="dict-letter" aria-label={letterByChar.get(c)!.name}>
                          <span className="fa" lang="fa">
                            {c}
                          </span>
                        </Link>
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
