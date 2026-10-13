"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Footer from "@/components/nav/Footer";
import Gallery from "@/components/ui/Gallery";
import { useCart } from "@/components/CartProvider";
import ProductReviews from "@/components/ProductReviews";
import { api, cop, Perfume } from "@/lib/api";

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { add } = useCart();
  const [p, setP] = useState<Perfume | null>(null);
  const [error, setError] = useState("");
  const [added, setAdded] = useState(false);

  useEffect(() => {
    api<Perfume>(`/perfumes/${id}`, { auth: false }).then(setP).catch((e) => setError(e.message));
  }, [id]);

  if (error) return <main className="pt-[190px] px-5 md:px-20 min-h-screen"><p className="text-error">{error}</p><Link href="/colecciones" className="text-primary">Volver al catálogo</Link></main>;
  if (!p) return <main className="pt-[190px] px-5 md:px-20 min-h-screen text-on-surface-variant">Cargando…</main>;

  const handleAdd = () => {
    add(p);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <>
      <main className="pt-[190px] min-h-screen px-5 md:px-20 max-w-container-max mx-auto pb-16 md:pb-section-gap">
        <Link href="/colecciones" className="flex items-center gap-stack-sm font-sans text-label-sm uppercase tracking-widest text-on-surface-variant hover:text-primary transition-colors mb-stack-lg w-fit">
          <span className="material-symbols-outlined text-lg">arrow_back</span> Catálogo
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-margin-desktop items-start">
          <Gallery images={p.images?.length ? p.images : p.image_url ? [p.image_url] : []} alt={p.name} />

          <div className="space-y-stack-lg lg:sticky lg:top-32">
            <div>
              <p className="font-sans text-label-sm uppercase tracking-[0.3em] text-primary mb-stack-sm">{p.brand || "Bahía Perfumes"}</p>
              <h1 className="font-serif text-headline-lg-mobile md:text-headline-lg text-on-surface mb-stack-sm">{p.name}</h1>
              {p.presentation && <p className="font-sans text-body-md text-on-surface-variant">{p.presentation}</p>}
              <div className="flex gap-2 flex-wrap mt-3">
                {p.categories?.map((c) => (
                  <Link key={c.id} href={`/colecciones?category=${c.slug}`} className="px-3 py-1 border border-outline-variant/30 text-[10px] uppercase tracking-wider text-on-surface-variant hover:text-primary">{c.name}</Link>
                ))}
              </div>
            </div>

            {p.description && (
              <div className="border-t border-outline-variant/20 pt-stack-lg">
                <p className="font-sans text-body-md text-on-surface-variant whitespace-pre-line">{p.description}</p>
              </div>
            )}

            <div className="border-t border-outline-variant/20 pt-stack-lg">
              <div className="flex items-baseline justify-between mb-stack-lg">
                <span className="font-sans text-label-sm uppercase tracking-widest text-on-surface-variant">Precio</span>
                <span className="font-serif text-headline-md text-primary">{cop(p.price)}</span>
              </div>
              <button
                onClick={handleAdd} disabled={!p.in_stock}
                className={`btn-gold w-full gold-shimmer ${added ? "!bg-surface border-primary !text-primary" : ""}`}
              >
                <span className="material-symbols-outlined text-xl">{added ? "check" : "shopping_bag"}</span>
                {!p.in_stock ? "Agotado" : added ? "Agregado" : "Agregar a la Bolsa"}
              </button>
            </div>
          </div>
        </div>
        <ProductReviews perfumeId={p.id} />
      </main>
      <Footer />
    </>
  );
}
