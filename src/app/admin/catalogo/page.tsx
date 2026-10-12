"use client";

import { useCallback, useEffect, useState } from "react";
import ProductImage from "@/components/ui/ProductImage";
import { api, Category, cop, Perfume } from "@/lib/api";

const empty = { name: "", brand: "", description: "", presentation: "", price: 0, image_url: "", badge: "", is_active: true, is_featured: false, in_stock: true, category_ids: [] as string[] };

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
      image_url: p.image_url ?? "", badge: p.badge ?? "", is_active: p.is_active, is_featured: p.is_featured, in_stock: p.in_stock,
      category_ids: p.categories?.map((c) => c.id) ?? [] });
    setEditing(p.id);
  };

  const upload = async (file: File) => {
    const fd = new FormData(); fd.append("file", file);
    setBusy(true);
    try { const r = await api<{ url: string }>("/admin/uploads/perfume-image", { method: "POST", body: fd }); setForm((f) => ({ ...f, image_url: r.url })); }
    catch (e: any) { setMsg(e.message); }
    setBusy(false);
  };

  const save = async (e: React.FormEvent) => {
    e.preventDefault(); setBusy(true); setMsg("");
    const body = { ...form, price: Number(form.price), image_url: form.image_url || null, badge: form.badge || null };
    try {
      if (editing === "new") await api("/admin/perfumes", { method: "POST", json: body });
      else await api(`/admin/perfumes/${editing}`, { method: "PATCH", json: body });
      setEditing(null); await load();
    } catch (e: any) { setMsg(e.message); }
    setBusy(false);
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
            <div><label className="field-label">Precio (COP)</label><input className="field" type="number" min={0} required value={form.price} onChange={(e) => setForm({ ...form, price: Number(e.target.value) })} /></div>
          </div>
          <div><label className="field-label">Presentación</label><input className="field" placeholder="Extrait de Parfum · 100ml" value={form.presentation} onChange={(e) => setForm({ ...form, presentation: e.target.value })} /></div>
          <div><label className="field-label">Descripción</label><textarea className="field" rows={4} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></div>
          <div><label className="field-label">Etiqueta (opcional)</label><input className="field" placeholder="EXCLUSIVO, 2X1 PROMO…" value={form.badge} onChange={(e) => setForm({ ...form, badge: e.target.value })} /></div>
          <div>
            <label className="field-label">Imagen</label>
            <div className="flex items-center gap-4">
              <div className="w-20 h-24 bg-surface-container-lowest ghost-border"><ProductImage src={form.image_url || null} alt="" className="w-full h-full object-contain" /></div>
              <input type="file" accept="image/jpeg,image/png,image/webp" onChange={(e) => e.target.files?.[0] && upload(e.target.files[0])} className="text-sm" />
            </div>
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
            {([["is_active", "Visible en el catálogo"], ["in_stock", "Disponible"], ["is_featured", "Destacado"]] as const).map(([k, label]) => (
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
              <div key={p.id} className="panel flex items-center gap-4">
                <div className="w-12 h-14 bg-surface-container-lowest flex-shrink-0"><ProductImage src={p.image_url} alt="" className="w-full h-full object-contain" /></div>
                <div className="flex-grow min-w-0">
                  <p className="font-serif truncate">{p.name} <span className="text-xs text-on-surface-variant">{p.brand}</span></p>
                  <p className="text-xs text-on-surface-variant">{cop(p.price)} · {p.categories?.map((c) => c.name).join(", ") || "sin categoría"}{!p.is_active && " · OCULTO"}{!p.in_stock && " · AGOTADO"}</p>
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
