import { db } from '../db';
import { guestCart, guestSessions, guestUsers } from '../tables';
import { generateId } from './utils';

export async function createGuestSession() {
  const sessionId = generateId({ guest: true });
  const userId = generateId({ guest: true });
  const cartId = generateId({ guest: true });

  const session = {
    id: sessionId,
    guestUserId: userId,
    expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24), // 24 hours
  };

  try {
    await db.transaction(async (tx) => {
      await tx.insert(guestUsers).values({ id: userId }).execute();
      await tx.insert(guestSessions).values(session).execute();
      await tx
        .insert(guestCart)
        .values({
          id: cartId,
          guestUserId: userId,
        })
        .execute();
    });
  } catch (error) {
    console.error(error);
  } finally {
    return { sessionId, userId, cartId };
  }
}
