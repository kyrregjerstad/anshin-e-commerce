'use client';
import { Product } from '@/lib/server/services/productService';
import {
  handleAddToWishlist,
  handleRemoveFromWishlist,
} from '@/lib/server/services/wishlistService';

import { Button } from './ui/button';
import { HeartIcon as HearIconOutline } from '@heroicons/react/24/outline';
import { HeartIcon as HearIconFilled } from '@heroicons/react/24/solid';

type Props = {
  product: Product;
  inWishlist: boolean;
} & React.ComponentPropsWithoutRef<'form'>;

export const AddToWishlistIconButton = ({
  product,
  inWishlist,
  ...props
}: Props) => {
  return (
    <form
      action={async () => {
        if (inWishlist) {
          await handleRemoveFromWishlist(product.id);
        } else {
          await handleAddToWishlist(product.id);
        }
      }}
      {...props}
    >
      <Button variant="ghost" size="icon">
        {inWishlist ? (
          <HearIconFilled className="size-7 fill-tea-100 stroke-neutral-300" />
        ) : (
          <HearIconOutline className="size-7" />
        )}

        <span className="sr-only">Add to Wishlist</span>
      </Button>
    </form>
  );
};
