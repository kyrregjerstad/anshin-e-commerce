import { Card } from '@/components/ui/card';
import { Product } from '@/lib/server/services/productService';
import Image from 'next/image';
import Link from 'next/link';
import { AddToCartIconButton } from './AddToCartIconButton';
import { StarRating } from './StarRating';
import { cn } from '@/lib/utils';
import { AddToWishlistIconButton } from './AddToWishlistIconButton';

export type Props = {
  product: Product & { inCart: boolean; inWishlist: boolean };
};

export const ProductCard = async ({ product }: Props) => {
  const { title, imageUrl, averageRating, onSale, inCart, inWishlist } =
    product;

  return (
    <Card className="group flex flex-col justify-between overflow-hidden rounded-2xl sm:aspect-square">
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

        <AddToWishlistIconButton
          product={product}
          inWishlist={inWishlist}
          className={cn(
            'group absolute left-0 top-0 hidden rounded-full opacity-0 transition-opacity duration-300 group-hover:opacity-100 sm:block',
            inWishlist && 'opacity-100'
          )}
        />

        <AddToCartIconButton
          product={product}
          inCart={inCart}
          className={cn(
            'group absolute right-0 top-0 hidden rounded-full opacity-0 transition-opacity duration-300 group-hover:opacity-100 sm:block',
            inCart && 'opacity-100'
          )}
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
                  <span className="-top-3 left-0 pt-2 text-xs leading-snug line-through opacity-40 sm:absolute sm:left-auto sm:right-0 sm:pt-0">
                    ${product.price}
                  </span>
                  <span className="font-bold leading-snug">
                    ${product.discountPrice}
                  </span>
                </>
              ) : (
                <span className="font-bold leading-snug">${product.price}</span>
              )}
            </div>
            <AddToCartIconButton
              product={product}
              inCart={inCart}
              className="translate-x-3 translate-y-1 self-end p-0 sm:hidden"
            />
          </div>
        </div>
      </div>
    </Card>
  );
};
