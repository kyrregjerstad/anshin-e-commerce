'use server';
import mysql from 'mysql2/promise';

// https://www.prisma.io/docs/orm/more/help-and-troubleshooting/help-articles/nextjs-prisma-client-dev-practices
declare global {
  var cachedDbConnection: mysql.Pool | undefined;
}

export const createDbConnection = async (): Promise<mysql.Pool> => {
  if (process.env.NODE_ENV !== 'production') {
    if (!global.cachedDbConnection) {
      global.cachedDbConnection = createPool();
    }
    return global.cachedDbConnection;
  } else {
    return createPool();
  }
};

function createPool() {
  return mysql.createPool({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
    database: 'anshin',
    port: Number(process.env.DATABASE_PORT), // 💡 3307 when using docker and 3306 for deployment
  });
}
