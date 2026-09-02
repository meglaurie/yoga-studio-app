"use client";

import { signOut } from "next-auth/react";
import { useState } from "react";
import Link from "next/link";
import clsx from "clsx";

interface NavItem {
  label: string;
  href: string;
}

interface MobileMenuProps {
  navigation: NavItem[];
  isAuthenticated: boolean;
  dashboardHref: string;
}

export default function MobileMenu({
  navigation,
  isAuthenticated,
  dashboardHref,
}: MobileMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  // Hide Login/Create Account when authenticated
  const filteredNavigation = navigation.filter(
    (item) => !(isAuthenticated && (item.label === "Login" || item.label === "Create Account"))
  );
  
  return (
    <div className="relative md:hidden">
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
          {filteredNavigation.map((item) => (
          <li key={item.href}>
            <Link
              href={item.href}
              onClick={() => setIsOpen(false)}
            >
              {item.label}
            </Link>
          </li>
        ))}

        {isAuthenticated && (
          <>
            <li>
              <Link
                href={dashboardHref}
                className="navbar__link"
                onClick={() => setIsOpen(false)}
              >
                Dashboard
              </Link>
            </li>

            <li>
             <button
                onClick={() => signOut({ callbackUrl: "/login" })}
                className="navbar__link"
                style={{ background: "none", border: "none", padding: 0, cursor: "pointer" }}
              >
              Logout
            </button>
            </li>
          </>
        )}
        </ul>
     
      </div>
    </div>
  );
}