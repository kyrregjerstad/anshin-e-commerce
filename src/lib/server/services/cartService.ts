'use server';

import { and, asc, desc, eq, sql } from 'drizzle-orm';
import { db } from '../db';
import { cart, cartItems } from '../tables';
import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';
import { generateId } from '../auth/utils';

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
  sessionData: {
    sessionId: string;
    userId: string | null;
    cartId: string | null;
  };
  product: {
    productId: string;
    quantity: number;
  };
};

export async function addItemToCart({
  sessionData,
  product,
}: AddItemToCartParams) {
  const { sessionId, userId, cartId } = sessionData;
  const { productId, quantity } = product;

  const selectedCartId = await getOrCreateCart(sessionId, userId);

  console.log(selectedCartId, productId, quantity);

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

function getCartIdCookie() {
  const cartIdCookie = cookies().get('cartId')?.value;

  if (!cartIdCookie) {
    return null;
  }

  return cartIdCookie;
}

export async function createCart(sessionId: string, userId?: string | null) {
  const cartId = generateId();
  await db.insert(cart).values({ id: cartId, sessionId, userId });
  return cartId;
}

export async function getOrCreateCart(
  sessionId: string,
  userId: string | null
) {
  if (!userId) {
    const res = await db.query.cart.findFirst({
      where: eq(cart.sessionId, sessionId),
      orderBy: [desc(cart.updatedAt)],
    });

    if (!res) {
      return createCart(sessionId, userId);
    }

    return res.id;
  }

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
