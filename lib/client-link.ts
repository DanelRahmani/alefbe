// A long list can render plain <a href> links and give them next/link's
// client-side navigation through one click listener, instead of hydrating a
// Link component per link (the dictionary has about 3,000).

export interface ClickLike {
  button: number;
  metaKey: boolean;
  ctrlKey: boolean;
  shiftKey: boolean;
  altKey: boolean;
  defaultPrevented: boolean;
}

export interface LinkLike {
  /** The resolved URL (an anchor's `href` property). */
  href: string;
  target: string;
  hasAttribute(name: string): boolean;
}

/**
 * The path to navigate to in the app for this click, or null to leave it to
 * the browser: a modified or non-primary click (new tab, new window, save), a
 * link with a target or a download, or one to another site.
 */
export function clientHref(click: ClickLike, link: LinkLike | null, origin: string): string | null {
  if (!link || click.defaultPrevented || click.button !== 0) return null;
  if (click.metaKey || click.ctrlKey || click.shiftKey || click.altKey) return null;
  if ((link.target && link.target !== "_self") || link.hasAttribute("download")) return null;
  let url: URL;
  try {
    url = new URL(link.href);
  } catch {
    return null;
  }
  if (url.origin !== origin) return null;
  return url.pathname + url.search + url.hash;
}
