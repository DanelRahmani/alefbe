// Large lists that client components need (the decks' cards, the dictionary's
// words) are prerendered as static JSON under /data/ and fetched after the
// first paint, rather than embedded in every page's HTML as props. Each file is
// fetched once per page load; the service worker keeps a copy for offline use.

import { useEffect, useState } from "react";

const cache = new Map<string, Promise<unknown>>();

/** After the page has drawn and hydrated: when the browser is idle, or 1.5 s at most. */
const whenIdle = () =>
  new Promise<void>((resolve) => {
    if (typeof requestIdleCallback === "function") requestIdleCallback(() => resolve(), { timeout: 1500 });
    else setTimeout(resolve, 1);
  });

export function loadStatic<T>(url: string): Promise<T> {
  let p = cache.get(url);
  if (!p) {
    p = whenIdle().then(() => fetch(url)).then((r) => {
      if (!r.ok) throw new Error(`${url}: ${r.status}`);
      return r.json();
    });
    // A failed fetch (offline, never cached) can be retried on the next mount.
    p.catch(() => cache.delete(url));
    cache.set(url, p);
  }
  return p as Promise<T>;
}

/** The file's contents once loaded (undefined until then), and whether loading failed. */
export function useStaticData<T>(url: string): { data?: T; failed: boolean } {
  const [state, setState] = useState<{ data?: T; failed: boolean }>({ failed: false });
  useEffect(() => {
    let live = true;
    loadStatic<T>(url).then(
      (data) => live && setState({ data, failed: false }),
      () => live && setState({ failed: true }),
    );
    return () => {
      live = false;
    };
  }, [url]);
  return state;
}
