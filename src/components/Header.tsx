import React from 'react';
import { CartIcon } from '@/components/CartIcon';
import Link from 'next/link';
import { getServerCart } from '@/lib/server/cartService';
import { User } from 'lucia';

type Props = {
  user: User | null;
};
export const Header = async ({ user }: Props) => {
  const cartItems = user ? await getServerCart() : getLocalCart();
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

function getLocalCart() {
  try {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    return cart;
  } catch (error) {
    console.error(error);
    return [];
  }
}
