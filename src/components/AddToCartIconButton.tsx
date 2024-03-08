'use client';

import { Product } from '@/lib/server/productService';
import { addItemToCart } from '@/lib/server/services/cartService';
import { useCartStore } from '@/lib/stores/useCartStore';
import React from 'react';
import { Button } from './ui/button';

type Props = {
  product: Product;
} & React.ComponentPropsWithoutRef<'form'>;
export const AddToCartIconButton = ({ product, ...props }: Props) => {
  const { addItem } = useCartStore();

  return (
    <form
      action={async () => {
        addItem({
          ...product,
          quantity: 1,
        });
        await addItemToCart({
          productId: product.id,
          quantity: 1,
        });
      }}
      {...props}
    >
      <Button size="icon" variant="ghost" className="p-0">
        <AddToCartIcon />
        <span className="sr-only">Add to Cart</span>
      </Button>
    </form>
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
