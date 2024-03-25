'use server';
import mysql from 'mysql2/promise';

export async function createDbConnection() {
  try {
    return await mysql.createConnection({
      host: process.env.DATABASE_HOST,
      user: process.env.DATABASE_USERNAME,
      password: process.env.DATABASE_PASSWORD,
      database: 'anshin',
      port: process.env.NODE_ENV === 'production' ? 3306 : 3307,
    });
  } catch (error) {
    const isDev = process.env.NODE_ENV === 'development';
    if (isDev) {
      throw new Error(
        `Error connecting to database, did you remember to start docker? ${error}`
      );
    }
    throw new Error('Error connecting to database');
  }
}
