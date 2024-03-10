import { cookies } from 'next/headers';

export const sessionCookieName = 'session_id';

export function createSessionCookie(sessionId: string) {
  const expiresIn = 30 * 24 * 60 * 60 * 1000; // 30 days

  const cookieOptions = {
    maxAge: expiresIn,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production', // Use secure cookies in production for HTTPS
    path: '/',
    sameSite: 'lax',
  };

  return { name: sessionCookieName, value: sessionId, options: cookieOptions };
}

export function createBlankSessionCookie() {
  const cookieOptions = {
    maxAge: 0,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production', // Use secure cookies in production for HTTPS
    path: '/',
    sameSite: 'lax',
  };

  return { name: sessionCookieName, value: '', options: cookieOptions };
}

export function createBlankCartCookie() {
  const cookieOptions = {
    maxAge: 0,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production', // Use secure cookies in production for HTTPS
    path: '/',
    sameSite: 'lax',
  };

  return { name: 'cartId', value: '', options: cookieOptions };
}

export const getSessionCookie = () =>
  cookies().get(sessionCookieName)?.value ?? null;
