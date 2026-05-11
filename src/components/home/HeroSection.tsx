import Link from "next/link";

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 z-0">
        <img
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuBUIqXyFmn1dadsaYEe9OA3S0oDP6mzwK4gtDRMghCY_0mEVE_Zj-OBuNRhi8JS2XJ09YE7N3Ub-PnpSNAmrwLt16i-BD3IgE6jTFVBGADg8wHChpNFiLXSB4GRSTqMTAC1uglshd_dfretU4zltzxcJCpxiAl8Q2Zgw4BI_Df0s6Z76PEkivhiSyBjuWEfcgAsV6tCrOCCOm7M5Z8ssy1kZ---T6rZgF7WVZNai3VF-B3L8UeZaH9UsoQ5yE3JR6V2EClUGWClW6zB"
          alt="Luxury perfume hero"
          className="w-full h-full object-cover opacity-50 grayscale hover:grayscale-0 transition-all duration-1000"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-transparent to-background/80" />
      </div>

      <div className="relative z-10 text-center max-w-4xl px-5 md:px-12">
        <p className="font-sans text-label-sm uppercase tracking-[0.4em] text-primary mb-4">
          Maison De Haute Parfumerie
        </p>
        <h2 className="font-serif text-[2.5rem] md:text-[4rem] lg:text-headline-xl leading-[1.1] text-on-surface mb-6">
          El Arte del<br />
          <span className="italic">Olfato Raro</span>
        </h2>
        <p className="font-sans text-base md:text-body-md text-on-surface-variant max-w-md mx-auto mb-8">
          Fragancias de autor elaboradas con las esencias botánicas más raras
          del mundo, reformuladas para tu identidad única.
        </p>
        <div className="flex justify-center gap-4 flex-wrap">
          <Link
            href="/colecciones"
            className="metallic-gradient px-8 md:px-12 py-3.5 text-on-primary font-sans text-label-sm tracking-widest hover:brightness-110 transition-all active:scale-95 gold-shimmer"
          >
            EXPLORAR
          </Link>
          <Link
            href="/colecciones?filter=nuevo"
            className="border border-primary/30 px-8 md:px-12 py-3.5 font-sans text-label-sm tracking-widest text-primary hover:border-primary hover:bg-primary/5 transition-all"
          >
            NOVEDADES
          </Link>
        </div>
      </div>

      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 animate-bounce">
        <span className="material-symbols-outlined text-primary/40 text-2xl">keyboard_arrow_down</span>
      </div>
    </section>
  );
}
