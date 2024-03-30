import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { getSessionCookie } from '@/lib/server/auth/cookies';
import { db } from '@/lib/server/db';
import { OrderStatus, sessions } from '@/lib/server/tables';
import { formatUSD } from '@/lib/utils';
import { eq } from 'drizzle-orm';
import Link from 'next/link';
import { redirect } from 'next/navigation';

export default async function AccountPage() {
  const sessionId = getSessionCookie();

  if (!sessionId) {
    return redirect('/login');
  }

  const profile = await getUserProfileDetails(sessionId);

  if (!profile) {
    return redirect('/login');
  }

  const { user, orders } = profile;

  const { shippingAddress, billingAddress } = user;

  return (
    <>
      <section className="flex w-full flex-col gap-8 pt-8">
        <Card variant="neutral" className="w-full">
          <CardHeader>
            <CardTitle>Profile</CardTitle>
            <CardDescription>
              Your profile information is used to personalize your experience.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 md:gap-6">
            <div className="flex justify-between gap-2">
              <div className="grid gap-1">
                <div className="font-medium">Name</div>
                <div>{user.name}</div>
              </div>
              <div className="grid gap-1">
                <div className="font-medium">Email</div>
                <div>{user.email}</div>
              </div>
            </div>
            <div className="grid gap-1">
              <div className="font-medium">Password</div>
              <div>
                <Link
                  className="text-blue-600 underline transition-all hover:underline"
                  href="#"
                >
                  Change password
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card variant="neutral">
          <CardHeader>
            <CardTitle>Addresses</CardTitle>
            <CardDescription>
              Manage your shipping and billing addresses.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-2">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Shipping</TableHead>
                  <TableHead>Billing</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>
                    <DisplayAddress address={shippingAddress} />
                  </TableCell>
                  <TableCell>
                    <DisplayAddress address={billingAddress} />
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card variant="neutral">
          <CardHeader>
            <CardTitle>Order history</CardTitle>
            <CardDescription>
              View details about your past orders.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <OrderHistoryTable orders={orders} />
          </CardContent>
        </Card>
      </section>
    </>
  );
}
type Address = {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  streetAddress1: string;
  streetAddress2: string | null;
  city: string | null;
  state: string | null;
  postalCode: string;
  country: string;
  type: 'shipping' | 'billing';
};
const DisplayAddress = ({ address }: { address: Address | null }) => {
  if (!address) {
    return (
      <div>
        <div className="font-medium">No address on file</div>
      </div>
    );
  }
  return (
    <div>
      <div className="font-medium">
        {address.firstName} {address.lastName}
      </div>
      <div>{address.streetAddress1}</div>
      <div>{address.streetAddress2}</div>
      <div>
        {address.city}, {address.state} {address.postalCode}
      </div>
      <div>{address.country}</div>
    </div>
  );
};

type OrdersTableProps = {
  orders: Order[];
};
const OrderHistoryTable = ({ orders }: OrdersTableProps) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">Order</TableHead>
          <TableHead className="min-w-[150px]">Date</TableHead>
          <TableHead className="hidden md:table-cell">Items</TableHead>
          <TableHead className="text-right">Total</TableHead>
          <TableHead className="hidden sm:table-cell">Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {orders.map((order) => (
          <TableRow key={order.id}>
            <TableCell>
              <Link href={`/orders/${order.id}`}>{order.id}</Link>
            </TableCell>
            <TableCell>{order.createdAt.toLocaleDateString()}</TableCell>
            <TableCell className="hidden md:table-cell">
              {order.items.length}
            </TableCell>
            <TableCell className="text-right">
              {formatUSD(order.totalPrice)}
            </TableCell>
            <TableCell className="hidden sm:table-cell">
              {order.status}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

async function getUserProfileDetails(sessionId: string) {
  const res = await db.query.sessions.findFirst({
    where: eq(sessions.id, sessionId),
    with: {
      user: {
        with: {
          addresses: true,
          orders: {
            with: {
              items: {
                columns: {
                  quantity: true,
                  priceInCents: true,
                  discountInCents: true,
                },
              },
            },
            columns: {
              id: true,
              createdAt: true,
              status: true,
            },
          },
        },
      },
    },
  });

  if (!res || !res.user) {
    return null;
  }

  const transformedOrders = res.user.orders.map((order) => {
    const totalPrice = order.items.reduce(
      (acc, item) => acc + item.quantity * item.priceInCents,
      0
    );

    return {
      ...order,
      totalPrice: totalPrice / 100,
    };
  });

  const transformedUser = {
    id: res.user.id,
    name: res.user.name,
    email: res.user.email,
    shippingAddress:
      res.user.addresses.find((a) => a.type === 'shipping') || null,
    billingAddress:
      res.user.addresses.find((a) => a.type === 'billing') || null,
  };

  return {
    user: transformedUser,
    orders: transformedOrders,
  };
}

type Order = {
  id: string;
  createdAt: Date;
  status: OrderStatus;
  items: {
    quantity: number;
    priceInCents: number;
    discountInCents: number;
  }[];
  totalPrice: number;
};
