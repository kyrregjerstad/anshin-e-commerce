import { StarRating } from '@/components/StarRating';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { getSessionCookie } from '@/lib/server/auth/cookies';
import { Review, getProductById } from '@/lib/server/services/productService';
import { StarIcon } from 'lucide-react';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { z } from 'zod';
import { ProductInteractions } from './ProductInteractions';
import { Metadata, ResolvingMetadata } from 'next';

const paramsSchema = z.object({
  id: z.string().length(36),
});

type Props = {
  params: {
    id: string;
  };
};

export default async function ProductDetailsPage({ params }: Props) {
  const result = paramsSchema.safeParse(params);

  // since we know that the id should contain a valid UUID, we can safely throw a 404 if it's shorter than 36 characters, which saves us a db query
  if (!result.success) {
    return notFound();
  }
  const { id: productId } = result.data;
  const sessionId = getSessionCookie();
  const product = await getProductById(productId, sessionId);

  if (!product) {
    return notFound();
  }

  const { title, description, images, averageRating, ratingPercentages } =
    product;

  return (
    <div className="flex max-w-6xl flex-col items-center gap-8 px-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col justify-between gap-8">
          <div className="flex flex-col gap-8">
            <div>
              <h1 className="text-4xl font-bold">{title}</h1>
              <StarRating rating={averageRating} />
            </div>
            <ProductInteractions {...product} />
            <p>{description}</p>
          </div>
        </div>
        <Image
          alt="Product Image"
          className="-order-1 aspect-square w-full overflow-hidden rounded-lg border border-gray-200 object-cover dark:border-gray-800 sm:order-1"
          height={600}
          src={images[0].url}
          width={600}
        />
      </div>
      <Separator className="my-6" />
      <section className="flex w-full flex-1 flex-col gap-4">
        <h2 className="text-xl font-bold">Reviews</h2>
        <div className="flex w-full flex-1 gap-8">
          <div className="flex-1">
            <div className="flex flex-col gap-4">
              {product.reviews.map((review) => (
                <UserReview key={review.id} review={review} />
              ))}
            </div>
          </div>
          <div className="flex-1">
            <ReviewBarChart ratingPercentages={ratingPercentages} />
          </div>
        </div>
      </section>
    </div>
  );
}

const UserReview = ({ review }: { review: Review }) => {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-start gap-4">
          <Avatar>
            <AvatarImage alt="User" src="/placeholder-avatar.jpg" />
            <AvatarFallback>U</AvatarFallback>
          </Avatar>
          <div>
            <div>
              <h3 className="font-semibold">{review.username}</h3>
              <StarRating rating={review.rating} />
            </div>
            <p>{review.description}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const ReviewBarChart = ({
  ratingPercentages,
}: {
  ratingPercentages: Record<number, number>;
}) => {
  return (
    <div className="flex flex-col items-center gap-2">
      {[5, 4, 3, 2, 1].map((rating) => (
        <div key={rating} className="flex w-full flex-col">
          <div className="flex items-center justify-end gap-2">
            <span className="flex w-4 justify-center text-center">
              {rating}
            </span>
            <StarIcon className="h-5 w-5 fill-primary" />
            <Progress
              max={100}
              value={ratingPercentages[rating]}
              className="h-2"
            />
            <span className="w-12">{ratingPercentages[rating]}%</span>
          </div>
        </div>
      ))}
    </div>
  );
};

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const result = paramsSchema.safeParse(params);

  // since we know that the id should contain a valid UUID, we can safely throw a 404 if it's shorter than 36 characters, which saves us a db query
  if (!result.success) {
    return notFound();
  }
  const { id: productId } = result.data;
  const sessionId = getSessionCookie();
  const product = await getProductById(productId, sessionId);

  if (!product) {
    return notFound();
  }

  const { title, description, images, averageRating } = product;

  return {
    title: `${title} | Anshin`,
    description,
  };
}
