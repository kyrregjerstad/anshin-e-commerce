import { cookies } from 'next/headers';
import { cache } from 'react';
import { validateSession } from './server/auth/authService';
import {
  createBlankSessionCookie,
  createSessionCookie,
  getSessionCookie,
} from './server/auth/cookies';

export const validateRequest = cache(async () => {
  const sessionId = getSessionCookie();

  if (!sessionId) {
    console.log('No session cookie found');
    return {
      user: null,
      session: null,
    };
  }

  const result = await validateSession(sessionId);

  try {
    if (result.session) {
      const sessionCookie = createSessionCookie(result.session.id);
      cookies().set(sessionCookie.name, sessionCookie.value);
    }
    if (!result.session) {
      const sessionCookie = createBlankSessionCookie();
      cookies().set(sessionCookie.name, sessionCookie.value);
    }
  } catch (error) {
    console.error(error);
  }
  return result;
});
