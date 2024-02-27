'use server';

import { and, eq } from 'drizzle-orm';
import { db } from './db';
import { cart, cartItems, guestCart } from './tables';
import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';

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

// function which get's the total amount of items in the cart
export async function getCartQuantity() {
  const cartId = getCartIdCookie();
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

export async function addItemToCart(productId: string, quantity: number) {
  const cartId = getCartIdCookie();

  const isGuestCart = cartId.startsWith('guest-');

  if (isGuestCart) {
    await db.insert(guestCart);
  } else {
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
  }

  revalidatePath('/cart');
}

export type CartItem = Awaited<ReturnType<typeof getCartById>>[number];

function getCartIdCookie() {
  const cartIdCookie = cookies().get('cartId')?.value;

  if (!cartIdCookie) {
    throw new Error('No cart found');
  }

  return cartIdCookie;
}

function createNewCart() {
  return db.insert(cart);
}
