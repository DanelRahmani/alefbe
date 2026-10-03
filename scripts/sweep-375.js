// The 375 px sweep (Phase 9e): every route, light and dark, in a 375 px frame.
// Run it in a browser tab open on the static build (alefbe-static, port 3001).
// Copy it next to the build (`cp scripts/sweep-375.js out/`; the next build
// clears it), then in the tab (the in-app browser's JavaScript tool, or a
// DevTools console): `eval(await (await fetch("/sweep-375.js")).text())`.
// Then call, in chunks so each call stays short:
//
//   await alefbeSweep({ from: 0, to: 40 })    // …then 40–80, 80–120, 120–end
//   alefbeSweepReport()                        // the failures, all chunks
//
// Per route it checks:
//   - no horizontal scroll at 375 px, in light and in dark;
//   - a visible focus ring on every Tab stop (outline, or the ring a wrapping
//     chip or card draws with :has(:focus-visible)), simulated, so it works in
//     a background window too (see twinFocusRules);
//   - nothing animating once the page has settled (no infinite or long
//     animations; under prefers-reduced-motion, none at all);
//   - Persian phrases inside brackets keep their order (the first phrase left
//     of the second, on one line).
// Console errors are not visible from inside the frames: read the tab's console
// after the sweep (the in-app browser's console tool, or DevTools), where the
// only expected ones are the local-only 404s (Vercel Analytics, prefetches).
// Routes come from /data/routes.json (content/routes.ts), plus a missing page.

