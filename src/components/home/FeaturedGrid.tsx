"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import ProductCard from "@/components/ui/ProductCard";
import { api, Perfume } from "@/lib/api";

export default function FeaturedGrid() {
  const [items, setItems] = useState<Perfume[] | null>(null);
  useEffect(() => {
    api<{ items: Perfume[] }>("/perfumes?limit=8", { auth: false }).then((r) => setItems(r.items)).catch(() => setItems([]));
  }, []);

  return (
    <section className="px-5 md:px-12 max-w-container-max mx-auto py-14">
      <div className="flex items-end justify-between border-b border-outline-variant pb-3 mb-6">
        <div>
          <p className="font-sans text-[10px] uppercase tracking-[0.2em] font-semibold text-outline flex items-center gap-1.5"><span className="material-symbols-outlined text-[14px]">local_fire_department</span>Selección</p>
          <h2 className="font-serif text-headline-md md:text-headline-lg-mobile md:text-headline-lg">Los más recientes</h2>
        </div>
        <Link href="/colecciones" className="font-sans text-[11px] uppercase tracking-[0.2em] font-bold underline underline-offset-4 hover:no-underline">Ver todos →</Link>
      </div>
      {items === null ? <p className="text-outline">Cargando…</p> : items.length === 0 ? (
        <p className="text-outline">Pronto publicaremos nuestro catálogo.</p>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-gutter">
          {items.map((p) => <ProductCard key={p.id} p={p} />)}
        </div>
      )}
    </section>
  );
}
