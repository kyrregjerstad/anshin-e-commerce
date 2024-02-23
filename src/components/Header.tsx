import React from 'react';
import { CartIcon } from '@/components/CartIcon';
import Link from 'next/link';

export const Header = () => {
  return (
    <header className="sticky top-0 z-50 flex w-full items-center justify-center px-1">
      <nav className="flex w-full max-w-[calc(1920px_+_8rem)] items-center rounded-b-3xl border bg-tea-100 p-4 drop-shadow-sm">
        <ul className="flex w-full items-center justify-between gap-4">
          <li>
            <Link href="/">Anshin</Link>
          </li>
          <li>
            <CartIcon />
          </li>
        </ul>
      </nav>
    </header>
  );
};
