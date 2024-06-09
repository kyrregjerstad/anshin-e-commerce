import { type Config } from 'drizzle-kit';
import 'dotenv/config';

export default {
  schema: './src/lib/server/tables.ts',
  out: './drizzle',
  dialect: 'mysql',
  dbCredentials: {
    url: process.env.DATABASE_URL,
  },
  tablesFilter: ['anshin_*'],
  verbose: true,
  strict: true,
} satisfies Config;
