'use server';

import { cache } from 'react';
import { getSessionCookie } from './server/auth/cookies';
import { getSessionDetails } from './server/services/sessionService';

export const validateRequest = cache(async () => {
  const sessionId = getSessionCookie();

  const result = await getSessionDetails(sessionId);

  return result;
});
