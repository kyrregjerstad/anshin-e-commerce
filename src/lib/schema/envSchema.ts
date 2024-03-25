import { z } from 'zod';

export const envVariables = z.object({
  DATABASE_URL: z.string(),
  DATABASE_HOST: z.string(),
  DATABASE_DEV_HOST: z.string(),
  DATABASE_USERNAME: z.string(),
  DATABASE_PASSWORD: z.string(),
  DEMO_PASSWORD: z.string(),
  UPSTASH_REDIS_REST_URL: z.string(),
  UPSTASH_REDIS_REST_TOKEN: z.string(),
  SRH_TOKEN: z.string(),
});

envVariables.parse(process.env);

declare global {
  namespace NodeJS {
    interface ProcessEnv extends z.infer<typeof envVariables> {}
  }
}
