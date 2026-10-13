"use client";

import { useCallback, useEffect, useState } from "react";
import ProductImage from "@/components/ui/ProductImage";
import { api, Category, cop, Perfume } from "@/lib/api";

const empty = { name: "", brand: "", description: "", presentation: "", price: 0, images: [] as string[], badge: "", is_active: true, is_featured: false, stock: 0, cost: 0, category_ids: [] as string[] };

/** Stock editable en la fila: escribe la cantidad (o usa − / +) y pulsa «Actualizar». No abre la ficha del perfume. */
function StockCell({ p, onSaved, onError }: { p: Perfume; onSaved: (id: string, stock: number) => void; onError: (m: string) => void }) {
  const current = p.stock ?? 0;
  const [val, setVal] = useState(String(current));
  const [busy, setBusy] = useState(false);
  useEffect(() => { setVal(String(current)); }, [current]);
  const n = Math.max(0, Math.floor(Number(val) || 0));
  const changed = val !== "" && n !== current;

  const save = async () => {
    setBusy(true);
    try {
      await api("/admin/stock/adjust", { method: "POST", json: { items: [{ perfume_id: p.id, set_to: n }] } });
      onSaved(p.id, n);
    } catch (e: any) { onError(e.message); setVal(String(current)); }
    setBusy(false);
  };

  return (
    <div className="flex items-center gap-1" title="Stock">
      <button className="chip" aria-label="Menos uno" onClick={() => setVal(String(Math.max(0, n - 1)))}>−</button>
      <input
        type="number" min={0} inputMode="numeric" aria-label={`Stock de ${p.name}`} value={val}
        onChange={(e) => setVal(e.target.value)} onKeyDown={(e) => e.key === "Enter" && changed && save()}
        className={`w-16 text-center border border-outline-variant bg-transparent py-1.5 text-sm font-bold ${current === 0 ? "text-error" : current <= 3 ? "underline" : ""}`}
      />
      <button className="chip" aria-label="Más uno" onClick={() => setVal(String(n + 1))}>+</button>
      {changed && <button className="btn-gold !py-1.5 !px-3" disabled={busy} onClick={save}>{busy ? "…" : "Actualizar"}</button>}
    </div>
  );
}

/** Reponer stock de varios perfumes a la vez: solo escribes cuántas unidades llegaron. */
function RestockPanel({ items, onDone, onClose }: { items: Perfume[]; onDone: () => void; onClose: () => void }) {
  const [q, setQ] = useState("");
  const [add, setAdd] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");
  const rows = items.filter((p) => !q || `${p.name} ${p.brand}`.toLowerCase().includes(q.toLowerCase()));
  const entries = Object.entries(add).map(([id, v]) => ({ id, n: Math.floor(Number(v) || 0) })).filter((x) => x.n > 0);

  const save = async () => {
    setBusy(true); setMsg("");
    try {
      await api("/admin/stock/adjust", { method: "POST", json: { items: entries.map((x) => ({ perfume_id: x.id, delta: x.n })) } });
      onDone();
    } catch (e: any) { setMsg(e.message); }
    setBusy(false);
  };

  return (
    <section className="panel space-y-4">
      <div className="flex justify-between items-start gap-3 flex-wrap">
        <div><h2 className="font-serif text-headline-sm">Reponer stock</h2><p className="text-xs text-on-surface-variant">Escribe cuántas unidades llegaron de cada perfume y guarda todo de una vez.</p></div>
        <button className="btn-ghost" onClick={onClose}>Cerrar</button>
      </div>
      <input className="field" placeholder="Buscar perfume…" value={q} onChange={(e) => setQ(e.target.value)} />
      <div className="divide-y divide-outline-variant/50">
        {rows.map((p) => {
          const n = Math.floor(Number(add[p.id]) || 0);
          return (
            <div key={p.id} className="flex items-center gap-3 py-2 flex-wrap">
              <div className="flex-grow min-w-[140px]"><p className="font-serif leading-tight">{p.name}</p><p className="text-xs text-on-surface-variant">Hay {p.stock ?? 0}{n > 0 && <b className="text-primary"> → {(p.stock ?? 0) + n}</b>}</p></div>
              <label className="flex items-center gap-2 text-xs uppercase tracking-widest text-on-surface-variant">+ llegaron
                <input type="number" min={0} inputMode="numeric" className="w-20 text-center border border-outline-variant bg-transparent py-1.5 text-sm font-bold text-on-surface" value={add[p.id] ?? ""} onChange={(e) => setAdd({ ...add, [p.id]: e.target.value })} />
              </label>
            </div>
          );
        })}
        {rows.length === 0 && <p className="py-3 text-sm text-on-surface-variant">No hay perfumes con ese nombre.</p>}
      </div>
      {msg && <p className="text-sm text-error">{msg}</p>}
      <div className="flex items-center gap-3 flex-wrap">
        <button className="btn-gold" disabled={busy || entries.length === 0} onClick={save}>{busy ? "Guardando…" : `Guardar reposición (${entries.length})`}</button>
        {entries.length > 0 && <button className="btn-ghost" onClick={() => setAdd({})}>Limpiar</button>}
      </div>
    </section>
  );
}

