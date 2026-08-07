import Link from "next/link";
import { navigation } from "@/components/data/navigation";
import {
  FaFacebookF,
  FaInstagram,
  FaYoutube,
} from "react-icons/fa";


export default function Footer() {
  return (
    <footer className="bg-[#D9D9D9] text-black py-12">
      <div className="max-w-5xl mx-auto px-6 flex flex-col items-center text-center gap-6">
        {/* Studio Name */}
        <h2 className="text-2xl font-semibold">
          Still Water Yoga Studio
        </h2>

        {/* Contact Info */}
        <div className="space-y-1">
          <p>123 Serenity Lane</p>
          <p>Calgary, AB T2X 1Y5</p>
          <p>(403) 555-1234</p>
        </div>

        {/* Navigation */}
        <nav>
          <ul className="flex flex-wrap justify-center gap-6">
            {navigation.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="hover:underline"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Social Icons */}
        <div className="flex gap-6 text-[#818578] text-2xl">
          <Link
            href="https://facebook.com"
            aria-label="Facebook"
          >
            <FaFacebookF />
          </Link>

          <Link
            href="https://instagram.com"
            aria-label="Instagram"
          >
            <FaInstagram />
          </Link>

          <Link
            href="https://youtube.com"
            aria-label="YouTube"
          >
            <FaYoutube />
          </Link>
        </div>

        {/* Copyright */}
        <p className="text-sm mt-4">
          © {new Date().getFullYear()} Still Water Yoga Studio. All rights reserved.
        </p>
      </div>
    </footer>
  );
}