(() => {
  const results = (window.__sweep ??= {});

  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

  const load = (src) =>
    new Promise((resolve) => {
      const f = document.createElement("iframe");
      f.style.cssText = "position:fixed;left:0;top:0;width:375px;height:812px;border:0;opacity:0.01;pointer-events:none;z-index:-1";
      f.src = src;
      f.onload = () => resolve(f);
      document.body.appendChild(f);
    });

  const describe = (el) => {
    const label = (el.getAttribute("aria-label") || el.textContent || el.getAttribute("href") || "").trim().replace(/\s+/g, " ");
    return `${el.tagName.toLowerCase()}${el.className && typeof el.className === "string" ? "." + el.className.trim().split(/\s+/).join(".") : ""} "${label.slice(0, 40)}"`;
  };

  const visible = (el, win) => {
    if (el.closest("[hidden], [inert], dialog:not([open]), [popover]:not(:popover-open)")) return false;
    const r = el.getBoundingClientRect();
    const cs = win.getComputedStyle(el);
    // sr-only inputs inside a visible label (chips, mode cards) count: the label shows the ring.
    if ((r.width < 2 || r.height < 2) && !el.closest("label")) return false;
    return cs.visibility !== "hidden" && cs.display !== "none";
  };

  // A background window never matches :focus or :focus-visible, so the rings
  // are checked by simulation: every rule with one of them gets a twin keyed to
  // the class .__fv, inserted right after it (the cascade order is kept), and
  // each Tab stop in turn wears the class.
  const FV = "__fv";
  const twinFocusRules = (doc) => {
    // (The frame has its own CSSStyleRule: test the rule's shape, not instanceof.)
    const walk = (list) => {
      for (let i = 0; i < list.cssRules.length; i++) {
        const r = list.cssRules[i];
        const isStyle = typeof r.selectorText === "string";
        if (!isStyle && r.cssRules) walk(r);
        else if (isStyle && /:focus/.test(r.selectorText)) {
          const sel = r.selectorText.replace(/:focus(-visible|-within)?/g, (m) => (m === ":focus-within" ? `:has(.${FV})` : `.${FV}`));
          try {
            list.insertRule(`${sel} { ${r.style.cssText} }`, i + 1);
            i++;
          } catch {
            // A selector the engine rejects once rewritten: leave it.
          }
        }
      }
    };
    for (const sheet of doc.styleSheets) {
      try {
        walk(sheet);
      } catch {
        // Cross-origin sheet: none here.
      }
    }
  };

  const ringOf = (el, win) => {
    const shows = (n) => {
      const s = win.getComputedStyle(n);
      return s.outlineStyle !== "none" && parseFloat(s.outlineWidth) >= 1;
    };
    el.classList.add(FV);
    const holder = el.closest("label, .chip, .btn, .mode-card");
    const ok = shows(el) || (!!holder && holder !== el && shows(holder));
    el.classList.remove(FV);
    return ok;
  };

  const TABBABLE = 'a[href], button:not([disabled]), input:not([disabled]):not([type="hidden"]), select:not([disabled]), textarea:not([disabled]), summary, [tabindex]:not([tabindex="-1"])';

  async function checkRoute(path) {
    const out = { overflow: [], focus: [], motion: [], bidi: [], stops: 0 };
    const f = await load(path);
    const win = f.contentWindow;
    const doc = f.contentDocument;
    await sleep(1200); // hydration, fonts, idle-time data
    for (const theme of ["light", "dark"]) {
      doc.documentElement.dataset.theme = theme;
      await sleep(60);
      const over = doc.documentElement.scrollWidth - doc.documentElement.clientWidth;
      if (over > 0) {
        const wide = [...doc.querySelectorAll("main *, header *, footer *")].find((e) => e.getBoundingClientRect().right > doc.documentElement.clientWidth + 1);
        out.overflow.push(`${theme}: ${over}px wider (${wide ? describe(wide) : "?"})`);
      }
    }
    doc.documentElement.dataset.theme = "light";

    // Focus rings.
    twinFocusRules(doc);
    const stops = [...doc.querySelectorAll(TABBABLE)].filter((el) => visible(el, win));
    out.stops = stops.length;
    for (const el of stops) if (!ringOf(el, win)) out.focus.push(describe(el));

    // Motion at rest.
    for (const a of doc.getAnimations()) {
      if (a.playState !== "running") continue;
      const t = a.effect?.getTiming?.() ?? {};
      const name = a.animationName || a.transitionProperty || "animation";
      if (t.iterations === Infinity || (typeof t.duration === "number" && t.duration > 1000)) out.motion.push(`${name} (${t.iterations === Infinity ? "infinite" : t.duration + "ms"})`);
      // Under reduced motion the global rule leaves every change a 0.01ms
      // transition: instant, not motion. Anything longer is.
      else if (win.matchMedia("(prefers-reduced-motion: reduce)").matches && (t.duration ?? 0) >= 50) out.motion.push(`${name} under reduced motion (${t.duration}ms)`);
    }

    // Persian phrases in brackets: DOM order = visual order on a line.
    // Only English (left-to-right) text: in a Persian line the first phrase is on the right.
    // Compare where the first phrase ends with where the second begins (a phrase may wrap).
    for (const holder of doc.querySelectorAll("main p, main li, main td, main th, main span")) {
      if (win.getComputedStyle(holder).direction !== "ltr") continue;
      const bdis = [...holder.children].filter((c) => c.matches("bdi.fa"));
      for (let i = 0; i + 1 < bdis.length; i++) {
        const [a, b] = [bdis[i], bdis[i + 1]];
        let between = "";
        for (let n = a.nextSibling; n && n !== b; n = n.nextSibling) if (!(n.nodeType === 1 && n.matches(".tr"))) between += n.textContent;
        if (!/^[\s,،/;:–-]*$/.test(between)) continue;
        const ra = [...a.getClientRects()].pop(), rb = b.getClientRects()[0];
        if (!ra || !rb || Math.abs(ra.top - rb.top) > 4 || !ra.width || !rb.width) continue;
        if (ra.left > rb.left) out.bidi.push(`"${a.textContent.slice(0, 20)}" shown after "${b.textContent.slice(0, 20)}"`);
      }
    }
    f.remove();
    return out;
  }

  window.alefbeSweep = async ({ from = 0, to = Infinity } = {}) => {
    const routes = [...(await fetch("/data/routes.json").then((r) => r.json())), "/no-such-page"];
    for (const path of routes.slice(from, to)) {
      try {
        results[path] = await checkRoute(path);
      } catch (e) {
        results[path] = { error: String(e) };
      }
    }
    return `${Object.keys(results).length} of ${routes.length} routes checked`;
  };

  window.alefbeSweepReport = () => {
    const bad = Object.entries(results).filter(([, r]) => r.error || r.overflow.length || r.focus.length || r.motion.length || r.bidi.length);
    const stops = Object.values(results).reduce((n, r) => n + (r.stops || 0), 0);
    return { routes: Object.keys(results).length, tabStops: stops, failing: Object.fromEntries(bad) };
  };

  return "sweep ready";
})();
