"use client";

import { useState } from "react";
import { FragranceItem, formatCOP, getStockStatus } from "@/data/inventory";
import StockBadge from "./StockBadge";

interface Props {
  items: FragranceItem[];
  title: string;
  subtitle: string;
}

type SortKey = keyof FragranceItem;

export default function FragranceTable({ items, title, subtitle }: Props) {
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("codigo");
  const [sortAsc, setSortAsc] = useState(true);
  const [selectedItem, setSelectedItem] = useState<FragranceItem | null>(null);
  const [editGrams, setEditGrams] = useState("");
  const [localItems, setLocalItems] = useState(items);

  const filtered = localItems
    .filter(
      (f) =>
        f.nombre.toLowerCase().includes(search.toLowerCase()) ||
        f.codigo.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => {
      const av = a[sortKey];
      const bv = b[sortKey];
      if (typeof av === "number" && typeof bv === "number") {
        return sortAsc ? av - bv : bv - av;
      }
      return sortAsc
        ? String(av).localeCompare(String(bv))
        : String(bv).localeCompare(String(av));
    });

  const handleSort = (key: SortKey) => {
    if (key === sortKey) setSortAsc(!sortAsc);
    else {
      setSortKey(key);
      setSortAsc(true);
    }
  };

  const handleSaveEdit = () => {
    if (!selectedItem) return;
    const newGrams = parseFloat(editGrams);
    if (isNaN(newGrams) || newGrams < 0) return;
    const gramosVendidos =
      selectedItem.stockGramos - newGrams < 0
        ? selectedItem.gramosVendidos
        : selectedItem.gramosVendidos + (selectedItem.gramosActuales - newGrams);
    setLocalItems((prev) =>
      prev.map((f) =>
        f.codigo === selectedItem.codigo
          ? {
              ...f,
              gramosActuales: newGrams,
              frascos: parseFloat((newGrams / 14).toFixed(2)),
              gramosVendidos: Math.max(0, gramosVendidos),
            }
          : f
      )
    );
    setSelectedItem(null);
    setEditGrams("");
  };

  const exportCSV = () => {
    const headers = [
      "Código",
      "Nombre",
      "Stock Grams",
      "Grams Actuales",
      "Frascos",
      "Precio Venta",
      "Costo/Frasco",
      "Ganancia/Frasco",
      "Estado",
    ];
    const rows = filtered.map((f) => [
      f.codigo,
      f.nombre,
      f.stockGramos,
      f.gramosActuales,
      f.frascos.toFixed(2),
      f.precioVenta,
      f.totalFrasco,
      f.gananciaPorFrasco,
      getStockStatus(f.frascos),
    ]);
    const csv = [headers, ...rows].map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `inventario_${title.replace(/\s/g, "_").toLowerCase()}.csv`;
    a.click();
  };

  const ColHeader = ({
    k,
    label,
    align = "left",
  }: {
    k: SortKey;
    label: string;
    align?: "left" | "right" | "center";
  }) => (
    <th
      className={`px-4 py-3 font-sans text-[9px] uppercase tracking-widest text-on-surface-variant cursor-pointer hover:text-primary transition-colors select-none text-${align}`}
      onClick={() => handleSort(k)}
    >
      <span className="inline-flex items-center gap-1">
        {label}
        {sortKey === k && (
          <span className="material-symbols-outlined text-[12px]">
            {sortAsc ? "arrow_upward" : "arrow_downward"}
          </span>
        )}
      </span>
    </th>
  );

  const totalGramos = filtered.reduce((s, f) => s + Math.max(0, f.gramosActuales), 0);
  const totalFrascos = filtered.reduce((s, f) => s + Math.max(0, f.frascos), 0);
  const totalGanancia = filtered.reduce((s, f) => s + f.gananciaTotal, 0);

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
        <div>
          <h2 className="font-serif text-headline-sm text-on-surface">
            {title}
          </h2>
          <p className="font-sans text-[11px] uppercase tracking-widest text-on-surface-variant mt-0.5">
            {subtitle} · {filtered.length} referencias
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant/50 text-lg">
              search
            </span>
            <input
              type="text"
              placeholder="Buscar fragancia..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-surface-container-low border border-outline-variant/30 pl-10 pr-4 py-2 font-sans text-label-sm text-on-surface focus:outline-none focus:border-primary transition-colors w-56"
            />
          </div>
          <button
            onClick={exportCSV}
            className="flex items-center gap-2 border border-outline-variant/30 px-4 py-2 font-sans text-label-sm uppercase tracking-widest text-on-surface-variant hover:border-primary hover:text-primary transition-all"
          >
            <span className="material-symbols-outlined text-lg">download</span>
            CSV
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-outline-variant/20 bg-surface-container-low">
              <ColHeader k="codigo" label="Código" />
              <ColHeader k="nombre" label="Fragancia" />
              <ColHeader k="gramosActuales" label="Gramos actuales" align="right" />
              <ColHeader k="frascos" label="Frascos est." align="right" />
              <ColHeader k="precioVenta" label="P. Venta" align="right" />
              <ColHeader k="totalFrasco" label="Costo/Frasco" align="right" />
              <ColHeader k="gananciaPorFrasco" label="Ganancia" align="right" />
              <ColHeader k="gramosVendidos" label="Grs Vendidos" align="right" />
              <th className="px-4 py-3 font-sans text-[9px] uppercase tracking-widest text-on-surface-variant text-center">
                Estado
              </th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {filtered.map((item) => {
              const status = getStockStatus(item.frascos);
              const isLow = status === "critico" || status === "agotado";
              return (
                <tr
                  key={item.codigo}
                  className={`border-b border-outline-variant/10 hover:bg-surface-container/50 transition-colors ${
                    isLow ? "bg-error/3" : ""
                  }`}
                >
                  <td className="px-4 py-3 font-sans text-[11px] uppercase tracking-widest text-primary">
                    {item.codigo}
                  </td>
                  <td className="px-4 py-3 font-sans text-body-md text-on-surface font-medium">
                    {item.nombre}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <span
                      className={`font-sans text-body-md font-semibold ${
                        item.gramosActuales <= 0
                          ? "text-error"
                          : item.gramosActuales < 14
                          ? "text-amber-400"
                          : "text-on-surface"
                      }`}
                    >
                      {item.gramosActuales.toLocaleString("es-CO")}g
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <span
                      className={`font-sans text-body-md ${
                        item.frascos < 1
                          ? "text-error"
                          : item.frascos < 2
                          ? "text-amber-400"
                          : "text-on-surface"
                      }`}
                    >
                      {Math.max(0, item.frascos).toFixed(2)}
                    </span>
                    <span className="text-on-surface-variant text-[10px] ml-1">
                      fcos
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right font-sans text-body-md text-primary font-medium">
                    {item.precioVenta > 0 ? formatCOP(item.precioVenta) : "—"}
                  </td>
                  <td className="px-4 py-3 text-right font-sans text-body-md text-on-surface-variant">
                    {item.totalFrasco > 0 ? formatCOP(item.totalFrasco) : "—"}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <span className="font-sans text-body-md text-emerald-400 font-medium">
                      {item.gananciaPorFrasco > 0
                        ? formatCOP(item.gananciaPorFrasco)
                        : "—"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right font-sans text-body-md text-on-surface-variant">
                    {item.gramosVendidos.toLocaleString("es-CO")}g
                  </td>
                  <td className="px-4 py-3 text-center">
                    <StockBadge status={status} />
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => {
                        setSelectedItem(item);
                        setEditGrams(String(item.gramosActuales));
                      }}
                      className="text-on-surface-variant hover:text-primary transition-colors"
                      title="Editar stock"
                    >
                      <span className="material-symbols-outlined text-lg">
                        edit
                      </span>
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
          <tfoot>
            <tr className="border-t border-outline-variant/30 bg-surface-container-low">
              <td
                colSpan={2}
                className="px-4 py-3 font-sans text-label-sm uppercase tracking-widest text-on-surface-variant"
              >
                Totales
              </td>
              <td className="px-4 py-3 text-right font-sans text-body-md font-semibold text-primary">
                {totalGramos.toLocaleString("es-CO")}g
              </td>
              <td className="px-4 py-3 text-right font-sans text-body-md font-semibold text-primary">
                {totalFrascos.toFixed(2)}
              </td>
              <td colSpan={2} />
              <td className="px-4 py-3 text-right font-sans text-body-md font-semibold text-emerald-400">
                {formatCOP(totalGanancia)}
              </td>
              <td colSpan={3} />
            </tr>
          </tfoot>
        </table>
      </div>

      {selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
          <div className="bg-surface-container-low border border-outline-variant/30 p-8 w-full max-w-md">
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="font-sans text-label-sm uppercase tracking-widest text-primary">
                  {selectedItem.codigo}
                </p>
                <h3 className="font-serif text-headline-sm text-on-surface">
                  {selectedItem.nombre}
                </h3>
              </div>
              <button
                onClick={() => setSelectedItem(null)}
                className="text-on-surface-variant hover:text-primary"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
              <div className="bg-surface-container p-3">
                <p className="font-sans text-[9px] uppercase tracking-widest text-on-surface-variant mb-1">
                  Stock original
                </p>
                <p className="font-sans text-on-surface font-semibold">
                  {selectedItem.stockGramos}g
                </p>
              </div>
              <div className="bg-surface-container p-3">
                <p className="font-sans text-[9px] uppercase tracking-widest text-on-surface-variant mb-1">
                  Gramos vendidos
                </p>
                <p className="font-sans text-on-surface font-semibold">
                  {selectedItem.gramosVendidos}g
                </p>
              </div>
              <div className="bg-surface-container p-3">
                <p className="font-sans text-[9px] uppercase tracking-widest text-on-surface-variant mb-1">
                  Precio venta
                </p>
                <p className="font-sans text-primary font-semibold">
                  {formatCOP(selectedItem.precioVenta)}
                </p>
              </div>
              <div className="bg-surface-container p-3">
                <p className="font-sans text-[9px] uppercase tracking-widest text-on-surface-variant mb-1">
                  Ganancia/frasco
                </p>
                <p className="font-sans text-emerald-400 font-semibold">
                  {formatCOP(selectedItem.gananciaPorFrasco)}
                </p>
              </div>
            </div>

            <div className="mb-6">
              <label className="font-sans text-label-sm uppercase tracking-widest text-on-surface-variant block mb-2">
                Gramos actuales en stock
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="number"
                  value={editGrams}
                  onChange={(e) => setEditGrams(e.target.value)}
                  min="0"
                  step="0.5"
                  className="flex-1 bg-transparent border-b border-outline-variant/50 py-2 font-sans text-body-lg text-on-surface focus:outline-none focus:border-primary transition-colors text-right"
                />
                <span className="font-sans text-on-surface-variant">g</span>
              </div>
              {editGrams !== "" && !isNaN(parseFloat(editGrams)) && (
                <p className="font-sans text-[11px] text-on-surface-variant mt-2">
                  ≈{" "}
                  <span className="text-primary font-semibold">
                    {(parseFloat(editGrams) / 14).toFixed(2)} frascos
                  </span>{" "}
                  estimados
                </p>
              )}
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleSaveEdit}
                className="flex-1 metallic-gradient text-on-primary py-3 font-sans text-label-sm uppercase tracking-widest hover:brightness-110 transition-all"
              >
                Guardar
              </button>
              <button
                onClick={() => setSelectedItem(null)}
                className="border border-outline-variant/30 px-6 py-3 font-sans text-label-sm uppercase tracking-widest text-on-surface-variant hover:border-primary hover:text-primary transition-all"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
