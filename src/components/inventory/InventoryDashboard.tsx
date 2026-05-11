"use client";

import { useState } from "react";
import {
  inventarioFemenino,
  inventarioMasculino,
  inventarioOriginales,
  ventas,
  bajoPedido,
  insumos,
  formatCOP,
  getStockStatus,
} from "@/data/inventory";
import FragranceTable from "./FragranceTable";
import OriginalesTable from "./OriginalesTable";
import VentasTable from "./VentasTable";
import BajoPedidoTable from "./BajoPedidoTable";
import MetricCard from "./MetricCard";

type Tab = "femenino" | "masculino" | "originales" | "ventas" | "pedido";

const tabs: { id: Tab; label: string; icon: string }[] = [
  { id: "femenino", label: "Femenino", icon: "local_florist" },
  { id: "masculino", label: "Masculino", icon: "man" },
  { id: "originales", label: "Originales 1.1", icon: "stars" },
  { id: "ventas", label: "Ventas", icon: "trending_up" },
  { id: "pedido", label: "Bajo Pedido", icon: "shopping_cart" },
];

interface Props {
  onLogout: () => void;
}

export default function InventoryDashboard({ onLogout }: Props) {
  const [activeTab, setActiveTab] = useState<Tab>("femenino");

  const allFragrances = [...inventarioFemenino, ...inventarioMasculino];

  const totalGramos = allFragrances.reduce(
    (sum, f) => sum + f.gramosActuales,
    0
  );
  const totalFrascos = allFragrances.reduce((sum, f) => sum + f.frascos, 0);
  const totalGananciaProyectada = allFragrances.reduce(
    (sum, f) => sum + f.gananciaTotal,
    0
  );
  const itemsCriticos = allFragrances.filter(
    (f) => getStockStatus(f.frascos) === "critico" || getStockStatus(f.frascos) === "agotado"
  ).length;
  const ventasTotales = ventas.reduce((sum, v) => sum + v.valorVenta, 0);
  const carteraPendiente = ventas.reduce((sum, v) => sum + v.cartera, 0);

  const now = new Date();
  const dateStr = now.toLocaleDateString("es-CO", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-surface-container-lowest border-b border-outline-variant/20 px-margin-desktop py-stack-md sticky top-0 z-40">
        <div className="max-w-container-max mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-px h-8 bg-primary/40" />
            <div>
              <h1 className="font-serif text-headline-sm text-primary tracking-widest uppercase">
                Inventario
              </h1>
              <p className="font-sans text-[10px] uppercase tracking-widest text-on-surface-variant capitalize">
                {dateStr}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <span className="font-sans text-label-sm text-on-surface-variant uppercase tracking-widest hidden md:block">
              Fragance Perfumería
            </span>
            <button
              onClick={onLogout}
              className="flex items-center gap-2 text-on-surface-variant hover:text-error transition-colors font-sans text-label-sm uppercase tracking-widest"
            >
              <span className="material-symbols-outlined text-lg">logout</span>
              <span className="hidden md:block">Salir</span>
            </button>
          </div>
        </div>
      </div>

      <div className="px-margin-desktop py-8 max-w-container-max mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-8">
          <MetricCard
            label="Gramos en Stock"
            value={`${Math.max(0, totalGramos).toLocaleString("es-CO")}g`}
            icon="science"
            color="primary"
          />
          <MetricCard
            label="Frascos estimados"
            value={Math.max(0, totalFrascos).toFixed(1)}
            icon="local_bar"
            color="primary"
          />
          <MetricCard
            label="Ganancia proyectada"
            value={formatCOP(totalGananciaProyectada)}
            icon="payments"
            color="green"
          />
          <MetricCard
            label="Stock crítico"
            value={String(itemsCriticos)}
            icon="warning"
            color={itemsCriticos > 0 ? "red" : "green"}
            subtitle="fragancias bajo nivel"
          />
          <MetricCard
            label="Ventas Abr-May"
            value={formatCOP(ventasTotales)}
            icon="trending_up"
            color="green"
          />
          <MetricCard
            label="Cartera"
            value={formatCOP(carteraPendiente)}
            icon="account_balance"
            color={carteraPendiente > 0 ? "amber" : "green"}
            subtitle="pendiente de cobro"
          />
        </div>

        {itemsCriticos > 0 && (
          <div className="mb-6 p-4 border border-error/30 bg-error-container/10 flex items-center gap-3">
            <span className="material-symbols-outlined text-error">
              warning
            </span>
            <div>
              <p className="font-sans text-label-sm uppercase tracking-widest text-error">
                Alerta de stock
              </p>
              <p className="font-sans text-body-md text-on-surface-variant mt-0.5">
                {
                  allFragrances
                    .filter(
                      (f) =>
                        getStockStatus(f.frascos) === "critico" ||
                        getStockStatus(f.frascos) === "agotado"
                    )
                    .map((f) => f.nombre)
                    .join(", ")
                }
              </p>
            </div>
          </div>
        )}

        <div className="border-b border-outline-variant/20 mb-6">
          <div className="flex gap-0 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-3 font-sans text-label-sm uppercase tracking-widest whitespace-nowrap border-b-2 transition-all ${
                  activeTab === tab.id
                    ? "border-primary text-primary bg-primary/5"
                    : "border-transparent text-on-surface-variant hover:text-primary hover:border-primary/30"
                }`}
              >
                <span className="material-symbols-outlined text-lg">
                  {tab.icon}
                </span>
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {activeTab === "femenino" && (
          <FragranceTable
            items={inventarioFemenino}
            title="Inventario Femenino"
            subtitle="30ml · Concentrado 1.1 · Frascos de 14g"
          />
        )}
        {activeTab === "masculino" && (
          <FragranceTable
            items={inventarioMasculino}
            title="Inventario Masculino"
            subtitle="30ml · Concentrado 1.1 · Frascos de 14g"
          />
        )}
        {activeTab === "originales" && (
          <OriginalesTable items={inventarioOriginales} />
        )}
        {activeTab === "ventas" && <VentasTable items={ventas} />}
        {activeTab === "pedido" && (
          <BajoPedidoTable items={bajoPedido} insumos={insumos} />
        )}
      </div>
    </div>
  );
}
