// pages/contacto.js
import { FaWhatsapp } from "react-icons/fa";
import { ArrowUpRight } from "lucide-react";

const WHATSAPP_NUMBER = "573052789959";
const WHATSAPP_MESSAGE =
  "¡Hola! Vengo desde la página de ShopTecnology y quiero hacerte una consulta 😊";
const WHATSAPP_LINK = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
  WHATSAPP_MESSAGE
)}`;

export default function Contacto() {
  return (
    <div className="min-h-screen bg-black text-neutral-200">
      <main className="pt-28 pb-20 px-6 max-w-3xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-serif mb-4">Contacto</h1>
        <p className="text-neutral-400 leading-relaxed mb-10 max-w-xl">
          ¿Tienes dudas sobre un producto, tu pedido o cualquier otra cosa?
          Escríbenos por WhatsApp — es la forma más rápida de que te
          respondamos.
        </p>

        <a
          href={WHATSAPP_LINK}
          target="_blank"
          rel="noopener noreferrer"
          className="group flex items-center gap-4 sm:gap-5 rounded-2xl border border-white/10 bg-neutral-900/60 p-5 sm:p-6 hover:border-emerald-400/40 hover:bg-neutral-900 transition"
        >
          <div className="flex h-12 w-12 sm:h-14 sm:w-14 shrink-0 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-400 group-hover:bg-emerald-500/20 transition">
            <FaWhatsapp size={26} />
          </div>

          <div className="flex-1 min-w-0">
            <p className="text-[11px] uppercase tracking-[0.22em] text-neutral-500 mb-1">
              WhatsApp
            </p>
            <p className="text-lg text-neutral-100 font-medium">
              +57 305 278 9959
            </p>
            <p className="text-sm text-neutral-500 mt-1">
              Toca para escribirnos directo
            </p>
          </div>

          <ArrowUpRight
            className="text-neutral-500 group-hover:text-emerald-400 transition shrink-0"
            size={20}
          />
        </a>

        <p className="text-xs text-neutral-600 mt-8">
          Normalmente respondemos el mismo día.
        </p>
      </main>
    </div>
  );
}
