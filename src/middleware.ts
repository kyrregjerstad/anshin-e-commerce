import type { NextRequest } from 'next/server';

import { NextResponse } from 'next/server';
import {
  createSessionCookie,
  sessionCookieName,
} from './lib/server/auth/cookies';
import { createGuestSession } from './lib/server/services/sessionService';

export async function middleware(request: NextRequest) {
  const response = NextResponse.next();

  const sessionCookie = request.cookies.get(sessionCookieName)?.value ?? null;

  if (!sessionCookie) {
    const { id: sessionId } = await createGuestSession();
    const guestSessionCookie = createSessionCookie(sessionId);

    response.cookies.set(guestSessionCookie.name, guestSessionCookie.value);
  }
  return response;
}
