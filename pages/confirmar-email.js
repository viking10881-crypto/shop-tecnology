// Frontend/pages/confirmar-email.js
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { verifyEmail, resendVerificationCode } from "@/utils/api";

export default function ConfirmarEmail() {
  const router = useRouter();
  const { email: emailFromQuery } = router.query;

  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [estado, setEstado] = useState("idle"); // idle | validando | ok | error
  const [mensaje, setMensaje] = useState("");
  const [resendMsg, setResendMsg] = useState("");

  useEffect(() => {
    if (typeof emailFromQuery === "string") setEmail(emailFromQuery);
  }, [emailFromQuery]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setEstado("validando");
    setMensaje("");
    try {
      await verifyEmail(email.trim(), code.trim());
      setEstado("ok");
      setMensaje("Tu cuenta fue confirmada. Redirigiendo...");
      setTimeout(() => router.push("/login"), 2000);
    } catch (err) {
      setEstado("error");
      setMensaje(err.message || "El código no es válido o expiró.");
    }
  };

  const handleResend = async () => {
    setResendMsg("");
    try {
      const data = await resendVerificationCode(email.trim());
      setResendMsg(data?.message || "Código reenviado. Revisa tu correo.");
    } catch (err) {
      setResendMsg(err.message || "No fue posible reenviar el código.");
    }
  };

  return (
    <div className="bg-black text-white min-h-screen flex items-center justify-center px-4 sm:px-6">
      <div className="p-6 sm:p-10 border border-neutral-700 bg-black/60 backdrop-blur-xl max-w-md w-full">
        <h1 className="text-2xl font-serif mb-2 text-center">Confirma tu cuenta</h1>
        <p className="text-sm text-neutral-400 text-center mb-6">
          Ingresa el código que enviamos a tu correo.
        </p>

        {mensaje && (
          <p className={`text-center mb-4 text-sm ${estado === "ok" ? "text-emerald-400" : "text-red-400"}`}>
            {mensaje}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm text-neutral-400">Correo</label>
            <input
              type="email"
              value={email}
              required
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-black border border-neutral-700 px-4 py-3 mt-1 focus:border-white outline-none"
            />
          </div>

          <div>
            <label className="text-sm text-neutral-400">Código de verificación</label>
            <input
              type="text"
              value={code}
              required
              onChange={(e) => setCode(e.target.value)}
              className="w-full bg-black border border-neutral-700 px-4 py-3 mt-1 focus:border-white outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={estado === "validando"}
            className="w-full border border-white py-3 hover:bg-white hover:text-black transition-all tracking-wide disabled:opacity-50"
          >
            {estado === "validando" ? "Verificando..." : "Confirmar cuenta"}
          </button>
        </form>

        <div className="text-center mt-6 text-sm text-neutral-400">
          <button onClick={handleResend} className="underline hover:text-white">
            Reenviar código
          </button>
          {resendMsg && <p className="mt-2 text-neutral-500">{resendMsg}</p>}
        </div>

        <div className="text-center mt-4">
          <Link href="/login" className="text-neutral-500 hover:text-white underline text-sm">
            Volver a inicio de sesión
          </Link>
        </div>
      </div>
    </div>
  );
}
