"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";
import RequireAuth from "@/components/RequireAuth";

const tabs = [
  ["/admin/pedidos", "Pedidos"], ["/admin/catalogo", "Catálogo"], ["/admin/clientes", "Clientes"],
  ["/admin/plantillas", "Plantillas"], ["/admin/campanas", "Campañas"], ["/admin/ajustes", "Ajustes"],
];

export default function AdminLayout({ children }: { children: ReactNode }) {
  const path = usePathname();
  return (
    <RequireAuth admin>
      <main className="pt-[190px] min-h-screen px-5 md:px-12 max-w-container-max mx-auto pb-24">
        <h1 className="font-serif text-headline-md mb-5">Panel de administración</h1>
        <nav className="flex gap-2 flex-wrap border-b border-outline-variant/20 pb-4 mb-8">
          {tabs.map(([href, label]) => (
            <Link key={href} href={href}
              className={`px-4 py-2 border font-sans text-label-sm uppercase tracking-widest ${path.startsWith(href) ? "border-primary text-primary bg-primary/10" : "border-outline-variant/30 text-on-surface-variant hover:text-primary"}`}>
              {label}
            </Link>
          ))}
        </nav>
        {children}
      </main>
    </RequireAuth>
  );
}
