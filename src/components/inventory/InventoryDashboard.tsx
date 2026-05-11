"use client";

import { useState } from "react";
import { formatCOP, calcFrascosDisponibles } from "@/data/inventory";
import { useInventory } from "@/lib/useInventory";
import ConcentradosTable from "./ConcentradosTable";
import FormulaTable from "./FormulaTable";
import VentasTable from "./VentasTable";
import BajoPedidoTable from "./BajoPedidoTable";
import OriginalesTable from "./OriginalesTable";
import MetricCard from "./MetricCard";
import { inventarioOriginales } from "@/data/inventory";

type Tab = "concentrados" | "formula11" | "preparada" | "ventas" | "pedido" | "originales";

const tabs: { id: Tab; label: string; icon: string }[] = [
  { id: "concentrados", label: "Concentrados",  icon: "science"        },
  { id: "formula11",    label: "Fórmula 1.1",   icon: "colorize"       },
  { id: "preparada",    label: "Preparada",      icon: "local_bar"      },
  { id: "ventas",       label: "Ventas",         icon: "trending_up"    },
  { id: "pedido",       label: "Bajo Pedido",    icon: "shopping_cart"  },
  { id: "originales",   label: "Originales",     icon: "stars"          },
];

interface Props { onLogout: () => void }

export default function InventoryDashboard({ onLogout }: Props) {
  const [activeTab, setActiveTab] = useState<Tab>("concentrados");
  const inv = useInventory();

  // ── Global KPIs ────────────────────────────────────────────────────────────
  const totalStockG = inv.concentrados.reduce((s, c) => s + c.gramosStock, 0);
  const totalDispG  = inv.concentrados.reduce((s, c) => s + inv.gramosDisponibles(c.id), 0);

  const total11 = inv.concentrados.reduce((s, c) => {
    const d = inv.gramosDisponibles(c.id);
    return s + calcFrascosDisponibles(d, c.formula11);
  }, 0);

  const totalPrep = inv.concentrados.reduce((s, c) => {
    const d = inv.gramosDisponibles(c.id);
    return s + calcFrascosDisponibles(d, c.formulaPreparada);
  }, 0);

  const ventasTotales  = inv.ventas.reduce((s, v) => s + v.valorVenta, 0);
  const carteraPend    = inv.ventas.reduce((s, v) => s + v.cartera, 0);

  const dateStr = new Date().toLocaleDateString("es-CO", {
    weekday: "long", year: "numeric", month: "long", day: "numeric",
  });

  return (
    <div className="min-h-screen" style={{ backgroundColor: "rgb(var(--c-bg))" }}>
      {/* Header */}
      <div className="border-b px-5 md:px-20 py-4 sticky top-0 z-40"
        style={{ backgroundColor: `rgba(var(--c-surface-lowest), 0.95)`, backdropFilter: "blur(12px)", borderColor: `rgba(var(--c-outline-var), 0.2)` }}>
        <div className="max-w-[1440px] mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-px h-8 bg-primary/40" />
            <div>
              <h1 className="font-serif text-xl text-primary tracking-widest uppercase">Inventario</h1>
              <p className="font-sans text-[10px] uppercase tracking-widest text-on-surface-variant capitalize hidden md:block">{dateStr}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={inv.resetAll}
              className="hidden md:flex items-center gap-1.5 border border-outline-variant/30 px-3 py-1.5 font-sans text-[10px] uppercase tracking-widest text-on-surface-variant hover:border-error hover:text-error transition-all"
              title="Restaurar datos originales">
              <span className="material-symbols-outlined text-base">restart_alt</span>
              Reset
            </button>
            <span className="font-sans text-label-sm text-on-surface-variant uppercase tracking-widest hidden md:block">Fragance Perfumería</span>
            <button onClick={onLogout}
              className="flex items-center gap-1.5 text-on-surface-variant hover:text-error transition-colors font-sans text-label-sm uppercase tracking-widest">
              <span className="material-symbols-outlined text-lg">logout</span>
              <span className="hidden md:block">Salir</span>
            </button>
          </div>
        </div>
      </div>

      <div className="px-5 md:px-20 py-6 max-w-[1440px] mx-auto">
        {/* KPIs */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
          <MetricCard label="Stock total"        value={`${totalStockG.toFixed(0)}g`}        icon="inventory_2"     color="primary" />
          <MetricCard label="Disponible"          value={`${totalDispG.toFixed(0)}g`}          icon="science"         color="green"   />
          <MetricCard label="Frascos 1.1 est."   value={String(total11)}                       icon="colorize"        color="primary" subtitle="alta conc." />
          <MetricCard label="Frascos prep. est." value={String(totalPrep)}                     icon="local_bar"       color="primary" subtitle="preparados" />
          <MetricCard label="Ventas período"     value={formatCOP(ventasTotales)}               icon="trending_up"     color="green"   />
          <MetricCard label="Cartera"            value={formatCOP(carteraPend)}                 icon="account_balance" color={carteraPend > 0 ? "amber" : "green"} subtitle="pendiente" />
        </div>

        {/* Tabs */}
        <div className="border-b mb-6" style={{ borderColor: `rgba(var(--c-outline-var), 0.2)` }}>
          <div className="flex overflow-x-auto scrollbar-hide">
            {tabs.map((tab) => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 md:px-6 py-3 font-sans text-[11px] uppercase tracking-widest whitespace-nowrap border-b-2 transition-all ${
                  activeTab === tab.id
                    ? "border-primary text-primary"
                    : "border-transparent text-on-surface-variant hover:text-primary hover:border-primary/30"
                }`}
                style={activeTab === tab.id ? { backgroundColor: `rgba(var(--c-primary), 0.06)` } : {}}>
                <span className="material-symbols-outlined text-base">{tab.icon}</span>
                <span className="hidden sm:block">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Tab content */}
        {activeTab === "concentrados" && (
          <ConcentradosTable
            items={inv.concentrados}
            gramosDisponibles={inv.gramosDisponibles}
            onAdd={inv.addConcentrado}
            onUpdate={inv.updateConcentrado}
            onDelete={inv.deleteConcentrado}
          />
        )}
        {activeTab === "formula11" && (
          <FormulaTable
            tipo="1.1"
            items={inv.concentrados}
            gramosDisponibles={inv.gramosDisponibles}
            onUpdateFormula={inv.updateFormula}
          />
        )}
        {activeTab === "preparada" && (
          <FormulaTable
            tipo="preparada"
            items={inv.concentrados}
            gramosDisponibles={inv.gramosDisponibles}
            onUpdateFormula={inv.updateFormula}
          />
        )}
        {activeTab === "ventas" && (
          <VentasTable
            items={inv.ventas}
            concentrados={inv.concentrados}
            gramosDisponibles={inv.gramosDisponibles}
            onAdd={inv.addVenta}
            onDelete={inv.deleteVenta}
          />
        )}
        {activeTab === "pedido" && (
          <BajoPedidoTable
            items={inv.bajoPedido}
            insumos={inv.insumos}
            onAddItem={inv.addBajoPedido}
            onDeleteItem={inv.deleteBajoPedido}
            onAddInsumo={inv.addInsumo}
            onDeleteInsumo={inv.deleteInsumo}
          />
        )}
        {activeTab === "originales" && (
          <OriginalesTable items={inventarioOriginales} />
        )}
      </div>
    </div>
  );
}
