// src/components/contexts/AuthContext.jsx (o similar)
import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // This app now authenticates against the Delasoft public API via the
  // local proxy (/api/delasoft). We keep a lightweight local session by
  // storing `shoptecnology-user` in localStorage.

  const refreshUser = async () => {
    const local = localStorage.getItem("shoptecnology-user");
    if (local) {
      try {
        setUser(JSON.parse(local));
        return;
      } catch (e) {
        console.warn("Invalid local user", e);
      }
    }
    setUser(null);
  };

  const tryRefresh = async () => {
    // No token refresh flow for Delasoft public API; rely on localStorage
    await refreshUser();
    setLoading(false);
  };

  useEffect(() => {
    const localUser = localStorage.getItem("shoptecnology-user");
    if (localUser) {
      setUser(JSON.parse(localUser));
      setLoading(false);
      return;
    }
    tryRefresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const login = async (username, password) => {
    // Attempt to login via Delasoft public API using the proxy.
    // The proxy endpoint is: POST /api/delasoft/auth/login
    const res = await fetch("/api/delasoft/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: username, password }),
    });

    const payload = await res.json().catch(() => null);
    if (!res.ok) {
      const msg = payload?.message || payload?.error || "Login failed";
      throw new Error(msg);
    }

    // Delasoft responde { success, message, user: {...}, token, refreshToken }
    const profile = payload?.user || payload?.data || { email: username };
    const session = { ...profile, token: payload?.token || null };
    // store lightweight session locally (incluye el JWT para llamadas autenticadas)
    localStorage.setItem("shoptecnology-user", JSON.stringify(session));
    setUser(session);
    return session;
  };

  const updateUser = (patch) => {
    setUser((current) => {
      const next = { ...current, ...patch };
      localStorage.setItem("shoptecnology-user", JSON.stringify(next));
      return next;
    });
  };

  const logout = () => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    setUser(null);
    localStorage.removeItem("shoptecnology-user");
  };

  // La API pública de Delasoft no gestiona autenticación de clientes. Esto
  // mantiene el perfil de compra en este navegador hasta integrar un backend.
  const registerLocal = (profile) => {
    const userData = { id: `local-${Date.now()}`, ...profile };
    localStorage.setItem("shoptecnology-user", JSON.stringify(userData));
    setUser(userData);
    return userData;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
        refreshUser,
        registerLocal,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
