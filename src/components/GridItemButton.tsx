'use client';
import { addItemToCart, removeItemFromCart } from '@/lib/server/cartService';
import { Product } from '@/lib/server/productService';
import { useCartStore } from '@/lib/stores/useCartStore';
import Link from 'next/link';
import { Button, buttonVariants } from './ui/button';

type Props = {
  product: Product;
};

export const GridItemButton = ({ product }: Props) => {
  const { addItem, removeItem, items } = useCartStore();

  const isInCart = items.some((item) => item.id === product.id);

  return (
    <>
      {isInCart ? (
        <form
          action={async () => {
            removeItem(product.id);
            await removeItemFromCart(product.id);
          }}
        >
          <Button type="submit">Remove</Button>
        </form>
      ) : (
        <form
          action={async () => {
            addItem({ ...product, quantity: 1 });
            await addItemToCart(product.id, 1);
          }}
        >
          <Button type="submit">Add to Cart</Button>
        </form>
      )}
      <Link
        href={`/product/${product.id}`}
        className={buttonVariants({ variant: 'outline' })}
      >
        View
      </Link>
    </>
  );
};
