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
        <div className="mb-3 w-80 max-w-[90vw] rounded-[28px] border border-white/10 bg-neutral-900/50 backdrop-blur-2xl backdrop-saturate-150 shadow-2xl shadow-black/50 overflow-hidden animate-fade-in-up">
          <div className="px-4 py-3.5 flex items-center justify-between border-b border-white/10">
            <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] font-medium text-neutral-200">
              <FiShoppingBag className="text-neutral-400" />
              <span>Carrito ShopTecnology</span>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="w-6 h-6 flex items-center justify-center rounded-full bg-white/5 text-neutral-400 hover:bg-white/10 hover:text-white transition"
              aria-label="Cerrar carrito"
            >
              <FiX className="text-xs" />
            </button>
          </div>

          <div className="max-h-80 overflow-y-auto px-3 py-3 space-y-1">
            {loading && (
              <p className="text-xs text-neutral-500 px-1 py-2">Cargando carrito…</p>
            )}

            {error && (
              <div className="text-xs text-red-400 flex items-center justify-between gap-2 px-1 py-2">
                <span className="line-clamp-3">{error}</span>
                <button
                  type="button"
                  onClick={refreshCart}
                  className="flex items-center gap-1 text-[11px] uppercase tracking-[0.16em] text-neutral-100 border border-white/15 rounded-full px-2 py-1 shrink-0 hover:bg-white/10 transition"
                >
                  <FiRefreshCw className="text-[12px]" />
                  Reintentar
                </button>
              </div>
            )}

            {!loading && !error && items.length === 0 && (
              <div className="flex flex-col items-center gap-2 py-6 text-center">
                <FiShoppingBag className="text-2xl text-neutral-600" />
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
                  className="group flex items-center gap-3 rounded-2xl px-1 py-2 hover:bg-white/5 transition"
                >
                  <div className="w-12 h-12 shrink-0 rounded-xl overflow-hidden bg-white/5 border border-white/10 flex items-center justify-center">
                    {item.imagen ? (
                      <img
                        src={item.imagen}
                        alt={item.nombre || "Producto"}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <FiImage className="text-neutral-600 text-lg" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-neutral-100 line-clamp-1">
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
                    className="opacity-0 group-hover:opacity-100 shrink-0 text-neutral-500 hover:text-red-400 transition"
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

          <div className="px-4 py-3.5 border-t border-white/10 flex items-center justify-between bg-white/[0.03]">
            <div>
              <p className="text-[10px] uppercase tracking-[0.2em] text-neutral-500">
                Total
              </p>
              <p className="text-sm font-semibold text-white">
                {formatCOP(total)}
              </p>
            </div>

            <Link
              href="/carrito"
              className="px-4 py-2 rounded-full bg-white text-neutral-900 text-[11px] uppercase tracking-[0.2em] font-medium hover:bg-neutral-200 transition text-center"
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
        className="group relative flex items-center gap-2 rounded-full border border-white/10 bg-neutral-900/50 backdrop-blur-2xl backdrop-saturate-150 px-3 sm:px-4 py-2.5 shadow-xl shadow-black/40 hover:-translate-y-0.5 hover:border-white/20 transition max-w-[calc(100vw-2rem)]"
      >
        {/* Triangulito debajo */}
        <div className="absolute -bottom-1.5 right-6 w-3 h-3 bg-neutral-900/80 border-r border-b border-white/10 rotate-45 group-hover:translate-y-0.5 transition" />

        <div className="relative shrink-0">
          <FiShoppingBag className="text-neutral-200" />
          {itemCount > 0 && (
            <span className="absolute -top-2 -right-2 flex items-center justify-center min-w-[16px] h-4 px-1 rounded-full bg-white text-neutral-900 text-[9px] font-bold">
              {itemCount}
            </span>
          )}
        </div>

        <div className="hidden sm:flex flex-col items-start min-w-0">
          <span className="text-[10px] uppercase tracking-[0.2em] text-neutral-500">
            Carrito
          </span>
          <span className="text-xs text-neutral-100 truncate max-w-[160px]">
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
          <FiChevronDown className="text-neutral-400 shrink-0" />
        ) : (
          <FiChevronUp className="text-neutral-400 shrink-0" />
        )}
      </button>
    </div>
  );
}
