export default function StockLabel({ stock, inStock, className = "" }: { stock?: number; inStock: boolean; className?: string }) {
  if (!inStock) return <p className={`font-sans text-[11px] font-bold uppercase tracking-[0.12em] text-error ${className}`}>Agotado</p>;
  if (stock === undefined) return null;
  const low = stock <= 3;
  return (
    <p className={`font-sans text-[11px] uppercase tracking-[0.12em] ${low ? "font-bold" : "text-on-surface-variant"} ${className}`}>
      {low ? `¡Últimas ${stock} unidad${stock === 1 ? "" : "es"}!` : `${stock} unidades disponibles`}
    </p>
  );
}
