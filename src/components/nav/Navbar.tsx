"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useTheme } from "@/components/ThemeProvider";
import { useAuth } from "@/components/AuthProvider";
import { useCart } from "@/components/CartProvider";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { theme, toggle } = useTheme();
  const { profile, signOut } = useAuth();
  const { count } = useCart();
  const [mobileOpen, setMobileOpen] = useState(false);
  const logoClickCount = useRef(0);
  const logoClickTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const isInventory = pathname === "/inventario";

  const isActive = (path: string) =>
    pathname === path || pathname.startsWith(path + "/");

  // 5 clics en el logo → inventario
  const handleLogoClick = () => {
    logoClickCount.current += 1;
    if (logoClickTimer.current) clearTimeout(logoClickTimer.current);
    logoClickTimer.current = setTimeout(() => {
      logoClickCount.current = 0;
    }, 1500);
    if (logoClickCount.current >= 5) {
      logoClickCount.current = 0;
      router.push("/inventario");
    }
  };

  // Ctrl+Shift+I → inventario
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === "I") {
        e.preventDefault();
        router.push("/inventario");
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [router]);

  // Cerrar menú mobile al cambiar ruta
  useEffect(() => setMobileOpen(false), [pathname]);

  // Bloquear scroll cuando el menú está abierto
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  if (isInventory) return null;

  const navLinks = [
    { href: "/colecciones", label: "Colecciones" },
    { href: "/colecciones?category=nuevos", label: "Novedades" },
    { href: "/colecciones?category=promociones", label: "Promociones" },
    { href: "/#atelier", label: "Atelier" },
  ];

  return (
    <>
      <nav
        className="fixed top-0 w-full z-50 border-b"
        style={{
          backgroundColor: `rgba(var(--c-bg), 0.85)`,
          backdropFilter: "blur(12px)",
          borderColor: `rgba(var(--c-outline-var), 0.2)`,
        }}
      >
        <div className="flex justify-between items-center px-5 md:px-20 py-4 w-full max-w-[1440px] mx-auto">
          {/* Desktop nav links / Mobile hamburger */}
          <div className="flex-1 flex items-center">
            <div className="hidden md:flex gap-6 items-center">
              {navLinks.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  className={`nav-link ${isActive(l.href) ? "!text-primary" : ""}`}
                >
                  {l.label}
                </Link>
              ))}
            </div>
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden text-primary hover:scale-110 transition-transform"
              aria-label="Menú"
            >
              <span className="material-symbols-outlined text-2xl">
                {mobileOpen ? "close" : "menu"}
              </span>
            </button>
          </div>

          {/* Logo */}
          <div className="flex-1 flex justify-center">
            <button
              onClick={handleLogoClick}
              className="font-serif text-xl md:text-2xl tracking-[0.3em] text-primary uppercase cursor-pointer hover:opacity-80 transition-opacity select-none"
              aria-label="FRAGANCE – Inicio"
            >
              FRAGANCE
            </button>
          </div>

          {/* Right actions */}
          <div className="flex-1 flex justify-end items-center gap-4">
            {/* Theme toggle */}
            <button
              onClick={toggle}
              className="text-primary cursor-pointer hover:scale-110 transition-transform"
              aria-label={theme === "dark" ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
              title={theme === "dark" ? "Modo claro" : "Modo oscuro"}
            >
              <span className="material-symbols-outlined text-xl">
                {theme === "dark" ? "light_mode" : "dark_mode"}
              </span>
            </button>

            <Link href="/carrito" aria-label="Bolsa" className="relative">
              <span className="material-symbols-outlined text-primary hover:scale-110 transition-transform text-xl">
                shopping_bag
              </span>
              {count > 0 && (
                <span className="absolute -top-2 -right-2 bg-primary text-on-primary text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {count}
                </span>
              )}
            </Link>

            {profile?.role === "admin" && (
              <Link href="/admin" className="nav-link hidden md:block">Admin</Link>
            )}
            <Link
              href={profile ? "/cuenta" : "/login"}
              className="text-primary hover:scale-110 transition-transform"
              aria-label={profile ? "Mi cuenta" : "Ingresar"}
              title={profile ? "Mi cuenta" : "Ingresar"}
            >
              <span className="material-symbols-outlined text-xl">person</span>
            </Link>
            {profile && (
              <button onClick={signOut} className="nav-link hidden md:block" aria-label="Salir">Salir</button>
            )}
          </div>
        </div>
      </nav>

      {/* Mobile slide-in menu */}
      <div
        className={`fixed inset-0 z-40 md:hidden transition-opacity duration-300 ${
          mobileOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        style={{ backgroundColor: "rgba(var(--c-bg), 0.97)" }}
      >
        <div className="flex flex-col items-center justify-center h-full gap-10">
          {navLinks.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="font-serif text-3xl text-primary tracking-widest hover:opacity-70 transition-opacity"
            >
              {l.label}
            </Link>
          ))}
          <div
            className="mt-4 w-16 h-px"
            style={{ backgroundColor: `rgba(var(--c-primary), 0.3)` }}
          />
          <Link
            href="/carrito"
            className="flex items-center gap-2 font-sans text-label-sm uppercase tracking-widest text-on-surface-variant hover:text-primary transition-colors"
          >
            <span className="material-symbols-outlined text-lg">shopping_bag</span>
            Mi Bolsa
          </Link>
          <Link href={profile ? "/cuenta" : "/login"} className="font-sans text-label-sm uppercase tracking-widest text-on-surface-variant hover:text-primary">
            {profile ? "Mi cuenta" : "Ingresar"}
          </Link>
          {profile?.role === "admin" && (
            <Link href="/admin" className="font-sans text-label-sm uppercase tracking-widest text-primary">Panel admin</Link>
          )}
        </div>
      </div>
    </>
  );
}
