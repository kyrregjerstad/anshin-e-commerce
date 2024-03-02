'use server';

import { eq, sql } from 'drizzle-orm';
import { db } from './db';
import { images, products, reviews } from './tables';

export async function getAllProducts() {
  return await db
    .select({
      id: products.id,
      title: products.title,
      price: sql<number>`(${products.priceInCents} / 100)`.mapWith(Number),
      discountPrice: sql<number>`(${products.discountInCents} / 100)`.mapWith(
        Number
      ),
      onSale:
        sql<boolean>`(${products.discountInCents} < ${products.priceInCents})`.mapWith(
          Boolean
        ),
      description: products.description,
      imageUrl: images.url,
      averageRating: sql<number>`avg(${reviews.rating})`.mapWith(Number),
    })
    .from(products)
    .leftJoin(images, eq(products.id, images.itemId))
    .leftJoin(reviews, eq(products.id, reviews.itemId))
    .groupBy(products.id, images.url)
    .limit(100);
}

export type Product = Awaited<ReturnType<typeof getAllProducts>>[number];
