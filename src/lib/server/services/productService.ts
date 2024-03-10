'use server';

import { avg, eq, sql } from 'drizzle-orm';
import { db } from '../db';
import { cart, images, products, reviews } from '../tables';

export type Product = {
  id: string;
  title: string;
  price: number;
  discountPrice: number;
  onSale: boolean;
  imageUrl: string | null;
  averageRating: number;
};

export async function getAllProducts(sessionId: string | null) {
  const allProducts = await db
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
      imageUrl: images.url,
      averageRating: sql<number>`avg(${reviews.rating})`.mapWith(Number),
    })
    .from(products)
    .leftJoin(images, eq(products.id, images.itemId))
    .leftJoin(reviews, eq(products.id, reviews.itemId))
    .groupBy(products.id, images.url)
    .limit(100);

  return await checkForItemsInCart(allProducts, sessionId);
}

async function checkForItemsInCart(
  allProducts: Product[],
  sessionId: string | null
) {
  if (!sessionId) {
    return allProducts.map((product) => ({
      ...product,
      inCart: false,
    }));
  }

  const sessionCart = await db.query.cart.findFirst({
    where: eq(cart.sessionId, sessionId),
    columns: {
      userId: false,
      id: false,
      createdAt: false,
      updatedAt: false,
      sessionId: false,
    },
    with: {
      items: {
        columns: {
          productId: true,
        },
      },
    },
  });

  const sessionCartItems = sessionCart?.items || [];

  return allProducts.map((product) => ({
    ...product,
    inCart: sessionCartItems.some(({ productId }) => productId === product.id),
  }));
}

async function checkForItemInCart(productId: string, sessionId: string | null) {
  if (!sessionId) return false;

  const sessionCart = await db.query.cart.findFirst({
    where: eq(cart.sessionId, sessionId),
    columns: {
      userId: false,
      id: false,
      createdAt: false,
      updatedAt: false,
      sessionId: false,
    },
    with: {
      items: {
        columns: {
          productId: true,
        },
      },
    },
  });

  const sessionCartItems = sessionCart?.items || [];

  return sessionCartItems.some((item) => item.productId === productId);
}

export type Review = {
  id: string;
  username: string;
  rating: number;
  description: string;
};

type Image = {
  url: string;
  alt: string;
};

export async function getProductById(id: string, sessionId: string | null) {
  const res = await db
    .select({
      id: products.id,
      title: products.title,
      description: products.description,
      price: sql<number>`(${products.priceInCents} / 100)`.mapWith(Number),
      discountPrice: sql<number>`(${products.discountInCents} / 100)`.mapWith(
        Number
      ),
      onSale:
        sql<boolean>`(${products.discountInCents} < ${products.priceInCents})`.mapWith(
          Boolean
        ),
      images: sql<Image[]>`JSON_ARRAYAGG(
        JSON_OBJECT(
          'url', ${images.url},
          'alt', ${images.alt}
        )
      )`.mapWith((value) => value as Image[]),
      reviews: sql<Review[]>`JSON_ARRAYAGG(
        JSON_OBJECT(
          'id', ${reviews.id},
          'username', ${reviews.username},
          'rating', ${reviews.rating},
          'description', ${reviews.description}
        )
      )`.mapWith((value) => value as Review[]),
      averageRating: avg(reviews.rating || 0).mapWith(Number),
    })
    .from(products)
    .leftJoin(images, eq(products.id, images.itemId))
    .leftJoin(reviews, eq(products.id, reviews.itemId))
    .groupBy(products.id, images.url, images.alt)
    .where(eq(products.id, id));

  const singleProduct = {
    ...res[0],
    reviews:
      res[0].reviews && res[0].reviews[0].id !== null ? res[0].reviews : [],
  };

  if (!singleProduct) return null;

  const ratingPercentages = calculateRatingPercentages(singleProduct.reviews);

  return {
    ...singleProduct,
    ratingPercentages,
    inCart: await checkForItemInCart(id, sessionId),
  };
}

function calculateRatingPercentages(reviews: Review[]): Record<number, number> {
  const totalReviews = reviews.length;
  if (totalReviews === 0) return { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };

  const ratingCounts = reviews.reduce(
    (acc, { rating }) => {
      acc[rating] = (acc[rating] || 0) + 1;
      return acc;
    },
    {} as Record<number, number>
  );

  return [1, 2, 3, 4, 5].reduce(
    (percentages, rating) => {
      percentages[rating] = ((ratingCounts[rating] || 0) / totalReviews) * 100;
      return percentages;
    },
    {} as Record<number, number>
  );
}
