"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { api, CHANNEL_LABELS, cop, Perfume, Sale } from "@/lib/api";
import type { Range } from "./period";

type Line = { key: number; perfume_id: string; name: string; quantity: number; unit_price: number | ""; unit_cost: number | "" };
let k = 0;
const newLine = (): Line => ({ key: ++k, perfume_id: "", name: "", quantity: 1, unit_price: "", unit_cost: "" });
const localNow = () => { const d = new Date(); d.setMinutes(d.getMinutes() - d.getTimezoneOffset()); return d.toISOString().slice(0, 16); };

const toLocal = (iso: string) => { const d = new Date(iso); d.setMinutes(d.getMinutes() - d.getTimezoneOffset()); return d.toISOString().slice(0, 16); };

function SaleForm({ perfumes, initial, onSaved, onCancel }: { perfumes: Perfume[]; initial?: Sale; onSaved: () => void; onCancel: () => void }) {
  const [lines, setLines] = useState<Line[]>(() => initial
    ? initial.sale_items.map((i) => ({ key: ++k, perfume_id: i.perfume_id ?? "", name: i.name, quantity: i.quantity, unit_price: Number(i.unit_price), unit_cost: Number(i.unit_cost) }))
    : [newLine()]);
  const [when, setWhen] = useState(initial ? toLocal(initial.sold_at) : localNow());
  const [channel, setChannel] = useState<Sale["channel"]>(initial?.channel ?? "presencial");
  const [customer, setCustomer] = useState(initial?.customer_name ?? "");
  const [note, setNote] = useState(initial?.note ?? "");
  const [decrement, setDecrement] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const patch = (key: number, p: Partial<Line>) => setLines((ls) => ls.map((l) => (l.key === key ? { ...l, ...p } : l)));
  const pick = (key: number, id: string) => {
    const pf = perfumes.find((x) => x.id === id);
    patch(key, pf ? { perfume_id: id, name: pf.name, unit_price: Number(pf.price), unit_cost: Number(pf.cost ?? 0) } : { perfume_id: "", name: "", unit_price: "", unit_cost: "" });
  };

  const totals = useMemo(() => {
    const rev = lines.reduce((s, l) => s + l.quantity * Number(l.unit_price || 0), 0);
    const cost = lines.reduce((s, l) => s + l.quantity * Number(l.unit_cost || 0), 0);
    return { rev, cost, profit: rev - cost };
  }, [lines]);
  const hasCatalog = lines.some((l) => l.perfume_id);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault(); setBusy(true); setError("");
    const items = lines.map((l) => ({
      ...(l.perfume_id ? { perfume_id: l.perfume_id, ...(initial ? { name: l.name } : {}) } : { name: l.name }),
      quantity: l.quantity, unit_price: Number(l.unit_price || 0),
      ...(l.unit_cost !== "" ? { unit_cost: Number(l.unit_cost) } : {}),
    }));
    try {
      if (initial) {
        await api(`/admin/sales/${initial.id}`, { method: "PATCH", json: { sold_at: new Date(when).toISOString(), channel, customer_name: customer, note, items } });
      } else {
        await api("/admin/sales", { method: "POST", json: { sold_at: new Date(when).toISOString(), channel, customer_name: customer, note, decrement_stock: decrement && hasCatalog, items } });
      }
      onSaved();
    } catch (err: any) { setError(err.message); }
    setBusy(false);
  };

  return (
    <form onSubmit={submit} className="panel space-y-4">
      <h3 className="font-serif text-headline-sm">{initial ? "Editar venta" : "Registrar venta"}</h3>
      {initial && (
        <p className="text-[12px] border border-outline-variant bg-surface-container p-2">
          {initial.order_id ? "Esta venta viene de un pedido web: editarla no cambia el stock." : initial.stock_decremented ? "Esta venta descontó stock: al cambiar las cantidades o los productos, el stock se ajusta solo." : "Esta venta no descontó stock: editarla tampoco lo cambia."}
        </p>
      )}
      <div className="grid sm:grid-cols-3 gap-3">
        <div><label className="field-label">Fecha y hora</label><input type="datetime-local" required className="field" value={when} onChange={(e) => setWhen(e.target.value)} /></div>
        <div><label className="field-label">Canal</label>
          <select className="field" value={channel} onChange={(e) => setChannel(e.target.value as Sale["channel"])}>
            {Object.entries(CHANNEL_LABELS).filter(([c]) => c !== "web" || initial?.channel === "web").map(([c, l]) => <option key={c} value={c} className="bg-surface">{l}</option>)}
          </select></div>
        <div><label className="field-label">Cliente (opcional)</label><input className="field" value={customer} onChange={(e) => setCustomer(e.target.value)} maxLength={120} /></div>
      </div>

      <div className="space-y-3">
        <p className="field-label">Productos de esta venta</p>
        {lines.map((l) => (
          <div key={l.key} className="grid grid-cols-12 gap-2 items-end border-b border-outline-variant/40 pb-3">
            <div className="col-span-12 md:col-span-5">
              <select className="field" value={l.perfume_id} onChange={(e) => pick(l.key, e.target.value)}>
                <option value="" className="bg-surface">Otro producto (escribir)…</option>
                {l.perfume_id && !perfumes.some((p) => p.id === l.perfume_id) && <option value={l.perfume_id} className="bg-surface">{l.name}</option>}
                {perfumes.map((p) => <option key={p.id} value={p.id} className="bg-surface">{p.name} · stock {p.stock ?? 0}</option>)}
              </select>
              {!l.perfume_id && <input className="field mt-1" required placeholder="Nombre del producto" value={l.name} onChange={(e) => patch(l.key, { name: e.target.value })} maxLength={160} />}
            </div>
            <div className="col-span-3 md:col-span-1"><label className="field-label">Cant.</label><input type="number" min={1} max={1000} required className="field" value={l.quantity} onChange={(e) => patch(l.key, { quantity: Math.max(1, Number(e.target.value)) })} /></div>
            <div className="col-span-5 md:col-span-3"><label className="field-label">Vendido a (c/u)</label><input type="number" min={0} required className="field" value={l.unit_price} onChange={(e) => patch(l.key, { unit_price: e.target.value === "" ? "" : Number(e.target.value) })} /></div>
            <div className="col-span-4 md:col-span-2"><label className="field-label">Costo (c/u)</label><input type="number" min={0} className="field" value={l.unit_cost} onChange={(e) => patch(l.key, { unit_cost: e.target.value === "" ? "" : Number(e.target.value) })} /></div>
            <button type="button" className="col-span-12 md:col-span-1 text-error text-sm text-left md:text-center" onClick={() => setLines((ls) => (ls.length > 1 ? ls.filter((x) => x.key !== l.key) : ls))} aria-label="Quitar producto">Quitar</button>
          </div>
        ))}
        <button type="button" className="btn-ghost" onClick={() => setLines((ls) => [...ls, newLine()])}>+ Agregar otro producto</button>
      </div>

      <div className="grid sm:grid-cols-2 gap-3">
        <div><label className="field-label">Nota (opcional)</label><input className="field" value={note} onChange={(e) => setNote(e.target.value)} maxLength={500} /></div>
        {!initial && <label className="flex gap-2 items-center text-sm self-end pb-2"><input type="checkbox" className="accent-[rgb(var(--c-primary))]" checked={decrement && hasCatalog} disabled={!hasCatalog} onChange={(e) => setDecrement(e.target.checked)} />Descontar del stock los perfumes del catálogo</label>}
      </div>

      <p className="text-sm">Total <b>{cop(totals.rev)}</b> · Costo {cop(totals.cost)} · Utilidad <b>{cop(totals.profit)}</b></p>
      {error && <p className="text-sm text-error">{error}</p>}
      <div className="flex gap-3"><button className="btn-gold" disabled={busy}>{initial ? "Guardar cambios" : "Guardar venta"}</button><button type="button" className="btn-ghost" onClick={onCancel}>Cancelar</button></div>
    </form>
  );
}

