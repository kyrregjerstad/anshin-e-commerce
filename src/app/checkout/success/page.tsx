import { SimpleForm } from '@/components/SimpleForm';
import { Button, buttonVariants } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { getSessionCookie } from '@/lib/server/auth/cookies';
import { db } from '@/lib/server/db';
import { createNewOrder } from '@/lib/server/services/orderService';
import { getUserBySessionId } from '@/lib/server/services/userService';
import { InsertAddress, users } from '@/lib/server/tables';
import { formatUSD } from '@/lib/utils';
import { eq } from 'drizzle-orm';
import isEqual from 'lodash/isEqual';
import Link from 'next/link';
import { redirect } from 'next/navigation';

type Props = {
  searchParams?: {
    orderId?: string;
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
      <section>
        <h1 className="pb-12 text-3xl font-semibold">
          Thank you, {user.name}!
        </h1>
        <h2 className="text-2xl">Your order is confirmed.</h2>
        <p>
          Your order number is <strong>{searchParams?.orderId}</strong>.
          We&apos;ll email you an order confirmation with details and tracking
          information.
        </p>
      </section>
      <Link href="/" className={buttonVariants()}>
        Back to Home
      </Link>
    </div>
  );
}
