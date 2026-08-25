// Frontend/pages/producto/index.js
import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { fetchProducts } from "@/utils/api";
import { Search, Loader2, ArrowUpRight } from "lucide-react";
import StoreLayout from "@/components/layouts/StoreLayout";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export default function ProductosPage() {
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  const [busqueda, setBusqueda] = useState("");
  const [orden, setOrden] = useState("recientes"); // recientes | precio_asc | precio_desc

  useEffect(() => {
    const cargarProductos = async () => {
      try {
        setCargando(true);
        setError("");
        const data = await fetchProducts();
        setProductos(Array.isArray(data) ? data : data?.results || []);
      } catch (err) {
        console.error(err);
        setError("No se pudieron cargar los productos.");
      } finally {
        setCargando(false);
      }
    };

    cargarProductos();
  }, []);

  const getImagenProducto = (producto) => {
    // 1. Intentar imagen principal desde ImagenProducto
    const principal =
      producto.imagen_principal ||
      producto.imagen ||
      producto.imagenes?.find((img) => img.es_principal)?.imagen ||
      producto.imagenes?.[0]?.imagen;

    let imagen = principal;

    // 2. Fallback a variantes
    if (!imagen && producto.variantes?.[0]) {
      imagen =
        producto.variantes[0].imagen_principal ||
        producto.variantes[0].imagenes_secundarias?.[0]?.imagen;
    }

    // 3. Asegurar URL absoluta si viene como path relativo
    if (imagen && !imagen.startsWith("http")) {
      if (!imagen.startsWith("/")) {
        imagen = `/${imagen}`;
      }
      imagen = `${API_BASE}${imagen}`;
    }

    return imagen;
  };

  const formatearPrecio = (valor) => {
    if (valor == null) return "";
    return Number(valor).toLocaleString("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
    });
  };

  const productosProcesados = useMemo(() => {
    let lista = [...productos];

    // Búsqueda
    if (busqueda.trim() !== "") {
      const term = busqueda.trim().toLowerCase();
      lista = lista.filter((p) => {
        const nombre = p.nombre?.toLowerCase() || "";
        const marca = p.marca?.toLowerCase() || "";
        return nombre.includes(term) || marca.includes(term);
      });
    }

    // Orden
    lista.sort((a, b) => {
      const precioA = Number(a.precio) || 0;
      const precioB = Number(b.precio) || 0;
      const fechaA = new Date(a.creado_en || 0).getTime();
      const fechaB = new Date(b.creado_en || 0).getTime();

      switch (orden) {
        case "precio_asc":
          return precioA - precioB;
        case "precio_desc":
          return precioB - precioA;
        case "recientes":
        default:
          return fechaB - fechaA;
      }
    });

    return lista;
  }, [productos, busqueda, orden]);

  if (cargando) {
    return (
      <div className="bg-black text-white min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-white" />
          <p className="text-neutral-400 text-sm">
            Cargando productos...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-black text-white min-h-screen flex items-center justify-center">
        <div className="bg-red-500/10 border border-red-500/40 rounded-2xl px-6 py-5 max-w-md text-center">
          <p className="text-red-300 mb-2">{error}</p>
          <button
            onClick={() => location.reload()}
            className="mt-2 text-sm px-4 py-2 rounded-xl bg-red-500/20 hover:bg-red-500/30 border border-red-500/40"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <StoreLayout backHref="/" backLabel="Volver al inicio">
      <div className="bg-black text-white min-h-screen px-4 md:px-10 py-16">
        {/* Header */}
        <div className="max-w-6xl mx-auto mb-10 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="text-3xl md:text-4xl font-serif tracking-[0.2em] uppercase text-center md:text-left">
              Tecnología y accesorios
            </h1>
            <p className="text-neutral-400 text-sm mt-3 text-center md:text-left">
              Celulares, power banks, audífonos, bafles y accesorios para todos tus dispositivos.
            </p>
          </div>

          {/* Filtros / búsqueda */}
          <div className="flex flex-col gap-3 md:items-end">
            <div className="relative w-full md:w-72">
              <Search className="w-4 h-4 text-neutral-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Buscar por nombre o marca..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                className="w-full bg-neutral-900 border border-white/10 rounded-full pl-9 pr-3 py-2 text-sm outline-none focus:border-white/40 placeholder:text-neutral-500"
              />
            </div>

            <select
              value={orden}
              onChange={(e) => setOrden(e.target.value)}
              className="bg-neutral-900 border border-white/10 rounded-full px-4 py-2 text-xs md:text-sm outline-none focus:border-white/40"
            >
              <option value="recientes">Más recientes</option>
              <option value="precio_asc">Precio: menor a mayor</option>
              <option value="precio_desc">Precio: mayor a menor</option>
            </select>
          </div>
        </div>

        {/* Grid de productos */}
        <div className="max-w-6xl mx-auto">
          {productosProcesados.length === 0 ? (
            <div className="bg-neutral-900 border border-white/10 rounded-2xl p-10 text-center">
              <p className="text-neutral-300 text-sm">
                No encontramos productos que coincidan con tu búsqueda.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {productosProcesados.map((producto) => {
                const imagen = getImagenProducto(producto);
                const variantesCount = producto.variantes?.length || 0;

                return (
                  <Link
                    href={`/producto/${producto.id}`}
                    key={producto.id}
                    legacyBehavior
                  >
                    <a className="group bg-neutral-900 rounded-2xl overflow-hidden flex flex-col h-[480px] border border-white/10 hover:border-white/30 hover:-translate-y-1 hover:shadow-[0_0_40px_rgba(255,255,255,0.08)] transition-all duration-300">
                      {/* Imagen */}
                      <div className="relative h-[60%] bg-neutral-900 flex items-center justify-center overflow-hidden">
                        {imagen ? (
                          <img
                            src={imagen}
                            alt={producto.nombre}
                            className="object-contain h-full w-full px-4 py-4 group-hover:scale-105 transition-transform duration-300"
                          />
                        ) : (
                          <span className="text-xs text-neutral-600">Sin imagen</span>
                        )}
                        <span className="absolute top-4 left-4 text-[0.65rem] uppercase tracking-wide bg-white text-black px-3 py-1 rounded-full">
                          New
                        </span>
                      </div>

                      {/* Info */}
                      <div className="h-[40%] p-5 flex flex-col justify-between">
                        <div>
                          {producto.marca && (
                            <p className="text-[0.65rem] uppercase tracking-[0.2em] text-neutral-500 mb-1">
                              {producto.marca}
                            </p>
                          )}
                          <h2 className="text-base md:text-lg font-serif font-semibold text-white line-clamp-2">
                            {producto.nombre}
                          </h2>
                          <p className="text-xs text-neutral-500 mt-2">
                            {variantesCount} variante
                            {variantesCount === 1 ? "" : "s"} disponible
                            {variantesCount > 0 ? "s" : ""}
                          </p>
                        </div>

                        <div className="mt-4 flex justify-between items-center">
                          <button className="inline-flex items-center gap-1 bg-white text-black text-xs font-semibold px-5 py-1.5 rounded-full tracking-widest hover:bg-neutral-200 transition">
                            COMPRAR
                            <ArrowUpRight className="w-3 h-3" />
                          </button>
                          <p className="text-neutral-200 text-sm font-semibold">
                            {formatearPrecio(producto.precio)}
                          </p>
                        </div>
                      </div>
                    </a>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </StoreLayout>
  );
}
