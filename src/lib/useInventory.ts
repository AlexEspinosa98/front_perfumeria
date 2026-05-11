"use client";

import { useEffect, useState } from "react";
import {
  Concentrado, VentaItem, BajoPedidoItem, InsumoItem,
  concentradosSeed, ventasSeed, bajoPedidoSeed, insumosSeed,
  calcGramosPorFrasco, FormulaConf,
} from "@/data/inventory";

const KEYS = {
  concentrados: "inv_concentrados_v1",
  ventas:       "inv_ventas_v1",
  bajoPedido:   "inv_bajo_v1",
  insumos:      "inv_insumos_v1",
};

function load<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function save<T>(key: string, value: T) {
  try { localStorage.setItem(key, JSON.stringify(value)); } catch {}
}

export function useInventory() {
  const [concentrados, setConcentrados] = useState<Concentrado[]>(concentradosSeed);
  const [ventas,       setVentas]       = useState<VentaItem[]>(ventasSeed);
  const [bajoPedido,   setBajoPedido]   = useState<BajoPedidoItem[]>(bajoPedidoSeed);
  const [insumos,      setInsumos]      = useState<InsumoItem[]>(insumosSeed);
  const [hydrated,     setHydrated]     = useState(false);

  // Hydrate from localStorage after mount (avoids SSR mismatch)
  useEffect(() => {
    setConcentrados(load(KEYS.concentrados, concentradosSeed));
    setVentas(      load(KEYS.ventas,       ventasSeed));
    setBajoPedido(  load(KEYS.bajoPedido,   bajoPedidoSeed));
    setInsumos(     load(KEYS.insumos,      insumosSeed));
    setHydrated(true);
  }, []);

  useEffect(() => { if (hydrated) save(KEYS.concentrados, concentrados); }, [concentrados, hydrated]);
  useEffect(() => { if (hydrated) save(KEYS.ventas,       ventas);       }, [ventas, hydrated]);
  useEffect(() => { if (hydrated) save(KEYS.bajoPedido,   bajoPedido);   }, [bajoPedido, hydrated]);
  useEffect(() => { if (hydrated) save(KEYS.insumos,      insumos);      }, [insumos, hydrated]);

  // ── Derived: grams available per concentrado ────────────────────────────────
  // gramosStock never decrements — ventas carry gramosConcentradoUsados so we
  // can always recompute without mutating the source record.
  function gramosDisponibles(id: string): number {
    const c = concentrados.find((x) => x.id === id);
    if (!c) return 0;
    const used = ventas
      .filter((v) => v.concentradoId === id)
      .reduce((s, v) => s + v.gramosConcentradoUsados, 0);
    return Math.max(0, c.gramosStock - used);
  }

  // ── Concentrados CRUD ───────────────────────────────────────────────────────

  function addConcentrado(item: Concentrado) {
    setConcentrados((p) => [...p, item]);
  }

  function updateConcentrado(item: Concentrado) {
    setConcentrados((p) => p.map((c) => (c.id === item.id ? item : c)));
  }

  function deleteConcentrado(id: string) {
    setConcentrados((p) => p.filter((c) => c.id !== id));
  }

  // ── Formula CRUD (stored inside each Concentrado) ───────────────────────────

  function updateFormula(id: string, tipo: "11" | "preparada", conf: FormulaConf) {
    setConcentrados((p) =>
      p.map((c) =>
        c.id !== id
          ? c
          : tipo === "11"
            ? { ...c, formula11: conf }
            : { ...c, formulaPreparada: conf }
      )
    );
  }

  // ── Ventas CRUD ─────────────────────────────────────────────────────────────

  function addVenta(v: VentaItem) {
    setVentas((p) => [v, ...p]);
  }

  function deleteVenta(index: number) {
    setVentas((p) => p.filter((_, i) => i !== index));
  }

  // ── Bajo Pedido CRUD ────────────────────────────────────────────────────────

  function addBajoPedido(item: BajoPedidoItem) {
    setBajoPedido((p) => [...p, item]);
  }
  function deleteBajoPedido(ref: string) {
    setBajoPedido((p) => p.filter((i) => i.referencia !== ref));
  }
  function addInsumo(item: InsumoItem) {
    setInsumos((p) => [...p, item]);
  }
  function deleteInsumo(name: string) {
    setInsumos((p) => p.filter((i) => i.insumo !== name));
  }

  // ── Reset ────────────────────────────────────────────────────────────────────

  function resetAll() {
    setConcentrados(concentradosSeed);
    setVentas(ventasSeed);
    setBajoPedido(bajoPedidoSeed);
    setInsumos(insumosSeed);
    Object.values(KEYS).forEach((k) => localStorage.removeItem(k));
  }

  return {
    concentrados, ventas, bajoPedido, insumos, hydrated,
    gramosDisponibles,
    addConcentrado, updateConcentrado, deleteConcentrado,
    updateFormula,
    addVenta, deleteVenta,
    addBajoPedido, deleteBajoPedido,
    addInsumo, deleteInsumo,
    resetAll,
  };
}

// Re-export helpers so components can import from one place
export { calcGramosPorFrasco };
