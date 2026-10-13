"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Footer from "@/components/nav/Footer";
import ProductCard from "@/components/ui/ProductCard";
import { api, Category, Perfume } from "@/lib/api";

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
      <main className="pt-[190px] min-h-screen px-5 md:px-20 max-w-container-max mx-auto pb-16 md:pb-section-gap">
        <header className="mb-10 border-b border-outline-variant/20 pb-stack-md">
          <p className="font-sans text-label-sm uppercase tracking-[0.3em] text-primary mb-stack-sm">Bahía Perfumes</p>
          <h1 className="font-serif text-headline-lg-mobile md:text-headline-lg text-on-surface">Nuestro Catálogo</h1>
        </header>

        <form id="buscar" onSubmit={(e) => { e.preventDefault(); go({ q: search }); }} className="flex gap-3 mb-6 max-w-xl">
          <input className="field" placeholder="Buscar por nombre o marca" value={search} onChange={(e) => setSearch(e.target.value)} />
          <button className="btn-ghost" type="submit"><span className="material-symbols-outlined text-lg">search</span></button>
        </form>

        <div className="flex gap-stack-sm mb-12 flex-wrap">
          {[{ id: "", name: "Todos", slug: "" }, ...cats].map((c) => (
            <button
              key={c.id || "all"}
              onClick={() => go({ category: c.slug })}
              className={`chip ${category === c.slug ? "chip-active" : ""}`}
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
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-gutter">
            {items.map((p) => <ProductCard key={p.id} p={p} />)}
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
