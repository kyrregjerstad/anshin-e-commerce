import Link from 'next/link';
import { CartIcon } from './CartIcon';
import { validateRequest } from '@/lib/auth';

export const CartIconLink = async () => {
  const { cart } = await validateRequest();

  return (
    <Link href="/cart">
      <span className="sr-only">cart</span>
      <CartIcon cartItems={cart} />
    </Link>
  );
};
