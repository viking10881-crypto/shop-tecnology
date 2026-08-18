// pages/cookies.js
import NavBar from "@/components/ui/NavBar";
import Footer from "@/components/ui/Footer";

export default function Cookies() {
  return (
    <div className="min-h-screen flex flex-col bg-black text-neutral-200">
      <NavBar />

      <main className="flex-1 pt-28 pb-20 px-6 max-w-4xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-serif mb-6">
          Política de Cookies
        </h1>

        <p className="text-neutral-400 leading-relaxed mb-4">
          Utilizamos cookies para mejorar tu experiencia, analizar el tráfico del
          sitio y recordar tus preferencias.
        </p>

        <h2 className="text-xl mb-2">¿Qué son las cookies?</h2>
        <p className="text-neutral-400 leading-relaxed">
          Son pequeños archivos almacenados en tu navegador que nos permiten
          mejorar cómo navegas en nuestro sitio.
        </p>

        <h2 className="text-xl mt-6 mb-2">Cómo las usamos</h2>
        <ul className="text-neutral-400 leading-relaxed list-disc ml-6 space-y-1">
          <li>Recordar tu sesión e idioma</li>
          <li>Analizar rendimiento del sitio</li>
          <li>Personalizar contenido y recomendaciones</li>
        </ul>

        <h2 className="text-xl mt-6 mb-2">Desactivar cookies</h2>
        <p className="text-neutral-400 leading-relaxed">
          Puedes desactivar las cookies desde la configuración de tu navegador,
          pero algunas funciones del sitio podrían dejar de funcionar.
        </p>
      </main>

    </div>
  );
}
