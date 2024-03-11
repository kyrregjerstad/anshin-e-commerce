/* eslint-disable drizzle/enforce-delete-with-where */
'use server';
import { ActionResult } from '@/lib/hooks/useForm';
import { loginSchema } from '@/lib/schema/loginSchema';
import { registerSchema } from '@/lib/schema/registerSchema';
import { handleErrors } from '@/lib/utils';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';
import { Argon2id } from 'oslo/password';
import { ZodError, ZodIssueCode } from 'zod';
import {
  createBlankSessionCookie,
  createRefreshTokenCookie,
  createSessionCookie,
  getSessionCookie,
} from '../auth/cookies';
import { generateId } from '../auth/utils';
import { db } from '../db';
import { cart, cartItems, sessions, users } from '../tables';
import { getCartBySessionId, getCartByUserId } from './cartService';
import { createSession, getSessionDetails } from './sessionService';

export async function login(
  _prevState: ActionResult | null,
  data: FormData
): Promise<ActionResult> {
  try {
    const { email, password } = loginSchema.parse(data);

    const { existingUser, validPassword } = await verifyUserCredentials(
      email,
      password
    );

    if (!validPassword || !existingUser) {
      return {
        status: 'error',
        message: 'Incorrect email or password',
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
    return handleErrors(error);
  }
}

export async function register(
  _prevState: ActionResult | null,
  data: FormData
): Promise<ActionResult> {
  try {
    const { name, email, password, repeatPassword } =
      registerSchema.parse(data);

    if (password !== repeatPassword) {
      return {
        status: 'error',
        message: 'Passwords do not match',
      };
    }

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

    cookies().set(sessionCookie.name, sessionCookie.value);

    return {
      status: 'success',
      message: 'Registered and logged in successfully',
    };
  } catch (error) {
    return handleErrors(error);
  }
}

async function verifyUserCredentials(email: string, password: string) {
  const existingUser = await db.query.users.findFirst({
    where: eq(users.email, email),
  });

  const validPassword = await new Argon2id().verify(
    existingUser?.hashedPassword ?? '',
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

  cookies().delete(sessionCookie.name);

  revalidatePath('/');
}
