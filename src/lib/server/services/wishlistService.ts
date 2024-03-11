'use server';
import { eq } from 'drizzle-orm';
import { getSessionCookie } from '../auth/cookies';
import { generateId } from '../auth/utils';
import { db } from '../db';
import { sessions, wishlist, wishlistItems } from '../tables';

export async function handleAddToWishlist({
  productId,
}: {
  productId: string;
}) {
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
