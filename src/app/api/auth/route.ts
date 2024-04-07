import {
  createSession,
  findSessionByRefreshToken,
  refreshSession,
} from '@/lib/server/services/sessionService';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

export async function POST(req: NextRequest, _res: NextResponse) {
  const result = schema.safeParse(await req.json());

  if (!result.success) {
    return Response.json(
      { error: 'Invalid request', newSessionId: null, refreshToken: null },
      { status: 400 }
    );
  }

  const { refreshToken } = result.data;

  if (!refreshToken) {
    const { id, refreshToken: newRefreshToken } = await createSession(null, {
      guest: true,
    });

    return Response.json({ newSessionId: id, refreshToken: newRefreshToken });
  }

  const session = await findSessionByRefreshToken(refreshToken);

  if (!session) {
    return Response.json(
      {
        error: 'Invalid refresh token',
        newSessionId: null,
        refreshToken: null,
      },
      { status: 401 }
    );
  }

  const newSessionId = await refreshSession(refreshToken, session.guest);

  if (!newSessionId) {
    return Response.json(
      {
        error: 'Failed to refresh session',
        newSessionId: null,
        refreshToken: null,
      },
      { status: 500 }
    );
  }

  return Response.json({ newSessionId, refreshToken });
}

const schema = z.object({
  refreshToken: z.string().nullable(),
});
