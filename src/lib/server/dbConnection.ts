'use server';
import mysql from 'mysql2/promise';
import { cache } from 'react';

export async function createDbConnection() {
  return await mysql.createConnection({
    host:
      process.env.NODE_ENV === 'production'
        ? process.env.DATABASE_HOST
        : process.env.DATABASE_DEV_HOST,
    user: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
    database: 'anshin',
    port: process.env.NODE_ENV === 'production' ? 3306 : 3307,
  });
}

export async function initAction() {}
