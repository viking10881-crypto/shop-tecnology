// pages/ayuda.js
import NavBar from "@/components/ui/NavBar";
import Footer from "@/components/ui/Footer";

export default function Ayuda() {
  return (
    <div className="min-h-screen flex flex-col bg-black text-neutral-200">
      <NavBar />

      <main className="flex-1 pt-28 pb-20 px-6 max-w-3xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-serif mb-8">Centro de Ayuda</h1>

        <div className="space-y-6 text-neutral-400 leading-relaxed">

          <div>
            <h2 className="text-xl text-neutral-100 mb-2">¿Dónde está mi pedido?</h2>
            <p>
              Puedes consultar el estado de tu pedido desde tu cuenta en la
              sección <strong>“Pedidos”</strong>. Si necesitas soporte adicional,
              contáctanos por WhatsApp o correo.
            </p>
          </div>

          <div>
            <h2 className="text-xl text-neutral-100 mb-2">Cambios y devoluciones</h2>
            <p>
              Aceptamos cambios dentro de los primeros 7 días calendarios luego
              de recibir tu pedido, siempre que el producto esté sin uso y con su
              empaque original.
            </p>
          </div>

          <div>
            <h2 className="text-xl text-neutral-100 mb-2">Medios de pago aceptados</h2>
            <p>
              Aceptamos pagos con Nequi, Daviplata, PSE, tarjetas débito/crédito
              y contraentrega en algunas ciudades.
            </p>
          </div>

        </div>
      </main>
    </div>
  );
}
