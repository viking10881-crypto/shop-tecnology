// components/layouts/StoreLayout.js
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/router";

export default function StoreLayout({
  title,
  subtitle,
  backHref,
  backLabel = "Volver",
  children,
}) {
  const router = useRouter();

  const handleBackClick = (event) => {
    // Si NO hay backHref, usamos router.back()
    if (!backHref) {
      event.preventDefault();
      router.back();
    }
  };

  const href = backHref || "#";

  return (
    <div className="min-h-screen bg-black text-neutral-50 px-5 pt-24 pb-10">
      <div className="max-w-6xl mx-auto">
        {/* Botón volver */}
        <div className="flex items-center gap-3 mb-6">
          <Link
            href={href}
            onClick={handleBackClick}
            className="inline-flex items-center gap-2 text-sm text-neutral-400 hover:text-neutral-100 transition-colors"
          >
            <ArrowLeft size={18} />
            <span>{backLabel}</span>
          </Link>
        </div>

        {/* Header opcional */}
        {(title || subtitle) && (
          <header className="mb-8">
            {title && (
              <h1 className="text-2xl md:text-3xl font-semibold tracking-wide">
                {title}
              </h1>
            )}
            {subtitle && (
              <p className="text-sm text-neutral-400 mt-2 max-w-2xl">
                {subtitle}
              </p>
            )}
          </header>
        )}

        {/* Contenido */}
        {children}
      </div>
    </div>
  );
}
