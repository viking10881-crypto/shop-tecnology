// Frontend/pages/colecciones.js
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";
import { fetchCategories, fetchProducts } from "@/utils/api";
import NavBar from "@/components/ui/NavBar";
import Footer from "@/components/ui/Footer";


export default function ColeccionesPage() {
  const router = useRouter();
  const slugSeleccionado = router.query.coleccion || null;

  const [colecciones, setColecciones] = useState([]);
  const [productos, setProductos] = useState([]);
  const [cargandoColecciones, setCargandoColecciones] = useState(true);
  const [cargandoProductos, setCargandoProductos] = useState(false);
  const [error, setError] = useState("");

  // ✅ Helper: convierte cualquier respuesta a array
  const toArray = (data) => {
    if (Array.isArray(data)) return data;
    if (Array.isArray(data?.results)) return data.results;
    if (Array.isArray(data?.colecciones)) return data.colecciones;
    if (Array.isArray(data?.productos)) return data.productos;
    return [];
  };

  // Cargar colecciones activas/destacadas
  const cargarColecciones = async () => {
    try {
      setError("");
      setCargandoColecciones(true);

      const data = await fetchCategories();
      const raw = toArray(data);
      const lista = await Promise.all(
        raw.map(async (category) => {
          const imgs = category.images || category.imagenes || [];
          const lastImg = Array.isArray(imgs) && imgs.length ? imgs[imgs.length - 1] : null;
          let imagen_portada = lastImg?.url || lastImg?.image_url || lastImg?.image || category.image_url || category.image || null;

          if (!imagen_portada) {
            try {
              const p = await fetchProducts(`?category=${encodeURIComponent(category.slug)}`);
              const prods = Array.isArray(p) ? p : p?.data || p?.results || [];
              const first = prods[0];
              imagen_portada = first?.image_url || first?.image || first?.imagen_principal || (first?.images && first.images.length ? first.images[first.images.length - 1]?.url : null) || imagen_portada;
            } catch (e) {
              // ignore
            }
          }

          return {
            ...category,
            nombre: category.name || category.nombre,
            descripcion: category.description || category.descripcion,
            imagen_portada,
          };
        })
      );

      setColecciones(lista);
    } catch (err) {
      console.error("Error cargando colecciones:", err);
      setError("No se pudieron cargar las colecciones.");
      setColecciones([]);
    } finally {
      setCargandoColecciones(false);
    }
  };

  // Cargar productos de una colección
  const cargarProductos = async (slug) => {
    if (!slug) return;

    try {
      setError("");
      setCargandoProductos(true);

      const data = await fetchProducts(`?category=${encodeURIComponent(slug)}`);
      const lista = toArray(data);

      setProductos(lista);
    } catch (err) {
      console.error("Error cargando productos de la colección:", err);
      setError("No se pudieron cargar los productos de esta colección.");
      setProductos([]);
    } finally {
      setCargandoProductos(false);
    }
  };

  useEffect(() => {
    cargarColecciones();
  }, []);

  useEffect(() => {
    if (slugSeleccionado) {
      cargarProductos(slugSeleccionado);
    } else {
      setProductos([]);
    }
  }, [slugSeleccionado]);

  const coleccionActual = useMemo(() => {
    if (!slugSeleccionado) return null;
    return colecciones.find((c) => c.slug === slugSeleccionado) || null;
  }, [slugSeleccionado, colecciones]);

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <NavBar />

      <main className="flex-1 pt-24 pb-16 px-6 md:px-10 max-w-6xl mx-auto">
        {/* HEADER */}
        {!slugSeleccionado && (
          <h1 className="text-3xl md:text-4xl font-serif mb-6">Colecciones</h1>
        )}

        {slugSeleccionado && (
          <div className="mb-8">
            <button
              onClick={() => router.push("/colecciones")}
              className="text-[11px] tracking-[0.22em] uppercase text-neutral-400 border-b border-neutral-700 hover:border-neutral-200 pb-1 mb-3"
            >
              ← Ver todas las colecciones
            </button>

            <h1 className="text-3xl md:text-4xl font-serif mb-2">
              {coleccionActual?.nombre || "Colección"}
            </h1>

            {coleccionActual?.descripcion && (
              <p className="text-sm text-neutral-300 max-w-2xl">
                {coleccionActual.descripcion}
              </p>
            )}
          </div>
        )}

        {/* ERRORES */}
        {error && <p className="text-sm text-red-400 mb-4">{error}</p>}

        {/* MODO 1: listado de colecciones */}
        {!slugSeleccionado && (
          <>
            {cargandoColecciones && (
              <p className="text-sm text-neutral-400">Cargando colecciones...</p>
            )}

            {!cargandoColecciones && colecciones.length === 0 && !error && (
              <p className="text-sm text-neutral-500">
                Aún no hay colecciones disponibles.
              </p>
            )}

            <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {colecciones.map((c) => (
                <article
                  key={c.id}
                  className="border border-neutral-800 rounded-3xl overflow-hidden hover:border-neutral-100 transition-colors cursor-pointer"
                  onClick={() => router.push(`/colecciones?coleccion=${c.slug}`)}
                >
                  {c.imagen_portada ? (
                    <div className="h-52 w-full overflow-hidden">
                      <img
                        src={c.imagen_portada}
                        alt={c.nombre || c.slug}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    </div>
                  ) : (
                    <div className="h-52 w-full bg-neutral-950 border-b border-neutral-800 flex items-center justify-center text-neutral-600 text-sm">
                      Sin imagen
                    </div>
                  )}

                  <div className="p-4 flex flex-col gap-2">
                    <h2 className="text-lg font-medium">{c.nombre || "—"}</h2>
                    <p className="text-[11px] uppercase tracking-[0.18em] text-neutral-500">
                      {c.slug || ""}
                    </p>
                    {c.descripcion && (
                      <p className="text-sm text-neutral-400 line-clamp-3">
                        {c.descripcion}
                      </p>
                    )}
                  </div>
                </article>
              ))}
            </div>
          </>
        )}

        {/* MODO 2: productos de una colección */}
        {slugSeleccionado && (
          <section className="mt-6">
            {cargandoProductos && (
              <p className="text-sm text-neutral-400 mb-4">
                Cargando productos de la colección...
              </p>
            )}

            {!cargandoProductos && productos.length === 0 && !error && (
              <p className="text-sm text-neutral-500">
                Esta colección aún no tiene productos asociados.
              </p>
            )}

            {/* Banner de colección */}
            {coleccionActual?.imagen_portada && (
              <div className="mb-8 rounded-3xl overflow-hidden border border-neutral-800">
                <img
                  src={coleccionActual.imagen_portada}
                  alt={coleccionActual.nombre || "Colección"}
                  className="w-full max-h-80 object-cover"
                  loading="lazy"
                />
              </div>
            )}

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {productos.map((p) => (
                <article
                  key={p.id}
                  className="border border-neutral-800 rounded-3xl overflow-hidden hover:border-neutral-100 transition-colors"
                >
                  {p.imagen_principal ? (
                    <div className="h-64 w-full overflow-hidden">
                      <img
                        src={p.imagen_principal}
                        alt={p.nombre || "Producto"}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    </div>
                  ) : (
                    <div className="h-64 w-full bg-neutral-950 border-b border-neutral-800 flex items-center justify-center text-neutral-600 text-sm">
                      Sin imagen
                    </div>
                  )}

                  <div className="p-4 flex flex-col gap-2">
                    <h2 className="text-base font-medium">{p.nombre || "—"}</h2>

                    {p.precio != null && p.precio !== "" && (
                      <p className="text-sm text-neutral-200">
                        ${Number(p.precio).toLocaleString("es-CO")}
                      </p>
                    )}

                    {p.descripcion_corta && (
                      <p className="text-sm text-neutral-400 line-clamp-2">
                        {p.descripcion_corta}
                      </p>
                    )}
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
}
