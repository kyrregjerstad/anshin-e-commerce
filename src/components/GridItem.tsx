import { AspectRatio } from '@/components/ui/aspect-ratio';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { CartItem } from '@/lib/server/cartService';
import { Product } from '@/lib/server/productService';
import Image from 'next/image';
import Link from 'next/link';
import { AddToCartButton } from './AddToCartButton';
import { RemoveFromCartButton } from './RemoveFromCartButton';
import { buttonVariants } from './ui/button';

type Props = {
  product: Product;
  cartItems: CartItem[];
};

export const GridItem = ({ product, cartItems }: Props) => {
  const { title, description, images } = product;

  const isInCart = cartItems.some((item) => item.id === product.id);

  const coverImageUrl = images[0].url;
  return (
    <Card className="flex flex-col">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <AspectRatio ratio={16 / 9} className="bg-muted">
          <Image
            src={coverImageUrl}
            alt={`Anshin - ${title} - ${description}`}
            fill
            className="rounded-md object-cover"
          />
        </AspectRatio>
      </CardContent>
      <div className="flex-1" />
      <CardFooter className="flex justify-between">
        {isInCart ? (
          <RemoveFromCartButton id={product.id} />
        ) : (
          <AddToCartButton product={product} />
        )}
        <Link
          href={`/product/${product.id}`}
          className={buttonVariants({ variant: 'outline' })}
        >
          View
        </Link>
      </CardFooter>
    </Card>
  );
};
