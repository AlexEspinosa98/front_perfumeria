"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useAuth } from "@/components/AuthProvider";
import Stars from "@/components/ui/Stars";
import { api, Review } from "@/lib/api";

export default function ProductReviews({ perfumeId }: { perfumeId: string }) {
  const { profile } = useAuth();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [sum, setSum] = useState<{ count: number; average: number | null }>({ count: 0, average: null });
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    api<Review[]>(`/reviews?perfume_id=${perfumeId}`, { auth: false }).then(setReviews).catch(() => {});
    api<typeof sum>(`/reviews/summary?perfume_id=${perfumeId}`, { auth: false }).then(setSum).catch(() => {});
  }, [perfumeId]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault(); setBusy(true); setMsg(null);
    try {
      await api("/me/reviews", { method: "POST", json: { perfume_id: perfumeId, rating, comment } });
      setMsg({ ok: true, text: "¡Gracias! Tu reseña se publicará cuando la revisemos." });
      setComment("");
    } catch (err: any) { setMsg({ ok: false, text: err.message }); }
    setBusy(false);
  };

  return (
    <section className="mt-16 border-t border-outline-variant pt-8 max-w-3xl">
      <div className="flex items-end justify-between flex-wrap gap-3 mb-6">
        <h2 className="font-serif text-headline-md">Reseñas</h2>
        {sum.average !== null && <div className="flex items-center gap-2"><Stars value={sum.average} /><span className="font-sans text-[12px] font-bold">{sum.average.toFixed(1)}/5 · {sum.count} reseña{sum.count === 1 ? "" : "s"}</span></div>}
      </div>

      {reviews.length === 0 ? <p className="text-outline mb-8">Aún no hay reseñas de este perfume.</p> : (
        <div className="space-y-4 mb-8">
          {reviews.map((r) => (
            <article key={r.id} className="border border-outline-variant p-4">
              <div className="flex justify-between items-center mb-1">
                <p className="font-sans text-[12px] font-bold">{r.author} <span className="font-normal text-outline">· comprador verificado</span></p>
                <Stars value={r.rating} size={14} />
              </div>
              <p className="font-sans text-body-md whitespace-pre-line">{r.comment}</p>
            </article>
          ))}
        </div>
      )}

      {profile ? (
        <form onSubmit={submit} className="panel space-y-4">
          <h3 className="font-serif text-headline-sm">Deja tu reseña</h3>
          <div className="flex gap-1" role="radiogroup" aria-label="Calificación">
            {[1, 2, 3, 4, 5].map((n) => (
              <button type="button" key={n} onClick={() => setRating(n)} aria-label={`${n} estrellas`} aria-checked={rating === n} role="radio">
                <span className="material-symbols-outlined text-[28px]" style={{ fontVariationSettings: `"FILL" ${n <= rating ? 1 : 0}, "wght" 300` }}>star</span>
              </button>
            ))}
          </div>
          <textarea className="field" rows={3} required minLength={10} maxLength={1000} placeholder="Cuéntanos qué tal te pareció (mín. 10 caracteres)" value={comment} onChange={(e) => setComment(e.target.value)} />
          {msg && <p className={`text-sm ${msg.ok ? "text-primary" : "text-error"}`}>{msg.text}</p>}
          <button className="btn-gold" disabled={busy}>Enviar reseña</button>
          <p className="text-xs text-outline">Solo pueden reseñar quienes hayan pedido este perfume.</p>
        </form>
      ) : (
        <p className="text-on-surface-variant"><Link href={`/login?next=/colecciones/${perfumeId}`} className="underline">Ingresa</Link> para dejar tu reseña si ya compraste este perfume.</p>
      )}
    </section>
  );
}
