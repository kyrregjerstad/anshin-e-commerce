'use client';
import { useCartStore } from '@/lib/stores/cart';
import { Button, buttonVariants } from './ui/button';
import Link from 'next/link';
import { Product } from '@/lib/server/productService';

type Props = {
  product: Product;
};

export const GridItemButton = ({ product }: Props) => {
  const { addItem } = useCartStore();
  const { id: productId, title } = product;

  return (
    <>
      <Button
        onClick={() =>
          addItem({ id: productId, name: title, price: 10, quantity: 1 })
        }
      >
        +
      </Button>
      <Link
        href={`/product/${productId}`}
        className={buttonVariants({ variant: 'outline' })}
      >
        View
      </Link>
    </>
  );
};
