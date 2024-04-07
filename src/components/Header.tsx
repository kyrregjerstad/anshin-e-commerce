import { CartIcon } from '@/components/CartIcon';
import Link from 'next/link';
import { Cart } from '@/lib/server/services/types';
import { UserAccountMenu } from './UserAccountMenu';
import Logo from './Logo';
import { logOut } from '@/lib/server/services/authService';

import {
  MagnifyingGlassIcon,
  UserCircleIcon,
  HeartIcon,
} from '@heroicons/react/24/outline';
import { SearchBar } from './SearchBar';

type Props = {
  showSearch?: boolean;
  user: {
    id: string;
    name: string;
  } | null;
  cart: Cart[];
};
export const Header = ({ user, cart, showSearch }: Props) => {
  return (
    <>
      <header className="sticky top-0 z-50 flex w-full items-center justify-center px-1">
        <nav className="flex w-full max-w-8xl items-center rounded-b-3xl border bg-tea-100 p-2 drop-shadow-sm">
          <ul className="flex w-full items-center justify-between gap-4">
            <li className="flex-1 sm:flex-initial">
              <Link href="/">
                <Logo />
                <span className="sr-only">home</span>
              </Link>
            </li>
            <li className="hidden flex-1 justify-center sm:flex">
              <SearchBar />
            </li>
            <li>
              <UserAccountMenu user={user} logOutAction={logOut}>
                <UserCircleIcon
                  className="size-8 stroke-neutral-700"
                  strokeWidth={1.3}
                />
              </UserAccountMenu>
            </li>
            <li>
              <Link href="/wishlist" className="group">
                <span className="sr-only">wishlist</span>
                <HeartIcon
                  className="size-8 stroke-neutral-700"
                  strokeWidth={1.3}
                />
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
      {showSearch && (
        <div className="sticky top-14 z-50 block w-full px-2 sm:hidden">
          <SearchBar />
        </div>
      )}
    </>
  );
};
