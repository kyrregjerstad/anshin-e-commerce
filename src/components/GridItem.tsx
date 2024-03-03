import { Card } from '@/components/ui/card';
import { Product } from '@/lib/server/productService';
import { CartItem } from '@/lib/server/services/cartService';
import { Heart } from 'lucide-react';
import Image from 'next/image';
import { StarRating } from './StarRating';
import { Button } from './ui/button';
import Link from 'next/link';
import { AddToCartIconButton } from './AddToCartIconButton';

type Props = {
  product: Product;
  cartItems: CartItem[];
  sessionData: {
    sessionId: string;
    userId: string | null;
    cartId: string | null;
  };
};

export const GridItem = ({ sessionData, product, cartItems }: Props) => {
  const { title, description, imageUrl, averageRating, onSale } = product;

  const isInCart = cartItems.some((item) => item.id === product.id);

  return (
    <Card className="group flex flex-col overflow-hidden rounded-2xl sm:aspect-square">
      <div className="relative aspect-square overflow-hidden">
        <Link href={`/product/${product.id}`}>
          <Image
            src={imageUrl ?? '/placeholder.jpg'}
            width={300}
            height={300}
            alt="test"
            className="absolute h-full w-full object-cover"
          />
        </Link>
        <Button
          className="absolute left-0 top-0 rounded-full transition-opacity duration-300 group-hover:opacity-100 sm:opacity-0"
          variant="ghost"
          size="icon"
        >
          <Heart />
        </Button>

        <AddToCartIconButton
          sessionData={sessionData}
          product={product}
          className="absolute right-0 top-0 hidden rounded-full opacity-0 transition-opacity duration-300 group-hover:opacity-100 sm:block"
        />
      </div>
      <div className="relative">
        <div className="absolute top-0 max-w-48 -translate-y-1/2 truncate rounded-r-md border-t bg-gradient-to-tr from-tea-100 to-tea-50 px-4 py-2">
          <Link
            href={`/product/${product.id}`}
            className="font-medium hover:underline"
          >
            {title}
          </Link>
        </div>
        <div className="flex flex-col justify-between p-4 pb-3 sm:flex-row sm:items-center">
          <StarRating rating={averageRating} />
          <div className="flex justify-between">
            <div className="relative flex flex-col justify-end sm:text-end">
              {onSale ? (
                <>
                  <span className="-top-3 left-0 pt-2 text-xs line-through opacity-40 sm:absolute sm:left-auto sm:right-0 sm:pt-0">
                    ${product.price}
                  </span>
                  <span className="font-bold">${product.discountPrice}</span>
                </>
              ) : (
                <span className="font-bold">${product.price}</span>
              )}
            </div>
            <AddToCartIconButton
              sessionData={sessionData}
              product={product}
              className="translate-x-3 translate-y-1 self-end p-0 sm:hidden"
            />
          </div>
        </div>
      </div>
    </Card>
  );
};
