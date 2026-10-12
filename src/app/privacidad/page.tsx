import Footer from "@/components/nav/Footer";

export const metadata = { title: "Política de tratamiento de datos | Bahía Perfumes" };

export default function PrivacidadPage() {
  return (
    <>
      <main className="pt-[190px] min-h-screen px-5 md:px-20 max-w-3xl mx-auto pb-24 space-y-5 text-on-surface-variant">
        <h1 className="font-serif text-headline-lg text-on-surface">Política de tratamiento de datos personales</h1>
        <p>Versión v1. En cumplimiento de la Ley 1581 de 2012 y el Decreto 1377 de 2013, Bahía Perfumes (el «Responsable») informa cómo trata tus datos.</p>
        <h2 className="font-serif text-headline-sm text-on-surface">Datos que recolectamos</h2>
        <p>Nombre, teléfono, correo electrónico, dirección de entrega e historial de compras.</p>
        <h2 className="font-serif text-headline-sm text-on-surface">Finalidades</h2>
        <ul className="list-disc pl-6 space-y-1">
          <li>Gestionar tu cuenta, pedidos, envíos y seguimiento.</li>
          <li>Contactarte por correo o WhatsApp para coordinar y confirmar tus pedidos.</li>
          <li>Si lo autorizas aparte: enviarte promociones y novedades.</li>
        </ul>
        <h2 className="font-serif text-headline-sm text-on-surface">Tus derechos</h2>
        <p>Puedes conocer, actualizar y rectificar tus datos desde «Mi cuenta», revocar la autorización de promociones en cualquier momento (también con el enlace de baja de cada correo) y solicitar la supresión de tus datos escribiéndonos por WhatsApp o al correo de la tienda.</p>
        <h2 className="font-serif text-headline-sm text-on-surface">Contacto del Responsable</h2>
        <p>Completar con razón social, NIT, dirección, correo y teléfono de la tienda antes de publicar.</p>
      </main>
      <Footer />
    </>
  );
}
