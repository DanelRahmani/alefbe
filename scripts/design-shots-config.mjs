// Writes a copy of design-shots.cjs with its config filled in, for the
// Playwright MCP's browser_run_code_unsafe (which takes a file, no arguments).
//   node scripts/design-shots-config.mjs <out.cjs> '<json config>'
// Config: { label, dir, pages, sizes?, schemes?, fullPage?, suffix?, base? }
import { readFileSync, writeFileSync } from "node:fs";

const [out, json] = process.argv.slice(2);
if (!out || !json) {
  console.error("usage: node scripts/design-shots-config.mjs <out.cjs> '<json config>'");
  process.exit(1);
}
const cfg = JSON.parse(json);
if (!cfg.dir) throw new Error("config needs dir");
const src = readFileSync(new URL("./design-shots.cjs", import.meta.url), "utf8");
writeFileSync(out, src.replace("globalThis.SHOTS ?? {}", JSON.stringify(cfg)));
console.log(out);
