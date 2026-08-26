// Frontend/pages/reset-password.js
import { useState } from "react";
import axios from "axios";
import Link from "next/link";

export default function ResetPassword() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const sendRequest = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // 1) Pedimos al backend el enlace de reset
      const res = await axios.post(
        "http://localhost:8000/api/auth/password-reset/",
        { email }
      );

      const resetUrl = res.data?.reset_url;

      // 2) Enviamos el email usando Brevo vía API interna de Next
      if (resetUrl) {
        await axios.post("/api/email/send-reset-password", {
          to: email,
          link: resetUrl,
        });
      }

      setSent(true);
    } catch (err) {
      console.error(err);
      setError("Ocurrió un problema al procesar la solicitud.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-black text-white min-h-screen flex items-center justify-center px-4 sm:px-6">
      <div className="max-w-md w-full border border-neutral-800 p-6 sm:p-10 bg-black/60 backdrop-blur-xl">
        <h1 className="text-4xl font-serif mb-6 tracking-wide text-center">
          Recuperar Contraseña
        </h1>

        {error && (
          <p className="text-red-400 text-center text-sm mb-4">{error}</p>
        )}

        {!sent ? (
          <form onSubmit={sendRequest} className="space-y-6">
            <div>
              <label className="text-sm text-neutral-400">Correo</label>
              <input
                type="email"
                required
                className="w-full bg-black border border-neutral-700 px-4 py-3 mt-1 focus:border-white outline-none"
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full border border-white py-3 hover:bg-white hover:text-black transition-all tracking-wide disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Enviando..." : "Enviar enlace"}
            </button>
          </form>
        ) : (
          <p className="text-center text-neutral-300 text-sm">
            Si el correo existe, te enviamos un enlace para recuperar tu
            contraseña.
          </p>
        )}

        <div className="text-center mt-6">
          <Link
            href="/login"
            className="text-neutral-500 hover:text-white underline"
          >
            Volver al login
          </Link>
        </div>
      </div>
    </div>
  );
}
