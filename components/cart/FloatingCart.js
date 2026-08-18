// components/cart/FloatingCart.js
import { useState, useMemo } from "react";
import Link from "next/link";
import { useCart } from "@/components/contexts/CartContext";
import {
  FiShoppingBag,
  FiChevronUp,
  FiChevronDown,
  FiRefreshCw,
} from "react-icons/fi";

export default function FloatingCart() {
  const { cart, loading, error, refreshCart } = useCart();
  const [open, setOpen] = useState(false);

  const items = cart?.items ?? [];

  const itemCount = useMemo(
    () => items.reduce((acc, item) => acc + (item.cantidad || 0), 0),
    [items]
  );

  const total = Number(cart?.total ?? 0);

  const hasItems = !loading && !error && items.length > 0;

  return (
    <div className="fixed bottom-4 right-4 z-40">
      {/* Panel desplegable */}
      {open && (
        <div className="mb-3 w-80 max-w-[90vw] rounded-3xl border border-neutral-900/10 bg-white/95 backdrop-blur shadow-2xl shadow-neutral-900/10 overflow-hidden">
          <div className="px-4 py-3 flex items-center justify-between border-b border-neutral-200">
            <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em]">
              <FiShoppingBag className="text-neutral-600" />
              <span>Carrito ShopTecnology</span>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="text-[11px] text-neutral-500 hover:text-neutral-900"
            >
              Cerrar
            </button>
          </div>

          <div className="max-h-64 overflow-y-auto px-4 py-3 space-y-2">
            {loading && (
              <p className="text-xs text-neutral-500">Cargando carrito…</p>
            )}

            {error && (
              <div className="text-xs text-red-500 flex items-center justify-between gap-2">
                <span className="line-clamp-3">{error}</span>
                <button
                  type="button"
                  onClick={refreshCart}
                  className="flex items-center gap-1 text-[11px] uppercase tracking-[0.16em] text-neutral-900 border border-neutral-900/20 rounded-full px-2 py-1"
                >
                  <FiRefreshCw className="text-[12px]" />
                  Reintentar
                </button>
              </div>
            )}

            {!loading && !error && items.length === 0 && (
              <p className="text-xs text-neutral-500">
                Tu carrito está vacío. Explora nuestros productos tecnológicos.
              </p>
            )}

            {hasItems &&
              items.slice(0, 3).map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between gap-2 text-xs"
                >
                  <span className="line-clamp-1 flex-1 text-neutral-800">
                    {item.nombre_variante ||
                      item.nombre ||
                      `Producto #${item.variante ?? item.id}`}
                  </span>
                  <span className="text-neutral-500">×{item.cantidad}</span>
                  <span className="text-neutral-900">
                    {Number(item.subtotal || 0).toLocaleString("es-CO", {
                      style: "currency",
                      currency: "COP",
                    })}
                  </span>
                </div>
              ))}
          </div>

          <div className="px-4 py-3 border-t border-neutral-200 flex items-center justify-between bg-neutral-50">
            <div>
              <p className="text-[10px] uppercase tracking-[0.2em] text-neutral-500">
                Total
              </p>
              <p className="text-sm font-medium">
                {total.toLocaleString("es-CO", {
                  style: "currency",
                  currency: "COP",
                })}
              </p>
            </div>

            <Link
              href="/carrito"
              className="px-4 py-2 rounded-full bg-neutral-900 text-white text-[11px] uppercase tracking-[0.2em] hover:bg-black text-center"
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
        <FiShoppingBag className="text-neutral-800" />
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
              : `${itemCount} pieza${
                  itemCount > 1 ? "s" : ""
                } · ${total.toLocaleString("es-CO", {
                  style: "currency",
                  currency: "COP",
                })}`}
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
