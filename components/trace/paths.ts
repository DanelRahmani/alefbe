"use client";

import { LETTERS, formOf, type Form } from "@/lib/persian/letters";
import { controlStrokes, glyphLayout } from "@/lib/trace";
import { buildStrokes, type TracePaths } from "@/lib/trace-path";

/** Rasterise the glyph exactly as the tracer's guide draws it and derive its smooth paths. */
export function computePaths(index: number, form: Form, size: number, font: string): TracePaths {
  const c = document.createElement("canvas");
  c.width = size;
  c.height = size;
  const ctx = c.getContext("2d", { willReadFrequently: true })!;
  const { x, y } = glyphLayout(size);
  ctx.font = font;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.direction = "rtl";
  ctx.fillStyle = "#000";
  ctx.fillText(formOf(LETTERS[index], form), x, y);
  const img = ctx.getImageData(0, 0, size, size).data;
  const data = new Uint8Array(size * size);
  for (let i = 0; i < size * size; i++) data[i] = img[i * 4 + 3] > 110 ? 1 : 0;
  return buildStrokes({ w: size, h: size, data }, controlStrokes(index, form, size), Math.max(4, size * 0.02));
}

export function amiriFont(px: number): string {
  const family = getComputedStyle(document.documentElement).getPropertyValue("--font-amiri").trim() || "serif";
  return `${px}px ${family}`;
}
