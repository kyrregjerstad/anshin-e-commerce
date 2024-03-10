import { PaymentForm } from '@/components/forms/PaymentForm';
import { getSessionCookie } from '@/lib/server/auth/cookies';
import { verifyPayment } from '@/lib/server/services/cardService';
import { getUserBySessionId } from '@/lib/server/services/userService';
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
      <PaymentForm submitFn={verifyPayment} />
    </section>
  );
}
