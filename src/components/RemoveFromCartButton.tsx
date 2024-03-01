'use client';

import { removeItemFromCart } from '@/lib/server/services/cartService';
import { useCartStore } from '@/lib/stores/useCartStore';
import { Button } from './ui/button';

type Props = {
  id: string;
  sessionData: {
    cartId: string | null;
  };
};
export const RemoveFromCartButton = ({ sessionData, id }: Props) => {
  const { removeItem } = useCartStore();

  return (
    <form
      action={async () => {
        removeItem(id);
        await removeItemFromCart(sessionData.cartId, id);
      }}
    >
      <Button>Remove</Button>
    </form>
  );
};
