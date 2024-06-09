import { Logger } from 'drizzle-orm/logger';
import { drizzle } from 'drizzle-orm/mysql2';

import * as schema from '../tables';
import * as dotenv from 'dotenv';

import { createPool, type Pool } from 'mysql2/promise';

class CustomLogger implements Logger {
  logQuery(query: string, params: unknown[]): void {
    console.log({ query, params });
  }
}

dotenv.config(); // 💡 This is required to load the .env file while seeding

/**
 * Cache the database connection in development. This avoids creating a new connection on every HMR update.
 */
const globalForDb = globalThis as unknown as {
  connection: Pool | undefined;
};

export const dbConnection =
  globalForDb.connection ??
  createPool({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
    database: 'anshin',
    port: Number(process.env.DATABASE_PORT), // 💡 3307 when using docker and 3306 for deployment
    uri: process.env.DATABASE_URL,
    connectionLimit:
      process.env.DB_MIGRATING || process.env.DB_SEEDING ? 1 : undefined,
  });

if (process.env.NODE_ENV !== 'production') {
  globalForDb.connection = dbConnection;
}

export const db = drizzle(dbConnection, { schema, mode: 'default' });
