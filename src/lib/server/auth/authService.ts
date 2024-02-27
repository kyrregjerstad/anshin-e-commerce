/* eslint-disable drizzle/enforce-delete-with-where */
'use server';
import { loginSchema } from '@/lib/schema/loginSchema';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';
import { Argon2id } from 'oslo/password';
import { ZodError } from 'zod';
import { db } from '../db';
import { sessions, users } from '../tables';
import {
  createBlankSessionCookie,
  createSessionCookie,
  getSessionCookie,
} from './cookies';
import { generateId } from './utils';

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
      with: {
        cart: {
          columns: {
            id: true,
          },
        },
      },
    });

    console.log(existingUser);

    if (!existingUser) {
      return {
        status: 'error',
        message: 'No user found with that email address.',
        errors: [
          {
            path: 'email',
            message: 'No user found with that email address.',
          },
        ],
      };
    }

    const transformedUser = {
      id: existingUser.id,
      email: existingUser.email,
      name: existingUser.name,
      hashedPassword: existingUser.hashedPassword,
      cartId: existingUser.cart?.id ?? null,
    };

    const validPassword = await new Argon2id().verify(
      transformedUser.hashedPassword,
      password
    );

    if (!validPassword) {
      return {
        status: 'error',
        message: 'Incorrect email or password',
      };
    }

    const session = await createUserSession(transformedUser.id);
    const sessionCookie = createSessionCookie(session.id);

    cookies().set(sessionCookie.name, sessionCookie.value);

    cookies().set('cartId', transformedUser.cartId.toString());

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

  cookies().delete(sessionCookie.name);
  cookies().delete('cartId');

  revalidatePath('/');
}

async function createUserSession(userId: string, guest = false) {
  const userSession = {
    id: generateId(),
    userId,
    expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30), // 30 days
  };

  const guestSession = {
    id: generateId({ guest: true }),
    guestUserId: userId,
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
    cartId: res.cart.id,
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

  console.log(session);

  return { user, session, guest: false, cart: transformedCart };
}
