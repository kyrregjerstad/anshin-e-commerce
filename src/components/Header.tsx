import { CartIcon } from '@/components/CartIcon';
import Link from 'next/link';

import { Cart } from '@/lib/server/services/types';
import { LogOutButton } from './LogOutButton';

type Props = {
  user: {
    id: string;
    name: string;
  } | null;
  cart: Cart[];
};
export const Header = async ({ user, cart }: Props) => {
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
              <CartIcon cartItems={cart} />
            </Link>
          </li>
          <li>{user ? <LogOutButton /> : <Link href="/login">Login</Link>}</li>
        </ul>
      </nav>
    </header>
  );
};
