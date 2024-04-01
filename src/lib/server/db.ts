import { Logger } from 'drizzle-orm/logger';
import { drizzle } from 'drizzle-orm/mysql2';

import * as schema from './tables';
import { createDbConnection } from './dbConnection';

export const connection = await createDbConnection();

class CustomLogger implements Logger {
  logQuery(query: string, params: unknown[]): void {
    console.log({ query, params });
  }
}

export const db = drizzle(connection, { schema, mode: 'default' });
