'use server';
import mysql from 'mysql2/promise';

export async function createDbConnection() {
  try {
    return await mysql.createConnection({
      host: process.env.DATABASE_HOST,
      user: process.env.DATABASE_USERNAME,
      password: process.env.DATABASE_PASSWORD,
      database: 'anshin',
      port: Number(process.env.DATABASE_PORT), // 3307 when using docker and 3306 for deployment
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
