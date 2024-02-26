'use client';

import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import { removeItemFromCart } from '@/lib/server/cartService';
import { CartAction } from './CartItems';

type Props = {
  itemId: string;
  dispatch: (action: CartAction) => void;
};

export const RemoveFromCartButton = ({ itemId, dispatch }: Props) => {
  return (
    <form
      action={async () => {
        dispatch({
          type: 'REMOVE_ITEM',
          itemId,
        });

        await removeItemFromCart(itemId);
      }}
    >
      <Button variant="ghost" type="submit">
        <X />
      </Button>
    </form>
  );
};
