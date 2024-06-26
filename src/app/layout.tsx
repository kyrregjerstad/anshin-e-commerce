import { Analytics } from '@/components/Analytics';
import { Toaster } from '@/components/ui/sonner';
import type { Metadata } from 'next';
import { AxiomWebVitals } from 'next-axiom';
import { Inter } from 'next/font/google';
import Link from 'next/link';

import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Anshin | Home',
  description: 'Anshin - Your one stop shop for all things',
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <Analytics />
      <AxiomWebVitals />
      <link rel="icon" href="/favicon.ico" sizes="any" />
      <body className={inter.className}>
        {children}
        <div className="py-12" />
        <Footer />
        <Toaster />
      </body>
    </html>
  );
}

const Footer = () => {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="flex min-h-20 w-full flex-col items-center justify-center bg-card p-4">
      <span className="flex flex-col items-center">
        <span>Made with ❤️</span>
        <Link href="https://kyrre.dev" className="hover:underline">
          Kyrre Gjerstad
        </Link>
        Anshin &copy; {currentYear}
      </span>
    </footer>
  );
};
