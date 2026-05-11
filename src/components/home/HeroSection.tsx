import Link from "next/link";

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 z-0">
        <img
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuBUIqXyFmn1dadsaYEe9OA3S0oDP6mzwK4gtDRMghCY_0mEVE_Zj-OBuNRhi8JS2XJ09YE7N3Ub-PnpSNAmrwLt16i-BD3IgE6jTFVBGADg8wHChpNFiLXSB4GRSTqMTAC1uglshd_dfretU4zltzxcJCpxiAl8Q2Zgw4BI_Df0s6Z76PEkivhiSyBjuWEfcgAsV6tCrOCCOm7M5Z8ssy1kZ---T6rZgF7WVZNai3VF-B3L8UeZaH9UsoQ5yE3JR6V2EClUGWClW6zB"
          alt="Luxury perfume hero"
          className="w-full h-full object-cover opacity-55 grayscale hover:grayscale-0 transition-all duration-1000"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-transparent to-background/80" />
      </div>

      <div className="relative z-10 text-center max-w-4xl px-margin-mobile">
        <p className="font-sans text-label-sm uppercase tracking-[0.4em] text-primary mb-stack-md">
          Maison De Haute Parfumerie
        </p>
        <h2 className="font-serif text-headline-xl text-on-surface mb-stack-lg">
          El Arte del<br />
          <span className="italic">Olfato Raro</span>
        </h2>
        <p className="font-sans text-body-md text-on-surface-variant max-w-xl mx-auto mb-8">
          Fragancias de autor elaboradas con las esencias botánicas más raras
          del mundo, reformuladas para tu identidad única.
        </p>
        <div className="flex justify-center gap-gutter flex-wrap">
          <Link
            href="/colecciones"
            className="metallic-gradient px-12 py-4 text-on-primary font-sans text-label-sm tracking-widest hover:brightness-110 transition-all active:scale-95 gold-shimmer"
          >
            EXPLORAR COLECCIÓN
          </Link>
          <Link
            href="/colecciones?filter=nuevo"
            className="border border-primary/30 px-12 py-4 font-sans text-label-sm tracking-widest text-primary hover:border-primary hover:bg-primary/5 transition-all"
          >
            NOVEDADES
          </Link>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 animate-bounce">
        <span className="material-symbols-outlined text-primary/50 text-2xl">
          keyboard_arrow_down
        </span>
      </div>
    </section>
  );
}
