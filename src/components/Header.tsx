import { CartIconSvg } from '@/components/CartIcon';
import Link from 'next/link';
import Logo from './Logo';

import { HeartIcon, UserCircleIcon } from '@heroicons/react/24/outline';
import { Suspense } from 'react';
import { AccountMenuWrapper } from './AccountMenuWrapper';
import { CartIconLink } from './CartIconLink';
import { SearchBar, SearchBarSkeleton } from './SearchBar';

type Props = {
  showSearch?: boolean;
};
export const Header = ({ showSearch }: Props) => {
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
              <Suspense fallback={<SearchBarSkeleton />}>
                <SearchBar />
              </Suspense>
            </li>
            <li>
              <Suspense
                fallback={
                  <UserCircleIcon
                    className="size-8 stroke-neutral-700"
                    strokeWidth={1.3}
                  />
                }
              >
                <AccountMenuWrapper />
              </Suspense>
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
              <Suspense
                fallback={
                  <div className="-translate-y-[2px] pr-2">
                    <CartIconSvg cartAmount={undefined} />
                  </div>
                }
              >
                <CartIconLink />
              </Suspense>
            </li>
          </ul>
        </nav>
      </header>
      {showSearch && (
        <div className="sticky top-14 z-50 block w-full px-2 sm:hidden">
          <Suspense fallback={<SearchBarSkeleton />}>
            <SearchBar />
          </Suspense>
        </div>
      )}
    </>
  );
};
