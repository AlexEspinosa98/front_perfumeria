"use client";

import { useEffect, useState } from "react";
import { api } from "./api";

export type StoreInfo = { whatsapp_number?: string; store_name?: string; announcement?: string; instagram_url?: string; facebook_url?: string };
export const DEFAULT_ANNOUNCEMENT = "Envíos a todo Colombia • Pedidos y pagos por WhatsApp";

let cache: StoreInfo | null = null;

/** Datos públicos de la tienda (WhatsApp, banner). Se piden una sola vez por visita. */
export function useStore(): StoreInfo {
  const [store, setStore] = useState<StoreInfo>(cache ?? {});
  useEffect(() => {
    if (cache) return;
    api<StoreInfo>("/store", { auth: false }).then((s) => { cache = s; setStore(s); }).catch(() => {});
  }, []);
  return store;
}
