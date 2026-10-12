"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import Stars from "@/components/ui/Stars";
import { api, Review } from "@/lib/api";

export default function ReviewsSection() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [sum, setSum] = useState<{ count: number; average: number | null }>({ count: 0, average: null });

  useEffect(() => {
    api<Review[]>("/reviews?limit=6", { auth: false }).then(setReviews).catch(() => {});
    api<typeof sum>("/reviews/summary", { auth: false }).then(setSum).catch(() => {});
  }, []);

  if (reviews.length === 0) return null; // sin reseñas reales no se muestra nada

  return (
    <section className="px-5 md:px-12 max-w-container-max mx-auto py-14">
      <div className="border border-outline-variant p-5 md:p-8">
        <div className="flex items-center justify-between border-b border-outline-variant pb-4 mb-5 gap-3 flex-wrap">
          <div>
            <p className="font-sans text-[10px] uppercase tracking-[0.2em] font-bold flex items-center gap-1.5"><span className="material-symbols-outlined text-[16px]">verified</span>Compradores verificados</p>
            <h2 className="font-serif text-headline-md">Reseñas de clientes</h2>
          </div>
          {sum.average !== null && (
            <div className="flex items-center gap-2 bg-surface-container-low border border-outline-variant px-3 py-2">
              <Stars value={sum.average} size={16} /><span className="font-sans text-[12px] font-bold">{sum.average.toFixed(1)}/5 · {sum.count}</span>
            </div>
          )}
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {reviews.map((r) => (
            <article key={r.id} className="bg-surface-container-low border border-outline-variant/60 p-4 flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-8 h-8 rounded-full bg-primary text-on-primary font-serif text-[13px] flex items-center justify-center">{r.author.slice(0, 1)}</span>
                  <div>
                    <p className="font-sans text-[11px] font-bold">{r.author} <span className="material-symbols-outlined text-[13px] align-middle">verified</span></p>
                    <p className="font-sans text-[10px] text-outline">Compró {r.perfume_name ?? "un perfume"}</p>
                  </div>
                </div>
                <Stars value={r.rating} size={14} />
              </div>
              <p className="font-sans text-[13px] leading-relaxed whitespace-pre-line">“{r.comment}”</p>
              {r.perfume_id && <Link href={`/colecciones/${r.perfume_id}`} className="font-sans text-[10px] uppercase tracking-[0.18em] font-bold underline underline-offset-4 mt-auto">Ver perfume</Link>}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
