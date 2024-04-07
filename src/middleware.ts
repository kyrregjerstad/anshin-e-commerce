import type { NextRequest } from 'next/server';

import { NextResponse } from 'next/server';
import {
  createRefreshTokenCookie,
  createSessionCookie,
  refreshTokenCookieName,
  sessionCookieName,
} from './lib/server/auth/cookies';
import { getSessionType } from './lib/server/services/redisService';

// 1. If a sessionCookie is present and valid, allow the request to proceed
// 2. If a refreshCookie is present and no sessionCookie is present, refresh the session and set the sessionCookie
// 3. If no sessionCookie or refreshCookie is present, create a new session and set the sessionCookie

export async function middleware(request: NextRequest) {
  const response = NextResponse.next();
  const sessionCookie = request.cookies.get(sessionCookieName)?.value || null; // short lived - 1 hour
  const refreshCookie =
    request.cookies.get(refreshTokenCookieName)?.value || null; // long lived - 24h for guest, 30 days for logged in users

  if (sessionCookie) {
    const sessionType = await getSessionType(sessionCookie);
    if (sessionType) return response; // if a sessionType is returned, the session is valid
  }

  if (refreshCookie) {
    return handleRefreshSession(request, response, refreshCookie); // refresh the session
  }

  return handleGuestSession(request, response);
}

async function handleGuestSession(
  request: NextRequest,
  response: NextResponse
) {
  const url = new URL('/api/auth', request.url).href;
  const { newSessionId, refreshToken, error } = await authFetch(url, null);

  if (error) {
    return response;
  }

  const sessionCookie = createSessionCookie(newSessionId);
  const refreshCookie = createRefreshTokenCookie(refreshToken, { guest: true });

  response.cookies.set(
    sessionCookie.name,
    sessionCookie.value,
    sessionCookie.options
  );
  response.cookies.set(
    refreshCookie.name,
    refreshCookie.value,
    refreshCookie.options
  );

  return response;
}

async function handleRefreshSession(
  request: NextRequest,
  response: NextResponse,
  refreshCookieToken: string
) {
  const url = new URL('/api/auth', request.url).href;
  const { newSessionId, error } = await authFetch(url, refreshCookieToken);

  // TODO: handle error
  if (error) {
    return response;
  }

  const sessionCookie = createSessionCookie(newSessionId);

  response.cookies.set(
    sessionCookie.name,
    sessionCookie.value,
    sessionCookie.options
  );

  return response;
}

// if refreshToken is null, a new guest session is created
async function authFetch(
  url: string,
  refreshToken: string | null
): Promise<RefreshTokenResponse> {
  return await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ refreshToken }),
  }).then((res) => res.json());
}

type RefreshTokenResponse =
  | {
      newSessionId: string;
      refreshToken: string;
      error?: never;
    }
  | {
      newSessionId: null;
      refreshToken: null;
      error: true;
    };
