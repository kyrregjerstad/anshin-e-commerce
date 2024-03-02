import { Label } from '@/components/ui/label';
import {
  SelectValue,
  SelectTrigger,
  SelectItem,
  SelectContent,
  Select,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { AvatarImage, AvatarFallback, Avatar } from '@/components/ui/avatar';
import { CardContent, Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { validateRequest } from '@/lib/auth';
import { db } from '@/lib/server/db';
import { products, images, reviews } from '@/lib/server/tables';
import { eq, sql } from 'drizzle-orm';
import { notFound } from 'next/navigation';
import { z } from 'zod';
import { StarRating } from '@/components/StarRating';
import { Review, getProductById } from '@/lib/server/productService';
import { HeartIcon, StarIcon } from 'lucide-react';
import Image from 'next/image';
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

  const { id } = result.data;

  const product = await getProductById(id);

  if (!product) {
    return notFound();
  }

  const { user, cart, cartId, session } = await validateRequest();

  const isInCart = cart.some((item) => item.id === product.id);

  const {
    title,
    description,
    price,
    discountPrice,
    onSale,
    images,
    averageRating,
    ratingPercentages,
    id: productId,
  } = product;

  return (
    <div className="flex max-w-6xl flex-col gap-8 p-8">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col justify-between gap-8">
          <div className="flex flex-col gap-4">
            <div className="flex gap-2">
              <h1 className="text-3xl font-bold">{title}</h1>
            </div>
            <StarRating rating={averageRating} />
            <p>{description}</p>
          </div>

          <form className="grid gap-4 md:gap-10">
            <div className="flex items-end gap-4">
              <div>
                <Label className="text-base" htmlFor="quantity">
                  Quantity
                </Label>
                <Select defaultValue="1">
                  <SelectTrigger className="w-24">
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1</SelectItem>
                    <SelectItem value="2">2</SelectItem>
                    <SelectItem value="3">3</SelectItem>
                    <SelectItem value="4">4</SelectItem>
                    <SelectItem value="5">5</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="text-4xl font-bold">${price}</div>
            </div>
            <div className="flex flex-col gap-2 min-[400px]:flex-row">
              <Button size="lg">Add to cart</Button>
              <Button size="lg" variant="outline">
                <HeartIcon className="mr-2 h-4 w-4" />
                Add to wishlist
              </Button>
            </div>
          </form>
        </div>
        <Image
          alt="Product Image"
          className="-order-1 aspect-square w-full overflow-hidden rounded-lg border border-gray-200 object-cover dark:border-gray-800 sm:order-1"
          height={600}
          src={images[0].url}
          width={600}
        />
      </div>
      <Separator />
      <div>
        <h2 className="pb-4 pt-8 text-xl font-bold">Product Reviews</h2>
        <ReviewBarChart ratingPercentages={ratingPercentages} />
      </div>
      <div>
        <h2 className="pb-4 pt-8 text-xl font-bold">User Reviews</h2>
        <div className="flex flex-col gap-4">
          {product.reviews.map((review) => (
            <UserReview key={review.id} review={review} />
          ))}
        </div>
      </div>
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
