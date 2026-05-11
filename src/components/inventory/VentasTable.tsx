"use client";

import { useState } from "react";
import { VentaItem, formatCOP } from "@/data/inventory";

interface Props {
  items: VentaItem[];
}

export default function VentasTable({ items }: Props) {
  const [filterGender, setFilterGender] = useState<"all" | "F" | "M">("all");

  const filtered = items.filter(
    (v) => filterGender === "all" || v.gender === filterGender
  );

  const totalVentas = filtered.reduce((s, v) => s + v.valorVenta, 0);
  const totalGramos = filtered.reduce((s, v) => s + v.gramosVendidos, 0);
  const totalCartera = filtered.reduce((s, v) => s + v.cartera, 0);

  const byMonth: Record<string, number> = {};
  filtered.forEach((v) => {
    const month = v.fecha.slice(0, 7);
    byMonth[month] = (byMonth[month] || 0) + v.valorVenta;
  });

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
        <div>
          <h2 className="font-serif text-headline-sm text-on-surface">
            Registro de Ventas
          </h2>
          <p className="font-sans text-[11px] uppercase tracking-widest text-on-surface-variant mt-0.5">
            Abril – Mayo – Junio 2025 · {filtered.length} transacciones
          </p>
        </div>
        <div className="flex gap-2">
          {(["all", "F", "M"] as const).map((g) => (
            <button
              key={g}
              onClick={() => setFilterGender(g)}
              className={`px-4 py-2 font-sans text-label-sm uppercase tracking-widest border transition-all ${
                filterGender === g
                  ? "border-primary text-primary bg-primary/10"
                  : "border-outline-variant/30 text-on-surface-variant hover:border-primary"
              }`}
            >
              {g === "all" ? "Todos" : g === "F" ? "Femenino" : "Masculino"}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="bg-surface-container-low border border-outline-variant/20 p-4">
          <p className="font-sans text-[9px] uppercase tracking-widest text-on-surface-variant mb-1">
            Total Vendido
          </p>
          <p className="font-serif text-headline-sm text-primary">
            {formatCOP(totalVentas)}
          </p>
        </div>
        <div className="bg-surface-container-low border border-outline-variant/20 p-4">
          <p className="font-sans text-[9px] uppercase tracking-widest text-on-surface-variant mb-1">
            Gramos Despachados
          </p>
          <p className="font-serif text-headline-sm text-on-surface">
            {totalGramos}g
          </p>
        </div>
        <div className="bg-surface-container-low border border-outline-variant/20 p-4">
          <p className="font-sans text-[9px] uppercase tracking-widest text-on-surface-variant mb-1">
            Cartera Pendiente
          </p>
          <p
            className={`font-serif text-headline-sm ${
              totalCartera > 0 ? "text-amber-400" : "text-emerald-400"
            }`}
          >
            {formatCOP(totalCartera)}
          </p>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-outline-variant/20 bg-surface-container-low">
              {["Fecha", "Código", "Fragancia", "Género", "Gramos", "Valor venta", "Cartera"].map(
                (h) => (
                  <th
                    key={h}
                    className={`px-4 py-3 font-sans text-[9px] uppercase tracking-widest text-on-surface-variant ${
                      ["Gramos", "Valor venta", "Cartera"].includes(h)
                        ? "text-right"
                        : "text-left"
                    }`}
                  >
                    {h}
                  </th>
                )
              )}
            </tr>
          </thead>
          <tbody>
            {filtered.map((venta, i) => (
              <tr
                key={i}
                className="border-b border-outline-variant/10 hover:bg-surface-container/50 transition-colors"
              >
                <td className="px-4 py-3 font-sans text-body-md text-on-surface-variant">
                  {new Date(venta.fecha + "T12:00:00").toLocaleDateString("es-CO", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}
                </td>
                <td className="px-4 py-3 font-sans text-[11px] uppercase tracking-widest text-primary">
                  {venta.codigo}
                </td>
                <td className="px-4 py-3 font-sans text-body-md text-on-surface">
                  {venta.fragancia}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`font-sans text-[9px] uppercase tracking-widest px-2 py-0.5 ${
                      venta.gender === "F"
                        ? "bg-rose-400/10 text-rose-400 border border-rose-400/20"
                        : "bg-sky-400/10 text-sky-400 border border-sky-400/20"
                    }`}
                  >
                    {venta.gender === "F" ? "Femenino" : "Masculino"}
                  </span>
                </td>
                <td className="px-4 py-3 text-right font-sans text-body-md text-on-surface">
                  {venta.gramosVendidos}g
                </td>
                <td className="px-4 py-3 text-right font-sans text-body-md text-primary font-medium">
                  {formatCOP(venta.valorVenta)}
                </td>
                <td className="px-4 py-3 text-right">
                  {venta.cartera > 0 ? (
                    <span className="font-sans text-body-md text-amber-400 font-medium">
                      {formatCOP(venta.cartera)}
                    </span>
                  ) : (
                    <span className="font-sans text-[11px] text-emerald-400">
                      ✓ Pagado
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="border-t border-outline-variant/30 bg-surface-container-low">
              <td
                colSpan={4}
                className="px-4 py-3 font-sans text-label-sm uppercase tracking-widest text-on-surface-variant"
              >
                Totales
              </td>
              <td className="px-4 py-3 text-right font-sans text-body-md font-semibold text-on-surface">
                {totalGramos}g
              </td>
              <td className="px-4 py-3 text-right font-sans text-body-md font-semibold text-primary">
                {formatCOP(totalVentas)}
              </td>
              <td className="px-4 py-3 text-right font-sans text-body-md font-semibold text-amber-400">
                {totalCartera > 0 ? formatCOP(totalCartera) : "—"}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}
