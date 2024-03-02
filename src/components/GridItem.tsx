import { Card } from '@/components/ui/card';
import { Product } from '@/lib/server/productService';
import { CartItem } from '@/lib/server/services/cartService';
import { Heart } from 'lucide-react';
import Image from 'next/image';
import { StarRating } from './StarRating';
import { Button } from './ui/button';
import Link from 'next/link';

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
    <Card className="group flex aspect-square flex-col overflow-hidden rounded-2xl">
      <div className="relative aspect-square overflow-hidden">
        <Link href={`/product/${product.id}`}>
          <Image
            src={imageUrl}
            width={300}
            height={300}
            alt="test"
            className="absolute h-full w-full object-cover"
          />
        </Link>
        <Button
          className="absolute left-0 top-0 rounded-full opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          variant="ghost"
          size="icon"
        >
          <Heart />
        </Button>
        <Button
          size="icon"
          variant="ghost"
          className="absolute right-0 top-0 rounded-full opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        >
          <AddToCartIcon />
        </Button>
      </div>
      <div className="relative">
        <div className="absolute top-0 max-w-40 -translate-y-1/2 truncate rounded-r-md border-t bg-gradient-to-tr from-tea-100 to-tea-50 p-2">
          <Link
            href={`/product/${product.id}`}
            className="font-medium hover:underline"
          >
            {title}
          </Link>
        </div>
        <div className="flex items-center justify-between p-2 pb-2 pt-4">
          <StarRating rating={averageRating} />

          <div className="relative flex flex-col text-end">
            {onSale ? (
              <>
                <span className="absolute -top-3 right-0 text-xs line-through opacity-40">
                  ${product.price}
                </span>
                <span className="font-bold">${product.discountPrice}</span>
              </>
            ) : (
              <span className="font-bold">${product.price}</span>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
};

const AddToCartIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width={24} height={26} fill="none">
    <path
      fill="#000"
      d="M16.31 25.965a6.828 6.828 0 1 0 0-13.655 6.828 6.828 0 0 0 0 13.655Zm0-10.62a.759.759 0 0 1 .759.758v2.276h2.276a.758.758 0 1 1 0 1.517h-2.276v2.276a.759.759 0 0 1-1.517 0v-2.276h-2.276a.758.758 0 1 1 0-1.517h2.276v-2.276a.758.758 0 0 1 .758-.758ZM9.483.93a3.793 3.793 0 0 0-6.07 3.034v2.276H1.898A1.517 1.517 0 0 0 .379 7.76v12.137a4.552 4.552 0 0 0 4.552 4.552h4.942a8.348 8.348 0 0 1-.997-1.517H4.93a3.034 3.034 0 0 1-3.034-3.035V7.76H11V12.7a8.35 8.35 0 0 1 1.517-.997V7.76h4.552v3.067c.513.047 1.021.14 1.517.281V7.76A1.517 1.517 0 0 0 17.07 6.24h-1.517V3.965A3.793 3.793 0 0 0 9.482.931ZM4.93 3.965a2.276 2.276 0 0 1 4.552 0v2.276H4.93V3.965Zm5.564-1.893a2.276 2.276 0 0 1 3.54 1.893v2.276H11V3.965a3.78 3.78 0 0 0-.505-1.893Z"
    />
  </svg>
);
