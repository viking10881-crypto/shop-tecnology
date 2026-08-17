import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/components/contexts/AuthContext";
import { Menu, X } from "lucide-react";  // Usamos los íconos de Menu y X

export default function NavBar() {
  const { user, logout } = useAuth();
  
  // Estado para controlar la visibilidad del menú en pantallas pequeñas
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Función para alternar el menú
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/70 backdrop-blur-md text-white px-10 py-4 flex justify-between items-center border-b border-neutral-800">
      {/* LOGO */}
      <Link href="/">
        <h1 className="text-xl font-serif tracking-wide cursor-pointer">
          Auren
        </h1>
      </Link>

      {/* ICONO DE MENÚ PARA DISPOSITIVOS MÓVILES */}
      <div className="lg:hidden">
        <button onClick={toggleMenu} className="text-white">
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />} {/* Alterna entre el ícono de menú y el de cerrar */}
        </button>
      </div>

      {/* LINKS */}
      <ul className={`lg:flex space-x-10 uppercase text-sm tracking-wider ${isMenuOpen ? "block" : "hidden"} lg:block`}>
        <li className="hover:underline hover:underline-offset-4 cursor-pointer">
          <Link href="/">Inicio</Link>
        </li>
        <li className="hover:underline hover:underline-offset-4 cursor-pointer">
          <Link href="/producto">Productos</Link>
        </li>
        <li className="hover:underline hover:underline-offset-4 cursor-pointer">
          <Link href="/nosotros">Sobre Nosotros</Link>
        </li>
        <li className="hover:underline hover:underline-offset-4 cursor-pointer">
          <Link href="/contacto">Contacto</Link>
        </li>

        {/* 🔥 AUTENTICACIÓN */}
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
          <div className="flex items-center space-x-6">
            <li className="hover:underline hover:underline-offset-4 cursor-pointer">
              <Link href="/configuracion">Mi cuenta</Link>
            </li>
            <li
              onClick={logout}
              className="text-red-400 hover:text-red-300 cursor-pointer"
            >
              Cerrar Sesión
            </li>
          </div>
        )}
      </ul>
    </nav>
  );
}
