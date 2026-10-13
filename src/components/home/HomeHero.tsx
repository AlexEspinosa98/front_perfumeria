/* eslint-disable @next/next/no-img-element */
"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { api, Banner } from "@/lib/api";

const cta = "inline-flex items-center gap-2 bg-on-primary text-primary border border-on-primary px-5 py-3 font-sans text-[11px] uppercase tracking-[0.18em] font-bold hover:bg-primary hover:text-on-primary transition-colors";

function Wrap({ href, children, className }: { href: string; children: React.ReactNode; className: string }) {
  if (!href) return <div className={className}>{children}</div>;
  if (href.startsWith("/")) return <Link href={href} className={className}>{children}</Link>;
  return <a href={href} target="_blank" rel="noopener noreferrer" className={className}>{children}</a>;
}

export default function HomeHero() {
  const [slides, setSlides] = useState<Banner[] | null>(null);
  const [i, setI] = useState(0);
  const touch = useRef<number | null>(null);

  useEffect(() => { api<Banner[]>("/banners", { auth: false }).then(setSlides).catch(() => setSlides([])); }, []);
  useEffect(() => {
    if (!slides || slides.length < 2) return;
    const t = setInterval(() => setI((x) => (x + 1) % slides.length), 6000);
    return () => clearInterval(t);
  }, [slides]);

  if (slides === null) return <section className="px-5 md:px-12 max-w-container-max mx-auto pt-4"><div className="h-[420px] md:h-[460px] bg-surface-container-low" /></section>;

  // Sin banners cargados por el admin: panel de marca por defecto.
  if (slides.length === 0) {
    return (
      <section className="px-5 md:px-12 max-w-container-max mx-auto pt-4">
        <div className="bg-primary text-on-primary p-6 md:p-14 min-h-[320px] flex flex-col justify-center gap-4">
          <span className="self-start border border-on-primary/60 font-sans text-[10px] uppercase tracking-[0.2em] font-bold px-2 py-1">Perfumería árabe</span>
          <h1 className="font-serif text-[34px] md:text-[52px] leading-[1.05]">Fragancias que dejan huella</h1>
          <p className="font-sans text-body-md opacity-80 max-w-md">Elige en el catálogo y envía tu pedido por WhatsApp, con o sin cuenta.</p>
          <Link href="/colecciones" className={`${cta} self-start`}>Explorar catálogo <span className="material-symbols-outlined text-[16px]">arrow_forward</span></Link>
        </div>
      </section>
    );
  }

  const n = slides.length;
  const go = (d: number) => setI((x) => (x + d + n) % n);
  const b = slides[i % n];
  const hasText = !!(b.title || b.subtitle || (b.button_label && b.link_url));

  return (
    <section className="px-5 md:px-12 max-w-container-max mx-auto pt-4">
      <div
        className="relative overflow-hidden bg-primary h-[440px] md:h-[460px] touch-pan-y"
        onTouchStart={(e) => { touch.current = e.touches[0].clientX; }}
        onTouchEnd={(e) => {
          if (touch.current === null || n < 2) return;
          const dx = e.changedTouches[0].clientX - touch.current;
          if (Math.abs(dx) > 40) go(dx < 0 ? 1 : -1);
          touch.current = null;
        }}
      >
        <Wrap href={b.link_url && !b.button_label ? b.link_url : ""} className="absolute inset-0 block">
          <picture>
            {b.mobile_image_url && <source media="(max-width: 767px)" srcSet={b.mobile_image_url} />}
            <img key={b.id} src={b.image_url} alt={b.title || "Promoción Bahía Perfumes"} className="absolute inset-0 w-full h-full object-cover" />
          </picture>
          {hasText && <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />}
        </Wrap>

        {hasText && (
          <div className="absolute inset-x-0 bottom-0 p-6 md:p-12 pb-10 text-white flex flex-col gap-3 max-w-2xl pointer-events-none">
            {b.title && <h2 className="font-serif text-[30px] md:text-[48px] leading-[1.05]">{b.title}</h2>}
            {b.subtitle && <p className="font-sans text-body-md opacity-90 line-clamp-3">{b.subtitle}</p>}
            {b.button_label && b.link_url && (
              <span className="pointer-events-auto self-start">
                <Wrap href={b.link_url} className={cta}>{b.button_label} <span className="material-symbols-outlined text-[16px]">arrow_forward</span></Wrap>
              </span>
            )}
          </div>
        )}

        {n > 1 && (
          <>
            <div className="absolute top-3 right-3 z-20 flex gap-1">
              <button onClick={() => go(-1)} aria-label="Anterior" className="w-8 h-8 bg-primary text-on-primary border border-on-primary/40 flex items-center justify-center"><span className="material-symbols-outlined text-[18px]">chevron_left</span></button>
              <button onClick={() => go(1)} aria-label="Siguiente" className="w-8 h-8 bg-primary text-on-primary border border-on-primary/40 flex items-center justify-center"><span className="material-symbols-outlined text-[18px]">chevron_right</span></button>
            </div>
            <div className="absolute bottom-3 left-6 md:left-12 z-20 flex gap-1.5">
              {slides.map((s, k) => <button key={s.id} onClick={() => setI(k)} aria-label={`Ir a la imagen ${k + 1}`} className={`h-[3px] ${k === i % n ? "w-8 bg-white" : "w-4 bg-white/50"}`} />)}
            </div>
          </>
        )}
      </div>
    </section>
  );
}
