import { Logger } from 'drizzle-orm/logger';
import { drizzle } from 'drizzle-orm/mysql2';

import * as schema from './tables';

import mysql from 'mysql2/promise';
import { dbPoolConnection } from './dbConnection';

class CustomLogger implements Logger {
  logQuery(query: string, params: unknown[]): void {
    console.log({ query, params });
  }
}

export const db = drizzle(dbPoolConnection, { schema, mode: 'default' });
