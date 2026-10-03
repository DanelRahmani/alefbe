import { describe, expect, it } from "vitest";
import { clientHref, type ClickLike } from "@/lib/client-link";

const ORIGIN = "https://www.alefbe.study";
const click: ClickLike = { button: 0, metaKey: false, ctrlKey: false, shiftKey: false, altKey: false, defaultPrevented: false };
const link = (href: string, target = "", attrs: string[] = []) => ({ href, target, hasAttribute: (n: string) => attrs.includes(n) });

describe("clientHref", () => {
  it("takes a plain click on an in-site link", () => {
    expect(clientHref(click, link(`${ORIGIN}/script/be`), ORIGIN)).toBe("/script/be");
    expect(clientHref(click, link(`${ORIGIN}/dictionary?q=x#top`), ORIGIN)).toBe("/dictionary?q=x#top");
  });
  it("leaves modified and non-primary clicks to the browser", () => {
    for (const k of ["metaKey", "ctrlKey", "shiftKey", "altKey"] as const)
      expect(clientHref({ ...click, [k]: true }, link(`${ORIGIN}/a`), ORIGIN)).toBeNull();
    expect(clientHref({ ...click, button: 1 }, link(`${ORIGIN}/a`), ORIGIN)).toBeNull();
    expect(clientHref({ ...click, defaultPrevented: true }, link(`${ORIGIN}/a`), ORIGIN)).toBeNull();
  });
  it("leaves other sites, targets and downloads to the browser", () => {
    expect(clientHref(click, link("https://example.com/a"), ORIGIN)).toBeNull();
    expect(clientHref(click, link(`${ORIGIN}/a`, "_blank"), ORIGIN)).toBeNull();
    expect(clientHref(click, link(`${ORIGIN}/a`, "_self"), ORIGIN)).toBe("/a");
    expect(clientHref(click, link(`${ORIGIN}/a.csv`, "", ["download"]), ORIGIN)).toBeNull();
  });
  it("ignores a click outside a link", () => {
    expect(clientHref(click, null, ORIGIN)).toBeNull();
  });
});
