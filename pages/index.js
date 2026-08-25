import Link from 'next/link'

export default function Home() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-black text-white">
      <section className="text-center space-y-6 px-4 animate-fade-in-up">
        <p className="tracking-[0.3em] text-xs uppercase text-zinc-400">
          Bienvenido a
        </p>

        <h1 className="font-serif text-5xl md:text-6xl">
          SHOPTECNOLOGY
        </h1>

        <p className="mx-auto max-w-md text-sm md:text-base text-zinc-400">
          Tecnología que te acompaña todos los días: audio, energía y accesorios
          para tus dispositivos.
        </p>

        <div className="pt-4">
          <Link href="/inicio" className="inline-block">
            <button
              className="rounded-full border border-white/70 px-8 py-2 text-xs md:text-sm uppercase tracking-[0.25em]
                         hover:bg-white hover:text-black transition-all duration-300"
            >
              Explorar tecnología
            </button>
          </Link>
        </div>
      </section>
    </main>
  )
}

