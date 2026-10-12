"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";

/** Destino del enlace "olvidé mi contraseña": el token llega en el hash de la URL. */
export default function RestablecerPage() {
  const [token, setToken] = useState<string | null>(null);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  useEffect(() => {
    setToken(new URLSearchParams(window.location.hash.slice(1)).get("access_token"));
    history.replaceState(null, "", window.location.pathname); // saca el token de la barra de direcciones
  }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault(); setError("");
    try { await api("/auth/reset-password", { method: "POST", json: { access_token: token, password }, auth: false }); setDone(true); }
    catch (err: any) { setError(err.message); }
  };

  if (done) return <main className="pt-[190px] min-h-screen px-5 text-center"><p className="mb-4">Contraseña actualizada.</p><Link href="/login" className="btn-gold">Ingresar</Link></main>;
  if (token === null) return <main className="pt-[190px] min-h-screen px-5 text-center text-on-surface-variant">El enlace no es válido o expiró. <Link href="/login" className="text-primary">Volver</Link></main>;
  return (
    <main className="pt-[190px] min-h-screen px-5 flex justify-center">
      <form onSubmit={submit} className="w-full max-w-sm space-y-6">
        <h1 className="font-serif text-headline-md text-center">Nueva contraseña</h1>
        <div><label className="field-label">Contraseña (mín. 8 caracteres)</label><input className="field" type="password" minLength={8} required value={password} onChange={(e) => setPassword(e.target.value)} /></div>
        {error && <p className="text-sm text-error">{error}</p>}
        <button className="btn-gold w-full">Guardar</button>
      </form>
    </main>
  );
}
