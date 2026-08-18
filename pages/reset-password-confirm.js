// Frontend/pages/reset-password-confirm.js
import { useRouter } from "next/router";
import { useState } from "react";
import axios from "axios";

export default function ResetPasswordConfirm() {
  const router = useRouter();
  const { uid, token } = router.query;

  const [password, setPassword] = useState("");
  const [estado, setEstado] = useState("form"); // form | ok | error
  const [mensaje, setMensaje] = useState("");

  const cambiar = async (e) => {
    e.preventDefault();

    try {
      await axios.post("http://localhost:8000/api/auth/reset-password/", {
        uid,
        token,
        password,
      });
      setEstado("ok");
      setMensaje("Contraseña cambiada correctamente.");
      setTimeout(() => router.push("/login"), 2500);
    } catch (err) {
      console.error(err);
      setEstado("error");
      setMensaje("El enlace no es válido o ya expiró.");
    }
  };

  if (!uid || !token) {
    return (
      <div className="bg-black text-white min-h-screen flex items-center justify-center">
        <p className="text-neutral-400 text-sm">Validando enlace...</p>
      </div>
    );
  }

  return (
    <div className="bg-black text-white min-h-screen flex items-center justify-center px-6">
      <form
        onSubmit={cambiar}
        className="max-w-md w-full border border-neutral-800 p-10 bg-black/60 backdrop-blur-xl"
      >
        <h1 className="text-3xl font-serif mb-6 tracking-wide text-center">
          Cambiar contraseña
        </h1>

        {estado !== "form" && (
          <p
            className={`text-center mb-4 text-sm ${
              estado === "ok" ? "text-emerald-400" : "text-red-400"
            }`}
          >
            {mensaje}
          </p>
        )}

        {estado === "form" && (
          <>
            <label className="text-sm text-neutral-400">
              Nueva contraseña
            </label>
            <input
              type="password"
              required
              placeholder="Nueva contraseña"
              className="w-full bg-black border border-neutral-700 px-4 py-3 mt-1 mb-6 focus:border-white outline-none"
              onChange={(e) => setPassword(e.target.value)}
            />

            <button
              type="submit"
              className="w-full border border-white py-3 hover:bg-white hover:text-black transition-all tracking-wide"
            >
              Cambiar
            </button>
          </>
        )}
      </form>
    </div>
  );
}
