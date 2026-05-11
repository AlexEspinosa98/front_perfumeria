import Link from "next/link";

export default function NotFound() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center text-center px-margin-mobile">
      <p className="font-sans text-label-sm uppercase tracking-[0.4em] text-primary mb-stack-sm">
        404
      </p>
      <h1 className="font-serif text-headline-lg text-on-surface mb-stack-md">
        Página no encontrada
      </h1>
      <p className="font-sans text-body-md text-on-surface-variant mb-8 max-w-sm">
        La fragancia que buscas no existe en nuestra colección.
      </p>
      <Link
        href="/"
        className="metallic-gradient px-10 py-3.5 text-on-primary font-sans text-label-sm tracking-widest hover:brightness-110 transition-all"
      >
        Volver al Inicio
      </Link>
    </main>
  );
}
