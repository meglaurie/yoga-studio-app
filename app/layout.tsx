import type { Metadata } from 'next';
import { Lato, Artifika } from 'next/font/google';
import './globals.css';

import AuthSessionProvider from "@/components/providers/SessionProvider";
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { CartProvider } from "@/components/cart/CartProvider";

const lato = Lato({
  subsets: ['latin'],
  variable: '--font-body',
  weight: ['400', '700'],
});

const artifika = Artifika({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-display',
});

export const metadata: Metadata = {
  title: 'Stillwater Yoga',
  description: 'A modern yoga studio booking platform',
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <html lang="en">
      <body className={`${lato.variable} ${artifika.variable}`}>
       <AuthSessionProvider>
        <CartProvider>
          <Navbar/>

          <main className="site-main">{children}</main>

          <Footer />
        </CartProvider>
      </AuthSessionProvider>
      </body>
    </html>
  );
}