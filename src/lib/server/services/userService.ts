'use server';
import { eq } from 'drizzle-orm';
import { db } from '../db';
import { sessions, users } from '../tables';

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
        with: {
          addresses: true,
        },
      },
    },
  });

  if (!res || !res.user) {
    return null;
  }

  return {
    id: res.user.id,
    name: res.user.name,
    email: res.user.email,
    shippingAddress:
      res.user.addresses.find((a) => a.type === 'shipping') || null,
    billingAddress:
      res.user.addresses.find((a) => a.type === 'billing') || null,
  };
}
