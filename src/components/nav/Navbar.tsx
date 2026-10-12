"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useRef, useState } from "react";
import { api } from "@/lib/api";
import { useAuth } from "@/components/AuthProvider";
import { useCart } from "@/components/CartProvider";
import { useWishlist } from "@/components/WishlistProvider";
import { DEFAULT_ANNOUNCEMENT, useStore } from "@/lib/useStore";

const CHIPS: [string, string][] = [
  ["Promociones", "promociones"], ["Nuevo", "nuevos"], ["Hombres", "hombres"],
  ["Mujeres", "mujeres"], ["Attar & Oud", "attar-oud"],
];

const TABS = [
  { href: "/", label: "Home", icon: "home" },
  { href: "/colecciones", label: "Catálogo", icon: "auto_awesome" },
  { href: "/deseos", label: "Deseos", icon: "favorite" },
  { href: "/carrito", label: "Carrito", icon: "shopping_bag" },
];

function Nav() {
  const pathname = usePathname();
  const router = useRouter();
  const category = useSearchParams().get("category") ?? "";
  const { profile, signOut } = useAuth();
  const { count } = useCart();
  const { ids } = useWishlist();
  const store = useStore();
  const [pending, setPending] = useState(0);
  const isAdmin = profile?.role === "admin";
  useEffect(() => {
    if (!isAdmin) return;
    const load = () => api<{ pending: number }>("/admin/orders/pending-count").then((r) => setPending(r.pending)).catch(() => {});
    load();
    const t = setInterval(load, 60000);
    return () => clearInterval(t);
  }, [isAdmin]);
  const clicks = useRef(0);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // 5 clics en el logo o Ctrl+Shift+I → inventario interno
  const onLogo = () => {
    clicks.current += 1;
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => (clicks.current = 0), 1500);
    if (clicks.current >= 5) { clicks.current = 0; router.push("/inventario"); }
    else router.push("/");
  };
  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.ctrlKey && e.shiftKey && e.key === "I") { e.preventDefault(); router.push("/inventario"); } };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [router]);

  if (pathname === "/inventario") return null;

  const here = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

  return (
    <>
      <header className="fixed top-0 inset-x-0 z-50 bg-surface/95 backdrop-blur border-b border-outline-variant">
        <div className="bg-primary text-on-primary text-center px-4 py-1.5 flex items-center justify-center gap-1.5">
          <span className="material-symbols-outlined text-[13px]">verified</span>
          <span className="font-sans text-[10px] uppercase tracking-[0.2em] font-semibold">{store.announcement || DEFAULT_ANNOUNCEMENT}</span>
        </div>

        <div className="max-w-container-max mx-auto px-5 md:px-12">
          <div className="h-16 flex items-center justify-between gap-4">
            <button onClick={onLogo} aria-label="Bahía Perfumes – Inicio" className="font-serif text-xl md:text-2xl tracking-tight uppercase leading-none text-left select-none">
              Bahía<br className="md:hidden" /> <span className="md:ml-1">Perfumes</span>
            </button>

            <nav className="hidden md:flex gap-8 font-sans text-[11px] uppercase tracking-[0.2em] font-semibold">
              <Link href="/colecciones" className={here("/colecciones") ? "underline underline-offset-8" : "hover:underline underline-offset-8"}>Catálogo</Link>
              <Link href="/deseos" className={here("/deseos") ? "underline underline-offset-8" : "hover:underline underline-offset-8"}>Deseos{ids.length ? ` (${ids.length})` : ""}</Link>
            </nav>

            <div className="flex items-center gap-1">
              <Link href="/colecciones#buscar" aria-label="Buscar" className="w-11 h-11 flex items-center justify-center hover:opacity-60"><span className="material-symbols-outlined text-[22px]">search</span></Link>
              <Link href="/carrito" aria-label="Bolsa" className="relative w-11 h-11 flex items-center justify-center hover:opacity-60">
                <span className="material-symbols-outlined text-[22px]">shopping_bag</span>
                {count > 0 && <span className="absolute top-2 right-2 bg-primary text-on-primary text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">{count}</span>}
              </Link>
              <Link href={profile ? "/cuenta" : "/login"} aria-label={profile ? "Mi cuenta" : "Ingresar"} className="w-8 h-8 ml-1 rounded-full bg-primary text-on-primary flex items-center justify-center">
                <span className="material-symbols-outlined text-[18px]">person</span>
              </Link>
              {profile?.role === "admin" && <Link href="/admin" className="hidden md:block ml-3 font-sans text-[11px] uppercase tracking-[0.2em] font-semibold hover:underline underline-offset-8">Admin{pending > 0 && <span className="ml-1.5 bg-primary text-on-primary text-[10px] font-bold px-1.5 py-0.5 rounded-full">{pending}</span>}</Link>}
              {profile && <button onClick={signOut} className="hidden md:block ml-3 font-sans text-[11px] uppercase tracking-[0.2em] text-outline hover:text-primary">Salir</button>}
            </div>
          </div>

          <div className="pb-2.5 border-t border-outline-variant/60 pt-1.5">
            <div className="flex items-center justify-between py-0.5">
              <span className="flex items-center gap-1.5 font-sans text-[10px] uppercase tracking-wider font-bold"><span className="material-symbols-outlined text-[16px]">hotel_class</span>Especialistas en perfumería árabe</span>
              <span className="font-sans text-[10px] uppercase text-outline hidden sm:block">{pathname === "/" ? "Home" : pathname.split("/")[1]}</span>
            </div>
            <div className="flex items-center gap-1.5 overflow-x-auto py-1 no-scrollbar">
              {CHIPS.map(([label, slug]) => (
                <Link key={slug} href={`/colecciones?category=${slug}`} className={`chip ${category === slug && pathname.startsWith("/colecciones") ? "chip-active" : ""}`}>{label}</Link>
              ))}
            </div>
          </div>
        </div>
      </header>

      <nav className="md:hidden fixed bottom-0 inset-x-0 z-50 h-16 bg-surface/95 backdrop-blur border-t border-outline-variant flex justify-around items-center">
        {TABS.map((t) => (
          <Link key={t.href} href={t.href} aria-current={here(t.href) ? "page" : undefined}
            className={`relative flex flex-col items-center justify-center min-w-[56px] h-12 gap-0.5 ${here(t.href) ? "font-bold text-primary" : "text-outline"}`}>
            <span className="material-symbols-outlined text-[22px]" style={{ fontVariationSettings: `"FILL" ${here(t.href) ? 1 : 0}, "wght" 300` }}>{t.icon}</span>
            <span className="font-sans text-[10px] uppercase tracking-wider">{t.label}</span>
            {t.href === "/carrito" && count > 0 && <span className="absolute top-0 right-1 bg-primary text-on-primary text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">{count}</span>}
          </Link>
        ))}
      </nav>
    </>
  );
}

export default function Navbar() {
  return <Suspense fallback={null}><Nav /></Suspense>;
}
