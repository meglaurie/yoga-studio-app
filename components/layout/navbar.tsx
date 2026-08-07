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
    <header className="navbar">
      <nav className="navbar__container">
        <Link href="/" className="navbar__logo">
          Stillwater Yoga
        </Link>

        <ul className="navbar__menu">
          {navigation.map((item) => (
            <li key={item.href} className="navbar__item">
              <Link href={item.href} className="navbar__link">
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}