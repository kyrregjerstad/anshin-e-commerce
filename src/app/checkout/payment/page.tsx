import { buttonVariants } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getSessionCookie } from '@/lib/server/auth/cookies';
import { getUserBySessionId } from '@/lib/server/services/userService';
import Link from 'next/link';
import { redirect } from 'next/navigation';

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
      <h1 className="mb-4 text-3xl font-semibold">Payment</h1>

      <Link
        className={buttonVariants({ variant: 'default' })}
        href="/checkout/payment"
      >
        Continue to payment
      </Link>
    </section>
  );
}

const AddressCard = ({ address }) => {
  return (
    <Card variant="neutral" className="w-full">
      <CardHeader>
        <CardTitle>
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
    </Card>
  );
};
