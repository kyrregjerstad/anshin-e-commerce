'use server';
import { lucia } from '@/lib/auth';
import { loginSchema } from '@/lib/schema/loginSchema';
import { eq } from 'drizzle-orm';
import { cookies } from 'next/headers';
import { Argon2id } from 'oslo/password';
import { ZodError } from 'zod';
import { db } from '../db';
import { users } from '../tables';

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

    const session = await lucia.createSession(transformedUser.id, {});

    const sessionCookie = lucia.createSessionCookie(session.id);

    cookies().set(
      sessionCookie.name,
      sessionCookie.value,
      sessionCookie.attributes
    );

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
