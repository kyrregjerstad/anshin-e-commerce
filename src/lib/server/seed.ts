/* eslint-disable drizzle/enforce-delete-with-where */
import * as dotenv from 'dotenv';
import { drizzle } from 'drizzle-orm/mysql2';
import { Argon2id } from 'oslo/password';

import { Redis } from '@upstash/redis';
import {
  seedAddressesData,
  seedCartsData,
  seedImagesData,
  seedItemsToCartsData,
  seedProductsData,
  seedReviewData,
  seedSessionsData,
  seedUsersData,
  seedWishlistData,
} from '../seedData';
import { db, dbConnection } from '@/lib/server/db';
import * as schema from './tables';
import { MySqlTableWithColumns, TableConfig } from 'drizzle-orm/mysql-core';

dotenv.config();

const productionEnv = process.env.NODE_ENV === 'production';

export const redis = new Redis({
  url: productionEnv
    ? process.env.UPSTASH_REDIS_REST_URL
    : 'http://localhost:8079',
  token: productionEnv
    ? process.env.UPSTASH_REDIS_REST_TOKEN
    : process.env.SRH_TOKEN,
});

if (!process.env.DB_SEEDING) {
  throw new Error(
    `You must set the DB_SEEDING environment variable to true to run this command. 
    This is to ensure only a single db connection is used during seeding.`
  );
}

const main = async () => {
  await db.transaction(async (tx) => {
    await deleteTableData(tx, schema.wishlist);
    await deleteTableData(tx, schema.wishlistItems);
    await deleteTableData(tx, schema.orderItems);
    await deleteTableData(tx, schema.orders);
    await deleteTableData(tx, schema.products);
    await deleteTableData(tx, schema.cart);
    await deleteTableData(tx, schema.sessions);
    await deleteTableData(tx, schema.users);

    await seedProducts(tx);
    await seedImages(tx);
    await seedUsers(tx);
    await seedWishlists(tx);
    await seedAddresses(tx);
    await seedSessions(tx);
    await seedCarts(tx);
    await seedItemsToCarts(tx);
    await seedReviews(tx);
  });

  await dbConnection.end();

  await seedRedis();
};

main();

async function seedRedis() {
  await redis.flushall();

  for (const product of seedProductsData) {
    await redis.set(`product:${product.id}:title`, product.title);
  }

  console.log('🔥 Seeded Redis Product Data');
}

type DB = ReturnType<typeof drizzle>;

async function deleteTableData<T extends TableConfig>(
  db: DB,
  table: MySqlTableWithColumns<T>
) {
  await db.delete(table).execute();

  console.log(`🗑️  Deleted table data`);
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

async function seedWishlists(db: DB) {
  await db.insert(schema.wishlist).values(seedWishlistData).execute();

  console.log('🎁 Seeded wishlists');
}

async function seedAddresses(db: DB) {
  await db.insert(schema.address).values(seedAddressesData).execute();

  console.log('🏠 Seeded addresses');
}

async function seedCarts(db: DB) {
  await db.insert(schema.cart).values(seedCartsData).execute();

  console.log('🛒 Seeded carts');
}

async function seedItemsToCarts(db: DB) {
  await db.insert(schema.cartItems).values(seedItemsToCartsData).execute();

  console.log('📦 Seeded items to carts');
}

async function seedProducts(db: DB) {
  await db.insert(schema.products).values(seedProductsData).execute();

  console.log('🤝 Seeded products');
}

async function seedImages(db: DB) {
  await db.insert(schema.images).values(seedImagesData).execute();

  console.log('📸 Seeded images');
}

async function seedReviews(db: DB) {
  await db.insert(schema.reviews).values(seedReviewData).execute();

  console.log('📝 Seeded reviews');
}

async function seedSessions(db: DB) {
  await db.insert(schema.sessions).values(seedSessionsData).execute();

  console.log('📝 Seeded sessions');
}
