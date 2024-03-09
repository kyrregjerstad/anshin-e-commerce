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

import { useRef } from 'react';
import { CartItem } from './page';

export const QuantitySelector = ({
  cartId,
  item,
}: {
  cartId: string;
  item: CartItem;
}) => {
  const formRef = useRef<HTMLFormElement>(null);

  const handleChange = () => {
    formRef.current?.requestSubmit();
  };

  return (
    <form
      ref={formRef}
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
            <Select
              defaultValue={`${item.quantity}`}
              name="quantity"
              onValueChange={handleChange}
            >
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
