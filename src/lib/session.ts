// Tokens de sesión (los entrega el backend). Se guardan en localStorage y se refrescan solos.
export type Session = { access_token: string; refresh_token: string; expires_at: number }; // expires_at: epoch seg.

const KEY = "session_v1";
const API = (process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000").replace(/\/$/, "");

export function saveSession(s: { access_token: string; refresh_token: string; expires_in: number; expires_at?: number | null }) {
  const session: Session = {
    access_token: s.access_token,
    refresh_token: s.refresh_token,
    expires_at: s.expires_at ?? Math.floor(Date.now() / 1000) + s.expires_in,
  };
  try { localStorage.setItem(KEY, JSON.stringify(session)); } catch {}
}

export function readSession(): Session | null {
  try { return JSON.parse(localStorage.getItem(KEY) ?? "null"); } catch { return null; }
}

export function clearSession() {
  try { localStorage.removeItem(KEY); } catch {}
}

let inflight: Promise<Session | null> | null = null;

/** Renueva el token con el refresh_token (una sola llamada a la vez). */
export function refreshSession(): Promise<Session | null> {
  const cur = readSession();
  if (!cur) return Promise.resolve(null);
  inflight ??= fetch(`${API}/auth/refresh`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refresh_token: cur.refresh_token }),
  })
    .then(async (r) => {
      if (!r.ok) { clearSession(); return null; }
      saveSession(await r.json());
      return readSession();
    })
    .catch(() => null)
    .finally(() => { inflight = null; });
  return inflight;
}

/** Access token válido (renueva si expira en menos de 60 s). */
export async function getAccessToken(): Promise<string | null> {
  let s = readSession();
  if (!s) return null;
  if (s.expires_at - 60 < Date.now() / 1000) s = await refreshSession();
  return s?.access_token ?? null;
}
