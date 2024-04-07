/* eslint-disable drizzle/enforce-delete-with-where */
import { redis } from '../redis';

const ONE_HOUR_IN_SECONDS = 60 * 60;
type SessionType = 'guest' | 'user' | null;
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
    }, 1000); // deletes the key after 1 second
  }

  return sessionType;
}

export async function refreshRedisSessionExpiration(sessionToken: string) {
  const ttl = ONE_HOUR_IN_SECONDS;

  await redis.expire(`session:${sessionToken}`, 60);
}
