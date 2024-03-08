'use client';
import { Input } from '@/components/ui/input';
import { CartItem } from './page';
import { CartAction } from './CartItems';
import { updateItemQuantity } from '@/lib/server/services/cartService';
import { formatUSD } from './utils';

export const QuantitySelector = ({
  cartId,
  item,
  dispatch,
}: {
  cartId: string;
  item: CartItem;
  dispatch: (action: CartAction) => void;
}) => {
  return (
    <form
      action={async (formData) => {
        const newQuantity =
          parseInt(formData.get('quantity') as string, 10) || 0;

        dispatch({
          type: 'UPDATE_QUANTITY',
          itemId: item.id,
          quantity: newQuantity,
        });

        await updateItemQuantity(cartId, item.id, newQuantity);
      }}
    >
      <span className="flex items-center gap-1 font-light">
        <Input
          type="number"
          value={item.quantity}
          className="w-16"
          name="quantity"
          min="0"
          max="99"
        />
        &times; {formatUSD(item.price)}
      </span>
    </form>
  );
};

const increment = (quantity: number) => quantity + 1;
const decrement = (quantity: number) => Math.max(0, quantity - 1);
