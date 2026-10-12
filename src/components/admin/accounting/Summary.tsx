"use client";

import { useEffect, useState } from "react";
import { api, CHANNEL_LABELS, cop, expenseLabel, Summary } from "@/lib/api";
import type { Range } from "./period";

function Kpi({ label, value, sub, strong }: { label: string; value: string; sub?: string; strong?: boolean }) {
  return (
    <div className={`p-4 border ${strong ? "bg-primary text-on-primary border-primary" : "bg-surface-container-low border-outline-variant"}`}>
      <p className="font-sans text-[10px] uppercase tracking-[0.18em] font-semibold opacity-70">{label}</p>
      <p className="font-serif text-[26px] leading-tight mt-1">{value}</p>
      {sub && <p className="font-sans text-[11px] opacity-70 mt-0.5">{sub}</p>}
    </div>
  );
}

function Bars({ s }: { s: Summary }) {
  const days = new Map<string, { revenue: number; expenses: number }>();
  s.sales_by_day.forEach((d) => days.set(d.date, { revenue: Number(d.revenue), expenses: days.get(d.date)?.expenses ?? 0 }));
  s.expenses_by_day.forEach((d) => days.set(d.date, { revenue: days.get(d.date)?.revenue ?? 0, expenses: Number(d.amount) }));
  const rows = [...days.entries()].sort(([a], [b]) => a.localeCompare(b));
  if (rows.length === 0) return <p className="text-sm text-outline">Sin movimientos en este periodo.</p>;
  const max = Math.max(...rows.map(([, v]) => Math.max(v.revenue, v.expenses)), 1);
  return (
    <div>
      <div className="flex items-end gap-1 h-40 overflow-x-auto pb-1">
        {rows.map(([date, v]) => (
          <div key={date} className="flex flex-col items-center gap-1 min-w-[22px] flex-1" title={`${date}\nIngresos ${cop(v.revenue)}\nGastos ${cop(v.expenses)}`}>
            <div className="flex items-end gap-[2px] h-32 w-full justify-center">
              <div className="w-1/2 bg-primary" style={{ height: `${(v.revenue / max) * 100}%`, minHeight: v.revenue ? 2 : 0 }} />
              <div className="w-1/2 bg-outline/50" style={{ height: `${(v.expenses / max) * 100}%`, minHeight: v.expenses ? 2 : 0 }} />
            </div>
            <span className="text-[9px] text-outline">{date.slice(8)}</span>
          </div>
        ))}
      </div>
      <p className="text-[11px] text-outline mt-1 flex gap-4"><span><span className="inline-block w-2 h-2 bg-primary mr-1" />Ingresos</span><span><span className="inline-block w-2 h-2 bg-outline/50 mr-1" />Gastos</span></p>
    </div>
  );
}

export default function SummaryView({ range, refreshKey }: { range: Range; refreshKey: number }) {
  const [s, setS] = useState<Summary | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    setS(null); setError("");
    api<Summary>(`/admin/accounting/summary?from=${range.from}&to=${range.to}`).then(setS).catch((e) => setError(e.message));
  }, [range.from, range.to, refreshKey]);

  if (error) return <p className="text-error">{error}</p>;
  if (!s) return <p className="text-on-surface-variant">Calculando…</p>;
  const neg = s.net_profit < 0;

  return (
    <div className="space-y-8">
      {s.items_without_cost > 0 && (
        <p className="border border-outline-variant bg-surface-container-low p-3 text-sm">
          ⚠️ {s.items_without_cost} línea(s) vendida(s) sin costo configurado: la utilidad aparece más alta de lo real. Pon el costo de cada perfume en <b>Catálogo</b> (o al registrar la venta).
        </p>
      )}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
        <Kpi label="Ingresos (ventas)" value={cop(s.revenue)} sub={`${s.sales_count} venta(s) · ${s.units} unidades`} />
        <Kpi label="Costo de lo vendido" value={cop(s.cogs)} sub="Precio base de cada perfume" />
        <Kpi label="Utilidad bruta" value={cop(s.gross_profit)} sub={s.gross_margin !== null ? `Margen ${s.gross_margin}%` : undefined} />
        <Kpi label="Gastos operativos" value={cop(s.expenses)} />
        <Kpi strong label="Balance (utilidad neta)" value={`${neg ? "−" : ""}${cop(Math.abs(s.net_profit))}`} sub={neg ? "Pérdida en el periodo" : "Ganancia en el periodo"} />
      </div>
      <p className="text-xs text-outline -mt-4">Balance = ingresos − costo de lo vendido − gastos operativos. Ticket promedio: {cop(s.avg_ticket)}.</p>

      <section className="panel space-y-3"><h3 className="font-serif text-headline-sm">Ingresos y gastos por día</h3><Bars s={s} /></section>

      <div className="grid md:grid-cols-2 gap-6">
        <section className="panel">
          <h3 className="font-serif text-headline-sm mb-3">Más vendidos</h3>
          {s.top_products.length === 0 ? <p className="text-sm text-outline">Sin ventas.</p> : (
            <table className="w-full text-sm"><thead><tr className="text-left text-[10px] uppercase tracking-widest text-outline"><th>Producto</th><th className="text-right">Uds</th><th className="text-right">Ventas</th><th className="text-right">Utilidad</th></tr></thead>
              <tbody>{s.top_products.map((t) => <tr key={t.name} className="border-t border-outline-variant/50"><td className="py-1.5">{t.name}</td><td className="text-right">{t.units}</td><td className="text-right">{cop(t.revenue)}</td><td className="text-right">{cop(t.profit)}</td></tr>)}</tbody></table>
          )}
        </section>
        <div className="space-y-6">
          <section className="panel">
            <h3 className="font-serif text-headline-sm mb-3">Ventas por canal</h3>
            {s.by_channel.length === 0 ? <p className="text-sm text-outline">Sin ventas.</p> : s.by_channel.map((c) => (
              <div key={c.channel} className="flex justify-between text-sm py-1 border-t border-outline-variant/50 first:border-0"><span>{CHANNEL_LABELS[c.channel] ?? c.channel} <span className="text-outline">({c.sales})</span></span><span>{cop(c.revenue)}</span></div>
            ))}
          </section>
          <section className="panel">
            <h3 className="font-serif text-headline-sm mb-3">Gastos por categoría</h3>
            {s.expenses_by_category.length === 0 ? <p className="text-sm text-outline">Sin gastos.</p> : s.expenses_by_category.map((c) => (
              <div key={c.category} className="flex justify-between text-sm py-1 border-t border-outline-variant/50 first:border-0"><span>{expenseLabel(c.category)}</span><span>{cop(c.amount)}</span></div>
            ))}
          </section>
        </div>
      </div>

      <section className="panel space-y-2">
        <h3 className="font-serif text-headline-sm">Inventario actual</h3>
        <p className="text-sm text-on-surface-variant">{s.inventory.units} unidades · valor a costo <b>{cop(s.inventory.value_at_cost)}</b> · valor a precio de venta <b>{cop(s.inventory.value_at_price)}</b></p>
        {s.inventory.low_stock.length > 0 && (
          <p className="text-sm">Pocas unidades: {s.inventory.low_stock.map((l) => `${l.name} (${l.stock})`).join(", ")}</p>
        )}
      </section>
    </div>
  );
}
