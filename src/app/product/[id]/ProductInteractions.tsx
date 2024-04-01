import { handleAddToCart } from '@/lib/server/services/cartService';
import { handleAddToWishlist } from '@/lib/server/services/wishlistService';
import { HeartIcon } from 'lucide-react';

import { QuantitySelect } from './QuantitySelect';
import { SimpleForm } from '@/components/SimpleForm';

export const ProductInteractions = ({
  id,
  price,
  discountPrice,
  inCart,
}: {
  id: string;
  price: number;
  discountPrice: number;
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
    await handleAddToWishlist(id);
  };

  const onSale = discountPrice < price;

  return (
    <div className="flex flex-col gap-2">
      <SimpleForm
        action={addToCartAction}
        render={({ SubmitButton }) => (
          <div className="flex flex-col gap-4">
            <div className="flex items-end justify-between gap-4">
              <QuantitySelect />
              {onSale ? (
                <div>
                  <div className="text-end text-sm font-bold">
                    Save {calculateDiscount(price, discountPrice)}%
                  </div>

                  <div className="text-end text-lg font-bold text-gray-500 line-through">
                    ${price}
                  </div>
                  <div className="text-2xl font-bold">${discountPrice}</div>
                </div>
              ) : (
                <div className="text-2xl font-bold">${price}</div>
              )}
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

const calculateDiscount = (price: number, discountPrice: number) => {
  const difference = price - discountPrice;
  return Math.round((difference / price) * 100);
};
