import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { ShippingForm } from './ShippingForm';
import { getSessionCookie } from '@/lib/server/auth/cookies';
import { getUserBySessionId } from '@/lib/server/services/userService';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Button, buttonVariants } from '@/components/ui/button';
import isEqual from 'lodash/isEqual';
import { InsertAddress } from '@/lib/server/tables';

export default async function CheckoutPage() {
  const sessionId = getSessionCookie();

  if (!sessionId) {
    return redirect('/login');
  }

  const user = await getUserBySessionId(sessionId);

  if (!user) {
    return redirect('/login');
  }

  const { shippingAddress, billingAddress } = user;

  return (
    <section className="flex w-full max-w-2xl flex-col gap-8">
      <h1 className="mb-4 text-3xl font-semibold">Address</h1>
      <div className="grid gap-6 md:grid-cols-2 md:gap-8">
        {shippingAddress ? (
          <AddressCard address={shippingAddress} />
        ) : (
          <ShippingForm shippingAddress={shippingAddress} />
        )}
        {billingAddress && (
          <AddressCard
            address={billingAddress}
            isSameAddress={isEqual(shippingAddress, billingAddress)}
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
  return (
    <Card variant="neutral" className="w-full">
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
            <Button>Edit</Button>
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
            <Button>Edit</Button>
          </CardFooter>
        </>
      )}
    </Card>
  );
};
