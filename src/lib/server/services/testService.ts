'use server';

import { eq } from 'drizzle-orm';
import { getSessionCookie } from '../auth/cookies';
import { db } from '../db';
import { sessions } from '../tables';

export async function test(test: string) {
  const sessionId = getSessionCookie();

  if (!sessionId) {
    throw new Error('Session not found');
  }

  try {
    const res = await findSession(sessionId);

    console.log(res);
  } catch (error) {
    console.log(error);
  }
}

async function findSession(sessionId: string) {
  const res = await db.query.sessions.findFirst({
    where: eq(sessions.id, sessionId),
  });

  return res;
}
