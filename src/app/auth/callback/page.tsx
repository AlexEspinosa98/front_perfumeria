"use client";

import { useEffect, useState } from "react";
import { saveSession } from "@/lib/session";

/** Destino del enlace de confirmación de correo: lee los tokens del hash y abre la sesión. */
export default function AuthCallback() {
  const [error, setError] = useState(false);
  useEffect(() => {
    const h = new URLSearchParams(window.location.hash.slice(1));
    const access = h.get("access_token"), refresh = h.get("refresh_token");
    if (!access || !refresh) { setError(true); return; }
    saveSession({ access_token: access, refresh_token: refresh, expires_in: Number(h.get("expires_in") ?? 3600) });
    window.location.replace("/cuenta");
  }, []);
  return (
    <main className="pt-[190px] min-h-screen px-5 text-center text-on-surface-variant">
      {error ? "El enlace no es válido o expiró. Intenta ingresar con tu correo y contraseña." : "Confirmando tu cuenta…"}
    </main>
  );
}
