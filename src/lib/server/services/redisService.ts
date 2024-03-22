import { redis } from '../redis';

const ONE_HOUR_IN_SECONDS = 60 * 60;

export async function validateSession(sessionToken: string) {
  const sessionType = (await redis.get(`session:${sessionToken}`)) as
    | 'guest'
    | 'user'
    | null;

  return sessionType;
}

export async function refreshRedisSessionExpiration(sessionId: string) {
  const ttl = ONE_HOUR_IN_SECONDS;
  await redis.expire(`session:${sessionId}`, ttl);
}
