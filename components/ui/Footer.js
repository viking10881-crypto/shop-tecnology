// components/ui/Footer.js
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-neutral-900 bg-black py-8 text-[11px] text-neutral-500">
      <div className="max-w-6xl mx-auto px-6 md:px-10 space-y-5">

        {/* Marca + claim */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-neutral-400">
              ShopTecnology
            </p>
            <p className="text-[11px] text-neutral-500 mt-1">
              Tecnología, audio y accesorios para mantenerte siempre conectado.
            </p>
          </div>

          <div className="flex flex-wrap gap-4 md:justify-end uppercase tracking-[0.22em]">
            <Link
              href="/producto"
              className="hover:text-neutral-300 transition-colors"
            >
              Productos
            </Link>
            <Link
              href="/nosotros"
              className="hover:text-neutral-300 transition-colors"
            >
              Manifiesto
            </Link>
            <Link
              href="/ayuda"
              className="hover:text-neutral-300 transition-colors"
            >
              Ayuda
            </Link>
            <Link
              href="/contacto"
              className="hover:text-neutral-300 transition-colors"
            >
              Contacto
            </Link>
          </div>
        </div>

        {/* Línea inferior: legal */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 pt-3 border-t border-neutral-900">
          <span className="text-neutral-600">
            © {new Date().getFullYear()} ShopTecnology. Todos los derechos reservados.
          </span>

          <div className="flex flex-wrap gap-4 uppercase tracking-[0.22em]">
            <Link
              href="/terminos"
              className="hover:text-neutral-300 transition-colors"
            >
              Términos
            </Link>
            <Link
              href="/privacidad"
              className="hover:text-neutral-300 transition-colors"
            >
              Privacidad
            </Link>
            <Link
              href="/cookies"
              className="hover:text-neutral-300 transition-colors"
            >
              Cookies
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
