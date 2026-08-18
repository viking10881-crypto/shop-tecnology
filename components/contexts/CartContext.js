// Frontend/components/contexts/CartContext.js
import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";

const CartContext = createContext(null);
const STORAGE_KEY = 'delasoft-cart';

const cartWithTotal = (items) => ({
  items,
  total: items.reduce((total, item) => total + Number(item.subtotal || 0), 0),
});

export function CartProvider({ children }) {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchCart = useCallback(async () => {
    setLoading(true);
    try {
      const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
      setCart(cartWithTotal(Array.isArray(stored) ? stored : []));
    } catch {
      setError('No fue posible recuperar el carrito.');
      setCart(cartWithTotal([]));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const save = (items) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    setCart(cartWithTotal(items));
  };

  const addItem = (product, cantidad = 1, variant = null) => {
    const items = cart?.items || [];
    const id = String(product.id);
    const variantId = variant?.id ?? null;
    // allow null/undefined equality for variants
    const existing = items.find(
      (item) => item.product_id === id && (item.variante == variantId)
    );

    const unitPrice = Number(
      product.precio ?? product.price ?? product.sale_price ?? 0
    );

    const next = existing
      ? items.map((item) =>
          item === existing
            ? {
                ...item,
                cantidad: item.cantidad + cantidad,
                subtotal: (item.cantidad + cantidad) * item.precio,
              }
            : item
        )
      : [
          ...items,
          {
            id: `${id}-${variantId ?? 'base'}`,
            product_id: id,
            variante: variantId,
            nombre: product.nombre || product.name,
            // try to show variant label if available
            nombre_variante:
              (variant && (variant.name || variant.nombre || `${variant.color || ''} ${variant.talla || ''}`)) ||
              product.nombre ||
              product.name,
            imagen: product.imagen_principal || product.image_url || null,
            precio: unitPrice,
            cantidad,
            subtotal: unitPrice * cantidad,
          },
        ];

    save(next);
    return Promise.resolve(cartWithTotal(next));
  };

  const updateItem = (itemId, cantidad) => {
    const next = (cart?.items || []).map((item) =>
      item.id === itemId ? { ...item, cantidad, subtotal: cantidad * item.precio } : item
    );
    save(next);
    return Promise.resolve(cartWithTotal(next));
  };

  const removeItem = (itemId) => {
    const next = (cart?.items || []).filter((item) => item.id !== itemId);
    save(next);
    return Promise.resolve(cartWithTotal(next));
  };

  const clearCartState = () => {
    save([]);
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
