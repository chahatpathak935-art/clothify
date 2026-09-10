import { createContext, useContext, useState, useCallback, useEffect } from "react";
import api from "../api/axios";
import { useAuth } from "./AuthContext";

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const { user } = useAuth();
  const [cart, setCart] = useState({ items: [] });
  const [loading, setLoading] = useState(false);

  const refreshCart = useCallback(async () => {
    if (!user) {
      setCart({ items: [] });
      return;
    }
    setLoading(true);
    try {
      const { data } = await api.get("/cart");
      setCart(data);
    } catch (err) {
      console.error("Failed to load cart", err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    refreshCart();
  }, [refreshCart]);

  const addToCart = async (productId, variantId, quantity = 1) => {
    const { data } = await api.post("/cart/items", { productId, variantId, quantity });
    setCart(data);
    return data;
  };

  const updateQuantity = async (variantId, quantity) => {
    const { data } = await api.put(`/cart/items/${variantId}`, { quantity });
    setCart(data);
  };

  const removeFromCart = async (variantId) => {
    const { data } = await api.delete(`/cart/items/${variantId}`);
    setCart(data);
  };

  const clearCart = async () => {
    await api.delete("/cart");
    setCart({ items: [] });
  };

  const itemCount = cart.items?.reduce((sum, i) => sum + i.quantity, 0) || 0;
  const subtotal =
    cart.items?.reduce((sum, i) => sum + (i.product?.price || 0) * i.quantity, 0) || 0;

  const value = {
    cart,
    loading,
    itemCount,
    subtotal,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    refreshCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
};
