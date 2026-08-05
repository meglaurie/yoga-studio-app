import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="bg-white border-gray-200 px-2 sm:px-4 py-2.5 rounded dark:bg-gray-900">
        <ul className="flex flex-wrap items-center justify-between mx-auto">
            <li>
                <Link href="/">
                    <span className="self-center text-xl font-semibold whitespace-nowrap dark:text-white">Yoga Studio</span>
                </Link>
            </li>
            <li>
                <Link href="/">Home</Link>
            </li>
            <li>
                <Link href="/pricing">Pricing</Link>
            </li>
             <li>
                <Link href="/schedule">Schedule</Link>
            </li>
             <li>
                <Link href="/contact">Contact</Link>
            </li>
             <li>
                <Link href="/login">Login</Link>
            </li>
             <li>
                <Link href="/register">Create Account</Link>
            </li>
        </ul>
    </nav>
  );
}