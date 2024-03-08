'use server';

import { and, asc, desc, eq, sql } from 'drizzle-orm';
import { db } from '../db';
import { cart, cartItems, sessions, users } from '../tables';
import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';
import { generateId } from '../auth/utils';
import { getSessionCookie } from '../auth/cookies';
import { Product } from '../productService';

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

export async function getCartByUserId(userId: string) {
  const res = await db.query.cart.findFirst({
    where: eq(cart.userId, userId),
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

export async function removeItemFromCart(
  cartId: string | null,
  itemId: string
) {
  // const cartId = getCartIdCookie();
  if (!cartId) return;

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

export async function addItemToCart({
  productId,
  quantity,
}: AddItemToCartParams) {
  const sessionId = getSessionCookie();

  // TODO: handle this better
  if (!sessionId) {
    throw new Error('Session not found');
  }

  const session = await getSessionDetails(sessionId);

  // TODO: handle this better
  if (!session) {
    throw new Error('Session not found');
  }

  const selectedCartId = await getOrCreateCart(session);

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

type Session = {
  id: string;
  cart: {
    id: string;
  } | null;
  user: {
    id: string;
    cart: {
      id: string | undefined;
    };
  } | null;
};
export async function getOrCreateCart(session: Session) {
  if (session.cart?.id) {
    return session.cart.id;
  }

  if (session.user?.cart.id) {
    return session.user.cart.id;
  }

  const newCart = await createCart(session.id, session.user?.id);

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
