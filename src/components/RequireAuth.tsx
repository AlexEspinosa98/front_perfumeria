"use client";

import { ReactNode, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/components/AuthProvider";

export default function RequireAuth({ children, admin = false }: { children: ReactNode; admin?: boolean }) {
  const { profile, loading } = useAuth();
  const router = useRouter();
  const path = usePathname();

  useEffect(() => {
    if (!loading && !profile) router.replace(`/login?next=${encodeURIComponent(path)}`);
  }, [loading, profile, router, path]);

  if (loading || !profile) return <main className="pt-40 min-h-screen px-5 md:px-20 text-on-surface-variant">Cargando…</main>;
  if (admin && profile.role !== "admin") return <main className="pt-40 min-h-screen px-5 md:px-20 text-error">No tienes acceso a esta sección.</main>;
  return <>{children}</>;
}
