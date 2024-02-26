'use client';

import { removeItemFromCart } from '@/lib/server/cartService';
import { useCartStore } from '@/lib/stores/useCartStore';
import { Button } from './ui/button';

type Props = {
  id: string;
};
export const RemoveFromCartButton = ({ id }: Props) => {
  const { removeItem } = useCartStore();

  return (
    <form
      action={async () => {
        removeItem(id);
        await removeItemFromCart(id);
      }}
    >
      <Button>Remove</Button>
    </form>
  );
};
