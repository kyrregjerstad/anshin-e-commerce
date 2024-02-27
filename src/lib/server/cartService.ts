'use server';

import { and, asc, desc, eq } from 'drizzle-orm';
import { db } from './db';
import { cart, cartItems } from './tables';
import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';
import { generateId } from './auth/utils';

export async function getCartById(cartId: string) {
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

export async function getCart() {
  const cartId = getCartIdCookie();
  if (!cartId) return [];

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

export async function getCartQuantity() {
  const cartId = getCartIdCookie();
  if (!cartId) return;

  const res = await db.query.cart.findFirst({
    where: eq(cart.id, cartId),
    with: {
      items: {
        columns: {
          quantity: true,
        },
      },
    },
  });

  if (!res) {
    return 0;
  }

  const total = res.items.reduce((acc, item) => acc + item.quantity, 0);

  return total;
}

export async function removeItemFromCart(itemId: string) {
  const cartId = getCartIdCookie();
  if (!cartId) return;

  await db
    .delete(cartItems)
    .where(and(eq(cartItems.cartId, cartId), eq(cartItems.productId, itemId)));

  revalidatePath('/cart');
}

export async function updateItemQuantity(itemId: string, quantity: number) {
  const cartId = getCartIdCookie();
  if (!cartId) return;

  await db
    .update(cartItems)
    .set({ quantity })
    .where(and(eq(cartItems.cartId, cartId), eq(cartItems.productId, itemId)));

  revalidatePath('/cart');
}

export async function addItemToCart(productId: string, quantity: number) {
  const cartId = getCartIdCookie();
  if (!cartId) return;

  const isGuestCart = cartId.startsWith('guest-');

  await db
    .insert(cartItems)
    .values({
      cartId,
      productId: productId,
      quantity: quantity,
    })
    .onDuplicateKeyUpdate({
      set: {
        quantity: quantity,
      },
    });

  revalidatePath('/cart');
}

export type CartItem = Awaited<ReturnType<typeof getCartById>>[number];

function getCartIdCookie() {
  const cartIdCookie = cookies().get('cartId')?.value;

  if (!cartIdCookie) {
    return null;
  }

  return cartIdCookie;
}

export async function createCart(sessionId: string, userId?: string) {
  const cartId = generateId();
  await db.insert(cart).values({ id: cartId, sessionId, userId });
  return cartId;
}

export async function getOrCreateCart(sessionId: string, userId: string) {
  const res = await db.query.cart.findFirst({
    where: eq(cart.userId, userId),
    orderBy: [desc(cart.updatedAt)],
  });

  if (!res) {
    return createCart(sessionId, userId);
  }

  if (res.sessionId !== sessionId) {
    await db.update(cart).set({ sessionId }).where(eq(cart.id, res.id));
  }

  return res.id;
}
