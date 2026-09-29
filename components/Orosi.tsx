// The orosi: the stained-glass lattice of Persian windows (star-and-cross
// girih: eight-point stars with four-point crosses between them). The panes
// take the theme's glass colours from CSS, so one drawing serves light and
// dark. It is drawn once, across the top of every page; the home page's arch
// window reuses the pattern by id.

const R = 32;
const A = 22.63; // 16√2: the square corners of the star
const B = 9.37; // R − A
const OUTLINE: [number, number][] = [
  [R, 0], [A, B], [A, A], [B, A], [0, R], [-B, A], [-A, A], [-A, B],
  [-R, 0], [-A, -B], [-A, -A], [-B, -A], [0, -R], [B, -A], [A, -A], [A, -B],
];

const star = (cx: number, cy: number, k = 1) =>
  OUTLINE.map(([x, y]) => `${+(cx + x * k).toFixed(2)},${+(cy + y * k).toFixed(2)}`).join(" ");

/** Four stars per 128-unit tile, so no two neighbours share a colour. */
const PANES: [number, number, string][] = [
  [32, 32, "lapis"],
  [96, 32, "saffron"],
  [32, 96, "turq"],
  [96, 96, "rose"],
];

export const OROSI_PATTERN = "orosi-glass";

export function Orosi() {
  return (
    <div className="orosi" aria-hidden="true">
      <svg className="orosi-svg" width="100%" height="100%" focusable="false">
        <defs>
          <pattern id={OROSI_PATTERN} width="128" height="128" patternUnits="userSpaceOnUse">
            <rect width="128" height="128" className="p-ground" />
            {PANES.map(([x, y, c]) => (
              <g key={`${x}-${y}`}>
                <polygon points={star(x, y)} className={`p-${c}`} />
                <polygon points={star(x, y, 0.36)} className="p-clear" />
              </g>
            ))}
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill={`url(#${OROSI_PATTERN})`} />
      </svg>
    </div>
  );
}
