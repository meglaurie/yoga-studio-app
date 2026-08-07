import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-gray-800 py-4 text-white">
      <ul>
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
      <div className="container mx-auto text-center">
        <p>&copy; {new Date().getFullYear()} Yoga Studio. All rights reserved.</p>
      </div>
    </footer>
  );
}
