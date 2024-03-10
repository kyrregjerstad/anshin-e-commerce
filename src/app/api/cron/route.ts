import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  if (
    req.headers.get('Authorization') !== `Bearer ${process.env.CRON_SECRET}`
  ) {
    return NextResponse.json(
      { ok: false, error: 'Unauthorized' },
      { status: 401 }
    );
  }
  console.log('Running cron job...', req);
  return NextResponse.json({ ok: true });
}
