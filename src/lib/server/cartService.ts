'use server';

import { and, eq } from 'drizzle-orm';
import { db } from './db';
import { cart, cartItems } from './tables';
import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';

export async function addToCart(itemId: string, quantity: number) {
  await db.insert(cart);
}

export async function getCartById(cartId: number) {
  const res = await db.query.cart.findFirst({
    where: eq(cart.id, cartId),
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
  });

  if (!res) {
    return [];
  }

  const transformedCart = res.items.map((item) => ({
    ...item.product,
    quantity: item.quantity,
  }));

  return transformedCart;
}

export async function removeItemFromCart(itemId: string) {
  const cartId = getCartIdCookie();

  await db
    .delete(cartItems)
    .where(and(eq(cartItems.cartId, cartId), eq(cartItems.productId, itemId)));

  revalidatePath('/cart');
}

export async function updateItemQuantity(itemId: string, quantity: number) {
  const cartId = getCartIdCookie();

  await db
    .update(cartItems)
    .set({ quantity })
    .where(and(eq(cartItems.cartId, cartId), eq(cartItems.productId, itemId)));

  revalidatePath('/cart');
}

export type CartItem = Awaited<ReturnType<typeof getCartById>>[number];

function getCartIdCookie() {
  const cartIdCookie = cookies().get('cartId')?.value;

  if (!cartIdCookie) {
    throw new Error('No cart found');
  }

  return parseInt(cartIdCookie);
}
