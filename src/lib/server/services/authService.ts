/* eslint-disable drizzle/enforce-delete-with-where */
'use server';
import { loginSchema } from '@/lib/schema/loginSchema';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';
import { Argon2id } from 'oslo/password';
import { ZodError, ZodIssueCode } from 'zod';
import {
  createBlankCartCookie,
  createBlankSessionCookie,
  createSessionCookie,
  getSessionCookie,
} from '../auth/cookies';
import { db } from '../db';
import { cart, cartItems, sessions, users } from '../tables';
import {
  getCartBySessionId,
  getCartByUserId,
  getOrCreateCart,
} from './cartService';
import { createUserSession, getSessionDetails } from './sessionService';
import { registerSchema } from '@/lib/schema/registerSchema';
import { generateId } from '../auth/utils';

export type LoginActionResult =
  | {
      status: 'success';
      message: string;
    }
  | {
      status: 'error';
      message: string;
      errors?: Array<{
        path: string;
        message: string;
      }>;
    }
  | null;

export async function login(
  _prevState: LoginActionResult | null,
  data: FormData
): Promise<LoginActionResult> {
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

    const session = await createUserSession(userId);
    // const cartId = await getOrCreateCart(session);

    const guestSessionId = getSessionCookie();

    // if (guestSessionId) {
    //   await handleGuestCart(guestSessionId, userId, cartId);
    // }

    const sessionCookie = createSessionCookie(session.id);

    cookies().set(sessionCookie.name, sessionCookie.value);

    return {
      status: 'success',
      message: 'Logged in successfully',
    };
  } catch (error) {
    return handleError(error);
  }
}

type RegisterActionResult =
  | {
      status: 'success';
      message: string;
    }
  | {
      status: 'error';
      message: string;
      errors?: Array<{
        path: string;
        message: string;
      }>;
    }
  | null;

export async function register(
  _prevState: LoginActionResult | null,
  data: FormData
): Promise<RegisterActionResult> {
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

    const session = await createUserSession(newUserId);
    // const cartId = await getOrCreateCart(session.id, newUserId);

    // const guestSessionId = getSessionCookie();

    // if (guestSessionId) {
    //   await handleGuestCart(guestSessionId, newUserId, cartId);
    // }

    const sessionCookie = createSessionCookie(session.id);

    cookies().set(sessionCookie.name, sessionCookie.value);

    return {
      status: 'success',
      message: 'Registered and logged in successfully',
    };
  } catch (error) {
    return handleError(error);
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

function handleError(error: any) {
  if (error instanceof ZodError) {
    return {
      status: 'error',
      message: 'Invalid form data',
      errors: error.issues.map((issue) => ({
        path: issue.path.join('.'),
        message: `${issue.message}`,
      })),
    } as const;
  }

  return {
    status: 'error',
    message: 'Something went wrong. Please try again.',
  } as const;
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
  const cartCookie = createBlankCartCookie();

  cookies().delete(sessionCookie.name);
  cookies().delete(cartCookie.name);

  revalidatePath('/');
}
