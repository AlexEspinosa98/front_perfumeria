"use client";

import { useCallback, useEffect, useState } from "react";
import { api } from "@/lib/api";

type Campaign = { id: string; name: string; status: string; created_at: string; email_templates?: { name: string } };
type Tpl = { id: string; name: string };

export default function CampanasAdmin() {
  const [list, setList] = useState<Campaign[]>([]);
  const [tpls, setTpls] = useState<Tpl[]>([]);
  const [name, setName] = useState("");
  const [tpl, setTpl] = useState("");
  const [msg, setMsg] = useState("");
  const [sending, setSending] = useState<string | null>(null);

  const load = useCallback(() => { api<Campaign[]>("/admin/campaigns").then(setList).catch((e) => setMsg(e.message)); }, []);
  useEffect(load, [load]);
  useEffect(() => { api<Tpl[]>("/admin/templates/email").then((t) => { setTpls(t); setTpl(t[0]?.id ?? ""); }); }, []);

  const create = async () => {
    try {
      const r = await api<{ recipients: number }>("/admin/campaigns", { method: "POST", json: { name, template_id: tpl } });
      setMsg(`Campaña creada con ${r.recipients} destinatario(s) que aceptaron promociones.`); setName(""); load();
    } catch (e: any) { setMsg(e.message); }
  };

  const send = async (id: string) => {
    if (!confirm("¿Enviar esta campaña a todos los destinatarios pendientes?")) return;
    setSending(id); setMsg("");
    try {
      let remaining = 1;
      while (remaining > 0) {
        const r = await api<{ processed: number; remaining: number }>(`/admin/campaigns/${id}/send?chunk=50`, { method: "POST" });
        remaining = r.remaining;
        setMsg(`Enviando… quedan ${r.remaining}`);
        if (r.processed === 0) break;
      }
      setMsg("Campaña enviada ✓");
    } catch (e: any) { setMsg(e.message); }
    setSending(null); load();
  };

  return (
    <div className="space-y-8 max-w-3xl">
      <section className="panel space-y-3">
        <h2 className="font-serif text-headline-sm">Nueva campaña de correo</h2>
        <input className="field" placeholder="Nombre interno (ej. Promo diciembre)" value={name} onChange={(e) => setName(e.target.value)} />
        <select className="field" value={tpl} onChange={(e) => setTpl(e.target.value)}>{tpls.map((t) => <option key={t.id} value={t.id} className="bg-surface">{t.name}</option>)}</select>
        <button className="btn-gold" disabled={!name || !tpl} onClick={create}>Crear campaña</button>
        <p className="text-xs text-on-surface-variant">Solo se incluyen clientes que aceptaron promociones y no se han dado de baja.</p>
      </section>
      {msg && <p className="text-sm text-primary">{msg}</p>}
      <section className="space-y-2">
        {list.map((c) => (
          <div key={c.id} className="panel flex justify-between items-center">
            <div><p className="font-serif">{c.name}</p><p className="text-xs text-on-surface-variant">{c.email_templates?.name} · {c.status} · {new Date(c.created_at).toLocaleDateString("es-CO")}</p></div>
            {c.status !== "sent" && <button className="btn-gold" disabled={sending === c.id} onClick={() => send(c.id)}>{sending === c.id ? "Enviando…" : "Enviar"}</button>}
          </div>
        ))}
      </section>
    </div>
  );
}
