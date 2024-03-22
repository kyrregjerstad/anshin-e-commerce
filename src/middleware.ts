import type { NextRequest } from 'next/server';

import { NextResponse } from 'next/server';
import {
  createRefreshTokenCookie,
  createSessionCookie,
  refreshTokenCookieName,
  sessionCookieName,
} from './lib/server/auth/cookies';
import {
  refreshRedisSessionExpiration,
  validateSession,
} from './lib/server/services/redisService';

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
    const sessionType = await validateSession(sessionCookieToken);

    if (sessionType) {
      await refreshRedisSessionExpiration(sessionCookieToken);

      response.cookies.set(
        createSessionCookie(sessionCookieToken, {
          guest: sessionType === 'guest',
        })
      );
      return response;
    }
  }

  console.log('ding');
  if (!refreshCookieToken) {
    return await handleGuestSession(request, response);
  }

  const url = new URL('/api/auth', request.url);

  const { id, refreshToken } = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ refreshToken: refreshCookieToken }),
  }).then((res) => res.json());

  if (id && refreshToken) {
    response.cookies.set(createSessionCookie(id));
    response.cookies.set(createRefreshTokenCookie(refreshToken));

    return response;
  }

  return await handleGuestSession(request, response);
}

async function handleGuestSession(
  request: NextRequest,
  response: NextResponse
) {
  const url = new URL('/api/auth', request.url);
  const { id, refreshToken } = await fetch(url.toString(), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ refreshToken: null }),
  }).then((res) => res.json());

  response.cookies.set(createSessionCookie(id, { guest: true }));
  response.cookies.set(createRefreshTokenCookie(refreshToken, { guest: true }));

  return response;
}
