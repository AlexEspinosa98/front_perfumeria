"use client";

import { createContext, ReactNode, useCallback, useContext, useEffect, useState } from "react";
import { api, Profile } from "@/lib/api";
import { clearSession, readSession, saveSession } from "@/lib/session";

type RegisterData = { email: string; password: string; full_name: string; phone: string; data_consent: boolean; marketing_consent: boolean };

interface AuthCtx {
  profile: Profile | null;
  loading: boolean;
  refresh: () => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  register: (d: RegisterData) => Promise<{ needsConfirmation: boolean }>;
  signOut: () => Promise<void>;
}

const noop = async () => {};
const Ctx = createContext<AuthCtx>({
  profile: null, loading: true, refresh: noop, login: noop,
  register: async () => ({ needsConfirmation: false }), signOut: noop,
});
export const useAuth = () => useContext(Ctx);

export default function AuthProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    if (!readSession()) setProfile(null);
    else { try { setProfile(await api<Profile>("/me")); } catch { setProfile(null); } }
    setLoading(false);
  }, []);

  useEffect(() => { refresh(); }, [refresh]);

  const login = async (email: string, password: string) => {
    const s = await api("/auth/login", { method: "POST", json: { email, password }, auth: false });
    saveSession(s);
    await refresh();
  };

  const register = async (d: RegisterData) => {
    const r = await api<{ needs_confirmation: boolean; session: any }>("/auth/register", { method: "POST", json: d, auth: false });
    if (r.session) { saveSession(r.session); await refresh(); }
    return { needsConfirmation: r.needs_confirmation };
  };

  const signOut = async () => {
    await api("/auth/logout", { method: "POST" }).catch(() => {});
    clearSession();
    setProfile(null);
  };

  return <Ctx.Provider value={{ profile, loading, refresh, login, register, signOut }}>{children}</Ctx.Provider>;
}
