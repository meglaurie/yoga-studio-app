"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

interface CartContextValue {
  productIds: string[];
  itemCount: number;
  addToCart: (productId: string) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  isInCart: (productId: string) => boolean;
}

const CartContext = createContext<CartContextValue | undefined>(undefined);

const STORAGE_KEY = "stillwater-cart";

export function CartProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [productIds, setProductIds] = useState<string[]>([]);

  useEffect(() => {
  window.localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(productIds),
  );
}, [productIds]);

  const addToCart = useCallback((productId: string) => {
    setProductIds((current) => {
      if (current.includes(productId)) {
        return current;
      }

      return [...current, productId];
    });
  }, []);

  const removeFromCart = useCallback((productId: string) => {
    setProductIds((current) =>
      current.filter((id) => id !== productId),
    );
  }, []);

  const clearCart = useCallback(() => {
    setProductIds([]);
  }, []);

  const isInCart = useCallback(
    (productId: string) => productIds.includes(productId),
    [productIds],
  );

  const value = useMemo<CartContextValue>(
    () => ({
      productIds,
      itemCount: productIds.length,
      addToCart,
      removeFromCart,
      clearCart,
      isInCart,
    }),
    [
      productIds,
      addToCart,
      removeFromCart,
      clearCart,
      isInCart,
    ],
  );

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }

  return context;
}