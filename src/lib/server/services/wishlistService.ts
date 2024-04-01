'use server';
import { and, eq } from 'drizzle-orm';
import { getSessionCookie } from '../auth/cookies';
import { db } from '../db';
import { sessions, wishlist, wishlistItems } from '../tables';
import { redirect } from 'next/navigation';
import { Product } from './productService';
import { revalidatePath } from 'next/cache';
import { generateId } from '../auth/utils';

export async function handleAddToWishlist(productId: string, pathname: string) {
  const sessionId = getSessionCookie();

  if (!sessionId) {
    redirect(`/login?redirect=${pathname}`);
  }

  const res = await db.query.sessions.findFirst({
    where: eq(sessions.id, sessionId),
    columns: {},
    with: {
      user: {
        columns: {
          id: true,
        },
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

  if (!res || !res.user) {
    redirect(`/login?redirect=${pathname}`);
  }

  // If the user doesn't have a wishlist, create one - this happens the first time a user adds an item to their wishlist
  if (!res.user.wishlist) {
    const wishlistId = generateId();
    await db.insert(wishlist).values({ userId: res.user.id, id: wishlistId });

    await db.insert(wishlistItems).values({
      productId,
      wishlistId,
    });
  } else {
    const alreadyInWishlist = res.user.wishlist?.items.some(
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

  revalidatePath('/wishlist');
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

  revalidatePath('/wishlist');
}

export async function checkForItemsInWishlist(
  allProducts: (Product & { inCart: boolean })[],
  sessionId: string | null
) {
  if (!sessionId) {
    return allProducts.map((product) => ({
      ...product,
      inWishlist: false,
    }));
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

  return allProducts.map((product) => ({
    ...product,
    inWishlist: !!res?.user?.wishlist?.items.some(
      ({ productId }) => productId === product.id
    ),
  }));
}

export async function checkForItemInWishlist(
  productId: string,
  sessionId: string | null
) {
  if (!sessionId) return false;

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

  return !!res?.user?.wishlist?.items.some(
    ({ productId: id }) => id === productId
  );
}
