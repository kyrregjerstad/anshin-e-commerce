'use client';

import { useCartStore } from '@/lib/stores/useCartStore';
import React from 'react';
import { Button } from './ui/button';
import { Product } from '@/lib/server/productService';
import { addItemToCart } from '@/lib/server/services/cartService';

type Props = {
  product: Product;
};
export const AddToCartButton = ({ product }: Props) => {
  const { addItem } = useCartStore();

  return (
    <form
      action={async () => {
        addItem({
          ...product,
          quantity: 1,
        });
        await addItemToCart(product.id, 1);
      }}
    >
      <Button>Add to Cart</Button>
    </form>
  );
};
