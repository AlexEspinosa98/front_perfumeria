"use client";

import { useState } from "react";
import {
  Concentrado, FormulaConf, TipoFormula,
  formatCOP, calcGramosPorFrasco, calcFrascosDisponibles,
} from "@/data/inventory";

interface Props {
  tipo: TipoFormula;
  items: Concentrado[];
  gramosDisponibles: (id: string) => number;
  onUpdateFormula: (id: string, tipo: "11" | "preparada", conf: FormulaConf) => void;
}

function FrascoBadge({ n }: { n: number }) {
  const color =
    n <= 0  ? "bg-error/10 text-error border-error/20" :
    n < 3   ? "bg-amber-400/10 text-amber-400 border-amber-400/20" :
              "bg-emerald-400/10 text-emerald-400 border-emerald-400/20";
  return (
    <span className={`font-sans text-[11px] font-semibold px-2 py-0.5 border ${color}`}>
      {n <= 0 ? "Agotado" : `${n} frascos`}
    </span>
  );
}

export default function FormulaTable({ tipo, items, gramosDisponibles, onUpdateFormula }: Props) {
  const [editId,   setEditId]   = useState<string | null>(null);
  const [editConf, setEditConf] = useState<FormulaConf>({ mlPorFrasco: 14, pctConcentrado: 0.5, precioVenta: 20000 });

  const fk = tipo === "1.1" ? "formula11" : "formulaPreparada" as const;
  const hookKey: "11" | "preparada" = tipo === "1.1" ? "11" : "preparada";

  function openEdit(c: Concentrado) {
    setEditId(c.id);
    setEditConf({ ...c[fk] });
  }

  function saveEdit(id: string) {
    onUpdateFormula(id, hookKey, editConf);
    setEditId(null);
  }

  // Global stats
  const totalFrascos = items.reduce((s, c) => {
    const disp = gramosDisponibles(c.id);
    return s + calcFrascosDisponibles(disp, c[fk]);
  }, 0);

  const totalValorEstimado = items.reduce((s, c) => {
    const disp    = gramosDisponibles(c.id);
    const frascos = calcFrascosDisponibles(disp, c[fk]);
    return s + frascos * c[fk].precioVenta;
  }, 0);

  return (
    <div>
      {/* Header */}
      <div className="flex items-end justify-between mb-5">
        <div>
          <h2 className="font-serif text-2xl text-on-surface">
            Fórmula {tipo === "1.1" ? "1.1" : "Preparada"}
          </h2>
          <p className="font-sans text-[11px] uppercase tracking-widest text-on-surface-variant mt-0.5">
            {tipo === "1.1"
              ? "Alta concentración · configura ml y % por fragancia"
              : "Producto preparado · configura ml y % por fragancia"}
          </p>
        </div>
        <div className="text-right">
          <p className="font-sans text-[9px] uppercase tracking-widest text-on-surface-variant">Frascos totales est.</p>
          <p className="font-serif text-2xl text-primary">{totalFrascos}</p>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 gap-3 mb-5">
        <div className="border p-3" style={{ backgroundColor: `rgb(var(--c-surface-low))`, borderColor: `rgba(var(--c-outline-var), 0.2)` }}>
          <p className="font-sans text-[9px] uppercase tracking-widest text-on-surface-variant mb-1">Frascos posibles</p>
          <p className="font-serif text-xl text-emerald-400">{totalFrascos}</p>
        </div>
        <div className="border p-3" style={{ backgroundColor: `rgb(var(--c-surface-low))`, borderColor: `rgba(var(--c-outline-var), 0.2)` }}>
          <p className="font-sans text-[9px] uppercase tracking-widest text-on-surface-variant mb-1">Valor estimado</p>
          <p className="font-serif text-xl text-primary">{formatCOP(totalValorEstimado)}</p>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded border" style={{ borderColor: `rgba(var(--c-outline-var), 0.15)` }}>
        <table className="w-full border-collapse min-w-[750px]">
          <thead>
            <tr style={{ backgroundColor: `rgb(var(--c-surface-low))`, borderBottom: `1px solid rgba(var(--c-outline-var), 0.2)` }}>
              {["Fragancia", "Disp. (g)", "ml/Frasco", "% Conc.", "g/Frasco", "Frascos est.", "Costo/Frasco", "Precio venta", "Ganancia", ""].map((h) => (
                <th key={h} className={`px-3 py-3 font-sans text-[9px] uppercase tracking-widest text-on-surface-variant ${["Disp. (g)", "ml/Frasco", "% Conc.", "g/Frasco", "Costo/Frasco", "Precio venta", "Ganancia"].includes(h) ? "text-right" : "text-left"}`}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {items.map((c) => {
              const conf    = editId === c.id ? editConf : c[fk];
              const disp    = gramosDisponibles(c.id);
              const gpf     = calcGramosPorFrasco(conf);
              const frascos = calcFrascosDisponibles(disp, conf);
              const costo   = parseFloat((gpf * c.costoPorGramo).toFixed(0));
              const gan     = conf.precioVenta - costo;
              const isEdit  = editId === c.id;

              return (
                <tr key={c.id} className="inv-table-row">
                  <td className="px-3 py-2.5 font-sans text-sm text-on-surface font-medium">
                    {c.nombre}
                    <span className={`ml-2 font-sans text-[9px] uppercase tracking-widest px-1.5 py-0.5 ${c.genero === "F" ? "text-rose-400" : c.genero === "M" ? "text-sky-400" : "text-primary"}`}>
                      {c.genero}
                    </span>
                  </td>
                  <td className="px-3 py-2.5 text-right font-sans text-sm text-emerald-400">{disp.toFixed(1)}</td>

                  {/* Editable fields */}
                  {isEdit ? (
                    <>
                      <td className="px-3 py-1.5">
                        <input type="number" min={1} value={editConf.mlPorFrasco}
                          onChange={(e) => setEditConf((p) => ({ ...p, mlPorFrasco: parseFloat(e.target.value) || 0 }))}
                          className="w-20 border-b text-right py-1 font-sans text-sm text-on-surface focus:outline-none focus:border-primary"
                          style={{ backgroundColor: "transparent", borderColor: `rgba(var(--c-outline-var), 0.5)` }} />
                      </td>
                      <td className="px-3 py-1.5">
                        <input type="number" min={0} max={1} step={0.01} value={editConf.pctConcentrado}
                          onChange={(e) => setEditConf((p) => ({ ...p, pctConcentrado: parseFloat(e.target.value) || 0 }))}
                          className="w-20 border-b text-right py-1 font-sans text-sm text-on-surface focus:outline-none focus:border-primary"
                          style={{ backgroundColor: "transparent", borderColor: `rgba(var(--c-outline-var), 0.5)` }} />
                      </td>
                    </>
                  ) : (
                    <>
                      <td className="px-3 py-2.5 text-right font-sans text-sm text-on-surface">{conf.mlPorFrasco}ml</td>
                      <td className="px-3 py-2.5 text-right font-sans text-sm text-on-surface">{(conf.pctConcentrado * 100).toFixed(0)}%</td>
                    </>
                  )}

                  <td className="px-3 py-2.5 text-right font-sans text-sm text-on-surface-variant">{gpf.toFixed(2)}g</td>
                  <td className="px-3 py-2.5"><FrascoBadge n={frascos} /></td>
                  <td className="px-3 py-2.5 text-right font-sans text-sm text-on-surface-variant">{formatCOP(costo)}</td>

                  {isEdit ? (
                    <td className="px-3 py-1.5">
                      <input type="number" min={0} value={editConf.precioVenta}
                        onChange={(e) => setEditConf((p) => ({ ...p, precioVenta: parseFloat(e.target.value) || 0 }))}
                        className="w-28 border-b text-right py-1 font-sans text-sm text-on-surface focus:outline-none focus:border-primary"
                        style={{ backgroundColor: "transparent", borderColor: `rgba(var(--c-outline-var), 0.5)` }} />
                    </td>
                  ) : (
                    <td className="px-3 py-2.5 text-right font-sans text-sm text-primary font-medium">{formatCOP(conf.precioVenta)}</td>
                  )}

                  <td className={`px-3 py-2.5 text-right font-sans text-sm font-medium ${gan >= 0 ? "text-emerald-400" : "text-error"}`}>
                    {formatCOP(gan)}
                  </td>

                  <td className="px-3 py-2.5">
                    {isEdit ? (
                      <div className="flex gap-2">
                        <button onClick={() => saveEdit(c.id)} className="text-emerald-400 hover:text-emerald-300 transition-colors">
                          <span className="material-symbols-outlined text-base">check</span>
                        </button>
                        <button onClick={() => setEditId(null)} className="text-on-surface-variant hover:text-error transition-colors">
                          <span className="material-symbols-outlined text-base">close</span>
                        </button>
                      </div>
                    ) : (
                      <button onClick={() => openEdit(c)} className="text-on-surface-variant hover:text-primary transition-colors">
                        <span className="material-symbols-outlined text-base">tune</span>
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
          <tfoot>
            <tr style={{ borderTop: `1px solid rgba(var(--c-outline-var), 0.25)`, backgroundColor: `rgb(var(--c-surface-low))` }}>
              <td colSpan={5} className="px-3 py-2.5 font-sans text-[10px] uppercase tracking-widest text-on-surface-variant">Total estimado</td>
              <td className="px-3 py-2.5 font-sans text-sm font-semibold text-emerald-400">{totalFrascos} frascos</td>
              <td />
              <td className="px-3 py-2.5 text-right font-sans text-sm font-semibold text-primary">{formatCOP(totalValorEstimado)}</td>
              <td colSpan={2} />
            </tr>
          </tfoot>
        </table>
      </div>

      <p className="font-sans text-[10px] text-on-surface-variant/60 mt-3 text-right">
        Haz clic en <span className="material-symbols-outlined text-[11px] align-middle">tune</span> para ajustar la fórmula por fragancia
      </p>
    </div>
  );
}
