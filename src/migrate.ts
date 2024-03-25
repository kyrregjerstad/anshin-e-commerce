import 'dotenv/config';
import { drizzle } from 'drizzle-orm/mysql2';
import { migrate } from 'drizzle-orm/mysql2/migrator';
import * as schema from './lib/server/tables';

import { createDbConnection } from './lib/server/dbConnection';

async function main() {
  const connection = await createDbConnection();

  const db = drizzle(connection, { schema, mode: 'default' });
  // This will run migrations on the database, skipping the ones already applied
  await migrate(db, { migrationsFolder: './drizzle' });

  // Don't forget to close the connection, otherwise the script will hang
  await connection.end();
}

main().catch(console.error);
