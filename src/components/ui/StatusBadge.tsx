import { STATUS_LABELS } from "@/lib/api";

/** Color por estado del pedido: se distingue de un vistazo (también en tema oscuro). */
export const STATUS_STYLES: Record<string, { badge: string; dot: string }> = {
  pending:   { badge: "bg-amber-100 text-amber-900 border-amber-400 dark:bg-amber-950 dark:text-amber-200 dark:border-amber-700",       dot: "bg-amber-500" },
  confirmed: { badge: "bg-blue-100 text-blue-900 border-blue-400 dark:bg-blue-950 dark:text-blue-200 dark:border-blue-700",             dot: "bg-blue-500" },
  paid:      { badge: "bg-green-100 text-green-900 border-green-400 dark:bg-green-950 dark:text-green-200 dark:border-green-700",       dot: "bg-green-500" },
  preparing: { badge: "bg-violet-100 text-violet-900 border-violet-400 dark:bg-violet-950 dark:text-violet-200 dark:border-violet-700", dot: "bg-violet-500" },
  shipped:   { badge: "bg-cyan-100 text-cyan-900 border-cyan-400 dark:bg-cyan-950 dark:text-cyan-200 dark:border-cyan-700",             dot: "bg-cyan-500" },
  delivered: { badge: "bg-emerald-200 text-emerald-950 border-emerald-500 dark:bg-emerald-900 dark:text-emerald-100 dark:border-emerald-600", dot: "bg-emerald-600" },
  cancelled: { badge: "bg-red-100 text-red-900 border-red-400 dark:bg-red-950 dark:text-red-200 dark:border-red-700",                   dot: "bg-red-500" },
};

export const statusDot = (status: string) => STATUS_STYLES[status]?.dot ?? "bg-primary";

export default function StatusBadge({ status, className = "" }: { status: string; className?: string }) {
  const st = STATUS_STYLES[status] ?? { badge: "border-outline-variant", dot: "" };
  return (
    <span className={`inline-flex items-center gap-1.5 border px-2 py-0.5 font-sans text-[10px] uppercase tracking-[0.1em] font-bold whitespace-nowrap ${st.badge} ${className}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${st.dot}`} />{STATUS_LABELS[status] ?? status}
    </span>
  );
}
