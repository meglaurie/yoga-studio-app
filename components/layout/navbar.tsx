import Link from 'next/link';

const navigation = [
  {
    label: 'Home',
    href: '/',
  },
  {
    label: 'Schedule',
    href: '/schedule',
  },
  {
    label: 'Pricing',
    href: '/pricing',
  },
  {
    label: 'Contact',
    href: '/contact',
  },
  {
    label: 'Login',
    href: '/login',
  },
  {
    label: 'Create Account',
    href: '/register',
  },
];

export default function Navbar() {
  return (
    <nav className="background: --color-border rounded border-gray-200 px-2 py-2.5 sm:px-4 dark:bg-gray-900">
      <ul className="mx-auto flex flex-wrap items-center justify-between">
        <li>
          <Link href="/">
            <span className="self-center text-xl font-semibold whitespace-nowrap dark:text-white">
              Yoga Studio
            </span>
          </Link>
        </li>
        {navigation.map((item) => (
          <li key={item.href}>
            <Link
              href={item.href}
              className="block rounded py-2 pr-4 pl-3 text-gray-700 hover:bg-gray-100 md:border-0 md:p-0 md:hover:bg-transparent md:hover:text-blue-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent md:dark:hover:text-white"
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
