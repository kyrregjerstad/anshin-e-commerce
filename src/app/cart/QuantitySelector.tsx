'use client';
import { Button } from '@/components/ui/button';
import { CartItem } from '@/lib/server/cartService';
import { CartAction } from './CartItems';

export const QuantitySelector = ({
  item,
  cartId,
  dispatch,
}: {
  item: CartItem;
  cartId: number;
  dispatch: (action: CartAction) => void;
}) => {
  return (
    <div className="flex items-center gap-2">
      <form
        action={async (formData) => {
          console.log('update quantity');
          dispatch({
            type: 'UPDATE_QUANTITY',
            itemId: item.id,
            quantity: item.quantity - 1,
          });
        }}
      >
        <Button size="sm" type="submit">
          -
        </Button>
      </form>
      <span>{item.quantity}</span>
      <form
        action={async (formData) => {
          dispatch({
            type: 'UPDATE_QUANTITY',
            itemId: item.id,
            quantity: item.quantity + 1,
          });
        }}
      >
        <Button size="sm" type="submit">
          +
        </Button>
      </form>
    </div>
  );
};
