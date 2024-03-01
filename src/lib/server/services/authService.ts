/* eslint-disable drizzle/enforce-delete-with-where */
'use server';
import { loginSchema } from '@/lib/schema/loginSchema';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';
import { Argon2id } from 'oslo/password';
import { ZodError } from 'zod';
import {
  createBlankCartCookie,
  createBlankSessionCookie,
  createCartCookie,
  createSessionCookie,
  getSessionCookie,
} from '../auth/cookies';
import { db } from '../db';
import { cart, sessions, users } from '../tables';
import { getCartBySessionId, getOrCreateCart } from './cartService';
import { createUserSession, getSessionDetails } from './sessionService';

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

    const existingUser = await db.query.users.findFirst({
      where: eq(users.email, email),
    });

    const validPassword = await new Argon2id().verify(
      existingUser?.hashedPassword ?? '',
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
    const cartId = await getOrCreateCart(session.id, userId);

    const guestSessionId = getSessionCookie();

    if (guestSessionId) {
      const guestSessionCartItems = await getCartBySessionId(guestSessionId);
      const currentSessionCartItems = await getCartBySessionId(guestSessionId);

      // Merge the guest cart with the current cart

      await db.update(cart).set({}).where(eq(cart.id, cartId));
    }

    const sessionCookie = createSessionCookie(session.id);
    const cartCookie = createCartCookie(cartId);

    cookies().set(sessionCookie.name, sessionCookie.value);
    cookies().set(cartCookie.name, cartCookie.value);

    return {
      status: 'success',
      message: 'Logged in successfully',
    };
  } catch (error) {
    if (error instanceof ZodError) {
      return {
        status: 'error',
        message: 'Invalid form data',
        errors: error.issues.map((issue) => ({
          path: issue.path.join('.'),
          message: `server: ${issue.message}`,
        })),
      };
    }

    return {
      status: 'error',
      message: 'Something went wrong. Please try again.',
    };
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
  const cartCookie = createBlankCartCookie();

  cookies().delete(sessionCookie.name);
  cookies().delete(cartCookie.name);

  revalidatePath('/');
}
