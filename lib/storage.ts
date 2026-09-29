"use client";

import { useSyncExternalStore } from "react";

export interface Store<T> {
  get(): T;
  /** What the static HTML renders; the stored value takes over after hydration. */
  getServer(): T;
  set(next: T | ((prev: T) => T)): void;
  subscribe(listener: () => void): () => void;
  /** Re-read localStorage (after an import or reset) and notify subscribers. */
  refresh(): void;
}

interface Envelope<T> {
  v: number;
  data: T;
}

/**
 * A localStorage-backed store for useSyncExternalStore. Every access is wrapped
 * in try/catch (private mode, blocked storage); a version mismatch runs
 * `migrate`, or falls back to the default. Object values are merged over the
 * fallback so fields added later get their defaults.
 */
export function createPersistentStore<T>(
  key: string,
  fallback: T,
  opts: { version?: number; migrate?: (old: unknown, fromVersion: number) => T | undefined } = {},
): Store<T> {
  const version = opts.version ?? 1;
  const listeners = new Set<() => void>();
  let cache: T | undefined;

  const merge = (data: unknown): T =>
    fallback && typeof fallback === "object" && !Array.isArray(fallback) && data && typeof data === "object"
      ? ({ ...fallback, ...(data as object) } as T)
      : ((data as T) ?? fallback);

  const load = (): T => {
    try {
      const raw = window.localStorage.getItem(key);
      if (!raw) return fallback;
      const env = JSON.parse(raw) as Envelope<unknown>;
      if (env && env.v === version) return merge(env.data);
      const migrated = opts.migrate?.(env?.data, env?.v ?? 0);
      return migrated === undefined ? fallback : merge(migrated);
    } catch {
      return fallback;
    }
  };

  const save = (value: T) => {
    try {
      window.localStorage.setItem(key, JSON.stringify({ v: version, data: value } satisfies Envelope<T>));
    } catch {
      // Storage full or blocked: keep the in-memory value for this session.
    }
  };

  const emit = () => listeners.forEach((l) => l());

  const onStorage = (e: StorageEvent) => {
    if (e.key !== key) return;
    cache = load();
    emit();
  };

  return {
    get: () => (cache ??= load()),
    getServer: () => fallback,
    set(next) {
      const prev = cache ??= load();
      cache = typeof next === "function" ? (next as (p: T) => T)(prev) : next;
      save(cache);
      emit();
    },
    refresh() {
      cache = load();
      emit();
    },
    subscribe(listener) {
      listeners.add(listener);
      if (listeners.size === 1) window.addEventListener("storage", onStorage);
      return () => {
        listeners.delete(listener);
        if (listeners.size === 0) window.removeEventListener("storage", onStorage);
      };
    },
  };
}

export function useStore<T>(store: Store<T>): T {
  return useSyncExternalStore(store.subscribe, store.get, store.getServer);
}
