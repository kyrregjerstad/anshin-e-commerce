'use server';

import { and, eq } from 'drizzle-orm';
import { db } from './db';
import { cart, cartItems } from './tables';

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

export async function removeItemFromCart(cartId: number, itemId: string) {
  await db
    .delete(cartItems)
    .where(and(eq(cartItems.cartId, cartId), eq(cartItems.productId, itemId)));
}

// function to increment/decrement quantity
export async function updateItemQuantity(
  cartId: number,
  itemId: string,
  quantity: number
) {
  await db
    .update(cartItems)
    .set({ quantity })
    .where(and(eq(cartItems.cartId, cartId), eq(cartItems.productId, itemId)));
}

export type CartItem = Awaited<ReturnType<typeof getCartById>>[number];
