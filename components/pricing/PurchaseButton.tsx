"use client";

import Button from "@/components/ui/Button";
import { useCart } from "@/components/cart/CartProvider";

interface PurchaseButtonProps {
  productId: string;
}

export default function PurchaseButton({
  productId,
}: PurchaseButtonProps) {
  const { addToCart, isInCart } = useCart();

  if (!productId) {
    return (
      <Button type="button">
        View Pricing
      </Button>
    );
  }

  const alreadyInCart = isInCart(productId);

  function handleAddToCart() {
    addToCart(productId);
  }

  return (
    <Button
      type="button"
      onClick={handleAddToCart}
      disabled={alreadyInCart}
    >
      {alreadyInCart ? "Added to Cart" : "Add to Cart"}
    </Button>
  );
}