export default function Footer() {
  return (
    <footer className="w-full py-section-gap border-t border-outline-variant/10 bg-surface-container-lowest">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-gutter px-5 md:px-20 max-w-container-max mx-auto">
        <div className="col-span-1">
          <h4 className="font-serif text-headline-sm text-primary uppercase tracking-widest mb-stack-lg">
            FRAGANCE
          </h4>
          <p className="font-sans text-body-md text-on-surface-variant">
            El Arte del Olfato Raro. Experiencias olfativas a medida
            elaboradas con los mejores concentrados importados.
          </p>
        </div>

        <div className="flex flex-col gap-stack-sm">
          <h5 className="font-sans text-label-sm uppercase text-primary mb-stack-sm tracking-widest">
            La Casa
          </h5>
          {["Herencia", "Sostenibilidad", "Atelier"].map((item) => (
            <a
              key={item}
              href="#"
              className="font-sans text-body-md text-on-surface-variant hover:text-primary transition-colors duration-300"
            >
              {item}
            </a>
          ))}
        </div>

        <div className="flex flex-col gap-stack-sm">
          <h5 className="font-sans text-label-sm uppercase text-primary mb-stack-sm tracking-widest">
            Servicio al Cliente
          </h5>
          {["Envíos", "Devoluciones", "Política de Privacidad"].map((item) => (
            <a
              key={item}
              href="#"
              className="font-sans text-body-md text-on-surface-variant hover:text-primary transition-colors duration-300"
            >
              {item}
            </a>
          ))}
        </div>

        <div className="flex flex-col gap-stack-sm">
          <h5 className="font-sans text-label-sm uppercase text-primary mb-stack-sm tracking-widest">
            Conectar
          </h5>
          <div className="flex gap-stack-md text-on-surface-variant">
            <button className="material-symbols-outlined cursor-pointer hover:text-primary transition-colors">
              public
            </button>
            <button className="material-symbols-outlined cursor-pointer hover:text-primary transition-colors">
              photo_camera
            </button>
            <button className="material-symbols-outlined cursor-pointer hover:text-primary transition-colors">
              mail
            </button>
          </div>
        </div>
      </div>

      <div className="mt-16 text-center px-5 md:px-20 max-w-container-max mx-auto">
        <p className="font-sans text-body-md text-on-surface-variant/40 border-t border-outline-variant/10 pt-stack-lg">
          © 2025 Fragance Perfumería. El Arte del Olfato Raro.
        </p>
      </div>
    </footer>
  );
}
