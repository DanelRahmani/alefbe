// Before/after screenshots for the design pass (Phase 9). Fill in the config
// with design-shots-config.mjs, then run the copy it writes through the
// Playwright MCP's browser_run_code_unsafe (`filename`). Each page is captured at
// 375 px and 1280 px, light and dark, with the same seeded progress, so a
// before and an after compare like with like.
// eslint-disable-next-line @typescript-eslint/no-unused-expressions -- a bare function, as the MCP expects
async (page) => {
  const cfg = globalThis.SHOTS ?? {};
  const base = cfg.base ?? "http://localhost:3001";
  const label = cfg.label ?? "before";
  const dir = cfg.dir;
  const pages = cfg.pages ?? ["/"];
  const sizes = cfg.sizes ?? [
    ["375", 375, 812],
    ["1280", 1280, 900],
  ];
  const schemes = cfg.schemes ?? ["light", "dark"];
  const done = (keys) => Object.fromEntries(keys.map((k) => [k, true]));
  const seed = {
    "alefbe2:progress": done([
      "start-here/how-it-works",
      "start-here/persian-in-one-page",
      "start-here/fast-track",
      "alphabet/how-the-script-works",
      "alphabet/alef-and-be",
      "alphabet/dal-to-zhe",
    ]),
    "alefbe2:lessons": { quiz: { "alphabet/alef-and-be": { right: 4, total: 5 } }, last: "core-sentence/to-be" },
  };
  await page.goto(base + "/offline");
  await page.evaluate(async (s) => {
    // The service worker would serve the previous build from its cache.
    for (const r of await navigator.serviceWorker.getRegistrations()) await r.unregister();
    for (const k of await caches.keys()) await caches.delete(k);
    localStorage.clear();
    for (const [k, v] of Object.entries(s)) localStorage.setItem(k, JSON.stringify({ v: 1, data: v }));
  }, seed);
  const files = [];
  for (const p of pages) {
    for (const [name, w, h] of sizes) {
      await page.setViewportSize({ width: w, height: h });
      for (const scheme of schemes) {
        await page.emulateMedia({ colorScheme: scheme, reducedMotion: "reduce" });
        await page.goto(base + p, { waitUntil: "networkidle" });
        await page.waitForTimeout(400);
        const slug = (p === "/" ? "home" : p.slice(1).replace(/[/?=#]/g, "_")) + (cfg.suffix ?? "");
        const file = `${dir}/${slug}-${name}-${scheme}-${label}.png`;
        await page.screenshot({ path: file, fullPage: cfg.fullPage ?? false });
        files.push(file);
      }
    }
  }
  return files.length + " shots";
}
