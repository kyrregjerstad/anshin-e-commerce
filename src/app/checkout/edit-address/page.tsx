import { getSessionCookie } from '@/lib/server/auth/cookies';
import { getUserBySessionId } from '@/lib/server/services/userService';
import { redirect } from 'next/navigation';
import { ShippingForm } from '../../../components/forms/ShippingForm';
import { upsertAddress } from './upsertAddress';

type Props = {
  searchParams: {
    type: 'shipping' | 'billing' | undefined;
  };
};

export default async function CheckoutPage({ searchParams }: Props) {
  const { type = 'shipping' } = searchParams;

  const sessionId = getSessionCookie();

  if (!sessionId) {
    return redirect('/login');
  }

  const user = await getUserBySessionId(sessionId);

  if (!user) {
    return redirect('/login');
  }

  const { shippingAddress, billingAddress } = user;

  const address = type === 'shipping' ? shippingAddress : billingAddress;

  return (
    <section className="flex w-full max-w-2xl flex-col gap-8">
      <h1 className="mb-4 text-3xl font-semibold">Address</h1>
      <div>
        <ShippingForm
          shippingAddress={address}
          addressType={type}
          submitFn={upsertAddress}
        />
      </div>
    </section>
  );
}
