'use client';

import { useCartStore } from '@/lib/stores/useCartStore';
import React from 'react';
import { Button } from './ui/button';
import { Product } from '@/lib/server/productService';
import { addItemToCart, removeItemFromCart } from '@/lib/server/cartService';

type Props = {
  product: Product;
};
export const RemoveFromCartButton = ({ product }: Props) => {
  const { addItem, removeItem } = useCartStore();

  return (
    <form
      action={async () => {
        removeItem(product.id);
        await removeItemFromCart(product.id);
      }}
    >
      <Button>Remove</Button>
    </form>
  );
};
