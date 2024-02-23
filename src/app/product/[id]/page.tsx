import { AddToCartButton } from '@/components/AddToCartButton';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { db } from '@/lib/server/db';
import { InsertReview, products } from '@/lib/server/tables';
import { useCartStore } from '@/lib/stores/cart';
import { cn } from '@/lib/utils';
import { eq } from 'drizzle-orm';
import { Car, StarIcon } from 'lucide-react';
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
          <AddToCartButton product={product} />
        </div>
      </Card>
      <div className="mt-8">
        <div className="mb-4">
          <h2 className="text-lg font-semibold">Customer Reviews</h2>
        </div>
        <div className="grid gap-4">
          {reviews.map((review) => (
            <ReviewCard key={review.id} review={review} />
          ))}
        </div>
      </div>
    </main>
  );
};

export default ProductPage;

type ReviewCardProps = {
  review: InsertReview;
};

const ReviewCard = ({ review }: ReviewCardProps) => {
  const { rating, description, username } = review;
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-4">
          <Avatar className="h-10 w-10 border">
            <AvatarImage alt="User" src="/placeholder-user.jpg" />
            <AvatarFallback>U</AvatarFallback>
          </Avatar>
          <div>
            <span className="font-semibold">{username}</span>
            <StarRating rating={rating} />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-4">
          <div>
            <div className="flex items-center gap-2"></div>
            <p className="text-gray-600">{description}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const StarRating = ({ rating }: { rating: number }) => {
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: 5 }).map((_, index) => (
        <StarIcon
          className={cn(
            'size-4',
            rating > index ? 'fill-primary' : 'fill-muted'
          )}
          key={index}
        />
      ))}
    </div>
  );
};
