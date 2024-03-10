'use client';

import { handleRemoveFromCart } from '@/lib/server/services/cartService';
import { useCartStore } from '@/lib/hooks/useCartStore';
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
        await handleRemoveFromCart(sessionData.cartId, id);
      }}
    >
      <Button>Remove</Button>
    </form>
  );
};
