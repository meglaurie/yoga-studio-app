"use client";

import { useState } from "react";
import Link from "next/link";
import clsx from "clsx";
import CartButton from "../cart/CartButton";
import CartDrawer from "../cart/CartDrawer";

interface NavItem {
  label: string;
  href: string;
}

interface MobileMenuProps {
  navigation: NavItem[];
}

export default function MobileMenu({
  navigation,
}: MobileMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
   const [isCartOpen, setIsCartOpen] = useState(false);
  return (
    <div className="md:hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="rounded p-2"
        aria-expanded={isOpen}
        aria-label="Toggle navigation menu"
      >
        ☰
      </button>

      <div
        className={clsx(
            "fixed top-16 left-0 z-40 h-[calc(100vh-4rem)] w-64 bg-white shadow-lg transition-transform duration-300",
            isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <ul className="flex flex-col gap-4">
          {navigation.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                onClick={() => setIsOpen(false)}
              >
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
      </div>
    </div>
  );
}