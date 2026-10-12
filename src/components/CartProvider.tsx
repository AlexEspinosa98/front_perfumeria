"use client";

import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import type { Perfume } from "@/lib/api";

export type CartLine = { id: string; name: string; price: number; image_url: string | null; presentation: string; qty: number };

interface CartCtx {
  lines: CartLine[];
  count: number;
  subtotal: number;
  add: (p: Perfume, qty?: number) => void;
  setQty: (id: string, qty: number) => void;
  clear: () => void;
}

const Ctx = createContext<CartCtx>({ lines: [], count: 0, subtotal: 0, add: () => {}, setQty: () => {}, clear: () => {} });
export const useCart = () => useContext(Ctx);
const KEY = "cart_v1";

export default function CartProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try { setLines(JSON.parse(localStorage.getItem(KEY) ?? "[]")); } catch {}
    setReady(true);
  }, []);
  useEffect(() => { if (ready) localStorage.setItem(KEY, JSON.stringify(lines)); }, [lines, ready]);

  const add = (p: Perfume, qty = 1) =>
    setLines((prev) => {
      const ex = prev.find((l) => l.id === p.id);
      if (ex) return prev.map((l) => (l.id === p.id ? { ...l, qty: Math.min(50, l.qty + qty) } : l));
      return [...prev, { id: p.id, name: p.name, price: Number(p.price), image_url: p.image_url, presentation: p.presentation, qty }];
    });
  const setQty = (id: string, qty: number) =>
    setLines((prev) => prev.map((l) => (l.id === id ? { ...l, qty } : l)).filter((l) => l.qty > 0));

  return (
    <Ctx.Provider value={{
      lines, add, setQty, clear: () => setLines([]),
      count: lines.reduce((s, l) => s + l.qty, 0),
      subtotal: lines.reduce((s, l) => s + l.price * l.qty, 0),
    }}>{children}</Ctx.Provider>
  );
}
