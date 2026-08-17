import Link from "next/link";
import { motion } from "framer-motion";

const container = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: "easeOut" },
  },
};

export default function HomeHero() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-black text-white">
      <motion.section
        initial="hidden"
        animate="visible"
        variants={container}
        className="text-center space-y-6 px-4"
      >
        <p className="tracking-[0.3em] text-xs uppercase text-zinc-400">
          Bienvenido a
        </p>

        <h1 className="font-serif text-5xl md:text-6xl">
          AUREN.
        </h1>

        <p className="mx-auto max-w-md text-sm md:text-base text-zinc-400">
          Piezas atemporales, siluetas limpias y el equilibrio perfecto
          entre lujo y minimalismo.
        </p>

        <div className="pt-4">
          <Link href="/inicio">
            <button
              className="rounded-full border border-white/70 px-8 py-2 text-xs md:text-sm uppercase tracking-[0.25em]
              hover:bg-white hover:text-black transition-all duration-300"
            >
              Entrar a nuestro universo
            </button>
          </Link>
        </div>
      </motion.section>
    </main>
  );
}
