import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Static site: every route is prerendered to HTML at build time (`out/`).
  output: "export",
  // Pin the workspace root; a stray lockfile higher up the tree would
  // otherwise be picked as the root.
  turbopack: { root: process.cwd() },
};

export default nextConfig;
