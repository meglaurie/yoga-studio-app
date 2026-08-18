"use client";

import { useState } from "react";
import CartButton from "@/components/cart/CartButton";
import CartDrawer from "@/components/cart/CartDrawer";
import Link from "next/link";
import MobileMenu from "./MobileMenu";
import Logo from "@/components/ui/Logo";
import { navigation } from "@/components/data/navigation";

export default function Navbar() {
  const [isCartOpen, setIsCartOpen] = useState(false);
  return (
    <nav className="navbar__container">
      <Logo
        src="/imgs/mandala-svgrepo-com 2.png"
        alt="Stillwater Yoga Studio Logo"
        width={60}
        height={60}
      />
      {/* Desktop */}
      <ul className="navbar__menu">
        {navigation.map((item) => (
          <li key={item.href} className="navbar__item">
            <Link href={item.href} className="navbar__link">
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
      <CartButton onClick={() => setIsCartOpen(true)} />
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
      />
    {/* Mobile */}
    <MobileMenu navigation={navigation} />
    </nav>
  );
}