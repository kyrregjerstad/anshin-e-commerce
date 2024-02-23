import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { db } from '@/lib/server/db';
import { products } from '@/lib/server/tables';
import { eq } from 'drizzle-orm';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import React from 'react';

import { z } from 'zod';

const paramsSchema = z.object({
  id: z.string().length(36),
});

type Props = {
  params: {
    id: string;
  };
};

const ProductPage = async ({ params }: Props) => {
  const result = paramsSchema.safeParse(params);

  // since we know that the id should contain a valid UUID, we can safely throw a 404 if it's shorter than 36 characters, which saves us a db query
  if (!result.success) {
    return notFound();
  }

  const { id } = result.data;

  const product = await db.query.products.findFirst({
    where: eq(products.id, id),
    with: {
      images: true,
      tags: true,
      reviews: true,
    },
  });

  if (!product) {
    return notFound();
  }

  const {
    title,
    description,
    priceInCents,
    discountInCents,
    images,
    tags,
    reviews,
    id: productId,
  } = product;

  return (
    <main className="flex flex-col gap-4">
      <Card className="mx-auto max-w-2xl bg-white p-4">
        <div className="mb-6">
          <Image
            alt="Vanilla Perfume"
            className="h-auto w-full rounded-lg"
            height="300"
            src={images[0].url}
            style={{
              aspectRatio: '300/300',
              objectFit: 'cover',
            }}
            width="300"
          />
        </div>
        <div className="mb-4">
          <h1 className="text-2xl font-bold">{title}</h1>
          <p className="text-gray-600">{description}</p>
        </div>
        <div className="mb-4 flex items-baseline space-x-2">
          <span className="text-xl font-semibold">
            ${(priceInCents / 10000).toFixed(2)}
          </span>
          <span className="text-sm text-gray-500 line-through">
            ${(discountInCents / 10000).toFixed(2)}
          </span>
        </div>
        <div className="flex space-x-4">
          <Button>Add to Cart</Button>
        </div>
      </Card>
      {reviews.length > 0 && (
        <Card className="mx-auto max-w-2xl bg-white p-4">
          <h2 className="mb-4 text-xl font-bold">Reviews</h2>
          <ul className="space-y-4">
            {reviews.map((review) => (
              <li key={review.id}>
                <h3 className="text-lg font-semibold">{review.username}</h3>
                <p>{review.description}</p>
              </li>
            ))}
          </ul>
        </Card>
      )}
    </main>
  );
};

export default ProductPage;
