import Footer from "@/components/nav/Footer";
import Link from "next/link";

const allFragrances = [
  {
    id: "good-girl",
    name: "Good Girl",
    brand: "Ch. Herrera",
    gender: "F",
    notes: ["Cacao", "Jazmín", "Tuberosa"],
    price: 12000,
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuALQTVgPxWJK5p_VjKi0PVcjQb86V2yQgNcnsq4IOFTgXHiiPnt6TGpkQOaPwcz_Py465v6OBYNUsTODnTBevQO7ll-Pmn7mjcxylvAx26Vhm502vGNx2BqIuzxDRIL83fDkck_rqiqJBRfeL0hbKRlfbE8BUUy5GEVsS1NNwTERdas-gF4hvREr3NOZMvpCOH1M-WTBtvh1ezoyr_muWgnAvU3qmq5pdM57aU1SCrc2XX17SV75XA8nGRW86Q7",
    inStock: true,
    isNew: true,
  },
  {
    id: "sauvage",
    name: "Sauvage",
    brand: "Dior",
    gender: "M",
    notes: ["Bergamota", "Ambroxan", "Cedro"],
    price: 12000,
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuDPdKX3yozuNceZc3Q2z6YN8oDhpbx0dtoRn0y45QePSktUSGQvAFRrEiTmYf1_qRpvFdsRlcmb70_cKPmd2Mvhe6_bjdiSCSczKSHMv0ktTDhxHikOETxIUwzY3JVRxk__AuvefvqrysSNtx9QHRoJ7fdeNnYNQrrj6N8ACsEZyFUENOh_Q9xdCcUfeN9SyXeXQViVZb8jSt7vVvMRW7V9VuUgZBG4sWChksNx3gsJDWrtqa7RNwqhrjQ8UfeiDN6B4ekbs4NfsvHN",
    inStock: true,
    isNew: false,
  },
  {
    id: "black-opium",
    name: "Black Opium",
    brand: "YSL",
    gender: "F",
    notes: ["Café", "Vainilla", "Jazmin Blanco"],
    price: 12000,
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuAnCbMvArNbKBGh55Hbm4ObHgIWG3M5tYZvZSsYAWTCMRZLG17FPuK_P35hL4vW0ET2l4ibCpcVLythskr0tfxq-8Uowvh79nMk7dsQjcb5vXDLS73igCjjXS16rdXHfPuCF-fRpyGebHUDnMWYNnpR00bb4ON8kPtQ53omsOFxiOY9UstBL6WiXQJZfJBy2XUj08g2-9A9HhF3G6yb4XpmZy1wiNY8qShytCI03t0ZBchB-tc5xj4pwkw1DD5PeGOEkTlPgOu52pJH",
    inStock: true,
    isNew: true,
  },
  {
    id: "one-million",
    name: "1 Million",
    brand: "Paco Rabanne",
    gender: "M",
    notes: ["Pomelo", "Canela", "Cuero"],
    price: 12000,
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuABepTrWf1qQUKlZuYO8e5veIPTGvppkDPbDky5hWs7B-FF8yhbiZsPhgxK1soJmll41bKE-juynWQuK7fkQDBSe-aCQV_VD6LZXjeSWadAOA-YLS5sPpkA9RJ2hlfPXy8QrXzcVGJ7y2oYXoZ7vMpG54vrlohQroVQxLNUzVTC0-VsP0OGDrU9wae4O7jXHINjTP9LYD8R8tO6xwCgrH9j2fJFz6j1rn0fWUepqyai_ThlcLUKaPmo5sfGFRGGTVAaiaF8Mspse21_",
    inStock: true,
    isNew: false,
  },
  {
    id: "libre",
    name: "Libre",
    brand: "YSL",
    gender: "F",
    notes: ["Lavanda", "Musk", "Vainilla"],
    price: 12000,
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuALQTVgPxWJK5p_VjKi0PVcjQb86V2yQgNcnsq4IOFTgXHiiPnt6TGpkQOaPwcz_Py465v6OBYNUsTODnTBevQO7ll-Pmn7mjcxylvAx26Vhm502vGNx2BqIuzxDRIL83fDkck_rqiqJBRfeL0hbKRlfbE8BUUy5GEVsS1NNwTERdas-gF4hvREr3NOZMvpCOH1M-WTBtvh1ezoyr_muWgnAvU3qmq5pdM57aU1SCrc2XX17SV75XA8nGRW86Q7",
    inStock: false,
    isNew: false,
  },
  {
    id: "bleu-chanel",
    name: "Bleu de Chanel",
    brand: "Chanel",
    gender: "M",
    notes: ["Limón", "Madera", "Sándalo"],
    price: 12000,
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuAnCbMvArNbKBGh55Hbm4ObHgIWG3M5tYZvZSsYAWTCMRZLG17FPuK_P35hL4vW0ET2l4ibCpcVLythskr0tfxq-8Uowvh79nMk7dsQjcb5vXDLS73igCjjXS16rdXHfPuCF-fRpyGebHUDnMWYNnpR00bb4ON8kPtQ53omsOFxiOY9UstBL6WiXQJZfJBy2XUj08g2-9A9HhF3G6yb4XpmZy1wiNY8qShytCI03t0ZBchB-tc5xj4pwkw1DD5PeGOEkTlPgOu52pJH",
    inStock: true,
    isNew: true,
  },
];

