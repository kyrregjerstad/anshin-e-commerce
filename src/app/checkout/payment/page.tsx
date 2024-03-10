import { buttonVariants } from '@/components/ui/button';
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
