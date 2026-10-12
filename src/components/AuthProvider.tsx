"use client";

import { createContext, ReactNode, useCallback, useContext, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { api, Profile } from "@/lib/api";

interface AuthCtx {
  profile: Profile | null;
  loading: boolean;
  refresh: () => Promise<void>;
  signOut: () => Promise<void>;
}

const Ctx = createContext<AuthCtx>({ profile: null, loading: true, refresh: async () => {}, signOut: async () => {} });
export const useAuth = () => useContext(Ctx);

export default function AuthProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    const { data } = await supabase.auth.getSession();
    if (!data.session) {
      setProfile(null);
    } else {
      try { setProfile(await api<Profile>("/me")); } catch { setProfile(null); }
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    refresh();
    const { data } = supabase.auth.onAuthStateChange((event) => {
      if (event === "SIGNED_IN" || event === "SIGNED_OUT" || event === "TOKEN_REFRESHED") refresh();
    });
    return () => data.subscription.unsubscribe();
  }, [refresh]);

  const signOut = async () => { await supabase.auth.signOut(); setProfile(null); };

  return <Ctx.Provider value={{ profile, loading, refresh, signOut }}>{children}</Ctx.Provider>;
}
