"use client";

import { useState } from "react";

const CORRECT_PASSWORD = "contra123";

interface Props {
  onSuccess: () => void;
}

export default function InventoryLock({ onSuccess }: Props) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [show, setShow] = useState(false);
  const [shaking, setShaking] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === CORRECT_PASSWORD) {
      setError(false);
      onSuccess();
    } else {
      setError(true);
      setShaking(true);
      setTimeout(() => setShaking(false), 600);
      setPassword("");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background relative overflow-hidden">
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-5">
        <span className="font-serif text-[40vw] text-primary/20 leading-none select-none">
          F
        </span>
      </div>

      <div
        className={`relative z-10 w-full max-w-sm px-6 transition-all ${
          shaking ? "animate-[shake_0.4s_ease-in-out]" : ""
        }`}
        style={{
          animation: shaking ? "shake 0.4s ease-in-out" : undefined,
        }}
      >
        <div className="text-center mb-10">
          <p className="font-sans text-label-sm uppercase tracking-[0.4em] text-primary/60 mb-3">
            Acceso Restringido
          </p>
          <h1 className="font-serif text-headline-sm text-on-surface uppercase tracking-widest">
            Inventario
          </h1>
          <div className="mt-4 mx-auto w-16 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative">
            <input
              type={show ? "text" : "password"}
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError(false);
              }}
              placeholder="CONTRASEÑA"
              autoFocus
              className={`w-full bg-transparent border-b py-3 font-sans text-label-sm tracking-[0.2em] text-on-surface focus:outline-none transition-colors placeholder:text-on-surface/20 ${
                error
                  ? "border-error text-error"
                  : "border-outline-variant/50 focus:border-primary"
              }`}
            />
            <button
              type="button"
              onClick={() => setShow(!show)}
              className="absolute right-0 top-1/2 -translate-y-1/2 text-on-surface-variant/50 hover:text-primary transition-colors"
            >
              <span className="material-symbols-outlined text-lg">
                {show ? "visibility_off" : "visibility"}
              </span>
            </button>
          </div>

          {error && (
            <p className="font-sans text-[11px] uppercase tracking-widest text-error text-center">
              Contraseña incorrecta
            </p>
          )}

          <button
            type="submit"
            className="w-full metallic-gradient text-on-primary py-3.5 font-sans text-label-sm uppercase tracking-[0.3em] hover:brightness-110 active:scale-95 transition-all"
          >
            Acceder
          </button>
        </form>

        <p className="mt-8 text-center font-sans text-[10px] uppercase tracking-widest text-on-surface/20">
          Fragance Perfumería · Uso interno
        </p>
      </div>

      <style jsx>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          20% { transform: translateX(-8px); }
          40% { transform: translateX(8px); }
          60% { transform: translateX(-6px); }
          80% { transform: translateX(6px); }
        }
      `}</style>
    </div>
  );
}
