"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const logoClickCount = useRef(0);
  const logoClickTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [cartCount] = useState(0);

  const isActive = (path: string) => pathname === path;

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

  return (
    <nav className="fixed top-0 w-full z-50 bg-surface-dim/80 backdrop-blur-md border-b border-outline-variant/10">
      <div className="flex justify-between items-center px-margin-desktop py-stack-md w-full max-w-container-max mx-auto">
        <div className="flex-1 hidden md:flex gap-gutter items-center">
          <Link
            href="/colecciones"
            className={`nav-link ${isActive("/colecciones") ? "text-primary" : ""}`}
          >
            Colecciones
          </Link>
          <Link
            href="/colecciones?filter=nuevo"
            className="nav-link"
          >
            Novedades
          </Link>
          <Link href="#atelier" className="nav-link">
            Atelier
          </Link>
        </div>

        <div className="flex-1 flex justify-center md:flex-none">
          <button
            onClick={handleLogoClick}
            className="font-serif text-headline-sm tracking-[0.3em] text-primary uppercase cursor-pointer hover:text-primary-fixed-dim transition-colors duration-300 select-none"
            aria-label="FRAGANCE – Inicio"
          >
            FRAGANCE
          </button>
        </div>

        <div className="flex-1 flex justify-end items-center gap-stack-lg">
          <button
            className="relative text-primary cursor-pointer hover:scale-110 transition-transform"
            aria-label="Bolsa de compras"
          >
            <span className="material-symbols-outlined">shopping_bag</span>
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-primary text-on-primary text-[10px] rounded-full flex items-center justify-center font-sans font-bold">
                {cartCount}
              </span>
            )}
          </button>
          <button
            className="text-primary cursor-pointer hover:scale-110 transition-transform"
            aria-label="Cuenta"
          >
            <span className="material-symbols-outlined">person</span>
          </button>
        </div>
      </div>
    </nav>
  );
}
