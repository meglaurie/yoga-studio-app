"use client";

import Link from "next/link";
import MobileMenu from "./MobileMenu";
import { navigation } from "@/components/data/navigation";

export default function Navbar() {
  return (
    <nav className="navbar__container">
      <Link href="/" className="navbar__logo">
        Stillwater Yoga
      </Link>
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
    {/* Mobile */}
    <MobileMenu navigation={navigation} />
    </nav>
  );
}