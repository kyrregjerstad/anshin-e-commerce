'use client';
import { Button } from '@/components/ui/button';
import { CartItem, updateItemQuantity } from '@/lib/server/cartService';
import { CartAction } from './CartItems';

export const QuantitySelector = ({
  item,
  dispatch,
}: {
  item: CartItem;
  dispatch: (action: CartAction) => void;
}) => {
  return (
    <div className="flex items-center gap-2">
      <form
        action={async () => {
          const newQuantity = decrement(item.quantity);

          dispatch({
            type: 'UPDATE_QUANTITY',
            itemId: item.id,
            quantity: newQuantity,
          });

          await updateItemQuantity(item.id, newQuantity);
        }}
      >
        <Button size="sm" type="submit">
          -
        </Button>
      </form>
      <span>{item.quantity}</span>
      <form
        action={async () => {
          const newQuantity = increment(item.quantity);

          dispatch({
            type: 'UPDATE_QUANTITY',
            itemId: item.id,
            quantity: newQuantity,
          });

          await updateItemQuantity(item.id, newQuantity);
        }}
      >
        <Button size="sm" type="submit">
          +
        </Button>
      </form>
    </div>
  );
};

const increment = (quantity: number) => quantity + 1;
const decrement = (quantity: number) => Math.max(0, quantity - 1);
