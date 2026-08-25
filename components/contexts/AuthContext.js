// src/components/contexts/AuthContext.jsx (o similar)
import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

function isTokenExpired(token, bufferSeconds = 30) {
  if (!token) return true;
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    if (!payload?.exp) return false;
    return Date.now() >= payload.exp * 1000 - bufferSeconds * 1000;
  } catch {
    return true;
  }
}

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
    const session = {
      ...profile,
      token: payload?.token || null,
      refreshToken: payload?.refreshToken || null,
    };
    // store lightweight session locally (incluye el JWT para llamadas autenticadas)
    localStorage.setItem("shoptecnology-user", JSON.stringify(session));
    setUser(session);
    return session;
  };

  // El access token dura 15 min. refreshAccessToken() lo renueva con el
  // refreshToken (dura 7 dias) sin pedirle contraseña de nuevo al usuario.
  const refreshAccessToken = async () => {
    const current = JSON.parse(localStorage.getItem("shoptecnology-user") || "null");
    if (!current?.refreshToken) {
      throw new Error("Tu sesión expiró, vuelve a iniciar sesión.");
    }

    const res = await fetch("/api/delasoft/auth/refresh", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken: current.refreshToken }),
    });
    const payload = await res.json().catch(() => null);

    if (!res.ok || !payload?.data?.accessToken) {
      localStorage.removeItem("shoptecnology-user");
      setUser(null);
      throw new Error(payload?.message || "Tu sesión expiró, vuelve a iniciar sesión.");
    }

    const next = { ...current, token: payload.data.accessToken };
    localStorage.setItem("shoptecnology-user", JSON.stringify(next));
    setUser(next);
    return next.token;
  };

  // Llamalo antes de cualquier fetch autenticado en vez de leer user.token
  // directo: renueva el token solo si ya esta vencido o a punto de vencer.
  const getToken = async () => {
    const current = JSON.parse(localStorage.getItem("shoptecnology-user") || "null");
    if (!current?.token) {
      throw new Error("Tu sesión expiró, vuelve a iniciar sesión.");
    }
    if (!isTokenExpired(current.token)) return current.token;
    return refreshAccessToken();
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
        getToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
