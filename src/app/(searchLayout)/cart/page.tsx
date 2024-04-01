import { Button, buttonVariants } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from '@/components/ui/card';
import { validateRequest } from '@/lib/auth';
import { db } from '@/lib/server/db';
import { cart, cartItems, images, products } from '@/lib/server/tables';
import { formatUSD } from '@/lib/utils';
import { eq, sql } from 'drizzle-orm';
import Image from 'next/image';
import Link from 'next/link';
import { QuantitySelector } from './QuantitySelector';
import { RemoveFromCartButton } from './RemoveFromCartButton';

const CartPage = async () => {
  const { cartId } = await validateRequest();

  if (!cartId) {
    return null;
  }

  const customerCart = await getCustomerCart(cartId);

  if (!customerCart || customerCart.items.length === 0) {
    return (
      <section>
        <h1>Cart is empty</h1>
      </section>
    );
  }

  const totalQuantity = customerCart.items.reduce(
    (acc, item) => acc + item.quantity,
    0
  );

  return (
    <section className="grid w-full max-w-5xl gap-4 p-4 md:grid-cols-2">
      <div className="flex flex-col gap-4">
        {customerCart.items.map((item) => (
          <Card className="grid grid-cols-3 gap-1 px-4 sm:px-0" key={item.id}>
            <CardHeader className="col-span-1 hidden p-4 sm:block">
              <div className="aspect-square overflow-hidden rounded-xl">
                <Image
                  src={item.imageUrl}
                  alt={item.imageAlt}
                  width={150}
                  height={150}
                  className="h-full w-full object-cover"
                />
              </div>
            </CardHeader>
            <CardContent className="col-span-3 flex w-full flex-col justify-between gap-2 py-4 pl-0 pr-0 sm:col-span-2 sm:pr-4">
              <div className="flex w-full justify-between">
                <Link
                  href={`product/${item.id}`}
                  className="text-xl font-bold hover:underline"
                >
                  {item.title}
                </Link>
                <RemoveFromCartButton itemId={item.id} cartId={cartId} />
              </div>
              <div className="flex items-center gap-4">
                <QuantitySelector cartId={cartId} item={item} />
                <span className="font-bold">{formatUSD(item.totalPrice)}</span>
              </div>
              <Button className="self-start" variant="outline">
                Move to wishlist
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
      <SummaryCard
        totalQuantity={totalQuantity}
        totalPrice={customerCart.totalPrice}
      />
    </section>
  );
};

export default CartPage;

const SummaryCard = ({
  totalQuantity,
  totalPrice,
}: {
  totalQuantity: number;
  totalPrice: number;
}) => {
  return (
    <Card className="flex flex-col justify-between self-start">
      <CardHeader>
        <h1 className="text-2xl font-bold">Summary</h1>
      </CardHeader>
      <CardContent>
        <div>
          <p>Items: {totalQuantity}</p>
        </div>
        <p className="font-bold">Total: {formatUSD(totalPrice)}</p>
      </CardContent>
      <CardFooter>
        <Link href="/checkout/address" className={`${buttonVariants()} w-full`}>
          Checkout
        </Link>
      </CardFooter>
    </Card>
  );
};

export type CartItem = {
  title: string;
  id: string;
  imageUrl: string;
  imageAlt: string;
  price: number;
  totalPrice: number;
  quantity: number;
};

async function getCustomerCart(cartId: string) {
  const itemSubquery = db
    .select({
      title: products.title,
      cartId: cartItems.cartId,
      id: cartItems.productId,
      quantity: cartItems.quantity,
      imageUrl: sql<string>`(
        SELECT ${images.url}
        FROM ${images}
        WHERE ${images.itemId} = ${products.id}
        LIMIT 1
      )`
        .mapWith(String)
        .as('imageUrl'),
      imageAlt: sql<string>`(
        SELECT ${images.alt}
        FROM ${images}
        WHERE ${images.itemId} = ${products.id}
        LIMIT 1
      )`
        .mapWith(String)
        .as('imageAlt'),
      price: sql<number>`(${products.priceInCents} / 100)`
        .mapWith(Number)
        .as('price'),
      totalPrice:
        sql<number>`ROUND((${cartItems.quantity} * ${products.priceInCents}) / 100, 2)`
          .mapWith(Number)
          .as('totalPrice'),
    })
    .from(cartItems)
    .leftJoin(products, eq(cartItems.productId, products.id))
    .where(eq(cartItems.cartId, cartId))
    .as('items');

  const cartQuery = await db
    .select({
      cartId: cart.id,
      items: sql<CartItem[]>`JSON_ARRAYAGG(
        JSON_OBJECT(
          'title', ${itemSubquery.title},
          'id', ${itemSubquery.id},
          'imageUrl', ${itemSubquery.imageUrl},
          'imageAlt', ${itemSubquery.imageAlt},
          'quantity', ${itemSubquery.quantity},
          'price', ${itemSubquery.price},
          'totalPrice', ${itemSubquery.totalPrice}
        )
      )`,
      totalPrice: sql<number>`SUM(${itemSubquery.totalPrice})`,
    })
    .from(cart)
    .leftJoin(itemSubquery, eq(cart.id, itemSubquery.cartId))
    .groupBy(cart.id)
    .where(eq(cart.id, cartId));

  const customerCart = cartQuery[0];

  // the query returns an object with every field as null if the cart is empty
  if (
    !customerCart ||
    !customerCart.items ||
    customerCart.items.length === 0 ||
    customerCart.items[0].id === null
  ) {
    return null;
  }

  return customerCart;
}
