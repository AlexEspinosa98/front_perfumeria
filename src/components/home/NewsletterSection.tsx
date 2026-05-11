"use client";

import { useState } from "react";

export default function NewsletterSection() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) setSubmitted(true);
  };

  return (
    <section className="py-section-gap px-margin-desktop text-center max-w-3xl mx-auto">
      <h3 className="font-serif text-headline-md mb-stack-md italic">
        Únete al Círculo Íntimo
      </h3>
      <p className="font-sans text-body-md text-on-surface-variant mb-stack-lg uppercase tracking-[0.1em]">
        Accede a ediciones limitadas y showcases privados del atelier.
      </p>

      {submitted ? (
        <div className="py-8">
          <span className="material-symbols-outlined text-primary text-5xl block mb-4">
            check_circle
          </span>
          <p className="font-sans text-label-sm uppercase tracking-widest text-primary">
            Bienvenido al Círculo
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="relative group">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="INGRESA TU EMAIL"
            required
            className="w-full bg-transparent border-b border-outline-variant/30 py-4 font-sans text-label-sm tracking-widest text-on-surface focus:outline-none focus:border-primary transition-all placeholder:text-on-surface/30"
          />
          <button
            type="submit"
            className="absolute right-0 bottom-4 font-sans text-label-sm text-primary uppercase tracking-widest hover:text-primary-fixed-dim transition-colors"
          >
            Suscribirse
          </button>
        </form>
      )}

      <p className="text-[10px] text-on-surface/40 mt-stack-md uppercase tracking-widest font-sans">
        Al suscribirte, aceptas nuestra política de privacidad.
      </p>
    </section>
  );
}
