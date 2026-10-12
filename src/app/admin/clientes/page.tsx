"use client";

import { useEffect, useState } from "react";
import { api, Profile } from "@/lib/api";

type Tpl = { id: string; name: string };

export default function ClientesAdmin() {
  const [rows, setRows] = useState<Profile[] | null>(null);
  const [q, setQ] = useState("");
  const [marketing, setMarketing] = useState(false);
  const [wa, setWa] = useState<Tpl[]>([]);
  const [em, setEm] = useState<Tpl[]>([]);
  const [waSel, setWaSel] = useState("");
  const [emSel, setEmSel] = useState("");
  const [msg, setMsg] = useState("");

  useEffect(() => {
    api<Tpl[]>("/admin/templates/whatsapp").then((t) => { setWa(t); setWaSel(t.find((x) => x.name === "Promoción")?.id ?? t[0]?.id ?? ""); });
    api<Tpl[]>("/admin/templates/email").then((t) => { setEm(t); setEmSel(t.find((x) => x.name === "Promoción")?.id ?? t[0]?.id ?? ""); });
  }, []);
  useEffect(() => {
    const t = setTimeout(() => {
      api<{ items: Profile[] }>(`/admin/customers?limit=200&marketing_only=${marketing}${q ? `&q=${encodeURIComponent(q)}` : ""}`)
        .then((r) => setRows(r.items)).catch((e) => setMsg(e.message));
    }, 250);
    return () => clearTimeout(t);
  }, [q, marketing]);

  const sendWa = async (id: string) => {
    try { const r = await api<{ url: string }>(`/admin/customers/${id}/whatsapp?template_id=${waSel}`); window.open(r.url, "_blank"); } catch (e: any) { setMsg(e.message); }
  };
  const sendEmail = async (id: string) => {
    try { const r = await api<{ sent: boolean; error?: string }>("/admin/emails/send", { method: "POST", json: { template_id: emSel, user_id: id } }); setMsg(r.sent ? "Correo enviado ✓" : `No se envió: ${r.error}`); } catch (e: any) { setMsg(e.message); }
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-4 flex-wrap items-end">
        <input className="field !w-72" placeholder="Buscar nombre, correo o teléfono" value={q} onChange={(e) => setQ(e.target.value)} />
        <label className="flex gap-2 text-sm items-center"><input type="checkbox" className="accent-[rgb(var(--c-primary))]" checked={marketing} onChange={(e) => setMarketing(e.target.checked)} />Solo con promociones aceptadas</label>
        <select className="field !w-auto" value={waSel} onChange={(e) => setWaSel(e.target.value)}>{wa.map((t) => <option key={t.id} value={t.id} className="bg-surface">WhatsApp: {t.name}</option>)}</select>
        <select className="field !w-auto" value={emSel} onChange={(e) => setEmSel(e.target.value)}>{em.map((t) => <option key={t.id} value={t.id} className="bg-surface">Correo: {t.name}</option>)}</select>
      </div>
      {msg && <p className="text-sm text-primary">{msg}</p>}
      {rows === null ? <p className="text-on-surface-variant">Cargando…</p> : (
        <div className="space-y-2">
          {rows.map((c) => (
            <div key={c.id} className="panel flex justify-between items-center gap-3 flex-wrap">
              <div>
                <p className="font-serif">{c.full_name || "(sin nombre)"}</p>
                <p className="text-xs text-on-surface-variant">{c.email} · {c.phone || "sin teléfono"} · {c.marketing_consent ? "acepta promociones" : "sin promociones"}</p>
              </div>
              <div className="flex gap-2">
                <button className="btn-ghost" onClick={() => sendWa(c.id)} disabled={!c.phone}><span className="material-symbols-outlined text-lg">chat</span>WhatsApp</button>
                <button className="btn-ghost" onClick={() => sendEmail(c.id)}><span className="material-symbols-outlined text-lg">mail</span>Correo</button>
              </div>
            </div>
          ))}
          {rows.length === 0 && <p className="text-on-surface-variant">Sin resultados.</p>}
        </div>
      )}
    </div>
  );
}
