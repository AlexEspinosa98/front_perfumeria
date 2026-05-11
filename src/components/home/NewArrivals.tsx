import Link from "next/link";

const products = [
  {
    id: "oud-nocturne",
    name: "Oud Nocturne",
    notes: ["Azafrán", "Oud Oscuro", "Cuero"],
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuALQTVgPxWJK5p_VjKi0PVcjQb86V2yQgNcnsq4IOFTgXHiiPnt6TGpkQOaPwcz_Py465v6OBYNUsTODnTBevQO7ll-Pmn7mjcxylvAx26Vhm502vGNx2BqIuzxDRIL83fDkck_rqiqJBRfeL0hbKRlfbE8BUUy5GEVsS1NNwTERdas-gF4hvREr3NOZMvpCOH1M-WTBtvh1ezoyr_muWgnAvU3qmq5pdM57aU1SCrc2XX17SV75XA8nGRW86Q7",
    offset: false,
  },
  {
    id: "ambre-precieux",
    name: "Ambre Précieux",
    notes: ["Miel", "Ámbar", "Cistus"],
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuABepTrWf1qQUKlZuYO8e5veIPTGvppkDPbDky5hWs7B-FF8yhbiZsPhgxK1soJmll41bKE-juynWQuK7fkQDBSe-aCQV_VD6LZXjeSWadAOA-YLS5sPpkA9RJ2hlfPXy8QrXzcVGJ7y2oYXoZ7vMpG54vrlohQroVQxLNUzVTC0-VsP0OGDrU9wae4O7jXHINjTP9LYD8R8tO6xwCgrH9j2fJFz6j1rn0fWUepqyai_ThlcLUKaPmo5sfGFRGGTVAaiaF8Mspse21_",
    offset: true,
  },
  {
    id: "fleur-argent",
    name: "Fleur d'Argent",
    notes: ["Iris", "Almizcle Blanco", "Neroli"],
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuAnCbMvArNbKBGh55Hbm4ObHgIWG3M5tYZvZSsYAWTCMRZLG17FPuK_P35hL4vW0ET2l4ibCpcVLythskr0tfxq-8Uowvh79nMk7dsQjcb5vXDLS73igCjjXS16rdXHfPuCF-fRpyGebHUDnMWYNnpR00bb4ON8kPtQ53omsOFxiOY9UstBL6WiXQJZfJBy2XUj08g2-9A9HhF3G6yb4XpmZy1wiNY8qShytCI03t0ZBchB-tc5xj4pwkw1DD5PeGOEkTlPgOu52pJH",
    offset: false,
  },
];

export default function NewArrivals() {
  return (
    <section className="py-section-gap px-margin-desktop max-w-container-max mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
        <div className="max-w-2xl">
          <p className="font-sans text-label-sm uppercase tracking-[0.3em] text-primary mb-stack-sm">
            Colección 2025
          </p>
          <h3 className="font-serif text-headline-lg mb-stack-md italic">
            Les Nouveautés
          </h3>
          <p className="font-sans text-body-lg text-on-surface-variant">
            Una selección curada de nuestras más recientes exploraciones
            olfativas, elaboradas con ingredientes obtenidos en los rincones más
            remotos del planeta.
          </p>
        </div>
        <Link
          href="/colecciones"
          className="font-sans text-label-sm uppercase tracking-widest text-primary border-b border-primary/30 pb-2 hover:border-primary transition-all whitespace-nowrap"
        >
          Ver Todo
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
        {products.map((product) => (
          <Link
            key={product.id}
            href={`/colecciones/${product.id}`}
            className={`group cursor-pointer ${product.offset ? "md:translate-y-12" : ""}`}
          >
            <div className="relative aspect-[3/4] bg-surface-container-lowest overflow-hidden ghost-border p-8 mb-stack-md">
              <img
                src={product.img}
                alt={product.name}
                className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-surface-container-lowest/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </div>
            <h4 className="font-serif text-headline-sm group-hover:text-primary transition-colors">
              {product.name}
            </h4>
            <div className="flex gap-stack-sm mt-stack-sm flex-wrap">
              {product.notes.map((note) => (
                <span
                  key={note}
                  className="px-3 py-1 border border-outline-variant/30 text-[10px] uppercase tracking-tighter text-on-surface-variant font-sans"
                >
                  {note}
                </span>
              ))}
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
