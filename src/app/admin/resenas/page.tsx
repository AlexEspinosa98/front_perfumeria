/* eslint-disable @next/next/no-img-element */
"use client";

import { useCallback, useEffect, useState } from "react";
import Stars from "@/components/ui/Stars";
import { api, Testimonial } from "@/lib/api";

type AdminReview = {
  id: string; rating: number; comment: string; status: "pending" | "approved" | "rejected"; created_at: string;
  profiles?: { full_name: string; email: string }; perfumes?: { name: string };
};
const LABEL = { pending: "Pendiente", approved: "Publicada", rejected: "Rechazada" };

export default function ResenasAdmin() {
  const [filter, setFilter] = useState<"pending" | "approved" | "rejected">("pending");
  const [reviews, setReviews] = useState<AdminReview[] | null>(null);
  const [tests, setTests] = useState<Testimonial[]>([]);
  const [form, setForm] = useState({ image_url: "", author: "", caption: "" });
  const [msg, setMsg] = useState("");
  const [busy, setBusy] = useState(false);

  const loadReviews = useCallback(() => {
    api<AdminReview[]>(`/admin/reviews?status=${filter}`).then(setReviews).catch((e) => setMsg(e.message));
  }, [filter]);
  const loadTests = useCallback(() => { api<Testimonial[]>("/admin/testimonials").then(setTests).catch((e) => setMsg(e.message)); }, []);
  useEffect(loadReviews, [loadReviews]);
  useEffect(loadTests, [loadTests]);

  const moderate = async (id: string, status: string) => { await api(`/admin/reviews/${id}`, { method: "PATCH", json: { status } }).catch((e) => setMsg(e.message)); loadReviews(); };
  const delReview = async (id: string) => { if (confirm("¿Eliminar esta reseña?")) { await api(`/admin/reviews/${id}`, { method: "DELETE" }); loadReviews(); } };

  const upload = async (file: File) => {
    const fd = new FormData(); fd.append("file", file); setBusy(true); setMsg("");
    try { const r = await api<{ url: string }>("/admin/uploads/perfume-image", { method: "POST", body: fd }); setForm((f) => ({ ...f, image_url: r.url })); }
    catch (e: any) { setMsg(e.message); }
    setBusy(false);
  };
  const addTest = async (e: React.FormEvent) => {
    e.preventDefault(); setBusy(true); setMsg("");
    try { await api("/admin/testimonials", { method: "POST", json: form }); setForm({ image_url: "", author: "", caption: "" }); loadTests(); }
    catch (err: any) { setMsg(err.message); }
    setBusy(false);
  };
  const toggle = async (t: Testimonial) => { await api(`/admin/testimonials/${t.id}`, { method: "PATCH", json: { is_active: !t.is_active } }); loadTests(); };
  const delTest = async (t: Testimonial) => { if (confirm("¿Eliminar este testimonio?")) { await api(`/admin/testimonials/${t.id}`, { method: "DELETE" }); loadTests(); } };

  return (
    <div className="space-y-12">
      {msg && <p className="text-error">{msg}</p>}

      <section className="space-y-4">
        <h2 className="font-serif text-headline-sm">Reseñas de clientes</h2>
        <p className="text-xs text-on-surface-variant">Solo compradores pueden escribirlas. Aparecen en el sitio cuando las apruebas.</p>
        <div className="flex gap-2">
          {(["pending", "approved", "rejected"] as const).map((s) => <button key={s} onClick={() => setFilter(s)} className={`chip ${filter === s ? "chip-active" : ""}`}>{LABEL[s]}</button>)}
        </div>
        {reviews === null ? <p className="text-on-surface-variant">Cargando…</p> : reviews.length === 0 ? <p className="text-on-surface-variant">No hay reseñas {LABEL[filter].toLowerCase()}s.</p> : reviews.map((r) => (
          <div key={r.id} className="panel space-y-2">
            <div className="flex justify-between items-center gap-3 flex-wrap">
              <p className="font-serif">{r.perfumes?.name} <span className="text-xs text-on-surface-variant">· {r.profiles?.full_name} ({r.profiles?.email})</span></p>
              <Stars value={r.rating} />
            </div>
            <p className="text-sm whitespace-pre-line">{r.comment}</p>
            <div className="flex gap-2">
              {r.status !== "approved" && <button className="btn-gold !py-2" onClick={() => moderate(r.id, "approved")}>Aprobar</button>}
              {r.status !== "rejected" && <button className="btn-ghost" onClick={() => moderate(r.id, "rejected")}>Rechazar</button>}
              <button className="btn-ghost !text-error" onClick={() => delReview(r.id)}>Eliminar</button>
            </div>
          </div>
        ))}
      </section>

      <section className="space-y-4">
        <h2 className="font-serif text-headline-sm">Testimonios con foto (WhatsApp)</h2>
        <p className="text-xs text-on-surface-variant">Sube la captura o foto que te mandó el cliente. Antes de subirla, <b>tapa el número de teléfono</b> y pide el permiso del cliente para publicarla.</p>
        <form onSubmit={addTest} className="panel space-y-3 max-w-xl">
          <div className="flex items-center gap-4">
            <div className="w-20 h-24 bg-surface-container-low ghost-border flex items-center justify-center">{form.image_url ? <img src={form.image_url} alt="" className="w-full h-full object-cover" /> : <span className="material-symbols-outlined text-outline">image</span>}</div>
            <input type="file" accept="image/jpeg,image/png,image/webp" onChange={(e) => e.target.files?.[0] && upload(e.target.files[0])} className="text-sm" />
          </div>
          <input className="field" placeholder="Nombre del cliente (ej. Sofía R., Bogotá)" maxLength={80} value={form.author} onChange={(e) => setForm({ ...form, author: e.target.value })} />
          <textarea className="field" rows={2} maxLength={500} placeholder="Comentario (opcional)" value={form.caption} onChange={(e) => setForm({ ...form, caption: e.target.value })} />
          <button className="btn-gold" disabled={busy || !form.image_url}>Publicar testimonio</button>
        </form>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {tests.map((t) => (
            <div key={t.id} className={`ghost-border bg-surface ${t.is_active ? "" : "opacity-50"}`}>
              <img src={t.image_url} alt="" className="w-full aspect-[3/4] object-cover" />
              <div className="p-2 space-y-1">
                <p className="text-xs truncate">{t.author || "(sin nombre)"}</p>
                <div className="flex gap-1">
                  <button className="chip" onClick={() => toggle(t)}>{t.is_active ? "Ocultar" : "Mostrar"}</button>
                  <button className="chip !text-error" onClick={() => delTest(t)}>Borrar</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
