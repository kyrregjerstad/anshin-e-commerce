import { db } from '@/lib/server/db';
import { sessions } from '@/lib/server/tables';
import { lt } from 'drizzle-orm';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  // Runs a cron job every hour to delete expired sessions
  if (
    req.headers.get('Authorization') !== `Bearer ${process.env.CRON_SECRET}`
  ) {
    return NextResponse.json(
      { ok: false, error: 'Unauthorized' },
      { status: 401 }
    );
  }

  try {
    const res = await db
      .delete(sessions)
      .where(lt(sessions.expiresAt, new Date()));

    console.log('Deleted expired sessions: ', res.rowsAffected);

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('Failed to delete expired sessions:', error);
    return NextResponse.json(
      { ok: false, error: 'Failed to delete expired sessions' },
      { status: 500 }
    );
  }
}
