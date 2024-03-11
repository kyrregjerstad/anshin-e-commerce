import { Redis } from '@upstash/redis';

const productionEnv = process.env.NODE_ENV === 'production';

export const redis = new Redis({
  url: productionEnv
    ? process.env.UPSTASH_REDIS_REST_URL
    : 'http://localhost:8079',
  token: productionEnv
    ? process.env.UPSTASH_REDIS_REST_TOKEN
    : process.env.SRH_TOKEN,
});
