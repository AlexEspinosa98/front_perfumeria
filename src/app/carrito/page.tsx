"use client";

import Footer from "@/components/nav/Footer";
import Link from "next/link";
import { useState } from "react";
import { useAuth } from "@/components/AuthProvider";
import { useCart } from "@/components/CartProvider";
import ProductImage from "@/components/ui/ProductImage";
import { api, cop, Order } from "@/lib/api";
import { useStore } from "@/lib/useStore";

export default function CarritoPage() {
  const { lines, setQty, subtotal, clear } = useCart();
  const { profile, loading } = useAuth();
  const store = useStore();
  const [notes, setNotes] = useState("");
  const [guestName, setGuestName] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [placed, setPlaced] = useState<{ order: Order; whatsapp_url: string | null; via: "reserve" | "whatsapp" } | null>(null);

  const checkout = async (via: "reserve" | "whatsapp") => {
    setBusy(true); setError("");
    try {
      const res = await api<{ order: Order; whatsapp_url: string | null }>("/me/orders", {
        method: "POST",
        json: { items: lines.map((l) => ({ perfume_id: l.id, quantity: l.qty })), notes, contact_via: via },
      });
      clear();
      setPlaced({ ...res, via });
      if (via === "whatsapp" && res.whatsapp_url) window.open(res.whatsapp_url, "_blank");
    } catch (e: any) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  };

  // Pedido sin registro: no crea cuenta ni pedido en el sistema; abre WhatsApp con el pedido ya escrito.
  const guestWhatsapp = () => {
    const rows = lines.map((l) => `• ${l.qty} x ${l.name} (${cop(l.price * l.qty)})`).join("\n");
    const text = `Hola, quiero hacer un pedido en Bahía Perfumes${guestName.trim() ? ` (soy ${guestName.trim()})` : ""}:\n${rows}\nTotal: ${cop(subtotal)}${notes.trim() ? `\nNotas: ${notes.trim()}` : ""}\n¿Me confirman disponibilidad, pago y envío?`;
    window.open(`https://wa.me/${store.whatsapp_number ?? ""}?text=${encodeURIComponent(text)}`, "_blank");
  };

  if (placed)
    return (
      <>
        <main className="pt-[190px] min-h-screen px-5 text-center max-w-xl mx-auto pb-24">
          <span className="material-symbols-outlined text-6xl text-primary">check_circle</span>
          <h1 className="font-serif text-headline-md my-4">Pedido #{placed.order.order_number} recibido</h1>
          <p className="text-on-surface-variant mb-8">{placed.via === "reserve" ? "Tu pedido quedó reservado. Te contactaremos pronto por WhatsApp o teléfono para coordinar el pago y el envío." : "Coordinaremos el pago y el envío por WhatsApp."} Puedes seguir el estado en «Mis pedidos».</p>
          <div className="flex flex-col gap-3 items-center">
            {placed.whatsapp_url && <a href={placed.whatsapp_url} target="_blank" rel="noreferrer" className={placed.via === "reserve" ? "btn-ghost" : "btn-gold"}>{placed.via === "reserve" ? "Escribirnos ahora por WhatsApp" : "Abrir WhatsApp para confirmar"}</a>}
            <Link href={`/cuenta/pedidos/${placed.order.id}`} className="btn-ghost">Ver seguimiento</Link>
          </div>
        </main>
        <Footer />
      </>
    );

  return (
    <>
      <main className="pt-[190px] min-h-screen px-5 md:px-20 max-w-container-max mx-auto pb-16 md:pb-section-gap">
        <header className="mb-stack-lg border-b border-outline-variant/20 pb-stack-md">
          <h2 className="font-serif text-headline-lg-mobile md:text-headline-lg text-primary">Tu Bolsa de Compra</h2>
        </header>

        {lines.length === 0 ? (
          <div className="text-center py-24">
            <span className="material-symbols-outlined text-6xl text-on-surface-variant/30 block mb-4">shopping_bag</span>
            <p className="font-serif text-headline-sm text-on-surface-variant mb-8">Tu bolsa está vacía</p>
            <Link href="/colecciones" className="btn-gold">Explorar catálogo</Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-margin-desktop">
            <div className="lg:col-span-8 space-y-6 md:space-y-stack-lg">
              {lines.map((l) => (
                <div key={l.id} className="flex items-center gap-4 md:gap-gutter border-b border-outline-variant/10 pb-6 md:pb-stack-lg">
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
              <div className="bg-surface-container-low p-5 md:p-stack-lg ghost-border lg:sticky lg:top-44 space-y-5">
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
                  <div className="space-y-3">
                    <p className="font-sans text-[11px] uppercase tracking-[0.18em] font-bold">¿Cómo quieres pedir?</p>
                    <div className="border border-outline-variant p-3 space-y-2">
                      <p className="text-sm font-bold">Con cuenta (recomendado)</p>
                      <p className="text-[12px] text-on-surface-variant">Reservas tu pedido, ves el seguimiento y la próxima vez no repites tus datos.</p>
                      <div className="grid grid-cols-2 gap-2">
                        <Link href="/registro?next=/carrito" className="btn-gold !px-3">Crear cuenta</Link>
                        <Link href="/login?next=/carrito" className="btn-ghost !px-3">Ingresar</Link>
                      </div>
                    </div>
                    <div className="border border-outline-variant p-3 space-y-2">
                      <p className="text-sm font-bold">Sin registro</p>
                      <p className="text-[12px] text-on-surface-variant">Te llevamos a WhatsApp con tu pedido ya escrito. Lo confirmamos por ahí.</p>
                      <input className="field" placeholder="Tu nombre (opcional)" maxLength={80} value={guestName} onChange={(e) => setGuestName(e.target.value)} />
                      <button onClick={guestWhatsapp} className="btn-ghost w-full"><span className="material-symbols-outlined text-lg">chat</span>Pedir por WhatsApp sin registro</button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <button onClick={() => checkout("reserve")} disabled={busy} className="btn-gold w-full">
                      <span className="material-symbols-outlined text-lg">event_available</span>{busy ? "Enviando…" : "Reservar y esperar contacto"}
                    </button>
                    <button onClick={() => checkout("whatsapp")} disabled={busy} className="btn-ghost w-full">
                      <span className="material-symbols-outlined text-lg">chat</span>Pedir por WhatsApp ahora
                    </button>
                    <p className="text-[11px] text-outline">Ambas opciones guardan tu pedido. Con «Reservar» te escribimos nosotros; con «WhatsApp» abres el chat ya con el mensaje listo.</p>
                  </div>
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
