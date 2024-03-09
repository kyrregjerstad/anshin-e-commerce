'use client';

import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { HeartIcon } from 'lucide-react';
import { addItemToCart } from '@/lib/server/services/cartService';
import { useCartStore } from '@/lib/stores/useCartStore';
import { useFormStatus } from 'react-dom';

export const ProductInteractions = ({
  id,
  price,
  inCart,
}: {
  id: string;
  price: number;
  inCart: boolean;
}) => {
  const { addItem } = useCartStore();

  return (
    <form
      className="grid gap-4 md:gap-10"
      action={async (formData) => {
        const quantity = parseInt(formData.get('quantity') as string, 10) || 1;
        addItem({
          id,
          quantity,
        });
        await addItemToCart({
          productId: id,
          quantity,
        });
      }}
    >
      <FormContent price={price} inCart={inCart} />
    </form>
  );
};

const FormContent = ({ price, inCart }: { price: number; inCart: boolean }) => {
  const { pending } = useFormStatus();

  return (
    <>
      <div className="flex flex-col gap-4">
        <div className="flex items-end gap-4">
          <div>
            <Label className="text-base" htmlFor="quantity">
              Quantity
            </Label>
            <Select defaultValue="1" name="quantity">
              <SelectTrigger className="w-24">
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">1</SelectItem>
                <SelectItem value="2">2</SelectItem>
                <SelectItem value="3">3</SelectItem>
                <SelectItem value="4">4</SelectItem>
                <SelectItem value="5">5</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="text-4xl font-bold">${price}</div>
        </div>
        <div className="flex flex-col gap-2 min-[400px]:flex-row">
          <Button size="lg" type="submit" disabled={pending}>
            {inCart ? 'Update Cart' : 'Add to Cart'}
          </Button>
          <Button size="lg" variant="outline">
            <HeartIcon className="mr-2 h-4 w-4" />
            Add to wishlist
          </Button>
        </div>
      </div>
    </>
  );
};
