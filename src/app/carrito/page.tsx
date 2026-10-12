"use client";

import Footer from "@/components/nav/Footer";
import Link from "next/link";
import { useState } from "react";
import { useAuth } from "@/components/AuthProvider";
import { useCart } from "@/components/CartProvider";
import ProductImage from "@/components/ui/ProductImage";
import { api, cop, Order } from "@/lib/api";

export default function CarritoPage() {
  const { lines, setQty, subtotal, clear } = useCart();
  const { profile, loading } = useAuth();
  const [notes, setNotes] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [placed, setPlaced] = useState<{ order: Order; whatsapp_url: string | null } | null>(null);

  const checkout = async () => {
    setBusy(true); setError("");
    try {
      const res = await api<{ order: Order; whatsapp_url: string | null }>("/me/orders", {
        method: "POST",
        json: { items: lines.map((l) => ({ perfume_id: l.id, quantity: l.qty })), notes },
      });
      clear();
      setPlaced(res);
      if (res.whatsapp_url) window.open(res.whatsapp_url, "_blank");
    } catch (e: any) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  };

  if (placed)
    return (
      <>
        <main className="pt-40 min-h-screen px-5 text-center max-w-xl mx-auto pb-24">
          <span className="material-symbols-outlined text-6xl text-primary">check_circle</span>
          <h1 className="font-serif text-headline-md my-4">Pedido #{placed.order.order_number} recibido</h1>
          <p className="text-on-surface-variant mb-8">Coordinaremos el pago y el envío por WhatsApp. Puedes seguir el estado en «Mis pedidos».</p>
          <div className="flex flex-col gap-3 items-center">
            {placed.whatsapp_url && <a href={placed.whatsapp_url} target="_blank" rel="noreferrer" className="btn-gold">Abrir WhatsApp para confirmar</a>}
            <Link href={`/cuenta/pedidos/${placed.order.id}`} className="btn-ghost">Ver seguimiento</Link>
          </div>
        </main>
        <Footer />
      </>
    );

  return (
    <>
      <main className="pt-40 min-h-screen px-5 md:px-20 max-w-container-max mx-auto pb-section-gap">
        <header className="mb-stack-lg border-b border-outline-variant/20 pb-stack-md">
          <h2 className="font-serif text-headline-lg text-primary">Tu Bolsa de Compra</h2>
        </header>

        {lines.length === 0 ? (
          <div className="text-center py-24">
            <span className="material-symbols-outlined text-6xl text-on-surface-variant/30 block mb-4">shopping_bag</span>
            <p className="font-serif text-headline-sm text-on-surface-variant mb-8">Tu bolsa está vacía</p>
            <Link href="/colecciones" className="btn-gold">Explorar catálogo</Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-margin-desktop">
            <div className="lg:col-span-8 space-y-stack-lg">
              {lines.map((l) => (
                <div key={l.id} className="flex items-center gap-gutter border-b border-outline-variant/10 pb-stack-lg">
                  <div className="w-24 h-32 bg-surface-container-high ghost-border flex-shrink-0">
                    <ProductImage src={l.image_url} alt={l.name} className="w-full h-full object-contain p-2" />
                  </div>
                  <div className="flex-grow grid grid-cols-1 sm:grid-cols-3 items-center gap-3">
                    <div>
                      <h3 className="font-serif text-headline-sm text-on-surface">{l.name}</h3>
                      <p className="font-sans text-label-sm uppercase text-primary tracking-widest">{l.presentation}</p>
                    </div>
                    <div className="flex justify-center items-center gap-stack-md">
                      <button onClick={() => setQty(l.id, l.qty - 1)} className="text-on-surface-variant hover:text-primary" aria-label="Quitar uno"><span className="material-symbols-outlined">remove</span></button>
                      <span className="w-8 text-center">{String(l.qty).padStart(2, "0")}</span>
                      <button onClick={() => setQty(l.id, Math.min(50, l.qty + 1))} className="text-on-surface-variant hover:text-primary" aria-label="Agregar uno"><span className="material-symbols-outlined">add</span></button>
                    </div>
                    <div className="sm:text-right">{cop(l.price * l.qty)}</div>
                  </div>
                </div>
              ))}
              <Link href="/colecciones" className="flex items-center gap-stack-sm text-on-surface-variant hover:text-primary w-fit">
                <span className="material-symbols-outlined">arrow_back</span>
                <span className="font-sans text-label-sm uppercase tracking-widest">Continuar explorando</span>
              </Link>
            </div>

            <div className="lg:col-span-4">
              <div className="bg-surface-container-low p-stack-lg ghost-border sticky top-32 space-y-5">
                <h3 className="font-serif text-headline-sm uppercase tracking-widest pb-3 border-b border-outline-variant/20">Resumen</h3>
                <div className="flex justify-between text-on-surface-variant"><span>Subtotal</span><span>{cop(subtotal)}</span></div>
                <div className="flex justify-between text-on-surface-variant"><span>Envío</span><span className="text-primary italic">Se coordina por WhatsApp</span></div>
                <div className="flex justify-between items-baseline border-t border-outline-variant/20 pt-4">
                  <span className="font-sans text-label-sm uppercase tracking-widest">Total</span>
                  <span className="font-serif text-headline-md text-primary">{cop(subtotal)}</span>
                </div>
                <div><label className="field-label">Notas del pedido (opcional)</label><textarea className="field" rows={2} value={notes} onChange={(e) => setNotes(e.target.value)} /></div>
                {error && <p className="text-sm text-error">{error}</p>}
                {loading ? null : !profile ? (
                  <Link href="/login?next=/carrito" className="btn-gold w-full">Ingresa para hacer el pedido</Link>
                ) : (
                  <button onClick={checkout} disabled={busy} className="btn-gold w-full gold-shimmer">
                    <span className="material-symbols-outlined text-lg">chat</span>{busy ? "Enviando…" : "Hacer pedido y confirmar por WhatsApp"}
                  </button>
                )}
                {!profile?.phone && profile && <p className="text-xs text-on-surface-variant">Agrega tu teléfono y dirección en <Link href="/cuenta" className="text-primary">Mi cuenta</Link> para agilizar el envío.</p>}
              </div>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}
