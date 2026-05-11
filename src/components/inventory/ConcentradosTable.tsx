"use client";

import { useState } from "react";
import {
  Concentrado, GeneroConcentrado, FormulaConf,
  formatCOP, nextConcentradoId,
} from "@/data/inventory";

interface Props {
  items: Concentrado[];
  gramosDisponibles: (id: string) => number;
  onAdd: (c: Concentrado) => void;
  onUpdate: (c: Concentrado) => void;
  onDelete: (id: string) => void;
}

const DEFAULT_F11: FormulaConf   = { mlPorFrasco: 14, pctConcentrado: 0.5,  precioVenta: 20000 };
const DEFAULT_FP: FormulaConf    = { mlPorFrasco: 14, pctConcentrado: 0.2,  precioVenta: 12000 };

const generoColors: Record<GeneroConcentrado, string> = {
  F:      "bg-rose-400/10 text-rose-400 border border-rose-400/20",
  M:      "bg-sky-400/10  text-sky-400  border border-sky-400/20",
  UNISEX: "bg-primary/10  text-primary  border border-primary/20",
};

const emptyForm = (existing: Concentrado[]): Concentrado => ({
  id:               nextConcentradoId(existing),
  nombre:           "",
  genero:           "F",
  gramosStock:      0,
  costoPorGramo:    0,
  proveedor:        "",
  formula11:        { ...DEFAULT_F11 },
  formulaPreparada: { ...DEFAULT_FP  },
});

function StockBar({ used, total }: { used: number; total: number }) {
  const pct = total > 0 ? Math.min(100, (used / total) * 100) : 0;
  const color = pct > 80 ? "bg-error" : pct > 50 ? "bg-amber-400" : "bg-emerald-400";
  return (
    <div className="w-full h-1 rounded-full overflow-hidden" style={{ backgroundColor: "rgba(var(--c-outline-var), 0.2)" }}>
      <div className={`h-full ${color} transition-all`} style={{ width: `${pct}%` }} />
    </div>
  );
}

