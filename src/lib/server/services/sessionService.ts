'use server';

import { eq } from 'drizzle-orm';
import { generateId } from '../auth/utils';
import { db } from '../db';
import { sessions } from '../tables';
import { createCart } from './cartService';
import {
  DatabaseSession,
  SessionWithUser,
  SessionWithoutUser,
  ValidateSessionResult,
} from './types';
import { getEmptySessionDetails, transformCartItems } from './utils';

export async function getSessionById(
  sessionId: string
): Promise<DatabaseSession | undefined> {
  return db.query.sessions.findFirst({
    where: eq(sessions.id, sessionId),
    columns: {
      id: true,
      expiresAt: true,
    },
    with: {
      user: {
        columns: {
          id: true,
          name: true,
        },
        with: {
          cart: {
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
          },
        },
      },
      cart: {
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
      },
    },
  });
}

export async function getSessionDetails(
  sessionId: string
): Promise<ValidateSessionResult> {
  const sessionData = await getSessionById(sessionId);

  if (!sessionData) {
    return getEmptySessionDetails();
  }

  if (sessionData.user) {
    return await handleUserSession(sessionData);
  } else {
    return await handleGuestSession(sessionData);
  }
}

export async function handleUserSession(sessionData: SessionWithUser) {
  const session = {
    id: sessionData.id,
    expiresAt: sessionData.expiresAt,
  };

  const user = {
    id: sessionData.user.id,
    name: sessionData.user.name,
  };

  if (!sessionData.user.cart?.id) {
    return {
      user,
      session,
      cart: [],
      cartId: await createCart(sessionData.id, sessionData.user.id),
    };
  }

  return {
    user,
    session,
    cart: transformCartItems(sessionData.user.cart.items),
    cartId: sessionData.user.cart.id,
  };
}

export async function handleGuestSession(sessionData: SessionWithoutUser) {
  const session = {
    id: sessionData.id,
    expiresAt: sessionData.expiresAt,
  };

  if (!sessionData.cart?.id) {
    return {
      user: null,
      session,
      cart: [],
      cartId: await createCart(sessionData.id),
    };
  }

  return {
    user: null,
    session,
    cart: transformCartItems(sessionData.cart.items),
    cartId: sessionData.cart.id,
  };
}

export async function createUserSession(userId: string) {
  const userSession = {
    id: generateId(),
    userId,
    expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30), // 30 days
  };

  try {
    await db.insert(sessions).values(userSession);
  } catch (error) {
    console.error(error);
    throw new Error('Failed to create user session.');
  } finally {
    return userSession;
  }
}
