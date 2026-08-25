// pages/usuario/cuenta.js
import Link from "next/link";
import { User, MapPin, Shield, CreditCard, LogOut } from "lucide-react";
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

function CuentaPage() {
  const { user, logout } = useAuth();

  const fullName = user?.name || "Usuario";

  return (
    <AccountLayout
      title="Cuenta ShopTecnology"
      subtitle="Revisa y actualiza tus datos personales y dirección de entrega."
      backHref="/configuracion"
      backLabel="Configuración"
    >
      {/* TARJETA PERFIL */}
      <section className="bg-neutral-900/60 border border-neutral-800 rounded-2xl px-6 py-5 flex flex-col sm:flex-row sm:items-center gap-5 mb-10">
        {user?.avatar_url ? (
          <img
            src={user.avatar_url}
            alt="Foto de perfil"
            className="w-24 h-24 rounded-full object-cover border border-neutral-700 mx-auto sm:mx-0"
          />
        ) : (
          <div className="w-24 h-24 rounded-full flex items-center justify-center bg-white/10 border border-neutral-700 text-2xl font-semibold mx-auto sm:mx-0">
            {initials(fullName)}
          </div>
        )}

        <div className="flex-1 text-center sm:text-left space-y-1">
          <h2 className="text-xl font-semibold">{fullName}</h2>

          {user?.email && (
            <p className="text-sm text-neutral-300">{user.email}</p>
          )}

          <p className="text-xs text-neutral-500 mt-1 uppercase tracking-[0.18em]">
            Cliente ShopTecnology.
          </p>
        </div>
      </section>

      {/* BLOQUES DE OPCIONES */}
      <div className="space-y-8">
        {/* Bloque: Cuenta */}
        <section>
          <h3 className="text-xs tracking-[0.22em] uppercase text-neutral-500 mb-2">
            Cuenta
          </h3>
          <div className="bg-neutral-900/60 border border-neutral-800 rounded-2xl divide-y divide-neutral-800">
            <CuentaItem href="/usuario/perfilinfo" label="Información personal">
              <User size={20} className="text-neutral-400" />
            </CuentaItem>

            <CuentaItem href="/usuario/perfilinfo" label="Dirección de entrega">
              <MapPin size={20} className="text-neutral-400" />
            </CuentaItem>
          </div>
        </section>

        {/* Bloque: Seguridad */}
        <section>
          <h3 className="text-xs tracking-[0.22em] uppercase text-neutral-500 mb-2">
            Seguridad
          </h3>
          <div className="bg-neutral-900/60 border border-neutral-800 rounded-2xl divide-y divide-neutral-800">
            <CuentaItemDisabled label="Seguridad de la cuenta">
              <Shield size={20} className="text-neutral-600" />
            </CuentaItemDisabled>
          </div>
        </section>

        {/* Bloque: Pagos y sesión */}
        <section>
          <h3 className="text-xs tracking-[0.22em] uppercase text-neutral-500 mb-2">
            Pagos y sesión
          </h3>
          <div className="bg-neutral-900/60 border border-neutral-800 rounded-2xl divide-y divide-neutral-800">
            <CuentaItemDisabled label="Métodos de pago">
              <CreditCard size={20} className="text-neutral-600" />
            </CuentaItemDisabled>

            <button
              onClick={logout}
              className="w-full flex items-center justify-between px-4 py-4 text-sm text-red-500 hover:bg-red-500/10 transition-colors rounded-b-2xl"
            >
              <span className="text-[0.95rem] tracking-wide">
                Cerrar sesión
              </span>
              <LogOut size={20} />
            </button>
          </div>
        </section>
      </div>
    </AccountLayout>
  );
}

function CuentaItem({ href, label, children }) {
  return (
    <Link
      href={href}
      className="flex items-center justify-between px-4 py-4 hover:bg-neutral-800/40 transition-colors cursor-pointer"
    >
      <span className="text-[0.95rem] tracking-wide">{label}</span>
      {children}
    </Link>
  );
}

function CuentaItemDisabled({ label, children }) {
  return (
    <div className="flex items-center justify-between px-4 py-4 opacity-50 cursor-not-allowed">
      <span className="text-[0.95rem] tracking-wide">{label}</span>
      <div className="flex items-center gap-3">
        <span className="text-[10px] uppercase tracking-[0.15em] text-neutral-500 border border-neutral-700 rounded-full px-2 py-0.5">
          Próximamente
        </span>
        {children}
      </div>
    </div>
  );
}

export default withAuth(CuentaPage);
