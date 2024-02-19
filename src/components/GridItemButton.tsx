'use client';
import { useCartStore } from '@/lib/stores/cart';
import { Button } from './ui/button';

export const GridItemButton = () => {
  const { addItem } = useCartStore();

  return (
    <Button
      onClick={() =>
        addItem({ id: '123', name: 'test', price: 10, quantity: 1 })
      }
    >
      View
    </Button>
  );
};
