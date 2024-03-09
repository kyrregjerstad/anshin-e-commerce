import { validateRequest } from '@/lib/auth';
import { CartItems } from './CartItems';
import Link from 'next/link';
import { Button, buttonVariants } from '@/components/ui/button';
import { db } from '@/lib/server/db';
import { cart, cartItems, images, products } from '@/lib/server/tables';
import { eq, sql } from 'drizzle-orm';
import Image from 'next/image';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from '@/components/ui/card';
import { QuantitySelector } from './QuantitySelector.1';
import { formatUSD } from './utils';

export type CartItem = {
  title: string;
  id: string;
  imageUrl: string;
  imageAlt: string;
  price: number;
  totalPrice: number;
  quantity: number;
};

const CartPage = async () => {
  const { cartId } = await validateRequest();

  if (!cartId) {
    return null;
  }

  const customerCart = await getCustomerCart(cartId);

  if (!customerCart) {
    return (
      <section>
        <h1>Cart is empty</h1>
      </section>
    );
  }

  return (
    <section className="grid w-full max-w-6xl grid-cols-2 gap-4 p-4">
      <div className="flex flex-col gap-4">
        {customerCart.items.map((item) => (
          <Card className="grid grid-cols-3 gap-1">
            <CardHeader className="col-span-1 p-4">
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
            <CardContent className="col-span-2 flex w-full flex-col justify-between py-4 pl-0 pr-4">
              <div className="flex w-full justify-between">
                <Link
                  href={`product/${item.id}`}
                  className="text-xl font-bold hover:underline"
                >
                  {item.title}
                </Link>
                <Button variant="ghost" size="smIcon" className="text-xl">
                  x
                </Button>
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
      <Card className="flex flex-col justify-between self-start">
        <CardHeader>
          <h1 className="text-2xl font-bold">Summary</h1>
        </CardHeader>
        <CardContent>
          <div>
            <p>Items: {customerCart.items.length}</p>
          </div>
          <p className="font-bold">
            Total: {formatUSD(customerCart.totalPrice)}
          </p>
        </CardContent>
        <CardFooter>
          <Link href="/checkout" className={`${buttonVariants()} w-full`}>
            Checkout
          </Link>
        </CardFooter>
      </Card>
    </section>
  );
};

export default CartPage;

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

  const customerCart = await db
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

  if (!customerCart || !customerCart.length || !customerCart[0].items) {
    return null;
  }

  return customerCart[0];
}
