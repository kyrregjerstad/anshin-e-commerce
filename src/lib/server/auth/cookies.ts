import { cookies } from 'next/headers';

export const sessionCookieName = 'session_id';
export const refreshTokenCookieName = 'refresh_token';

const ONE_HOUR_IN_SECONDS = 60 * 60;

// max age set in SECONDS
function createDefaultCookieOptions(maxAge: number) {
  return {
    maxAge,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production', // Use secure cookies in production for HTTPS
    path: '/',
    sameSite: 'lax',
  };
}

// valid for 1 hour, no db call required.
// This cookie is used to create a session in the db,
// and keeps the refresh token in the sessions table refreshToken column
export function createSessionCookie(sessionId: string, { guest = false } = {}) {
  return {
    name: sessionCookieName,
    value: sessionId,
    options: createDefaultCookieOptions(ONE_HOUR_IN_SECONDS),
  };
}

// valid for 24 hours for guest sessions, 30 days for logged in users
// requirers a db call to validate
export function createRefreshTokenCookie(
  refreshToken: string,
  { guest = false } = {}
) {
  const expiresIn = guest
    ? ONE_HOUR_IN_SECONDS * 24
    : ONE_HOUR_IN_SECONDS * 24 * 30;
  // 24 hours for guest sessions, 30 days for logged in users

  return {
    name: refreshTokenCookieName,
    value: refreshToken,
    options: createDefaultCookieOptions(expiresIn),
  };
}

export function isCookieExpiringSoon(cookieValue: string) {
  const expiryTimestamp = parseInt(cookieValue.split('|').pop() ?? '') || 0;
  const timeLeft = expiryTimestamp - Date.now();
  return timeLeft < ONE_HOUR_IN_SECONDS;
}

export function createBlankSessionCookie() {
  return {
    name: sessionCookieName,
    value: '',
    options: createDefaultCookieOptions(0),
  };
}

export function createBlankRefreshTokenCookie() {
  return {
    name: refreshTokenCookieName,
    value: '',
    options: createDefaultCookieOptions(0),
  };
}

export const getSessionCookie = () =>
  cookies().get(sessionCookieName)?.value ?? null;
