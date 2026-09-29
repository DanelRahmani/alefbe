"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { LETTERS, formOf, type Form } from "@/lib/persian/letters";
import { PASS_SCORE, TRACE_LEVELS, coverAt, glyphLayout, onPath, snapToPath, starsFor, type TraceLevel } from "@/lib/trace";
import { traceScore, type Pt, type TracePaths } from "@/lib/trace-path";
import { computePaths } from "./paths";
import { useStore } from "@/lib/storage";
import { settingsStore, traceStore } from "@/lib/stores";

const FORM_LABEL: Record<Form, string> = { isolated: "Isolated", initial: "Initial", medial: "Medial", final: "Final" };
const formsFor = (i: number): Form[] => (LETTERS[i].joins ? ["isolated", "initial", "medial", "final"] : ["isolated", "final"]);
/** Dots weigh as much as this many path samples. */
const DOT_WEIGHT = 4;

function cssVar(name: string): string {
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
}
function rgba(hex: string, a: number): string {
  const h = hex.replace("#", "");
  const n = parseInt(h.length === 3 ? h.replace(/./g, "$&$&") : h, 16);
  return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${a})`;
}

interface Progress {
  covered: boolean[];
  dots: boolean[];
}

export function Tracer() {
  const [index, setIndex] = useState(0);
  const [form, setForm] = useState<Form>("isolated");
  const [level, setLevel] = useState<TraceLevel>("guided");
  const [size, setSize] = useState(320);
  const [paths, setPaths] = useState<(TracePaths & { key: string }) | null>(null);
  const [progress, setProgress] = useState<Progress>({ covered: [], dots: [] });
  const [drawn, setDrawn] = useState(false);
  const [result, setResult] = useState<{ score: number; passed: boolean } | null>(null);
  const [hint, setHint] = useState(false);
  const [demo, setDemo] = useState(0);
  const best = useStore(traceStore);
  const settings = useStore(settingsStore);

  const wrapRef = useRef<HTMLDivElement>(null);
  const guideRef = useRef<HTMLCanvasElement>(null);
  const inkRef = useRef<HTMLCanvasElement>(null);
  const overlayRef = useRef<HTMLCanvasElement>(null);
  const progressRef = useRef(progress);
  const pen = useRef({ down: false, lx: 0, ly: 0, mx: 0, my: 0, total: 0, on: 0 });
  const autoCheck = useRef<number | undefined>(undefined);
  const locked = useRef(false);

  const letter = LETTERS[index];
  const glyph = formOf(letter, form);
  const key = `${index}:${form}:${size}`;
  const ready = paths?.key === key ? paths : null;
  const samples = useMemo(() => (ready ? ready.strokes.flat() : []), [ready]);
  const bestKey = `${letter.ch}:${form}`;
  const hitR = size * 0.06;

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => setSize(Math.min(360, Math.floor(el.clientWidth))));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const prepare = useCallback(
    (c: HTMLCanvasElement | null) => {
      if (!c) return null;
      const dpr = window.devicePixelRatio || 1;
      c.width = size * dpr;
      c.height = size * dpr;
      c.style.width = `${size}px`;
      c.style.height = `${size}px`;
      const ctx = c.getContext("2d")!;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      return ctx;
    },
    [size],
  );

  // Load the font, then derive this letter form's smooth paths.
  useEffect(() => {
    const font = `${glyphLayout(size).fontPx}px ${cssVar("--font-amiri") || "serif"}`;
    let cancelled = false;
    document.fonts.load(font, glyph).finally(() => {
      if (cancelled) return;
      const p = computePaths(index, form, size, font);
      const fresh = { covered: p.strokes.flat().map(() => false), dots: p.dots.map(() => false) };
      progressRef.current = fresh;
      setProgress(fresh);
      setPaths({ ...p, key: `${index}:${form}:${size}` });
    });
    return () => {
      cancelled = true;
    };
  }, [index, form, size, glyph]);

  // Guide glyph.
  useEffect(() => {
    const ctx = prepare(guideRef.current);
    if (!ctx) return;
    const alpha = hint ? 0.7 : level === "guided" ? 0.16 : level === "outline" ? 0.09 : 0;
    const { fontPx, x, y } = glyphLayout(size);
    const font = `${fontPx}px ${cssVar("--font-amiri") || "serif"}`;
    let cancelled = false;
    document.fonts.load(font, glyph).finally(() => {
      if (cancelled) return;
      ctx.clearRect(0, 0, size, size);
      if (alpha <= 0) return;
      ctx.font = font;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.direction = "rtl";
      ctx.fillStyle = rgba(cssVar("--ink") || "#1b1f3b", alpha);
      ctx.fillText(glyph, x, y);
    });
    return () => {
      cancelled = true;
    };
  }, [prepare, size, glyph, level, hint, settings.theme]);

  // Ink layer: cleared with each new letter, form, level or size.
  useEffect(() => {
    prepare(inkRef.current);
  }, [prepare, glyph, level]);

  // The path: faint where still to trace, filled in where traced, with starts, arrows and the next target.
  useEffect(() => {
    const ctx = prepare(overlayRef.current);
    if (!ctx || !ready) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const accent = cssVar("--accent") || "#1f4aa8";
    const gold = cssVar("--gold") || "#74580d";
    const bg = cssVar("--surface") || "#ffffff";
    const { strokes, dots } = ready;
    const offsets = strokes.map((_, i) => strokes.slice(0, i).reduce((n, s) => n + s.length, 0));
    const lenOf = (s: Pt[]) => s.slice(1).reduce((n, p, i) => n + Math.hypot(p.x - s[i].x, p.y - s[i].y), 0);
    const total = strokes.reduce((n, s) => n + lenOf(s), 0);
    let raf = 0;
    let t = 0;
    let demoLen = 0;

    const line = (pts: Pt[], color: string, width: number, dash: number[] = []) => {
      if (pts.length < 2) return;
      ctx.beginPath();
      ctx.moveTo(pts[0].x, pts[0].y);
      for (const p of pts.slice(1)) ctx.lineTo(p.x, p.y);
      ctx.setLineDash(dash);
      ctx.strokeStyle = color;
      ctx.lineWidth = width;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.stroke();
      ctx.setLineDash([]);
    };
    const label = (p: Pt, n: number, r: number) => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
      ctx.fillStyle = rgba(accent, 0.9);
      ctx.fill();
      ctx.fillStyle = bg;
      ctx.font = `700 ${Math.round(r * 1.1)}px system-ui, sans-serif`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(String(n), p.x, p.y + 1);
    };
    const arrows = (s: Pt[]) => {
      const every = size * 0.16;
      let acc = every * 0.6;
      for (let i = 1; i < s.length; i++) {
        const a = s[i - 1];
        const b = s[i];
        acc += Math.hypot(b.x - a.x, b.y - a.y);
        if (acc < every || i > s.length - 3) continue;
        acc = 0;
        const ang = Math.atan2(b.y - a.y, b.x - a.x);
        const h = size * 0.022;
        ctx.beginPath();
        ctx.moveTo(b.x - h * Math.cos(ang - 0.6), b.y - h * Math.sin(ang - 0.6));
        ctx.lineTo(b.x, b.y);
        ctx.lineTo(b.x - h * Math.cos(ang + 0.6), b.y - h * Math.sin(ang + 0.6));
        ctx.strokeStyle = rgba(accent, 0.55);
        ctx.lineWidth = 2;
        ctx.stroke();
      }
    };

    const draw = () => {
      ctx.clearRect(0, 0, size, size);
      const showGuide = level !== "freehand" || demo > 0;
      const { covered, dots: dotsHit } = progressRef.current;
      const thin = Math.max(2, size * 0.008);
      const thick = Math.max(6, size * 0.03);
      const r = Math.max(8, size * 0.026);

      if (showGuide) {
        strokes.forEach((s, si) => {
          line(s, rgba(accent, level === "guided" ? 0.3 : 0.18), thin, level === "outline" ? [6, 6] : []);
          if (level === "guided") arrows(s);
          // Traced parts, filled in.
          let run: Pt[] = [];
          s.forEach((p, k) => {
            if (covered[offsets[si] + k]) run.push(p);
            else {
              line(run, rgba(accent, 0.9), thick);
              run = [];
            }
          });
          line(run, rgba(accent, 0.9), thick);
        });
      }

      // "Show me": a pen running along the strokes in order.
      if (demo > 0) {
        let left = demoLen;
        for (const s of strokes) {
          if (left <= 0) break;
          const part: Pt[] = [s[0]];
          for (let k = 1; k < s.length && left > 0; k++) {
            left -= Math.hypot(s[k].x - s[k - 1].x, s[k].y - s[k - 1].y);
            part.push(s[k]);
          }
          line(part, rgba(gold, 0.95), thick);
          if (left <= 0) {
            const head = part[part.length - 1];
            ctx.beginPath();
            ctx.arc(head.x, head.y, r * 0.8, 0, Math.PI * 2);
            ctx.fillStyle = rgba(gold, 1);
            ctx.fill();
          }
        }
      }

      if (showGuide) {
        strokes.forEach((s, si) => label(s[0], si + 1, r));
        // The next point to reach, pulsing.
        if (level === "guided" && demo === 0) {
          const next = covered.findIndex((c) => !c);
          if (next >= 0) {
            const p = samples[next];
            const pulse = reduce ? 0.6 : 0.5 + 0.5 * Math.sin(t);
            ctx.beginPath();
            ctx.arc(p.x, p.y, r * (1.2 + 0.5 * pulse), 0, Math.PI * 2);
            ctx.strokeStyle = rgba(accent, 0.35 + 0.35 * pulse);
            ctx.lineWidth = 2;
            ctx.stroke();
          }
        }
      }

      // Dots: rings to tap once most of the body is traced.
      const bodyShare = covered.length ? covered.filter(Boolean).length / covered.length : 1;
      if (level !== "freehand" && (bodyShare > 0.85 || demo > 0)) {
        dots.forEach((d, i) => {
          const pulse = reduce ? 0.6 : 0.5 + 0.5 * Math.sin(t + i);
          ctx.beginPath();
          if (dotsHit[i]) {
            ctx.arc(d.x, d.y, r * 0.75, 0, Math.PI * 2);
            ctx.fillStyle = rgba(gold, 0.9);
            ctx.fill();
          } else {
            ctx.arc(d.x, d.y, r * (1.1 + 0.3 * pulse), 0, Math.PI * 2);
            ctx.strokeStyle = rgba(gold, 0.55 + 0.3 * pulse);
            ctx.lineWidth = 2.5;
            ctx.stroke();
          }
        });
      }

      if (demo > 0) {
        demoLen += reduce ? total : size * 0.012;
        if (demoLen > total + size * 0.3) {
          setDemo(0);
          return;
        }
      }
      if (!reduce || demo > 0) {
        t += 0.12;
        raf = requestAnimationFrame(draw);
      }
    };
    draw();
    return () => cancelAnimationFrame(raf);
  }, [prepare, size, ready, progress, level, settings.theme, demo, samples]);

  const reset = () => {
    window.clearTimeout(autoCheck.current);
    locked.current = false;
    pen.current = { down: false, lx: 0, ly: 0, mx: 0, my: 0, total: 0, on: 0 };
    const fresh = { covered: samples.map(() => false), dots: (ready?.dots ?? []).map(() => false) };
    progressRef.current = fresh;
    setProgress(fresh);
    setDrawn(false);
    setResult(null);
    setHint(false);
    prepare(inkRef.current);
  };

  const load = (i: number, f: Form) => {
    window.clearTimeout(autoCheck.current);
    locked.current = false;
    pen.current = { down: false, lx: 0, ly: 0, mx: 0, my: 0, total: 0, on: 0 };
    setIndex(i);
    setForm(f);
    setDrawn(false);
    setResult(null);
    setHint(false);
    setDemo(0);
  };

  const check = useCallback(() => {
    window.clearTimeout(autoCheck.current);
    const { covered, dots } = progressRef.current;
    const got = covered.filter(Boolean).length + DOT_WEIGHT * dots.filter(Boolean).length;
    const all = covered.length + DOT_WEIGHT * dots.length;
    const accuracy = pen.current.total ? pen.current.on / pen.current.total : 0;
    const score = traceScore(all ? got / all : 0, accuracy);
    const passed = score >= PASS_SCORE;
    setResult({ score, passed });
    if (passed) {
      locked.current = true;
      traceStore.set((b) => ({ ...b, [bestKey]: Math.max(b[bestKey] ?? 0, score) }));
    }
  }, [bestKey]);

  const record = (p: Pt) => {
    if (!ready) return;
    const cur = progressRef.current;
    pen.current.total++;
    if (onPath(samples, p, hitR * 1.8) || ready.dots.some((d) => Math.hypot(d.x - p.x, d.y - p.y) <= hitR * 1.5)) pen.current.on++;
    const covered = coverAt(samples, cur.covered, p, hitR);
    let dots = cur.dots;
    ready.dots.forEach((d, i) => {
      if (!dots[i] && Math.hypot(d.x - p.x, d.y - p.y) <= hitR * 1.3) {
        dots = dots === cur.dots ? [...dots] : dots;
        dots[i] = true;
      }
    });
    if (!covered && dots === cur.dots) return;
    const next = { covered: covered ?? cur.covered, dots };
    progressRef.current = next;
    setProgress(next);
    const share = next.covered.filter(Boolean).length / Math.max(1, next.covered.length);
    if (share >= 0.97 && next.dots.every(Boolean)) {
      window.clearTimeout(autoCheck.current);
      autoCheck.current = window.setTimeout(check, 400);
    }
  };

  const strength = level === "guided" ? 0.55 : level === "outline" ? 0.3 : 0;
  const toCanvas = (e: React.PointerEvent<HTMLCanvasElement>): Pt => {
    const rect = e.currentTarget.getBoundingClientRect();
    const p = { x: ((e.clientX - rect.left) / rect.width) * size, y: ((e.clientY - rect.top) / rect.height) * size };
    return snapToPath(samples, p, hitR * 1.5, strength);
  };
  const brush = () => Math.max(10, size * 0.045);
  const inkColor = () => rgba(cssVar("--ink") || "#1b1f3b", 0.55);

  const onDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (locked.current || !ready) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    const s = toCanvas(e);
    pen.current = { ...pen.current, down: true, lx: s.x, ly: s.y, mx: s.x, my: s.y };
    const ctx = inkRef.current?.getContext("2d");
    if (ctx) {
      ctx.beginPath();
      ctx.arc(s.x, s.y, brush() / 2, 0, Math.PI * 2);
      ctx.fillStyle = inkColor();
      ctx.fill();
    }
    setDrawn(true);
    setResult(null);
    setDemo(0);
    record(s);
  };

  const onMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const p = pen.current;
    if (!p.down || locked.current) return;
    const s = toCanvas(e);
    const nmx = (p.lx + s.x) / 2;
    const nmy = (p.ly + s.y) / 2;
    const ctx = inkRef.current?.getContext("2d");
    if (ctx) {
      ctx.beginPath();
      ctx.moveTo(p.mx, p.my);
      ctx.quadraticCurveTo(p.lx, p.ly, nmx, nmy);
      ctx.strokeStyle = inkColor();
      ctx.lineWidth = brush();
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.stroke();
    }
    pen.current = { ...p, lx: s.x, ly: s.y, mx: nmx, my: nmy };
    record(s);
  };

  const onUp = () => {
    pen.current.down = false;
  };

  const next = () => {
    const forms = formsFor(index);
    const k = forms.indexOf(form);
    if (k < forms.length - 1) load(index, forms[k + 1]);
    else load((index + 1) % LETTERS.length, "isolated");
  };

  const showLetter = () => {
    setHint(true);
    window.setTimeout(() => setHint(false), 2200);
  };

  const strokes = ready?.strokes.length ?? 0;
  const coveredShare = progress.covered.length ? progress.covered.filter(Boolean).length / progress.covered.length : 0;
  const dotsLeft = progress.dots.filter((d) => !d).length;
  const status = !ready
    ? "Preparing the letter…"
    : level === "freehand"
      ? "Write the letter from memory, then press Check."
      : coveredShare < 0.97
        ? `Trace ${strokes === 1 ? "the stroke" : `the ${strokes} strokes in order`} from the numbered start${level === "guided" ? ", following the arrows" : ""}.`
        : dotsLeft
          ? `Now tap the ${dotsLeft === 1 ? "dot" : `${dotsLeft} dots`}.`
          : "The whole letter is traced.";
  const bestScore = best[bestKey];

  return (
    <div className="tracer">
      <div className="ui tracer-controls">
        <label className="tracer-pick">
          <span className="sr-only">Letter</span>
          <select value={index} onChange={(e) => load(Number(e.target.value), "isolated")}>
            {LETTERS.map((l, i) => (
              <option key={l.ch} value={i}>
                {l.ch} {l.name}
              </option>
            ))}
          </select>
        </label>
        <div className="tracer-tabs" role="group" aria-label="Letter form">
          {formsFor(index).map((f) => (
            <button key={f} type="button" aria-pressed={form === f} onClick={() => load(index, f)}>
              {FORM_LABEL[f]}
            </button>
          ))}
        </div>
        <div className="tracer-tabs" role="group" aria-label="Level">
          {TRACE_LEVELS.map((l) => (
            <button
              key={l.id}
              type="button"
              aria-pressed={level === l.id}
              title={l.hint}
              onClick={() => {
                setLevel(l.id);
                reset();
              }}
            >
              {l.label}
            </button>
          ))}
        </div>
      </div>

      <p className="ui tracer-now">
        <span className="naskh tracer-now-glyph" lang="fa" dir="rtl">
          {glyph}
        </span>
        <span>
          <strong>{letter.name}</strong>, {FORM_LABEL[form].toLowerCase()} form
          {bestScore ? (
            <span className="text-muted">
              {" "}
              · best {"★".repeat(starsFor(bestScore)) || "☆"} {bestScore}%
            </span>
          ) : null}
        </span>
      </p>

      <div ref={wrapRef} className="tracer-wrap">
        <div className="tracer-canvas" style={{ width: size, height: size }}>
          <canvas ref={guideRef} aria-hidden="true" />
          <canvas ref={overlayRef} aria-hidden="true" />
          <canvas
            ref={inkRef}
            role="img"
            aria-label={`Tracing area for ${letter.name}, ${FORM_LABEL[form].toLowerCase()} form. Tracing needs a mouse, pen or touch.`}
            onPointerDown={onDown}
            onPointerMove={onMove}
            onPointerUp={onUp}
            onPointerCancel={onUp}
          />
        </div>
      </div>

      <p className="ui tracer-status" aria-live="polite">
        {status}
      </p>

      <div className="ui mt-3 flex flex-wrap gap-2">
        <button type="button" className="drill-btn" onClick={check} disabled={!drawn || !!result?.passed}>
          Check
        </button>
        <button type="button" className="drill-btn drill-btn-quiet" onClick={reset}>
          {result?.passed ? "Trace again" : "Clear"}
        </button>
        <button type="button" className="drill-btn drill-btn-quiet" onClick={() => setDemo((d) => d + 1)} disabled={!ready}>
          Show me
        </button>
        {level !== "guided" && (
          <button type="button" className="drill-btn drill-btn-quiet" onClick={showLetter}>
            Show the letter
          </button>
        )}
        <button type="button" className="drill-btn drill-btn-quiet" onClick={next}>
          {result?.passed ? "Next" : "Skip"}
        </button>
      </div>

      <div role="status" className="ui mt-3">
        {result && (
          <div className={`quiz-fb ${result.passed ? "quiz-ok" : "quiz-no"}`}>
            <p className="font-medium">
              {result.passed ? "Letter complete." : "Not yet."} {result.score}%{" "}
              <span aria-label={`${starsFor(result.score)} of 3 stars`}>
                {"★".repeat(starsFor(result.score))}
                {"☆".repeat(3 - starsFor(result.score))}
              </span>
            </p>
            {!result.passed && (
              <p>
                {result.score < 40
                  ? "Trace along the whole path, starting at the numbered circle."
                  : "Cover the rest of the path and keep the pen on the letter."}{" "}
                You need {PASS_SCORE}%.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
