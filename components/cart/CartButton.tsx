"use client";

import { useCart } from "@/components/cart/CartProvider";

interface CartButtonProps {
  onClick: () => void;
}

export default function CartButton({ onClick }: CartButtonProps) {
  const { itemCount } = useCart();

  return (
    <button
      type="button"
      onClick={onClick}
      className="relative inline-flex items-center gap-2"
      aria-label={`Shopping cart, ${itemCount} ${
        itemCount === 1 ? "item" : "items"
      }`}
    >
      <span>Cart</span>

      {itemCount > 0 && (
        <span
          className="inline-flex min-w-6 items-center justify-center rounded-full px-1.5 py-0.5 text-xs font-semibold"
          aria-hidden="true"
        >
          {itemCount}
        </span>
      )}
    </button>
  );
}