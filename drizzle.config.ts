import type { Config } from 'drizzle-kit';
import 'dotenv/config';

export default {
  schema: './src/lib/server/tables.ts',
  out: './drizzle',
  driver: 'mysql2',
  dbCredentials: {
    uri: process.env.DATABASE_URL,
  },
  tablesFilter: ['anshin_*'],
  verbose: true,
  strict: true,
} satisfies Config;
