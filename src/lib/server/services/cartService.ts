'use server';

import { and, eq, sql } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';
import { getSessionCookie } from '../auth/cookies';
import { generateId } from '../auth/utils';

import { Product } from './productService';
import { cart, cartItems, sessions } from '../tables';
import { createSession } from './sessionService';
import { redirect } from 'next/navigation';
import { db } from '@/lib/server/db';

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

export async function getCartBySessionId(sessionId: string) {
  const res = await db.query.cart.findFirst({
    where: eq(cart.sessionId, sessionId),
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
  });

  if (!res) {
    return { cartId: null, items: [] };
  }

  const transformedCart = res.items.map((item) => ({
    ...item.product,
    quantity: item.quantity,
  }));

  return {
    cartId: res.id,
    items: transformedCart,
  };
}

export async function getCartByUserId(userId: string) {
  const res = await db.query.cart.findFirst({
    where: eq(cart.userId, userId),
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
  });

  if (!res) {
    return {
      cartId: null,
      items: [] as CartItem[],
    };
  }

  const transformedCart = res.items.map((item) => ({
    ...item.product,
    quantity: item.quantity,
  }));

  return {
    cartId: res.id,
    items: transformedCart,
  };
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

export async function handleRemoveFromCart(itemId: string) {
  const sessionId = getSessionCookie();
  if (!sessionId) {
    redirect('/cart');
  }
  const session = await getSessionDetails(sessionId);
  if (!session) {
    throw new Error('Session not found');
  }
  const cartId = session.cart?.id || session.user?.cart.id;

  if (!cartId) {
    throw new Error('Cart not found');
  }

  await db
    .delete(cartItems)
    .where(and(eq(cartItems.cartId, cartId), eq(cartItems.productId, itemId)));

  revalidatePath('/cart');
}

export async function updateItemQuantity(
  cartId: string,
  itemId: string,
  quantity: number
) {
  await db
    .update(cartItems)
    .set({ quantity })
    .where(and(eq(cartItems.cartId, cartId), eq(cartItems.productId, itemId)));

  revalidatePath('/cart');
}

type AddItemToCartParams = {
  productId: string;
  quantity: number;
};

export async function handleAddToCart({
  productId,
  quantity,
}: AddItemToCartParams) {
  const sessionId = getSessionCookie();

  if (!sessionId) {
    return { error: `Oh dear, that didn't work! please try again` }; // in the edge case where the user interacts with the cart while their session cookie is missing or expired
  }

  const selectedCartId = await getOrCreateCart(sessionId);

  await db
    .insert(cartItems)
    .values({
      cartId: selectedCartId,
      productId: productId,
      quantity: quantity,
    })
    .onDuplicateKeyUpdate({
      set: {
        quantity: sql`${cartItems.quantity} + ${quantity}`,
      },
    });

  revalidatePath('/cart');
}

export type CartItem = Awaited<ReturnType<typeof getCartById>>[number];

async function getSessionDetails(sessionId: string) {
  return await db.query.sessions.findFirst({
    where: eq(sessions.id, sessionId),
    with: {
      user: {
        columns: {
          id: true,
        },
        with: {
          cart: {
            columns: {
              id: true,
            },
          },
        },
      },
      cart: {
        columns: {
          id: true,
        },
      },
    },
  });
}

function getCartIdCookie() {
  const cartIdCookie = cookies().get('cartId')?.value;

  if (!cartIdCookie) {
    return null;
  }

  return cartIdCookie;
}

export async function createCart(sessionId: string, userId?: string | null) {
  const cartId = generateId({ guest: !userId });
  await db.insert(cart).values({ id: cartId, sessionId, userId }).execute();
  return cartId;
}

export async function getOrCreateCart(sessionId: string) {
  const existingSession = await getSessionDetails(sessionId);

  // If session doesn't exist, create a new one - this can happen if the session is deleted in the db, but still exists in the user's cookies
  if (!existingSession) {
    const newSession = await createSession(null, { guest: true });
    cookies().set('session_id', newSession.id);
    return await createCart(newSession.id);
  }

  // If the session has a cart, return the cart id
  if (existingSession.cart?.id) {
    return existingSession.cart.id;
  }

  // If the user has a cart, return the cart id
  if (existingSession.user?.cart?.id) {
    return existingSession.user.cart.id;
  }

  // If the session doesn't have a cart, create a new cart
  const newCart = await createCart(
    existingSession.id,
    existingSession.user?.id
  );

  return newCart;
}

export async function checkForItemsInCart(
  allProducts: Product[],
  sessionId: string | null
) {
  if (!sessionId) {
    return allProducts.map((product) => ({
      ...product,
      inCart: false,
    }));
  }

  const sessionCart = await db.query.cart.findFirst({
    where: eq(cart.sessionId, sessionId),
    columns: {
      userId: false,
      id: false,
      createdAt: false,
      updatedAt: false,
      sessionId: false,
    },
    with: {
      items: {
        columns: {
          productId: true,
        },
      },
    },
  });

  const sessionCartItems = sessionCart?.items || [];

  return allProducts.map((product) => ({
    ...product,
    inCart: sessionCartItems.some(({ productId }) => productId === product.id),
  }));
}
