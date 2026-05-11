export default function HeritageSection() {
  return (
    <section
      id="atelier"
      className="bg-surface-container-lowest py-section-gap border-y border-outline-variant/10"
    >
      <div className="px-margin-desktop max-w-container-max mx-auto grid grid-cols-1 md:grid-cols-2 gap-section-gap items-center">
        <div className="order-2 md:order-1">
          <img
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuAjovVwO7xebuEf5N2q1lfLVmswvQKGPA7dk1DYprG-1u78aWBPi6GKF9951DEJcgqzuKpYhVKrB9PwqlZF8QZRRSnfSbg9Y9klfbJERmiERWVC0bNn1YPN2EAsyJukJO4EcKvY-g940hhl1UsBA_gwGC0G37a6TQTzrVCz824Wp-wM0tRC263P4Drc_X2y6XolMH-Ej1WkcsC1x2wqtYCG2lo9FQTTmdcOHBdaCBfdT5vPiQEZBPsQ6rBfevGyEEwloKQlmwAP_HW"
            alt="Atelier de parfumerie"
            className="w-full grayscale hover:grayscale-0 transition-all duration-1000 ghost-border"
          />
        </div>

        <div className="order-1 md:order-2 space-y-stack-lg">
          <span className="font-sans text-label-sm uppercase tracking-[0.3em] text-primary">
            Nuestra Historia
          </span>
          <h2 className="font-serif text-headline-lg leading-tight">
            La Proporción Áurea del Aroma
          </h2>
          <p className="font-sans text-body-lg text-on-surface-variant">
            Nacido de una obsesión singular: la búsqueda del &ldquo;aroma
            perfecto&rdquo;, una armonía matemática entre los espíritus volátiles
            de la naturaleza y la artesanía humana perdurable.
          </p>
          <p className="font-sans text-body-md text-on-surface-variant">
            Cada fragancia es una edición de autor reformulada con alcohol
            premium y los mejores concentrados importados, entregada en frascos
            de 30ml listos para llevar.
          </p>
          <div className="pt-stack-md">
            <button className="group flex items-center gap-stack-sm font-sans text-label-sm uppercase tracking-widest text-primary">
              NUESTRO LEGADO
              <span className="material-symbols-outlined group-hover:translate-x-2 transition-transform">
                arrow_forward
              </span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
