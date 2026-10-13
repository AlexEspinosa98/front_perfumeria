"use client";

import { useMemo, useState } from "react";

export type Range = { from: string; to: string };
const iso = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

export const todayIso = () => iso(new Date());

const PRESETS: { key: string; label: string; range: () => Range }[] = [
  { key: "today", label: "Hoy", range: () => ({ from: iso(new Date()), to: iso(new Date()) }) },
  { key: "7d", label: "7 días", range: () => { const d = new Date(); d.setDate(d.getDate() - 6); return { from: iso(d), to: iso(new Date()) }; } },
  { key: "year", label: "Este año", range: () => { const n = new Date(); return { from: iso(new Date(n.getFullYear(), 0, 1)), to: iso(n) }; } },
];

const MONTHS = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"];
const monthOf = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
const monthRange = (m: string): Range => {
  const [y, mo] = m.split("-").map(Number);
  return { from: iso(new Date(y, mo - 1, 1)), to: iso(new Date(y, mo, 0)) };   // día 0 del mes siguiente = último día
};
const shiftMonth = (m: string, d: number) => { const [y, mo] = m.split("-").map(Number); return monthOf(new Date(y, mo - 1 + d, 1)); };
const monthLabel = (m: string) => { const [y, mo] = m.split("-").map(Number); return `${MONTHS[mo - 1]} ${y}`; };

export function usePeriod() {
  const [key, setKey] = useState("month");           // por defecto: el mes actual
  const [month, setMonth] = useState(monthOf(new Date()));
  const [custom, setCustom] = useState<Range>({ from: iso(new Date()), to: iso(new Date()) });
  const range = useMemo<Range>(
    () => (key === "custom" ? custom : key === "month" ? monthRange(month) : PRESETS.find((p) => p.key === key)!.range()),
    [key, custom, month],
  );
  return { key, setKey, month, setMonth, custom, setCustom, range };
}

export function PeriodPicker({ p }: { p: ReturnType<typeof usePeriod> }) {
  const current = monthOf(new Date());
  return (
    <div className="space-y-3">
      <div className="flex gap-2 flex-wrap items-center">
        <button onClick={() => p.setKey("month")} className={`chip ${p.key === "month" ? "chip-active" : ""}`}>Por mes</button>
        {PRESETS.map((x) => <button key={x.key} onClick={() => p.setKey(x.key)} className={`chip ${p.key === x.key ? "chip-active" : ""}`}>{x.label}</button>)}
        <button onClick={() => p.setKey("custom")} className={`chip ${p.key === "custom" ? "chip-active" : ""}`}>Personalizado</button>
      </div>
      {p.key === "month" && (
        <div className="flex items-center gap-2 flex-wrap">
          <button onClick={() => p.setMonth(shiftMonth(p.month, -1))} className="chip" aria-label="Mes anterior">‹</button>
          <span className="min-w-[150px] text-center font-serif text-[20px] capitalize">{monthLabel(p.month)}</span>
          <button onClick={() => p.setMonth(shiftMonth(p.month, 1))} disabled={p.month >= current} className="chip disabled:opacity-30" aria-label="Mes siguiente">›</button>
          <input type="month" className="field !w-auto !py-1 text-sm" value={p.month} max={current} onChange={(e) => e.target.value && p.setMonth(e.target.value)} aria-label="Elegir mes" />
          {p.month !== current && <button onClick={() => p.setMonth(current)} className="chip">Mes actual</button>}
        </div>
      )}
      {p.key === "custom" && (
        <span className="flex gap-2 items-center text-sm flex-wrap">
          <input type="date" className="field !w-auto !py-1" value={p.custom.from} max={p.custom.to} onChange={(e) => p.setCustom({ ...p.custom, from: e.target.value })} />
          <span>a</span>
          <input type="date" className="field !w-auto !py-1" value={p.custom.to} min={p.custom.from} onChange={(e) => p.setCustom({ ...p.custom, to: e.target.value })} />
        </span>
      )}
    </div>
  );
}
