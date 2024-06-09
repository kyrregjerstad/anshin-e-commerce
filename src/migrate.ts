import 'dotenv/config';
import { migrate } from 'drizzle-orm/mysql2/migrator';
import config from '../drizzle.config';

import { db, dbConnection } from './lib/server/db';

async function main() {
  if (!process.env.DB_MIGRATING) {
    throw new Error(
      `You must set the DB_MIGRATING environment variable to true to run this command. 
      This is to ensure only a single db connection is used during migrations.`
    );
  }

  await migrate(db, { migrationsFolder: config.out });

  await dbConnection.end();
}

main().catch(console.error);
