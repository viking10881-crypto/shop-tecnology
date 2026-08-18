// Frontend/pages/confirmar-email.js
import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";

export default function ConfirmarEmail() {
  const router = useRouter();
  const { token } = router.query;

  const [estado, setEstado] = useState("validando"); // validando | ok | error

  useEffect(() => {
    if (!token) return;

    axios
      .get(`http://localhost:8000/api/usuarios/confirmar-email/?token=${token}`)
      .then(() => {
        setEstado("ok");
        setTimeout(() => router.push("/login"), 2500);
      })
      .catch(() => setEstado("error"));
  }, [token]);

  let mensaje = "Validando tu email...";
  if (estado === "ok") mensaje = "✔ Tu cuenta fue confirmada. Redirigiendo...";
  if (estado === "error") mensaje = "❌ El enlace no es válido o expiró.";

  return (
    <div className="bg-black text-white min-h-screen flex items-center justify-center">
      <div className="p-10 border border-neutral-700 bg-black/60 backdrop-blur-xl max-w-md w-full text-center">
        <h1 className="text-lg">{mensaje}</h1>
      </div>
    </div>
  );
}
