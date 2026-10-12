"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import ProductImage from "@/components/ui/ProductImage";
import { api, cop, Perfume } from "@/lib/api";

export default function NewArrivals() {
  const [items, setItems] = useState<Perfume[]>([]);

  useEffect(() => {
    api<{ items: Perfume[] }>("/perfumes?limit=3", { auth: false })
      .then((r) => setItems(r.items))
      .catch(() => {});
  }, []);

  return (
    <section className="py-section-gap px-5 md:px-20 max-w-container-max mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
        <div className="max-w-2xl">
          <p className="font-sans text-label-sm uppercase tracking-[0.3em] text-primary mb-stack-sm">Catálogo</p>
          <h3 className="font-serif text-headline-lg mb-stack-md italic">Les Nouveautés</h3>
          <p className="font-sans text-body-lg text-on-surface-variant">
            Una selección de nuestras fragancias más recientes, elaboradas con concentrados importados.
          </p>
        </div>
        <Link href="/colecciones" className="font-sans text-label-sm uppercase tracking-widest text-primary border-b border-primary/30 pb-2 hover:border-primary transition-all whitespace-nowrap">
          Ver Todo
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
        {items.map((p, i) => (
          <Link key={p.id} href={`/colecciones/${p.id}`} className={`group cursor-pointer ${i === 1 ? "md:translate-y-12" : ""}`}>
            <div className="relative aspect-[3/4] bg-surface-container-lowest overflow-hidden ghost-border p-8 mb-stack-md">
              <ProductImage src={p.image_url} alt={p.name} className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-700" />
            </div>
            <h4 className="font-serif text-headline-sm group-hover:text-primary transition-colors">{p.name}</h4>
            <p className="font-sans text-body-md text-primary mt-1">{cop(p.price)}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}
