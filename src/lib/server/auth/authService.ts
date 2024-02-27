/* eslint-disable drizzle/enforce-delete-with-where */
'use server';
import { loginSchema } from '@/lib/schema/loginSchema';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';
import { Argon2id } from 'oslo/password';
import { ZodError } from 'zod';
import { db } from '../db';
import { cart, sessions, users } from '../tables';
import {
  createBlankCartCookie,
  createBlankSessionCookie,
  createCartCookie,
  createSessionCookie,
  getSessionCookie,
} from './cookies';
import { generateId } from './utils';
import { createCart, getOrCreateCart } from '../cartService';

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

  const { session } = await validateSession(sessionId);

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

async function createUserSession(userId: string) {
  const userSession = {
    id: generateId(),
    userId,
    expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30), // 30 days
  };

  try {
    await db.insert(sessions).values(userSession);
  } catch (error) {
    console.error(error);
  } finally {
    return userSession;
  }
}

export async function validateSession(sessionId: string) {
  console.log(sessionId);
  const res = await db.query.sessions.findFirst({
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
          cart: true,
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

  const transformedCart =
    res?.cart?.items.map((item) => ({
      ...item.product,
      quantity: item.quantity,
    })) ?? [];

  console.log(res);

  if (!res) {
    return {
      user: null,
      session: null,
      guest: true,
      cart: transformedCart,
    };
  }

  const session = {
    id: res.id,
    userId: res.user?.id ?? null,
    expiresAt: res.expiresAt,
    cartId: res.cart?.id,
  };

  if (!res.user) {
    return {
      user: null,
      session,
      guest: true,
      cart: transformedCart,
    };
  }

  const user = {
    id: res.user.id,
    name: res.user.name,
    cartId: res.cart?.id ?? null,
  };

  return { user, session, guest: false, cart: transformedCart };
}
