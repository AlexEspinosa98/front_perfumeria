"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import Footer from "@/components/nav/Footer";
import RequireAuth from "@/components/RequireAuth";
import StatusBadge from "@/components/ui/StatusBadge";
import { api, cop, Order } from "@/lib/api";

function Orders() {
  const [orders, setOrders] = useState<Order[] | null>(null);
  const [error, setError] = useState("");
  useEffect(() => { api<Order[]>("/me/orders").then(setOrders).catch((e) => setError(e.message)); }, []);

  return (
    <main className="pt-[190px] min-h-screen px-5 md:px-20 max-w-3xl mx-auto pb-24">
      <h1 className="font-serif text-headline-lg-mobile md:text-headline-lg mb-8">Mis pedidos</h1>
      {error && <p className="text-error">{error}</p>}
      {orders === null ? <p className="text-on-surface-variant">Cargando…</p> : orders.length === 0 ? (
        <p className="text-on-surface-variant">Aún no tienes pedidos. <Link href="/colecciones" className="text-primary">Ver catálogo</Link></p>
      ) : (
        <div className="space-y-4">
          {orders.map((o) => (
            <Link key={o.id} href={`/cuenta/pedidos/${o.id}`} className="panel flex justify-between items-center hover:border-primary/40 transition-colors">
              <div>
                <p className="font-serif text-headline-sm">Pedido #{o.order_number}</p>
                <p className="text-sm text-on-surface-variant">{new Date(o.created_at).toLocaleDateString("es-CO")} · {o.order_items.length} producto(s)</p>
              </div>
              <div className="text-right">
                <p className="text-primary">{cop(o.total)}</p>
                <StatusBadge status={o.status} className="mt-1" />
              </div>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}

export default function PedidosPage() {
  return <RequireAuth><Orders /><Footer /></RequireAuth>;
}
