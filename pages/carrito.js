// Frontend/pages/carrito.js
import { useState, useMemo } from "react";
import { useCart } from "@/components/contexts/CartContext";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { FiMinus, FiPlus, FiTrash2 } from "react-icons/fi";

export default function CarritoPage() {
  const { cart, loading, error, updateItem, removeItem, refreshCart } = useCart();
  const router = useRouter();
  const [updatingId, setUpdatingId] = useState(null);

  const items = cart?.items || [];
  const isEmpty = !loading && items.length === 0;

  const subtotal = useMemo(
    () => Number(cart?.total || 0),
    [cart]
  );

  const handleQtyChange = async (item, delta) => {
    if (!item) return;
    const nuevaCantidad = (item.cantidad || 0) + delta;

    setUpdatingId(item.id);
    try {
      if (nuevaCantidad <= 0) {
        await removeItem(item.id);
      } else {
        await updateItem(item.id, nuevaCantidad);
      }
    } catch {
      // el error ya se muestra desde el contexto
    } finally {
      setUpdatingId(null);
    }
  };

  const irAlCheckout = () => {
    if (items.length === 0) return;
    router.push("/checkout");
  };

  return (
    <div className="max-w-6xl mx-auto mt-[100px] grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-10">
      {/* Columna izquierda: Items */}
      <section>
        <div className="flex items-baseline justify-between gap-4 mb-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-serif tracking-tight">
              Tu selección ShopTecnology
            </h1>
            <p className="text-sm text-neutral-500 mt-1">
              Todo lo que necesitas para mantenerte conectado.
            </p>
          </div>
          <button
            type="button"
            onClick={() => router.push("/producto")}
            className="hidden md:inline-flex text-[11px] uppercase tracking-[0.22em] text-neutral-600 hover:text-neutral-900"
          >
            Seguir explorando
          </button>
        </div>

        {error && (
          <div className="mb-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 flex items-start justify-between gap-3">
            <p>{error}</p>
            <button
              type="button"
              onClick={refreshCart}
              className="text-xs font-medium underline underline-offset-4"
            >
              Reintentar
            </button>
          </div>
        )}

        {loading && (
          <p className="text-sm text-neutral-500">
            Cargando tu carrito…
          </p>
        )}

        {isEmpty && !loading && (
          <div className="border border-dashed border-neutral-300 rounded-3xl p-8 text-center bg-white/70">
            <p className="text-neutral-700 mb-2">
              Tu carrito está vacío por ahora.
            </p>
            <p className="text-xs text-neutral-500 mb-4">
              Agrega tus accesorios favoritos y completa tu compra cuando estés listo.
            </p>
            <Link href="/producto">
              <button className="px-6 py-2 text-xs tracking-[0.22em] uppercase border border-neutral-900 rounded-full hover:bg-neutral-900 hover:text-white transition">
                Ver productos
              </button>
            </Link>
          </div>
        )}

        {!loading && !isEmpty && (
          <div className="space-y-4">
            {items.map((item) => (
              <article
                key={item.id}
                className="flex gap-4 md:gap-6 border border-neutral-200 rounded-3xl p-4 md:p-5 bg-white/80 backdrop-blur"
              >
                <div className="relative w-24 h-28 md:w-28 md:h-32 rounded-2xl overflow-hidden border border-neutral-200 flex-shrink-0 bg-neutral-100">
                  {item.imagen ? (
                    <Image
                      src={item.imagen}
                      alt={item.nombre_variante || "Producto"}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-[10px] text-neutral-500">
                      Sin imagen
                    </div>
                  )}
                </div>

                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <h2 className="text-sm md:text-base font-medium text-neutral-900">
                      {item.nombre_variante || item.nombre || "Producto"}
                    </h2>
                    {item.variante && (
                      <p className="text-[11px] text-neutral-500 mt-1">
                        ID variante · {item.variante}
                      </p>
                    )}
                  </div>

                  <div className="flex flex-col md:flex-row md:items-center md:justify-between mt-3 gap-3">
                    {/* Control de cantidad */}
                    <div className="inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-neutral-50 px-1 py-1">
                      <button
                        type="button"
                        onClick={() => handleQtyChange(item, -1)}
                        disabled={updatingId === item.id}
                        className="w-7 h-7 rounded-full flex items-center justify-center text-xs text-neutral-700 hover:bg-neutral-900 hover:text-white disabled:opacity-50"
                      >
                        <FiMinus />
                      </button>
                      <span className="min-w-[2rem] text-center text-sm text-neutral-900">
                        {item.cantidad}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleQtyChange(item, 1)}
                        disabled={updatingId === item.id}
                        className="w-7 h-7 rounded-full flex items-center justify-center text-xs text-neutral-700 hover:bg-neutral-900 hover:text-white disabled:opacity-50"
                      >
                        <FiPlus />
                      </button>
                    </div>

                    {/* Precio + quitar */}
                    <div className="flex items-center justify-between md:justify-end gap-4">
                      <button
                        type="button"
                        onClick={() => handleQtyChange(item, -item.cantidad)}
                        disabled={updatingId === item.id}
                        className="inline-flex items-center gap-1 text-[11px] uppercase tracking-[0.18em] text-neutral-500 hover:text-red-500"
                      >
                        <FiTrash2 className="text-[13px]" />
                        Quitar
                      </button>
                      <div className="text-right">
                        <p className="text-sm text-neutral-900">
                          {Number(item.subtotal || 0).toLocaleString("es-CO", {
                            style: "currency",
                            currency: "COP",
                          })}
                        </p>
                        <p className="text-[11px] text-neutral-500">
                          {Number(item.precio || 0).toLocaleString("es-CO", {
                            style: "currency",
                            currency: "COP",
                          })}{" "}
                          c/u
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      {/* Columna derecha: Resumen */}
      <aside className="lg:sticky lg:top-24 h-fit">
        <div className="border border-neutral-200 rounded-3xl p-6 bg-white/90 backdrop-blur shadow-sm">
          <p className="text-xs tracking-[0.22em] uppercase text-neutral-500 mb-3">
            Resumen
          </p>

          <div className="flex items-center justify-between mb-2 text-sm">
            <span className="text-neutral-700">Subtotal</span>
            <span className="font-medium text-neutral-900">
              {subtotal.toLocaleString("es-CO", {
                style: "currency",
                currency: "COP",
              })}
            </span>
          </div>

          <div className="flex items-center justify-between mb-2 text-xs text-neutral-500">
            <span>Envío</span>
            <span>Se calcula en el checkout</span>
          </div>

          <div className="border-t border-dashed border-neutral-200 mt-4 pt-4 flex items-center justify-between">
            <span className="text-xs uppercase tracking-[0.22em] text-neutral-500">
              Total estimado
            </span>
            <span className="text-base font-semibold text-neutral-900">
              {subtotal.toLocaleString("es-CO", {
                style: "currency",
                currency: "COP",
              })}
            </span>
          </div>

          <button
            type="button"
            onClick={irAlCheckout}
            disabled={isEmpty || loading}
            className="mt-5 w-full py-3 rounded-full bg-neutral-900 text-white text-xs md:text-sm tracking-[0.22em] uppercase hover:bg-black transition disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Continuar al checkout
          </button>

          <p className="text-[11px] text-neutral-500 mt-3">
            Los ítems en tu carrito no están reservados hasta completar el pago.
            Producciones limitadas, stock sujeto a disponibilidad.
          </p>
        </div>
      </aside>
    </div>
  );
}

