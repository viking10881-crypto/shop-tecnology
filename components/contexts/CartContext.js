// Frontend/components/contexts/CartContext.js
import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";

const RAW_API_BASE =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";
const API_BASE = RAW_API_BASE.replace(/\/+$/, "");

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchCart = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${API_BASE}/carrito/`, {
        credentials: "include",
      });

      let data = null;
      try {
        data = await res.json();
      } catch {
        // puede venir vacío, no pasa nada
      }

      if (!res.ok) {
        const detail =
          (data && (data.detail || data.error)) ||
          "Error al cargar el carrito.";
        throw new Error(detail);
      }

      setCart(data);
    } catch (e) {
      console.error(e);
      setError(e.message || "Error al cargar el carrito. Intenta de nuevo.");
      setCart(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const safeRequest = async (url, options, fallbackMessage) => {
    try {
      setError("");
      const res = await fetch(url, {
        credentials: "include",
        ...options,
      });

      let data = null;
      try {
        data = await res.json();
      } catch {
        // si no hay JSON, data queda null
      }

      if (!res.ok) {
        const detail =
          (data && (data.detail || data.error)) || fallbackMessage;
        throw new Error(detail);
      }

      // Las vistas de carrito siempre devuelven el carrito completo
      if (data) {
        setCart(data);
      }

      return data;
    } catch (e) {
      console.error(e);
      setError(e.message || fallbackMessage);
      throw e;
    }
  };

  const addItem = (varianteId, cantidad = 1) =>
    safeRequest(
      `${API_BASE}/carrito/add/`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ variante_id: varianteId, cantidad }),
      },
      "No se pudo agregar el producto al carrito."
    );

  const updateItem = (itemId, cantidad) =>
    safeRequest(
      `${API_BASE}/carrito/items/${itemId}/`,
      {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cantidad }),
      },
      "No se pudo actualizar el carrito."
    );

  const removeItem = (itemId) =>
    safeRequest(
      `${API_BASE}/carrito/items/${itemId}/delete/`,
      {
        method: "DELETE",
      },
      "No se pudo quitar el producto del carrito."
    );

  const clearCartState = () => {
    setCart((prev) => (prev ? { ...prev, items: [], total: 0 } : prev));
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        loading,
        error,
        refreshCart: fetchCart,
        addItem,
        updateItem,
        removeItem,
        clearCartState,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error("useCart debe usarse dentro de CartProvider");
  }
  return ctx;
}
