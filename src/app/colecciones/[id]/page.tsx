"use client";

import Footer from "@/components/nav/Footer";
import Link from "next/link";
import { useState } from "react";

export default function ProductDetailPage() {
  const [selectedGrams, setSelectedGrams] = useState(14);
  const [added, setAdded] = useState(false);

  const gramOptions = [
    { grams: 14, label: "14ml", price: 12000 },
    { grams: 30, label: "30ml", price: 22000 },
  ];

  const selected = gramOptions.find((o) => o.grams === selectedGrams)!;

  const handleAdd = () => {
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <>
      <main className="pt-section-gap min-h-screen px-margin-desktop max-w-container-max mx-auto pb-section-gap">
        <div className="mb-stack-lg">
          <Link
            href="/colecciones"
            className="flex items-center gap-stack-sm font-sans text-label-sm uppercase tracking-widest text-on-surface-variant hover:text-primary transition-colors"
          >
            <span className="material-symbols-outlined text-lg">arrow_back</span>
            Colecciones
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-margin-desktop items-start">
          <div className="relative">
            <div className="aspect-square bg-surface-container-lowest ghost-border flex items-center justify-center p-16">
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAq9i_e_EYYYq0xaSwzBoGFSXXgrxAHG2gEuAsawnKPI8P_IbIHKATu9_RAEk6Tx4lRxH5I3Nt8dr950Tph7cySbkffYgOpnlKuJQa-8309ZnxuWJClWY16yDsYl5-mcVd7EYkBNEE3ucAL12sIRvjEFHltYwSqaTNoGtk8bAr7Ume4h22E7KGT7VSUREKl3ybFqjFLdpdAQxMCvSAgUcmQRijN1i9THJJcnYCGmNAn8Fk8iUbe8WorTYPB4jozzy8g3jq46gOgfsWT"
                alt="Nuit Rare"
                className="w-full h-full object-contain hover:scale-105 transition-transform duration-700"
              />
            </div>
          </div>

          <div className="space-y-stack-lg lg:sticky lg:top-32">
            <div>
              <p className="font-sans text-label-sm uppercase tracking-[0.3em] text-primary mb-stack-sm">
                Maison De Haute Parfumerie
              </p>
              <h1 className="font-serif text-headline-lg text-on-surface mb-stack-sm">
                Nuit Rare
              </h1>
              <p className="font-sans text-body-md text-on-surface-variant">
                Extrait de Parfum · Concentrado importado 1.1
              </p>
            </div>

            <div className="border-t border-outline-variant/20 pt-stack-lg">
              <p className="font-sans text-body-md text-on-surface-variant mb-4">
                Una composición oscura y enigmática que captura la esencia de
                una noche en Grasse. Notas de apertura cítricas que evolucionan
                hacia un corazón floral y un fondo amaderado-especiado.
              </p>
            </div>

            <div>
              <p className="font-sans text-label-sm uppercase tracking-widest text-on-surface-variant mb-3">
                Notas Olfativas
              </p>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { type: "Salida", notes: "Bergamota, Limón" },
                  { type: "Corazón", notes: "Rosa, Jazmín, Iris" },
                  { type: "Fondo", notes: "Sándalo, Ámbar, Almizcle" },
                ].map((group) => (
                  <div key={group.type} className="bg-surface-container-low p-3 ghost-border">
                    <p className="font-sans text-[9px] uppercase tracking-widest text-primary mb-1">
                      {group.type}
                    </p>
                    <p className="font-sans text-[11px] text-on-surface-variant">
                      {group.notes}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <p className="font-sans text-label-sm uppercase tracking-widest text-on-surface-variant mb-3">
                Tamaño
              </p>
              <div className="flex gap-3">
                {gramOptions.map((opt) => (
                  <button
                    key={opt.grams}
                    onClick={() => setSelectedGrams(opt.grams)}
                    className={`flex-1 py-3 border font-sans text-label-sm uppercase tracking-widest transition-all ${
                      selectedGrams === opt.grams
                        ? "border-primary text-primary bg-primary/10"
                        : "border-outline-variant/30 text-on-surface-variant hover:border-primary"
                    }`}
                  >
                    {opt.label}
                    <span className="block text-[10px] mt-0.5">
                      ${opt.price.toLocaleString("es-CO")}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <div className="border-t border-outline-variant/20 pt-stack-lg">
              <div className="flex items-baseline justify-between mb-stack-lg">
                <span className="font-sans text-label-sm uppercase tracking-widest text-on-surface-variant">
                  Precio
                </span>
                <span className="font-serif text-headline-md text-primary">
                  ${selected.price.toLocaleString("es-CO")}
                </span>
              </div>

              <button
                onClick={handleAdd}
                className={`w-full py-4 font-sans text-label-sm uppercase tracking-[0.25em] transition-all duration-300 flex items-center justify-center gap-3 gold-shimmer ${
                  added
                    ? "bg-surface-container border border-primary text-primary"
                    : "metallic-gradient text-on-primary hover:brightness-110 active:scale-95"
                }`}
              >
                <span className="material-symbols-outlined text-xl">
                  {added ? "check" : "shopping_bag"}
                </span>
                {added ? "Agregado" : "Agregar a la Bolsa"}
              </button>
            </div>

            <div className="flex gap-6 text-on-surface-variant pt-stack-sm">
              {[
                { icon: "local_shipping", text: "Envío a todo Colombia" },
                { icon: "verified", text: "Concentrado auténtico" },
                { icon: "recycling", text: "Frasco recargable" },
              ].map((item) => (
                <div
                  key={item.icon}
                  className="flex flex-col items-center gap-1 flex-1 text-center"
                >
                  <span className="material-symbols-outlined text-primary text-xl">
                    {item.icon}
                  </span>
                  <span className="font-sans text-[10px] uppercase tracking-wider">
                    {item.text}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
