"use client";

import { useRef, useState } from "react";
import ProductImage from "@/components/ui/ProductImage";

export default function Gallery({ images, alt }: { images: string[]; alt: string }) {
  const [i, setI] = useState(0);
  const touch = useRef<number | null>(null);
  const n = images.length;
  const go = (d: number) => setI((x) => (x + d + n) % n);

  if (n === 0) return <div className="aspect-square bg-surface-container-low ghost-border"><ProductImage src={null} alt={alt} className="w-full h-full" /></div>;

  return (
    <div className="space-y-3">
      <div
        className="relative aspect-square bg-surface-container-low ghost-border overflow-hidden touch-pan-y"
        onTouchStart={(e) => { touch.current = e.touches[0].clientX; }}
        onTouchEnd={(e) => {
          if (touch.current === null || n < 2) return;
          const dx = e.changedTouches[0].clientX - touch.current;
          if (Math.abs(dx) > 40) go(dx < 0 ? 1 : -1);
          touch.current = null;
        }}
      >
        <ProductImage src={images[i]} alt={`${alt} — foto ${i + 1}`} className="w-full h-full object-contain p-4 md:p-10" />
        {n > 1 && (
          <>
            <button onClick={() => go(-1)} aria-label="Foto anterior" className="absolute left-2 top-1/2 -translate-y-1/2 w-9 h-9 bg-surface ghost-border flex items-center justify-center"><span className="material-symbols-outlined text-[20px]">chevron_left</span></button>
            <button onClick={() => go(1)} aria-label="Foto siguiente" className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 bg-surface ghost-border flex items-center justify-center"><span className="material-symbols-outlined text-[20px]">chevron_right</span></button>
            <div className="absolute bottom-2 inset-x-0 flex justify-center gap-1.5">
              {images.map((_, k) => <span key={k} className={`h-[3px] ${k === i ? "w-6 bg-primary" : "w-3 bg-primary/30"}`} />)}
            </div>
          </>
        )}
      </div>
      {n > 1 && (
        <div className="grid grid-cols-3 gap-2">
          {images.map((u, k) => (
            <button key={u} onClick={() => setI(k)} aria-label={`Ver foto ${k + 1}`}
              className={`aspect-square bg-surface-container-low ${k === i ? "border-2 border-primary" : "ghost-border"}`}>
              <ProductImage src={u} alt="" className="w-full h-full object-contain p-1.5" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
