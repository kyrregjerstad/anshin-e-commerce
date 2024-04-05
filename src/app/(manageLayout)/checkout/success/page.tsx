import { buttonVariants } from '@/components/ui/button';
import { getSessionCookie } from '@/lib/server/auth/cookies';
import { getUserBySessionId } from '@/lib/server/services/userService';
import Link from 'next/link';
import { redirect } from 'next/navigation';

type Props = {
  searchParams?: {
    id?: string;
  };
};
export default async function CheckoutSuccessPage({ searchParams }: Props) {
  const sessionId = getSessionCookie();

  if (!sessionId) {
    return redirect('/login');
  }

  const user = await getUserBySessionId(sessionId);

  if (!user) {
    return redirect('/login');
  }

  return (
    <div className="flex w-full max-w-4xl flex-col gap-8">
      <section className="flex flex-col items-center justify-center text-center">
        <h1 className="pb-12 text-3xl font-semibold">
          Thank you, {user.name}!
        </h1>
        <h2 className="text-2xl">Your order is confirmed.</h2>
        <p>
          Your order number is <strong>{searchParams?.id}</strong>. We&apos;ll
          email you an order confirmation with details and tracking information.
        </p>
      </section>
      <Link href="/" className={buttonVariants()}>
        Back to Home
      </Link>
    </div>
  );
}
