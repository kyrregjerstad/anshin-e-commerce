'use client';
import { Product } from '@/lib/server/services/productService';
import {
  handleAddToWishlist,
  handleRemoveFromWishlist,
} from '@/lib/server/services/wishlistService';
import { Heart } from 'lucide-react';
import { Button } from './ui/button';

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
        <Heart />
        <span className="sr-only">Add to Wishlist</span>
      </Button>
    </form>
  );
};
