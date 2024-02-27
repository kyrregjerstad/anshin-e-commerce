import { db } from '../db';
import { cart, sessions } from '../tables';
import { generateId } from './utils';

export async function createGuestSession() {
  const sessionId = generateId({ guest: true });
  const cartId = generateId({ guest: true });

  try {
    await db.transaction(async (tx) => {
      await tx
        .insert(sessions)
        .values({
          id: sessionId,
          expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24), // 24 hours
        })
        .execute();

      await tx
        .insert(cart)
        .values({
          id: cartId,
          sessionId,
        })
        .execute();
    });
  } catch (error) {
    console.error(error);
  } finally {
    return { sessionId, cartId };
  }
}
