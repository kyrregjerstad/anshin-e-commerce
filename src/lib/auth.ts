'use server';

import { cache } from 'react';
import { getSessionDetails } from './server/services/sessionService';
import {
  createBlankSessionCookie,
  createSessionCookie,
  getSessionCookie,
} from './server/auth/cookies';
import { Cart } from './server/services/types';

export const validateRequest = cache(async () => {
  const sessionId = getSessionCookie();

  const result = await getSessionDetails(sessionId);

  try {
    if (result.session) {
      const sessionCookie = createSessionCookie(result.session.id);
      // cookies().set(sessionCookie.name, sessionCookie.value);
    }
    if (!result.session) {
      const sessionCookie = createBlankSessionCookie();
      // cookies().set(sessionCookie.name, sessionCookie.value);
    }
  } catch (error) {
    console.error(error);
  }

  return result;
});
