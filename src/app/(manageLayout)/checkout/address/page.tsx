import { buttonVariants } from '@/components/ui/button';
import { getSessionCookie } from '@/lib/server/auth/cookies';
import { getUserBySessionId } from '@/lib/server/services/userService';
import isEqual from 'lodash/isEqual';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { AddressCard } from '@/components/AddressCard';
import { ChevronRightIcon } from '@heroicons/react/24/outline';

export default async function CheckoutPage() {
  const sessionId = getSessionCookie();

  if (!sessionId) {
    return redirect('/login');
  }

  const user = await getUserBySessionId(sessionId);

  if (!user) {
    return redirect('/login?callbackUrl=/checkout/address');
  }

  const { shippingAddress, billingAddress } = user;

  if (!shippingAddress) {
    return redirect('/checkout/edit-address');
  }

  const sameAddress =
    !billingAddress || isEqual(shippingAddress, billingAddress);

  const showBillingAddressForm = !sameAddress || !billingAddress;

  return (
    <section className="flex w-full max-w-2xl flex-col gap-8">
      <h1 className="mb-4 text-3xl font-semibold">Address</h1>
      <div className="grid gap-6 md:grid-cols-2 md:gap-8">
        {shippingAddress && <AddressCard address={shippingAddress} />}

        {showBillingAddressForm && (
          <AddressCard
            address={shippingAddress}
            isSameAddress={sameAddress}
            type="billing"
          />
        )}
      </div>
      <div className="flex w-full gap-4">
        <Link
          className={buttonVariants({
            variant: 'secondary',
            className: 'flex-1',
          })}
          href="/cart"
        >
          Back
        </Link>
        <Link
          className={buttonVariants({
            variant: 'default',
            className: 'group flex-1',
          })}
          href="/checkout/payment"
        >
          Payment
          <ChevronRightIcon className="size-5 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>
    </section>
  );
}
