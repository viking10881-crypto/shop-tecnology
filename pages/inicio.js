// pages/index.js o pages/inicio.js
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import delasoftFetch from "@/lib/delasoftClient";

export default function Inicio({ colecciones = [], banners = [], manifesto = null }) {
  const fallbackBanners = [
    {
      id: 1,
      image:
        "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=1800&q=85",
      title: "Tecnología para tu día",
      description:
        "Celulares, accesorios y conectividad para mantenerte siempre listo.",
      badge: "Novedades",
    },
    {
      id: 2,
      image:
        "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?auto=format&fit=crop&w=1800&q=85",
      title: "Audio sin límites",
      description: "Audífonos y bafles para disfrutar cada momento.",
      badge: "Audio",
    },
    {
      id: 3,
      image:
        "https://images.unsplash.com/photo-1609592424824-39b3b9533d75?auto=format&fit=crop&w=1800&q=85",
      title: "Energía que se mueve contigo",
      description: "Power banks y cargadores para que nunca te desconectes.",
      badge: "Power & Charge",
    },
  ];

  const settings = {
    dots: true,
    infinite: true,
    autoplay: true,
    autoplaySpeed: 5500,
    speed: 900,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    fade: true,
    pauseOnHover: false,
    cssEase: "ease-in-out",
    draggable: true,
    adaptiveHeight: false,
    responsive: [
      {
        breakpoint: 768,
        settings: { dots: false },
      },
    ],
  };

  const bannersToShow = banners.length ? banners : fallbackBanners;
  const [displayedColecciones, setDisplayedColecciones] = useState(colecciones || []);

  // Client-side: for any collection missing imagen_portada, try fetching latest product image
  useEffect(() => {
    let mounted = true;
    async function fillMissingImages() {
      const updated = await Promise.all(
        (displayedColecciones || []).map(async (c) => {
          if (c.imagen_portada) return c;
          try {
            const res = await fetch(`/api/delasoft/products?category=${encodeURIComponent(c.slug)}`);
            if (!res.ok) return c;
            const payload = await res.json().catch(() => null);
            const data = payload?.data || payload || [];
            const first = Array.isArray(data) ? data[0] : data?.results?.[0] || null;
            const candidate = first?.image_url || first?.image || first?.imagen_principal || (first?.images && first.images.length ? first.images[first.images.length - 1]?.url : null);
            return { ...c, imagen_portada: candidate || c.imagen_portada };
          } catch (e) {
            return c;
          }
        })
      );

      if (mounted) setDisplayedColecciones(updated);
    }

    // Only run when initial colecciones prop differs from state
    if ((displayedColecciones || []).every((c) => c.imagen_portada)) return;
    fillMissingImages();
    return () => {
      mounted = false;
    };
  }, [displayedColecciones]);

  function CategoryImage({ slug, src, alt }) {
    const [imageSrc, setImageSrc] = useState(src || null);

    useEffect(() => {
      let mounted = true;
      if (imageSrc) return;

      async function fetchLastProductImage() {
        try {
          const res = await fetch(`/api/delasoft/products?category=${encodeURIComponent(slug)}`);
          if (!res.ok) return;
          const payload = await res.json().catch(() => null);
          const data = payload?.data || payload || [];
          const first = Array.isArray(data) ? data[0] : data?.results?.[0] || null;
          const candidate = first?.image_url || first?.image || first?.imagen_principal || (first?.images && first.images.length ? first.images[first.images.length - 1]?.url : null);
          if (mounted && candidate) setImageSrc(candidate);
        } catch (e) {
          // ignore
        }
      }

      fetchLastProductImage();
      return () => {
        mounted = false;
      };
    }, [slug, imageSrc]);

    return imageSrc ? (
      <Image src={imageSrc} alt={alt || slug} fill className="object-cover transition-transform duration-700 group-hover:scale-105" />
    ) : (
      <div className="h-full w-full bg-neutral-950 border-b border-neutral-800 flex items-center justify-center text-neutral-600 text-sm">Sin imagen</div>
    );
  }

  return (
    <div className="bg-gradient-to-b from-black via-neutral-950 to-black text-neutral-50 min-h-screen flex flex-col">
      <main className="flex-1">
        {/* HERO / CAROUSEL */}
        <section className="relative h-[90vh] pt-16 overflow-hidden">
          <Slider {...settings} className="h-full">
            {bannersToShow.map((banner, idx) => {
              const img = banner.image_url || banner.image; // ✅ API o fallback

              return (
                <div key={banner.id}>
                  <div className="relative h-[90vh] w-full">
                    {/* Imagen */}
                    <Image
                      src={img}
                      alt={banner.title || "Banner"}
                      fill
                      priority={idx === 0}
                      sizes="100vw"
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-black/30" />

                    {/* Texto */}
                    <div className="relative z-10 flex h-full items-center">
                      <div className="max-w-6xl mx-auto px-6 md:px-10">
                        {!!banner.title && (
                          <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif tracking-[0.12em] md:tracking-[0.18em] uppercase mb-4 leading-tight">
                            {banner.title}
                          </h1>
                        )}

                        {!!banner.description && (
                          <p className="text-base md:text-lg text-neutral-300 max-w-xl mb-8">
                            {banner.description}
                          </p>
                        )}

                        <div className="flex flex-wrap items-center gap-4">
                          <Link href={banner.link_path || "/producto"}>
                            <button className="px-8 py-2 text-sm tracking-[0.18em] uppercase border border-neutral-100 bg-neutral-100 text-black hover:bg-transparent hover:text-neutral-100 transition-all duration-300 rounded-full">
                              Ver productos
                            </button>
                          </Link>

                          <Link href="/nosotros">
                            <button className="px-8 py-2 text-xs md:text-sm tracking-[0.18em] uppercase border border-white/25 hover:border-white/60 text-neutral-200 hover:bg-white/5 rounded-full transition-all duration-300">
                              Manifiesto de marca
                            </button>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </Slider>

          {/* Indicador */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 hidden md:flex flex-col items-center gap-2 text-[10px] tracking-[0.25em] uppercase text-neutral-400">
            <span>Desliza</span>
            <div className="h-10 w-px bg-neutral-700 relative overflow-hidden">
              <div className="absolute inset-x-0 top-0 h-10 w-px animate-[scrollLine_1.4s_ease-in-out_infinite] bg-neutral-100" />
            </div>
          </div>
        </section>


        {/* MANIFIESTO */}
        <section className="py-16 md:py-20">
          <div className="max-w-5xl mx-auto px-6 md:px-10">
            <div className="flex flex-col md:flex-row gap-10 md:gap-14 items-start md:items-center">
              <div className="flex-1 space-y-5">
                <p className="text-xs tracking-[0.22em] uppercase text-neutral-400">
                  ShopTecnology
                </p>
                <h2 className="text-2xl md:text-3xl font-serif tracking-wide">
                  Tecnología pensada para que conectes, cargues y disfrutes más.
                </h2>
                <p className="text-sm md:text-base text-neutral-300 leading-relaxed">
                  Seleccionamos celulares y accesorios que realmente aportan a tu
                  rutina: <span className="font-semibold">audio claro, energía confiable</span>{" "}
                  y conectividad sin complicaciones. Cada producto está elegido para
                  acompañarte desde que lo conectas hasta que sales de casa.
                </p>
                <p className="text-sm md:text-base text-neutral-400">
                  Productos funcionales, marcas confiables y atención cercana. Menos
                  complicaciones, más tecnología útil.
                </p>

                <Link href="/producto">
                  <button className="mt-2 text-xs md:text-sm tracking-[0.22em] uppercase border-b border-neutral-500 hover:border-neutral-100 pb-1">
                    Explorar ahora
                  </button>
                </Link>
              </div>

              <div className="flex-1 flex justify-center md:justify-end">
                <div className="relative w-full max-w-xs aspect-[3/4] rounded-3xl overflow-hidden border border-neutral-800 bg-gradient-to-br from-neutral-900 to-neutral-800">
                  <Image
                    src="https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=900&q=85"
                    alt="Tecnología ShopTecnology"
                    fill
                    className="object-cover opacity-90"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-[11px] text-neutral-200">
                    <span className="uppercase tracking-[0.2em]">
                      Tecnología esencial
                    </span>
                    <span className="text-neutral-400">Siempre conectado</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* COLECCIONES DESTACADAS */}
        <section className="py-16 md:py-20 border-t border-neutral-900">
          <div className="max-w-6xl mx-auto px-6 md:px-10">
            <div className="flex justify-between items-end mb-8">
              <div>
                <p className="text-xs tracking-[0.22em] uppercase text-neutral-500 mb-2">
                  Categorías
                </p>
                <h3 className="text-2xl md:text-3xl font-serif">
                  Lo que necesitas, en un solo lugar.
                </h3>
              </div>
              <Link href="/colecciones">
                <button className="hidden md:inline-flex text-[11px] tracking-[0.22em] uppercase border-b border-neutral-600 hover:border-neutral-100 pb-1">
                  Ver todo
                </button>
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8">
              {colecciones.map((coleccion) => (
                <Link
                  key={coleccion.id}
                  href={`/colecciones?coleccion=${coleccion.slug}`}
                >
                  <article className="group relative cursor-pointer overflow-hidden rounded-3xl border border-neutral-800 bg-neutral-950 flex flex-col h-full">
                        <div className="relative h-48 sm:h-64 md:h-72 w-full">
                          <CategoryImage
                            slug={coleccion.slug}
                            src={coleccion.imagen_portada}
                            alt={coleccion.nombre}
                          />

                          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
                    </div>

                    <div className="px-4 py-4 flex-1">
                      <h4 className="text-lg font-serif mb-1">
                        {coleccion.nombre}
                      </h4>
                      <p className="text-xs text-neutral-300 overflow-hidden" style={{maxHeight: '3.2rem'}}>
                        {coleccion.descripcion}
                      </p>
                    </div>

                    <div className="mt-auto flex items-center justify-between px-4 py-3 text-[11px] text-neutral-300 border-t border-neutral-900">
                      <span className="tracking-[0.22em] uppercase">
                        Descubrir
                      </span>
                      <span className="translate-x-0 group-hover:translate-x-1 transition-transform">
                        →
                      </span>
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* CTA FINAL / NEWSLETTER */}
        <section className="py-16 md:py-20 border-t border-neutral-900">
          <div className="max-w-4xl mx-auto px-6 md:px-10 text-center">
            <p className="text-xs tracking-[0.22em] uppercase text-neutral-500 mb-2">
              Comunidad ShopTecnology.
            </p>
            <h3 className="text-2xl md:text-3xl font-serif mb-3">
              Entérate primero de las novedades.
            </h3>
            <p className="text-sm md:text-base text-neutral-300 mb-6">
              Regístrate para recibir novedades, descuentos y lanzamientos de
              celulares, audio y accesorios.
            </p>
            <form className="flex flex-col md:flex-row gap-3 justify-center max-w-xl mx-auto">
              <input
                type="email"
                placeholder="Tu correo"
                className="w-full md:flex-1 rounded-full bg-neutral-950 border border-neutral-700 px-4 py-2 text-sm focus:outline-none focus:border-neutral-200 placeholder:text-neutral-500"
              />
              <button
                type="submit"
                className="rounded-full px-6 py-2 text-xs md:text-sm tracking-[0.22em] uppercase bg-neutral-100 text-black hover:bg-neutral-200 transition"
              >
                Unirme
              </button>
            </form>
          </div>
        </section>
      </main>
    </div>
  );
}

export async function getStaticProps() {
  try {
    const [bannersData, categoriesData] = await Promise.all([
      delasoftFetch('/banners'),
      delasoftFetch('/categories'),
    ]);
    const banners = bannersData?.data || bannersData || [];
    const categories = categoriesData?.data || categoriesData || [];
    const colecciones = categories.map((category) => {
      // Prefer the last uploaded image if `images` array exists
      const imgs = category.images || category.imagenes || [];
      const lastImg = Array.isArray(imgs) && imgs.length ? imgs[imgs.length - 1] : null;
      const imagen_portada = lastImg?.url || lastImg?.image_url || lastImg?.image || category.image_url || category.image || null;

      return {
        id: category.id,
        slug: category.slug,
        nombre: category.name || category.nombre || category.slug,
        descripcion:
          category.description || category.descripcion || `${category.product_count || category.product_count || 0} productos disponibles`,
        imagen_portada: imagen_portada || null,
      };
    });

    return {
      props: {
        banners: Array.isArray(banners) ? banners : [],
        manifesto: null,
        colecciones,
      },
      revalidate: 60,
    };
  } catch (error) {
    console.error("Error cargando home:", error);
    return {
      props: { banners: [], manifesto: null, colecciones: [] },
      revalidate: 60,
    };
  }
}
