import HomeHero from "@/components/home/HomeHero";
import FeaturedGrid from "@/components/home/FeaturedGrid";
import Footer from "@/components/nav/Footer";

export default function HomePage() {
  return (
    <main className="pt-[168px]">
      <HomeHero />
      <FeaturedGrid />
      <section className="border-y border-outline-variant">
        <div className="max-w-container-max mx-auto px-5 md:px-12 py-8 grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
          {[["chat", "Pedidos por WhatsApp", "Confirmamos contigo el pago y la entrega."], ["local_shipping", "Envíos a todo Colombia", "Con guía de seguimiento en tu cuenta."], ["workspace_premium", "Perfumería árabe", "Attar, oud y fragancias de alta fijación."]].map(([icon, t, d]) => (
            <div key={t} className="flex flex-col items-center gap-1">
              <span className="material-symbols-outlined text-[26px]">{icon}</span>
              <p className="font-sans text-[11px] uppercase tracking-[0.2em] font-bold">{t}</p>
              <p className="font-sans text-body-md text-on-surface-variant">{d}</p>
            </div>
          ))}
        </div>
      </section>
      <Footer />
    </main>
  );
}
