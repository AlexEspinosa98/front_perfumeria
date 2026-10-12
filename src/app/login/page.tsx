"use client";

import Link from "next/link";
import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase";

function LoginForm() {
  const router = useRouter();
  const next = useSearchParams().get("next") ?? "/cuenta";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true); setError("");
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setBusy(false);
    if (error) return setError("Correo o contraseña incorrectos");
    router.push(next);
  };

  const reset = async () => {
    if (!email) return setError("Escribe tu correo para enviarte el enlace");
    await supabase.auth.resetPasswordForEmail(email, { redirectTo: `${window.location.origin}/cuenta` });
    setError("Si el correo existe, te enviamos un enlace para restablecer la contraseña.");
  };

  return (
    <main className="pt-40 min-h-screen px-5 flex justify-center pb-24">
      <form onSubmit={submit} className="w-full max-w-sm space-y-6">
        <h1 className="font-serif text-headline-md text-center">Ingresar</h1>
        <div><label className="field-label">Correo</label><input className="field" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} /></div>
        <div><label className="field-label">Contraseña</label><input className="field" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} /></div>
        {error && <p className="text-sm text-error">{error}</p>}
        <button className="btn-gold w-full" disabled={busy}>{busy ? "Ingresando…" : "Ingresar"}</button>
        <div className="flex justify-between text-sm text-on-surface-variant">
          <button type="button" onClick={reset} className="hover:text-primary">Olvidé mi contraseña</button>
          <Link href="/registro" className="text-primary">Crear cuenta</Link>
        </div>
      </form>
    </main>
  );
}

export default function LoginPage() {
  return <Suspense fallback={null}><LoginForm /></Suspense>;
}
