import { SimpleForm } from '@/components/SimpleForm';
import { Button, buttonVariants } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getSessionCookie } from '@/lib/server/auth/cookies';
import { generateId, generateOrderId } from '@/lib/server/auth/utils';
import { db } from '@/lib/server/db';
import { createNewOrder } from '@/lib/server/services/orderService';
import { getUserBySessionId } from '@/lib/server/services/userService';
import { InsertAddress, users } from '@/lib/server/tables';
import { eq } from 'drizzle-orm';
import isEqual from 'lodash/isEqual';
import { redirect } from 'next/navigation';
import { OrderSummaryTable } from '@/components/OrderSummaryTable';
import Link from 'next/link';

export default async function ReviewPage() {
  const sessionId = getSessionCookie();

  if (!sessionId) {
    return redirect('/login');
  }

  const user = await getUserBySessionId(sessionId);

  if (!user) {
    return redirect('/login');
  }

  const { shippingAddress, billingAddress, id } = user;

  const cartItems = await getCheckoutCart(user.id);

  if (!shippingAddress) {
    return redirect('/checkout/edit-address');
  }

  const sameAddress =
    !billingAddress || isEqual(shippingAddress, billingAddress);

  const orderItems = cartItems.map(
    ({ id, quantity, priceInCents, discountInCents }) => ({
      productId: id,
      quantity,
      priceInCents,
      discountInCents,
    })
  );

  const handleCompleteOrder = async () => {
    'use server';
    const orderId = generateOrderId();
    try {
      await createNewOrder({
        orderId: orderId,
        userId: id,
        cartId: cartItems[0].cartId,
        items: orderItems,
      });
    } catch (error) {
      console.error(error);
    } finally {
      redirect(`/checkout/success?id=${orderId}`);
    }
  };

  return (
    <div className="flex w-full max-w-4xl flex-col gap-8">
      <h1 className="text-3xl font-semibold">Review</h1>
      <section>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-1 md:grid-cols-3">
          <AddressCard address={shippingAddress} />
          <AddressCard
            address={billingAddress ?? shippingAddress}
            isSameAddress={sameAddress}
          />
          <PaymentCard />
        </div>
      </section>
      <section>
        <div>
          <OrderSummaryTable items={cartItems} />
        </div>
      </section>
      <div className="flex w-full gap-2">
        <Link
          className={buttonVariants({
            variant: 'secondary',
            className: 'flex-1',
          })}
          href="/checkout/payment"
        >
          Back
        </Link>
        <SimpleForm
          className="flex-1"
          action={handleCompleteOrder}
          spinner={true}
          render={({ SubmitButton }) => (
            <SubmitButton className="w-full">Complete Order</SubmitButton>
          )}
        />
      </div>
    </div>
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
    <Card variant="neutral" className="flex flex-col">
      {isSameAddress ? (
        <>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              {address.type === 'shipping' ? 'Shipping' : 'Billing'}
            </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 md:gap-6">
            <p className="italic">Same as shipping</p>
          </CardContent>
          <div className="flex-1"></div>
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
              {address.firstName} {address.lastName}
              <div>{address.streetAddress1}</div>
              <div>{address.streetAddress2}</div>
              <div>
                {address.city}, {address.state} {address.postalCode}
              </div>
              <div>{address.country}</div>
            </div>
          </CardContent>
        </>
      )}
    </Card>
  );
};

const PaymentCard = () => {
  return (
    <Card variant="neutral" className="flex flex-col justify-between">
      <CardHeader>
        <CardTitle>Payment</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          <div className="grid gap-1">
            <div className="font-medium">Cardholder</div>
            <div>John Doe</div>
          </div>
          <div className="grid gap-1">
            <div className="font-medium">Card number</div>
            <div>**** **** **** 1234</div>
          </div>
          <div className="grid gap-1">
            <div className="font-medium">Expiration</div>
            <div>12/24</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

async function getCheckoutCart(userId: string) {
  const res = await db.query.users.findFirst({
    where: eq(users.id, userId),
    columns: {},
    with: {
      cart: {
        columns: {
          id: true,
        },
        with: {
          items: {
            columns: {
              quantity: true,
            },
            with: {
              product: {
                columns: {
                  id: true,
                  title: true,
                  priceInCents: true,
                  discountInCents: true,
                },
              },
            },
          },
        },
      },
    },
  });

  if (!res) {
    return [];
  }

  const transformedCart = res.cart.items.map((item) => ({
    ...item.product,
    price: item.product.priceInCents / 100,
    discountPrice: item.product.discountInCents / 100,
    totalPrice: (item.product.priceInCents * item.quantity) / 100,
    quantity: item.quantity,
    cartId: res.cart.id,
  }));

  return transformedCart;
}
