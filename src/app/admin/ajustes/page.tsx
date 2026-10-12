"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";

export default function AjustesAdmin() {
  const [wa, setWa] = useState("");
  const [name, setName] = useState("");
  const [banner, setBanner] = useState("");
  const [ig, setIg] = useState("");
  const [fb, setFb] = useState("");
  const [msg, setMsg] = useState("");
  useEffect(() => { api<{ whatsapp_number?: string; store_name?: string; announcement?: string; instagram_url?: string; facebook_url?: string }>("/store", { auth: false }).then((s) => { setWa(s.whatsapp_number ?? ""); setName(s.store_name ?? ""); setBanner(s.announcement ?? ""); setIg(s.instagram_url ?? ""); setFb(s.facebook_url ?? ""); }); }, []);

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api("/admin/settings/whatsapp_number", { method: "PUT", json: { value: wa.replace(/\D/g, "") } });
      await api("/admin/settings/store_name", { method: "PUT", json: { value: name } });
      await api("/admin/settings/announcement", { method: "PUT", json: { value: banner } });
      await api("/admin/settings/instagram_url", { method: "PUT", json: { value: ig.trim() } });
      await api("/admin/settings/facebook_url", { method: "PUT", json: { value: fb.trim() } });
      setMsg("Guardado ✓");
    } catch (e: any) { setMsg(e.message); }
  };

  return (
    <form onSubmit={save} className="panel max-w-md space-y-4">
      <div><label className="field-label">Nombre de la tienda</label><input className="field" value={name} onChange={(e) => setName(e.target.value)} /></div>
      <div><label className="field-label">WhatsApp de la tienda (con código de país)</label><input className="field" placeholder="573001234567" value={wa} onChange={(e) => setWa(e.target.value)} /></div>
      <div><label className="field-label">Texto de la barra superior (opcional)</label><input className="field" maxLength={120} placeholder="Envíos a todo Colombia • Pedidos y pagos por WhatsApp" value={banner} onChange={(e) => setBanner(e.target.value)} /></div>
      <div><label className="field-label">Instagram (enlace)</label><input className="field" type="url" placeholder="https://instagram.com/…" value={ig} onChange={(e) => setIg(e.target.value)} /></div>
      <div><label className="field-label">Facebook (enlace)</label><input className="field" type="url" placeholder="https://facebook.com/…" value={fb} onChange={(e) => setFb(e.target.value)} /></div>
      {msg && <p className="text-sm text-primary">{msg}</p>}
      <button className="btn-gold">Guardar</button>
    </form>
  );
}
