"use client";

import { useCallback, useEffect, useState } from "react";
import { api, cop, Order, ORDER_STATUSES, STATUS_LABELS } from "@/lib/api";

type Tpl = { id: string; name: string };

function OrderRow({ o, waTpls, onChanged }: { o: Order; waTpls: Tpl[]; onChanged: () => void }) {
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState(o.status);
  const [note, setNote] = useState("");
  const [tracking, setTracking] = useState(o.tracking_code ?? "");
  const [carrier, setCarrier] = useState(o.carrier ?? "");
  const [notify, setNotify] = useState(true);
  const [tpl, setTpl] = useState(waTpls[0]?.id ?? "");
  const [msg, setMsg] = useState("");

  const save = async () => {
    try {
      const r = await api<{ email: { sent: boolean; error?: string } | null }>(`/admin/orders/${o.id}/status`, {
        method: "PATCH", json: { status, note, tracking_code: tracking || null, carrier: carrier || null, notify_email: notify },
      });
      setMsg(r.email ? (r.email.sent ? "Actualizado y correo enviado ✓" : `Actualizado (correo no enviado: ${r.email.error})`) : "Actualizado ✓");
      setNote(""); onChanged();
    } catch (e: any) { setMsg(e.message); }
  };
  const wa = async () => {
    try { const r = await api<{ url: string }>(`/admin/orders/${o.id}/whatsapp?template_id=${tpl || waTpls[0]?.id}`); window.open(r.url, "_blank"); }
    catch (e: any) { setMsg(e.message); }
  };

  return (
    <div className="panel">
      <button className="w-full flex justify-between items-center text-left gap-3" onClick={() => setOpen(!open)}>
        <div>
          <p className="font-serif text-headline-sm">#{o.order_number} · {o.profiles?.full_name || o.shipping_name}</p>
          <p className="text-xs text-on-surface-variant">{new Date(o.created_at).toLocaleString("es-CO")} · {o.shipping_phone}</p>
        </div>
        <div className="text-right"><p className="text-primary">{cop(o.total)}</p><p className="text-[11px] uppercase tracking-widest text-on-surface-variant">{STATUS_LABELS[o.status]}</p></div>
      </button>
      {open && (
        <div className="mt-5 pt-5 border-t border-outline-variant/20 grid md:grid-cols-2 gap-6">
          <div className="text-sm text-on-surface-variant space-y-1">
            {o.order_items.map((i) => <p key={i.id}>{i.quantity} × {i.name} — {cop(i.unit_price * i.quantity)}</p>)}
            <p className="pt-2">Envío: {o.shipping_address || "—"}, {o.shipping_city}</p>
            {o.notes && <p>Notas: {o.notes}</p>}
            <p>Correo: {o.profiles?.email}</p>
            <div className="pt-3 flex gap-2 items-center flex-wrap">
              <select className="field !w-auto" value={tpl} onChange={(e) => setTpl(e.target.value)}>{waTpls.map((t) => <option key={t.id} value={t.id} className="bg-surface">{t.name}</option>)}</select>
              <button className="btn-ghost" onClick={wa}><span className="material-symbols-outlined text-lg">chat</span>WhatsApp</button>
            </div>
          </div>
          <div className="space-y-3">
            <select className="field" value={status} onChange={(e) => setStatus(e.target.value)}>{ORDER_STATUSES.map((s) => <option key={s} value={s} className="bg-surface">{STATUS_LABELS[s]}</option>)}</select>
            <input className="field" placeholder="Nota para el cliente (opcional)" value={note} onChange={(e) => setNote(e.target.value)} />
            <div className="grid grid-cols-2 gap-3">
              <input className="field" placeholder="Transportadora" value={carrier} onChange={(e) => setCarrier(e.target.value)} />
              <input className="field" placeholder="N.º de guía" value={tracking} onChange={(e) => setTracking(e.target.value)} />
            </div>
            <label className="flex gap-2 text-sm items-center"><input type="checkbox" className="accent-[rgb(var(--c-primary))]" checked={notify} onChange={(e) => setNotify(e.target.checked)} />Avisar al cliente por correo</label>
            <button className="btn-gold" onClick={save}>Actualizar pedido</button>
            {msg && <p className="text-sm text-primary">{msg}</p>}
          </div>
        </div>
      )}
    </div>
  );
}

export default function PedidosAdmin() {
  const [orders, setOrders] = useState<Order[] | null>(null);
  const [filter, setFilter] = useState("");
  const [waTpls, setWaTpls] = useState<Tpl[]>([]);
  const [error, setError] = useState("");

  const load = useCallback(() => {
    api<{ items: Order[] }>(`/admin/orders?limit=100${filter ? `&status=${filter}` : ""}`).then((r) => setOrders(r.items)).catch((e) => setError(e.message));
  }, [filter]);
  useEffect(load, [load]);
  useEffect(() => { api<Tpl[]>("/admin/templates/whatsapp").then(setWaTpls).catch(() => {}); }, []);

  return (
    <div className="space-y-4">
      <div className="flex gap-2 flex-wrap">
        {["", ...ORDER_STATUSES].map((s) => (
          <button key={s} onClick={() => setFilter(s)} className={`px-3 py-1.5 border text-[11px] uppercase tracking-widest ${filter === s ? "border-primary text-primary bg-primary/10" : "border-outline-variant/30 text-on-surface-variant"}`}>{s ? STATUS_LABELS[s] : "Todos"}</button>
        ))}
      </div>
      {error && <p className="text-error">{error}</p>}
      {orders === null ? <p className="text-on-surface-variant">Cargando…</p> : orders.length === 0 ? <p className="text-on-surface-variant">No hay pedidos.</p> :
        orders.map((o) => <OrderRow key={o.id + o.status} o={o} waTpls={waTpls} onChanged={load} />)}
    </div>
  );
}