export default function ConcentradosTable({ items, gramosDisponibles, onAdd, onUpdate, onDelete }: Props) {
  const [showForm,   setShowForm]   = useState(false);
  const [editItem,   setEditItem]   = useState<Concentrado | null>(null);
  const [form,       setForm]       = useState<Concentrado>(() => emptyForm(items));
  const [deleteId,   setDeleteId]   = useState<string | null>(null);
  const [filterG,    setFilterG]    = useState<"all" | GeneroConcentrado>("all");

  const visible = filterG === "all" ? items : items.filter((c) => c.genero === filterG);

  function openAdd() {
    setForm(emptyForm(items));
    setEditItem(null);
    setShowForm(true);
  }

  function openEdit(c: Concentrado) {
    setForm({ ...c, formula11: { ...c.formula11 }, formulaPreparada: { ...c.formulaPreparada } });
    setEditItem(c);
    setShowForm(true);
  }

  function handleSave() {
    if (!form.nombre.trim() || form.gramosStock < 0 || form.costoPorGramo < 0) return;
    if (editItem) onUpdate(form);
    else onAdd(form);
    setShowForm(false);
  }

  function setF(key: keyof Concentrado, val: string | number) {
    setForm((p) => ({ ...p, [key]: val }));
  }

  const totalStock = items.reduce((s, c) => s + c.gramosStock, 0);
  const totalDisp  = items.reduce((s, c) => s + gramosDisponibles(c.id), 0);
  const totalUsado = totalStock - totalDisp;

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-5">
        <div>
          <h2 className="font-serif text-2xl text-on-surface">Concentrados</h2>
          <p className="font-sans text-[11px] uppercase tracking-widest text-on-surface-variant mt-0.5">
            Inventario base · {items.length} fragancias
          </p>
        </div>
        <div className="flex gap-2 flex-wrap items-center">
          {(["all", "F", "M", "UNISEX"] as const).map((g) => (
            <button key={g} onClick={() => setFilterG(g)}
              className={`px-3 py-1.5 font-sans text-[11px] uppercase tracking-widest border transition-all ${
                filterG === g ? "border-primary text-primary" : "border-outline-variant/30 text-on-surface-variant hover:border-primary"
              }`}>
              {g === "all" ? "Todos" : g}
            </button>
          ))}
          <button onClick={openAdd}
            className="flex items-center gap-1.5 metallic-gradient px-4 py-1.5 font-sans text-[11px] uppercase tracking-widest text-on-primary hover:brightness-110 transition-all">
            <span className="material-symbols-outlined text-base">add</span>
            Agregar
          </button>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-3 gap-3 mb-5">
        {[
          { label: "Stock total",    value: `${totalStock.toFixed(1)}g`,      color: "text-on-surface" },
          { label: "Disponible",     value: `${totalDisp.toFixed(1)}g`,       color: "text-emerald-400" },
          { label: "Consumido",      value: `${totalUsado.toFixed(1)}g`,      color: "text-amber-400" },
        ].map(({ label, value, color }) => (
          <div key={label} className="border p-3" style={{ backgroundColor: `rgb(var(--c-surface-low))`, borderColor: `rgba(var(--c-outline-var), 0.2)` }}>
            <p className="font-sans text-[9px] uppercase tracking-widest text-on-surface-variant mb-1">{label}</p>
            <p className={`font-serif text-xl ${color}`}>{value}</p>
          </div>
        ))}
      </div>

      {/* Add / Edit form */}
      {showForm && (
        <div className="mb-5 p-5 border" style={{ backgroundColor: `rgb(var(--c-surface-low))`, borderColor: `rgba(var(--c-outline-var), 0.2)` }}>
          <p className="font-sans text-[11px] uppercase tracking-widest text-primary mb-4">
            {editItem ? "Editar concentrado" : "Nuevo concentrado"}
          </p>

          {/* Base fields */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            {[
              { label: "ID",             key: "id",            type: "text",   disabled: !!editItem },
              { label: "Nombre",         key: "nombre",        type: "text",   disabled: false },
              { label: "Gramos en stock",key: "gramosStock",   type: "number", disabled: false },
              { label: "Costo / g (COP)",key: "costoPorGramo", type: "number", disabled: false },
              { label: "Proveedor",      key: "proveedor",     type: "text",   disabled: false },
            ].map(({ label, key, type, disabled }) => (
              <div key={key}>
                <label className="font-sans text-[9px] uppercase tracking-widest text-on-surface-variant block mb-1">{label}</label>
                <input type={type} disabled={disabled}
                  value={String(form[key as keyof Concentrado] ?? "")}
                  onChange={(e) => setF(key as keyof Concentrado, type === "number" ? parseFloat(e.target.value) || 0 : e.target.value)}
                  className="w-full border-b py-1.5 font-sans text-sm text-on-surface focus:outline-none focus:border-primary transition-colors disabled:opacity-40"
                  style={{ backgroundColor: "transparent", borderColor: `rgba(var(--c-outline-var), 0.5)` }} />
              </div>
            ))}
            <div>
              <label className="font-sans text-[9px] uppercase tracking-widest text-on-surface-variant block mb-1">Género</label>
              <select value={form.genero} onChange={(e) => setF("genero", e.target.value as GeneroConcentrado)}
                className="w-full border-b py-1.5 font-sans text-sm text-on-surface focus:outline-none focus:border-primary transition-colors appearance-none"
                style={{ backgroundColor: "transparent", borderColor: `rgba(var(--c-outline-var), 0.5)` }}>
                <option value="F">Femenino</option>
                <option value="M">Masculino</option>
                <option value="UNISEX">Unisex</option>
              </select>
            </div>
          </div>

          {/* Formula configs */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            {(["formula11", "formulaPreparada"] as const).map((fk) => {
              const label = fk === "formula11" ? "Fórmula 1.1" : "Fórmula Preparada";
              const conf  = form[fk];
              const setConf = (k: keyof FormulaConf, v: number) =>
                setForm((p) => ({ ...p, [fk]: { ...p[fk], [k]: v } }));
              return (
                <div key={fk} className="p-3 border" style={{ borderColor: `rgba(var(--c-outline-var), 0.2)` }}>
                  <p className="font-sans text-[10px] uppercase tracking-widest text-primary mb-3">{label}</p>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { label: "ml/Frasco", key: "mlPorFrasco" },
                      { label: "% Concentrado", key: "pctConcentrado" },
                      { label: "Precio venta", key: "precioVenta" },
                    ].map(({ label: fl, key: fkey }) => (
                      <div key={fkey}>
                        <label className="font-sans text-[9px] uppercase tracking-widest text-on-surface-variant block mb-1">{fl}</label>
                        <input type="number" step={fkey === "pctConcentrado" ? "0.01" : "1"}
                          min={0} max={fkey === "pctConcentrado" ? 1 : undefined}
                          value={conf[fkey as keyof FormulaConf]}
                          onChange={(e) => setConf(fkey as keyof FormulaConf, parseFloat(e.target.value) || 0)}
                          className="w-full border-b py-1.5 font-sans text-sm text-on-surface focus:outline-none focus:border-primary transition-colors"
                          style={{ backgroundColor: "transparent", borderColor: `rgba(var(--c-outline-var), 0.5)` }} />
                      </div>
                    ))}
                  </div>
                  <p className="font-sans text-[9px] text-on-surface-variant mt-2">
                    → {(conf.mlPorFrasco * conf.pctConcentrado).toFixed(2)}g concentrado / frasco
                  </p>
                </div>
              );
            })}
          </div>

          <div className="flex gap-3">
            <button onClick={handleSave}
              className="metallic-gradient px-6 py-2 font-sans text-[11px] uppercase tracking-widest text-on-primary hover:brightness-110 transition-all">
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

      {/* Table */}
      <div className="overflow-x-auto rounded border" style={{ borderColor: `rgba(var(--c-outline-var), 0.15)` }}>
        <table className="w-full border-collapse min-w-[700px]">
          <thead>
            <tr style={{ backgroundColor: `rgb(var(--c-surface-low))`, borderBottom: `1px solid rgba(var(--c-outline-var), 0.2)` }}>
              {["ID", "Nombre", "Género", "Stock", "Usado", "Disponible", "Costo/g", "Proveedor", ""].map((h) => (
                <th key={h} className={`px-3 py-3 font-sans text-[9px] uppercase tracking-widest text-on-surface-variant ${["Stock", "Usado", "Disponible", "Costo/g"].includes(h) ? "text-right" : "text-left"}`}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {visible.map((c) => {
              const disp  = gramosDisponibles(c.id);
              const usado = c.gramosStock - disp;
              return (
                <tr key={c.id} className="inv-table-row">
                  <td className="px-3 py-2.5 font-sans text-[11px] uppercase tracking-widest text-primary">{c.id}</td>
                  <td className="px-3 py-2.5 font-sans text-sm text-on-surface font-medium">{c.nombre}</td>
                  <td className="px-3 py-2.5">
                    <span className={`font-sans text-[9px] uppercase tracking-widest px-2 py-0.5 ${generoColors[c.genero]}`}>{c.genero}</span>
                  </td>
                  <td className="px-3 py-2.5 text-right font-sans text-sm text-on-surface">{c.gramosStock.toFixed(1)}g</td>
                  <td className="px-3 py-2.5 text-right font-sans text-sm text-amber-400">{usado.toFixed(1)}g</td>
                  <td className="px-3 py-2.5">
                    <div className="flex flex-col items-end gap-1">
                      <span className="font-sans text-sm font-medium text-emerald-400">{disp.toFixed(1)}g</span>
                      <StockBar used={usado} total={c.gramosStock} />
                    </div>
                  </td>
                  <td className="px-3 py-2.5 text-right font-sans text-sm text-on-surface-variant">{formatCOP(c.costoPorGramo)}</td>
                  <td className="px-3 py-2.5 font-sans text-sm text-on-surface-variant">{c.proveedor || "—"}</td>
                  <td className="px-3 py-2.5">
                    <div className="flex gap-2">
                      <button onClick={() => openEdit(c)} className="text-on-surface-variant hover:text-primary transition-colors">
                        <span className="material-symbols-outlined text-base">edit</span>
                      </button>
                      <button onClick={() => setDeleteId(c.id)} className="text-on-surface-variant hover:text-error transition-colors">
                        <span className="material-symbols-outlined text-base">delete</span>
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Delete confirm */}
      {deleteId !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div className="fixed inset-0 bg-black/70" onClick={() => setDeleteId(null)} />
          <div className="relative z-10 w-full max-w-xs border p-6 text-center" style={{ backgroundColor: `rgb(var(--c-surface-lowest))`, borderColor: `rgba(var(--c-error), 0.3)` }}>
            <p className="font-sans text-sm text-on-surface mb-1">¿Eliminar este concentrado?</p>
            <p className="font-sans text-[11px] text-on-surface-variant mb-4">Se perderán las ventas asociadas del cálculo.</p>
            <div className="flex gap-3">
              <button onClick={() => { onDelete(deleteId); setDeleteId(null); }}
                className="flex-1 bg-error text-on-error py-2 font-sans text-[11px] uppercase tracking-widest">Eliminar</button>
              <button onClick={() => setDeleteId(null)}
                className="flex-1 border py-2 font-sans text-[11px] uppercase tracking-widest text-on-surface-variant"
                style={{ borderColor: `rgba(var(--c-outline-var), 0.4)` }}>Cancelar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
