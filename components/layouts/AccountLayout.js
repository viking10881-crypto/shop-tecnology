// components/layouts/AccountLayout.js
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function AccountLayout({
  title,
  subtitle,
  backHref,
  backLabel = "Volver",
  children,
}) {
  return (
    <div className="min-h-screen bg-black text-neutral-50 px-5 pt-24 pb-10">
      <div className="max-w-3xl mx-auto">
        {/* Botón volver */}
        <div className="flex items-center gap-3 mb-4">
          <Link
            href={backHref}
            className="inline-flex items-center gap-2 text-sm text-neutral-400 hover:text-neutral-100 transition-colors"
          >
            <ArrowLeft size={18} />
            <span>{backLabel}</span>
          </Link>
        </div>

        {/* Header */}
        <header className="mb-8">
          <h1 className="text-2xl font-semibold tracking-wide">{title}</h1>
          {subtitle && (
            <p className="text-sm text-neutral-400 mt-1">{subtitle}</p>
          )}
        </header>

        {/* Contenido */}
        {children}
      </div>
    </div>
  );
}
