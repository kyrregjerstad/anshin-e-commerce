import type { NextRequest } from 'next/server';

import { NextResponse } from 'next/server';
import {
  createRefreshTokenCookie,
  createSessionCookie,
  refreshTokenCookieName,
  sessionCookieName,
} from './lib/server/auth/cookies';
import {
  createSession,
  setRedisSession,
  validateRefreshToken,
  validateSession,
} from './lib/server/services/sessionService';

// Three scenarios:
// 1. If the sessionCookie is valid, proceed without database calls
// 2. f the sessionCookie is expired, but the refreshToken is valid, generate a new sessionCookie and a new refresh token, updating the session expiry in the database
// 3. If no tokens are present or valid, create a new guest session and set the sessionCookie

export async function middleware(request: NextRequest) {
  const response = NextResponse.next();

  // short lived - 1 hour
  const sessionCookieToken =
    request.cookies.get(sessionCookieName)?.value ?? null;

  // long lived - 24h for guest, 30 days for logged in users
  const refreshCookieToken =
    request.cookies.get(refreshTokenCookieName)?.value ?? null;

  if (sessionCookieToken) {
    const isValidSession = await validateSession(sessionCookieToken);

    if (isValidSession) {
      return response;
    }
  }

  if (!refreshCookieToken) {
    return await handleGuestSession(response);
  }

  const userId = await validateRefreshToken(refreshCookieToken);
  if (userId) {
    const { id, refreshToken } = await createSession(userId);

    response.cookies.set(createSessionCookie(id));
    response.cookies.set(createRefreshTokenCookie(refreshToken));

    return response;
  }

  return await handleGuestSession(response);
}

async function handleGuestSession(response: NextResponse) {
  const { id, refreshToken } = await createSession(null, {
    guest: true,
  });

  response.cookies.set(createSessionCookie(id, { guest: true }));
  response.cookies.set(createRefreshTokenCookie(refreshToken, { guest: true }));

  return response;
}
