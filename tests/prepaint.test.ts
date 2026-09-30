import { describe, expect, it } from "vitest";
import { PREPAINT_SCRIPT, SETTINGS_KEY } from "@/lib/prepaint";

/** Run the inline script against a fake localStorage and <html>. */
function run(stored: string | null, initial: Record<string, string> = {}) {
  const dataset: Record<string, string> = { ...initial };
  const localStorage = { getItem: (k: string) => (k === SETTINGS_KEY ? stored : null) };
  const document = { documentElement: { dataset } };
  new Function("localStorage", "document", PREPAINT_SCRIPT)(localStorage, document);
  return dataset;
}

const saved = (data: object) => JSON.stringify({ v: 1, data });

describe("the pre-paint script", () => {
  it("copies every saved display setting onto <html>", () => {
    expect(run(saved({ vowels: "none", translit: true, theme: "dark", size: "l", faFont: "naskh" }))).toEqual({
      vowels: "none",
      translit: "on",
      theme: "dark",
      size: "l",
      fafont: "naskh",
    });
  });
  it("leaves the static defaults alone when nothing is saved", () => {
    const defaults = { vowels: "all", translit: "off", theme: "system", size: "m", fafont: "vazirmatn" };
    expect(run(null, defaults)).toEqual(defaults);
  });
  it("keeps the defaults for settings saved before size and typeface existed", () => {
    expect(run(saved({ vowels: "key", translit: false, theme: "light" }), { size: "m", fafont: "vazirmatn" })).toMatchObject({
      vowels: "key",
      size: "m",
      fafont: "vazirmatn",
    });
  });
  it("ignores values it doesn't know and never throws", () => {
    expect(run(saved({ size: "xxl", faFont: "comic", theme: "neon" }), { size: "m" })).toMatchObject({ size: "m" });
    expect(() => run("{not json")).not.toThrow();
  });
});
