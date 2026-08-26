import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/components/contexts/AuthContext";
import { useTheme } from "@/components/contexts/ThemeContext";
import { Menu, X, Sun, Moon } from "lucide-react";

export default function NavBar() {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen((v) => !v);
  const closeMenu = () => setIsMenuOpen(false);

  const links = [
    { href: "/", label: "Inicio" },
    { href: "/producto", label: "Productos" },
    { href: "/nosotros", label: "Sobre Nosotros" },
    { href: "/contacto", label: "Contacto" },
  ];

  return (
    <nav className="fixed top-0 inset-x-0 z-50 bg-black/70 backdrop-blur-md text-white border-b border-neutral-800">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-10">
        {/* LOGO */}
        <Link href="/" onClick={closeMenu}>
          <h1 className="text-lg sm:text-xl font-serif tracking-wide cursor-pointer">
            ShopTecnology
          </h1>
        </Link>

        {/* LINKS — desktop */}
        <ul className="hidden lg:flex items-center gap-8 uppercase text-sm tracking-wider">
          {links.map(({ href, label }) => (
            <li
              key={href}
              className="hover:underline hover:underline-offset-4 cursor-pointer"
            >
              <Link href={href}>{label}</Link>
            </li>
          ))}

          {!user ? (
            <>
              <li className="hover:underline hover:underline-offset-4 cursor-pointer">
                <Link href="/login">Login</Link>
              </li>
              <li className="hover:text-neutral-300 cursor-pointer">
                <Link href="/registro">Registro</Link>
              </li>
            </>
          ) : (
            <>
              <li className="hover:underline hover:underline-offset-4 cursor-pointer">
                <Link href="/configuracion">Mi cuenta</Link>
              </li>
              <li
                onClick={logout}
                className="text-red-400 hover:text-red-300 cursor-pointer"
              >
                Cerrar Sesión
              </li>
            </>
          )}
        </ul>

        <div className="flex items-center gap-1 sm:gap-2">
          {/* TOGGLE MODO CLARO / OSCURO */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full text-neutral-300 hover:text-white hover:bg-white/10 transition"
            aria-label={
              theme === "dark" ? "Cambiar a modo claro" : "Cambiar a modo oscuro"
            }
          >
            {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
          </button>

          {/* ICONO DE MENÚ PARA DISPOSITIVOS MÓVILES */}
          <button
            onClick={toggleMenu}
            className="lg:hidden -mr-2 p-2 text-white"
            aria-label={isMenuOpen ? "Cerrar menú" : "Abrir menú"}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* MENÚ DESPLEGABLE — mobile / tablet */}
      {isMenuOpen && (
        <div className="lg:hidden border-t border-neutral-800 bg-black/95 backdrop-blur-md px-4 sm:px-6">
          <ul className="flex flex-col divide-y divide-neutral-800/60 uppercase text-sm tracking-wider">
            {links.map(({ href, label }) => (
              <li key={href}>
                <Link href={href} onClick={closeMenu} className="block py-3.5">
                  {label}
                </Link>
              </li>
            ))}

            {!user ? (
              <>
                <li>
                  <Link href="/login" onClick={closeMenu} className="block py-3.5">
                    Login
                  </Link>
                </li>
                <li>
                  <Link href="/registro" onClick={closeMenu} className="block py-3.5">
                    Registro
                  </Link>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link href="/configuracion" onClick={closeMenu} className="block py-3.5">
                    Mi cuenta
                  </Link>
                </li>
                <li>
                  <button
                    onClick={() => {
                      closeMenu();
                      logout();
                    }}
                    className="w-full text-left py-3.5 text-red-400"
                  >
                    Cerrar Sesión
                  </button>
                </li>
              </>
            )}
          </ul>
        </div>
      )}
    </nav>
  );
}
