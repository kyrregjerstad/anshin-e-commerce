import { Client } from '@planetscale/database';
import { Logger } from 'drizzle-orm/logger';
import { drizzle } from 'drizzle-orm/planetscale-serverless';

import * as schema from './tables';

const client = new Client({
  host: process.env.DATABASE_HOST,
  username: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
});

class CustomLogger implements Logger {
  logQuery(query: string, params: unknown[]): void {
    console.log({ query, params });
  }
}

export const db = drizzle(client, { schema });
