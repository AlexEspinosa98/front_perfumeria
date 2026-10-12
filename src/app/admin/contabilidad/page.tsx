"use client";

import { useState } from "react";
import ExpensesView from "@/components/admin/accounting/Expenses";
import { PeriodPicker, usePeriod } from "@/components/admin/accounting/period";
import SalesView from "@/components/admin/accounting/Sales";
import SummaryView from "@/components/admin/accounting/Summary";

const TABS = [["resumen", "Resumen y balance"], ["ventas", "Ventas"], ["gastos", "Gastos"]] as const;

export default function ContabilidadPage() {
  const period = usePeriod();
  const [tab, setTab] = useState<(typeof TABS)[number][0]>("resumen");
  const [refresh, setRefresh] = useState(0);
  const bump = () => setRefresh((n) => n + 1);

  return (
    <div className="space-y-6">
      <div className="flex gap-2 flex-wrap">
        {TABS.map(([k, l]) => <button key={k} onClick={() => setTab(k)} className={`px-4 py-2 border font-sans text-label-sm uppercase tracking-widest ${tab === k ? "bg-primary text-on-primary border-primary" : "border-outline-variant text-on-surface-variant hover:text-primary"}`}>{l}</button>)}
      </div>
      <PeriodPicker p={period} />
      {tab === "resumen" && <SummaryView range={period.range} refreshKey={refresh} />}
      {tab === "ventas" && <SalesView range={period.range} onChanged={bump} />}
      {tab === "gastos" && <ExpensesView range={period.range} onChanged={bump} />}
    </div>
  );
}
