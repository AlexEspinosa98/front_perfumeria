"use client";

import { useState } from "react";
import {
  Concentrado, VentaItem, TipoFormula,
  formatCOP, calcGramosPorFrasco,
} from "@/data/inventory";

interface Props {
  items: VentaItem[];
  concentrados: Concentrado[];
  gramosDisponibles: (id: string) => number;
  onAdd: (v: VentaItem) => void;
  onDelete: (index: number) => void;
}

const emptyForm = (): Omit<VentaItem, "gramosConcentradoUsados" | "nombre" | "mlPorFrasco" | "pctConcentrado"> & {
  concentradoId: string; tipo: TipoFormula; frascos: number; gramosAlcohol: number;
} => ({
  fecha: new Date().toISOString().slice(0, 10),
  concentradoId: "",
  tipo: "preparada",
  frascos: 1,
  gramosAlcohol: 0,
  valorVenta: 0,
  cartera: 0,
});

export default function VentasTable({ items, concentrados, gramosDisponibles, onAdd, onDelete }: Props) {
  const [showForm,    setShowForm]    = useState(false);
  const [form,        setForm]        = useState(emptyForm());
  const [deleteIdx,   setDeleteIdx]   = useState<number | null>(null);
  const [filterTipo,  setFilterTipo]  = useState<"all" | TipoFormula>("all");

  // Derived from selected concentrado + tipo
  const selConc = concentrados.find((c) => c.id === form.concentradoId);
  const selConf = selConc
    ? (form.tipo === "1.1" ? selConc.formula11 : selConc.formulaPreparada)
    : null;
  const gpf            = selConf ? calcGramosPorFrasco(selConf) : 0;
  const gramosUsadosEst = parseFloat((form.frascos * gpf).toFixed(3));
  const dispActual     = selConc ? gramosDisponibles(selConc.id) : 0;
  const alcEstimado    = selConf
    ? parseFloat((form.frascos * selConf.mlPorFrasco * (1 - selConf.pctConcentrado)).toFixed(1))
    : 0;

  function setF<K extends keyof typeof form>(key: K, val: (typeof form)[K]) {
    setForm((p) => ({ ...p, [key]: val }));
  }

  function handleSave() {
    if (!form.concentradoId || !selConc || !selConf || form.frascos <= 0) return;
    const venta: VentaItem = {
      fecha:                   form.fecha,
      concentradoId:           form.concentradoId,
      nombre:                  selConc.nombre,
      tipo:                    form.tipo,
      frascos:                 form.frascos,
      mlPorFrasco:             selConf.mlPorFrasco,
      pctConcentrado:          selConf.pctConcentrado,
      gramosConcentradoUsados: gramosUsadosEst,
      gramosAlcohol:           form.gramosAlcohol,
      valorVenta:              form.valorVenta,
      cartera:                 form.cartera,
    };
    onAdd(venta);
    setForm(emptyForm());
    setShowForm(false);
  }

  const filtered = filterTipo === "all" ? items : items.filter((v) => v.tipo === filterTipo);

  const totalVentas  = filtered.reduce((s, v) => s + v.valorVenta, 0);
  const totalFrascos = filtered.reduce((s, v) => s + v.frascos, 0);
  const totalCartera = filtered.reduce((s, v) => s + v.cartera, 0);
  const totalAlcohol = filtered.reduce((s, v) => s + v.gramosAlcohol, 0);
  const totalConcentrado = filtered.reduce((s, v) => s + v.gramosConcentradoUsados, 0);

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-5">
        <div>
          <h2 className="font-serif text-2xl text-on-surface">Registro de Ventas</h2>
          <p className="font-sans text-[11px] uppercase tracking-widest text-on-surface-variant mt-0.5">
            {filtered.length} transacciones
          </p>
        </div>
        <div className="flex gap-2 flex-wrap">
          {(["all", "1.1", "preparada"] as const).map((t) => (
            <button key={t} onClick={() => setFilterTipo(t)}
              className={`px-3 py-1.5 font-sans text-[11px] uppercase tracking-widest border transition-all ${
                filterTipo === t ? "border-primary text-primary" : "border-outline-variant/30 text-on-surface-variant hover:border-primary"
              }`}>
              {t === "all" ? "Todos" : t === "1.1" ? "Fórmula 1.1" : "Preparada"}
            </button>
          ))}
          <button onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-1.5 metallic-gradient px-4 py-1.5 font-sans text-[11px] uppercase tracking-widest text-on-primary hover:brightness-110 transition-all">
            <span className="material-symbols-outlined text-base">add</span>
            Nueva venta
          </button>
        </div>
      </div>

      {/* Add form */}
      {showForm && (
        <div className="mb-5 p-5 border" style={{ backgroundColor: `rgb(var(--c-surface-low))`, borderColor: `rgba(var(--c-outline-var), 0.2)` }}>
          <p className="font-sans text-[11px] uppercase tracking-widest text-primary mb-4">Registrar venta</p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            {/* Date */}
            <div>
              <label className="font-sans text-[9px] uppercase tracking-widest text-on-surface-variant block mb-1">Fecha</label>
              <input type="date" value={form.fecha} onChange={(e) => setF("fecha", e.target.value)}
                className="w-full border-b py-1.5 font-sans text-sm text-on-surface focus:outline-none focus:border-primary"
                style={{ backgroundColor: "transparent", borderColor: `rgba(var(--c-outline-var), 0.5)` }} />
            </div>

            {/* Fragancia */}
            <div className="md:col-span-2">
              <label className="font-sans text-[9px] uppercase tracking-widest text-on-surface-variant block mb-1">Fragancia</label>
              <select value={form.concentradoId}
                onChange={(e) => setF("concentradoId", e.target.value)}
                className="w-full border-b py-1.5 font-sans text-sm text-on-surface focus:outline-none focus:border-primary appearance-none"
                style={{ backgroundColor: "transparent", borderColor: `rgba(var(--c-outline-var), 0.5)` }}>
                <option value="">— Seleccionar —</option>
                {concentrados.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.nombre} ({c.id}) · {gramosDisponibles(c.id).toFixed(1)}g disp.
                  </option>
                ))}
              </select>
            </div>

            {/* Tipo */}
            <div>
              <label className="font-sans text-[9px] uppercase tracking-widest text-on-surface-variant block mb-1">Tipo</label>
              <select value={form.tipo} onChange={(e) => setF("tipo", e.target.value as TipoFormula)}
                className="w-full border-b py-1.5 font-sans text-sm text-on-surface focus:outline-none focus:border-primary appearance-none"
                style={{ backgroundColor: "transparent", borderColor: `rgba(var(--c-outline-var), 0.5)` }}>
                <option value="preparada">Preparada</option>
                <option value="1.1">Fórmula 1.1</option>
              </select>
            </div>

            {/* Frascos */}
            <div>
              <label className="font-sans text-[9px] uppercase tracking-widest text-on-surface-variant block mb-1">Frascos vendidos</label>
              <input type="number" min={1} value={form.frascos}
                onChange={(e) => setF("frascos", parseInt(e.target.value) || 1)}
                className="w-full border-b py-1.5 font-sans text-sm text-on-surface focus:outline-none focus:border-primary text-right"
                style={{ backgroundColor: "transparent", borderColor: `rgba(var(--c-outline-var), 0.5)` }} />
            </div>

            {/* Gramos alcohol */}
            <div>
              <label className="font-sans text-[9px] uppercase tracking-widest text-on-surface-variant block mb-1">
                Alcohol usado (g)
                {alcEstimado > 0 && <span className="ml-1 text-primary/70">est. {alcEstimado}g</span>}
              </label>
              <input type="number" min={0} step={0.1} value={form.gramosAlcohol}
                onChange={(e) => setF("gramosAlcohol", parseFloat(e.target.value) || 0)}
                className="w-full border-b py-1.5 font-sans text-sm text-on-surface focus:outline-none focus:border-primary text-right"
                style={{ backgroundColor: "transparent", borderColor: `rgba(var(--c-outline-var), 0.5)` }} />
            </div>

            {/* Valor venta */}
            <div>
              <label className="font-sans text-[9px] uppercase tracking-widest text-on-surface-variant block mb-1">Valor venta (COP)</label>
              <input type="number" min={0} value={form.valorVenta}
                onChange={(e) => setF("valorVenta", parseFloat(e.target.value) || 0)}
                className="w-full border-b py-1.5 font-sans text-sm text-on-surface focus:outline-none focus:border-primary text-right"
                style={{ backgroundColor: "transparent", borderColor: `rgba(var(--c-outline-var), 0.5)` }} />
            </div>

            {/* Cartera */}
            <div>
              <label className="font-sans text-[9px] uppercase tracking-widest text-on-surface-variant block mb-1">Cartera pendiente (COP)</label>
              <input type="number" min={0} value={form.cartera}
                onChange={(e) => setF("cartera", parseFloat(e.target.value) || 0)}
                className="w-full border-b py-1.5 font-sans text-sm text-on-surface focus:outline-none focus:border-primary text-right"
                style={{ backgroundColor: "transparent", borderColor: `rgba(var(--c-outline-var), 0.5)` }} />
            </div>
          </div>

          {/* Preview */}
          {selConf && (
            <div className="mb-4 p-3 border grid grid-cols-2 sm:grid-cols-4 gap-3 text-center"
              style={{ borderColor: `rgba(var(--c-primary), 0.2)`, backgroundColor: `rgba(var(--c-primary), 0.04)` }}>
              <div>
                <p className="font-sans text-[9px] uppercase tracking-widest text-on-surface-variant">ml/frasco</p>
                <p className="font-sans text-sm text-on-surface">{selConf.mlPorFrasco}ml</p>
              </div>
              <div>
                <p className="font-sans text-[9px] uppercase tracking-widest text-on-surface-variant">g concentrado/frasco</p>
                <p className="font-sans text-sm text-on-surface">{gpf.toFixed(2)}g</p>
              </div>
              <div>
                <p className="font-sans text-[9px] uppercase tracking-widest text-on-surface-variant">Total conc. usado</p>
                <p className={`font-sans text-sm font-semibold ${gramosUsadosEst > dispActual ? "text-error" : "text-emerald-400"}`}>
                  {gramosUsadosEst.toFixed(2)}g
                  {gramosUsadosEst > dispActual && " ⚠ excede stock"}
                </p>
              </div>
              <div>
                <p className="font-sans text-[9px] uppercase tracking-widest text-on-surface-variant">Stock restante</p>
                <p className="font-sans text-sm text-emerald-400">{Math.max(0, dispActual - gramosUsadosEst).toFixed(2)}g</p>
              </div>
            </div>
          )}

          <div className="flex gap-3">
            <button onClick={handleSave}
              disabled={!form.concentradoId || form.frascos <= 0}
              className="metallic-gradient px-6 py-2 font-sans text-[11px] uppercase tracking-widest text-on-primary hover:brightness-110 transition-all disabled:opacity-40">
              Guardar
            </button>
            <button onClick={() => setShowForm(false)}
              className="border px-6 py-2 font-sans text-[11px] uppercase tracking-widest text-on-surface-variant hover:border-primary hover:text-primary transition-all"
              style={{ borderColor: `rgba(var(--c-outline-var), 0.4)` }}>
              Cancelar
            </button>
          </div>
        </div>
      )}

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-5">
        {[
          { label: "Total vendido",   value: formatCOP(totalVentas),              color: "text-primary" },
          { label: "Frascos",         value: String(totalFrascos),                color: "text-on-surface" },
          { label: "Conc. usado (g)", value: `${totalConcentrado.toFixed(1)}g`,   color: "text-amber-400" },
          { label: "Alcohol (g)",     value: `${totalAlcohol.toFixed(1)}g`,       color: "text-on-surface-variant" },
          { label: "Cartera",         value: formatCOP(totalCartera),             color: totalCartera > 0 ? "text-amber-400" : "text-emerald-400" },
        ].map(({ label, value, color }) => (
          <div key={label} className="border p-3" style={{ backgroundColor: `rgb(var(--c-surface-low))`, borderColor: `rgba(var(--c-outline-var), 0.2)` }}>
            <p className="font-sans text-[9px] uppercase tracking-widest text-on-surface-variant mb-1">{label}</p>
            <p className={`font-serif text-xl ${color}`}>{value}</p>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded border" style={{ borderColor: `rgba(var(--c-outline-var), 0.15)` }}>
        <table className="w-full border-collapse min-w-[750px]">
          <thead>
            <tr style={{ backgroundColor: `rgb(var(--c-surface-low))`, borderBottom: `1px solid rgba(var(--c-outline-var), 0.2)` }}>
              {["Fecha", "Fragancia", "Tipo", "Frascos", "g Conc.", "g Alcohol", "Valor", "Cartera", ""].map((h) => (
                <th key={h} className={`px-3 py-3 font-sans text-[9px] uppercase tracking-widest text-on-surface-variant ${["Frascos", "g Conc.", "g Alcohol", "Valor", "Cartera"].includes(h) ? "text-right" : "text-left"}`}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((v, i) => (
              <tr key={i} className="inv-table-row">
                <td className="px-3 py-2.5 font-sans text-sm text-on-surface-variant whitespace-nowrap">
                  {new Date(v.fecha + "T12:00:00").toLocaleDateString("es-CO", { day: "2-digit", month: "short", year: "2-digit" })}
                </td>
                <td className="px-3 py-2.5 font-sans text-sm text-on-surface">{v.nombre}</td>
                <td className="px-3 py-2.5">
                  <span className={`font-sans text-[9px] uppercase tracking-widest px-2 py-0.5 border ${
                    v.tipo === "1.1"
                      ? "bg-primary/10 text-primary border-primary/20"
                      : "bg-sky-400/10 text-sky-400 border-sky-400/20"
                  }`}>
                    {v.tipo === "1.1" ? "1.1" : "Prep."}
                  </span>
                </td>
                <td className="px-3 py-2.5 text-right font-sans text-sm text-on-surface">{v.frascos}</td>
                <td className="px-3 py-2.5 text-right font-sans text-sm text-amber-400">{v.gramosConcentradoUsados.toFixed(1)}g</td>
                <td className="px-3 py-2.5 text-right font-sans text-sm text-on-surface-variant">{v.gramosAlcohol.toFixed(1)}g</td>
                <td className="px-3 py-2.5 text-right font-sans text-sm text-primary font-medium">{formatCOP(v.valorVenta)}</td>
                <td className="px-3 py-2.5 text-right">
                  {v.cartera > 0
                    ? <span className="font-sans text-sm text-amber-400">{formatCOP(v.cartera)}</span>
                    : <span className="text-emerald-400 text-[11px] font-sans">✓</span>
                  }
                </td>
                <td className="px-3 py-2.5">
                  <button onClick={() => setDeleteIdx(i)} className="text-on-surface-variant hover:text-error transition-colors">
                    <span className="material-symbols-outlined text-base">delete</span>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr style={{ borderTop: `1px solid rgba(var(--c-outline-var), 0.25)`, backgroundColor: `rgb(var(--c-surface-low))` }}>
              <td colSpan={3} className="px-3 py-2.5 font-sans text-[10px] uppercase tracking-widest text-on-surface-variant">Totales</td>
              <td className="px-3 py-2.5 text-right font-sans text-sm font-semibold text-on-surface">{totalFrascos}</td>
              <td className="px-3 py-2.5 text-right font-sans text-sm font-semibold text-amber-400">{totalConcentrado.toFixed(1)}g</td>
              <td className="px-3 py-2.5 text-right font-sans text-sm font-semibold text-on-surface-variant">{totalAlcohol.toFixed(1)}g</td>
              <td className="px-3 py-2.5 text-right font-sans text-sm font-semibold text-primary">{formatCOP(totalVentas)}</td>
              <td className="px-3 py-2.5 text-right font-sans text-sm font-semibold text-amber-400">{totalCartera > 0 ? formatCOP(totalCartera) : "—"}</td>
              <td />
            </tr>
          </tfoot>
        </table>
      </div>

      {/* Delete confirm */}
      {deleteIdx !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div className="fixed inset-0 bg-black/70" onClick={() => setDeleteIdx(null)} />
          <div className="relative z-10 w-full max-w-xs border p-6 text-center" style={{ backgroundColor: `rgb(var(--c-surface-lowest))`, borderColor: `rgba(var(--c-error), 0.3)` }}>
            <p className="font-sans text-sm text-on-surface mb-4">¿Eliminar este registro?</p>
            <div className="flex gap-3">
              <button onClick={() => { onDelete(deleteIdx); setDeleteIdx(null); }}
                className="flex-1 bg-error text-on-error py-2 font-sans text-[11px] uppercase tracking-widest">Eliminar</button>
              <button onClick={() => setDeleteIdx(null)}
                className="flex-1 border py-2 font-sans text-[11px] uppercase tracking-widest text-on-surface-variant"
                style={{ borderColor: `rgba(var(--c-outline-var), 0.4)` }}>Cancelar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
