// pages/nosotros.js
import NavBar from "@/components/ui/NavBar";
import Footer from "@/components/ui/Footer";

export default function Nosotros() {
  return (
    <div className="min-h-screen flex flex-col bg-black text-neutral-200">
      <NavBar />

      <main className="flex-1 pt-28 pb-20 px-6 max-w-4xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-serif mb-6">
          Nuestro Manifiesto
        </h1>

        <p className="text-neutral-400 leading-relaxed mb-6">
          ShopTecnology nace del concepto de{" "}
          <span className="text-neutral-200 font-semibold">tecnología útil</span>:
          productos seleccionados para acompañar tu día a día.
        </p>

        <p className="text-neutral-400 leading-relaxed mb-6">
          Apostamos por productos confiables, accesorios funcionales y atención
          cercana. No creemos en vender por vender. Creemos
          en piezas que duren años, no semanas.
        </p>

        <p className="text-neutral-400 leading-relaxed">
          Cada categoría está pensada con intención, funcionalidad y calidad.
          Queremos acompañarte en tu propio lenguaje visual: discreto,
          elegante, auténtico.
        </p>
      </main>
    </div>
  );
}
