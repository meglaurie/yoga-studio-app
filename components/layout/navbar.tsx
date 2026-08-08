"use client";

import Link from "next/link";
import MobileMenu from "./MobileMenu";
import Logo from "@/components/ui/Logo";
import { navigation } from "@/components/data/navigation";

export default function Navbar() {
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
    {/* Mobile */}
    <MobileMenu navigation={navigation} />
    </nav>
  );
}