import InventarioClient from "@/components/inventory/InventarioClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Inventario | Fragance",
  robots: { index: false, follow: false },
};

export default function InventarioPage() {
  return <InventarioClient />;
}
