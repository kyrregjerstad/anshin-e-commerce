import { handleAddToCart } from '@/lib/server/services/cartService';
import { handleAddToWishlist } from '@/lib/server/services/wishlistService';
import { HeartIcon } from 'lucide-react';

import { QuantitySelect } from './QuantitySelect';
import { SimpleForm } from './SimpleForm';

export const ProductInteractions = ({
  id,
  price,
  inCart,
}: {
  id: string;
  price: number;
  inCart: boolean;
}) => {
  const addToCartAction = async (formData: FormData) => {
    'use server';
    const quantity = parseInt(formData.get('quantity') as string, 10) || 1;
    await handleAddToCart({
      productId: id,
      quantity,
    });
  };

  const addToWishlistAction = async () => {
    'use server';
    await handleAddToWishlist({ productId: id });
  };

  return (
    <div className="flex flex-col gap-2">
      <SimpleForm
        action={addToCartAction}
        render={({ SubmitButton }) => (
          <div className="flex flex-col gap-4">
            <div className="flex items-end gap-4">
              <QuantitySelect />
              <div className="text-2xl font-bold">${price}</div>
            </div>
            <SubmitButton size="lg">
              {inCart ? 'Update Cart' : 'Add to Cart'}
            </SubmitButton>
          </div>
        )}
      />
      <SimpleForm
        action={addToWishlistAction}
        render={({ SubmitButton }) => (
          <SubmitButton size="lg" variant="outline" className="w-full">
            <HeartIcon className="mr-2 h-4 w-4" />
            Add To Wishlist
          </SubmitButton>
        )}
      />
    </div>
  );
};
