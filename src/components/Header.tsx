import { CartIcon } from '@/components/CartIcon';
import Link from 'next/link';

import { Cart } from '@/lib/server/services/types';
import { CircleUserRound, HeartIcon } from 'lucide-react';
import { UserAccountMenu } from './UserAccountMenu';
import Logo from './Logo';

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
      <nav className="flex w-full max-w-8xl items-center rounded-b-3xl border bg-tea-100 p-2 drop-shadow-sm">
        <UserAccountMenu user={user}>
          <CircleUserRound />
        </UserAccountMenu>
        <ul className="flex w-full items-center justify-between gap-2">
          <li className="flex-1">
            <Link href="/">
              <Logo />
            </Link>
          </li>
          <li className="">
            <Link href="/wishlist" className='group'>
              <span className="sr-only">wishlist</span>
              <HeartIcon />
            </Link>
          </li>
          <li>
            <Link href="/cart">
              <span className="sr-only">cart</span>
              <CartIcon cartItems={cart} />
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
};
