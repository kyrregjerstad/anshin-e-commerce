'use client';

import { Product } from '@/lib/server/services/productService';
import {
  handleAddToCart,
  handleRemoveFromCart,
} from '@/lib/server/services/cartService';
import { cn } from '@/lib/utils';
import React from 'react';
import { Button } from './ui/button';
import { toast } from 'sonner';
import { XCircle } from 'lucide-react';

type Props = {
  product: Product;
  inCart: boolean;
} & React.ComponentPropsWithoutRef<'form'>;
export const AddToCartIconButton = ({ product, inCart, ...props }: Props) => {
  return (
    <form
      action={async () => {
        if (inCart) {
          toast.info(`Removed ${product.title} from cart`, {
            icon: <XCircle />,
          });
          await handleRemoveFromCart(product.id);
        } else {
          toast.success(`Added ${product.title} to cart`);
          await handleAddToCart({
            productId: product.id,
            quantity: 1,
          });
        }
      }}
      {...props}
    >
      <Button size="icon" variant="ghost" className="p-0">
        <AddToCartIcon inCart={inCart} />
        <span className="sr-only">Add to Cart</span>
      </Button>
    </form>
  );
};

const AddToCartIcon = ({ inCart }: { inCart: boolean }) => (
  <div className="relative">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={24}
      height={26}
      fill="none"
      viewBox="0 0 24 26"
    >
      <g fill="#000">
        <path d="M9.483.93a3.793 3.793 0 0 0-6.07 3.034V6.24H1.898a1.517 1.517 0 0 0-1.52 1.52v12.137a4.552 4.552 0 0 0 4.553 4.552h4.942a8.347 8.347 0 0 1-.997-1.517H4.93a3.033 3.033 0 0 1-3.034-3.035V7.76H11v4.94c.468-.386.976-.72 1.517-.997V7.76h4.552v3.067c.513.047 1.02.14 1.517.281V7.76a1.517 1.517 0 0 0-1.516-1.52h-1.517V3.965A3.794 3.794 0 0 0 9.482.931V.93ZM4.93 3.965a2.276 2.276 0 1 1 4.552 0v2.276H4.93V3.965Zm5.564-1.893a2.276 2.276 0 0 1 3.54 1.893v2.276H11V3.965a3.78 3.78 0 0 0-.506-1.893Z" />
      </g>
    </svg>
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={14}
      height={14}
      className={cn(
        'absolute bottom-0 right-0 transition-transform duration-300',
        inCart ? 'group-hover:rotate-45' : 'rotate-0'
      )}
    >
      <path
        fill="#000"
        d="M6.745 13.655A6.829 6.829 0 1 0 6.91 0a6.829 6.829 0 0 0-.165 13.656Zm0-10.62a.759.759 0 0 1 .76.758V6.07H9.78a.758.758 0 1 1 0 1.518H7.504v2.276a.759.759 0 0 1-1.517 0V7.587H3.711a.758.758 0 1 1 0-1.518h2.276V3.793a.758.758 0 0 1 .758-.758Z"
      />
    </svg>
  </div>
);
