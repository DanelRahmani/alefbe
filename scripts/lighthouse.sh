#!/usr/bin/env bash
# Lighthouse (mobile, simulated throttling) on the static build, for the design
# pass. Serve the build first (alefbe-static, port 3001).
#   RUNS=3 bash scripts/lighthouse.sh <out-dir> [label] [path…]
# Each page runs RUNS times (default 3); the line shows the run with the median
# performance score: performance, accessibility, best practices, LCP, CLS, TBT,
# and every run's performance score in brackets.
set -euo pipefail
export MSYS_NO_PATHCONV=1 # Git Bash on Windows would rewrite "/" into a path
out=${1:?out dir}; label=${2:-run}; shift 2 || true
runs=${RUNS:-3}
pages=("$@")
[ ${#pages[@]} -eq 0 ] && pages=(/ /learn/core-sentence/to-be /practice /practice/review)
mkdir -p "$out"
for p in "${pages[@]}"; do
  slug=$(echo "${p#/}" | tr '/' '_'); slug=${slug:-home}
  files=()
  for i in $(seq 1 "$runs"); do
    file="$out/$slug-$label-$i.json"
    npx --yes lighthouse@13 "http://localhost:3001$p" --quiet --output=json --output-path="$file" \
      --only-categories=performance,accessibility,best-practices --chrome-flags="--headless=new" >/dev/null 2>&1 || true
    files+=("$file")
  done
  node -e '
    const [p, ...files] = process.argv.slice(1);
    const rs = files.map((f) => { try { return require(f); } catch { return null; } }).filter(Boolean);
    const perf = (r) => Math.round((r.categories.performance?.score ?? 0) * 100);
    rs.sort((a, b) => perf(a) - perf(b));
    const r = rs[Math.floor(rs.length / 2)]; const c = r.categories, a = r.audits;
    const s = (k) => Math.round((c[k]?.score ?? 0) * 100);
    console.log([p.padEnd(30), "perf", s("performance"), "a11y", s("accessibility"), "bp", s("best-practices"),
      "LCP", a["largest-contentful-paint"].displayValue, "CLS", a["cumulative-layout-shift"].displayValue,
      "TBT", a["total-blocking-time"].displayValue, "[" + rs.map(perf).join(" ") + "]"].join(" "));
  ' "$p" "${files[@]}"
done
