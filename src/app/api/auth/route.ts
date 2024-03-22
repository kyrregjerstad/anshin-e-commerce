import {
  createSession,
  validateRefreshToken,
} from '@/lib/server/services/sessionService';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

export async function POST(req: NextRequest, res: NextResponse) {
  const body = await req.json();

  const result = schema.safeParse(body);

  if (!result.success) {
    return Response.json({ error: 'Invalid request' }, { status: 400 });
  }

  const { refreshToken } = result.data;

  if (refreshToken === null) {
    const { id, refreshToken: newRefreshToken } = await createSession(null, {
      guest: true,
    });

    return Response.json({ id, refreshToken: newRefreshToken });
  }

  const userId = await validateRefreshToken(refreshToken);

  if (!userId) {
    return Response.json({ error: 'Invalid refresh token' }, { status: 401 });
  }

  const { id, refreshToken: newRefreshToken } = await createSession(userId);

  return Response.json({ id, refreshToken: newRefreshToken });
}

const schema = z.object({
  refreshToken: z.string().nullable(),
});
