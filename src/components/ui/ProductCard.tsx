"use client";

import Link from "next/link";
import { useState } from "react";
import { useCart } from "@/components/CartProvider";
import { useWishlist } from "@/components/WishlistProvider";
import ProductImage from "@/components/ui/ProductImage";
import StockLabel from "@/components/ui/StockLabel";
import { cop, Perfume } from "@/lib/api";

export default function ProductCard({ p }: { p: Perfume }) {
  const { add } = useCart();
  const { has, toggle } = useWishlist();
  const [added, setAdded] = useState(false);
  const liked = has(p.id);

  const onAdd = () => {
    add(p);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <article className="flex flex-col bg-surface ghost-border hover:!border-primary transition-colors">
      <div className="relative aspect-[4/5] bg-surface-container-low">
        {p.badge && (
          <span className="absolute top-2 left-2 z-10 bg-primary text-on-primary font-sans text-[9px] font-bold uppercase tracking-[0.15em] px-2 py-1">
            {p.badge}
          </span>
        )}
        <button
          onClick={() => toggle(p.id)}
          aria-label={liked ? "Quitar de deseos" : "Agregar a deseos"}
          className="absolute top-2 right-2 z-10 w-8 h-8 flex items-center justify-center bg-surface ghost-border"
        >
          <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: `"FILL" ${liked ? 1 : 0}, "wght" 300` }}>favorite</span>
        </button>
        <Link href={`/colecciones/${p.id}`} className="block w-full h-full">
          <ProductImage
            src={p.image_url} alt={p.name}
            className={`w-full h-full object-contain p-4 ${!p.in_stock ? "opacity-40 grayscale" : ""}`}
          />
        </Link>
        {!p.in_stock && (
          <span className="absolute bottom-2 left-2 bg-surface ghost-border font-sans text-[9px] uppercase tracking-[0.15em] px-2 py-1">Agotado</span>
        )}
      </div>

      <div className="p-3 flex flex-col gap-1 flex-grow">
        <p className="font-sans text-[10px] uppercase tracking-[0.18em] font-semibold text-on-surface">{p.brand || " "}</p>
        <Link href={`/colecciones/${p.id}`} className="font-serif text-[17px] leading-tight line-clamp-2 hover:underline">{p.name}</Link>
        {p.presentation && <p className="font-sans text-[12px] text-outline">{p.presentation}</p>}
        <p className="font-sans text-[18px] font-bold mt-1">{cop(p.price)}</p>
        <StockLabel stock={p.stock} inStock={p.in_stock} />
      </div>

      <button
        onClick={onAdd}
        disabled={!p.in_stock}
        className="btn-gold !rounded-none !py-3 m-3 mt-0 !text-[11px]"
      >
        <span className="material-symbols-outlined text-[16px]">{added ? "check" : "shopping_bag"}</span>
        {!p.in_stock ? "Agotado" : added ? "Añadido" : "Añadir"}
      </button>
    </article>
  );
}
