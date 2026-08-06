import Link from "next/link";

const navigation = [
{
    label: "Home",
    href: "/",
  },
  {
    label: "Schedule",
    href: "/schedule",
  },
  {
    label: "Pricing",
    href: "/pricing",
  },
  {
    label: "Contact",
    href: "/contact",
  },
  {
    label: "Login",
    href: "/login",
  },
  {
    label: "Create Account",
    href: "/register",
  },
];

export default function Navbar() {
  return (
    <nav className="bg-white border-gray-200 px-2 sm:px-4 py-2.5 rounded dark:bg-gray-900">
        <ul className="flex flex-wrap items-center justify-between mx-auto">
            <li>
                <Link href="/">
                    <span className="self-center text-xl font-semibold whitespace-nowrap dark:text-white">Yoga Studio</span>
                </Link>
            </li>
            {navigation.map((item) => (
                <li key={item.href}>
                    <Link  href={item.href} className="block py-2 pl-3 pr-4 text-gray-700 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-gray-400 md:dark:hover:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent">
                    {item.label}
                    </Link>
                </li>
            ))}
        </ul>
    </nav>
  );
}