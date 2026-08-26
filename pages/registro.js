import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { registerCustomer } from "@/utils/api";

export default function Registro() {
  const router = useRouter();

  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    cedula: "",
    phone: "",
    password: "",
    password2: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (form.password !== form.password2) {
      setError("Las contraseñas no coinciden");
      return;
    }

    try {
      const data = await registerCustomer({
        name: `${form.first_name.trim()} ${form.last_name.trim()}`.trim(),
        email: form.email.trim(),
        cedula: form.cedula.trim(),
        phone: form.phone.trim(),
        password: form.password,
      });
      setSuccess(data?.message || "Cuenta creada. Revisa tu correo para verificarla.");
      setTimeout(() => {
        router.push(`/confirmar-email?email=${encodeURIComponent(form.email.trim())}`);
      }, 1800);
    } catch (err) {
      setError(err.message || "No fue posible crear la cuenta.");
    }
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_#f4f4f5_0,_#ffffff_42rem,_#fafafa_100%)] dark:bg-[radial-gradient(circle_at_top,_#1f2937_0,_#030712_42rem,_#000_100%)] text-white px-4 py-28 sm:px-6 sm:py-32">
      <div className="mx-auto w-full max-w-2xl rounded-3xl border border-white/10 bg-black/70 p-6 shadow-2xl shadow-black/40 backdrop-blur-xl sm:p-10">
        <div className="mb-8 text-center">
          <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.28em] text-cyan-300">ShopTecnology</p>
          <h1 className="font-serif text-3xl tracking-wide sm:text-4xl">Crea tu cuenta</h1>
          <p className="mt-2 text-sm text-neutral-400">Compra más rápido y consulta tus pedidos desde un solo lugar.</p>
        </div>

        {error && <p className="text-red-400 text-center mb-4">{error}</p>}
        {success && <p className="mb-4 rounded-xl border border-emerald-400/30 bg-emerald-400/10 px-4 py-3 text-center text-sm text-emerald-200">{success}</p>}

        <form onSubmit={handleRegister} className="grid grid-cols-1 gap-5 sm:grid-cols-2">

          <div>
            <label className="text-sm text-neutral-300">Nombre</label>
            <input
              name="first_name"
              type="text"
              value={form.first_name}
              required
              className="mt-1.5 w-full rounded-xl border border-neutral-700 bg-black/50 px-4 py-3 text-sm outline-none transition focus:border-cyan-300 focus:ring-2 focus:ring-cyan-300/10"
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="text-sm text-neutral-300">Apellido</label>
            <input
              name="last_name"
              type="text"
              value={form.last_name}
              required
              className="mt-1.5 w-full rounded-xl border border-neutral-700 bg-black/50 px-4 py-3 text-sm outline-none transition focus:border-cyan-300 focus:ring-2 focus:ring-cyan-300/10"
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="text-sm text-neutral-300">Correo</label>
            <input
              name="email"
              type="email"
              value={form.email}
              required
              autoComplete="email"
              className="mt-1.5 w-full rounded-xl border border-neutral-700 bg-black/50 px-4 py-3 text-sm outline-none transition focus:border-cyan-300 focus:ring-2 focus:ring-cyan-300/10"
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="text-sm text-neutral-300">Cédula</label>
            <input
              name="cedula"
              type="text"
              value={form.cedula}
              required
              className="mt-1.5 w-full rounded-xl border border-neutral-700 bg-black/50 px-4 py-3 text-sm outline-none transition focus:border-cyan-300 focus:ring-2 focus:ring-cyan-300/10"
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="text-sm text-neutral-300">Teléfono <span className="text-neutral-500">(opcional)</span></label>
            <input
              name="phone"
              type="tel"
              value={form.phone}
              className="mt-1.5 w-full rounded-xl border border-neutral-700 bg-black/50 px-4 py-3 text-sm outline-none transition focus:border-cyan-300 focus:ring-2 focus:ring-cyan-300/10"
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="text-sm text-neutral-300">Contraseña</label>
            <input
              name="password"
              type="password"
              value={form.password}
              required
              minLength={8}
              autoComplete="new-password"
              className="mt-1.5 w-full rounded-xl border border-neutral-700 bg-black/50 px-4 py-3 text-sm outline-none transition focus:border-cyan-300 focus:ring-2 focus:ring-cyan-300/10"
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="text-sm text-neutral-300">Confirmar contraseña</label>
            <input
              name="password2"
              type="password"
              value={form.password2}
              required
              minLength={8}
              autoComplete="new-password"
              className="mt-1.5 w-full rounded-xl border border-neutral-700 bg-black/50 px-4 py-3 text-sm outline-none transition focus:border-cyan-300 focus:ring-2 focus:ring-cyan-300/10"
              onChange={handleChange}
            />
          </div>

          <p className="sm:col-span-2 -mt-2 text-xs text-neutral-500">La contraseña debe tener 8 caracteres o más, mayúscula, minúscula, número y símbolo.</p>

          <button
            type="submit"
            className="sm:col-span-2 mt-1 w-full rounded-xl bg-cyan-300 py-3 font-semibold text-slate-950 transition hover:bg-cyan-200 focus:outline-none focus:ring-2 focus:ring-cyan-100"
          >
            Registrarse
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-neutral-400">
          ¿Ya tienes cuenta?
          <Link href="/login" className="text-white ml-2 underline">
            Inicia sesión
          </Link>
        </div>
      </div>
    </div>
  );
}
