// src/components/contexts/AuthContext.jsx (o similar)
import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const api = axios.create({
    baseURL: "http://localhost:8000/api",
  });

  api.interceptors.request.use((config) => {
    const token = localStorage.getItem("access");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  });

  const refreshUser = async () => {
    try {
      const res = await api.get("/usuarios/me/");
      setUser(res.data); // ← aquí llega { id, username, email, first_name, last_name, perfil: { telefono, fecha_nacimiento, foto, ... } }
    } catch (error) {
      console.log("Error cargando el usuario", error);
    }
  };

  const tryRefresh = async () => {
    const refresh = localStorage.getItem("refresh");
    if (!refresh) {
      setLoading(false);
      return;
    }

    try {
      const res = await axios.post(
        "http://localhost:8000/api/usuarios/refresh/",
        { refresh }
      );

      localStorage.setItem("access", res.data.access);

      await refreshUser();
    } catch (error) {
      console.log("Error al refrescar token", error);
      setUser(null);
    }

    setLoading(false);
  };

  useEffect(() => {
    tryRefresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const login = async (username, password) => {
    const res = await api.post("/usuarios/login/", { username, password });

    localStorage.setItem("access", res.data.access);
    localStorage.setItem("refresh", res.data.refresh);

    // EN LUGAR DE setUser(res.data.user) → que no tiene perfil ni foto
    await refreshUser();
  };

  const logout = () => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
        api,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
