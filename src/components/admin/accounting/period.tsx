"use client";

import { useMemo, useState } from "react";

export type Range = { from: string; to: string };
const iso = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

export const todayIso = () => iso(new Date());

const PRESETS: { key: string; label: string; range: () => Range }[] = [
  { key: "today", label: "Hoy", range: () => ({ from: iso(new Date()), to: iso(new Date()) }) },
  { key: "7d", label: "7 días", range: () => { const d = new Date(); d.setDate(d.getDate() - 6); return { from: iso(d), to: iso(new Date()) }; } },
  { key: "month", label: "Este mes", range: () => { const n = new Date(); return { from: iso(new Date(n.getFullYear(), n.getMonth(), 1)), to: iso(n) }; } },
  { key: "lastmonth", label: "Mes pasado", range: () => { const n = new Date(); return { from: iso(new Date(n.getFullYear(), n.getMonth() - 1, 1)), to: iso(new Date(n.getFullYear(), n.getMonth(), 0)) }; } },
  { key: "year", label: "Este año", range: () => { const n = new Date(); return { from: iso(new Date(n.getFullYear(), 0, 1)), to: iso(n) }; } },
];

export function usePeriod() {
  const [key, setKey] = useState("month");
  const [custom, setCustom] = useState<Range>({ from: iso(new Date()), to: iso(new Date()) });
  const range = useMemo<Range>(() => (key === "custom" ? custom : PRESETS.find((p) => p.key === key)!.range()), [key, custom]);
  return { key, setKey, custom, setCustom, range };
}

export function PeriodPicker({ p }: { p: ReturnType<typeof usePeriod> }) {
  return (
    <div className="flex gap-2 flex-wrap items-center">
      {PRESETS.map((x) => <button key={x.key} onClick={() => p.setKey(x.key)} className={`chip ${p.key === x.key ? "chip-active" : ""}`}>{x.label}</button>)}
      <button onClick={() => p.setKey("custom")} className={`chip ${p.key === "custom" ? "chip-active" : ""}`}>Personalizado</button>
      {p.key === "custom" && (
        <span className="flex gap-2 items-center text-sm">
          <input type="date" className="field !w-auto !py-1" value={p.custom.from} max={p.custom.to} onChange={(e) => p.setCustom({ ...p.custom, from: e.target.value })} />
          <span>a</span>
          <input type="date" className="field !w-auto !py-1" value={p.custom.to} min={p.custom.from} onChange={(e) => p.setCustom({ ...p.custom, to: e.target.value })} />
        </span>
      )}
    </div>
  );
}
