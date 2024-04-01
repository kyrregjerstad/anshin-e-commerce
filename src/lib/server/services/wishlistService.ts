'use server';
import { and, eq } from 'drizzle-orm';
import { getSessionCookie } from '../auth/cookies';
import { db } from '../db';
import { sessions, wishlistItems } from '../tables';

export async function handleAddToWishlist(productId: string) {
  const sessionId = getSessionCookie();

  if (!sessionId) {
    throw new Error('Session not found');
  }

  const res = await db.query.sessions.findFirst({
    where: eq(sessions.id, sessionId),
    columns: {},
    with: {
      user: {
        columns: {},
        with: {
          wishlist: {
            columns: {
              id: true,
            },
            with: {
              items: {
                columns: {
                  productId: true,
                },
              },
            },
          },
        },
      },
    },
  });

  if (!res || !res.user || !res.user.wishlist) {
    throw new Error('User not found');
  }

  const alreadyInWishlist = res.user.wishlist.items.some(
    (item) => item.productId === productId
  );

  if (alreadyInWishlist) {
    return;
  }

  await db.insert(wishlistItems).values({
    productId,
    wishlistId: res.user.wishlist.id,
  });
}

export async function handleRemoveFromWishlist(productId: string) {
  const sessionId = getSessionCookie();

  if (!sessionId) {
    return;
  }

  const res = await db.query.sessions.findFirst({
    where: eq(sessions.id, sessionId),
    columns: {},
    with: {
      user: {
        columns: {},
        with: {
          wishlist: {
            columns: {
              id: true,
            },
            with: {
              items: {
                columns: {
                  productId: true,
                },
              },
            },
          },
        },
      },
    },
  });

  if (!res || !res.user || !res.user.wishlist) {
    throw new Error('User not found');
  }

  const item = res.user.wishlist.items.find(
    (item) => item.productId === productId
  );

  if (!item) {
    return;
  }

  await db
    .delete(wishlistItems)
    .where(
      and(
        eq(wishlistItems.productId, item.productId),
        eq(wishlistItems.wishlistId, res.user.wishlist.id)
      )
    );
}
