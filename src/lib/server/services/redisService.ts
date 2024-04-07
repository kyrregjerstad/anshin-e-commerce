/* eslint-disable drizzle/enforce-delete-with-where */
import { ONE_HOUR_IN_SECONDS } from '@/lib/constants';
import { redis } from '../redis';

type SessionType = 'guest' | 'user' | null;

// fast in-memory cache for recent sessions, to avoid calling redis
// since this is running in a serverless edge environment, this cache is per instance and can be cleared after the function execution depending on the cloud provider
// vercel seems to keep the instance alive for a few minutes, so this cache will be useful for repeated requests within the same instance
const recentSessions = new Map<string, SessionType>();

export async function getSessionType(
  sessionToken: string
): Promise<SessionType> {
  if (recentSessions.has(sessionToken)) {
    console.count('cache hit');
    return recentSessions.get(sessionToken)!;
  }

  console.count('calling redis');

  const sessionType = (await redis.get(
    `session:${sessionToken}`
  )) as SessionType;

  if (sessionType !== null) {
    recentSessions.set(sessionToken, sessionType);
    setTimeout(() => {
      console.log(`deleting key ${sessionToken} from cache`);
      recentSessions.delete(sessionToken);
    }, 1000); // deletes the cache key after 1 second
  }

  return sessionType;
}

export async function refreshRedisSessionExpiration(sessionToken: string) {
  const ttl = ONE_HOUR_IN_SECONDS;
  await redis.expire(`session:${sessionToken}`, ttl);
}
