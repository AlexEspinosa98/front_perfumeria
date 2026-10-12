import { getAccessToken, refreshSession } from "./session";

export const API_URL = (process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000").replace(/\/$/, "");

export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
  }
}

export async function api<T = any>(path: string, init: RequestInit & { json?: unknown; auth?: boolean } = {}): Promise<T> {
  const send = async (token: string | null) => {
    const headers = new Headers(init.headers);
    if (init.json !== undefined) headers.set("Content-Type", "application/json");
    if (token) headers.set("Authorization", `Bearer ${token}`);
    return fetch(`${API_URL}${path}`, {
      ...init,
      headers,
      body: init.json !== undefined ? JSON.stringify(init.json) : init.body,
    });
  };

  const useAuth = init.auth !== false;
  let res = await send(useAuth ? await getAccessToken() : null);
  if (res.status === 401 && useAuth) {
    const s = await refreshSession(); // el token pudo vencer antes de lo esperado
    if (s) res = await send(s.access_token);
  }
  if (res.status === 204) return undefined as T;
  const body = await res.json().catch(() => null);
  if (!res.ok) {
    const d = body?.detail;
    const msg = typeof d === "string" ? d : Array.isArray(d) ? d[0]?.msg?.replace(/^Value error, /, "") : null;
    throw new ApiError(res.status, msg ?? "Ocurrió un error, intenta de nuevo");
  }
  return body as T;
}

export const cop = (n: number | string) => "$" + Number(n).toLocaleString("es-CO");

export type Category = { id: string; name: string; slug: string };
export type Perfume = {
  id: string; name: string; brand: string; description: string; presentation: string;
  price: number; image_url: string | null; badge: string | null;
  is_active: boolean; is_featured: boolean; in_stock: boolean; categories?: Category[];
  stock?: number; cost?: number; // solo las ve el admin
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
  contact_via?: "reserve" | "whatsapp";
  order_items: OrderItem[]; events?: { status: string; note: string; created_at: string }[];
  profiles?: { full_name: string; email: string; phone: string };
};

export const STATUS_LABELS: Record<string, string> = {
  pending: "Pendiente de confirmación", confirmed: "Confirmado", paid: "Pago recibido",
  preparing: "En preparación", shipped: "Enviado", delivered: "Entregado", cancelled: "Cancelado",
};
export const ORDER_STATUSES = Object.keys(STATUS_LABELS);

export type Review = {
  id: string; rating: number; comment: string; created_at: string; author: string;
  perfume_id: string; perfume_name: string | null; verified: boolean;
};
export type Testimonial = { id: string; image_url: string; author: string; caption: string; is_active?: boolean; sort_order?: number };

export type SaleItem = { id: string; perfume_id: string | null; name: string; quantity: number; unit_price: number; unit_cost: number };
export type Sale = {
  id: string; sold_at: string; channel: "web" | "whatsapp" | "presencial" | "otro"; customer_name: string; note: string;
  order_id: string | null; sale_items: SaleItem[]; revenue: number; cost: number; profit: number;
};
export type Expense = { id: string; spent_at: string; amount: number; reason: string; category: string; note: string };
export type Summary = {
  revenue: number; cogs: number; expenses: number; gross_profit: number; gross_margin: number | null; net_profit: number;
  sales_count: number; units: number; avg_ticket: number; items_without_cost: number;
  sales_by_day: { date: string; revenue: number; cogs: number }[];
  expenses_by_day: { date: string; amount: number }[];
  top_products: { name: string; units: number; revenue: number; profit: number }[];
  by_channel: { channel: string; sales: number; revenue: number }[];
  expenses_by_category: { category: string; amount: number }[];
  inventory: { units: number; value_at_cost: number; value_at_price: number; low_stock: { id: string; name: string; stock: number }[] };
};

export const CHANNEL_LABELS: Record<string, string> = { web: "Pedido web", whatsapp: "WhatsApp", presencial: "Presencial", otro: "Otro" };
export const EXPENSE_CATEGORIES: [string, string][] = [
  ["insumos", "Insumos y empaque"], ["publicidad", "Publicidad"], ["envios", "Envíos"], ["transporte", "Transporte"],
  ["servicios", "Servicios (internet, luz…)"], ["arriendo", "Arriendo"], ["nomina", "Nómina / ayudantes"],
  ["impuestos", "Impuestos"], ["otros", "Otros"],
];
export const expenseLabel = (k: string) => EXPENSE_CATEGORIES.find(([c]) => c === k)?.[1] ?? k;
