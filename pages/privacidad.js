// pages/privacidad.js
import NavBar from "@/components/ui/NavBar";
import Footer from "@/components/ui/Footer";

export default function Privacidad() {
  return (
    <div className="min-h-screen flex flex-col bg-black text-neutral-200">
      <NavBar />

      <main className="flex-1 pt-28 pb-20 px-6 max-w-4xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-serif mb-6">
          Política de Privacidad
        </h1>

        <p className="text-neutral-400 leading-relaxed mb-4">
          Tu privacidad es importante para nosotros. Este documento explica cómo
          recopilamos, usamos y protegemos tu información personal.
        </p>

        <h2 className="text-xl mb-2">Datos que recopilamos</h2>
        <p className="text-neutral-400 leading-relaxed">
          Nombre, correo, teléfono, información de pedidos y dirección de envío.
        </p>

        <h2 className="text-xl mt-6 mb-2">Uso de la información</h2>
        <p className="text-neutral-400 leading-relaxed">
          Utilizamos tu información únicamente para procesar tus compras,
          mejorar tu experiencia y enviarte notificaciones relevantes.
        </p>

        <h2 className="text-xl mt-6 mb-2">Protección de la información</h2>
        <p className="text-neutral-400 leading-relaxed">
          Tomamos medidas de seguridad para proteger tus datos y nunca los
          vendemos a terceros.
        </p>
      </main>

    </div>
  );
}
