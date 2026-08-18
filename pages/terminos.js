// pages/terminos.js
import NavBar from "@/components/ui/NavBar";
import Footer from "@/components/ui/Footer";

export default function Terminos() {
  return (
    <div className="min-h-screen flex flex-col bg-black text-neutral-200">
      <NavBar />

      <main className="flex-1 pt-28 pb-20 px-6 max-w-4xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-serif mb-6">
          Términos y Condiciones
        </h1>

        <p className="text-neutral-400 leading-relaxed mb-4">
          Al usar este sitio aceptas los términos descritos a continuación. Estos
          pueden actualizarse en cualquier momento sin previo aviso.
        </p>

        <h2 className="text-xl font-semibold mt-6 mb-2">Uso del sitio</h2>
        <p className="text-neutral-400 leading-relaxed">
          Este sitio es exclusivamente para uso personal. Está prohibida la
          reproducción, distribución o venta de cualquier contenido sin permiso
          escrito.
        </p>

        <h2 className="text-xl font-semibold mt-6 mb-2">Compras y pedidos</h2>
        <p className="text-neutral-400 leading-relaxed">
          Todas las compras están sujetas a disponibilidad de inventario y
          verificación de pago.
        </p>

        <h2 className="text-xl font-semibold mt-6 mb-2">Limitación de responsabilidad</h2>
        <p className="text-neutral-400 leading-relaxed">
          ShopTecnology no se responsabiliza por daños derivados del uso del sitio
          o fallas externas de terceros.
        </p>
      </main>
    </div>
  );
}
