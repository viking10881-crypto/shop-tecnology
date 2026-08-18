// pages/usuario/cuenta.js
import Link from "next/link";
import { User, MapPin, Shield, CreditCard, LogOut } from "lucide-react";
import withAuth from "../../utils/withAuth";
import { useAuth } from "@/components/contexts/AuthContext";
import AccountLayout from "@/components/layouts/AccountLayout";

function CuentaPage() {
  const { user, logout } = useAuth();

  const fullName = `${user?.first_name || "Usuario"} ${
    user?.last_name || ""
  }`.trim();

  return (
    <AccountLayout
      title="Cuenta ShopTecnology"
      subtitle="Revisa y actualiza tus datos personales, direcciones, seguridad y métodos de pago."
      backHref="/configuracion"
      backLabel="Configuración"
    >
      {/* TARJETA PERFIL */}
      <section className="bg-neutral-900/60 border border-neutral-800 rounded-2xl px-6 py-5 flex flex-col sm:flex-row sm:items-center gap-5 mb-10">
        <div className="w-24 h-24 rounded-full overflow-hidden border border-neutral-700 mx-auto sm:mx-0">
          <img
            src={user?.perfil?.foto || "/img/profile.jpg"}
            className="w-full h-full object-cover"
            alt="Foto de perfil"
          />
        </div>

        <div className="flex-1 text-center sm:text-left space-y-1">
          <h2 className="text-xl font-semibold">{fullName}</h2>

          <p className="text-sm text-neutral-400">
            @{user?.username || "username"}
          </p>

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

            <CuentaItem href="../configuracion/direcciones" label="Direcciones">
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
            <CuentaItem href="/cuenta/seguridad" label="Seguridad de la cuenta">
              <Shield size={20} className="text-neutral-400" />
            </CuentaItem>
          </div>
        </section>

        {/* Bloque: Pagos y sesión */}
        <section>
          <h3 className="text-xs tracking-[0.22em] uppercase text-neutral-500 mb-2">
            Pagos y sesión
          </h3>
          <div className="bg-neutral-900/60 border border-neutral-800 rounded-2xl divide-y divide-neutral-800">
            <CuentaItem href="/cuenta/pago" label="Métodos de pago">
              <CreditCard size={20} className="text-neutral-400" />
            </CuentaItem>

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

export default withAuth(CuentaPage);
