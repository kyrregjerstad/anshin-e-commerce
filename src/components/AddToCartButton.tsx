'use client';

import { useCartStore } from '@/lib/stores/useCartStore';
import React from 'react';
import { Button } from './ui/button';
import { Product } from '@/lib/server/productService';
import { addItemToCart } from '@/lib/server/services/cartService';

type Props = {
  sessionId: string;
  product: Product;
};
export const AddToCartButton = ({ sessionId, product }: Props) => {
  const { addItem } = useCartStore();

  return (
    <form
      action={async () => {
        addItem({
          ...product,
          quantity: 1,
        });
        await addItemToCart({
          sessionId,
          product: {
            productId: product.id,
            quantity: 1,
          },
        });
      }}
    >
      <Button>Add to Cart</Button>
    </form>
  );
};
