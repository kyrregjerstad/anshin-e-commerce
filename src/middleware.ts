import type { NextRequest } from 'next/server';

import { NextResponse } from 'next/server';
import { lucia } from './lib/lucia';
import { generateRandomString, alphabet } from 'oslo/crypto';
import { cookies } from 'next/headers';

export async function middleware(request: NextRequest) {
  const response = NextResponse.next();

  const sessionCookieName = lucia.sessionCookieName;
  const sessionId = request.cookies.get(sessionCookieName)?.value ?? null;

  // If the session cookie is already set, we don't need to do anything.
  if (sessionId) {
    console.log('Session cookie is already set');
    return response;
  }

  // If the session cookie is not set, we create a guest session and set the session cookie

  console.log('Session cookie is not set, creating a guest session');
  // const guestSessionid =
  //   'guest-' + generateRandomString(26, alphabet('a-z', '0-9'));
  // const guestSession = await lucia.createSession(guestSessionid, {
  //   guest: true,
  // });

  // const sessionCookie = lucia.createSessionCookie(guestSession.id);
  // cookies().set(
  //   sessionCookie.name,
  //   sessionCookie.value,
  //   sessionCookie.attributes
  // );
  return response;
}
