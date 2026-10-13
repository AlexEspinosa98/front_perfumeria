"use client";

import { useCallback, useEffect, useState } from "react";
import ProductImage from "@/components/ui/ProductImage";
import { api, Category, cop, Perfume } from "@/lib/api";

const empty = { name: "", brand: "", description: "", presentation: "", price: 0, images: [] as string[], badge: "", is_active: true, is_featured: false, stock: 0, cost: 0, category_ids: [] as string[] };

export default function CatalogoAdmin() {
  const [items, setItems] = useState<Perfume[]>([]);
  const [cats, setCats] = useState<Category[]>([]);
  const [editing, setEditing] = useState<string | null>(null); // id | "new"
  const [form, setForm] = useState({ ...empty });
  const [newCat, setNewCat] = useState("");
  const [msg, setMsg] = useState("");
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    const [p, c] = await Promise.all([api<{ items: Perfume[] }>("/admin/perfumes?limit=200"), api<Category[]>("/categories", { auth: false })]);
    setItems(p.items); setCats(c);
  }, []);
  useEffect(() => { load().catch((e) => setMsg(e.message)); }, [load]);

  const edit = (p: Perfume | null) => {
    setMsg("");
    if (!p) { setForm({ ...empty }); setEditing("new"); return; }
    setForm({ name: p.name, brand: p.brand, description: p.description, presentation: p.presentation, price: Number(p.price),
      images: p.images?.length ? p.images : p.image_url ? [p.image_url] : [], badge: p.badge ?? "", is_active: p.is_active, is_featured: p.is_featured, stock: p.stock ?? 0, cost: Number(p.cost ?? 0),
      category_ids: p.categories?.map((c) => c.id) ?? [] });
    setEditing(p.id);
  };

  const upload = async (files: FileList | null) => {
    if (!files?.length) return;
    const room = 3 - form.images.length;
    if (room <= 0) { setMsg("Máximo 3 fotos por producto. Quita una para agregar otra."); return; }
    setBusy(true); setMsg("");
    try {
      for (const file of Array.from(files).slice(0, room)) {
        const fd = new FormData(); fd.append("file", file);
        const r = await api<{ url: string }>("/admin/uploads/perfume-image", { method: "POST", body: fd });
        setForm((f) => ({ ...f, images: [...f.images, r.url].slice(0, 3) }));
      }
      if (files.length > room) setMsg(`Solo cabían ${room} foto(s) más; el máximo es 3.`);
    } catch (e: any) { setMsg(e.message); }
    setBusy(false);
  };
  const removeImg = (i: number) => setForm((f) => ({ ...f, images: f.images.filter((_, k) => k !== i) }));
  const makeMain = (i: number) => setForm((f) => ({ ...f, images: [f.images[i], ...f.images.filter((_, k) => k !== i)] }));

  const save = async (e: React.FormEvent) => {
    e.preventDefault(); setBusy(true); setMsg("");
    const body = { ...form, price: Number(form.price), badge: form.badge || null };
    try {
      if (editing === "new") await api("/admin/perfumes", { method: "POST", json: body });
      else await api(`/admin/perfumes/${editing}`, { method: "PATCH", json: body });
      setEditing(null); await load();
    } catch (e: any) { setMsg(e.message); }
    setBusy(false);
  };

  const adjust = async (p: Perfume, delta: number) => {
    const stock = Math.max(0, (p.stock ?? 0) + delta);
    setItems((prev) => prev.map((x) => (x.id === p.id ? { ...x, stock, in_stock: stock > 0 } : x)));
    try { await api(`/admin/perfumes/${p.id}`, { method: "PATCH", json: { stock } }); } catch (e: any) { setMsg(e.message); load(); }
  };

  const remove = async (p: Perfume) => {
    if (!confirm(`¿Eliminar «${p.name}»? Los pedidos anteriores conservan su nombre y precio.`)) return;
    await api(`/admin/perfumes/${p.id}`, { method: "DELETE" }); load();
  };

  const toggleCat = (id: string) => setForm((f) => ({ ...f, category_ids: f.category_ids.includes(id) ? f.category_ids.filter((x) => x !== id) : [...f.category_ids, id] }));
  const addCat = async () => { if (!newCat.trim()) return; try { await api("/admin/categories", { method: "POST", json: { name: newCat.trim() } }); setNewCat(""); load(); } catch (e: any) { setMsg(e.message); } };
  const delCat = async (c: Category) => { if (confirm(`¿Eliminar la categoría «${c.name}»?`)) { await api(`/admin/categories/${c.id}`, { method: "DELETE" }); load(); } };

  return (
    <div className="space-y-8">
      {msg && <p className="text-error">{msg}</p>}

      <section className="panel">
        <h2 className="font-serif text-headline-sm mb-3">Categorías</h2>
        <div className="flex gap-2 flex-wrap mb-3">
          {cats.map((c) => (
            <span key={c.id} className="px-3 py-1 border border-outline-variant/30 text-sm flex items-center gap-2">
              {c.name}<button onClick={() => delCat(c)} className="text-on-surface-variant hover:text-error" aria-label={`Eliminar ${c.name}`}>×</button>
            </span>
          ))}
        </div>
        <div className="flex gap-3 max-w-md"><input className="field" placeholder="Nueva categoría" value={newCat} onChange={(e) => setNewCat(e.target.value)} /><button className="btn-ghost" onClick={addCat}>Agregar</button></div>
      </section>

      {editing ? (
        <form onSubmit={save} className="panel space-y-4 max-w-2xl">
          <h2 className="font-serif text-headline-sm">{editing === "new" ? "Nuevo perfume" : "Editar perfume"}</h2>
          <div><label className="field-label">Nombre</label><input className="field" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="field-label">Marca</label><input className="field" value={form.brand} onChange={(e) => setForm({ ...form, brand: e.target.value })} /></div>
            <div><label className="field-label">Precio de venta (COP)</label><input className="field" type="number" min={0} required value={form.price} onChange={(e) => setForm({ ...form, price: Number(e.target.value) })} /></div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="field-label">Costo / precio base (COP)</label><input className="field" type="number" min={0} required value={form.cost} onChange={(e) => setForm({ ...form, cost: Number(e.target.value) })} /><p className="text-[11px] text-outline mt-1">Lo que te cuesta cada uno. Solo lo ves tú; sirve para calcular tu utilidad.</p></div>
            <div><label className="field-label">Stock (unidades)</label><input className="field" type="number" min={0} required value={form.stock} onChange={(e) => setForm({ ...form, stock: Number(e.target.value) })} /><p className="text-[11px] text-outline mt-1">Con 0 aparece «Agotado» solo.</p></div>
          </div>
          <div><label className="field-label">Presentación</label><input className="field" placeholder="Extrait de Parfum · 100ml" value={form.presentation} onChange={(e) => setForm({ ...form, presentation: e.target.value })} /></div>
          <div><label className="field-label">Descripción</label><textarea className="field" rows={4} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></div>
          <div><label className="field-label">Etiqueta (opcional)</label><input className="field" placeholder="EXCLUSIVO, 2X1 PROMO…" value={form.badge} onChange={(e) => setForm({ ...form, badge: e.target.value })} /></div>
          <div>
            <label className="field-label">Fotos ({form.images.length}/3) — la primera es la principal</label>
            <div className="grid grid-cols-3 gap-2 max-w-md">
              {[0, 1, 2].map((i) => {
                const url = form.images[i];
                return (
                  <div key={i} className="aspect-[4/5] bg-surface-container-low ghost-border relative flex items-center justify-center">
                    {url ? (
                      <>
                        <ProductImage src={url} alt={`Foto ${i + 1}`} className="w-full h-full object-contain p-1" />
                        {i === 0 && <span className="absolute top-1 left-1 bg-primary text-on-primary text-[9px] font-bold px-1.5 py-0.5 uppercase">Principal</span>}
                        <div className="absolute bottom-0 inset-x-0 flex">
                          {i > 0 && <button type="button" onClick={() => makeMain(i)} className="flex-1 bg-surface/90 text-[10px] py-1.5 border-t border-r border-outline-variant">Principal</button>}
                          <button type="button" onClick={() => removeImg(i)} className="flex-1 bg-surface/90 text-[10px] py-1.5 border-t border-outline-variant text-error">Quitar</button>
                        </div>
                      </>
                    ) : <span className="material-symbols-outlined text-outline">add_photo_alternate</span>}
                  </div>
                );
              })}
            </div>
            <input type="file" multiple accept="image/jpeg,image/png,image/webp" disabled={busy || form.images.length >= 3}
              onChange={(e) => { upload(e.target.files); e.target.value = ""; }} className="text-sm mt-3 max-w-full" />
            <p className="text-[11px] text-outline mt-1">JPG, PNG o WEBP, hasta 5 MB cada una. {busy && "Subiendo…"}</p>
          </div>
          <div>
            <label className="field-label">Categorías</label>
            <div className="flex gap-3 flex-wrap">
              {cats.map((c) => (
                <label key={c.id} className="flex items-center gap-2 text-sm"><input type="checkbox" className="accent-[rgb(var(--c-primary))]" checked={form.category_ids.includes(c.id)} onChange={() => toggleCat(c.id)} />{c.name}</label>
              ))}
            </div>
          </div>
          <div className="flex gap-6 text-sm">
            {([["is_active", "Visible en el catálogo"], ["is_featured", "Destacado (carrusel del home)"]] as const).map(([k, label]) => (
              <label key={k} className="flex items-center gap-2"><input type="checkbox" className="accent-[rgb(var(--c-primary))]" checked={form[k]} onChange={(e) => setForm({ ...form, [k]: e.target.checked })} />{label}</label>
            ))}
          </div>
          <div className="flex gap-3"><button className="btn-gold" disabled={busy}>Guardar</button><button type="button" className="btn-ghost" onClick={() => setEditing(null)}>Cancelar</button></div>
        </form>
      ) : (
        <section>
          <div className="flex justify-between items-center mb-4"><h2 className="font-serif text-headline-sm">Perfumes ({items.length})</h2><button className="btn-gold" onClick={() => edit(null)}>Nuevo perfume</button></div>
          <div className="space-y-2">
            {items.map((p) => (
              <div key={p.id} className="panel flex items-center gap-3 flex-wrap">
                <div className="w-12 h-14 bg-surface-container-lowest flex-shrink-0"><ProductImage src={p.image_url} alt="" className="w-full h-full object-contain" /></div>
                <div className="flex-grow min-w-[140px] basis-[45%]">
                  <p className="font-serif">{p.name} <span className="text-xs text-on-surface-variant">{p.brand}</span></p>
                  <p className="text-xs text-on-surface-variant">{cop(p.price)} · costo {cop(p.cost ?? 0)}{Number(p.cost ?? 0) === 0 && " ⚠️"} · {p.categories?.map((c) => c.name).join(", ") || "sin categoría"}{!p.is_active && " · OCULTO"}</p>
                </div>
                <div className="flex items-center gap-1" title="Stock">
                  <button className="chip" aria-label="Quitar una unidad" onClick={() => adjust(p, -1)}>−</button>
                  <span className={`min-w-[44px] text-center text-sm font-bold ${(p.stock ?? 0) === 0 ? "text-error" : (p.stock ?? 0) <= 3 ? "text-primary underline" : ""}`}>{p.stock ?? 0} uds</span>
                  <button className="chip" aria-label="Agregar una unidad" onClick={() => adjust(p, 1)}>+</button>
                </div>
                <button className="btn-ghost" onClick={() => edit(p)}>Editar</button>
                <button className="btn-ghost !text-error" onClick={() => remove(p)}>Eliminar</button>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
