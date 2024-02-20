'use server';

import { db } from './db';

export async function getAllProducts() {
  return await db.query.products.findMany({
    with: {
      images: true,
    },
  });
}

export type Product = Awaited<ReturnType<typeof getAllProducts>>[number];
