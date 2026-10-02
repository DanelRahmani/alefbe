// Feedback states for the design pass: a wrong answer and a right answer in
// the vocabulary trainer ("Practise anyway", so nothing is scheduled), at
// 375 px and 1280 px, light and dark. Fill in the config with
// design-shots-config.mjs (it replaces the same placeholder as design-shots.cjs)
// and run the copy through the Playwright MCP's browser_run_code_unsafe.
// eslint-disable-next-line @typescript-eslint/no-unused-expressions -- a bare function, as the MCP expects
async (page) => {
  const cfg = globalThis.SHOTS ?? {};
  const base = cfg.base ?? "http://localhost:3001";
  const files = [];
  for (const [name, w, h] of [["375", 375, 812], ["1280", 1280, 900]]) {
    await page.setViewportSize({ width: w, height: h });
    for (const scheme of ["light", "dark"]) {
      await page.emulateMedia({ colorScheme: scheme, reducedMotion: "reduce" });
      await page.goto(base + "/vocab", { waitUntil: "networkidle" });
      await page.evaluate(async () => {
        // The service worker would serve the previous build from its cache.
        for (const r of await navigator.serviceWorker.getRegistrations()) await r.unregister();
        for (const k of await caches.keys()) await caches.delete(k);
        localStorage.clear();
      });
      await page.reload({ waitUntil: "networkidle" });
      await page.getByRole("button", { name: "Practise anyway" }).click();
      const field = page.locator("main form input").first();
      await field.fill("xyz");
      await field.press("Enter");
      await page.waitForTimeout(300);
      const card = page.locator(".drill-card, .trainer-card").first();
      await card.scrollIntoViewIfNeeded();
      let file = `${cfg.dir}/fb-wrong-${name}-${scheme}-${cfg.label}.png`;
      await card.screenshot({ path: file });
      files.push(file);
      // The right answer to the next card, read from the solution it would show.
      await page.getByRole("button", { name: "Next" }).click();
      const en = (await page.locator(".drill-name").first().textContent())?.trim();
      const answer = await page.evaluate(async (en) => {
        const items = await fetch("/search-index.json").then((x) => x.json());
        return items.find((i) => i.kind === "word" && i.title === en)?.fa ?? null;
      }, en);
      if (answer) {
        await field.fill(answer);
        await field.press("Enter");
        await page.waitForTimeout(300);
        file = `${cfg.dir}/fb-right-${name}-${scheme}-${cfg.label}.png`;
        await card.screenshot({ path: file });
        files.push(file);
      }
    }
  }
  return files;
}
