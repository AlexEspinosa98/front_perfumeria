"use client";

import Link from "next/link";
import { useStore } from "@/lib/useStore";

export default function Footer() {
  const { whatsapp_number } = useStore();
  const link = "font-sans text-body-md text-on-surface-variant hover:text-primary hover:underline underline-offset-4";
  return (
    <footer className="w-full py-16 border-t border-outline-variant bg-surface-container-low">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-gutter px-5 md:px-12 max-w-container-max mx-auto">
        <div>
          <h4 className="font-serif text-headline-sm uppercase mb-4">Bahía Perfumes</h4>
          <p className="font-sans text-body-md text-on-surface-variant">Especialistas en perfumería árabe: attar, oud y fragancias de alta fijación.</p>
        </div>
        <div className="flex flex-col gap-2">
          <h5 className="font-sans text-label-sm uppercase tracking-widest mb-2">Tienda</h5>
          <Link href="/colecciones" className={link}>Catálogo</Link>
          <Link href="/colecciones?category=promociones" className={link}>Promociones</Link>
          <Link href="/colecciones?category=nuevos" className={link}>Nuevos</Link>
        </div>
        <div className="flex flex-col gap-2">
          <h5 className="font-sans text-label-sm uppercase tracking-widest mb-2">Mi cuenta</h5>
          <Link href="/cuenta" className={link}>Mis datos</Link>
          <Link href="/cuenta/pedidos" className={link}>Mis pedidos</Link>
          <Link href="/privacidad" className={link}>Política de privacidad</Link>
        </div>
        <div className="flex flex-col gap-2">
          <h5 className="font-sans text-label-sm uppercase tracking-widest mb-2">Contacto</h5>
          {whatsapp_number ? (
            <a href={`https://wa.me/${whatsapp_number}`} target="_blank" rel="noreferrer" className={`${link} flex items-center gap-2`}>
              <span className="material-symbols-outlined text-lg">chat</span>WhatsApp
            </a>
          ) : <span className={link}>Pedidos por WhatsApp</span>}
        </div>
      </div>
      <p className="mt-12 text-center font-sans text-[12px] text-outline px-5">© {new Date().getFullYear()} Bahía Perfumes</p>
    </footer>
  );
}
