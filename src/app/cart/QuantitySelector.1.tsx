'use client';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { updateItemQuantity } from '@/lib/server/services/cartService';

import { CartItem } from './page';
import { formatUSD } from './utils';

export const QuantitySelector = ({
  cartId,
  item,
}: {
  cartId: string;
  item: CartItem;
}) => {
  return (
    <form
      action={async (formData) => {
        const newQuantity =
          parseInt(formData.get('quantity') as string, 10) || 0;

        await updateItemQuantity(cartId, item.id, newQuantity);
      }}
    >
      <span className="flex items-center gap-1 font-light">
        <div>
          <Label className="sr-only text-base" htmlFor="quantity">
            Quantity
          </Label>
          <div className="flex items-center justify-center gap-2">
            <Select defaultValue={`${item.quantity}`} name="quantity">
              <SelectTrigger className="w-16">
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                {[...Array(10).keys()].map((i) => (
                  <SelectItem key={i} value={`${i + 1}`}>
                    {i + 1}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </span>
    </form>
  );
};

const increment = (quantity: number) => quantity + 1;
const decrement = (quantity: number) => Math.max(0, quantity - 1);
