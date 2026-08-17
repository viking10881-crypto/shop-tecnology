// components/layouts/PageLayout.js
import { useRouter } from "next/router";
import TriangleLoader from "@/components/ui/TriangleLoader";
import NavBar from "@/components/ui/NavBar";
import Footer from "@/components/ui/Footer";
import FloatingCart from "@/components/cart/FloatingCart";

// Rutas que NO deben usar layout global (sin NavBar, sin Footer, sin flotante)
const NO_LAYOUT_ROUTES = ["/"]; // Landing Luxu & Co.

// Rutas que SÍ usan layout, pero SIN FloatingCart
const NO_FLOATING_CART_ROUTES = [
  "/carrito",
  "/checkout",
  "/checkout/resultado-wompi", // si la tienes
  "/login",
  "/registro",
  // añade aquí cualquier otra ruta donde no quieras el flotante
];

export default function PageLayout({ children }) {
  const router = useRouter();
  const pathname = router.pathname || "";

  // 1) Páginas sin layout
  if (NO_LAYOUT_ROUTES.includes(pathname)) {
    return <>{children}</>;
  }

  const mostrarFloatingCart = !NO_FLOATING_CART_ROUTES.includes(pathname);

  // 2) Layout normal
  return (
    <>
      {/* Loader global con triangulito */}
      <TriangleLoader />

      <div className="min-h-screen flex flex-col">
        {/* Header */}
        <NavBar />

        {/* Contenido principal */}
        <main className="flex-1">{children}</main>

        {/* Footer global */}
        <Footer />

        {/* Carrito flotante global (condicional) */}
        {mostrarFloatingCart && <FloatingCart />}
      </div>
    </>
  );
}
