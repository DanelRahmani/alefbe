// Writes a copy of a capture script (design-shots.cjs by default, or
// design-shots-feedback.cjs) with its config filled in, for the Playwright
// MCP's browser_run_code_unsafe, which takes a file and no arguments. The copy
// must live inside the project (e.g. .playwright-mcp/, which git ignores).
//   node scripts/design-shots-config.mjs <out.cjs> '<json config>' [script.cjs]
// Config: { label, dir, pages, sizes?, schemes?, fullPage?, suffix?, base? }
import { readFileSync, writeFileSync } from "node:fs";

const [out, json, script = "design-shots.cjs"] = process.argv.slice(2);
if (!out || !json) {
  console.error("usage: node scripts/design-shots-config.mjs <out.cjs> '<json config>' [script.cjs]");
  process.exit(1);
}
const cfg = JSON.parse(json);
if (!cfg.dir) throw new Error("config needs dir");
const src = readFileSync(new URL(`./${script}`, import.meta.url), "utf8");
writeFileSync(out, src.replace("globalThis.SHOTS ?? {}", JSON.stringify(cfg)));
console.log(out);
