'use server';
import mysql from 'mysql2/promise';

let cachedConnection: mysql.Connection | null = null;

// Hot reloading in nextjs dev mode will cause this file to
// be reloaded and the connections to mysql to pile up
export const createDbConnection = async (): Promise<mysql.Connection> => {
  if (process.env.NODE_ENV !== 'production') {
    if (cachedConnection) {
      return cachedConnection;
    }

    try {
      cachedConnection = await dbConnection;
      return cachedConnection;
    } catch (error) {
      const isDev = process.env.NODE_ENV === 'development';
      if (isDev) {
        throw new Error(
          `Error connecting to database, did you remember to start docker? ${error}`
        );
      }
      throw new Error('Error connecting to database');
    }
  } else {
    try {
      return await dbConnection;
    } catch (error) {
      throw new Error(`Error connecting to database: ${error}`);
    }
  }
};

const dbConnection = mysql.createConnection({
  host: process.env.DATABASE_HOST,
  user: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
  database: 'anshin',
  port: Number(process.env.DATABASE_PORT), // 💡 3307 when using docker and 3306 for deployment
});
