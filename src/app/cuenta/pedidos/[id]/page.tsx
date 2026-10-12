"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Footer from "@/components/nav/Footer";
import RequireAuth from "@/components/RequireAuth";
import { api, cop, Order, STATUS_LABELS } from "@/lib/api";

function Detail() {
  const { id } = useParams<{ id: string }>();
  const [o, setO] = useState<Order | null>(null);
  const [error, setError] = useState("");
  useEffect(() => { api<Order>(`/me/orders/${id}`).then(setO).catch((e) => setError(e.message)); }, [id]);

  if (error) return <main className="pt-[190px] min-h-screen px-5 md:px-20 text-error">{error}</main>;
  if (!o) return <main className="pt-[190px] min-h-screen px-5 md:px-20 text-on-surface-variant">Cargando…</main>;

  return (
    <main className="pt-[190px] min-h-screen px-5 md:px-20 max-w-3xl mx-auto pb-24 space-y-8">
      <Link href="/cuenta/pedidos" className="text-on-surface-variant hover:text-primary text-sm">← Mis pedidos</Link>
      <div>
        <h1 className="font-serif text-headline-lg">Pedido #{o.order_number}</h1>
        <p className="text-primary uppercase tracking-widest text-sm">{STATUS_LABELS[o.status]}</p>
        {o.tracking_code && <p className="text-on-surface-variant mt-1">Guía {o.carrier ? `(${o.carrier}) ` : ""}: <b>{o.tracking_code}</b></p>}
      </div>

      <section className="panel">
        <h2 className="font-serif text-headline-sm mb-4">Seguimiento</h2>
        <ol className="space-y-4 border-l border-primary/30 pl-5">
          {o.events?.map((e, i) => (
            <li key={i} className="relative">
              <span className="absolute -left-[26px] top-1.5 w-2.5 h-2.5 rounded-full bg-primary" />
              <p className="text-on-surface">{STATUS_LABELS[e.status]}</p>
              {e.note && <p className="text-sm text-on-surface-variant">{e.note}</p>}
              <p className="text-xs text-on-surface-variant/70">{new Date(e.created_at).toLocaleString("es-CO")}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="panel">
        <h2 className="font-serif text-headline-sm mb-4">Productos</h2>
        {o.order_items.map((it) => (
          <div key={it.id} className="flex justify-between py-2 border-b border-outline-variant/10 text-on-surface-variant">
            <span>{it.quantity} × {it.name}</span><span>{cop(it.unit_price * it.quantity)}</span>
          </div>
        ))}
        <div className="flex justify-between pt-4 text-primary font-serif text-headline-sm"><span>Total</span><span>{cop(o.total)}</span></div>
      </section>
    </main>
  );
}

export default function PedidoPage() {
  return <RequireAuth><Detail /><Footer /></RequireAuth>;
}