export default function CatalogoAdmin() {
  const [items, setItems] = useState<Perfume[]>([]);
  const [cats, setCats] = useState<Category[]>([]);
  const [editing, setEditing] = useState<string | null>(null); // id | "new"
  const [form, setForm] = useState({ ...empty });
  const [newCat, setNewCat] = useState("");
  const [restock, setRestock] = useState(false);
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
            {([["is_active", "Visible en el catálogo"]] as const).map(([k, label]) => (
              <label key={k} className="flex items-center gap-2"><input type="checkbox" className="accent-[rgb(var(--c-primary))]" checked={form[k]} onChange={(e) => setForm({ ...form, [k]: e.target.checked })} />{label}</label>
            ))}
          </div>
          <div className="flex gap-3"><button className="btn-gold" disabled={busy}>Guardar</button><button type="button" className="btn-ghost" onClick={() => setEditing(null)}>Cancelar</button></div>
        </form>
      ) : (
        <section>
          <div className="flex justify-between items-center mb-4"><h2 className="font-serif text-headline-sm">Perfumes ({items.length})</h2><div className="flex gap-2 flex-wrap"><button className="btn-ghost" onClick={() => setRestock(!restock)}>{restock ? "Ocultar reposición" : "Reponer stock"}</button><button className="btn-gold" onClick={() => edit(null)}>Nuevo perfume</button></div></div>
          {restock && <div className="mb-6"><RestockPanel items={items} onClose={() => setRestock(false)} onDone={() => { setRestock(false); load(); }} /></div>}
          <div className="space-y-2">
            {items.map((p) => (
              <div key={p.id} className="panel flex items-center gap-3 flex-wrap">
                <div className="w-12 h-14 bg-surface-container-lowest flex-shrink-0"><ProductImage src={p.image_url} alt="" className="w-full h-full object-contain" /></div>
                <div className="flex-grow min-w-[140px] basis-[45%]">
                  <p className="font-serif">{p.name} <span className="text-xs text-on-surface-variant">{p.brand}</span></p>
                  <p className="text-xs text-on-surface-variant">{cop(p.price)} · costo {cop(p.cost ?? 0)}{Number(p.cost ?? 0) === 0 && " ⚠️"} · {p.categories?.map((c) => c.name).join(", ") || "sin categoría"}{!p.is_active && " · OCULTO"}</p>
                </div>
                <StockCell p={p} onSaved={(id, stock) => setItems((prev) => prev.map((x) => (x.id === id ? { ...x, stock, in_stock: stock > 0 } : x)))} onError={setMsg} />
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
