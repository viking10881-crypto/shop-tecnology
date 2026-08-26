// Frontend/pages/producto/[id].js
import { useRouter } from "next/router";
import { useEffect, useMemo, useState } from "react";
import { useCart } from "@/components/contexts/CartContext";
import StoreLayout from "@/components/layouts/StoreLayout";
import { fetchProduct, fetchProducts } from "@/utils/api";


export default function ProductoDetalle() {
  const router = useRouter();
  const { addItem } = useCart();


  const [producto, setProducto] = useState(null);
  const [varianteSeleccionada, setVarianteSeleccionada] = useState(null);
  const [imagenSeleccionada, setImagenSeleccionada] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  const [agregando, setAgregando] = useState(false);
  const [mensajeCarrito, setMensajeCarrito] = useState("");
  const [errorCarrito, setErrorCarrito] = useState("");

  // productos sugeridos
  const [sugeridos, setSugeridos] = useState([]);
  const [cargandoSugeridos, setCargandoSugeridos] = useState(false);

  const normalizarImagen = (path) => {
    if (!path) return null;
    if (path.startsWith("http")) return path;
    if (!path.startsWith("/")) path = `/${path}`;
    return path;
  };

  const formatearPrecio = (valor) =>
    Number(valor || 0).toLocaleString("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
    });

  useEffect(() => {
    if (!router.isReady) return;

    const { id } = router.query;

    if (!id) {
      setError("Producto no válido o URL incompleta.");
      setCargando(false);
      return;
    }

    const fetchProductosSugeridos = async (productoId) => {
      try {
        setCargandoSugeridos(true);
        const lista = await fetchProducts(`?page=1&limit=4&exclude=${productoId}`);
        setSugeridos(Array.isArray(lista) ? lista : []);
      } catch (err) {
        console.error("Error al cargar sugeridos:", err);
      } finally {
        setCargandoSugeridos(false);
      }
    };

    const fetchProducto = async () => {
      try {
        setCargando(true);
        setError("");

        const data = await fetchProduct(id);
        setProducto(data);

        if (data.variantes?.length > 0) {
          setVarianteSeleccionada(data.variantes[0]);
        }

        const principal =
          data.imagen_principal || data.imagenes?.[0]?.imagen || null;

        setImagenSeleccionada(normalizarImagen(principal));

        // Cargar sugeridos después
        fetchProductosSugeridos(data.id);
      } catch (err) {
        console.error(err);
        setError("No se pudo cargar la información del producto.");
      } finally {
        setCargando(false);
      }
    };

    fetchProducto();
  }, [router.isReady, router.query.id]);

  const variantes = producto?.variantes || [];

  const colores = useMemo(() => {
    if (!variantes.length) return [];
    const set = new Set(variantes.map((v) => v.color).filter(Boolean));
    return Array.from(set);
  }, [variantes]);

  const tallasDisponibles = useMemo(() => {
    if (!variantes.length || !varianteSeleccionada?.color) return [];
    const set = new Set(
      variantes
        .filter((v) => v.color === varianteSeleccionada.color)
        .map((v) => v.talla)
        .filter(Boolean)
    );
    return Array.from(set);
  }, [variantes, varianteSeleccionada]);

  const imagenesGaleria = useMemo(() => {
    if (!producto) return [];

    const lista = [];
    if (producto.imagen_principal) {
      lista.push(normalizarImagen(producto.imagen_principal));
    }

    if (producto.imagenes?.length) {
      producto.imagenes.forEach((img) => {
        if (img.imagen) {
          lista.push(normalizarImagen(img.imagen));
        }
      });
    }

    return Array.from(new Set(lista.filter(Boolean)));
  }, [producto]);

  const handleColorChange = (color) => {
    const variante = variantes.find((v) => v.color === color);
    if (variante) {
      setVarianteSeleccionada(variante);
    }
  };

  const handleTallaChange = (talla) => {
    const variante = variantes.find(
      (v) => v.talla === talla && v.color === varianteSeleccionada?.color
    );
    if (variante) {
      setVarianteSeleccionada(variante);
    }
  };

  const precioFinal = useMemo(() => {
    if (!producto) return 0;
    const base = Number(producto.precio) || 0;
    const extra = Number(varianteSeleccionada?.precio_adicional) || 0;
    return base + extra;
  }, [producto, varianteSeleccionada]);


  const handleAgregarCarrito = async () => {
    setMensajeCarrito("");
    setErrorCarrito("");

    if (variantes.length > 0 && !varianteSeleccionada?.id) {
      setErrorCarrito("Selecciona una variante antes de agregar al carrito.");
      return;
    }

    if (tallasDisponibles.length > 0 && !varianteSeleccionada?.talla) {
      setErrorCarrito("Selecciona una talla antes de continuar.");
      return;
    }

    try {
      setAgregando(true);
      await addItem(producto, 1, varianteSeleccionada);
      setMensajeCarrito("Agregado al carrito.");
    } catch (err) {
      console.error(err);
      setErrorCarrito("Ocurrió un error al agregar al carrito.");
    } finally {
      setAgregando(false);
    }
  };

  if (cargando) {
    return (
      <StoreLayout backHref="/producto" backLabel="Volver a productos">
        <div className="flex items-center justify-center min-h-[60vh]">
          <p className="text-neutral-400 text-sm tracking-wide uppercase">
            Cargando producto...
          </p>
        </div>
      </StoreLayout>
    );
  }

  if (error || !producto) {
    return (
      <StoreLayout backHref="/producto" backLabel="Volver a productos">
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="bg-red-500/10 border border-red-500/40 rounded-2xl px-6 py-5 max-w-md text-center">
            <p className="text-red-600 dark:text-red-300 mb-2">
              {error || "Producto no encontrado."}
            </p>
          </div>
        </div>
      </StoreLayout>
    );
  }

  const botonDeshabilitado = (variantes.length > 0 && !varianteSeleccionada) || agregando;

  return (
    <StoreLayout backHref="/producto" backLabel="Volver a productos">
      {/* CONTENIDO PRINCIPAL PRODUCTO */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Galería */}
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6 bg-neutral-900/80 rounded-2xl p-6 border border-white/10 shadow-[0_0_80px_rgba(255,255,255,0.05)] backdrop-blur">
          {/* Thumbnails */}
          <div className="flex md:flex-col gap-3 order-2 md:order-1 overflow-x-auto md:overflow-visible max-w-full pb-1 md:pb-0">
            {imagenesGaleria.map((src, idx) => (
              <img
                key={idx}
                src={src}
                alt={`Miniatura ${idx}`}
                className={`w-20 h-20 shrink-0 object-cover rounded-md cursor-pointer border-2 transition ${
                  imagenSeleccionada === src
                    ? "border-white"
                    : "border-transparent hover:opacity-80"
                }`}
                onClick={() => setImagenSeleccionada(src)}
              />
            ))}
          </div>

          {/* Imagen principal */}
          <div className="flex-1 flex items-center justify-center order-1 md:order-2">
            {imagenSeleccionada ? (
              <img
                src={imagenSeleccionada}
                alt={producto.nombre}
                className="w-full max-h-[500px] object-contain rounded-lg transition-all duration-300"
              />
            ) : (
              <div className="w-full h-[300px] flex items-center justify-center text-neutral-500 text-sm">
                Sin imagen disponible
              </div>
            )}
          </div>
        </div>

        {/* Detalles */}
        <div className="flex flex-col justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-neutral-500 mb-3">
              {producto.marca || "Tecnología ShopTecnology"}
            </p>

            <h1 className="text-3xl md:text-4xl font-serif uppercase mb-3">
              {producto.nombre}
            </h1>

            {producto.subtitulo && (
              <p className="text-sm text-neutral-400 mb-3">
                {producto.subtitulo}
              </p>
            )}

            <p className="text-neutral-400 text-sm mb-6 whitespace-pre-line leading-relaxed">
              {producto.descripcion}
            </p>

            {variantes.length > 0 && (
              <div className="space-y-6">
                {colores.length > 0 && (
                  <div>
                    <p className="text-xs uppercase text-neutral-500 mb-2">
                      Color
                    </p>
                    <div className="flex gap-2 flex-wrap">
                      {colores.map((color) => (
                        <button
                          key={color}
                          type="button"
                          onClick={() => handleColorChange(color)}
                          className={`min-w-[2.5rem] h-10 rounded-full border text-xs px-3 flex items-center justify-center gap-2 transition ${
                            varianteSeleccionada?.color === color
                              ? "border-white bg-white text-black"
                              : "border-neutral-600 hover:border-white hover:bg-neutral-800"
                          }`}
                        >
                          <span
                            className="w-4 h-4 rounded-full border border-neutral-500"
                            style={{
                              backgroundColor: color
                                ? color.toLowerCase()
                                : "transparent",
                            }}
                          />
                          <span className="capitalize">{color}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {tallasDisponibles.length > 0 && (
                  <div>
                    <p className="text-xs uppercase text-neutral-500 mb-2">
                      Talla
                    </p>
                    <div className="flex gap-3 flex-wrap">
                      {tallasDisponibles.map((talla) => (
                        <button
                          key={talla}
                          type="button"
                          onClick={() => handleTallaChange(talla)}
                          className={`text-xs px-4 py-1.5 rounded-full border transition ${
                            varianteSeleccionada?.talla === talla
                              ? "bg-white text-black border-white"
                              : "border-neutral-600 hover:bg-white hover:text-black"
                          }`}
                        >
                          {talla}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Precio + botón */}
          <div className="mt-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-t border-white/10 pt-6">
            <div>
              <p className="text-xs uppercase text-neutral-500 mb-1">
                Precio
              </p>
              <p className="text-2xl font-semibold">
                {formatearPrecio(precioFinal)}
              </p>
              {varianteSeleccionada?.precio_adicional && (
                <p className="text-xs text-neutral-500 mt-1">
                  Incluye ajuste por variante seleccionada
                </p>
              )}
            </div>

            <div className="flex flex-col items-start gap-2">
              <button
                type="button"
                onClick={handleAgregarCarrito}
                disabled={botonDeshabilitado}
                className="bg-white text-black px-6 py-2 text-sm font-bold rounded-full hover:bg-neutral-300 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {agregando ? "AGREGANDO..." : "AGREGAR AL CARRITO"}
              </button>

              {mensajeCarrito && (
                <p className="text-xs text-emerald-400">{mensajeCarrito}</p>
              )}

              {errorCarrito && (
                <p className="text-xs text-red-400">{errorCarrito}</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* PRODUCTOS SUGERIDOS */}
      <section className="mt-16 border-t border-white/10 pt-10">
        <div className="flex items-center justify-between gap-4 mb-6">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-neutral-500 mb-1">
              También te puede gustar
            </p>
            <h2 className="text-lg font-semibold">Sugerencias para ti</h2>
          </div>
          <button
            type="button"
            onClick={() => router.push("/producto")}
            className="text-xs uppercase tracking-[0.2em] text-neutral-400 hover:text-neutral-100 underline underline-offset-4 decoration-neutral-600 hover:decoration-neutral-200 transition"
          >
            Ver todos los productos
          </button>
        </div>

        {cargandoSugeridos && (
          <p className="text-xs text-neutral-500">Cargando sugerencias...</p>
        )}

        {!cargandoSugeridos && sugeridos.length === 0 && (
          <p className="text-xs text-neutral-500">
            Pronto verás recomendaciones personalizadas aquí.
          </p>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {sugeridos.map((item) => {
            const imagenCard =
              normalizarImagen(item.imagen_principal) ||
              normalizarImagen(item.imagenes?.[0]?.imagen);

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => router.push(`/producto/${item.id}`)}
                className="group text-left bg-neutral-900/70 border border-white/5 rounded-2xl overflow-hidden hover:border-white/20 hover:-translate-y-1 transition-all duration-200 shadow-[0_0_40px_rgba(255,255,255,0.03)]"
              >
                <div className="aspect-[4/5] w-full overflow-hidden bg-neutral-950 flex items-center justify-center">
                  {imagenCard ? (
                    <img
                      src={imagenCard}
                      alt={item.nombre}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <span className="text-xs text-neutral-600">
                      Sin imagen
                    </span>
                  )}
                </div>
                <div className="px-4 py-3">
                  <p className="text-[11px] uppercase tracking-[0.2em] text-neutral-500 mb-1">
                    {item.marca || "ShopTecnology"}
                  </p>
                  <p className="text-sm font-medium line-clamp-2 mb-1">
                    {item.nombre}
                  </p>
                  <p className="text-sm text-neutral-300">
                    {formatearPrecio(item.precio)}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </section>
    </StoreLayout>
  );
}
