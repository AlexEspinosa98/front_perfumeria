"use client";

import Footer from "@/components/nav/Footer";
import Link from "next/link";
import { useState } from "react";

const initialItems = [
  {
    id: "nuit-rare",
    name: "Nuit Rare",
    variant: "14ml / Extrait",
    price: 12000,
    qty: 1,
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuAq9i_e_EYYYq0xaSwzBoGFSXXgrxAHG2gEuAsawnKPI8P_IbIHKATu9_RAEk6Tx4lRxH5I3Nt8dr950Tph7cySbkffYgOpnlKuJQa-8309ZnxuWJClWY16yDsYl5-mcVd7EYkBNEE3ucAL12sIRvjEFHltYwSqaTNoGtk8bAr7Ume4h22E7KGT7VSUREKl3ybFqjFLdpdAQxMCvSAgUcmQRijN1i9THJJcnYCGmNAn8Fk8iUbe8WorTYPB4jozzy8g3jq46gOgfsWT",
  },
  {
    id: "oud-solaire",
    name: "Oud Solaire",
    variant: "14ml / Parfum",
    price: 12000,
    qty: 1,
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuDPdKX3yozuNceZc3Q2z6YN8oDhpbx0dtoRn0y45QePSktUSGQvAFRrEiTmYf1_qRpvFdsRlcmb70_cKPmd2Mvhe6_bjdiSCSczKSHMv0ktTDhxHikOETxIUwzY3JVRxk__AuvefvqrysSNtx9QHRoJ7fdeNnYNQrrj6N8ACsEZyFUENOh_Q9xdCcUfeN9SyXeXQViVZb8jSt7vVvMRW7V9VuUgZBG4sWChksNx3gsJDWrtqa7RNwqhrjQ8UfeiDN6B4ekbs4NfsvHN",
  },
];

export default function CarritoPage() {
  const [items, setItems] = useState(initialItems);

  const updateQty = (id: string, delta: number) => {
    setItems((prev) =>
      prev
        .map((item) =>
          item.id === id ? { ...item, qty: Math.max(0, item.qty + delta) } : item
        )
        .filter((item) => item.qty > 0)
    );
  };

  const subtotal = items.reduce((sum, item) => sum + item.price * item.qty, 0);
  const taxes = Math.round(subtotal * 0.19);
  const total = subtotal + taxes;

  return (
    <>
      <main className="pt-section-gap min-h-screen px-5 md:px-20 max-w-container-max mx-auto pb-section-gap">
        <header className="mb-stack-lg border-b border-outline-variant/20 pb-stack-md">
          <h2 className="font-serif text-headline-lg text-primary">
            Tu Bolsa de Compra
          </h2>
          <p className="font-sans text-label-sm uppercase tracking-[0.2em] text-on-surface-variant">
            Revisa tus artefactos seleccionados
          </p>
        </header>

        {items.length === 0 ? (
          <div className="text-center py-24">
            <span className="material-symbols-outlined text-6xl text-on-surface-variant/30 block mb-4">
              shopping_bag
            </span>
            <p className="font-serif text-headline-sm text-on-surface-variant mb-8">
              Tu bolsa está vacía
            </p>
            <Link
              href="/colecciones"
              className="metallic-gradient px-10 py-4 text-on-primary font-sans text-label-sm tracking-widest hover:brightness-110 transition-all"
            >
              Explorar Colección
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-margin-desktop">
            <div className="lg:col-span-8">
              <div className="space-y-stack-lg">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-gutter border-b border-outline-variant/10 pb-stack-lg group"
                  >
                    <div className="w-32 h-40 bg-surface-container-high relative overflow-hidden flex-shrink-0 ghost-border">
                      <img
                        src={item.img}
                        alt={item.name}
                        className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
                      />
                    </div>
                    <div className="flex-grow grid grid-cols-1 sm:grid-cols-3 items-center gap-3 sm:gap-0">
                      <div className="col-span-1">
                        <h3 className="font-serif text-headline-sm text-on-surface mb-stack-sm">
                          {item.name}
                        </h3>
                        <p className="font-sans text-label-sm uppercase text-primary tracking-widest">
                          {item.variant}
                        </p>
                      </div>
                      <div className="col-span-1 flex justify-center items-center gap-stack-md">
                        <button
                          onClick={() => updateQty(item.id, -1)}
                          className="text-on-surface-variant hover:text-primary transition-colors"
                        >
                          <span className="material-symbols-outlined text-lg">
                            remove
                          </span>
                        </button>
                        <span className="font-sans text-body-lg w-8 text-center">
                          {String(item.qty).padStart(2, "0")}
                        </span>
                        <button
                          onClick={() => updateQty(item.id, 1)}
                          className="text-on-surface-variant hover:text-primary transition-colors"
                        >
                          <span className="material-symbols-outlined text-lg">
                            add
                          </span>
                        </button>
                      </div>
                      <div className="col-span-1 text-right">
                        <span className="font-sans text-body-lg text-on-surface">
                          ${(item.price * item.qty).toLocaleString("es-CO")}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-stack-lg">
                <Link
                  href="/colecciones"
                  className="flex items-center gap-stack-sm text-on-surface-variant hover:text-primary transition-colors w-fit"
                >
                  <span className="material-symbols-outlined">arrow_back</span>
                  <span className="font-sans text-label-sm uppercase tracking-widest">
                    Continuar Explorando
                  </span>
                </Link>
              </div>
            </div>

            <div className="lg:col-span-4">
              <div className="bg-surface-container-low p-stack-lg ghost-border sticky top-32">
                <h3 className="font-serif text-headline-sm text-on-surface mb-stack-lg pb-stack-sm border-b border-outline-variant/20 uppercase tracking-widest">
                  Resumen
                </h3>
                <div className="space-y-stack-md mb-stack-lg">
                  <div className="flex justify-between font-sans text-body-md text-on-surface-variant">
                    <span>Subtotal</span>
                    <span>${subtotal.toLocaleString("es-CO")}</span>
                  </div>
                  <div className="flex justify-between font-sans text-body-md text-on-surface-variant">
                    <span>Envío</span>
                    <span className="text-primary italic">Por calcular</span>
                  </div>
                  <div className="flex justify-between font-sans text-body-md text-on-surface-variant">
                    <span>IVA (19%)</span>
                    <span>${taxes.toLocaleString("es-CO")}</span>
                  </div>
                </div>
                <div className="border-t border-outline-variant/20 pt-stack-md mb-stack-lg">
                  <div className="flex justify-between items-baseline">
                    <span className="font-sans text-label-sm uppercase tracking-widest text-on-surface">
                      Total
                    </span>
                    <span className="font-serif text-headline-md text-primary">
                      ${total.toLocaleString("es-CO")}
                    </span>
                  </div>
                </div>

                <button className="w-full metallic-gradient text-on-primary py-4 font-sans text-label-sm uppercase tracking-[0.25em] transition-all hover:brightness-110 active:scale-95 duration-300 gold-shimmer flex items-center justify-center gap-stack-sm">
                  <span className="material-symbols-outlined text-lg">
                    lock
                  </span>
                  Pago Seguro
                </button>

                <p className="mt-stack-lg font-sans text-body-md text-on-surface-variant italic text-center text-sm">
                  Cada pedido llega con muestras gratuitas de nuestras últimas
                  colecciones.
                </p>
              </div>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}
