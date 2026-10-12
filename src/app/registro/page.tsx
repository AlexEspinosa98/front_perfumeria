"use client";

import Link from "next/link";
import { useState } from "react";
import { useAuth } from "@/components/AuthProvider";

export default function RegistroPage() {
  const { register } = useAuth();
  const [f, setF] = useState({ full_name: "", phone: "", email: "", password: "" });
  const [dataConsent, setDataConsent] = useState(false);
  const [marketing, setMarketing] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);
  const [busy, setBusy] = useState(false);
  const set = (k: keyof typeof f) => (e: React.ChangeEvent<HTMLInputElement>) => setF({ ...f, [k]: e.target.value });

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!dataConsent) return setError("Debes autorizar el tratamiento de datos para crear tu cuenta.");
    setBusy(true); setError("");
    try {
      const { needsConfirmation } = await register({
        email: f.email, password: f.password, full_name: f.full_name.trim(), phone: f.phone,
        data_consent: true, marketing_consent: marketing,
      });
      if (needsConfirmation) setDone(true);
      else window.location.href = "/cuenta";
    } catch (err: any) {
      setError(err.message);
    }
    setBusy(false);
  };

  if (done)
    return (
      <main className="pt-40 min-h-screen px-5 text-center">
        <h1 className="font-serif text-headline-md mb-4">Revisa tu correo</h1>
        <p className="text-on-surface-variant">Te enviamos un enlace para confirmar tu cuenta.</p>
      </main>
    );

  return (
    <main className="pt-40 min-h-screen px-5 flex justify-center pb-24">
      <form onSubmit={submit} className="w-full max-w-md space-y-5">
        <h1 className="font-serif text-headline-md text-center">Crear cuenta</h1>
        <div><label className="field-label">Nombre completo</label><input className="field" required minLength={3} value={f.full_name} onChange={set("full_name")} /></div>
        <div><label className="field-label">Teléfono (WhatsApp)</label><input className="field" required type="tel" placeholder="3001234567" pattern="[0-9+ ]{10,15}" value={f.phone} onChange={set("phone")} /></div>
        <div><label className="field-label">Correo</label><input className="field" required type="email" value={f.email} onChange={set("email")} /></div>
        <div><label className="field-label">Contraseña (mín. 8 caracteres)</label><input className="field" required type="password" minLength={8} value={f.password} onChange={set("password")} /></div>

        <label className="flex gap-3 text-sm text-on-surface-variant items-start">
          <input type="checkbox" className="mt-1 accent-[rgb(var(--c-primary))]" checked={dataConsent} onChange={(e) => setDataConsent(e.target.checked)} />
          <span>Autorizo el tratamiento de mis datos personales conforme a la <Link href="/privacidad" target="_blank" className="text-primary underline">política de tratamiento de datos</Link> (Ley 1581 de 2012). <b>Obligatorio.</b></span>
        </label>
        <label className="flex gap-3 text-sm text-on-surface-variant items-start">
          <input type="checkbox" className="mt-1 accent-[rgb(var(--c-primary))]" checked={marketing} onChange={(e) => setMarketing(e.target.checked)} />
          <span>Quiero recibir promociones y novedades por correo y WhatsApp. (Opcional, puedes retirarlo cuando quieras.)</span>
        </label>

        {error && <p className="text-sm text-error">{error}</p>}
        <button className="btn-gold w-full" disabled={busy}>{busy ? "Creando…" : "Crear cuenta"}</button>
        <p className="text-center text-sm text-on-surface-variant">¿Ya tienes cuenta? <Link href="/login" className="text-primary">Ingresar</Link></p>
      </form>
    </main>
  );
}
