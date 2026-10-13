"use client";

import { usePathname } from "next/navigation";
import { useStore, waLink } from "@/lib/useStore";

/** Contacto directo por WhatsApp en todo el sitio: no requiere cuenta. */
export default function WhatsAppFab() {
  const pathname = usePathname();
  const { whatsapp_number } = useStore();
  if (pathname.startsWith("/admin") || pathname === "/inventario") return null;
  return (
    <a
      href={waLink(whatsapp_number, "Hola, quisiera información sobre sus perfumes.")}
      target="_blank" rel="noopener noreferrer" aria-label="Escribir por WhatsApp"
      className="fixed z-40 right-4 bottom-20 md:bottom-6 h-12 pl-3 pr-4 bg-primary text-on-primary border border-primary flex items-center gap-2 font-sans text-[11px] uppercase tracking-[0.15em] font-bold hover:bg-surface hover:text-primary transition-colors"
    >
      <span className="material-symbols-outlined text-[22px]">chat</span>
      <span className="hidden sm:inline">WhatsApp</span>
    </a>
  );
}
