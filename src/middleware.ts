import type { NextRequest } from 'next/server';

import { NextResponse } from 'next/server';
import {
  createSessionCookie,
  sessionCookieName,
} from './lib/server/auth/cookies';
import { createGuestSession } from './lib/server/auth/sessions';

export async function middleware(request: NextRequest) {
  const response = NextResponse.next();

  const sessionCookie = request.cookies.get(sessionCookieName)?.value ?? null;

  if (!sessionCookie) {
    console.log('No session cookie found, creating a new one');
    const { sessionId, cartId } = await createGuestSession();
    const guestSessionCookie = createSessionCookie(sessionId);

    response.cookies.set(guestSessionCookie.name, guestSessionCookie.value);
    response.cookies.set('cartId', cartId);
  } else {
    console.log('Session cookie found:', sessionCookie);
  }
  return response;
}
