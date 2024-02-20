'use server';
import { lucia } from '@/lib/auth';
import { eq } from 'drizzle-orm';
import { ActionResult } from 'next/dist/server/app-render/types';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { Argon2id } from 'oslo/password';
import { db } from '../db';
import { users } from '../tables';
import { z } from 'zod';

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export async function login(_: any, formData: FormData): Promise<ActionResult> {
  const email = formData.get('email');
  const password = formData.get('password');

  const result = loginSchema.parse({
    email: email,
    password: password,
  });

  if (
    typeof password !== 'string' ||
    password.length < 6 ||
    password.length > 255
  ) {
    return {
      error: 'Invalid password',
    };
  }

  const existingUser = await db.query.users.findFirst({
    where: eq(users.email, email),
  });

  if (!existingUser) {
    return {
      error: 'Incorrect email or password',
    };
  }

  const validPassword = await new Argon2id().verify(
    existingUser.hashedPassword,
    password
  );
  if (!validPassword) {
    return {
      error: 'Incorrect email or password',
    };
  }

  const session = await lucia.createSession(existingUser.id, {});
  const sessionCookie = lucia.createSessionCookie(session.id);
  cookies().set(
    sessionCookie.name,
    sessionCookie.value,
    sessionCookie.attributes
  );
  return redirect('/');
}
