// pages/configuracion/index.js
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import withAuth from "../../utils/withAuth";
import { useAuth } from "@/components/contexts/AuthContext";
import AccountLayout from "@/components/layouts/AccountLayout";

function initials(name) {
  if (!name) return "U";
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join("");
}

function ConfiguracionPage() {
  const { user } = useAuth();

  const fullName = user?.name || "Usuario";

  return (
    <AccountLayout
      title="Configuración"
      subtitle="Gestiona tu cuenta, pedidos y preferencias dentro de ShopTecnology"
      backHref="/inicio"
      backLabel="Inicio"
    >
      {/* Tarjeta perfil resumida */}
      <Link href="/usuario/cuenta">
        <div className="mt-2 bg-neutral-900/60 border border-neutral-800 rounded-2xl p-5 flex items-center gap-5 hover:bg-neutral-900 transition-all cursor-pointer">
          {user?.avatar_url ? (
            <img
              src={user.avatar_url}
              alt="Foto de perfil"
              className="w-16 h-16 rounded-full object-cover border border-neutral-700"
            />
          ) : (
            <div className="w-16 h-16 rounded-full flex items-center justify-center bg-white/10 border border-neutral-700 text-lg font-semibold">
              {initials(fullName)}
            </div>
          )}

          <div className="flex-1">
            <h2 className="text-lg font-semibold tracking-wide">{fullName}</h2>
            <p className="text-sm text-neutral-400">
              Configuración de cuenta, seguridad y pago
            </p>
          </div>

          <ChevronRight className="text-neutral-500" size={20} />
        </div>
      </Link>

      {/* SECCIONES */}
      <div className="mt-10 space-y-6">
        {/* Sección: Tu actividad */}
        <div>
          <h3 className="text-xs tracking-[0.22em] uppercase text-neutral-500 mb-2">
            Tu actividad
          </h3>

          <div className="bg-neutral-900/50 border border-neutral-800 rounded-xl divide-y divide-neutral-800">
            <ConfigItem href="/pedidos" label="Tus pedidos" />
            <ConfigItem href="/carrito" label="Carrito" />
          </div>
        </div>

        {/* Sección: Cuenta y soporte */}
        <div>
          <h3 className="text-xs tracking-[0.22em] uppercase text-neutral-500 mb-2">
            Cuenta y soporte
          </h3>

          <div className="bg-neutral-900/50 border border-neutral-800 rounded-xl divide-y divide-neutral-800">
            <ConfigItem href="/usuario/cuenta" label="Administrar cuenta" />
            <ConfigItem href="/ayuda" label="Centro de ayuda" />
          </div>
        </div>
      </div>
    </AccountLayout>
  );
}

function ConfigItem({ href, label }) {
  return (
    <Link
      href={href}
      className="flex justify-between items-center p-4 hover:bg-neutral-800/40 transition cursor-pointer"
    >
      <span className="text-sm tracking-wide">{label}</span>
      <ChevronRight size={18} className="text-neutral-500" />
    </Link>
  );
}

export default withAuth(ConfiguracionPage);
