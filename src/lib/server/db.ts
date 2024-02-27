import { connect } from '@planetscale/database';
import { drizzle } from 'drizzle-orm/planetscale-serverless';
import { Logger } from 'drizzle-orm/logger';

import * as schema from './tables';

export const connection = connect({
  host: process.env.DATABASE_HOST,
  username: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
});

class CustomLogger implements Logger {
  logQuery(query: string, params: unknown[]): void {
    console.log({ query, params });
  }
}

export const db = drizzle(connection, { schema });
