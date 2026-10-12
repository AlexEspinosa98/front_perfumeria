"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import ProductImage from "@/components/ui/ProductImage";
import { api, cop, Perfume } from "@/lib/api";

const cta = "self-start inline-flex items-center gap-2 bg-on-primary text-primary border border-on-primary px-6 py-3 font-sans text-[11px] uppercase tracking-[0.2em] font-bold hover:bg-primary hover:text-on-primary transition-colors";

export default function HomeHero() {
  const [slides, setSlides] = useState<Perfume[]>([]);
  const [i, setI] = useState(0);

  useEffect(() => {
    api<{ items: Perfume[] }>("/perfumes?featured=true&limit=5", { auth: false }).then((r) => setSlides(r.items)).catch(() => {});
  }, []);
  useEffect(() => {
    if (slides.length < 2) return;
    const t = setInterval(() => setI((x) => (x + 1) % slides.length), 6000);
    return () => clearInterval(t);
  }, [slides.length]);

  const p = slides[i];

  return (
    <section className="px-5 md:px-12 max-w-container-max mx-auto pt-4">
      <div className="relative bg-primary text-on-primary grid md:grid-cols-2 min-h-[380px] md:min-h-[440px] overflow-hidden">
        <div className="relative z-10 flex flex-col justify-end md:justify-center gap-4 p-6 md:p-14 order-2 md:order-1">
          {p ? (
            <>
              {p.badge && <span className="self-start border border-on-primary/60 font-sans text-[10px] uppercase tracking-[0.2em] font-bold px-2 py-1">{p.badge}</span>}
              <h1 className="font-serif text-[34px] md:text-[52px] leading-[1.05]">{p.name}</h1>
              <p className="font-sans text-body-md opacity-80 line-clamp-3 max-w-md">{p.description || p.presentation}</p>
              <p className="font-sans text-lg font-bold">{cop(p.price)}</p>
              <Link href={`/colecciones/${p.id}`} className={cta}>Ver perfume <span className="material-symbols-outlined text-[16px]">arrow_forward</span></Link>
            </>
          ) : (
            <>
              <span className="self-start border border-on-primary/60 font-sans text-[10px] uppercase tracking-[0.2em] font-bold px-2 py-1">Perfumería árabe</span>
              <h1 className="font-serif text-[34px] md:text-[52px] leading-[1.05]">Fragancias que dejan huella</h1>
              <p className="font-sans text-body-md opacity-80 max-w-md">Attar, oud y perfumes de alta fijación. Elige en el catálogo y confirma tu pedido por WhatsApp.</p>
              <Link href="/colecciones" className={cta}>Explorar catálogo <span className="material-symbols-outlined text-[16px]">arrow_forward</span></Link>
            </>
          )}
        </div>
        <div className="relative order-1 md:order-2 bg-surface-container-low min-h-[220px]">
          {p && <ProductImage src={p.image_url} alt={p.name} className="absolute inset-0 w-full h-full object-contain p-6 md:p-10" />}
        </div>

        {slides.length > 1 && (
          <>
            <div className="absolute top-3 right-3 z-20 flex items-center gap-1">
              <button onClick={() => setI((i - 1 + slides.length) % slides.length)} aria-label="Anterior" className="w-8 h-8 bg-primary text-on-primary border border-on-primary/40 flex items-center justify-center"><span className="material-symbols-outlined text-[18px]">chevron_left</span></button>
              <button onClick={() => setI((i + 1) % slides.length)} aria-label="Siguiente" className="w-8 h-8 bg-primary text-on-primary border border-on-primary/40 flex items-center justify-center"><span className="material-symbols-outlined text-[18px]">chevron_right</span></button>
            </div>
            <div className="absolute bottom-3 left-6 md:left-14 z-20 flex gap-1.5">
              {slides.map((_, k) => <span key={k} className={`h-[3px] ${k === i ? "w-8 bg-on-primary" : "w-4 bg-on-primary/40"}`} />)}
            </div>
          </>
        )}
      </div>
    </section>
  );
}