export default function SalesView({ range, onChanged }: { range: Range; onChanged: () => void }) {
  const [sales, setSales] = useState<Sale[] | null>(null);
  const [perfumes, setPerfumes] = useState<Perfume[]>([]);
  const [adding, setAdding] = useState(false);
  const [editing, setEditing] = useState<Sale | null>(null);
  const [open, setOpen] = useState<string | null>(null);
  const [msg, setMsg] = useState("");

  const load = useCallback(() => {
    api<Sale[]>(`/admin/sales?from=${range.from}&to=${range.to}`).then(setSales).catch((e) => setMsg(e.message));
  }, [range.from, range.to]);
  useEffect(load, [load]);
  useEffect(() => { api<{ items: Perfume[] }>("/admin/perfumes?limit=200").then((r) => setPerfumes(r.items.filter((p) => p.is_active))).catch(() => {}); }, [adding, editing]);

  const del = async (s: Sale) => {
    const manualWithStock = !s.order_id;
    if (!confirm(`¿Eliminar esta venta de ${cop(s.revenue)}?${manualWithStock ? "\nSi descontó stock, se devolverá." : "\nEl pedido no cambia de estado."}`)) return;
    try { await api(`/admin/sales/${s.id}?restore_stock=true`, { method: "DELETE" }); load(); onChanged(); } catch (e: any) { setMsg(e.message); }
  };

  const total = (sales ?? []).reduce((a, s) => a + s.revenue, 0);
  const profit = (sales ?? []).reduce((a, s) => a + s.profit, 0);

  return (
    <div className="space-y-4">
      {msg && <p className="text-error">{msg}</p>}
      {editing ? <SaleForm key={editing.id} perfumes={perfumes} initial={editing} onCancel={() => setEditing(null)} onSaved={() => { setEditing(null); load(); onChanged(); }} /> : adding ? <SaleForm perfumes={perfumes} onCancel={() => setAdding(false)} onSaved={() => { setAdding(false); load(); onChanged(); }} /> : (
        <div className="flex justify-between items-center flex-wrap gap-2">
          <p className="text-sm text-on-surface-variant">{sales?.length ?? 0} venta(s) · {cop(total)} · utilidad {cop(profit)}</p>
          <button className="btn-gold" onClick={() => setAdding(true)}>Registrar venta</button>
        </div>
      )}
      {sales === null ? <p className="text-on-surface-variant">Cargando…</p> : sales.length === 0 ? <p className="text-on-surface-variant">No hay ventas en este periodo.</p> : sales.map((s) => (
        <div key={s.id} className="panel">
          <button className="w-full flex justify-between items-center gap-3 text-left" onClick={() => setOpen(open === s.id ? null : s.id)}>
            <div>
              <p className="font-serif">{s.customer_name || "Venta sin nombre"} <span className="text-xs text-on-surface-variant">· {CHANNEL_LABELS[s.channel]}{s.order_id ? " · desde pedido" : ""}</span></p>
              <p className="text-xs text-on-surface-variant">{new Date(s.sold_at).toLocaleString("es-CO")} · {s.sale_items.reduce((a, i) => a + i.quantity, 0)} unidad(es)</p>
            </div>
            <div className="text-right"><p>{cop(s.revenue)}</p><p className="text-[11px] text-on-surface-variant">Utilidad {cop(s.profit)}</p></div>
          </button>
          {open === s.id && (
            <div className="mt-3 pt-3 border-t border-outline-variant/50 text-sm space-y-1">
              {s.sale_items.map((i) => <p key={i.id} className="flex justify-between"><span>{i.quantity} × {i.name}</span><span className="text-on-surface-variant">{cop(i.unit_price)} c/u · costo {cop(i.unit_cost)}</span></p>)}
              {s.note && <p className="text-on-surface-variant">Nota: {s.note}</p>}
              <div className="flex gap-2 mt-2 flex-wrap"><button className="btn-ghost" onClick={() => { setEditing(s); window.scrollTo({ top: 0, behavior: "smooth" }); }}>Editar venta</button><button className="btn-ghost !text-error" onClick={() => del(s)}>Eliminar venta</button></div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
