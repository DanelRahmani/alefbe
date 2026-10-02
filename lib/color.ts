// Colours for canvas drawing: a CSS colour ("#1f4aa8", "#fff" or a computed
// "rgb(31, 74, 168)") with an alpha, as an rgba() string.

export function rgba(color: string, a: number): string {
  const rgb = color.match(/rgba?\(([^)]+)\)/);
  if (rgb) {
    const [r, g, b] = rgb[1].split(/[\s,/]+/).map(Number);
    return `rgba(${r}, ${g}, ${b}, ${a})`;
  }
  const h = color.replace("#", "");
  const n = parseInt(h.length === 3 ? h.replace(/./g, "$&$&") : h, 16);
  return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${a})`;
}
