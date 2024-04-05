/* eslint-disable drizzle/enforce-delete-with-where */
'use server';

import { loginSchema } from '@/lib/schema/loginSchema';
import { registerSchema } from '@/lib/schema/registerSchema';
import { SchemaKeys, createFormError, handleErrors } from '@/lib/utils';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';
import { Argon2id } from 'oslo/password';
import { ZodError, ZodIssueCode } from 'zod';
import {
  createBlankRefreshTokenCookie,
  createBlankSessionCookie,
  createRefreshTokenCookie,
  createSessionCookie,
  getSessionCookie,
} from '../auth/cookies';
import { generateId } from '../auth/utils';
import { db } from '../db';
import { ActionResult, formAction } from '../formAction';
import { cart, cartItems, sessions, users } from '../tables';
import { getCartBySessionId, getCartByUserId } from './cartService';
import { createSession, getSessionDetails } from './sessionService';
import { redirect } from 'next/navigation';

export const login = formAction(
  loginSchema,
  async ({ email, password }): Promise<ActionResult> => {
    try {
      const { existingUser, validPassword } = await verifyUserCredentials(
        email,
        password
      );

      if (!validPassword || !existingUser) {
        return {
          status: 'error',
          message: 'Incorrect email or password',
          errors: createFormError<SchemaKeys<typeof loginSchema>>([
            { path: ['email'], message: 'Incorrect email or password' },
          ]),
        };
      }

      const { id: userId } = existingUser;

      const session = await createSession(userId);

      const sessionCookie = createSessionCookie(session.id);
      const refreshCookie = createRefreshTokenCookie(session.refreshToken);

      cookies().set(sessionCookie.name, sessionCookie.value);
      cookies().set(refreshCookie.name, refreshCookie.value);

      return {
        status: 'success',
        message: 'Logged in successfully',
      };
    } catch (error) {
      console.log('error', error);
      return handleErrors(error);
    }
  }
);

export const register = formAction(
  registerSchema,
  async ({ name, email, password }): Promise<ActionResult> => {
    try {
      const existingUser = await db.query.users.findFirst({
        where: eq(users.email, email),
      });

      if (existingUser) {
        const error = new ZodError([]);
        error.addIssue({
          code: ZodIssueCode.custom,
          message: 'User already exists',
          path: ['email'],
        });

        throw error;
      }

      const newUserId = generateId();
      const hashedPassword = await new Argon2id().hash(password);

      await db.insert(users).values({
        id: newUserId,
        name,
        email,
        hashedPassword,
      });

      const session = await createSession(newUserId);

      const sessionCookie = createSessionCookie(session.id);
      const refreshCookie = createRefreshTokenCookie(session.refreshToken);

      cookies().set(sessionCookie.name, sessionCookie.value);
      cookies().set(refreshCookie.name, refreshCookie.value);

      return {
        status: 'success',
        message: 'Registered and logged in successfully',
      };
    } catch (error) {
      return handleErrors(error);
    }
  }
);

async function verifyUserCredentials(email: string, password: string) {
  const existingUser = await db.query.users.findFirst({
    where: eq(users.email, email),
  });

  const validPassword = await new Argon2id().verify(
    // default password to hash, so that the hashing function always try to hash a password
    existingUser?.hashedPassword ??
      '$argon2id$v=19$m=19456,t=2,p=1$juj2N0Frdb1BvKwHFfx3nw$/THeVkBkxDSSDA5AKpFEtMki9ffbRFc+SvvZVmuXMeU',
    password
  );

  return { existingUser, validPassword };
}

async function clearGuestCart(guestSessionId: string) {
  await db.transaction(async (tx) => {
    await tx.delete(cart).where(eq(cart.id, guestSessionId));
    await tx.delete(cartItems).where(eq(cartItems.cartId, guestSessionId));
  });
}

async function mergeCarts(
  guestSessionId: string,
  userId: string,
  cartId: string,
  guestSessionCartItems: {
    id: string;
    title: string;
    quantity: number;
    priceInCents: number;
    discountInCents: number;
  }[]
) {
  const userCart = await getCartByUserId(userId);
  const mergedCart = guestSessionCartItems.reduce(
    (acc, guestItem) => {
      const itemIndex = acc.findIndex((item) => item.id === guestItem.id);

      if (itemIndex !== -1) {
        acc[itemIndex].quantity += guestItem.quantity;
      } else {
        acc.push(guestItem);
      }

      return acc;
    },
    [...userCart]
  );

  const mergedCartItems = mergedCart.map((item) => ({
    cartId,
    productId: item.id,
    quantity: item.quantity,
  }));

  await db.transaction(async (tx) => {
    await tx.delete(cartItems).where(eq(cartItems.cartId, cartId));
    await tx.insert(cartItems).values(mergedCartItems);
    await tx.delete(cart).where(eq(cart.id, guestSessionId));
    await tx.delete(cartItems).where(eq(cartItems.cartId, guestSessionId));
  });
}

async function handleGuestCart(
  guestSessionId: string,
  userId: string,
  cartId: string
) {
  const guestSessionCartItems = await getCartBySessionId(guestSessionId);

  if (guestSessionCartItems.length === 0) {
    await clearGuestCart(guestSessionId);
  } else {
    await mergeCarts(guestSessionId, userId, cartId, guestSessionCartItems);
  }
}

export async function logOut() {
  const sessionId = getSessionCookie();

  if (!sessionId) return;

  const { session } = await getSessionDetails(sessionId);

  if (!session) {
    return {
      error: 'Unauthorized',
    };
  }

  await db.delete(sessions).where(eq(sessions.id, sessionId));

  const sessionCookie = createBlankSessionCookie();
  const refreshCookie = createBlankRefreshTokenCookie();

  cookies().delete(sessionCookie.name);
  cookies().delete(refreshCookie.name);

  revalidatePath('/');
  redirect('/');
}
