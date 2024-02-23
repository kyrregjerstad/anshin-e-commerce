'use client';

import { useCartStore } from '@/lib/stores/cart';
import React from 'react';
import { Button } from './ui/button';
import { Product } from '@/lib/server/productService';

type Props = {
  product: Product;
};
export const AddToCartButton = ({ product }: Props) => {
  const { addItem } = useCartStore();

  return (
    <Button
      onClick={() =>
        addItem({
          id: product.id,
          name: product.title,
          price: product.priceInCents,
          quantity: 1,
        })
      }
    >
      Add to Cart
    </Button>
  );
};
