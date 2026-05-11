"use client";

import { useEffect, useState } from "react";
import InventoryLock from "./InventoryLock";
import InventoryDashboard from "./InventoryDashboard";

const SESSION_KEY = "inv_auth";

export default function InventarioClient() {
  const [authenticated, setAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    const stored = sessionStorage.getItem(SESSION_KEY);
    setAuthenticated(stored === "1");
  }, []);

  const handleAuth = () => {
    sessionStorage.setItem(SESSION_KEY, "1");
    setAuthenticated(true);
  };

  const handleLogout = () => {
    sessionStorage.removeItem(SESSION_KEY);
    setAuthenticated(false);
  };

  if (authenticated === null) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!authenticated) {
    return <InventoryLock onSuccess={handleAuth} />;
  }

  return <InventoryDashboard onLogout={handleLogout} />;
}
