export default function Stars({ value, size = 16 }: { value: number; size?: number }) {
  return (
    <span className="inline-flex" aria-label={`${value} de 5`}>
      {[1, 2, 3, 4, 5].map((n) => (
        <span key={n} className="material-symbols-outlined" style={{ fontSize: size, fontVariationSettings: `"FILL" ${n <= Math.round(value) ? 1 : 0}, "wght" 300` }}>star</span>
      ))}
    </span>
  );
}
