// The completion mark: a round مُهر (personal seal) reading «تمام», finished.

const DOTS = Array.from({ length: 28 }, (_, i) => {
  const a = (i / 28) * Math.PI * 2;
  return { x: 50 + 42 * Math.cos(a), y: 50 + 42 * Math.sin(a) };
});

export function Seal({ size = 72, stamp = false, label = "Finished" }: { size?: number; stamp?: boolean; label?: string }) {
  return (
    <span className={stamp ? "seal seal-stamp" : "seal"} role="img" aria-label={label}>
      <svg width={size} height={size} viewBox="0 0 100 100" aria-hidden="true">
        <circle cx="50" cy="50" r="47" fill="none" stroke="currentColor" strokeWidth="3.5" />
        <circle cx="50" cy="50" r="37" fill="none" stroke="currentColor" strokeWidth="1.25" />
        {DOTS.map((d, i) => (
          <circle key={i} cx={d.x.toFixed(2)} cy={d.y.toFixed(2)} r="1.3" fill="currentColor" />
        ))}
        <text
          x="50"
          y="63"
          textAnchor="middle"
          direction="rtl"
          fill="currentColor"
          style={{ fontFamily: "var(--font-markazi), serif", fontSize: "36px", fontWeight: 700 }}
        >
          تمام
        </text>
      </svg>
    </span>
  );
}
