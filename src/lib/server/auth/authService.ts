'use server';
import { lucia } from '@/lib/auth';
import { eq } from 'drizzle-orm';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { Argon2id } from 'oslo/password';
import { db } from '../db';
import { users } from '../tables';
import { ZodError, z } from 'zod';
import { loginSchema } from '@/lib/schema/loginSchema';

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

    const validPassword = await new Argon2id().verify(
      existingUser.hashedPassword,
      password
    );

    if (!validPassword) {
      return {
        status: 'error',
        message: 'Incorrect email or password',
      };
    }

    const session = await lucia.createSession(existingUser.id, {});
    const sessionCookie = lucia.createSessionCookie(session.id);

    cookies().set(
      sessionCookie.name,
      sessionCookie.value,
      sessionCookie.attributes
    );

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
