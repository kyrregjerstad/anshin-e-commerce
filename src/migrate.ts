import 'dotenv/config';
import { migrate } from 'drizzle-orm/mysql2/migrator';
import { drizzle } from 'drizzle-orm/mysql2';
import * as schema from './lib/server/tables';

import mysql from 'mysql2/promise';

async function main() {
  const connection = await mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
    database: 'anshin',
  });

  const db = drizzle(connection, { schema, mode: 'default' });
  // This will run migrations on the database, skipping the ones already applied
  await migrate(db, { migrationsFolder: './drizzle' });

  // Don't forget to close the connection, otherwise the script will hang
  await connection.end();
}

main().catch(console.error);
