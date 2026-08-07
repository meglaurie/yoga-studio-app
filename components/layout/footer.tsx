import Link from 'next/link';
import { navigation } from '@/components/data/navigation';
import Container from '@/components/layout/Container';
import { Heading } from '@/components/ui/Heading';

import {
  FaFacebookF,
  FaInstagram,
  FaYoutube,
} from 'react-icons/fa';

export default function Footer() {
  return (
    <footer className="footer">
      <Container>
        <div className="footer__content">
          <Heading as="h2" size="h3" className="footer__brand">
            Stillwater Yoga Studio
          </Heading>

          <div className="footer__contact">
            <p>123 Serenity Lane</p>
            <p>Calgary, AB T2X 1Y5</p>
            <p>(403) 555-1234</p>
          </div>

          <nav aria-label="Footer Navigation">
            <ul className="footer__menu">
              {navigation.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="footer__link">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="footer__social">
            <Link href="https://facebook.com" aria-label="Facebook">
              <FaFacebookF />
            </Link>

            <Link href="https://instagram.com" aria-label="Instagram">
              <FaInstagram />
            </Link>

            <Link href="https://youtube.com" aria-label="YouTube">
              <FaYoutube />
            </Link>
          </div>

          <p className="footer__copyright">
            © {new Date().getFullYear()} Stillwater Yoga Studio. All rights
            reserved.
          </p>
        </div>
      </Container>
    </footer>
  );
}