import { useState } from "react";
import { useAuth } from "@/components/contexts/AuthContext";
import { useRouter } from "next/router";
import Link from "next/link";

export default function Login() {
  const { login } = useAuth();
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(username, password);
      router.push("/inicio");
    } catch {
      setError("Credenciales incorrectas.");
    }
  };

  return (
    <div className="bg-black text-white min-h-screen flex items-center justify-center px-6">
      <div className="max-w-md w-full border border-neutral-800 p-10 bg-black/60 backdrop-blur-xl">
        <h1 className="text-4xl font-serif mb-6 tracking-wide text-center">
          Iniciar Sesión
        </h1>

        {error && (
          <p className="text-red-400 text-center mb-4">{error}</p>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="text-sm text-neutral-400">Usuario</label>
            <input
              type="text"
              className="w-full bg-black border border-neutral-700 px-4 py-3 mt-1 focus:border-white outline-none"
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <div>
            <label className="text-sm text-neutral-400">Contraseña</label>
            <input
              type="password"
              className="w-full bg-black border border-neutral-700 px-4 py-3 mt-1 focus:border-white outline-none"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            className="w-full border border-white py-3 hover:bg-white hover:text-black transition-all tracking-wide"
          >
            Entrar
          </button>
        </form>

        <div className="text-center mt-6 text-neutral-400">
          ¿No tienes cuenta?
          <Link href="/registro" className="text-white ml-2 underline">
            Crear cuenta
          </Link>
        </div>

        <div className="text-center mt-2">
          <Link href="/reset-password" className="text-neutral-500 hover:text-white underline text-sm">
            ¿Olvidaste tu contraseña?
          </Link>
        </div>
      </div>
    </div>
  );
}
