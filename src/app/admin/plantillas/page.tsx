"use client";

import { useCallback, useEffect, useState } from "react";
import { api } from "@/lib/api";

type Email = { id: string; name: string; subject: string; html: string };
type Wa = { id: string; name: string; body: string };

export default function PlantillasAdmin() {
  const [emails, setEmails] = useState<Email[]>([]);
  const [was, setWas] = useState<Wa[]>([]);
  const [msg, setMsg] = useState("");
  const load = useCallback(() => {
    api<Email[]>("/admin/templates/email").then(setEmails).catch((e) => setMsg(e.message));
    api<Wa[]>("/admin/templates/whatsapp").then(setWas).catch(() => {});
  }, []);
  useEffect(load, [load]);

  const saveEmail = async (t: Partial<Email>) => {
    try {
      if (t.id) await api(`/admin/templates/email/${t.id}`, { method: "PUT", json: t });
      else await api("/admin/templates/email", { method: "POST", json: t });
      setMsg("Guardado ✓"); load();
    } catch (e: any) { setMsg(e.message); }
  };
  const saveWa = async (t: Partial<Wa>) => {
    try {
      if (t.id) await api(`/admin/templates/whatsapp/${t.id}`, { method: "PUT", json: t });
      else await api("/admin/templates/whatsapp", { method: "POST", json: t });
      setMsg("Guardado ✓"); load();
    } catch (e: any) { setMsg(e.message); }
  };
  const del = async (kind: "email" | "whatsapp", id: string) => { if (confirm("¿Eliminar plantilla?")) { await api(`/admin/templates/${kind}/${id}`, { method: "DELETE" }).catch((e) => setMsg(e.message)); load(); } };

  return (
    <div className="space-y-10">
      {msg && <p className="text-sm text-primary">{msg}</p>}
      <section className="space-y-4">
        <h2 className="font-serif text-headline-sm">Plantillas de WhatsApp</h2>
        <p className="text-xs text-on-surface-variant">Variables: {"{{name}} {{store}} {{order_number}} {{status}} {{tracking}} {{total}}"}. Al usarlas se abre tu WhatsApp con el texto listo.</p>
        {[...was, { id: "", name: "", body: "" } as Wa].map((t) => <WaEditor key={t.id || "new"} t={t} onSave={saveWa} onDelete={t.id ? () => del("whatsapp", t.id) : undefined} />)}
      </section>
      <section className="space-y-4">
        <h2 className="font-serif text-headline-sm">Plantillas de correo</h2>
        <p className="text-xs text-on-surface-variant">Variables: {"{{name}} {{shop_url}} {{unsubscribe_url}} {{order_number}} {{status}} {{note}}"}. «Estado de pedido» se usa al cambiar el estado de un pedido. Incluye siempre {"{{unsubscribe_url}}"} en promociones.</p>
        {[...emails, { id: "", name: "", subject: "", html: "" } as Email].map((t) => <EmailEditor key={t.id || "new"} t={t} onSave={saveEmail} onDelete={t.id ? () => del("email", t.id) : undefined} />)}
      </section>
    </div>
  );
}

function WaEditor({ t, onSave, onDelete }: { t: Wa; onSave: (t: Partial<Wa>) => void; onDelete?: () => void }) {
  const [v, setV] = useState(t);
  return (
    <div className="panel space-y-3">
      <input className="field" placeholder={t.id ? "Nombre" : "Nueva plantilla — nombre"} value={v.name} onChange={(e) => setV({ ...v, name: e.target.value })} />
      <textarea className="field" rows={3} placeholder="Mensaje" value={v.body} onChange={(e) => setV({ ...v, body: e.target.value })} />
      <div className="flex gap-2"><button className="btn-ghost" disabled={!v.name || !v.body} onClick={() => { onSave(v); if (!t.id) setV(t); }}>{t.id ? "Guardar" : "Crear"}</button>{onDelete && <button className="btn-ghost !text-error" onClick={onDelete}>Eliminar</button>}</div>
    </div>
  );
}

function EmailEditor({ t, onSave, onDelete }: { t: Email; onSave: (t: Partial<Email>) => void; onDelete?: () => void }) {
  const [v, setV] = useState(t);
  return (
    <div className="panel space-y-3">
      <div className="grid md:grid-cols-2 gap-3">
        <input className="field" placeholder={t.id ? "Nombre" : "Nueva plantilla — nombre"} value={v.name} onChange={(e) => setV({ ...v, name: e.target.value })} />
        <input className="field" placeholder="Asunto" value={v.subject} onChange={(e) => setV({ ...v, subject: e.target.value })} />
      </div>
      <textarea className="field font-mono text-xs" rows={6} placeholder="HTML del correo" value={v.html} onChange={(e) => setV({ ...v, html: e.target.value })} />
      <div className="flex gap-2"><button className="btn-ghost" disabled={!v.name || !v.subject || !v.html} onClick={() => { onSave(v); if (!t.id) setV(t); }}>{t.id ? "Guardar" : "Crear"}</button>{onDelete && <button className="btn-ghost !text-error" onClick={onDelete}>Eliminar</button>}</div>
    </div>
  );
}
