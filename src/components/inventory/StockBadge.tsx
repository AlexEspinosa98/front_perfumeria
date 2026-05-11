import { StockStatus } from "@/data/inventory";

const config: Record<
  StockStatus,
  { label: string; className: string; dot: string }
> = {
  en_stock: {
    label: "EN STOCK",
    className:
      "bg-emerald-400/10 text-emerald-400 border border-emerald-400/20",
    dot: "bg-emerald-400",
  },
  bajo: {
    label: "BAJO",
    className: "bg-amber-400/10 text-amber-400 border border-amber-400/20",
    dot: "bg-amber-400",
  },
  critico: {
    label: "CRÍTICO",
    className: "bg-error/10 text-error border border-error/20",
    dot: "bg-error",
  },
  agotado: {
    label: "AGOTADO",
    className:
      "bg-surface-container text-on-surface-variant border border-outline-variant/30",
    dot: "bg-on-surface-variant/40",
  },
};

export default function StockBadge({ status }: { status: StockStatus }) {
  const { label, className, dot } = config[status];
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2 py-0.5 font-sans text-[9px] tracking-widest ${className}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${dot}`} />
      {label}
    </span>
  );
}
