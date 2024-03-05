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

export async function getUserById(userId: string) {
  const res = await db.query.users.findFirst({
    where: eq(users.id, userId),
    columns: {
      id: true,
      name: true,
      email: true,
    },
  });

  if (!res) {
    throw new Error('User not found');
  }

  return res;
}

export async function getUserBySessionId(sessionId: string) {
  const res = await db.query.sessions.findFirst({
    where: eq(sessions.id, sessionId),
    with: {
      user: {
        columns: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });

  if (!res || !res.user) {
    return null;
  }

  return res.user;
}
