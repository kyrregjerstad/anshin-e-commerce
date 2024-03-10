import { Button, buttonVariants } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { getSessionCookie } from '@/lib/server/auth/cookies';
import { getUserBySessionId } from '@/lib/server/services/userService';
import { InsertAddress } from '@/lib/server/tables';
import isEqual from 'lodash/isEqual';
import Link from 'next/link';
import { redirect } from 'next/navigation';

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
            address={billingAddress ?? shippingAddress}
            isSameAddress={sameAddress}
          />
        )}
      </div>
      <Link
        className={buttonVariants({ variant: 'default' })}
        href="/checkout/payment"
      >
        Continue to payment
      </Link>
    </section>
  );
}

const AddressCard = ({
  address,
  isSameAddress,
}: {
  address: InsertAddress;
  isSameAddress?: boolean;
}) => {
  const type = address.type === 'shipping' ? 'shipping' : 'billing';
  return (
    <Card variant="neutral" className="flex w-full flex-col justify-between">
      {isSameAddress ? (
        <>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              {address.type === 'shipping' ? 'Shipping' : 'Billing'}
            </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 md:gap-6">
            <p>Same as shipping</p>
          </CardContent>
          <div className="flex-1"></div>
          <CardFooter>
            <Link href={`/checkout/edit-address?type=billing`}>
              <Button>Edit</Button>
            </Link>
          </CardFooter>
        </>
      ) : (
        <>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              {address.type === 'shipping' ? 'Shipping' : 'Billing'}
            </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 md:gap-6">
            <div className="grid gap-1">
              <div className="font-medium">Name</div>
              <div>
                {address.firstName} {address.lastName}
              </div>
            </div>
            <div className="grid gap-1">
              <div className="font-medium">Address</div>
              <div>{address.streetAddress1}</div>
              <div>{address.streetAddress2}</div>
              <div>
                {address.city}, {address.state} {address.postalCode}
              </div>
              <div>{address.country}</div>
            </div>
          </CardContent>
          <CardFooter>
            <Link href={`/checkout/edit-address?type=${type}`}>
              <Button>Edit</Button>
            </Link>
          </CardFooter>
        </>
      )}
    </Card>
  );
};
