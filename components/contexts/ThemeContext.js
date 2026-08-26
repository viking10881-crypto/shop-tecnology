// components/contexts/ThemeContext.js
import { createContext, useContext, useEffect, useState } from "react";

const ThemeContext = createContext();
const STORAGE_KEY = "shoptecnology-theme";

export function ThemeProvider({ children }) {
  // El script inline en _document.js ya dejo la clase "dark" correcta en
  // <html> antes del primer render, para evitar el flash del tema
  // equivocado. Aqui solo leemos ese estado inicial para que React quede
  // en sync.
  const [theme, setThemeState] = useState("dark");

  useEffect(() => {
    const isDark = document.documentElement.classList.contains("dark");
    setThemeState(isDark ? "dark" : "light");
  }, []);

  const setTheme = (next) => {
    setThemeState(next);
    document.documentElement.classList.toggle("dark", next === "dark");
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch (e) {
      // localStorage no disponible (modo privado, etc.) - ignorar
    }
  };

  const toggleTheme = () => setTheme(theme === "dark" ? "light" : "dark");

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
