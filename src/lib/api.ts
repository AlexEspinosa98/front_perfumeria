import { supabase } from "./supabase";

export const API_URL = (process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000").replace(/\/$/, "");

export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
  }
}

export async function api<T = any>(path: string, init: RequestInit & { json?: unknown; auth?: boolean } = {}): Promise<T> {
  const headers = new Headers(init.headers);
  if (init.json !== undefined) headers.set("Content-Type", "application/json");
  if (init.auth !== false) {
    const { data } = await supabase.auth.getSession();
    if (data.session) headers.set("Authorization", `Bearer ${data.session.access_token}`);
  }
  const res = await fetch(`${API_URL}${path}`, {
    ...init,
    headers,
    body: init.json !== undefined ? JSON.stringify(init.json) : init.body,
  });
  if (res.status === 204) return undefined as T;
  const body = await res.json().catch(() => null);
  if (!res.ok) {
    const d = body?.detail;
    throw new ApiError(res.status, typeof d === "string" ? d : "Ocurrió un error, intenta de nuevo");
  }
  return body as T;
}

export const cop = (n: number | string) => "$" + Number(n).toLocaleString("es-CO");

export type Category = { id: string; name: string; slug: string };
export type Perfume = {
  id: string; name: string; brand: string; description: string; presentation: string;
  price: number; image_url: string | null; badge: string | null;
  is_active: boolean; is_featured: boolean; in_stock: boolean; categories?: Category[];
};
export type Profile = {
  id: string; email: string; full_name: string; phone: string; role: "customer" | "admin";
  address: string; city: string; data_consent_at: string | null; marketing_consent: boolean;
};
export type OrderItem = { id: string; name: string; unit_price: number; quantity: number };
export type Order = {
  id: string; order_number: number; status: string; total: number; created_at: string;
  tracking_code: string | null; carrier: string | null; notes: string;
  shipping_name: string; shipping_phone: string; shipping_address: string; shipping_city: string;
  order_items: OrderItem[]; events?: { status: string; note: string; created_at: string }[];
  profiles?: { full_name: string; email: string; phone: string };
};

export const STATUS_LABELS: Record<string, string> = {
  pending: "Pendiente de confirmación", confirmed: "Confirmado", paid: "Pago recibido",
  preparing: "En preparación", shipped: "Enviado", delivered: "Entregado", cancelled: "Cancelado",
};
export const ORDER_STATUSES = Object.keys(STATUS_LABELS);
