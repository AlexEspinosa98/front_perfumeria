"use client";

import { useState } from "react";
import { BajoPedidoItem, InsumoItem, formatCOP } from "@/data/inventory";

interface Props {
  items: BajoPedidoItem[];
  insumos: InsumoItem[];
  onAddItem: (i: BajoPedidoItem) => void;
  onDeleteItem: (ref: string) => void;
  onAddInsumo: (i: InsumoItem) => void;
  onDeleteInsumo: (name: string) => void;
}

const genderColors = {
  MUJER:  "bg-rose-400/10 text-rose-400 border border-rose-400/20",
  HOMBRE: "bg-sky-400/10 text-sky-400 border border-sky-400/20",
  UNISEX: "bg-primary/10 text-primary border border-primary/20",
};

export default function BajoPedidoTable({
  items, insumos, onAddItem, onDeleteItem, onAddInsumo, onDeleteInsumo,
}: Props) {
  const [showFragForm, setShowFragForm] = useState(false);
  const [showInsForm, setShowInsForm] = useState(false);
  const [fragForm, setFragForm] = useState<BajoPedidoItem>({ referencia: "", genero: "MUJER", precio: 0, proveedor: "" });
  const [insForm, setInsForm] = useState<InsumoItem>({ insumo: "", precio: 0, proveedor: "" });

  const totalFragrancias = items.reduce((s, i) => s + i.precio, 0);
  const totalInsumos = insumos.reduce((s, i) => s + i.precio, 0);

  return (
    <div className="space-y-8">
      {/* ── Fragancias ── */}
      <div>
        <div className="flex items-end justify-between mb-4">
          <div>
            <h2 className="font-serif text-2xl text-on-surface">Fragancias por Pedir</h2>
            <p className="font-sans text-[11px] uppercase tracking-widest text-on-surface-variant mt-0.5">
              Wishlist de restock · {items.length} referencias
            </p>
          </div>
          <button
            onClick={() => setShowFragForm(!showFragForm)}
            className="flex items-center gap-1.5 metallic-gradient px-4 py-2 font-sans text-[11px] uppercase tracking-widest text-on-primary hover:brightness-110 transition-all"
          >
            <span className="material-symbols-outlined text-base">add</span>
            Agregar
          </button>
        </div>

        {showFragForm && (
          <div className="mb-4 p-4 border" style={{ backgroundColor: `rgb(var(--c-surface-low))`, borderColor: `rgba(var(--c-outline-var), 0.2)` }}>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              <div>
                <label className="font-sans text-[9px] uppercase tracking-widest text-on-surface-variant block mb-1">Referencia</label>
                <input type="text" value={fragForm.referencia} onChange={(e) => setFragForm({ ...fragForm, referencia: e.target.value })}
                  className="w-full border-b py-1.5 font-sans text-sm text-on-surface focus:outline-none focus:border-primary transition-colors"
                  style={{ backgroundColor: "transparent", borderColor: `rgba(var(--c-outline-var), 0.5)` }} />
              </div>
              <div>
                <label className="font-sans text-[9px] uppercase tracking-widest text-on-surface-variant block mb-1">Género</label>
                <select value={fragForm.genero} onChange={(e) => setFragForm({ ...fragForm, genero: e.target.value as BajoPedidoItem["genero"] })}
                  className="w-full border-b py-1.5 font-sans text-sm text-on-surface focus:outline-none focus:border-primary transition-colors appearance-none"
                  style={{ backgroundColor: "transparent", borderColor: `rgba(var(--c-outline-var), 0.5)` }}>
                  <option value="MUJER">Mujer</option>
                  <option value="HOMBRE">Hombre</option>
                  <option value="UNISEX">Unisex</option>
                </select>
              </div>
              <div>
                <label className="font-sans text-[9px] uppercase tracking-widest text-on-surface-variant block mb-1">Precio est.</label>
                <input type="number" min="0" value={fragForm.precio}
                  onChange={(e) => setFragForm({ ...fragForm, precio: parseFloat(e.target.value) || 0 })}
                  className="w-full border-b py-1.5 font-sans text-sm text-on-surface focus:outline-none focus:border-primary transition-colors text-right"
                  style={{ backgroundColor: "transparent", borderColor: `rgba(var(--c-outline-var), 0.5)` }} />
              </div>
              <div>
                <label className="font-sans text-[9px] uppercase tracking-widest text-on-surface-variant block mb-1">Proveedor</label>
                <input type="text" value={fragForm.proveedor ?? ""} onChange={(e) => setFragForm({ ...fragForm, proveedor: e.target.value })}
                  className="w-full border-b py-1.5 font-sans text-sm text-on-surface focus:outline-none focus:border-primary transition-colors"
                  style={{ backgroundColor: "transparent", borderColor: `rgba(var(--c-outline-var), 0.5)` }} />
              </div>
            </div>
            <div className="flex gap-3">
              <button onClick={() => { onAddItem(fragForm); setFragForm({ referencia: "", genero: "MUJER", precio: 0, proveedor: "" }); setShowFragForm(false); }}
                className="metallic-gradient px-6 py-2 font-sans text-[11px] uppercase tracking-widest text-on-primary hover:brightness-110 transition-all">
                Guardar
              </button>
              <button onClick={() => setShowFragForm(false)}
                className="border px-6 py-2 font-sans text-[11px] uppercase tracking-widest text-on-surface-variant hover:border-primary hover:text-primary transition-all"
                style={{ borderColor: `rgba(var(--c-outline-var), 0.4)` }}>
                Cancelar
              </button>
            </div>
          </div>
        )}

        <div className="overflow-x-auto rounded border" style={{ borderColor: `rgba(var(--c-outline-var), 0.15)` }}>
          <table className="w-full border-collapse min-w-[400px]">
            <thead>
              <tr style={{ backgroundColor: `rgb(var(--c-surface-low))`, borderBottom: `1px solid rgba(var(--c-outline-var), 0.2)` }}>
                {["Referencia", "Género", "Precio est.", "Proveedor", ""].map((h) => (
                  <th key={h} className={`px-3 py-3 font-sans text-[9px] uppercase tracking-widest text-on-surface-variant ${h === "Precio est." ? "text-right" : "text-left"}`}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.referencia} className="inv-table-row">
                  <td className="px-3 py-2.5 font-sans text-sm text-on-surface font-medium">{item.referencia}</td>
                  <td className="px-3 py-2.5"><span className={`font-sans text-[9px] uppercase tracking-widest px-2 py-0.5 ${genderColors[item.genero]}`}>{item.genero}</span></td>
                  <td className="px-3 py-2.5 text-right font-sans text-sm text-primary font-medium">{formatCOP(item.precio)}</td>
                  <td className="px-3 py-2.5 font-sans text-sm text-on-surface-variant">{item.proveedor || "—"}</td>
                  <td className="px-3 py-2.5">
                    <button onClick={() => onDeleteItem(item.referencia)} className="text-on-surface-variant hover:text-error transition-colors">
                      <span className="material-symbols-outlined text-base">delete</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr style={{ borderTop: `1px solid rgba(var(--c-outline-var), 0.25)`, backgroundColor: `rgb(var(--c-surface-low))` }}>
                <td colSpan={2} className="px-3 py-2.5 font-sans text-[10px] uppercase tracking-widest text-on-surface-variant">Total fragancias</td>
                <td className="px-3 py-2.5 text-right font-sans text-sm font-semibold text-primary">{formatCOP(totalFragrancias)}</td>
                <td colSpan={2} />
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {/* ── Insumos ── */}
      <div>
        <div className="flex items-end justify-between mb-4">
          <div>
            <h2 className="font-serif text-2xl text-on-surface">Insumos Pendientes</h2>
            <p className="font-sans text-[11px] uppercase tracking-widest text-on-surface-variant mt-0.5">
              Materiales y suministros · {insumos.length} ítems
            </p>
          </div>
          <button
            onClick={() => setShowInsForm(!showInsForm)}
            className="flex items-center gap-1.5 metallic-gradient px-4 py-2 font-sans text-[11px] uppercase tracking-widest text-on-primary hover:brightness-110 transition-all"
          >
            <span className="material-symbols-outlined text-base">add</span>
            Agregar
          </button>
        </div>

        {showInsForm && (
          <div className="mb-4 p-4 border" style={{ backgroundColor: `rgb(var(--c-surface-low))`, borderColor: `rgba(var(--c-outline-var), 0.2)` }}>
            <div className="grid grid-cols-3 gap-4 mb-4">
              {[
                { label: "Insumo", key: "insumo", type: "text" },
                { label: "Precio", key: "precio", type: "number" },
                { label: "Proveedor", key: "proveedor", type: "text" },
              ].map(({ label, key, type }) => (
                <div key={key}>
                  <label className="font-sans text-[9px] uppercase tracking-widest text-on-surface-variant block mb-1">{label}</label>
                  <input type={type} value={String(insForm[key as keyof InsumoItem])}
                    onChange={(e) => setInsForm({ ...insForm, [key]: type === "number" ? parseFloat(e.target.value) || 0 : e.target.value })}
                    className="w-full border-b py-1.5 font-sans text-sm text-on-surface focus:outline-none focus:border-primary transition-colors"
                    style={{ backgroundColor: "transparent", borderColor: `rgba(var(--c-outline-var), 0.5)` }} />
                </div>
              ))}
            </div>
            <div className="flex gap-3">
              <button onClick={() => { onAddInsumo(insForm); setInsForm({ insumo: "", precio: 0, proveedor: "" }); setShowInsForm(false); }}
                className="metallic-gradient px-6 py-2 font-sans text-[11px] uppercase tracking-widest text-on-primary hover:brightness-110 transition-all">
                Guardar
              </button>
              <button onClick={() => setShowInsForm(false)}
                className="border px-6 py-2 font-sans text-[11px] uppercase tracking-widest text-on-surface-variant hover:border-primary hover:text-primary transition-all"
                style={{ borderColor: `rgba(var(--c-outline-var), 0.4)` }}>
                Cancelar
              </button>
            </div>
          </div>
        )}

        <div className="overflow-x-auto rounded border" style={{ borderColor: `rgba(var(--c-outline-var), 0.15)` }}>
          <table className="w-full border-collapse min-w-[400px]">
            <thead>
              <tr style={{ backgroundColor: `rgb(var(--c-surface-low))`, borderBottom: `1px solid rgba(var(--c-outline-var), 0.2)` }}>
                {["Insumo", "Precio", "Proveedor", ""].map((h) => (
                  <th key={h} className={`px-3 py-3 font-sans text-[9px] uppercase tracking-widest text-on-surface-variant ${h === "Precio" ? "text-right" : "text-left"}`}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {insumos.map((item) => (
                <tr key={item.insumo} className="inv-table-row">
                  <td className="px-3 py-2.5 font-sans text-sm text-on-surface">{item.insumo}</td>
                  <td className="px-3 py-2.5 text-right font-sans text-sm text-primary">{formatCOP(item.precio)}</td>
                  <td className="px-3 py-2.5 font-sans text-sm text-on-surface-variant">{item.proveedor}</td>
                  <td className="px-3 py-2.5">
                    <button onClick={() => onDeleteInsumo(item.insumo)} className="text-on-surface-variant hover:text-error transition-colors">
                      <span className="material-symbols-outlined text-base">delete</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr style={{ borderTop: `1px solid rgba(var(--c-outline-var), 0.25)`, backgroundColor: `rgb(var(--c-surface-low))` }}>
                <td className="px-3 py-2.5 font-sans text-[10px] uppercase tracking-widest text-on-surface-variant">Total insumos</td>
                <td className="px-3 py-2.5 text-right font-sans text-sm font-semibold text-primary">{formatCOP(totalInsumos)}</td>
                <td colSpan={2} />
              </tr>
            </tfoot>
          </table>
        </div>

        <div className="mt-4 p-4 border" style={{ borderColor: `rgba(var(--c-primary), 0.2)`, backgroundColor: `rgba(var(--c-primary), 0.05)` }}>
          <div className="flex justify-between items-center">
            <span className="font-sans text-[11px] uppercase tracking-widest text-on-surface-variant">Inversión total necesaria</span>
            <span className="font-serif text-2xl text-primary">{formatCOP(totalFragrancias + totalInsumos)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