export default function ColeccionesPage() {
  return (
    <>
      <main className="pt-section-gap min-h-screen px-margin-desktop max-w-container-max mx-auto pb-section-gap">
        <header className="mb-12 border-b border-outline-variant/20 pb-stack-md">
          <p className="font-sans text-label-sm uppercase tracking-[0.3em] text-primary mb-stack-sm">
            Fragance Perfumería
          </p>
          <h1 className="font-serif text-headline-lg text-on-surface">
            Nuestras Colecciones
          </h1>
          <p className="font-sans text-body-md text-on-surface-variant mt-stack-sm">
            30ml · Alcohol premium · Concentrado importado
          </p>
        </header>

        <div className="flex gap-stack-sm mb-12 flex-wrap">
          {["Todos", "Femeninos", "Masculinos", "Novedades"].map((f) => (
            <button
              key={f}
              className={`font-sans text-label-sm uppercase tracking-widest px-6 py-2 border transition-all ${
                f === "Todos"
                  ? "border-primary text-primary bg-primary/10"
                  : "border-outline-variant/40 text-on-surface-variant hover:border-primary hover:text-primary"
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-gutter">
          {allFragrances.map((frag) => (
            <Link
              key={frag.id}
              href={`/colecciones/${frag.id}`}
              className="group"
            >
              <div className="relative aspect-[3/4] bg-surface-container-lowest overflow-hidden ghost-border mb-stack-sm">
                {frag.isNew && (
                  <span className="absolute top-3 left-3 z-10 font-sans text-[10px] uppercase tracking-widest bg-primary text-on-primary px-2 py-1">
                    Nuevo
                  </span>
                )}
                {!frag.inStock && (
                  <span className="absolute top-3 right-3 z-10 font-sans text-[10px] uppercase tracking-widest bg-surface-container text-on-surface-variant px-2 py-1">
                    Agotado
                  </span>
                )}
                <img
                  src={frag.img}
                  alt={frag.name}
                  className={`w-full h-full object-contain p-6 group-hover:scale-105 transition-transform duration-700 ${
                    !frag.inStock ? "opacity-50 grayscale" : ""
                  }`}
                />
                <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-surface-container-lowest/90 to-transparent h-16 translate-y-full group-hover:translate-y-0 transition-transform duration-300 flex items-end justify-center pb-3">
                  <span className="font-sans text-label-sm uppercase tracking-widest text-primary">
                    Ver detalle
                  </span>
                </div>
              </div>
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-sans text-[10px] uppercase tracking-widest text-on-surface-variant mb-1">
                    {frag.brand} ·{" "}
                    {frag.gender === "F" ? "Femenino" : "Masculino"}
                  </p>
                  <h3 className="font-serif text-headline-sm group-hover:text-primary transition-colors">
                    {frag.name}
                  </h3>
                </div>
                <span className="font-sans text-body-md text-primary font-semibold mt-1 whitespace-nowrap">
                  ${frag.price.toLocaleString("es-CO")}
                </span>
              </div>
              <div className="flex gap-1 mt-stack-sm flex-wrap">
                {frag.notes.map((n) => (
                  <span
                    key={n}
                    className="text-[9px] uppercase tracking-tighter text-on-surface-variant/70 font-sans"
                  >
                    {n}
                    {frag.notes.indexOf(n) < frag.notes.length - 1 ? " ·" : ""}
                  </span>
                ))}
              </div>
            </Link>
          ))}
        </div>
      </main>
      <Footer />
    </>
  );
}
