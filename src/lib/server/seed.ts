import { connect } from '@planetscale/database';
import { Argon2id } from 'oslo/password';
import * as dotenv from 'dotenv';
import { drizzle } from 'drizzle-orm/planetscale-serverless';
import {
  seedImagesData,
  seedProductsData,
  seedReviewData,
  seedUsersData,
} from '../seedData';
import * as schema from './tables';

dotenv.config();

const main = async () => {
  const connection = connect({
    host: process.env.DATABASE_HOST,
    username: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
  });

  const db = drizzle(connection, { schema });

  await deleteSessions(db);
  await deleteProducts(db);
  await deleteUsers(db);

  await seedProducts(db);
  await seedImages(db);
  await seedUsers(db);
  await seedReviews(db);
};

main();

type DB = ReturnType<typeof drizzle>;

async function deleteSessions(db: DB) {
  await db.delete(schema.sessions).execute();

  console.log('🗑️  Deleted sessions');
}

async function deleteUsers(db: DB) {
  await db.delete(schema.users).execute();

  console.log('🗑️  Deleted users');
}

async function seedUsers(db: DB) {
  const demoPassword = process.env.DEMO_PASSWORD;
  if (!demoPassword) {
    throw new Error('No password found in ENV file, aborting...');
  }

  const users = await Promise.all(
    seedUsersData.map(async (user) => ({
      ...user,
      hashedPassword: await new Argon2id().hash(demoPassword),
    }))
  );

  await db.insert(schema.users).values(users).execute();
  console.log('🫅 Seeded users');
}

async function deleteProducts(db: DB) {
  await db.delete(schema.products).execute();

  console.log('🗑️  Deleted products');
}

async function seedProducts(db: DB) {
  await db.insert(schema.products).values(seedProductsData).execute();

  console.log('🤝 Seeded products');
}

async function deleteImages(db: DB) {
  await db.delete(schema.images).execute();

  console.log('🗑️  Deleted images');
}

async function seedImages(db: DB) {
  await db.insert(schema.images).values(seedImagesData).execute();

  console.log('📸 Seeded images');
}

async function seedReviews(db: DB) {
  await db.insert(schema.reviews).values(seedReviewData).execute();

  console.log('📝 Seeded reviews');
}
