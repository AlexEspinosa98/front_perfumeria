"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import Footer from "@/components/nav/Footer";
import ProductCard from "@/components/ui/ProductCard";
import { useWishlist } from "@/components/WishlistProvider";
import { api, Perfume } from "@/lib/api";

export default function DeseosPage() {
  const { ids } = useWishlist();
  const [items, setItems] = useState<Perfume[] | null>(null);
  const key = ids.join(",");

  useEffect(() => {
    if (!key) { setItems([]); return; }
    api<{ items: Perfume[] }>(`/perfumes?ids=${key}&limit=100`, { auth: false }).then((r) => setItems(r.items)).catch(() => setItems([]));
  }, [key]);

  return (
    <>
      <main className="pt-[190px] min-h-screen px-5 md:px-12 max-w-container-max mx-auto pb-24">
        <h1 className="font-serif text-headline-lg-mobile md:text-headline-lg border-b border-outline-variant pb-3 mb-8">Mis deseos</h1>
        {items === null ? <p className="text-outline">Cargando…</p> : items.length === 0 ? (
          <div className="text-center py-20">
            <span className="material-symbols-outlined text-6xl text-outline/40 block mb-4">favorite</span>
            <p className="font-serif text-headline-sm text-on-surface-variant mb-6">Aún no tienes favoritos</p>
            <Link href="/colecciones" className="btn-gold">Explorar catálogo</Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-gutter">
            {items.filter((p) => ids.includes(p.id)).map((p) => <ProductCard key={p.id} p={p} />)}
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}
