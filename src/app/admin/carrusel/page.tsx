/* eslint-disable @next/next/no-img-element */
"use client";

import { useCallback, useEffect, useState } from "react";
import { api, Banner } from "@/lib/api";

const LINKS: [string, string][] = [
  ["", "Sin enlace"], ["/colecciones", "Catálogo completo"], ["/colecciones?category=promociones", "Promociones"],
  ["/colecciones?category=nuevos", "Nuevos"], ["/colecciones?category=hombres", "Hombres"], ["/colecciones?category=mujeres", "Mujeres"],
];
const empty = () => ({ image_url: "", mobile_image_url: "", title: "", subtitle: "", button_label: "", link_url: "", is_active: true });

export default function CarruselAdmin() {
  const [items, setItems] = useState<Banner[] | null>(null);
  const [form, setForm] = useState(empty());
  const [editing, setEditing] = useState<string | null>(null);
  const [msg, setMsg] = useState("");
  const [busy, setBusy] = useState(false);

  const load = useCallback(() => { api<Banner[]>("/admin/banners").then(setItems).catch((e) => setMsg(e.message)); }, []);
  useEffect(load, [load]);

  const upload = async (file: File, field: "image_url" | "mobile_image_url") => {
    const fd = new FormData(); fd.append("file", file); setBusy(true); setMsg("");
    try { const r = await api<{ url: string }>("/admin/uploads/perfume-image", { method: "POST", body: fd }); setForm((f) => ({ ...f, [field]: r.url })); }
    catch (e: any) { setMsg(e.message); }
    setBusy(false);
  };

  const save = async (e: React.FormEvent) => {
    e.preventDefault(); setBusy(true); setMsg("");
    const body = { ...form, mobile_image_url: form.mobile_image_url || null };
    try {
      if (editing) await api(`/admin/banners/${editing}`, { method: "PATCH", json: body });
      else await api("/admin/banners", { method: "POST", json: { ...body, sort_order: (items?.length ?? 0) } });
      setForm(empty()); setEditing(null); load();
    } catch (err: any) { setMsg(err.message); }
    setBusy(false);
  };
  const edit = (b: Banner) => { setEditing(b.id); setForm({ image_url: b.image_url, mobile_image_url: b.mobile_image_url ?? "", title: b.title, subtitle: b.subtitle, button_label: b.button_label, link_url: b.link_url, is_active: b.is_active ?? true }); window.scrollTo({ top: 0, behavior: "smooth" }); };
  const del = async (b: Banner) => { if (confirm("¿Eliminar esta imagen del carrusel?")) { await api(`/admin/banners/${b.id}`, { method: "DELETE" }); load(); } };
  const toggle = async (b: Banner) => { await api(`/admin/banners/${b.id}`, { method: "PATCH", json: { is_active: !b.is_active } }); load(); };
  const move = async (idx: number, d: number) => {
    if (!items) return;
    const arr = [...items]; const j = idx + d;
    if (j < 0 || j >= arr.length) return;
    [arr[idx], arr[j]] = [arr[j], arr[idx]];
    setItems(arr);
    await Promise.all(arr.map((b, k) => api(`/admin/banners/${b.id}`, { method: "PATCH", json: { sort_order: k } }))).catch((e) => setMsg(e.message));
    load();
  };
  const isCustomLink = !LINKS.some(([v]) => v === form.link_url);

  return (
    <div className="space-y-8 max-w-4xl">
      <p className="text-sm text-on-surface-variant">Estas imágenes forman el carrusel de la página principal. Son independientes de los perfumes. Si no hay ninguna activa, se muestra un panel con el nombre de la tienda.</p>
      {msg && <p className="text-error">{msg}</p>}

      <form onSubmit={save} className="panel space-y-4">
        <h2 className="font-serif text-headline-sm">{editing ? "Editar imagen" : "Agregar imagen al carrusel"}</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="field-label">Imagen principal (horizontal)</label>
            <div className="h-28 bg-surface-container-low ghost-border mb-2 flex items-center justify-center overflow-hidden">{form.image_url ? <img src={form.image_url} alt="" className="w-full h-full object-cover" /> : <span className="material-symbols-outlined text-outline">image</span>}</div>
            <input type="file" accept="image/jpeg,image/png,image/webp" onChange={(e) => e.target.files?.[0] && upload(e.target.files[0], "image_url")} className="text-sm max-w-full" />
            <p className="text-[11px] text-outline mt-1">Recomendado 1600 × 700 px.</p>
          </div>
          <div>
            <label className="field-label">Imagen para celular (opcional, vertical)</label>
            <div className="h-28 bg-surface-container-low ghost-border mb-2 flex items-center justify-center overflow-hidden">{form.mobile_image_url ? <img src={form.mobile_image_url} alt="" className="h-full object-cover" /> : <span className="material-symbols-outlined text-outline">smartphone</span>}</div>
            <input type="file" accept="image/jpeg,image/png,image/webp" onChange={(e) => e.target.files?.[0] && upload(e.target.files[0], "mobile_image_url")} className="text-sm max-w-full" />
            {form.mobile_image_url && <button type="button" className="text-xs text-error mt-1" onClick={() => setForm({ ...form, mobile_image_url: "" })}>Quitar imagen de celular</button>}
            <p className="text-[11px] text-outline mt-1">Recomendado 800 × 1000 px. Si no la subes, se usa la principal.</p>
          </div>
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <div><label className="field-label">Título (opcional)</label><input className="field" maxLength={120} value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} /></div>
          <div><label className="field-label">Texto del botón (opcional)</label><input className="field" maxLength={40} placeholder="Ver ofertas" value={form.button_label} onChange={(e) => setForm({ ...form, button_label: e.target.value })} /></div>
        </div>
        <div><label className="field-label">Subtítulo (opcional)</label><input className="field" maxLength={300} value={form.subtitle} onChange={(e) => setForm({ ...form, subtitle: e.target.value })} /></div>
        <div className="grid sm:grid-cols-2 gap-4">
          <div><label className="field-label">Al tocar la imagen, ir a</label>
            <select className="field" value={isCustomLink ? "__custom" : form.link_url} onChange={(e) => setForm({ ...form, link_url: e.target.value === "__custom" ? "https://" : e.target.value })}>
              {LINKS.map(([v, l]) => <option key={v} value={v} className="bg-surface">{l}</option>)}
              <option value="__custom" className="bg-surface">Otro enlace…</option>
            </select></div>
          {isCustomLink && <div><label className="field-label">Enlace</label><input className="field" placeholder="https://… o /colecciones?…" value={form.link_url} onChange={(e) => setForm({ ...form, link_url: e.target.value })} /></div>}
        </div>
        <label className="flex gap-2 text-sm items-center"><input type="checkbox" className="accent-[rgb(var(--c-primary))]" checked={form.is_active} onChange={(e) => setForm({ ...form, is_active: e.target.checked })} />Mostrar en el carrusel</label>
        <div className="flex gap-3"><button className="btn-gold" disabled={busy || !form.image_url}>{editing ? "Guardar cambios" : "Agregar"}</button>{editing && <button type="button" className="btn-ghost" onClick={() => { setEditing(null); setForm(empty()); }}>Cancelar</button>}</div>
      </form>

      <section className="space-y-2">
        <h2 className="font-serif text-headline-sm">Imágenes del carrusel ({items?.length ?? 0})</h2>
        {items === null ? <p className="text-on-surface-variant">Cargando…</p> : items.length === 0 ? <p className="text-on-surface-variant">Aún no hay imágenes.</p> : items.map((b, idx) => (
          <div key={b.id} className={`panel flex items-center gap-3 flex-wrap ${b.is_active ? "" : "opacity-60"}`}>
            <div className="w-28 h-16 bg-surface-container-low shrink-0 overflow-hidden"><img src={b.image_url} alt="" className="w-full h-full object-cover" /></div>
            <div className="flex-grow min-w-[140px]">
              <p className="font-serif">{b.title || "(sin título)"}</p>
              <p className="text-xs text-on-surface-variant">{b.is_active ? "Visible" : "Oculta"}{b.mobile_image_url ? " · con imagen de celular" : ""}{b.link_url ? ` · ${b.link_url}` : ""}</p>
            </div>
            <div className="flex gap-1 flex-wrap">
              <button className="chip" onClick={() => move(idx, -1)} disabled={idx === 0} aria-label="Subir">↑</button>
              <button className="chip" onClick={() => move(idx, 1)} disabled={idx === items.length - 1} aria-label="Bajar">↓</button>
              <button className="chip" onClick={() => toggle(b)}>{b.is_active ? "Ocultar" : "Mostrar"}</button>
              <button className="chip" onClick={() => edit(b)}>Editar</button>
              <button className="chip !text-error" onClick={() => del(b)}>Borrar</button>
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}
