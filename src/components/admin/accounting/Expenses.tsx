"use client";

import { useCallback, useEffect, useState } from "react";
import { api, cop, Expense, EXPENSE_CATEGORIES, expenseLabel } from "@/lib/api";
import { todayIso, type Range } from "./period";

const empty = () => ({ spent_at: todayIso(), amount: "" as number | "", reason: "", category: "otros", note: "" });

export default function ExpensesView({ range, onChanged }: { range: Range; onChanged: () => void }) {
  const [rows, setRows] = useState<Expense[] | null>(null);
  const [form, setForm] = useState(empty());
  const [editing, setEditing] = useState<string | null>(null);
  const [msg, setMsg] = useState("");
  const [busy, setBusy] = useState(false);

  const load = useCallback(() => {
    api<Expense[]>(`/admin/expenses?from=${range.from}&to=${range.to}`).then(setRows).catch((e) => setMsg(e.message));
  }, [range.from, range.to]);
  useEffect(load, [load]);

  const save = async (e: React.FormEvent) => {
    e.preventDefault(); setBusy(true); setMsg("");
    const body = { ...form, amount: Number(form.amount) };
    try {
      if (editing) await api(`/admin/expenses/${editing}`, { method: "PATCH", json: body });
      else await api("/admin/expenses", { method: "POST", json: body });
      setForm(empty()); setEditing(null); load(); onChanged();
    } catch (err: any) { setMsg(err.message); }
    setBusy(false);
  };
  const edit = (x: Expense) => { setEditing(x.id); setForm({ spent_at: x.spent_at, amount: Number(x.amount), reason: x.reason, category: x.category, note: x.note }); window.scrollTo({ top: 0, behavior: "smooth" }); };
  const del = async (x: Expense) => { if (confirm(`¿Eliminar el gasto «${x.reason}» de ${cop(x.amount)}?`)) { await api(`/admin/expenses/${x.id}`, { method: "DELETE" }); load(); onChanged(); } };
  const total = (rows ?? []).reduce((a, x) => a + Number(x.amount), 0);
  const known = EXPENSE_CATEGORIES.some(([c]) => c === form.category);

  return (
    <div className="space-y-4">
      <form onSubmit={save} className="panel space-y-3">
        <h3 className="font-serif text-headline-sm">{editing ? "Editar gasto" : "Agregar gasto operativo"}</h3>
        <div className="grid sm:grid-cols-4 gap-3">
          <div><label className="field-label">Fecha</label><input type="date" required className="field" value={form.spent_at} onChange={(e) => setForm({ ...form, spent_at: e.target.value })} /></div>
          <div><label className="field-label">Monto (COP)</label><input type="number" required min={1} className="field" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value === "" ? "" : Number(e.target.value) })} /></div>
          <div className="sm:col-span-2"><label className="field-label">Razón / concepto</label><input required minLength={2} maxLength={200} className="field" placeholder="Ej. Publicidad en Instagram" value={form.reason} onChange={(e) => setForm({ ...form, reason: e.target.value })} /></div>
        </div>
        <div className="grid sm:grid-cols-2 gap-3">
          <div><label className="field-label">Categoría</label>
            <select className="field" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
              {!known && <option value={form.category} className="bg-surface">{form.category}</option>}
              {EXPENSE_CATEGORIES.map(([c, l]) => <option key={c} value={c} className="bg-surface">{l}</option>)}
            </select></div>
          <div><label className="field-label">Nota (opcional)</label><input className="field" maxLength={500} value={form.note} onChange={(e) => setForm({ ...form, note: e.target.value })} /></div>
        </div>
        {msg && <p className="text-sm text-error">{msg}</p>}
        <div className="flex gap-3"><button className="btn-gold" disabled={busy}>{editing ? "Guardar cambios" : "Agregar gasto"}</button>{editing && <button type="button" className="btn-ghost" onClick={() => { setEditing(null); setForm(empty()); }}>Cancelar</button>}</div>
      </form>

      <p className="text-sm text-on-surface-variant">{rows?.length ?? 0} gasto(s) en el periodo · total <b>{cop(total)}</b></p>
      {rows === null ? <p className="text-on-surface-variant">Cargando…</p> : rows.map((x) => (
        <div key={x.id} className="panel flex justify-between items-center gap-3 flex-wrap">
          <div><p className="font-serif">{x.reason}</p><p className="text-xs text-on-surface-variant">{x.spent_at} · {expenseLabel(x.category)}{x.note ? ` · ${x.note}` : ""}</p></div>
          <div className="flex items-center gap-2"><span>{cop(x.amount)}</span><button className="btn-ghost !py-1.5" onClick={() => edit(x)}>Editar</button><button className="btn-ghost !py-1.5 !text-error" onClick={() => del(x)}>Eliminar</button></div>
        </div>
      ))}
    </div>
  );
}
