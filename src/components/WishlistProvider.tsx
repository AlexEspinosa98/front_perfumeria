"use client";

import { createContext, ReactNode, useContext, useEffect, useState } from "react";

interface WishCtx { ids: string[]; has: (id: string) => boolean; toggle: (id: string) => void }
const Ctx = createContext<WishCtx>({ ids: [], has: () => false, toggle: () => {} });
export const useWishlist = () => useContext(Ctx);
const KEY = "wishlist_v1";

export default function WishlistProvider({ children }: { children: ReactNode }) {
  const [ids, setIds] = useState<string[]>([]);
  const [ready, setReady] = useState(false);
  useEffect(() => { try { setIds(JSON.parse(localStorage.getItem(KEY) ?? "[]")); } catch {} setReady(true); }, []);
  useEffect(() => { if (ready) localStorage.setItem(KEY, JSON.stringify(ids)); }, [ids, ready]);
  const toggle = (id: string) => setIds((p) => (p.includes(id) ? p.filter((x) => x !== id) : [...p, id]));
  return <Ctx.Provider value={{ ids, has: (id) => ids.includes(id), toggle }}>{children}</Ctx.Provider>;
}
