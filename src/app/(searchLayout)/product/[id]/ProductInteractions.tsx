import { handleAddToCart } from '@/lib/server/services/cartService';
import {
  handleAddToWishlist,
  handleRemoveFromWishlist,
} from '@/lib/server/services/wishlistService';

import { SimpleForm } from '@/components/SimpleForm';
import { HeartIcon as HeartIconOutline } from '@heroicons/react/24/outline';
import { HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid';
import { QuantitySelect } from './QuantitySelect';

export const ProductInteractions = ({
  id,
  price,
  discountPrice,
  inCart,
  inWishlist,
}: {
  id: string;
  price: number;
  discountPrice: number;
  inCart: boolean;
  inWishlist: boolean;
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
    if (!inWishlist) {
      await handleAddToWishlist(id, `/product/${id}`);
    } else {
      await handleRemoveFromWishlist(id);
    }
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
            {inWishlist ? (
              <>
                <HeartIconSolid className="mr-2 h-4 w-4" />
                Remove From Wishlist
              </>
            ) : (
              <>
                <HeartIconOutline className="mr-2 h-4 w-4" />
                Add To Wishlist
              </>
            )}
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
