"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import Footer from "@/components/nav/Footer";
import RequireAuth from "@/components/RequireAuth";
import { useAuth } from "@/components/AuthProvider";
import { api } from "@/lib/api";

function Account() {
  const { profile, refresh } = useAuth();
  const [f, setF] = useState({ full_name: "", phone: "", address: "", city: "" });
  const [msg, setMsg] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (profile) setF({ full_name: profile.full_name, phone: profile.phone, address: profile.address, city: profile.city });
  }, [profile]);

  if (!profile) return null;
  const set = (k: keyof typeof f) => (e: React.ChangeEvent<HTMLInputElement>) => setF({ ...f, [k]: e.target.value });

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true); setMsg("");
    try { await api("/me", { method: "PATCH", json: f }); await refresh(); setMsg("Datos actualizados ✓"); }
    catch (err: any) { setMsg(err.message); }
    setBusy(false);
  };

  const consent = async (body: { marketing?: boolean; data_treatment?: boolean }) => {
    try { await api("/me/consents", { method: "POST", json: body }); await refresh(); } catch (err: any) { setMsg(err.message); }
  };

  return (
    <main className="pt-[190px] min-h-screen px-5 md:px-20 max-w-3xl mx-auto pb-24 space-y-10">
      <div className="flex justify-between items-end flex-wrap gap-3">
        <div>
          <h1 className="font-serif text-headline-lg-mobile md:text-headline-lg">Mi cuenta</h1>
          <p className="text-on-surface-variant">{profile.email}</p>
        </div>
        <div className="flex gap-2">{profile.role === "admin" && <Link href="/admin" className="btn-gold">Panel admin</Link>}<Link href="/cuenta/pedidos" className="btn-ghost">Mis pedidos</Link></div>
      </div>

      <form onSubmit={save} className="panel space-y-5">
        <h2 className="font-serif text-headline-sm">Mis datos</h2>
        <div><label className="field-label">Nombre completo</label><input className="field" required value={f.full_name} onChange={set("full_name")} /></div>
        <div><label className="field-label">Teléfono (WhatsApp)</label><input className="field" required value={f.phone} onChange={set("phone")} /></div>
        <div><label className="field-label">Dirección de entrega</label><input className="field" value={f.address} onChange={set("address")} /></div>
        <div><label className="field-label">Ciudad</label><input className="field" value={f.city} onChange={set("city")} /></div>
        {msg && <p className="text-sm text-primary">{msg}</p>}
        <button className="btn-gold" disabled={busy}>Guardar cambios</button>
      </form>

      <section className="panel space-y-4">
        <h2 className="font-serif text-headline-sm">Autorizaciones</h2>
        <label className="flex gap-3 items-start text-sm text-on-surface-variant">
          <input type="checkbox" className="mt-1 accent-[rgb(var(--c-primary))]" checked={!!profile.data_consent_at} onChange={(e) => consent({ data_treatment: e.target.checked })} />
          <span>Autorizo el tratamiento de mis datos personales (<Link href="/privacidad" className="text-primary underline">política</Link>). Si lo retiras no podrás hacer nuevos pedidos.</span>
        </label>
        <label className="flex gap-3 items-start text-sm text-on-surface-variant">
          <input type="checkbox" className="mt-1 accent-[rgb(var(--c-primary))]" checked={profile.marketing_consent} onChange={(e) => consent({ marketing: e.target.checked })} />
          <span>Quiero recibir promociones y novedades.</span>
        </label>
      </section>
    </main>
  );
}

export default function CuentaPage() {
  return <RequireAuth><Account /><Footer /></RequireAuth>;
}
