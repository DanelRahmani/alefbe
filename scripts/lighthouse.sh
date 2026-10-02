#!/usr/bin/env bash
# Lighthouse (mobile, simulated throttling) on the static build, for the design
# pass. Serve the build first (alefbe-static, port 3001).
#   bash scripts/lighthouse.sh <out-dir> [label] [path…]
# Prints one line per page: performance, accessibility, best practices, LCP, CLS, TBT.
set -euo pipefail
export MSYS_NO_PATHCONV=1 # Git Bash on Windows would rewrite "/" into a path
out=${1:?out dir}; label=${2:-run}; shift 2 || true
pages=("$@")
[ ${#pages[@]} -eq 0 ] && pages=(/ /learn/core-sentence/to-be /practice /practice/review)
mkdir -p "$out"
for p in "${pages[@]}"; do
  slug=$(echo "${p#/}" | tr '/' '_'); slug=${slug:-home}
  file="$out/$slug-$label.json"
  npx --yes lighthouse@13 "http://localhost:3001$p" --quiet --output=json --output-path="$file" \
    --only-categories=performance,accessibility,best-practices --chrome-flags="--headless=new" >/dev/null 2>&1 || true
  node -e '
    const r = require(process.argv[1]); const c = r.categories, a = r.audits;
    const s = (k) => Math.round((c[k]?.score ?? 0) * 100);
    console.log([process.argv[2].padEnd(30), "perf", s("performance"), "a11y", s("accessibility"), "bp", s("best-practices"),
      "LCP", a["largest-contentful-paint"].displayValue, "CLS", a["cumulative-layout-shift"].displayValue,
      "TBT", a["total-blocking-time"].displayValue].join(" "));
  ' "$file" "$p"
done
