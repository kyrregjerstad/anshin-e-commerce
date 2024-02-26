import React from 'react';
import { CartIcon } from '@/components/CartIcon';
import Link from 'next/link';
import { getCart } from '@/lib/server/cartService';

export const Header = async () => {
  const cartItems = await getCart();
  return (
    <header className="sticky top-0 z-50 flex w-full items-center justify-center px-1">
      <nav className="flex w-full max-w-[calc(1920px_+_8rem)] items-center rounded-b-3xl border bg-tea-100 p-4 drop-shadow-sm">
        <ul className="flex w-full items-center justify-between gap-4">
          <li>
            <Link href="/">Anshin</Link>
          </li>
          <li>
            <Link href="/cart">
              <span className="sr-only">cart</span>
              <CartIcon cartItems={cartItems} />
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
};
