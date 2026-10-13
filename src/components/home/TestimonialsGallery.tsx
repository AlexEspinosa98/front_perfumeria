/* eslint-disable @next/next/no-img-element */
"use client";

import { useEffect, useState } from "react";
import { api, Testimonial } from "@/lib/api";

export default function TestimonialsGallery() {
  const [items, setItems] = useState<Testimonial[]>([]);
  const [open, setOpen] = useState<Testimonial | null>(null);

  useEffect(() => { api<Testimonial[]>("/testimonials", { auth: false }).then(setItems).catch(() => {}); }, []);
  useEffect(() => {
    const h = (e: KeyboardEvent) => e.key === "Escape" && setOpen(null);
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, []);

  if (items.length === 0) return null;

  return (
    <section className="px-5 md:px-12 max-w-container-max mx-auto pb-14">
      <div className="border-b border-outline-variant pb-3 mb-6">
        <p className="font-sans text-[10px] uppercase tracking-[0.2em] font-semibold text-outline flex items-center gap-1.5"><span className="material-symbols-outlined text-[14px]">chat</span>Nos escriben por WhatsApp</p>
        <h2 className="font-serif text-headline-md md:text-headline-lg-mobile md:text-headline-lg">Lo que dicen nuestros clientes</h2>
      </div>
      <div className="columns-2 md:columns-3 lg:columns-4 gap-3 [&>*]:mb-3">
        {items.map((t) => (
          <button key={t.id} onClick={() => setOpen(t)} className="block w-full text-left break-inside-avoid border border-outline-variant hover:border-primary transition-colors bg-surface">
            <img src={t.image_url} alt={t.caption || `Testimonio de ${t.author || "un cliente"}`} loading="lazy" className="w-full h-auto block" />
            {(t.caption || t.author) && (
              <div className="p-3">
                {t.caption && <p className="font-sans text-[12px] leading-snug line-clamp-3">“{t.caption}”</p>}
                {t.author && <p className="font-sans text-[10px] uppercase tracking-[0.15em] font-bold mt-1">{t.author}</p>}
              </div>
            )}
          </button>
        ))}
      </div>

      {open && (
        <div className="fixed inset-0 z-[60] bg-primary/90 flex items-center justify-center p-4" onClick={() => setOpen(null)} role="dialog" aria-modal="true">
          <button className="absolute top-4 right-4 w-10 h-10 bg-surface text-primary flex items-center justify-center" aria-label="Cerrar"><span className="material-symbols-outlined">close</span></button>
          <div className="max-w-lg max-h-full overflow-auto bg-surface" onClick={(e) => e.stopPropagation()}>
            <img src={open.image_url} alt={open.caption || "Testimonio"} className="w-full h-auto block" />
            {(open.caption || open.author) && (
              <div className="p-4">
                {open.caption && <p className="font-sans text-body-md">“{open.caption}”</p>}
                {open.author && <p className="font-sans text-[11px] uppercase tracking-[0.15em] font-bold mt-2">{open.author}</p>}
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
