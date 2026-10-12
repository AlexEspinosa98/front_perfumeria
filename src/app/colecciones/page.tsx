"use client";

import Link from "next/link";
import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Footer from "@/components/nav/Footer";
import ProductImage from "@/components/ui/ProductImage";
import { api, Category, cop, Perfume } from "@/lib/api";

function Catalog() {
  const router = useRouter();
  const params = useSearchParams();
  const category = params.get("category") ?? "";
  const q = params.get("q") ?? "";
  const [search, setSearch] = useState(q);
  const [cats, setCats] = useState<Category[]>([]);
  const [items, setItems] = useState<Perfume[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => { api<Category[]>("/categories", { auth: false }).then(setCats).catch(() => {}); }, []);

  useEffect(() => {
    setLoading(true);
    const qs = new URLSearchParams();
    if (category) qs.set("category", category);
    if (q) qs.set("q", q);
    qs.set("limit", "100");
    api<{ items: Perfume[] }>(`/perfumes?${qs}`, { auth: false })
      .then((r) => { setItems(r.items); setError(""); })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [category, q]);

  const go = (next: { category?: string; q?: string }) => {
    const qs = new URLSearchParams();
    const c = next.category ?? category;
    const s = next.q ?? q;
    if (c) qs.set("category", c);
    if (s) qs.set("q", s);
    router.push(`/colecciones${qs.toString() ? `?${qs}` : ""}`);
  };

  return (
    <>
      <main className="pt-40 min-h-screen px-5 md:px-20 max-w-container-max mx-auto pb-section-gap">
        <header className="mb-10 border-b border-outline-variant/20 pb-stack-md">
          <p className="font-sans text-label-sm uppercase tracking-[0.3em] text-primary mb-stack-sm">Fragance Perfumería</p>
          <h1 className="font-serif text-headline-lg text-on-surface">Nuestro Catálogo</h1>
        </header>

        <form onSubmit={(e) => { e.preventDefault(); go({ q: search }); }} className="flex gap-3 mb-6 max-w-xl">
          <input className="field" placeholder="Buscar por nombre o marca" value={search} onChange={(e) => setSearch(e.target.value)} />
          <button className="btn-ghost" type="submit"><span className="material-symbols-outlined text-lg">search</span></button>
        </form>

        <div className="flex gap-stack-sm mb-12 flex-wrap">
          {[{ id: "", name: "Todos", slug: "" }, ...cats].map((c) => (
            <button
              key={c.id || "all"}
              onClick={() => go({ category: c.slug })}
              className={`font-sans text-label-sm uppercase tracking-widest px-6 py-2 border transition-all ${
                category === c.slug
                  ? "border-primary text-primary bg-primary/10"
                  : "border-outline-variant/40 text-on-surface-variant hover:border-primary hover:text-primary"
              }`}
            >
              {c.name}
            </button>
          ))}
        </div>

        {error && <p className="text-error mb-6">{error}</p>}
        {loading ? (
          <p className="text-on-surface-variant">Cargando catálogo…</p>
        ) : items.length === 0 ? (
          <p className="text-on-surface-variant">No encontramos perfumes con esos filtros.</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-gutter">
            {items.map((p) => (
              <Link key={p.id} href={`/colecciones/${p.id}`} className="group">
                <div className="relative aspect-[3/4] bg-surface-container-lowest overflow-hidden ghost-border mb-stack-sm">
                  {p.badge && (
                    <span className="absolute top-3 left-3 z-10 font-sans text-[10px] uppercase tracking-widest bg-primary text-on-primary px-2 py-1">{p.badge}</span>
                  )}
                  {!p.in_stock && (
                    <span className="absolute top-3 right-3 z-10 font-sans text-[10px] uppercase tracking-widest bg-surface-container text-on-surface-variant px-2 py-1">Agotado</span>
                  )}
                  <ProductImage
                    src={p.image_url} alt={p.name}
                    className={`w-full h-full object-contain p-6 group-hover:scale-105 transition-transform duration-700 ${!p.in_stock ? "opacity-50 grayscale" : ""}`}
                  />
                </div>
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="font-sans text-[10px] uppercase tracking-widest text-on-surface-variant mb-1">{p.brand}</p>
                    <h3 className="font-serif text-headline-sm group-hover:text-primary transition-colors">{p.name}</h3>
                  </div>
                  <span className="font-sans text-body-md text-primary font-semibold mt-1 whitespace-nowrap">{cop(p.price)}</span>
                </div>
                {p.presentation && <p className="font-sans text-[11px] text-on-surface-variant mt-1">{p.presentation}</p>}
              </Link>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}

export default function ColeccionesPage() {
  return <Suspense fallback={null}><Catalog /></Suspense>;
}
