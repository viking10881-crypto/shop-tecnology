// components/cart/FloatingCart.js
import { useState, useMemo } from "react";
import Link from "next/link";
import { useCart } from "@/components/contexts/CartContext";
import {
  FiShoppingBag,
  FiChevronUp,
  FiChevronDown,
  FiRefreshCw,
  FiX,
  FiImage,
} from "react-icons/fi";

const formatCOP = (value) =>
  Number(value || 0).toLocaleString("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  });

export default function FloatingCart() {
  const { cart, loading, error, refreshCart, removeItem } = useCart();
  const [open, setOpen] = useState(false);

  const items = cart?.items ?? [];

  const itemCount = useMemo(
    () => items.reduce((acc, item) => acc + (item.cantidad || 0), 0),
    [items]
  );

  const total = Number(cart?.total ?? 0);

  const hasItems = !loading && !error && items.length > 0;
  const visibleItems = items.slice(0, 4);
  const restantes = items.length - visibleItems.length;

  return (
    <div className="fixed bottom-4 right-4 z-40">
      {/* Panel desplegable */}
      {open && (
        <div className="mb-3 w-80 max-w-[90vw] rounded-3xl border border-neutral-900/10 bg-white/95 backdrop-blur-xl shadow-2xl shadow-neutral-900/20 overflow-hidden animate-fade-in-up">
          <div className="px-4 py-3 flex items-center justify-between border-b border-neutral-200">
            <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] font-medium text-neutral-800">
              <FiShoppingBag className="text-neutral-600" />
              <span>Carrito ShopTecnology</span>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="text-neutral-400 hover:text-neutral-900 transition"
              aria-label="Cerrar carrito"
            >
              <FiX />
            </button>
          </div>

          <div className="max-h-80 overflow-y-auto px-3 py-3 space-y-1">
            {loading && (
              <p className="text-xs text-neutral-500 px-1 py-2">Cargando carrito…</p>
            )}

            {error && (
              <div className="text-xs text-red-500 flex items-center justify-between gap-2 px-1 py-2">
                <span className="line-clamp-3">{error}</span>
                <button
                  type="button"
                  onClick={refreshCart}
                  className="flex items-center gap-1 text-[11px] uppercase tracking-[0.16em] text-neutral-900 border border-neutral-900/20 rounded-full px-2 py-1 shrink-0"
                >
                  <FiRefreshCw className="text-[12px]" />
                  Reintentar
                </button>
              </div>
            )}

            {!loading && !error && items.length === 0 && (
              <div className="flex flex-col items-center gap-2 py-6 text-center">
                <FiShoppingBag className="text-2xl text-neutral-300" />
                <p className="text-xs text-neutral-500">
                  Tu carrito está vacío.
                  <br />
                  Explora nuestros productos tecnológicos.
                </p>
              </div>
            )}

            {hasItems &&
              visibleItems.map((item) => (
                <div
                  key={item.id}
                  className="group flex items-center gap-3 rounded-2xl px-1 py-2 hover:bg-neutral-100/80 transition"
                >
                  <div className="w-12 h-12 shrink-0 rounded-xl overflow-hidden bg-neutral-100 border border-neutral-200 flex items-center justify-center">
                    {item.imagen ? (
                      <img
                        src={item.imagen}
                        alt={item.nombre || "Producto"}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <FiImage className="text-neutral-300 text-lg" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-neutral-800 line-clamp-1">
                      {item.nombre_variante ||
                        item.nombre ||
                        `Producto #${item.variante ?? item.id}`}
                    </p>
                    <p className="text-[11px] text-neutral-500">
                      ×{item.cantidad} · {formatCOP(item.subtotal)}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => removeItem(item.id)}
                    className="opacity-0 group-hover:opacity-100 shrink-0 text-neutral-400 hover:text-red-500 transition"
                    aria-label="Quitar del carrito"
                  >
                    <FiX className="text-sm" />
                  </button>
                </div>
              ))}

            {restantes > 0 && (
              <p className="text-[11px] text-neutral-500 text-center pt-1">
                +{restantes} producto{restantes > 1 ? "s" : ""} más en tu carrito
              </p>
            )}
          </div>

          <div className="px-4 py-3 border-t border-neutral-200 flex items-center justify-between bg-neutral-50">
            <div>
              <p className="text-[10px] uppercase tracking-[0.2em] text-neutral-500">
                Total
              </p>
              <p className="text-sm font-semibold text-neutral-900">
                {formatCOP(total)}
              </p>
            </div>

            <Link
              href="/carrito"
              className="px-4 py-2 rounded-full bg-neutral-900 text-white text-[11px] uppercase tracking-[0.2em] hover:bg-black transition text-center"
            >
              Ver carrito
            </Link>
          </div>
        </div>
      )}

      {/* Botón flotante */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="group relative flex items-center gap-2 rounded-full border border-neutral-900/20 bg-white/90 backdrop-blur px-4 py-2 shadow-lg shadow-neutral-900/10 hover:-translate-y-0.5 transition"
      >
        {/* Triangulito debajo */}
        <div className="absolute -bottom-2 right-6 w-3 h-3 bg-white/90 border-l border-b border-neutral-900/20 rotate-45 group-hover:translate-y-0.5 transition" />

        <div className="relative">
          <FiShoppingBag className="text-neutral-800" />
          {itemCount > 0 && (
            <span className="absolute -top-2 -right-2 flex items-center justify-center min-w-[16px] h-4 px-1 rounded-full bg-neutral-900 text-white text-[9px] font-semibold">
              {itemCount}
            </span>
          )}
        </div>

        <div className="flex flex-col items-start">
          <span className="text-[10px] uppercase tracking-[0.2em] text-neutral-500">
            Carrito
          </span>
          <span className="text-xs text-neutral-900">
            {loading
              ? "Cargando…"
              : error
              ? "Toca para reintentar"
              : itemCount === 0
              ? "Sin productos"
              : `${itemCount} pieza${itemCount > 1 ? "s" : ""} · ${formatCOP(total)}`}
          </span>
        </div>
        {open ? (
          <FiChevronDown className="text-neutral-600" />
        ) : (
          <FiChevronUp className="text-neutral-600" />
        )}
      </button>
    </div>
  );
}
