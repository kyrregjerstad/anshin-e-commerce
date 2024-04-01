import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { db } from '@/lib/server/db';
import { orders } from '@/lib/server/tables';
import { eq } from 'drizzle-orm';
import { notFound } from 'next/navigation';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { formatUSD } from '@/lib/utils';
import Link from 'next/link';
import { OrderSummaryTable } from '@/components/OrderSummaryTable';

const OrderDetailsPage = async ({
  params,
}: {
  params: { orderId: string };
}) => {
  const order = await getOrderByOrderId(params.orderId);

  if (!order) {
    return notFound();
  }

  return (
    <section>
      <div>
        <Card variant="neutral">
          <CardHeader>
            <h1 className="text-xl">Order Details</h1>
            <div>
              <p>Order ID: {order.id}</p>
              <p>Date: {order.createdAt.toLocaleDateString()}</p>
              <p>Status: {order.status}</p>
            </div>
          </CardHeader>
          <CardContent>
            <OrderSummaryTable items={order.items} />
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default OrderDetailsPage;

const OrderTable = ({ order }: { order: Order }) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Title</TableHead>
          <TableHead>Amount</TableHead>
          <TableHead>Items</TableHead>
          <TableHead>Total</TableHead>
          <TableHead>Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {order.items.map((item) => (
          <TableRow key={item.productId}>
            <TableCell>{order.createdAt.toLocaleDateString()}</TableCell>
            <TableCell>{item.quantity}</TableCell>
            <TableCell>{formatUSD(item.discountInCents)}</TableCell>
            <TableCell>{order.status}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

async function getOrderByOrderId(orderId: string) {
  const order = await db.query.orders.findFirst({
    where: eq(orders.id, orderId),
    with: {
      items: {
        columns: {
          productId: true,
          quantity: true,
          priceInCents: true,
          discountInCents: true,
        },
        with: {
          product: {
            columns: {
              title: true,
            },
          },
        },
      },
    },
  });

  if (!order) {
    return null;
  }

  const transformedOrder = {
    ...order,
    totalPrice:
      order.items.reduce(
        (acc, item) => acc + item.quantity * item.discountInCents,
        0
      ) / 100,
    items: order.items.map((item) => ({
      ...item,
      totalPrice: (item.priceInCents * item.quantity) / 100,
      price: item.priceInCents / 100,
      discountPrice: item.discountInCents / 100,
      title: item.product.title,
      id: item.productId,
    })),
  };

  return transformedOrder;
}

type Order = {
  id: string;
  createdAt: Date;
  status: string;
  totalPrice: number;
  items: {
    productId: string;
    quantity: number;
    priceInCents: number;
    discountInCents: number;
    title: string;
  }[];
};
