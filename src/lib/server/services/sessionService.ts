'use server';

import { eq } from 'drizzle-orm';
import { generateId, generateRefreshToken } from '../auth/utils';
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
import { redis } from '../redis';

const ONE_HOUR_IN_SECONDS = 60 * 60;

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
  sessionId: string | null
): Promise<ValidateSessionResult> {
  if (!sessionId) {
    const emptySession = getEmptySessionDetails();

    return {
      ...emptySession,
      session: null,
    };
  }

  const sessionData = await getSessionById(sessionId);

  if (!sessionData) {
    const emptySession = getEmptySessionDetails();

    return {
      ...emptySession,
      session: null,
    };
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
      cartId: null,
    };
  }

  return {
    user: null,
    session,
    cart: transformCartItems(sessionData.cart.items),
    cartId: sessionData.cart.id,
  };
}

export async function createSession(
  userId: string | null,
  options?: {
    guest: boolean;
  }
) {
  const guest = options?.guest || false;

  const session = {
    id: generateId({ guest }),
    userId,
    expiresAt: getExpiresAt(guest),
    refreshToken: generateRefreshToken({ guest }),
  };

  try {
    await db.insert(sessions).values(session);
    await setRedisSession(session.id, guest);
  } catch (error) {
    console.error(error);
  } finally {
    return session;
  }
}

function getExpiresAt(guest: boolean) {
  return guest
    ? new Date(Date.now() + 1000 * 60 * 60 * 24) // 24 hours
    : new Date(Date.now() + 1000 * 60 * 60 * 24 * 30); // 30 days
}

export async function setRedisSession(sessionToken: string, guest = true) {
  await redis.set(`session:${sessionToken}`, guest ? 'guest' : 'user', {
    ex: ONE_HOUR_IN_SECONDS,
  });
}

export async function validateSession(sessionToken: string) {
  const sessionType = (await redis.get(`session:${sessionToken}`)) as
    | 'guest'
    | 'user'
    | null;

  return sessionType;
}

export async function refreshRedisSessionExpiration(sessionId: string) {
  const ttl = ONE_HOUR_IN_SECONDS;
  await redis.expire(`session:${sessionId}`, ttl);
}

export async function validateRefreshToken(refreshToken: string) {
  const session = await db.query.sessions.findFirst({
    where: eq(sessions.refreshToken, refreshToken),
    columns: {},
    with: {
      user: {
        columns: {
          id: true,
        },
      },
    },
  });

  if (session?.user?.id) {
    return session.user.id;
  }

  return null;
}
