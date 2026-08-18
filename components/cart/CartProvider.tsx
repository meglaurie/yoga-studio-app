"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useSyncExternalStore,
} from "react";

interface CartContextValue {
  productIds: string[];
  itemCount: number;
  addToCart: (productId: string) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  isInCart: (productId: string) => boolean;
}

const CartContext = createContext<CartContextValue | undefined>(
  undefined,
);

const STORAGE_KEY = "stillwater-cart";

const EMPTY_CART: string[] = [];

let cachedProductIds: string[] = [];
let initialized = false;

const listeners = new Set<() => void>();

function notifyListeners() {
  for (const listener of listeners) {
    listener();
  }
}

function readStoredCart(): string[] {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const storedCart = window.localStorage.getItem(STORAGE_KEY);

    if (!storedCart) {
      return [];
    }

    const parsed: unknown = JSON.parse(storedCart);

    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed.filter(
      (productId): productId is string =>
        typeof productId === "string",
    );
  } catch {
    window.localStorage.removeItem(STORAGE_KEY);
    return [];
  }
}

function getSnapshot() {
  if (!initialized && typeof window !== "undefined") {
    cachedProductIds = readStoredCart();
    initialized = true;
  }

  return cachedProductIds;
}

function getServerSnapshot() {
  return EMPTY_CART;
}

function subscribe(listener: () => void) {
  listeners.add(listener);

  return () => {
    listeners.delete(listener);
  };
}

function updateCart(productIds: string[]) {
  cachedProductIds = productIds;
  initialized = true;

  if (typeof window !== "undefined") {
    if (productIds.length === 0) {
      window.localStorage.removeItem(STORAGE_KEY);
    } else {
      window.localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(productIds),
      );
    }
  }

  notifyListeners();
}

export function CartProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const productIds = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );

  const addToCart = useCallback((productId: string) => {
    const current = getSnapshot();

    if (current.includes(productId)) {
      return;
    }

    updateCart([...current, productId]);
  }, []);

  const removeFromCart = useCallback((productId: string) => {
    const current = getSnapshot();

    updateCart(
      current.filter((id) => id !== productId),
    );
  }, []);

  const clearCart = useCallback(() => {
    updateCart([]);
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